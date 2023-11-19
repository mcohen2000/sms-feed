import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "bcrypt";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      first_name: z.string().min(1), 
      last_name: z.string().min(1), 
      email: z.string().min(1), 
      password: z.string().min(1), 
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const exists = await ctx.db.user.findFirst({
        where: { email: input.email }
      });
      if(exists){
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email is already registered to a user."
        })
      }
      const hashedPassword = await hash(input.password, 10)

      return ctx.db.user.create({
        data: {
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          password: hashedPassword,
        },
      });
    }),
});
