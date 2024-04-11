"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  if (mode === "modal") {
    return <span className="cursor-pointer">ToDo: implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
