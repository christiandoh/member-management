# MemberSpace — Système de Gestion de Membres

Plateforme complète de gestion de membres avec dashboard utilisateur et interface d'administration, construite avec Node.js, Express, Prisma et SQLite.

---

## Apercu des fonctionnalites

### Membres
- Inscription en 3 etapes avec photo de profil
- Dashboard personnel avec liste des autres membres
- Modification du profil (informations + photo + mot de passe)
- Mode clair / sombre

### Administration
- Liste complete des membres avec recherche
- Suppression de membres
- Statistiques avec graphiques (genre, situation matrimoniale, inscriptions mensuelles)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Serveur | Node.js + Express |
| Base de donnees | SQLite (via Prisma ORM) |
| Migrations | Prisma Migrate |
| Auth | JWT + Cookies HTTP-only |
| Upload | Multer |
| Frontend | HTML + CSS + JavaScript vanilla |
| Graphiques | Chart.js |
| Conteneur | Docker + Docker Compose |

---

## Structure du projet

```
member-management/
├── prisma/
│   ├── schema.prisma       # Schema de la base de donnees
│   └── seed.js             # Donnees initiales (compte admin)
├── public/
│   ├── css/
│   │   └── style.css       # Styles globaux
│   ├── index.html          # Page de connexion
│   ├── register.html       # Page d'inscription
│   ├── dashboard.html      # Dashboard membre
│   └── admin.html          # Dashboard admin
├── src/
│   ├── middleware/
│   │   └── auth.js         # Middleware JWT
│   ├── routes/
│   │   ├── auth.js         # Routes connexion / inscription
│   │   ├── members.js      # Routes membres
│   │   └── admin.js        # Routes administration
│   └── server.js           # Point d'entree Express
├── uploads/                # Photos de profil (genere automatiquement)
├── .env                    # Variables d'environnement
├── .gitignore
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Demarrage rapide

### Prerequis

- Node.js 18+ — https://nodejs.org
- npm 9+
- Git — https://git-scm.com
- Docker (optionnel) — https://docker.com

---

### Installation locale (sans Docker)

```bash
# 1. Cloner le depot
git clone https://github.com/votre-utilisateur/member-management.git
cd member-management

# 2. Installer les dependances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Editer .env si necessaire

# 4. Generer le client Prisma
npm run db:generate

# 5. Appliquer le schema a la base de donnees
npm run db:push

# 6. Seeder la base (creer le compte admin)
npm run db:seed

# 7. Demarrer le serveur en mode developpement
npm run dev
```

L'application sera disponible sur : http://localhost:3000

---

### Demarrage avec Docker

```bash
# 1. Cloner le depot
git clone https://github.com/votre-utilisateur/member-management.git
cd member-management

# 2. Construire et lancer les conteneurs
docker compose up --build

# Pour lancer en arriere-plan
docker compose up --build -d

# Voir les logs en temps reel
docker compose logs -f

# Arreter les conteneurs
docker compose down

# Arreter et supprimer les volumes (reset complet)
docker compose down -v
```

L'application sera disponible sur : http://localhost:3000

---

## Commandes utiles

### Serveur

```bash
# Mode developpement (rechargement automatique)
npm run dev

# Mode production
npm start
```

### Base de donnees Prisma

```bash
# Generer le client Prisma apres modification du schema
npm run db:generate

# Pousser le schema sans migration (dev rapide)
npm run db:push

# Creer une migration nommee
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Reinitialiser la base de donnees (supprime tout)
npx prisma migrate reset

# Seeder la base de donnees
npm run db:seed

# Ouvrir Prisma Studio (interface visuelle)
npm run db:studio
```

### Docker

```bash
# Construire uniquement l'image
docker build -t memberspace .

# Lancer le conteneur manuellement
docker run -p 3000:3000 memberspace

# Voir les conteneurs actifs
docker ps

# Executer une commande dans le conteneur
docker compose exec app sh

# Supprimer toutes les images non utilisees
docker system prune -a
```

---

## Compte administrateur par defaut

| Champ | Valeur |
|-------|--------|
| Telephone | 0000000000 |
| Mot de passe | admin123 |

**Important : changez ce mot de passe apres votre premiere connexion en production.**

---

## Variables d'environnement

Creez un fichier `.env` a la racine du projet :

```env
# URL de la base de donnees SQLite
DATABASE_URL="file:./dev.db"

# Cle secrete pour les tokens JWT (changez en production)
JWT_SECRET="votre-cle-secrete-tres-longue-et-aleatoire"

# Port du serveur
PORT=3000

# Environnement
NODE_ENV=development
```

---

## Pousser le projet sur GitHub

### Premiere fois (nouveau depot)

```bash
# 1. Initialiser Git dans le projet
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Premier commit
git commit -m "feat: initialisation du projet MemberSpace"

# 4. Renommer la branche principale
git branch -M main

# 5. Lier au depot distant GitHub
git remote add origin https://github.com/votre-utilisateur/member-management.git

# 6. Pousser le code
git push -u origin main
```

### Mise a jour du code (commits suivants)

```bash
# Voir l'etat des fichiers modifies
git status

# Ajouter tous les fichiers modifies
git add .

# Ou ajouter un fichier specifique
git add src/server.js

# Creer un commit avec un message clair
git commit -m "feat: ajout de la recherche de membres"

# Pousser vers GitHub
git push
```

### Conventions de messages de commit

```bash
# Nouvelle fonctionnalite
git commit -m "feat: description de la fonctionnalite"

# Correction de bug
git commit -m "fix: description du bug corrige"

# Modification de style / CSS
git commit -m "style: mise a jour du dashboard"

# Refactorisation du code
git commit -m "refactor: reorganisation des routes"

# Documentation
git commit -m "docs: mise a jour du README"

# Configuration
git commit -m "chore: mise a jour des dependances"
```

### Travailler avec des branches

```bash
# Creer et basculer sur une nouvelle branche
git checkout -b feature/nom-de-la-fonctionnalite

# Voir toutes les branches
git branch -a

# Basculer sur une branche existante
git checkout main

# Fusionner une branche dans main
git checkout main
git merge feature/nom-de-la-fonctionnalite

# Supprimer une branche apres fusion
git branch -d feature/nom-de-la-fonctionnalite

# Pousser une branche vers GitHub
git push origin feature/nom-de-la-fonctionnalite
```

### Recuperer les modifications de GitHub

```bash
# Recuperer et fusionner les changements distants
git pull

# Recuperer sans fusionner
git fetch origin

# Voir l'historique des commits
git log --oneline --graph
```

### En cas de conflit

```bash
# Voir les fichiers en conflit
git status

# Apres resolution manuelle des conflits
git add .
git commit -m "fix: resolution des conflits"
git push
```

---

## API Endpoints

### Authentification

| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Creer un compte |
| POST | `/api/auth/login` | Se connecter |
| POST | `/api/auth/logout` | Se deconnecter |
| GET | `/api/auth/me` | Profil connecte |

### Membres (authentifie)

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/members` | Liste des membres |
| PUT | `/api/members/profile` | Modifier son profil |

### Administration (admin uniquement)

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/users` | Tous les utilisateurs |
| DELETE | `/api/admin/users/:id` | Supprimer un membre |
| GET | `/api/admin/stats` | Statistiques |

---

## Schema de la base de donnees

```prisma
model User {
  id            Int      @id @default(autoincrement())
  firstName     String
  lastName      String
  phone         String   @unique
  gender        String   // male | female | other
  maritalStatus String   // single | married | divorced | widowed
  photo         String?
  role          String   @default("member")  // member | admin
  password      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## Acces aux pages

| Page | URL | Acces |
|------|-----|-------|
| Connexion | http://localhost:3000 | Public |
| Inscription | http://localhost:3000/register | Public |
| Dashboard membre | http://localhost:3000/dashboard | Membre connecte |
| Dashboard admin | http://localhost:3000/admin | Admin connecte |

---

## Conseils pour les etudiants

1. Lisez le code dans cet ordre : `schema.prisma` -> `server.js` -> `routes/` -> `public/`
2. Utilisez `npm run db:studio` pour visualiser la base de donnees
3. Testez chaque route API avec un outil comme Postman ou Thunder Client
4. Modifiez le schema Prisma, puis relancez `npm run db:push` pour voir l'effet
5. Experimentez : ajoutez un champ `email` dans le schema et adaptez les routes

---

## Licence

Projet educatif — libre d'utilisation et de modification.
# member-management
