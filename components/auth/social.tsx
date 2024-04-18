"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useCallback } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const signInProvider = useCallback(
    (provider: "google" | "github") => {
      signIn(provider, {
        callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      });
    },
    [callbackUrl]
  );

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => signInProvider("google")}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => signInProvider("github")}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Social;
