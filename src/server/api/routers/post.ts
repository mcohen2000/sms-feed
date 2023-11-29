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
    getAll: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        sentTo: true
      }
    });
  }),
    update: protectedProcedure.input(z.object({
      id: z.string().min(1),
      name: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ctx.db.post.update({where:{ id: input.id}, data: {
      name: input.name
    }})
  }),
    delete: protectedProcedure.input(z.object({id: z.string().min(1)})).mutation(async ({ ctx, input }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ctx.db.post.delete({where:{ id: input.id}})
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
