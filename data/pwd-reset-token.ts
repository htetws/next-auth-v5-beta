import { db } from "@/lib/db";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const token = await db.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });
    return token;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });
    return resetToken;
  } catch {
    return null;
  }
};
