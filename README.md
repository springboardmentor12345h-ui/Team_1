# 1. Clone the project
git clone https://github.com/springboardmentor12345h-ui/Team_1.git
cd Team_1

# 2. Install backend dependencies
cd server
npm install

# 3. Create backend environment file
# (YOU MUST EDIT THIS WITH YOUR MONGO URI)
touch .env

# inside .env add:
# PORT=5000
# MONGO_URI=your_mongo_uri_here
# JWT_SECRET=some_secret

# 4. Run backend
npm run dev
# backend runs on: http://localhost:5000

# 5. Open new terminal for frontend
cd ../client
npm install

# 6. Create frontend environment file
touch .env

# inside client/.env add:
# VITE_API_URL=http://localhost:5000

# 7. Run frontend
npm run dev
# frontend runs on: http://localhost:5173
