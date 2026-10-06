// EmailJS, called over its REST API. The IDs are NEXT_PUBLIC_ because the
// contact form sends from the browser; the template lives in
// `emailjs/contact-template.html`. Next inlines these at build time, so they
// must be referenced by their full names.
const EMAILJS = {
  service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

type TemplateParams = { name: string; email: string; topic: string; order: string; message: string };

/**
 * Sends one email through the contact template (to the shop's inbox). Server
 * calls need "Allow EmailJS API for non-browser applications" in the EmailJS
 * dashboard; pass the private key as `accessToken` if one is configured.
 */
export async function sendEmailJs(params: TemplateParams, accessToken?: string) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...EMAILJS, accessToken, template_params: params }),
  });
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`);
}

/** Server-only: tells the shop about a new registration or subscriber. Never throws. */
export async function notifyOwner(topic: "New registration" | "New subscriber", email: string, name?: string) {
  try {
    await sendEmailJs(
      {
        topic,
        email,
        name: name || email,
        order: "—",
        message:
          topic === "New registration"
            ? `${email} just created an account.`
            : `${email} subscribed to the newsletter from the homepage.`,
      },
      process.env.EMAILJS_PRIVATE_KEY || undefined,
    );
  } catch (error) {
    console.error("Owner notification failed", error);
  }
}
