# FF-Likes Frontend

A modern React frontend for the FF-Likes API - Send likes to Free Fire profiles with ease.

## 🚀 Features

- **Send Likes**: Send likes to Free Fire profiles with real-time feedback
- **Dashboard**: Monitor MongoDB statistics and token status
- **Daily Stats**: Check daily like limits for any UID
- **Modern UI**: Premium dark theme with gradients and animations
- **Responsive**: Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- FF-Likes Backend API running (Flask)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   For production, update the URL to your deployed backend:
   ```env
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

## 🎯 Running the Application

### Development Mode

1. **Start the backend (Flask):**
   ```bash
   cd ../ff-likes-v3-main
   python app.py
   ```

2. **Start the React frontend:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📁 Project Structure

```
ff-likes-frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── LikeSender.jsx  # Send likes component
│   │   ├── LikeSender.css
│   │   ├── Dashboard.jsx   # Stats dashboard
│   │   ├── Dashboard.css
│   │   ├── DailyStats.jsx  # Daily statistics
│   │   └── DailyStats.css
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Features Overview

### Send Likes
- Enter Free Fire UID
- Select server region (IND, BR, US, BD, SAC, NA)
- Choose like count (1-100)
- View player information and like analytics
- Track daily usage and limits

### Dashboard
- View MongoDB connection status
- Monitor server-wise statistics
- Check account and token counts
- Force refresh tokens

### Daily Stats
- Check daily like limits for any UID
- Visual progress indicators
- View reset time
- Track used and remaining likes

## 🌐 API Integration

The frontend connects to the Flask backend API. Ensure the backend is running and accessible.

**Backend Endpoints Used:**
- `GET /` - API status
- `GET /like` - Send likes
- `GET /mongodb-stats` - Get statistics
- `GET /force-refresh` - Refresh tokens
- `GET /daily-stats/:uid` - Get daily stats

## 🎨 Design Features

- **Dark Theme**: Modern dark color scheme
- **Gradients**: Beautiful purple/pink gradients
- **Animations**: Smooth transitions and micro-animations
- **Glassmorphism**: Frosted glass effects
- **Responsive**: Mobile-first design
- **Premium Feel**: High-quality UI/UX

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   npm run build
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to Netlify

3. Set environment variable in Netlify dashboard

## 🔧 Configuration

### Environment Variables

- `REACT_APP_API_URL`: Backend API URL (required)

### CORS

Ensure your Flask backend has CORS enabled:
```python
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})
```

## 📝 Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🐛 Troubleshooting

### Backend Connection Issues

1. Verify backend is running on the correct port
2. Check `.env` file has correct API URL
3. Ensure CORS is enabled on backend
4. Check browser console for errors

### Build Issues

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear cache:
   ```bash
   npm cache clean --force
   ```

## 👨‍💻 Developer

- **Developer**: 👑 God
- **Instagram**: 📱 _echo.del.alma_

## 📄 License

This project is part of the FF-Likes system.

---

**Made with ❤️ for the Free Fire community**
