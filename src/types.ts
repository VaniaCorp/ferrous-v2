export type MailListTypes = {
  email: string;
  fullname: string;
  category: "WAITLIST" | "PARTNERSHIP";
  company_name: string;
  notes: string;
}

export type WaitlistType = Pick<MailListTypes, "email" | "category">;
