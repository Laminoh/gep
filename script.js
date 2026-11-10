"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      navigation.classList.remove("is-open");
    }
  });
}

const yearLabel = document.querySelector("[data-current-year]");
if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function connectWhatsAppForm(formId, errorId, buildMessage) {
  const form = document.getElementById(formId);
  const error = document.getElementById(errorId);
  if (!(form instanceof HTMLFormElement) || !(error instanceof HTMLElement)) return;

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
      event.target.removeAttribute("aria-invalid");
      error.textContent = "";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidField = form.querySelector(":invalid");
    if (invalidField instanceof HTMLElement) {
      invalidField.setAttribute("aria-invalid", "true");
      error.textContent = "Veuillez vérifier les champs obligatoires avant de continuer.";
      invalidField.focus();
      form.reportValidity();
      return;
    }

    const values = Object.fromEntries(new FormData(form).entries());
    const message = buildMessage(values);
    const whatsappUrl = `https://wa.me/221784889939?text=${encodeURIComponent(message)}`;
    const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!openedWindow) {
      error.textContent = "WhatsApp n’a pas pu s’ouvrir automatiquement. Vérifiez le blocage des fenêtres puis réessayez.";
      return;
    }
    error.textContent = "";
  });
}

connectWhatsAppForm("enrollment-form", "enrollment-error", (values) => [
  "Bonjour G.E.P., je souhaite faire une demande d’inscription.",
  "",
  "ÉLÈVE",
  `Nom et prénom : ${values.studentName}`,
  `Classe : ${values.classLevel}`,
  `Série : ${values.series || "Non précisée"}`,
  `Établissement : ${values.school}`,
  `Matières souhaitées : ${values.subjects}`,
  "",
  "PARENT / TUTEUR",
  `Nom : ${values.parentName}`,
  `Téléphone : ${values.parentPhone}`,
  `Type de cours : ${values.courseType}`,
  `Quartier : ${values.district}`
].join("\n"));

connectWhatsAppForm("contact-form", "contact-error", (values) => [
  "Bonjour G.E.P., je souhaite vous contacter.",
  "",
  `Nom : ${values.contactName}`,
  `Téléphone : ${values.contactPhone}`,
  `Message : ${values.contactMessage}`
].join("\n"));
