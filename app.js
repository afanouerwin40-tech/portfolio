// =============================================
// 1. INITIALISATION EMAILJS
// =============================================

// Fonction auto-exécutée qui s'exécute immédiatement
(function () {
  // Initialise EmailJS avec la clé publique
  // Cette clé permet d'utiliser les services EmailJS pour envoyer des emails
  // NPTTZpxvjTvMm7h_5 est la clé d'identification du compte
  emailjs.init("NPTTZpxvjTvMm7h_5");
})();

/**
 * =============================================
 *  MENU BURGER (Navigation mobile)
 * =============================================
 */

// Écoute l'événement DOMContentLoaded qui se déclenche quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne le bouton du menu burger (les 3 barres)
  const menuToggle = document.querySelector(".menu-toggle");
  // Sélectionne la navigation principale
  const mainNav = document.querySelector(".main-nav");
  // Sélectionne tous les liens de navigation
  const navLinks = document.querySelectorAll(".nav-link");

  // Vérifie que le menuToggle et mainNav existent dans la page
  if (menuToggle && mainNav) {
    // Ajoute un écouteur de clic sur le bouton burger
    menuToggle.addEventListener("click", () => {
      // Inverse l'état du menu : s'il est ouvert on le ferme, et inversement
      // aria-expanded est un attribut d'accessibilité
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true" ? false : true;
      // Met à jour l'attribut d'accessibilité
      menuToggle.setAttribute("aria-expanded", expanded);
      // Active/désactive la classe 'active' qui affiche ou cache le menu
      mainNav.classList.toggle("active");
      // Bloque ou débloque le scroll de la page quand le menu est ouvert
      document.body.style.overflow = expanded ? "hidden" : "";
    });

    // Fermer le menu en cliquant sur un lien de navigation
    navLinks.forEach((link) => {
      // Pour chaque lien, ajoute un écouteur de clic
      link.addEventListener("click", () => {
        // Ferme le menu en passant aria-expanded à false
        menuToggle.setAttribute("aria-expanded", "false");
        // Enlève la classe active du menu
        mainNav.classList.remove("active");
        // Réactive le scroll de la page
        document.body.style.overflow = "";
      });
    });

    // Fermer le menu en cliquant à l'extérieur du menu/navbar
    document.addEventListener("click", (e) => {
      // Vérifie si le clic n'est pas sur un élément de la navbar ET que le menu est ouvert
      if (
        !e.target.closest(".navbar") &&
        mainNav.classList.contains("active")
      ) {
        // Alors on ferme le menu
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  /**
   * =============================================
   *  NAVIGATION ACTIVE AU SCROLL
   *  Met en surbrillance le lien de la section visible
   * =============================================
   */

  // Récupère toutes les sections qui ont un attribut id
  const sections = document.querySelectorAll("section[id]");
  // Récupère tous les liens de navigation
  const navLinksAll = document.querySelectorAll(".nav-link");

  // Ajoute un écouteur sur l'événement scroll de la fenêtre
  window.addEventListener("scroll", () => {
    // Variable pour stocker l'ID de la section actuellement visible
    let current = "";

    // Parcourt toutes les sections
    sections.forEach((section) => {
      // Récupère la position de la section (offsetTop) moins un décalage de 120px
      const top = section.offsetTop - 120;
      // Si la position de scroll dépasse la position de la section
      if (window.scrollY >= top) {
        // Alors on stocke l'ID de cette section
        current = section.getAttribute("id");
      }
    });

    // Parcourt tous les liens de navigation
    navLinksAll.forEach((link) => {
      // Enlève la classe 'active' de tous les liens
      link.classList.remove("active");
      // Si le href du lien correspond à l'ID de la section courante
      if (link.getAttribute("href") === "#" + current) {
        // Ajoute la classe 'active' pour le mettre en surbrillance
        link.classList.add("active");
      }
    });
  });

  /**
   * =============================================
   *  FORMULAIRES (contact + newsletter)
   * =============================================
   */

  // ===== FORMULAIRE DE CONTACT =====

  // Récupère le formulaire de contact par son ID
  const contactForm = document.getElementById("contactForm");
  // Vérifie si le formulaire existe
  if (contactForm) {
    // Ajoute un écouteur sur l'événement submit (envoi du formulaire)
    contactForm.addEventListener("submit", function (e) {
      // Empêche le rechargement de la page (comportement par défaut)
      e.preventDefault();

      // ===== VALIDATION DES CHAMPS =====

      // Récupère les valeurs des champs et supprime les espaces inutiles (trim)
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      // Variable pour savoir si tous les champs sont valides
      let valid = true;

      // Validation du nom : doit contenir au moins 2 caractères
      if (name.length < 2) {
        // Affiche un message d'erreur
        showError("name", "Le nom doit contenir au moins 2 caractères");
        // Marque comme invalide
        valid = false;
      } else {
        // Efface le message d'erreur si le champ est valide
        clearError("name");
      }

      // Validation de l'email avec une expression régulière
      // Vérifie le format : texte@texte.texte
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Veuillez entrer un email valide");
        valid = false;
      } else clearError("email");

      // Validation du sujet : au moins 5 caractères
      if (subject.length < 5) {
        showError("subject", "Le sujet doit contenir au moins 5 caractères");
        valid = false;
      } else clearError("subject");

      // Validation du message : au moins 10 caractères
      if (message.length < 10) {
        showError("message", "Le message doit contenir au moins 10 caractères");
        valid = false;
      } else clearError("message");

      // Si la validation échoue, on arrête l'exécution
      if (!valid) return;

      // ===== ENVOI VIA EMAILJS =====

      // Récupère le bouton d'envoi du formulaire
      const btn = contactForm.querySelector(".btn-submit");
      // Sauvegarde le texte original du bouton
      const originalText = btn.innerHTML;

      // Modifie le bouton pour montrer une animation de chargement
      btn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      // Désactive le bouton pour éviter les clics multiples
      btn.disabled = true;

      // Envoie l'email via EmailJS
      emailjs
        .send(
          "service_5e4spo9", // ID du service EmailJS
          "template_k8dg6wa", // ID du template d'email
          {
            from_name: name, // Nom de l'expéditeur
            from_email: email, // Email de l'expéditeur
            subject: subject, // Sujet
            message: message, // Message
          },
        )
        // Si l'envoi réussit
        .then(function () {
          // Restaure le bouton
          btn.innerHTML = originalText;
          btn.disabled = false;

          // Vide le formulaire
          contactForm.reset();
          // Affiche un message de succès
          showToast("Message envoyé avec succès !", "success");
        })
        // Si l'envoi échoue
        .catch(function (error) {
          // Restaure le bouton
          btn.innerHTML = originalText;
          btn.disabled = false;

          // Affiche un message d'erreur
          showToast("Erreur lors de l'envoi", "error");
          // Affiche l'erreur dans la console (pour le développeur)
          console.error("EmailJS Error:", error);
        });
    });
  }

  // ===== FORMULAIRE NEWSLETTER =====

  // Récupère le formulaire de newsletter par son ID
  const newsletterForm = document.getElementById("newsletterForm");
  // Vérifie si le formulaire existe
  if (newsletterForm) {
    // Ajoute un écouteur sur l'événement submit
    newsletterForm.addEventListener("submit", function (e) {
      // Empêche le rechargement de la page
      e.preventDefault();
      // Récupère l'input du formulaire
      const input = this.querySelector("input");
      // Vérifie si l'input n'est pas vide
      if (input.value.trim()) {
        // Affiche un message de confirmation
        showToast("Merci pour votre inscription !", "info");
        // Vide le champ
        input.value = "";
      }
    });
  }

  // ===== FONCTIONS UTILITAIRES =====

  // Fonction pour afficher un message d'erreur
  function showError(fieldId, message) {
    // Récupère l'élément d'erreur correspondant au champ
    const errorEl = document.getElementById(fieldId + "Error");
    // Si l'élément existe
    if (errorEl) {
      // Ajoute le message d'erreur
      errorEl.textContent = message;
      // Récupère l'input correspondant
      const input = document.getElementById(fieldId);
      // Si l'input existe, change la bordure en rouge
      if (input) input.style.borderColor = "#ff6b6b";
    }
  }

  // Fonction pour effacer un message d'erreur
  function clearError(fieldId) {
    // Récupère l'élément d'erreur correspondant au champ
    const errorEl = document.getElementById(fieldId + "Error");
    // Si l'élément existe
    if (errorEl) {
      // Vide le message d'erreur
      errorEl.textContent = "";
      // Récupère l'input correspondant
      const input = document.getElementById(fieldId);
      // Si l'input existe, remet la bordure par défaut
      if (input) input.style.borderColor = "";
    }
  }

  // Fonction pour afficher un toast (notification temporaire)
  function showToast(message, type = "info") {
    // Récupère l'élément toast
    const toast = document.getElementById("toast");
    // Si l'élément n'existe pas, on arrête
    if (!toast) return;

    // Définit les couleurs selon le type de message
    const colors = {
      success: "#4caf50", // Vert pour succès
      error: "#f44336", // Rouge pour erreur
      warning: "#ff9800", // Orange pour avertissement
      info: "#00d4ff", // Bleu pour information
    };

    // Ajoute le message dans le toast
    toast.textContent = message;
    // Change la couleur de bordure selon le type
    toast.style.borderColor = colors[type] || colors.info;
    // Affiche le toast en ajoutant la classe 'show'
    toast.classList.add("show");
    // Cache le toast après 5 secondes
    setTimeout(() => toast.classList.remove("show"), 5000);
  }

  // ===== FOOTER : ANNÉE DYNAMIQUE =====

  // Récupère l'élément qui contient l'année
  const yearSpan = document.getElementById("currentYear");
  // Si l'élément existe
  if (yearSpan) {
    // Remplace le contenu par l'année en cours
    yearSpan.textContent = new Date().getFullYear();
  }

  // Expose la fonction showToast globalement pour le débogage
  // Permet d'appeler showToast depuis la console du navigateur
  window.showToast = showToast;
});
