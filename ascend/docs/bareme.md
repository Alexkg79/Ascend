# Ascend — Barème de gamification

## 1. XP par difficulté de défi

| Difficulté | XP gagné | Exemple |
|---|---|---|
| Facile | 15 XP | Boire un verre d'eau au réveil |
| Moyen | 25 XP | Faire 20 pompes |
| Difficile | 40 XP | Courir 5 km |

La difficulté est **choisie par l'utilisateur à l'onboarding** (Phase 2) et détermine le pool de défis qui lui sont proposés — pas de mélange de difficultés dans les défis du jour d'un même utilisateur pour garder une expérience cohérente.

## 2. Cristaux par défi complété

**1 cristal par défi complété, quelle que soit la difficulté.**

Volontairement découplé de la difficulté (contrairement à l'XP) : sinon un utilisateur en difficulté "Difficile" gagnerait 3× plus de cristaux/jour qu'un utilisateur "Facile", et la boutique n'aurait pas le même rythme selon le profil. Avec 3 défis/jour, ça fait **3 cristaux/jour garantis**, indépendamment du niveau de difficulté choisi — une économie prévisible et identique pour tous.

Les cristaux restent volontairement rares (contrairement à l'XP) pour que la boutique (section 4) garde de la valeur, sans pour autant créer un sentiment de manque permanent.

## 3. Niveaux

### Niveau global
Formule simple à seuils croissants (facile à coder, pas besoin de courbe exponentielle complexe) :

```
XP nécessaire pour passer du niveau N à N+1 = 100 + (N-1) × 40
```

| Niveau | XP requis pour ce palier | XP cumulé total |
|---|---|---|
| 1 → 2 | 100 | 100 |
| 2 → 3 | 140 | 240 |
| 3 → 4 | 180 | 420 |
| 5 → 6 | 260 | 900 |
| 10 → 11 | 460 | 2 700 |

À ~3 défis/jour de difficulté moyenne (75 XP/jour), un utilisateur atteint le niveau 5 en environ **12 jours**, le niveau 10 en **~36 jours**. C'est volontairement rapide au début (récompense la nouveauté) et ça ralentit ensuite — courbe classique de rétention.

### Niveau par compétence (par thème)
Même formule mais avec une base plus basse, car l'XP de compétence ne vient que des défis de ce thème précis :

```
XP nécessaire = 50 + (N-1) × 20
```

## 4. Coûts de la boutique cristaux

Recalculés sur la base de ~3-4 cristaux/jour (3 garantis + défi mystère occasionnel), pour que chaque action demande un vrai temps d'épargne réfléchi — ni instantané, ni décourageant :

| Action | Coût | Temps moyen pour épargner |
|---|---|---|
| Changer un défi du jour | 4 cristaux | ~1 jour |
| Débloquer un défi bonus | 8 cristaux | ~2 jours |
| Récupérer un streak manqué (rattraper un jour) | 12 cristaux | ~3 jours |

La récupération de streak reste la plus chère : c'est l'action la plus "puissante" (elle protège une série qui a pris du temps à construire), elle doit rester une décision consciente plutôt qu'un réflexe quotidien.

## 5. Défi mystère

- XP : **×2** par rapport à un défi normal de même difficulté
- Cristaux : **+2 cristaux fixes** (pas un multiplicateur, pour éviter que ça devienne l'unique source réelle de cristaux et pousse à ne compter que dessus)
- Apparaît une fois par jour, tiré aléatoirement, indépendamment des thèmes choisis (pour l'effet de surprise voulu dans le doc de vision)
- **Facultatif** : l'utilisateur choisit de l'ouvrir ou non, donc le bonus n'est pas garanti chaque jour — ça reste un plus, pas une dépendance

## 6. Bonus de streak

Pour renforcer l'habitude sans complexifier :

| Palier | Bonus |
|---|---|
| 7 jours consécutifs | +5 cristaux |
| 30 jours consécutifs | +20 cristaux + badge |
| 90 jours consécutifs | +50 cristaux + badge |

---

**Principe de conception à garder en tête**
Le rythme d'obtention des cristaux est volontairement plat et prévisible (3-4/jour), sans bonus qui s'accumulent en cascade ni urgence artificielle ("offre limitée", notifications de manque, etc.). L'objectif est que la boutique soit un petit plaisir occasionnel réfléchi, pas un mécanisme qui pousse à ouvrir l'appli par peur de perdre quelque chose — cohérent avec la philosophie de confiance du projet.

**Notes d'implémentation**
- Toutes ces valeurs sont des constantes à isoler dans un seul fichier de config (`gamification.config.ts` par exemple), pas hardcodées dans les composants — tu pourras rééquilibrer sans toucher au code métier.
- Ces chiffres sont une base de départ raisonnable, pas figée : ajuste après les premiers retours beta (Phase 7) si la progression semble trop rapide ou trop lente.
