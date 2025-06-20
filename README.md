# Solo Sparks - Personal Growth Quest System

Solo Sparks is a comprehensive self-discovery application that helps users build emotional intelligence and self-awareness through personalized activities. The system analyzes user profiles, moods, and past behaviors to suggest meaningful solo activities, tracks completion through multimedia reflections, and implements a points-based reward system.

## DEMO-----
Check Link===>>>>>>>>>[Click](https://solo-sparks-personal-growth-quest-s.vercel.app)

## 🌟 Features

### Core Features

- **User Psychology Profiling**: Track mood, personality traits, emotional needs, and past quest responses
- **Intelligent Quest Engine**: Generate personalized daily/weekly/monthly quests based on user profile analysis
- **Multi-Media Reflection System**: Support for text reflections, photos, and audio submissions
- **Spark Points Economy**: Comprehensive points system with earning rules and redemption mechanics
- **Reward Management**: Profile boosts, exclusive content, special badges, and premium features
- **Behavioral Analytics**: Track user patterns, completion rates, and emotional growth indicators

### Frontend Features

- **Comprehensive Onboarding**: Multi-step personality and mood assessment
- **Smart Quest Display**: Engaging interface showing personalized daily quests
- **Multi-Media Submission Portal**: Rich forms supporting text, photo, and audio reflections
- **Spark Points Dashboard**: Visual representation of earned points and available rewards
- **Rewards Store**: Interface for redeeming points for various benefits
- **Progress & Growth Tracking**: Visual journey showing emotional growth milestones
- **Mood & State Input**: Intuitive interface for emotional state tracking

## 🛠 Tech Stack

### Frontend

- **React.js** with Vite
- **JavaScript** (ES6+)
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **Framer Motion** for animations

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for file storage
- **Bcrypt** for password hashing
- **Multer** for file uploads

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vishnuu5/Solo-Sparks---Personal-Growth-Quest-System.git
cd solo-sparks
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Set Up Environment Variables

#### Backend Environment Variables

Create a \`.env\` file in the \`backend\` directory:

```bash
env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/solo-sparks

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Cloudinary Configuration (optional for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Frontend Environment Variables

Create a \`.env\` file in the \`frontend\` directory:

```bash
env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

```bash
# Windows (as Administrator)
net start MongoDB
```

### 5. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Frontend only: npm run dev:frontend
# Backend only: npm run dev:backend
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📖 Detailed Installation Guide

## 🏃‍♂️ Running the Server

### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Run frontend only (port 3000)
npm run dev:frontend

# Run backend only (port 5000)
npm run dev:backend
```

### Production Mode

```bash
# Build frontend
npm run build

# Start backend in production mode
npm run start:prod
```

## 🔧 API Endpoints

### Authentication

- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/verify\` - Verify JWT token
- \`PUT /api/auth/profile\` - Update user profile

### Quests

- \`GET /api/quests\` - Get user's quests
- \`POST /api/quests/generate\` - Generate new quest
- \`POST /api/quests/:id/complete\` - Complete quest with reflection
- \`GET /api/quests/points\` - Get user's spark points

### Rewards

- \`GET /api/rewards\` - Get available rewards
- \`POST /api/rewards/:id/redeem\` - Redeem reward

### Profile

- \`PUT /api/profile/psychology\` - Update psychology profile
- \`POST /api/profile/mood\` - Add mood entry
- \`GET /api/profile/mood-history\` - Get mood history

### Analytics

- \`GET /api/analytics/progress\` - Get progress data
- \`GET /api/analytics/stats\` - Get user statistics

## 🎯 Usage Guide

### 1. User Registration & Onboarding

1. Register with email and password
2. Complete the 5-step onboarding process:
   - Personality traits assessment
   - Emotional needs identification
   - Interests selection
   - Growth goals setting
   - Current mood check

### 2. Daily Quest System

1. View your personalized daily quest on the dashboard
2. Complete the quest activity
3. Submit reflection (text, photo, or audio)
4. Earn Spark Points based on quest difficulty

### 3. Rewards System

1. Accumulate Spark Points by completing quests
2. Browse available rewards in the Rewards Store
3. Redeem points for profile boosts, badges, or premium features

### 4. Progress Tracking

1. Monitor your growth journey in the Progress section
2. View completion streaks and statistics
3. Track emotional growth across different categories

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Helmet.js for security headers

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error

- Ensure MongoDB is running locally or check your Atlas connection string
- Verify network connectivity and firewall settings
- Check if \`MONGODB_URI\` is correctly set in \`.env\`

#### Cloudinary Upload Issues

- Verify your Cloudinary credentials
- Check file size limits (10MB max)
- Ensure proper file types (images and audio only)

#### CORS Errors

- Verify \`FRONTEND_URL\` in backend \`.env\`
- Check that both frontend and backend are running on correct ports

#### JWT Token Issues

- Ensure \`JWT_SECRET\` is set in backend \`.env\`
- Check token expiration (7 days default)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
