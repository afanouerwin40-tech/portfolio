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


/**
 * =============================================
 *  JAVASCRIPT POUR LES SECTIONS PROFIL, PROJETS, COMPÉTENCES
 *  
 *  Ce fichier gère :
 *  1. L'animation des barres de compétences (déclenchée au scroll)
 *  2. L'animation des compteurs de statistiques (Profil)
 *  3. Le filtre des projets par catégorie
 *  4. L'animation de révélation des cartes au scroll (Intersection Observer)
 *  5. Le bouton "Retour en haut"
 * =============================================
 */

document.addEventListener("DOMContentLoaded", function () {

    /**
     * =============================================
     *  1. INTERSECTION OBSERVER : RÉVÉLATION AU SCROLL
     *  
     *  L'IntersectionObserver surveille quand un élément
     *  entre dans la zone visible du navigateur (viewport).
     *  Dès qu'il est visible, on ajoute la classe "visible"
     *  qui déclenche l'animation CSS.
     * =============================================
     */

    /**
     * observeElements : fonction générique qui crée un observer
     * pour un groupe d'éléments sélectionnés
     * 
     * @param {string} selector - Sélecteur CSS des éléments à observer
     * @param {number} threshold - % de l'élément visible pour déclencher (0 à 1)
     */
    function observeElements(selector, threshold = 0.15) {
        // Récupère tous les éléments correspondant au sélecteur CSS
        const elements = document.querySelectorAll(selector);

        // Crée l'IntersectionObserver avec une callback
        const observer = new IntersectionObserver(
            // Callback appelée quand l'état d'un élément change (entre/sort du viewport)
            function (entries) {
                entries.forEach(function (entry) {
                    // Si l'élément est visible dans le viewport
                    if (entry.isIntersecting) {
                        // Ajoute la classe "visible" qui déclenche l'animation CSS (fadeInUp)
                        entry.target.classList.add("visible");
                        // On arrête d'observer cet élément : l'animation ne se joue qu'une fois
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                // threshold : 0.15 = l'animation se déclenche quand 15% de l'élément est visible
                threshold: threshold,
            }
        );

        // Lance l'observation de chaque élément trouvé
        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // --- Observe les cartes de projets ---
    // Déclenche l'animation quand les cartes .projet-card entrent dans le viewport
    observeElements(".projet-card", 0.1);

    // --- Observe les catégories de compétences ---
    // Déclenche l'animation sur les .competence-category (apparition en fadeInUp)
    observeElements(".competence-category", 0.1);


    /**
     * =============================================
     *  2. ANIMATION DES BARRES DE COMPÉTENCES
     *  
     *  Chaque barre (.skill-fill) a un attribut data-width qui
     *  indique le pourcentage cible (ex: data-width="85").
     *  Au moment où la catégorie parent devient visible (classe .visible),
     *  on anime la largeur de la barre de 0% à la valeur cible.
     * =============================================
     */

    // Crée un Observer dédié aux catégories de compétences
    const skillObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                // Vérifie si la catégorie est maintenant visible dans le viewport
                if (entry.isIntersecting) {
                    // Sélectionne toutes les barres de remplissage dans cette catégorie
                    const skillFills = entry.target.querySelectorAll(".skill-fill");

                    // Parcourt chaque barre de progression
                    skillFills.forEach(function (fill, index) {
                        // Lit la valeur cible depuis l'attribut data-width (ex: "85" pour 85%)
                        const targetWidth = fill.getAttribute("data-width");

                        // Délai progressif : chaque barre attend un peu plus que la précédente
                        // Cela crée un effet en cascade (la 1ère s'anime en premier, puis la 2ème, etc.)
                        // index * 150 : le 1er barre attend 0ms, la 2ème 150ms, la 3ème 300ms, etc.
                        setTimeout(function () {
                            // Change la largeur CSS de la barre : la transition CSS fera l'animation
                            fill.style.width = targetWidth + "%";
                        }, index * 150);
                    });

                    // Arrête d'observer cette catégorie : l'animation ne se joue qu'une fois
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        {
            // threshold 0.2 : l'animation se déclenche quand 20% de la catégorie est visible
            threshold: 0.2,
        }
    );

    // Observe toutes les catégories de compétences pour l'animation des barres
    document.querySelectorAll(".competence-category").forEach(function (category) {
        skillObserver.observe(category);
    });


    /**
     * =============================================
     *  3. ANIMATION DES COMPTEURS DE STATISTIQUES (PROFIL)
     *  
     *  Les éléments .profil-stat-number ont un attribut data-count
     *  (ex: data-count="20"). On anime le compteur de 0 au chiffre cible
     *  en interpolant la valeur à chaque frame avec requestAnimationFrame.
     * =============================================
     */

    /**
     * animateCounter : anime un compteur de 0 à la valeur cible
     * 
     * @param {HTMLElement} element - L'élément DOM dont on change le textContent
     * @param {number} target - La valeur finale à atteindre
     * @param {number} duration - Durée de l'animation en millisecondes
     */
    function animateCounter(element, target, duration) {
        // Timestamp de départ (fourni par requestAnimationFrame)
        let startTime = null;

        /**
         * step : fonction appelée à chaque frame par requestAnimationFrame (~60fps)
         * 
         * @param {number} currentTime - Le timestamp actuel (fourni automatiquement)
         */
        function step(currentTime) {
            // Initialise le timestamp de départ à la première frame
            if (!startTime) startTime = currentTime;

            // Calcule le temps écoulé depuis le début de l'animation
            const elapsed = currentTime - startTime;

            // Calcule la progression de 0 à 1 (clampé à 1 max)
            // Math.min : s'assure qu'on ne dépasse pas 1 (= 100% de progression)
            const progress = Math.min(elapsed / duration, 1);

            // Calcule la valeur actuelle du compteur selon la progression
            // Math.floor : arrondit vers le bas pour afficher des entiers propres
            const currentValue = Math.floor(progress * target);

            // Met à jour le texte de l'élément avec la valeur actuelle
            // Le "+" après le chiffre donne "20+", "15+", etc.
            element.textContent = currentValue + "+";

            // Si l'animation n'est pas terminée, demande une nouvelle frame
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Animation terminée : affiche la valeur finale exacte
                element.textContent = target + "+";
            }
        }

        // Lance la boucle d'animation
        requestAnimationFrame(step);
    }

    // Crée un Observer pour déclencher les compteurs quand la section profil est visible
    const statsObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                // Vérifie si les stats sont visibles
                if (entry.isIntersecting) {
                    // Récupère tous les éléments de statistiques
                    const statNumbers = entry.target.querySelectorAll(".profil-stat-number");

                    // Lance l'animation de compteur pour chaque stat
                    statNumbers.forEach(function (el) {
                        // Lit la valeur cible depuis l'attribut data-count
                        const target = parseInt(el.getAttribute("data-count"), 10);
                        // Lance l'animation (durée : 1800ms = 1.8 secondes)
                        animateCounter(el, target, 1800);
                    });

                    // N'anime qu'une seule fois
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.5, // L'animation se déclenche quand 50% des stats est visible
        }
    );

    // Observe le conteneur des statistiques de profil
    const profilStats = document.querySelector(".profil-stats");
    if (profilStats) {
        statsObserver.observe(profilStats);
    }


    /**
     * =============================================
     *  4. FILTRE DES PROJETS PAR CATÉGORIE
     *  
     *  Les boutons .filter-btn ont un attribut data-filter 
     *  (ex: data-filter="web" ou data-filter="all").
     *  Au clic, on compare ce filtre avec l'attribut data-category
     *  de chaque .projet-card et on affiche/cache les cartes.
     * =============================================
     */

    // Sélectionne tous les boutons de filtre
    const filterBtns = document.querySelectorAll(".filter-btn");
    // Sélectionne toutes les cartes de projets
    const projetCards = document.querySelectorAll(".projet-card");

    // Ajoute un écouteur de clic sur chaque bouton de filtre
    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {

            // === Gestion de l'état actif des boutons ===

            // Retire la classe "active" de tous les boutons
            filterBtns.forEach(function (b) {
                b.classList.remove("active");
            });
            // Ajoute "active" uniquement au bouton cliqué
            this.classList.add("active");

            // Lit le filtre du bouton cliqué (ex: "web", "mobile", "all")
            const filter = this.getAttribute("data-filter");

            // === Filtrage des cartes ===

            // Compteur pour les délais d'animation échelonnés
            let visibleIndex = 0;

            // Parcourt toutes les cartes de projets
            projetCards.forEach(function (card) {
                // Lit la catégorie de cette carte (ex: "web", "reseau")
                const cardCategory = card.getAttribute("data-category");

                // Détermine si cette carte doit être affichée
                // "all" : toutes les cartes visibles
                // sinon : seulement les cartes dont la catégorie correspond au filtre
                const shouldShow = filter === "all" || cardCategory === filter;

                if (shouldShow) {
                    // === Affiche la carte ===

                    // Retire la classe "hidden" pour la remettre dans le flux
                    card.classList.remove("hidden");

                    // Remet à 0 l'opacité et le décalage pour ré-animer l'apparition
                    card.style.opacity = "0";
                    card.style.transform = "translateY(20px)";

                    // Délai progressif : les cartes apparaissent en cascade
                    // visibleIndex * 80 : 0ms, 80ms, 160ms, 240ms, ...
                    setTimeout(function () {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                    }, visibleIndex * 80);

                    // Incrémente le compteur de cartes visibles
                    visibleIndex++;
                } else {
                    // === Cache la carte ===

                    // Transition de sortie : devient transparent puis s'enlève du flux
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    card.style.transition = "opacity 0.25s ease, transform 0.25s ease";

                    // Après la transition (250ms), ajoute "hidden" pour sortir du flux
                    setTimeout(function () {
                        card.classList.add("hidden");
                    }, 250);
                }
            });
        });
    });


    /**
     * =============================================
     *  5. BOUTON "RETOUR EN HAUT" (BACK TO TOP)
     *  
     *  Le bouton .back-top-btn apparaît quand l'utilisateur 
     *  a défilé de plus de 400px vers le bas.
     *  Il utilise la classe "visible" définie dans le CSS existant.
     * =============================================
     */

    // Récupère le bouton de retour en haut
    const backTopBtn = document.querySelector(".back-top-btn");

    // Si le bouton existe dans la page
    if (backTopBtn) {
        // Écoute l'événement scroll de la fenêtre
        window.addEventListener("scroll", function () {
            // Si la position verticale de scroll dépasse 400px
            if (window.scrollY > 400) {
                // Affiche le bouton en ajoutant la classe "visible"
                backTopBtn.classList.add("visible");
            } else {
                // Cache le bouton
                backTopBtn.classList.remove("visible");
            }
        });
    }


    /**
     * =============================================
     *  6. ANIMATION DE LA SECTION PROFIL AU CHARGEMENT
     *  
     *  Les éléments du profil apparaissent en séquence (en cascade)
     *  quand la section entre dans le viewport.
     * =============================================
     */

    // Sélectionne les éléments principaux du profil à animer en séquence
    const profilElements = [
        ".profil-image-frame",   // 1. L'image apparaît en premier
        ".profil-stats",          // 2. Les statistiques
        ".profil-greeting",       // 3. Le titre de bienvenue
        ".profil-role",           // 4. Le rôle professionnel
        ".profil-bio",            // 5. Les paragraphes de bio (tous)
        ".profil-details",        // 6. Les informations personnelles
        ".profil-actions",        // 7. Les boutons CTA en dernier
    ];

    // Crée un Observer pour la section profil
    const profilObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Anime chaque élément du profil avec un délai progressif
                    profilElements.forEach(function (selector, index) {
                        // Récupère tous les éléments correspondant au sélecteur
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(function (el) {
                            // Délai croissant : chaque groupe attend 100ms de plus
                            setTimeout(function () {
                                // Ajoute la classe d'animation CSS
                                el.classList.add("animate-in");
                                // Enlève l'opacité 0 initiale
                                el.style.opacity = "";
                            }, index * 100 + 100);
                        });
                    });

                    // Ne s'anime qu'une seule fois
                    profilObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe la section profil entière
    const profilSection = document.querySelector(".profil");
    if (profilSection) {
        profilObserver.observe(profilSection);

        // Initialise les éléments du profil à opacity 0 pour l'animation d'entrée
        profilElements.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.style.opacity = "0";
            });
        });
    }

}); // Fin du DOMContentLoaded