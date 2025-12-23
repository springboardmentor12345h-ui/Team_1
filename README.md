# Quick Start

Prereqs: Node.js 18+ and npm installed.

1) Server env
- Copy `server/.env.example` to `server/.env` and set:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<any-random-string>

# Cloudinary Configuration (for event image uploads)
CLOUDINARY_NAME=<your-cloud-name>
CLOUDINARY_KEY=<your-api-key>
CLOUDINARY_SECRET=<your-api-secret>
```
- In MongoDB Atlas, allow your current IP in Project → Network Access.
- Get Cloudinary credentials from https://cloudinary.com/console (Dashboard section)

2) Install deps
```bash
cd server && npm install
cd ../client && npm install
```

3) Run
```bash
# in two terminals
cd server && npm start
cd client && npm run dev
```
Client URL: http://localhost:5173

4) Client API URL
- Ensure `client/.env` contains:
```
VITE_API_URL=http://localhost:5000
```

Troubleshooting
- If server exits early: verify `MONGO_URI` has a DB name and your IP is whitelisted in Atlas.
