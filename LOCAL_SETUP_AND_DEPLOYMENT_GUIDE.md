# ParkShare - Local Setup & Deployment Guide

This comprehensive guide will walk you through setting up the ParkShare application locally and deploying it to production, including mobile app store deployment.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Web Application Setup](#web-application-setup)
4. [Mobile Application Setup](#mobile-application-setup)
5. [Firebase Configuration](#firebase-configuration)
6. [Running Applications Locally](#running-applications-locally)
7. [Production Deployment](#production-deployment)
8. [Mobile App Store Deployment](#mobile-app-store-deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Flutter**: Version 3.16 or higher
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) or any preferred editor

### Development Tools
- **Android Studio**: For Android development and emulator
- **Xcode**: For iOS development (macOS only)
- **Firebase CLI**: For Firebase deployment
- **Flutter CLI**: For mobile app development

### Install Prerequisites

#### 1. Install Node.js and npm
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

#### 2. Install Flutter
```bash
# Download Flutter SDK from https://flutter.dev/docs/get-started/install
# Add Flutter to your PATH
export PATH="$PATH:`pwd`/flutter/bin"

# Verify installation
flutter doctor
```

#### 3. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase --version
```

#### 4. Install Android Studio
- Download from https://developer.android.com/studio
- Install Android SDK and create virtual device
- Set up environment variables:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 5. Install Xcode (macOS only)
- Download from Mac App Store
- Install Xcode Command Line Tools:
```bash
xcode-select --install
```

---

## 🌐 Local Development Setup

### 1. Clone the Repository
```bash
# Clone the project
git clone <your-repository-url>
cd parkshare-system

# Verify project structure
ls -la
```

### 2. Project Structure Overview
```
parkshare-system/
├── src/                    # Web app source code
├── flutter_app/           # Mobile app source code
├── public/                # Static assets
├── package.json           # Web app dependencies
├── .env.local            # Environment variables
├── firebase.json         # Firebase configuration
└── README.md             # This file
```

---

## 🖥️ Web Application Setup

### 1. Install Dependencies
```bash
# Navigate to web app directory (if not already there)
cd parkshare-system

# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 2. Environment Configuration
```bash
# Create environment file
cp .env.example .env.local

# Edit the environment file
nano .env.local
```

Add your Firebase configuration:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id

# App Configuration
NEXT_PUBLIC_APP_NAME=ParkShare
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Firebase Emulator (for development)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

### 3. Verify Web App Setup
```bash
# Check for any issues
npm run lint

# Build the application (optional)
npm run build
```

---

## 📱 Mobile Application Setup

### 1. Navigate to Flutter App Directory
```bash
cd flutter_app
```

### 2. Install Flutter Dependencies
```bash
# Get all Flutter packages
flutter pub get

# Verify dependencies
flutter pub deps
```

### 3. Configure Firebase for Mobile
```bash
# Install Firebase CLI tools for Flutter
dart pub global activate flutterfire_cli

# Configure Firebase for your Flutter app
flutterfire configure
```

### 4. Platform-Specific Setup

#### Android Setup
```bash
# Open Android-specific configuration
cd android

# Verify Android configuration
flutter doctor --android-licenses

# Accept all licenses
flutter doctor --android-licenses
```

#### iOS Setup (macOS only)
```bash
# Navigate to iOS directory
cd ios

# Install CocoaPods dependencies
pod install

# Open iOS project in Xcode (optional)
open Runner.xcworkspace
```

### 5. Verify Mobile App Setup
```bash
# Check Flutter setup
flutter doctor

# Analyze the project
flutter analyze

# Run tests
flutter test
```

---

## 🔥 Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `parkshare-production`
4. Enable Google Analytics (recommended)
5. Click "Create project"

### 2. Enable Required Services

#### Authentication
```bash
# Enable Authentication
# Go to Authentication > Sign-in method
# Enable Email/Password provider
```

#### Firestore Database
```bash
# Create Firestore database
# Go to Firestore Database > Create database
# Start in production mode
# Choose your region
```

#### Storage
```bash
# Enable Storage
# Go to Storage > Get started
# Set up security rules
```

### 3. Configure Web App
```bash
# Add web app to Firebase project
# Go to Project Settings > General
# Click "Add app" > Web
# Register app with nickname: "parkshare-web"
# Copy configuration to .env.local
```

### 4. Configure Mobile Apps
```bash
# Add Android app
# Go to Project Settings > General
# Click "Add app" > Android
# Package name: com.parkshare.app
# Download google-services.json to android/app/

# Add iOS app (if needed)
# Click "Add app" > iOS
# Bundle ID: com.parkshare.app
# Download GoogleService-Info.plist to ios/Runner/
```

### 5. Set Up Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /accounts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules as needed (see FIREBASE_SETUP_GUIDE.md)
  }
}
```

---

## 🚀 Running Applications Locally

### 1. Start Web Application
```bash
# Navigate to web app directory
cd parkshare-system

# Start development server
npm run dev

# Application will be available at:
# http://localhost:8000
```

### 2. Start Mobile Application

#### Android
```bash
# Navigate to Flutter app directory
cd flutter_app

# Start Android emulator
flutter emulators --launch <emulator_id>

# Or list available emulators
flutter emulators

# Run the app on Android
flutter run -d android
```

#### iOS (macOS only)
```bash
# Start iOS simulator
open -a Simulator

# Run the app on iOS
flutter run -d ios
```

#### Physical Device
```bash
# Enable developer mode on your device
# Connect device via USB

# List connected devices
flutter devices

# Run on specific device
flutter run -d <device_id>
```

### 3. Verify Both Applications

#### Web App Testing
1. Open http://localhost:8000
2. Test login with demo accounts:
   - Admin: `admin@parkshare.com` / `demo123`
   - Municipal: `municipal@city.gov` / `demo123`
   - Establishment: `business@mall.com` / `demo123`
   - Driver: `driver@email.com` / `demo123`

#### Mobile App Testing
1. Test user registration
2. Test login functionality
3. Test parking slot search
4. Test QR code scanning
5. Test payment integration

---

## 🌍 Production Deployment

### 1. Web Application Deployment

#### Option A: Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# Add all variables from .env.local
```

#### Option B: Firebase Hosting
```bash
# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

#### Option C: Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### 2. Environment Variables for Production
```env
# Production environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=parkshare-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=parkshare-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=parkshare-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=prod_app_id
```

---

## 📱 Mobile App Store Deployment

### 1. Prepare for Release

#### Update App Configuration
```yaml
# pubspec.yaml
name: parkshare
description: Smart Parking Management System
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.16.0"
```

#### Update App Icons
```bash
# Install flutter_launcher_icons
flutter pub add dev:flutter_launcher_icons

# Configure in pubspec.yaml
flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/icon/icon.png"

# Generate icons
flutter pub run flutter_launcher_icons:main
```

#### Configure App Signing

### 2. Android Deployment (Google Play Store)

#### Step 1: Create Keystore
```bash
# Navigate to android directory
cd flutter_app/android

# Create keystore
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# Create key.properties file
nano android/key.properties
```

Add to `key.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=upload
storeFile=/path/to/upload-keystore.jks
```

#### Step 2: Configure Gradle
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.parkshare.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

#### Step 3: Build Release APK/AAB
```bash
# Build APK
flutter build apk --release

# Build App Bundle (recommended for Play Store)
flutter build appbundle --release

# Files will be generated at:
# build/app/outputs/flutter-apk/app-release.apk
# build/app/outputs/bundle/release/app-release.aab
```

#### Step 4: Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new application
3. Fill in app details:
   - App name: "ParkShare"
   - Description: "Smart Parking Management System"
   - Category: "Maps & Navigation"
   - Content rating: Complete questionnaire
4. Upload app bundle (AAB file)
5. Set up store listing with screenshots
6. Configure pricing (Free/Paid)
7. Submit for review

### 3. iOS Deployment (Apple App Store)

#### Step 1: Configure iOS Project
```bash
# Open iOS project in Xcode
cd flutter_app/ios
open Runner.xcworkspace
```

#### Step 2: Configure Signing & Capabilities
1. Select Runner project in Xcode
2. Go to "Signing & Capabilities"
3. Select your development team
4. Set Bundle Identifier: `com.parkshare.app`
5. Enable required capabilities:
   - Camera (for QR scanning)
   - Location Services
   - Push Notifications

#### Step 3: Update Info.plist
```xml
<!-- ios/Runner/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan QR codes for parking</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to find nearby parking spots</string>
```

#### Step 4: Build for Release
```bash
# Build iOS release
flutter build ios --release

# Or build and archive in Xcode
# Product > Archive
```

#### Step 5: Upload to App Store Connect
1. Open Xcode
2. Window > Organizer
3. Select your archive
4. Click "Distribute App"
5. Choose "App Store Connect"
6. Upload to App Store Connect

#### Step 6: Submit to App Store
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app:
   - Name: "ParkShare"
   - Bundle ID: `com.parkshare.app`
   - SKU: `parkshare-ios`
3. Fill in app information:
   - Description
   - Keywords
   - Screenshots (required sizes)
   - App category: "Navigation"
4. Set pricing and availability
5. Submit for App Review

### 4. App Store Assets Required

#### Screenshots Needed
- **Android**: 
  - Phone: 1080x1920, 1080x2340
  - Tablet: 1200x1920, 1600x2560
- **iOS**:
  - iPhone: 1290x2796, 1179x2556
  - iPad: 2048x2732, 1668x2388

#### App Store Descriptions
```markdown
# Short Description (80 characters)
Smart parking management system for drivers, municipalities, and businesses.

# Full Description
ParkShare is a comprehensive parking management ecosystem that connects drivers with available parking spaces while providing powerful management tools for municipalities and businesses.

Features:
• Real-time parking availability
• QR code entry and exit system
• Mobile payments and reservations
• Business analytics dashboard
• Municipal parking management
• Driver-friendly booking system

Perfect for:
- Drivers looking for convenient parking
- Municipalities managing city parking
- Businesses optimizing parking operations
- Establishments with customer parking

Download ParkShare today and experience the future of smart parking!
```

---

## 🔧 Troubleshooting

### Common Web App Issues

#### Issue 1: Firebase Configuration Error
```bash
# Error: Firebase not initialized
# Solution: Check .env.local file
cat .env.local

# Verify Firebase project settings
firebase projects:list
```

#### Issue 2: Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

#### Issue 3: Port Already in Use
```bash
# Kill process on port 8000
fuser -k 8000/tcp

# Or use different port
PORT=3000 npm run dev
```

### Common Mobile App Issues

#### Issue 1: Flutter Doctor Issues
```bash
# Run flutter doctor
flutter doctor

# Fix Android license issues
flutter doctor --android-licenses

# Fix iOS issues (macOS)
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

#### Issue 2: Build Failures
```bash
# Clean Flutter project
flutter clean
flutter pub get

# Clean Android build
cd android
./gradlew clean
cd ..

# Clean iOS build (macOS)
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### Issue 3: Firebase Integration Issues
```bash
# Reconfigure Firebase
flutterfire configure

# Verify Firebase files exist
ls android/app/google-services.json
ls ios/Runner/GoogleService-Info.plist
```

### Performance Optimization

#### Web App Optimization
```bash
# Analyze bundle size
npm run build
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Optimize images
npm install next-optimized-images
```

#### Mobile App Optimization
```bash
# Build optimized release
flutter build apk --release --shrink
flutter build appbundle --release

# Analyze app size
flutter build apk --analyze-size
```

---

## 📞 Support & Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

### Community Support
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Flutter GitHub](https://github.com/flutter/flutter)
- [Firebase Support](https://firebase.google.com/support)

### Development Tools
- [VS Code Flutter Extension](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)

---

## 🎉 Congratulations!

You now have a complete guide to:
- ✅ Set up the ParkShare application locally
- ✅ Run both web and mobile applications
- ✅ Deploy to production environments
- ✅ Publish to Google Play Store and Apple App Store

For additional support, refer to the comprehensive documentation files included in this project:
- `FIREBASE_SETUP_GUIDE.md`
- `TESTING_GUIDE.md`
- `SCALABILITY_FIXES_SUMMARY.md`

Happy coding! 🚀
