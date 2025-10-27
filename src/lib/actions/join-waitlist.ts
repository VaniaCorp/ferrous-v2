"use client";

import { postData } from "@/config/api";
import { WaitlistType } from "@/types";

export type JoinWaitlistActionState = {
  success: boolean;
  message?: string;
};

// Form actions must accept (prevState, formData)
export async function joinWaitlistAction(
  _prevState: JoinWaitlistActionState,
  formData: FormData
): Promise<JoinWaitlistActionState> {
  const email = formData.get("email") as string;

  const payload: WaitlistType = {
    category: "WAITLIST",
    email,
  };

  try {
    // Post to your API (users/maillist)
    const response = await postData<{ message?: string }>("users/maillist", payload);
    return { success: true, message: response?.message };
  } catch (error) {
    let message = "Something went wrong. Please try again.";

    // Our api layer throws { response, data }
    const err = error as { data?: unknown; message?: string };
    if (err?.data) {
      if (typeof err.data === "string") message = err.data;
      else if (
        typeof (err.data) === "object" &&
        err.data !== null &&
        "message" in err.data &&
        typeof (err.data as { message: unknown }).message === "string"
      ) {
        message = (err.data as { message: string }).message;
      }
    } else if (typeof err?.message === "string") {
      message = err.message;
    }

    return { success: false, message };
  }
}
