"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const Reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Credential!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser || !existingUser.email) {
    return { error: "User does not exist!" };
  }

  //Todo : Generate token & send password reset email
  const passwordResetToken = await generatePasswordResetToken(
    existingUser.email
  );

  await sendPasswordResetEmail(
    passwordResetToken.token,
    passwordResetToken.email
  );

  return { success: "Send Password Reset!" };
};
