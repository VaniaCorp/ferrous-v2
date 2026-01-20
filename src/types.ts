export type MailListTypes = {
  email: string;
  name: string;
  // category: "WAITLIST" | "PARTNERSHIP";
  company_name: string;
  message: string;
}

export type WaitlistType = Pick<MailListTypes, "email">;
