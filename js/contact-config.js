// Configuration contact (sans serveur)
// EmailJS (optionnel) : renseigne les 3 valeurs ci-dessous + ajoute le script EmailJS si tu l'utilises.
// FormSubmit (par défaut) : fonctionne sur n'importe quel hébergement statique, les messages arrivent sur ton email.
window.CONTACT_CONFIG = {
  emailTo: "sihamalilou89@gmail.com",
  api: {
    contactPath: "/api/contact",
    visitPath: "/api/visit",
    visitOncePerHours: 12
  },
  emailjs: {
    publicKey: "",
    serviceId: "",
    templateId: ""
  },
  formsubmit: {
    enabled: true
  }
};


