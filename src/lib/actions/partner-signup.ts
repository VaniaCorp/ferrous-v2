"use client";

import { postData } from "@/config/api";
import { MailListTypes } from "@/types";

export type PartnerSignupActionState = {
  success: boolean;
  message?: string;
};

export async function partnerSignupAction(
  _prevState: PartnerSignupActionState,
  formData: FormData
): Promise<PartnerSignupActionState> {
  const name = (formData.get("fullname") as string) || "";
  const email = (formData.get("email") as string) || "";
  const company_name = (formData.get("company_name") as string) || "";
  const message = (formData.get("notes") as string) || "";

  const payload: MailListTypes = {
    name,
    email,
    company_name,
    message,
    // category: "PARTNERSHIP",
  };

  try {
    const response = await postData<{ message?: string }>("inquiries/partnership", payload);
    return { success: true, message: response?.message };
  } catch (error) {
    let message = "Something went wrong. Please try again.";

    const err = error as { data?: unknown; message?: string };
    if (err?.data) {
      if (typeof err.data === "string") {
        message = err.data;
      } else if (
        typeof err.data === "object" &&
        err.data !== null &&
        ("message" in err.data || "error" in err.data)
      ) {
        const errorData = err.data as { message?: unknown; error?: unknown };
        const parts = [
          typeof errorData.error === "string" ? errorData.error : null,
        ].filter(Boolean) as string[];
        if (parts.length > 0) {
          message = parts.join(": ");
        }
      }
    } else if (typeof err?.message === "string") {
      message = err.message;
    }

    return { success: false, message };
  }
}


