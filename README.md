# My Career Build (MCB) - React Native Career App

A comprehensive job-seeker career application built with **Expo** and **TypeScript**. This app provides a complete platform for job searching, application tracking, and career development.

## 🚀 Features

### Core Functionality
- **Job Search & Discovery**: Browse and search through job listings with advanced filtering
- **Application Tracking**: Track job applications with status updates (Applied, Shortlisted, Interview, Rejected)
- **Profile Management**: Complete profile builder with resume upload functionality
- **Notifications**: Real-time notifications for application updates and job matches
- **Dark/Light Mode**: Full theme support with system preference detection

### UI/UX Features
- **Modern Design**: Clean, professional interface with Material Design 3
- **Smooth Animations**: Micro-interactions and transitions using React Native Reanimated
- **Accessibility**: Full accessibility support with screen reader labels and high contrast
- **Responsive Layout**: Optimized for various screen sizes and orientations

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Context API with useReducer for predictable state updates
- **Local Persistence**: AsyncStorage for offline data storage
- **Navigation**: React Navigation with bottom tabs and stack navigation
- **Animations**: React Native Reanimated for smooth, performant animations

## 📱 Screens

1. **Splash Screen**: App loading with animated logo
2. **Onboarding**: Feature introduction with smooth page transitions
3. **Authentication**: Login and signup with form validation
4. **Home**: Dashboard with profile overview and quick actions
5. **Jobs**: Job listings with search and filter capabilities
6. **Job Details**: Comprehensive job information with apply functionality
7. **Applications**: Track all job applications with status filtering
8. **Notifications**: Manage alerts and updates
9. **Profile**: User profile management and settings
10. **Resume Builder**: Step-by-step resume optimization tool

## 🛠️ Tech Stack

- **Expo**: Latest version for easy development and deployment
- **React Native**: 0.81.4
- **TypeScript**: Full type safety
- **React Navigation**: 7.x for navigation
- **React Native Paper**: Material Design 3 components
- **React Native Reanimated**: 4.x for animations
- **React Native Gesture Handler**: Touch interactions
- **React Native Vector Icons**: Icon library
- **AsyncStorage**: Local data persistence

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Quick Start

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd mcb-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install **Expo Go** from App Store/Google Play
   - Scan the QR code that appears in your terminal
   - The app will load on your device!

### Alternative Run Methods

**Web Browser:**
```bash
npm run web
```

**Android Emulator:**
```bash
npm run android
```

**iOS Simulator (Mac only):**
```bash
npm run ios
```

## 🏗️ Project Structure

```
mcb-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── JobCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── FiltersModal.tsx
│   │   └── NotificationItem.tsx
│   ├── screens/            # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── JobsScreen.tsx
│   │   ├── JobDetailsScreen.tsx
│   │   ├── ApplicationsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ResumeBuilderScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── context/           # State management
│   │   └── AppContext.tsx
│   ├── data/              # Dummy JSON data
│   │   ├── jobs.json
│   │   ├── applications.json
│   │   ├── notifications.json
│   │   └── profile.json
│   ├── constants/         # App constants
│   │   ├── colors.ts
│   │   ├── sizes.ts
│   │   └── theme.ts
│   ├── hooks/             # Custom hooks
│   │   ├── useAsyncStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useAnimation.ts
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── assets/                # App assets
├── App.tsx               # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: #4A90E2 (Blue)
- **Secondary**: #50C878 (Green)
- **Accent**: #FF6B6B (Red)
- **Success**: #4CAF50
- **Warning**: #FF9800
- **Error**: #F44336

### Typography
- **Headlines**: 24px, 20px, 18px
- **Body**: 16px, 14px, 12px
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)

### Spacing
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

## 📱 Features in Detail

### Job Search
- Advanced filtering by job type, location, salary, experience
- Search functionality with real-time results
- Save jobs for later review
- Apply directly from job listings

### Application Tracking
- Visual status indicators (Applied, Shortlisted, Interview, Rejected)
- Timeline view of application history
- Interview scheduling and reminders
- Notes and comments for each application

### Profile Management
- Complete profile builder with progress tracking
- Resume upload and optimization
- Skills and experience management
- Professional summary and achievements

### Notifications
- Real-time application updates
- Job match notifications
- Interview reminders
- Profile completion alerts

## 🚀 Getting Started

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Open Expo Go on your phone**
   - Android: Download from Google Play Store
   - iOS: Download from App Store

3. **Scan the QR code** that appears in your terminal

4. **Enjoy your career app!** 🎉

## 📝 Development Notes

### State Management
The app uses React Context API with useReducer for state management. The main state includes:
- User profile and authentication
- Job listings and applications
- Notifications and preferences
- Theme and UI state

### Data Persistence
All user data is persisted locally using AsyncStorage:
- User profile and preferences
- Job applications and saved jobs
- Notification history
- Theme preferences

### Animations
The app uses React Native Reanimated for smooth animations:
- Page transitions and navigation
- Micro-interactions on buttons and cards
- Loading states and progress indicators
- Shared element transitions

## 🔮 Future Enhancements

- **Backend Integration**: Connect to real job APIs
- **Push Notifications**: Real-time job alerts
- **Social Features**: Connect with other professionals
- **Analytics**: Track application success rates
- **AI Recommendations**: Personalized job suggestions
- **Video Interviews**: Integrated interview scheduling
- **Document Management**: Resume and portfolio management

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Expo, React Native and TypeScript**