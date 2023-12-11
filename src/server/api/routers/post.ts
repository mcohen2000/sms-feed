import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import twilio from "twilio";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1).max(1530) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.create({
        data: {
          text: input.text,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
    count: protectedProcedure.input(z.object({
      search: z.string(),
      sent: z.string(),
    })).query(async ({ctx, input}) => {
      if(input.sent === "false"){

        return ctx.db.post.count({
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            sentTo: {
              none: {},
            },
          }
        })
      }
      if(input.sent === "true"){

        return ctx.db.post.count({
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            sentTo: {
              some: {},
            },
          }
        })
      }
      return ctx.db.post.count({
        where: {
          text: {
            contains: input.search || "",
            mode: "insensitive",
          },
        }
      })
  }),
  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        sent: z.string(),
        page: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (input.sent === "false") {
        return ctx.db.post.findMany({
          skip: 5*(parseInt(input.page)-1) || 0,
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            sentTo: true,
          },
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            sentTo: {
              none: {},
            },
          },
        });
      }
      if (input.sent === "true") {
        return ctx.db.post.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            sentTo: true,
          },
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            sentTo: {
              some: {},
            },
          },
        });
      }
      return ctx.db.post.findMany({
        skip: (5*(parseInt(input.page)-1)) || 0,
        take: 5,
        orderBy: { createdAt: "desc" },
        where: {
          text: {
            contains: input.search || "",
            mode: "insensitive",
          },
        },
        include: {
          sentTo: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          text: input.text,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.delete({ where: { id: input.id } });
    }),
  send: protectedProcedure
    .input(z.object({ id: z.string().min(1), schedule: z.string() }))
    .mutation(async ({ctx, input}) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        include: { sentTo: true }
      });
      if (post && post.text){
        if (input.schedule){
          if(Date.parse(input.schedule) - Date.now() < 15*60*1000){
            throw new TRPCError({
              code: "CONFLICT",
              message: "Scheduled time is less than 15 minutes from current time.",
            });
          }
          if(Date.parse(input.schedule) - Date.now() > 7*24*60*60*1000){
            throw new TRPCError({
              code: "CONFLICT",
              message: "Scheduled date is more than 7 days from current date.",
            });
          }
        }

        const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const subscribers = await ctx.db.subscriber.findMany({ include: { recieved: true }});
        subscribers.forEach(person => {
          twilioClient.messages.create(input.schedule ? {
            body: `${post.text}`,
            to: person.phone,
            sendAt: new Date(input.schedule),
            scheduleType: "fixed",
            messagingServiceSid: process.env.TWILIO_SERVICE_SID,
          }: {
            body: `${post.text}`,
            to: person.phone,
            messagingServiceSid: process.env.TWILIO_SERVICE_SID,
          }).then( async (message) => {
            if(message.status === "accepted" || message.status === "scheduled"){
              await ctx.db.subscriber.update({ 
                where: {id: person.id},
                include: { recieved: true },
                data: {
                  recieved: {connect: {id: post.id}}
                }
              })
              await ctx.db.post.update({ 
                where: {id: post.id},
                include: { sentTo: true },
                data: {
                  sentTo: {connect: {id: person.id}}
                }
              })
            }
          })
          
        })
        return subscribers.length
      }

    }),
  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
