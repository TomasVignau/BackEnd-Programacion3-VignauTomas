# base-api-express-generator

To run project local

```
npm run dev
```

To run migrations local

```
npm run migrate-dev
```

.env 

```
NODE_ENV=development
PORT=4000

JWT_SECRET=12345678

MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=test

```

/*.env.development (example)

```
ENV=development
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://user:password@127.0.0.1:27017/
MONGO_DB=base-api-express-generator

```*/



# Backend – API REST en Node + Express + MongoDB

API creada con Express, JWT para autenticación y MongoDB como base de datos.  
Incluye manejo de usuarios, roles, autenticación y soporte para ambientes mediante `.env`.

---

## 🚀 Tecnologías principales

- Node.js + Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- dotenv
- TypeScript

---

## 📦 Instalación

Cloná el repositorio:

```bash
git clone <url-del-repo>
cd <nombre-del-proyecto>

Instalá dependencias

npm install


.env

# Entorno (development | production)
NODE_ENV=development

# Puerto del servidor
PORT=4000

# Clave secreta para firmar JWT
JWT_SECRET=your-secret-here

# URL del servidor MongoDB
MONGO_URL=mongodb://localhost:27017

# Nombre de la base dentro de Mongo
MONGO_DB_NAME=test


Ejecutar el servidor:

npm run dev


Migraciones:

npm run migrate-dev
