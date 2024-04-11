"use client";

import { useCallback, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verifications";

import CardWrapper from "./card-wrapper";
import { BeatLoader } from "react-spinners";

import FormSuccess from "@/components/form-success";
import FormError from "@/components/form-error";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      return setError("Missing token!");
    }
    newVerification(token)
      .then((res) => {
        setSuccess(res.success);
        setError(res.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
