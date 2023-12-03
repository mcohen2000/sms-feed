import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const exists = await ctx.db.user.findFirst({
        where: { email: input.email },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email is already registered to a user.",
        });
      }
      const hashedPassword = await hash(input.password, 10);

      return ctx.db.user.create({
        data: {
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          password: hashedPassword,
        },
      });
    }),
  subscribe: publicProcedure
    .input(
      z.object({
        phone: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const exists = await ctx.db.subscriber.findFirst({
        where: { phone: input.phone },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This number is already registered to a user.",
        });
      }
      return ctx.db.subscriber.create({
        data: {
          phone: input.phone,
        },
      });
    }),
  subscriberCount: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ctx.db.subscriber.count();
  }),
  subscriberMonthlyCount: protectedProcedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ctx.db.$queryRaw`SELECT 
      DATE_TRUNC('month', "createdAt") AS month,
      COUNT(*) AS signUpsCount
    FROM
      public."Subscriber"
    GROUP BY
      month
    ORDER BY
      month ASC;`;
  }),
});
