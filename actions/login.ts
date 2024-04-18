"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

import * as z from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.token,
      verificationToken.email
    );
    return { message: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!existingToken) {
        return {
          error: "Invalid Code!",
        };
      }

      if (existingToken.token !== code) {
        return { error: "Invalid Code!" };
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code has expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: existingToken.id },
      });

      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (!twoFactorConfirmation) {
        await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
          },
        });
      }
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenByEmail(
        twoFactorToken.token,
        twoFactorToken.email
      );

      return { twoFactor: true };
    }
  }

  //login using next auth - credentials provider
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        /** for v5 beta 1.5 */
        case "AccessDenied":
          return { error: "Need to verify email!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
