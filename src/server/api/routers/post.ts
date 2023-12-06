import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(160) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.create({
        data: {
          name: input.name,
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
            name: {
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
            name: {
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
          name: {
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
            name: {
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
            name: {
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
          name: {
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
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.name,
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
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ctx, input}) => {
      const post = ctx.db.post.findFirst({
        where: { id: input.id },
      });
      return post

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
