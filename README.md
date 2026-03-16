# School Management API

Node.js + Express + MySQL APIs to add schools and list them sorted by distance from a user-provided location.

## Quick start
1) Install deps: `npm install`
2) Create MySQL database (default name `schooldb`).
3) Run the schema: `mysql -u <user> -p<password> schooldb < schema.sql`
4) Set environment variables (or edit `db.js`): `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`.
5) Start server: `npm start` (default port 3000).

## APIs
- `POST /addSchool`
  - Body (JSON): `{ "name": "string", "address": "string", "latitude": 12.34, "longitude": 56.78 }`
  - Validates strings + numeric lat/lon (-90..90 / -180..180).
  - Returns 201 with `id` of new row.

- `GET /listSchools?latitude=12.34&longitude=56.78`
  - Requires numeric query params.
  - Responds with list sorted by `distanceInKm` (Haversine).

## Database schema
See `schema.sql`. Fields: id (PK, auto-inc), name, address, latitude, longitude.

## Deployment outline (Render example)
1) Provision a MySQL instance (e.g., Neon/PlanetScale/AWS RDS). Note the host, user, password, db, port.
2) Push this repo to your GitHub.
3) On Render: New -> Web Service -> Connect repo -> runtime Node 18+.
4) Set env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, optionally `PORT`.
5) Build command: `npm install`
6) Start command: `npm start`
7) Run `schema.sql` on the database once.

## Postman collection
`postman_collection.json` contains example requests with `{{baseUrl}}` variable. Import it and set `baseUrl` to your deployed URL (e.g., `https://your-app.onrender.com`).
