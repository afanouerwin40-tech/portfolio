/* ================================================================
   config.js
   ----------------------------------------------------------------
   Adresse de l'API (portfolio-api), utilisée par beacon.js (tracking)
   et par app.js (formulaire de contact, envoyé à la fois par email
   via EmailJS et enregistré dans le dashboard admin via l'API).

   - En local : laisse la valeur par défaut tant que ton API tourne
     avec "npm run dev" sur le port 4000.
     var PORTFOLIO_API_URL = "http://localhost:4000";
   - En ligne : remplace par l'URL publique de ton API déployée
     (ex : "https://portfolio-api.onrender.com") puis redéploie ce site.
   ================================================================ */

var PORTFOLIO_API_URL = "https://erwin-dev-api.onrender.com";
/*var PORTFOLIO_API_URL = "http://localhost:4000";*/