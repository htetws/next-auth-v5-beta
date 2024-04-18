import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenByEmail = async (
  token: string,
  email: string
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendVerificationEmail = async (token: string, email: string) => {
  const confirmLink = `https://next-auth-v5-beta-rh76aqe13-htetws-projects.vercel.app/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendPasswordResetEmail = async (token: string, email: string) => {
  const resetLink = `https://next-auth-v5-beta-rh76aqe13-htetws-projects.vercel.app/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};
