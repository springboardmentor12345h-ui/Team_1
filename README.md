# College Event Management System

A full-stack web application for managing college events, registrations, and feedback. Built with React (Vite) for the frontend and Node.js/Express for the backend, with MongoDB for data persistence.

## Features

### Student Features
- **Dashboard**: View upcoming events and personal event registrations
- **Event Browsing**: Browse all college events with detailed information
- **Event Registration**: Register for events and manage registrations
- **Feedback**: Submit feedback on attended events
- **Chatbot Support**: AI-powered chatbot for event inquiries
- **Authentication**: Secure login and registration system

### Admin/College Features
- **Dashboard**: Overview of all events and analytics
- **Event Management**: Create, edit, and manage events
- **Participant Management**: View and manage event registrations
- **Feedback Analysis**: Analyze student feedback and ratings
- **Event Analytics**: Track event statistics and attendance
- **Admin Chatbot**: Support chatbot for event management
- **Image Upload**: Upload event images via Cloudinary

## Tech Stack

**Frontend:**
- React 18+ with Vite
- React Router for navigation
- CSS3 for styling
- Lottie animations

**Backend:**
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Cloudinary for image hosting
- Morgan for logging

## Project Structure

```
client/
  src/
    components/     # Reusable components (Chatbots, Cards, Loaders)
    pages/          # Page components (Dashboard, Events, Feedback, etc.)
    assets/         # JSON animations and mock data
    App.jsx         # Main app component with routing

server/
  config/          # Database and Cloudinary configuration
  controllers/     # Route logic (events, feedback, etc.)
  middleware/      # Authentication and file upload middleware
  models/          # MongoDB schemas (User, Event, Registration, etc.)
  routes/          # API endpoints
  tools/           # Utility scripts
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- MongoDB Atlas account
- Cloudinary account (optional, for image uploads)

### Setup

1) **Configure Environment Variables**

   Create `server/.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
   JWT_SECRET=<any-random-string>
   
   # Cloudinary Configuration (for event image uploads)
   CLOUDINARY_NAME=<your-cloud-name>
   CLOUDINARY_KEY=<your-api-key>
   CLOUDINARY_SECRET=<your-api-secret>
   ```

   Create `client/.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2) **Database Setup**
   - Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
   - Whitelist your IP in Project → Network Access
   - Copy your connection string to `MONGO_URI`

3) **Cloudinary Setup** (Optional)
   - Get credentials from https://cloudinary.com/console (Dashboard section)
   - Add to `server/.env`

4) **Install Dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

5) **Run the Application**
   ```bash
   # Terminal 1: Start backend server
   cd server && npm start
   
   # Terminal 2: Start frontend development server
   cd client && npm run dev
   ```

   - Backend API: http://localhost:5000
   - Frontend: http://localhost:5173

## API Endpoints

**Authentication**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

**Events**
- `GET /events` - List all events
- `POST /events` - Create event (admin only)
- `GET /events/:id` - Get event details
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)

**Registrations**
- `GET /registrations` - Get user registrations
- `POST /registrations` - Register for event
- `DELETE /registrations/:id` - Cancel registration

**Feedback**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback (admin only)

**Notifications**
- `GET /notifications` - Get user notifications

## Available Scripts

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server
```bash
npm start        # Start server
npm run seed     # Seed database with sample data
```

## Troubleshooting

- **Server won't connect to MongoDB**: 
  - Verify `MONGO_URI` has a database name
  - Check your IP is whitelisted in MongoDB Atlas Network Access
  - Ensure connection string format is correct

- **Build errors**: 
  - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
  - Check Node.js version: `node --version` (should be 18+)

- **Port already in use**: 
  - Change `PORT` in `server/.env`
  - Change Vite port in `client/vite.config.js`

## Contributing

1. Create a new branch for features: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT License - Feel free to use this project for educational purposes.
