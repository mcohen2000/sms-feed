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
  count: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        sent: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.sent === "false") {
        return ctx.db.post.count({
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            OutboundWebhook: {
              none: {},
            },
          },
        });
      }
      if (input.sent === "true") {
        return ctx.db.post.count({
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            OutboundWebhook: {
              some: {},
            },
          },
        });
      }
      return ctx.db.post.count({
        where: {
          text: {
            contains: input.search || "",
            mode: "insensitive",
          },
        },
      });
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
          skip: 5 * (parseInt(input.page) - 1) || 0,
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            OutboundWebhook: true,
          },
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            OutboundWebhook: {
              none: {},
            },
          },
        });
      }
      if (input.sent === "true") {
        return ctx.db.post.findMany({
          skip: 5 * (parseInt(input.page) - 1) || 0,
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            OutboundWebhook: true,
          },
          where: {
            text: {
              contains: input.search || "",
              mode: "insensitive",
            },
            OutboundWebhook: {
              some: {},
            },
          },
        });
      }
      return ctx.db.post.findMany({
        skip: 5 * (parseInt(input.page) - 1) || 0,
        take: 5,
        orderBy: { createdAt: "desc" },
        where: {
          text: {
            contains: input.search || "",
            mode: "insensitive",
          },
        },
        include: {
          OutboundWebhook: true,
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
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        include: { OutboundWebhook: true },
      });
      if (post && post.text) {
        if (input.schedule) {
          if (Date.parse(input.schedule) - Date.now() < 15 * 60 * 1000) {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "Scheduled time is less than 15 minutes from current time.",
            });
          }
          if (
            Date.parse(input.schedule) - Date.now() >
            7 * 24 * 60 * 60 * 1000
          ) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Scheduled date is more than 7 days from current date.",
            });
          }
        }

        const twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
        );
        const subscribers = await ctx.db.subscriber.findMany({
          include: { OutboundWebhook: true },
        });
        subscribers.forEach((person) => {
          twilioClient.messages
            .create(
              input.schedule
                ? {
                    body: `${post.text}`,
                    to: person.phone,
                    sendAt: new Date(input.schedule),
                    scheduleType: "fixed",
                    messagingServiceSid: process.env.TWILIO_SERVICE_SID,
                  }
                : {
                    body: `${post.text}`,
                    to: person.phone,
                    messagingServiceSid: process.env.TWILIO_SERVICE_SID,
                  },
            )
            .then(async (message) => {
              // if(message.status === "accepted" || message.status === "scheduled"){
              const outboundWebhook = await ctx.db.outboundWebhook.create({
                include: {
                  post: true,
                  subscriber: true,
                },
                data: {
                  apiVersion: message.apiVersion,
                  smsSid: message.sid,
                  smsStatus: message.status,
                  to: message.to,
                  from: message.from,
                  subscriber: { connect: { id: person.id } },
                  post: { connect: { id: post.id } },
                },
              });
              await ctx.db.subscriber.update({
                where: { id: person.id },
                include: { OutboundWebhook: true },
                data: {
                  OutboundWebhook: { connect: { id: outboundWebhook.id } },
                },
              });
              await ctx.db.post.update({
                where: { id: post.id },
                include: { OutboundWebhook: true },
                data: {
                  OutboundWebhook: { connect: { id: outboundWebhook.id } },
                },
              });
              // }
            });
        });
        return subscribers.length;
      }
    }),
  updateOutboundWebhook: publicProcedure
    .input(
      z.object({
        smsSid: z.string().min(1),
        status: z.string(),
        from: z.string().nullable(),
        doneDate: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.outboundWebhook.findFirst({
        where: { smsSid: input.smsSid },
      });
      if (exists && exists.smsStatus !== "delivered") {
        return ctx.db.outboundWebhook.update({
          where: { id: exists.id },
          data: {
            smsStatus: input.status,
            from: input.from,
            rawDlrDoneDate: exists.rawDlrDoneDate ? null : input.doneDate,
          },
        });
      }
    }),
  handleInboundWebhook: publicProcedure
    .input(
      z.object({
        toCountry: z.string(),
        toState: z.string(),
        numMedia: z.number(),
        numSegments: z.number(),
        toCity: z.string(),
        fromZip: z.string(),
        smsSid: z.string().min(1),
        optOutType: z.string(),
        fromState: z.string(),
        status: z.string(),
        fromCity: z.string(),
        body: z.string(),
        to: z.string(),
        toZip: z.string(),
        from: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subscriber = await ctx.db.subscriber.findFirst({
        where: { phone: input.from },
      });
      console.log("SUBSCRIBER!!!!", subscriber)
      if (subscriber) {
        console.log("DB OPTOUT", subscriber.phone, subscriber.optedOut);
        console.log("SMS OPTOUT", input.optOutType)
        if (input.optOutType === "START" && subscriber.optedOut) {
          console.log("START OPT MSG")
          await ctx.db.subscriber.update({
            where: { phone: subscriber.phone },
            data: { optedOut: false },
          });
        }
        if (input.optOutType === "STOP" && !subscriber.optedOut) {
          console.log("STOP OPT MSG")
          await ctx.db.subscriber.update({
            where: { phone: subscriber.phone },
            data: { optedOut: true },
          });
        }
        return ctx.db.inboundWebhook.create({
          data: {
            from: input.from,
            toCountry: input.toCountry,
            toState: input.toState,
            numMedia: input.numMedia,
            toCity: input.toCity,
            fromZip: input.fromZip,
            smsSid: input.smsSid,
            optOutType: input.optOutType,
            fromState: input.fromState,
            smsStatus: input.status,
            fromCity: input.fromCity,
            body: input.body,
            to: input.to,
            toZip: input.toZip,
            numSegments: input.numSegments,
            Subscriber: { connect: { id: subscriber.id } },
          },
        });
      }
    }),
});
