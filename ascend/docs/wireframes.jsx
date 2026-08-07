import { Circle } from "lucide-react";

// ---- Wireframe primitives (grayscale, structure only) --------------
function Box({ label, h = 40, dashed = false, fill = "#EDEDED" }) {
  return (
    <div
      className="w-full flex items-center justify-center text-center px-2 rounded"
      style={{
        height: h,
        backgroundColor: fill,
        border: `1.5px ${dashed ? "dashed" : "solid"} #B5B5B5`,
        color: "#6B6B6B",
        fontSize: 9.5,
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.3,
      }}
    >
      {label}
    </div>
  );
}

function Line({ w = "60%" }) {
  return <div style={{ width: w, height: 6, backgroundColor: "#D4D4D4", borderRadius: 3 }} />;
}

function NavBar() {
  return (
    <div
      className="flex items-center justify-around mt-auto pt-2"
      style={{ borderTop: "1.5px solid #B5B5B5" }}
    >
      {["Accueil", "Calendrier", "Profil"].map((l) => (
        <div key={l} className="flex flex-col items-center gap-1">
          <Circle size={12} color="#9A9A9A" />
          <span style={{ fontSize: 6.5, color: "#9A9A9A", fontFamily: "'Inter', sans-serif" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Phone({ n, title, children }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#3A3A3A", fontWeight: 600, textAlign: "center" }}>
        {n}. {title}
      </div>
      <div
        className="flex flex-col gap-2 p-2.5"
        style={{
          width: 178,
          height: 340,
          backgroundColor: "#FAFAFA",
          border: "2px solid #C9C9C9",
          borderRadius: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---- Screens ---------------------------------------------------------
export default function AscendWireframes() {
  return (
    <div className="min-h-screen w-full p-8" style={{ backgroundColor: "#FFFFFF" }}>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: "#2A2A2A" }}>
        Ascend — Wireframes V1 (structure, basse-fidélité)
      </h1>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7A7A7A", marginTop: 4, marginBottom: 24 }}>
        10 écrans couvrant l'ensemble du parcours V1. Pas de design ici — uniquement la hiérarchie et le contenu de chaque écran.
      </p>

      <div className="flex flex-wrap gap-8">
        {/* 1. Connexion */}
        <Phone n={1} title="Connexion / Inscription">
          <Box label="Logo Ascend" h={50} />
          <Line w="40%" />
          <Box label="Champ e-mail" h={34} />
          <Box label="Champ mot de passe" h={34} />
          <Box label="Bouton : Créer un compte" h={36} fill="#DCDCDC" />
          <Box label="Lien : J'ai déjà un compte" h={22} dashed />
        </Phone>

        {/* 2. Onboarding thèmes */}
        <Phone n={2} title="Onboarding — Thèmes">
          <Line w="30%" />
          <Box label="Titre : Choisis tes thèmes" h={26} />
          <Box label="Grille 2 col. de cartes thème (Sport, Confiance, Sommeil, Finances, Apprentissage) — sélection multiple" h={190} />
          <Box label="Bouton : Continuer" h={34} fill="#DCDCDC" />
        </Phone>

        {/* 3. Onboarding durée */}
        <Phone n={3} title="Onboarding — Durée">
          <Line w="30%" />
          <Box label="Titre : Choisis la durée du challenge" h={26} />
          <Box label="Options : 7 / 30 / 60 / 90 jours" h={90} />
          <Box label="Option : Durée personnalisée (input)" h={40} dashed />
          <Box label="Bouton : Continuer" h={34} fill="#DCDCDC" />
        </Phone>

        {/* 4. Onboarding temps/difficulté */}
        <Phone n={4} title="Onboarding — Temps & difficulté">
          <Line w="30%" />
          <Box label="Titre : Ton rythme" h={26} />
          <Box label="Slider : temps dispo/jour" h={50} />
          <Box label="Sélecteur : Facile / Moyen / Difficile" h={60} />
          <Box label="Résumé du profil créé" h={50} dashed />
          <Box label="Bouton : Terminer" h={34} fill="#DCDCDC" />
        </Phone>

        {/* 5. Accueil */}
        <Phone n={5} title="Accueil — Défis du jour">
          <Box label="Anneau niveau + XP · Streak · Cristaux" h={40} />
          <Line w="40%" />
          <Box label="Défi 1 (thème + XP + checkbox)" h={44} />
          <Box label="Défi 2 (thème + XP + checkbox)" h={44} />
          <Box label="Défi 3 (thème + XP + checkbox)" h={44} />
          <Box label="Carte Défi mystère (bordure pointillée)" h={44} dashed />
          <NavBar />
        </Phone>

        {/* 6. Défi mystère détail */}
        <Phone n={6} title="Défi mystère (modal)">
          <Box label="Icône '?' centrale" h={60} />
          <Box label="Titre : Défi mystère" h={22} />
          <Box label="Texte : Ouvrir pour découvrir le défi" h={30} />
          <Box label="Bouton : Ouvrir le défi" h={36} fill="#DCDCDC" />
          <Box label="Une fois ouvert : contenu du défi + XP×2 + cristaux+2" h={70} dashed />
          <Box label="Bouton : Fermer" h={22} dashed />
        </Phone>

        {/* 7. Boutique cristaux */}
        <Phone n={7} title="Boutique cristaux">
          <Box label="Solde cristaux actuel" h={30} />
          <Line w="35%" />
          <Box label="Item : Changer un défi — 4 cristaux" h={46} />
          <Box label="Item : Débloquer un défi bonus — 8 cristaux" h={46} />
          <Box label="Item : Récupérer un streak — 12 cristaux" h={46} />
          <Box label="Bouton par item : Utiliser" h={20} dashed />
        </Phone>

        {/* 8. Profil */}
        <Phone n={8} title="Profil / Progression">
          <Box label="Anneau niveau (grand) + avatar" h={70} />
          <Box label="Stats : streak · badges" h={26} />
          <Line w="30%" />
          <Box label="Liste compétences (5 thèmes + barre + niveau)" h={110} />
          <Box label="Aperçu badges (row scrollable)" h={40} dashed />
          <NavBar />
        </Phone>

        {/* 9. Calendrier */}
        <Phone n={9} title="Calendrier">
          <Line w="30%" />
          <Box label="Sélecteur mois" h={22} />
          <Box label="Grille calendrier — jours réussis marqués" h={170} />
          <Box label="Légende (réussi / manqué / récupéré)" h={26} dashed />
          <NavBar />
        </Phone>

        {/* 10. Badges */}
        <Phone n={10} title="Badges (détail)">
          <Line w="30%" />
          <Box label="Titre : Tes badges (9/24)" h={22} />
          <Box label="Grille badges débloqués (icône + nom)" h={130} />
          <Box label="Grille badges verrouillés (grisés + condition)" h={110} dashed />
        </Phone>
      </div>

      <div className="mt-8" style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9A9A9A", maxWidth: 640 }}>
        Note : ces wireframes fixent la structure et le contenu de chaque écran, pas le style visuel — c'est déjà couvert par la maquette Ascend_Design_V1. Sers-t'en comme check-list au moment de construire chaque écran en React Native.
      </div>
    </div>
  );
}
