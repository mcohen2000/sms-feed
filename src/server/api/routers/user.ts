import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "bcrypt";
import twilio from "twilio";

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
      const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      twilioClient.messages.create({
        body: `Welcome to the T3 SMS Feed!\nReply with "STOP" to unsubscribe.`,
        to: input.phone,
        messagingServiceSid: process.env.TWILIO_SERVICE_SID,
      }).then( message => console.log(message))
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
      TO_CHAR("createdAt", 'MM-YYYY') AS monthYear,
      COUNT(*)::numeric AS signUpsCount
    FROM
      public."Subscriber"
    GROUP BY
      monthYear
    ORDER BY
      monthYear ASC;`;
  }),
});
