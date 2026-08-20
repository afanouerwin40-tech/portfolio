/* ================================================================
   ERWIN.DEV — PORTFOLIO
   app.js
   ================================================================ */

(function () {
  "use strict";

  /* ==============================================================
       ÉTAPE 0 — RÉGLAGES DE DÉPART
       ============================================================== */
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (window.emailjs) {
    emailjs.init("NPTTZpxvjTvMm7h_5");
  }

  /* ---------- Thème clair/sombre ----------
     Le thème initial est déjà appliqué avant même que ce script ne
     s'exécute (voir le petit <script> anti-flash dans le <head> de
     index.html) — ici on ne fait que brancher le bouton pour pouvoir
     en changer, et mémoriser le choix. ---------- */
  var CLE_THEME = "erwin-dev-theme";
  var boutonTheme = document.getElementById("themeToggle");
  var iconeTheme = document.getElementById("themeIcon");

  function mettreAJourIconeTheme() {
    if (!iconeTheme) return;
    var themeActuel =
      document.documentElement.getAttribute("data-theme") || "dark";
    iconeTheme.className = themeActuel === "light" ? "fas fa-sun" : "fas fa-moon";
  }

  function activerTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(CLE_THEME, theme);
    mettreAJourIconeTheme();
  }

  if (boutonTheme) {
    boutonTheme.addEventListener("click", function () {
      var themeActuel =
        document.documentElement.getAttribute("data-theme") || "dark";
      activerTheme(themeActuel === "dark" ? "light" : "dark");
    });
  }
  mettreAJourIconeTheme();

  /* ==============================================================
       ÉTAPE 1 — ÉCRAN DE CHARGEMENT (PRELOADER)
       ============================================================== */
  var preloader = document.getElementById("preloader");
  var preloaderBarFill = document.getElementById("preloaderBarFill");
  var preloaderStatus = document.getElementById("preloaderStatus");

  function gererPreloader() {
    if (!preloader) return;

    var messages = [
      
      "Initialisation du système...",
      "Connexion aux nœuds...",
      "Chargement des ressources...",
      "Presque prêt...",
    ];
    var progressionActuelle = 0;
    var indexMessage = 0;

    var intervalleProgression = setInterval(function () {
      if (progressionActuelle >= 90) return;
      progressionActuelle += Math.random() * 12;
      progressionActuelle = Math.min(progressionActuelle, 90);
      if (preloaderBarFill)
        preloaderBarFill.style.width = progressionActuelle + "%";

      var prochainIndex = Math.floor(
        (progressionActuelle / 90) * (messages.length - 1),
      );
      if (prochainIndex !== indexMessage) {
        indexMessage = prochainIndex;
        if (preloaderStatus)
          preloaderStatus.textContent = messages[indexMessage];
      }
    }, 180);

    window.addEventListener("load", function () {
      clearInterval(intervalleProgression);
      if (preloaderBarFill) preloaderBarFill.style.width = "100%";
      if (preloaderStatus) preloaderStatus.textContent = "Prêt.";

      setTimeout(
        function () {
          preloader.classList.add("is-hidden");
        },
        reduceMotion ? 0 : 350,
      );
    });
  }
  gererPreloader();

  /* ==============================================================
       ÉTAPE 2 — BARRE DE NAVIGATION
       ============================================================== */
  var navbar = document.getElementById("navbar");
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");

  function gererApparenceNavbar() {
    if (window.scrollY > 24) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", gererApparenceNavbar, { passive: true });
  gererApparenceNavbar();

  /* ==============================================================
       ÉTAPE 3 — MENU MOBILE
       ============================================================== */
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var estOuvert = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(estOuvert));
    });

    navLinks.forEach(function (lien) {
      lien.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==============================================================
       ÉTAPE 4 — BACKBONE
       ============================================================== */
  var backboneFill = document.getElementById("backboneFill");
  var nodeMarkers = document.querySelectorAll(".node-marker");
  var nodeLabels = document.querySelectorAll(".node-label");

  // Les points/étiquettes ne sont plus placés à des pourcentages fixes
  // dans le HTML : leur position verticale est calculée à partir de la
  // vraie position de chaque section (section.offsetTop), en proportion
  // de la hauteur réellement défilable de la page. Comme ça, le point
  // "actif" correspond TOUJOURS exactement à l'endroit où la barre de
  // progression arrive au même instant — même si le contenu d'une
  // section change de hauteur (ex : Projets, vide pour l'instant, ou
  // rempli plus tard depuis le dashboard admin).
  function positionnerNodes() {
    var doc = document.documentElement;
    var hauteurScrollable = doc.scrollHeight - doc.clientHeight;
    if (hauteurScrollable <= 0) return;

    sections.forEach(function (section) {
      var pourcentage = (section.offsetTop / hauteurScrollable) * 100;
      pourcentage = Math.max(0, Math.min(100, pourcentage));

      var marqueur = document.querySelector(
        '.node-marker[data-node="' + section.id + '"]',
      );
      var etiquette = document.querySelector(
        '.node-label[data-node="' + section.id + '"]',
      );
      if (marqueur) marqueur.style.top = pourcentage + "%";
      if (etiquette) etiquette.style.top = pourcentage + "%";
    });
  }

  function mettreAJourBackbone() {
    var doc = document.documentElement;
    var positionScroll = window.scrollY;
    var hauteurScrollable = doc.scrollHeight - doc.clientHeight;
    var progression =
      hauteurScrollable > 0 ? (positionScroll / hauteurScrollable) * 100 : 0;
    if (backboneFill) backboneFill.style.height = progression + "%";

    var sectionCourante = sections[0] ? sections[0].id : null;
    var pointDeRepere = positionScroll + window.innerHeight * 0.4;

    sections.forEach(function (section) {
      if (section.offsetTop <= pointDeRepere) sectionCourante = section.id;
    });

    navLinks.forEach(function (lien) {
      var cible = lien.getAttribute("href").replace("#", "");
      lien.classList.toggle("active", cible === sectionCourante);
    });
    nodeMarkers.forEach(function (marqueur) {
      marqueur.classList.toggle(
        "is-active",
        marqueur.dataset.node === sectionCourante,
      );
    });
    nodeLabels.forEach(function (etiquette) {
      etiquette.classList.toggle(
        "is-active",
        etiquette.dataset.node === sectionCourante,
      );
    });
  }
  window.addEventListener("scroll", mettreAJourBackbone, { passive: true });
  window.addEventListener("resize", function () {
    positionnerNodes();
    mettreAJourBackbone();
  });

  positionnerNodes();
  mettreAJourBackbone();

  // Les polices web (JetBrains Mono) changent parfois légèrement la
  // hauteur du texte une fois chargées, ce qui décale les sections.
  // On repositionne une fois qu'elles sont prêtes.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      positionnerNodes();
      mettreAJourBackbone();
    });
  }

  // Filet de sécurité : si des images (photo de profil, captures de
  // projets ajoutées plus tard) se chargent après coup et modifient
  // la hauteur des sections, on recalcule une dernière fois.
  window.addEventListener("load", function () {
    positionnerNodes();
    mettreAJourBackbone();
  });

  /* ==============================================================
       ÉTAPE 5 — ANIMATIONS D'APPARITION (data-reveal)
       ============================================================== */
  var elementsARevele = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var observateurRevele = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("is-visible");
            observateurRevele.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    elementsARevele.forEach(function (element) {
      observateurRevele.observe(element);
    });
  } else {
    elementsARevele.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* ==============================================================
       ÉTAPE 6 — COMPTEURS ANIMÉS
       ============================================================== */
  var compteurs = document.querySelectorAll("[data-count]");

  function animerCompteur(element) {
    var valeurCible = parseInt(element.dataset.count, 10) || 0;

    if (reduceMotion) {
      element.textContent = valeurCible;
      return;
    }

    var dureeMs = 1200;
    var tempsDeDepart = null;

    function etapeAnimation(horodatage) {
      if (!tempsDeDepart) tempsDeDepart = horodatage;
      var progression = Math.min((horodatage - tempsDeDepart) / dureeMs, 1);
      var progressionAdoucie = 1 - Math.pow(1 - progression, 3);
      element.textContent = Math.round(valeurCible * progressionAdoucie);
      if (progression < 1) requestAnimationFrame(etapeAnimation);
    }
    requestAnimationFrame(etapeAnimation);
  }

  if ("IntersectionObserver" in window) {
    var observateurCompteurs = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            animerCompteur(entree.target);
            observateurCompteurs.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    compteurs.forEach(function (element) {
      observateurCompteurs.observe(element);
    });
  }

  /* ==============================================================
       ÉTAPE 7 — FILTRES DE LA GRILLE DE PROJETS
       ============================================================== */
  var boutonsFiltre = document.querySelectorAll(".filter-btn");
  var cartesProjet = document.querySelectorAll(".projet-card");

  boutonsFiltre.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      boutonsFiltre.forEach(function (b) {
        b.classList.remove("active");
      });
      bouton.classList.add("active");

      var filtreChoisi = bouton.dataset.filter;
      cartesProjet.forEach(function (carte) {
        var correspond =
          filtreChoisi === "all" || carte.dataset.category === filtreChoisi;
        carte.classList.toggle("is-hidden", !correspond);
      });
    });
  });

  /* ==============================================================
       ÉTAPE 8 — NOTIFICATION "TOAST"
       ============================================================== */
  var toast = document.getElementById("toast");
  var minuteurToast;

  function afficherToast(message, estUneErreur) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("is-error", !!estUneErreur);
    toast.classList.add("is-visible");

    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4000);
  }

  /* ==============================================================
       ÉTAPE 9 — FORMULAIRE DE CONTACT
       ============================================================== */
  var formulaireContact = document.getElementById("contactForm");

  function definirErreurChamp(idChamp, message) {
    var champ = document.getElementById(idChamp);
    var elementErreur = document.getElementById(idChamp + "Error");
    var groupe = champ ? champ.closest(".form-group") : null;
    if (groupe) groupe.classList.toggle("has-error", !!message);
    if (elementErreur) elementErreur.textContent = message || "";
  }

  function validerFormulaireContact(donnees) {
    var estValide = true;

    if (!donnees.name.trim()) {
      definirErreurChamp("name", "Le nom est requis.");
      estValide = false;
    } else {
      definirErreurChamp("name", "");
    }

    var motifEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!motifEmail.test(donnees.email)) {
      definirErreurChamp("email", "Adresse email invalide.");
      estValide = false;
    } else {
      definirErreurChamp("email", "");
    }

    if (!donnees.subject.trim()) {
      definirErreurChamp("subject", "Le sujet est requis.");
      estValide = false;
    } else {
      definirErreurChamp("subject", "");
    }

    if (donnees.message.trim().length < 10) {
      definirErreurChamp(
        "message",
        "Décrivez votre projet en quelques mots (10 caractères min).",
      );
      estValide = false;
    } else {
      definirErreurChamp("message", "");
    }

    return estValide;
  }

  if (formulaireContact) {
    formulaireContact.addEventListener("submit", function (evenement) {
      evenement.preventDefault();

      var donnees = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      if (!validerFormulaireContact(donnees)) {
        afficherToast("Merci de corriger les champs indiqués.", true);
        return;
      }

      var boutonEnvoyer = formulaireContact.querySelector(".btn-submit");
      var contenuOriginalBouton = boutonEnvoyer.innerHTML;
      boutonEnvoyer.disabled = true;
      boutonEnvoyer.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

      if (window.emailjs) {
        emailjs
          .send("service_5e4spo9", "template_k8dg6wa", donnees)
          .then(function () {
            afficherToast(
              "Message envoyé avec succès. Je vous réponds rapidement.",
            );
            formulaireContact.reset();
          })
          .catch(function (erreur) {
            console.error("Erreur EmailJS :", erreur);
            afficherToast(
              "Une erreur est survenue. Réessayez ou écrivez-moi directement par email.",
              true,
            );
          })
          .finally(function () {
            boutonEnvoyer.disabled = false;
            boutonEnvoyer.innerHTML = contenuOriginalBouton;
          });

        // En parallèle : on enregistre aussi le message côté API pour
        // qu'il apparaisse dans le dashboard admin. Ça n'a aucune
        // incidence sur le message de succès affiché au visiteur
        // (qui dépend uniquement d'EmailJS ci-dessus) : si l'API est
        // indisponible, l'email part quand même, seule la copie dans
        // le dashboard sera manquante.
        fetch(PORTFOLIO_API_URL + "/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(donnees),
        }).catch(function (erreur) {
          console.error("Erreur enregistrement API contact :", erreur);
        });
      } else {
        afficherToast(
          "Le service d'envoi n'est pas disponible pour le moment.",
          true,
        );
        boutonEnvoyer.disabled = false;
        boutonEnvoyer.innerHTML = contenuOriginalBouton;
      }
    });
  }

  /* ==============================================================
       ÉTAPE 10 — FORMULAIRE NEWSLETTER
       ============================================================== */
  var formulaireNewsletter = document.getElementById("newsletterForm");
  if (formulaireNewsletter) {
    formulaireNewsletter.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      afficherToast("Merci ! Vous êtes inscrit à la newsletter.");
      formulaireNewsletter.reset();
    });
  }

  /* ==============================================================
       ÉTAPE 11 — BOUTON "RETOUR EN HAUT"
       ============================================================== */
  var boutonRetourHaut = document.getElementById("backToTop");

  function gererVisibiliteRetourHaut() {
    if (!boutonRetourHaut) return;
    boutonRetourHaut.classList.toggle("is-visible", window.scrollY > 480);
  }
  window.addEventListener("scroll", gererVisibiliteRetourHaut, {
    passive: true,
  });
  gererVisibiliteRetourHaut();

  /* ==============================================================
       ÉTAPE 12 — ANNÉE COURANTE DANS LE PIED DE PAGE
       ============================================================== */
  var elementAnnee = document.getElementById("currentYear");
  if (elementAnnee) elementAnnee.textContent = new Date().getFullYear();

  /* ==============================================================
       ÉTAPE 14 — PROJETS (chargés depuis l'API, gérés depuis l'admin)
       ============================================================== */
  function echapperHtmlProjet(texte) {
    var div = document.createElement("div");
    div.textContent = texte == null ? "" : String(texte);
    return div.innerHTML;
  }

  function creerCarteProjet(p) {
    var boutonsOverlay = "";
    var boutonsActions = "";

    if (p.github_url) {
      boutonsOverlay +=
        '<a href="' + echapperHtmlProjet(p.github_url) + '" target="_blank" rel="noopener noreferrer" class="projet-overlay-btn"><i class="fab fa-github"></i> Code source</a>';
      boutonsActions +=
        '<a href="' + echapperHtmlProjet(p.github_url) + '" target="_blank" rel="noopener noreferrer" class="projet-btn projet-btn--github"><i class="fab fa-github"></i><span>GitHub</span></a>';
    }
    if (p.demo_url) {
      boutonsOverlay +=
        '<a href="' + echapperHtmlProjet(p.demo_url) + '" target="_blank" rel="noopener noreferrer" class="projet-overlay-btn projet-overlay-btn--primary"><i class="fas fa-external-link-alt"></i> Voir en ligne</a>';
      boutonsActions +=
        '<a href="' + echapperHtmlProjet(p.demo_url) + '" target="_blank" rel="noopener noreferrer" class="projet-btn projet-btn--live"><i class="fas fa-rocket"></i><span>Voir en ligne</span></a>';
    }

    var techs = (p.technologies || [])
      .map(function (t) {
        return '<span class="tech-tag">' + echapperHtmlProjet(t) + "</span>";
      })
      .join("");

    var image = p.image
      ? '<div class="projet-image"><img src="' + echapperHtmlProjet(p.image) + '" alt="Capture d\'écran du projet ' + echapperHtmlProjet(p.title) + '" loading="lazy" />' +
        (boutonsOverlay ? '<div class="projet-overlay">' + boutonsOverlay + "</div>" : "") +
        "</div>"
      : "";

    return (
      '<div class="projet-card" data-category="' + echapperHtmlProjet(p.category) + '">' +
      image +
      '<div class="projet-body">' +
      '<span class="projet-category-badge">' + echapperHtmlProjet(p.category) + "</span>" +
      '<h3 class="projet-name">' + echapperHtmlProjet(p.title) + "</h3>" +
      '<p class="projet-description">' + echapperHtmlProjet(p.description) + "</p>" +
      '<div class="projet-techs">' + techs + "</div>" +
      (boutonsActions ? '<div class="projet-divider"></div><div class="projet-actions">' + boutonsActions + "</div>" : "") +
      "</div>" +
      "</div>"
    );
  }

  async function chargerProjetsPublics() {
    var grille = document.getElementById("projetsGrid");
    var vide = document.getElementById("projetsVide");
    var filtres = document.querySelector(".projets-filters");
    if (!grille) return;

    try {
      var reponse = await fetch(PORTFOLIO_API_URL + "/api/projects");
      if (!reponse.ok) throw new Error("Réponse API invalide");
      var donnees = await reponse.json();

      if (!donnees.projects || donnees.projects.length === 0) {
        vide.hidden = false;
        if (filtres) filtres.hidden = true;
        return;
      }

      vide.hidden = true;
      grille.innerHTML = donnees.projects.map(creerCarteProjet).join("");
    } catch (erreur) {
      console.error("Erreur chargement projets :", erreur);
      // On laisse l'état vide déjà présent dans le HTML (voir
      // index.html) plutôt que d'ajouter un message d'erreur en plus
      // — un visiteur n'a pas besoin de savoir que l'API est en cause.
      vide.hidden = false;
    }
  }

  chargerProjetsPublics();

  /* ==============================================================
       ÉTAPE 13 — TOOLTIPS SUR LES COMPÉTENCES
       ============================================================== */
  (function initTooltips() {
    var skillTags = document.querySelectorAll(".skill-tag");

    skillTags.forEach(function (tag) {
      var name = tag.dataset.name || "Technologie";
      var type = tag.dataset.type || "N/A";
      var creator = tag.dataset.creator || "Inconnu";
      var year = tag.dataset.year || "N/A";
      var level = tag.dataset.level || "Maîtrise";
      var desc = tag.dataset.desc || "";

      var tooltipBox = document.createElement("div");
      tooltipBox.className = "tooltip-box";

      var levelClass = level === "En apprentissage" ? "learning" : "";

      tooltipBox.innerHTML = `
                <div class="tt-title">${name}</div>
                <div class="tt-meta">
                    <span><span class="label">Type</span> ${type}</span>
                    <span><span class="label">Créé par</span> ${creator}</span>
                    <span><span class="label">Année</span> ${year}</span>
                </div>
                <div class="tt-desc">${desc}</div>
                <div class="tt-footer">
                    <span class="tt-type">${type}</span>
                    <span class="tt-level ${levelClass}">${level}</span>
                </div>
            `;

      tag.appendChild(tooltipBox);

      // Clic = ouvre le tooltip et le garde affiché plus longtemps
      // (utile sur mobile, où il n'y a pas de survol à la souris).
      // Se ferme tout seul après 6s, ou immédiatement si on clique
      // ailleurs, ou si on ouvre un autre tooltip.
      var minuteurFermeture;

      tag.addEventListener("click", function (evenement) {
        evenement.stopPropagation();

        var etaitOuvert = tag.classList.contains("is-open");
        skillTags.forEach(function (autre) {
          autre.classList.remove("is-open");
        });
        clearTimeout(minuteurFermeture);

        if (!etaitOuvert) {
          tag.classList.add("is-open");
          minuteurFermeture = setTimeout(function () {
            tag.classList.remove("is-open");
          }, 6000);
        }
      });
    });

    document.addEventListener("click", function () {
      skillTags.forEach(function (tag) {
        tag.classList.remove("is-open");
      });
    });
  })();
})();