# ParkShare Management System

A comprehensive parking management system with web dashboards and mobile application, featuring real-time updates, commission tracking, and QR code integration.

## 🚀 Project Overview

ParkShare is a complete parking management ecosystem consisting of:

1. **Web Application** - Role-based dashboards for different user types
2. **Flutter Mobile App** - Native mobile app for drivers
3. **Payment Commission System** - Automated 10% commission tracking
4. **Real-time Updates** - Live parking availability and reservations
5. **QR Code Integration** - Seamless entry/exit processing

## 🏗️ Architecture

### Web Application (Next.js + TypeScript)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom utility classes
- **Authentication**: Role-based access control with protected routes
- **Database**: Firebase-ready with mock data service
- **Real-time**: Live updates for parking availability

### Mobile Application (Flutter)
- **Framework**: Flutter with Dart
- **State Management**: Provider pattern
- **Authentication**: Firebase Auth integration
- **Database**: Cloud Firestore
- **Features**: QR scanning, real-time parking search, payment integration

## 🎯 Features

### ✅ Web Dashboards

#### 1. **Admin Dashboard** (`/admin`)
- System-wide statistics and analytics
- Commission reports with CSV export
- User management and verification
- Revenue tracking across all partners

#### 2. **Municipal Dashboard** (`/municipal`)
- City-wide parking management
- QR scanner interface integration
- Real-time occupancy tracking
- Revenue analytics with commission breakdown

#### 3. **Establishment Dashboard** (`/establishment`)
- Business parking lot management
- Reservation system management
- Staff access control
- Revenue analytics showing gross vs net after 10% commission

#### 4. **Driver Dashboard** (`/driver`)
- Available parking space search and filtering
- Real-time reservation system
- Vehicle management
- Parking history and payments

#### 5. **QR Scanner Interface** (`/scanner`)
- Entry/exit processing
- Manual override capabilities
- Real-time slot status updates
- Payment processing on exit

### ✅ Mobile Application Features

#### Core Functionality
- **Splash Screen** with animated logo
- **Authentication** with demo account support
- **Home Screen** with parking space listing
- **Real-time Updates** for parking availability
- **Search & Filters** by location, type, and price
- **Reservation System** with payment integration

#### Technical Features
- **Provider State Management** for auth, parking, and vehicles
- **Firebase Integration** ready for production
- **Mock Data Service** for development
- **Responsive UI** with Material Design
- **Error Handling** with retry mechanisms

### ✅ Payment Commission System

#### Automated Commission Processing
- **10% Commission Rate** on all transactions
- **Real-time Calculation** of gross vs net revenue
- **Commission Tracking** with pending/collected status
- **CSV Export** functionality for accounting
- **Revenue Analytics** with commission breakdown

#### Payment Flow
1. Driver makes payment for parking
2. System automatically calculates 10% commission
3. Net amount (90%) goes to parking owner
4. Commission (10%) goes to ParkShare
5. All transactions tracked in real-time

## 🔐 Authentication System

### Role-Based Access Control
- **Admin**: Full system access and management
- **Municipal**: City parking management
- **Establishment**: Business parking management  
- **Driver**: Parking search and reservations
- **Scanner**: QR code scanning operations

### Demo Accounts
All demo accounts use password: `demo123`

| Role | Email | Access |
|------|-------|--------|
| Admin | admin@parkshare.com | Full system access |
| Municipal | municipal@city.gov | City parking management |
| Establishment | business@mall.com | Business parking management |
| Driver | driver@email.com | Parking search & reservations |
| Scanner | scanner@parkshare.com | QR scanning operations |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Flutter SDK (for mobile app)
- Firebase project (for production)

### Web Application Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
# Copy and update .env.local with your Firebase credentials
cp .env.local.example .env.local
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Access Application**
- Open http://localhost:8000
- Use demo accounts to test different roles

### Flutter Mobile App Setup

1. **Navigate to Flutter Directory**
```bash
cd flutter_app
```

2. **Install Dependencies**
```bash
flutter pub get
```

3. **Configure Firebase**
```bash
# Add your Firebase configuration to lib/config/firebase_config.dart
```

4. **Run Application**
```bash
flutter run
```

## 📱 Mobile App Structure

```
flutter_app/
├── lib/
│   ├── config/           # Firebase configuration
│   ├── models/           # Data models (Account, ParkingSlot, Vehicle)
│   ├── providers/        # State management (Auth, Parking, Vehicle)
│   ├── screens/          # UI screens
│   │   ├── auth/         # Login/signup screens
│   │   ├── home/         # Main parking search
│   │   ├── booking/      # Reservation management
│   │   ├── profile/      # User profile
│   │   └── qr/           # QR code scanning
│   ├── services/         # API services (Auth, Firebase)
│   ├── widgets/          # Reusable UI components
│   └── utils/            # Utilities and constants
└── pubspec.yaml          # Dependencies
```

## 🌐 Web Application Structure

```
src/
├── app/                  # Next.js app directory
│   ├── admin/           # Admin dashboard
│   ├── municipal/       # Municipal dashboard  
│   ├── establishment/   # Business dashboard
│   ├── driver/          # Driver dashboard
│   ├── scanner/         # QR scanner interface
│   └── login/           # Authentication
├── lib/                 # Shared libraries
│   ├── types.ts         # TypeScript interfaces
│   ├── firebase-service.ts    # Firebase operations
│   ├── payment-service.ts     # Payment processing
│   ├── commission-service.ts  # Commission tracking
│   └── auth-service.ts        # Authentication
└── components/          # Reusable components
```

## 💰 Commission System Details

### Revenue Flow
```
Gross Payment (₱100) 
├── Commission (₱10) → ParkShare
└── Net Revenue (₱90) → Parking Owner
```

### Commission Tracking
- **Real-time calculation** on all transactions
- **Automated reporting** with CSV export
- **Dashboard analytics** showing commission trends
- **Partner revenue breakdown** with gross vs net amounts

### Commission Reports Include:
- Total gross revenue
- Total commission collected
- Net revenue to partners
- Transaction counts
- Date range filtering
- Partner-wise breakdown

## 🔄 Real-time Features

### Live Updates
- **Parking Availability**: Real-time slot status updates
- **Reservations**: Instant booking confirmations
- **Payments**: Live transaction processing
- **Analytics**: Real-time revenue tracking

### WebSocket Integration (Ready)
- Real-time parking slot updates
- Live reservation notifications
- Instant payment confirmations
- Dashboard data synchronization

## 🛠️ Technology Stack

### Web Application
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: Custom auth service with protected routes
- **Database**: Firebase Firestore (with mock data for development)
- **Payments**: Integrated commission calculation
- **Deployment**: Vercel-ready

### Mobile Application  
- **Framework**: Flutter 3.10+
- **Language**: Dart
- **State Management**: Provider
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **Maps**: Google Maps integration
- **QR Codes**: QR code scanner and generator

## 📊 System Statistics

### Current Implementation Status
- ✅ **5 Web Dashboards** - Fully functional
- ✅ **Authentication System** - Role-based access control
- ✅ **Commission System** - 10% automated deduction
- ✅ **Real-time Updates** - Live parking availability
- ✅ **Flutter Mobile App** - Core functionality implemented
- ✅ **Payment Integration** - Commission tracking
- ✅ **QR Code System** - Entry/exit processing

### Demo Data
- **4 User Accounts** across different roles
- **3 Parking Slots** with real-time availability
- **Mock Transactions** with commission tracking
- **Sample Reports** with CSV export functionality

## 🚀 Deployment

### Web Application
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

### Mobile Application
```bash
# Build APK for Android
flutter build apk

# Build for iOS
flutter build ios
```

## 🔧 Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Authentication and Firestore
3. Update configuration files:
   - Web: `.env.local`
   - Mobile: `lib/config/firebase_config.dart`

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 📈 Future Enhancements

### Planned Features
- **Push Notifications** for mobile app
- **Advanced Analytics** with charts and graphs
- **Multi-language Support** for international use
- **Payment Gateway Integration** (Stripe, PayPal)
- **Advanced QR Features** with encryption
- **Geofencing** for automatic check-in/out
- **AI-powered Parking Predictions**

### Technical Improvements
- **Progressive Web App** (PWA) support
- **Offline Functionality** for mobile app
- **Advanced Caching** strategies
- **Performance Optimization**
- **Automated Testing** suite
- **CI/CD Pipeline** setup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review demo account functionality

---

**ParkShare Management System** - Complete parking management solution with web dashboards, mobile app, and automated commission tracking.
