import { Resend } from "resend";

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ""));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return res.status(500).json({ success: false, message: "Config serveur manquante" });
  }

  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const message = String(req.body?.message || "").trim();
  const honey = String(req.body?._honey || "").trim();

  if (honey) return res.status(200).json({ success: true, message: "OK" });

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ success: false, message: "Email invalide" });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: "Portfolio - " + (subject || "Nouveau message"),
      text:
        "Nouveau message depuis le portfolio.\n\n" +
        `Nom: ${name}\n` +
        `Email: ${email}\n` +
        (subject ? `Objet: ${subject}\n` : "") +
        "\nMessage:\n" +
        message
    });

    return res.status(200).json({ success: true, message: "Message envoyé avec succès !" });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Erreur lors de l'envoi" });
  }
}


