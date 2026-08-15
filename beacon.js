/* ================================================================
   beacon.js — tracking des visiteurs (pages vues + clics importants)
   ----------------------------------------------------------------
   Branché dans index.html, juste avant app.js. Utilise l'URL
   définie dans config.js (PORTFOLIO_API_URL) — modifie-la là-bas,
   pas ici, une fois l'API déployée en ligne.

   data-track="cv_download" / "email" / "whatsapp" sont déjà posés
   sur les liens concernés dans index.html. Ajoute "github" /
   "linkedin" sur les icônes réseaux sociaux une fois leurs vraies
   URLs renseignées (elles pointent encore vers "#").
   ================================================================ */

(function () {
  "use strict";

  // On envoie les requêtes en arrière-plan, sans jamais bloquer la
  // navigation ni faire planter le site si l'API est indisponible
  // (d'où le "catch" qui ne fait rien de spécial en cas d'échec).
  function envoyer(chemin, donnees) {
    fetch(PORTFOLIO_API_URL + chemin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees || {}),
      keepalive: true, // permet à la requête de se terminer même si la page se ferme juste après
    }).catch(function () {
      /* on ignore volontairement les erreurs réseau ici : le
         tracking ne doit jamais impacter l'expérience visiteur */
    });
  }

  // ÉTAPE 1 — signaler la page vue, dès le chargement du script
  envoyer("/api/track/pageview", {
    path: window.location.pathname,
    referrer: document.referrer || null,
  });

  // ÉTAPE 2 — écouter les clics sur tout élément portant
  // data-track="whatsapp" (ou github, linkedin, email, cv_download)
  document.addEventListener("click", function (evenement) {
    var element = evenement.target.closest("[data-track]");
    if (!element) return;
    envoyer("/api/track/event", { type: element.dataset.track });
  });
})();