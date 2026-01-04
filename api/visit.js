import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return res.status(500).json({ ok: false, error: "Missing env" });
  }

  const page = (req.body && req.body.page) ? String(req.body.page) : "";

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to,
      subject: "Portfolio - Nouvelle visite",
      text:
        "Une personne a ouvert ton portfolio.\n\n" +
        (page ? `Page: ${page}\n` : "") +
        `Date: ${new Date().toISOString()}\n`
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}


