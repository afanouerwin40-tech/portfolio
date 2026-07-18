/* ================================================================
   beacon.js — À AJOUTER SUR LE SITE (erwin-dev.dev) UNE FOIS
   L'API DÉPLOYÉE.
   ----------------------------------------------------------------
   Ce fichier n'est PAS encore branché dans index.html : il ne sert
   à rien tant que l'API (dossier backend/) n'est pas hébergée
   quelque part avec une vraie URL publique.

   Une fois l'API en ligne :
     1. Remplace API_URL ci-dessous par ton URL réelle
        (ex : "https://api.erwin.dev")
     2. Ajoute <script src="beacon.js"></script> juste avant
        </body> dans index.html
     3. Ajoute data-track="whatsapp" / "github" / "linkedin" /
        "email" / "cv_download" sur les liens correspondants dans
        le HTML (voir plus bas comment ce script les détecte).
   ================================================================ */

(function () {
  "use strict";

  // ⚠️ À remplacer par l'URL réelle de ton API une fois déployée
  var API_URL = "https://api.erwin.dev";

  // On envoie les requêtes en arrière-plan, sans jamais bloquer la
  // navigation ni faire planter le site si l'API est indisponible
  // (d'où le "catch" qui ne fait rien de spécial en cas d'échec).
  function envoyer(chemin, donnees) {
    fetch(API_URL + chemin, {
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
