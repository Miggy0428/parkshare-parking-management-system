# Flutter Driver App - Complete Project Structure

This document provides the complete Flutter project structure and all necessary files for the ParkShare driver mobile application.

## Project Setup

### 1. Create Flutter Project
```bash
flutter create parking_driver_app
cd parking_driver_app
```

### 2. pubspec.yaml
```yaml
name: parking_driver_app
description: ParkShare Driver Mobile Application
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter
  
  # Firebase
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  cloud_firestore: ^4.13.6
  firebase_storage: ^11.5.6
  
  # State Management
  provider: ^6.1.1
  
  # UI Components
  cupertino_icons: ^1.0.6
  google_fonts: ^6.1.0
  
  # QR Code
  qr_code_scanner: ^1.0.1
  qr_flutter: ^4.1.0
  
  # Location & Maps
  geolocator: ^10.1.0
  google_maps_flutter: ^2.5.0
  
  # HTTP & Networking
  http: ^1.1.2
  
  # Local Storage
  shared_preferences: ^2.2.2
  
  # Image Handling
  image_picker: ^1.0.4
  cached_network_image: ^3.3.0
  
  # Utilities
  intl: ^0.19.0
  uuid: ^4.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
```

### 3. Android Permissions (android/app/src/main/AndroidManifest.xml)
Add these permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
```

### 4. iOS Permissions (ios/Runner/Info.plist)
Add these keys:
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan QR codes</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to find nearby parking</string>
```

## Project Structure

```
lib/
├── main.dart
├── models/
│   ├── account.dart
│   ├── vehicle.dart
│   ├── parking_slot.dart
│   ├── parking_invoice.dart
│   └── parking_reservation.dart
├── services/
│   ├── firebase_service.dart
│   ├── auth_service.dart
│   ├── location_service.dart
│   └── qr_service.dart
├── providers/
│   ├── auth_provider.dart
│   ├── parking_provider.dart
│   └── vehicle_provider.dart
├── screens/
│   ├── splash_screen.dart
│   ├── onboarding/
│   │   ├── welcome_screen.dart
│   │   ├── register_screen.dart
│   │   ├── license_verification_screen.dart
│   │   └── payment_setup_screen.dart
│   ├── auth/
│   │   └── login_screen.dart
│   ├── home/
│   │   ├── home_screen.dart
│   │   ├── parking_map_screen.dart
│   │   └── parking_detail_screen.dart
│   ├── booking/
│   │   ├── booking_screen.dart
│   │   └── reservation_screen.dart
│   ├── qr/
│   │   ├── qr_scanner_screen.dart
│   │   └── qr_display_screen.dart
│   ├── profile/
│   │   ├── profile_screen.dart
│   │   ├── vehicle_management_screen.dart
│   │   └── transaction_history_screen.dart
│   └── payment/
│       └── payment_screen.dart
├── widgets/
│   ├── common/
│   │   ├── custom_button.dart
│   │   ├── custom_text_field.dart
│   │   ├── loading_widget.dart
│   │   └── error_widget.dart
│   ├── parking/
│   │   ├── parking_card.dart
│   │   ├── parking_slot_widget.dart
│   │   └── reservation_card.dart
│   └── navigation/
│       └── bottom_navigation.dart
├── utils/
│   ├── constants.dart
│   ├── colors.dart
│   ├── text_styles.dart
│   └── validators.dart
└── config/
    └── firebase_config.dart
```

## Core Files Implementation

### main.dart
```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'config/firebase_config.dart';
import 'providers/auth_provider.dart';
import 'providers/parking_provider.dart';
import 'providers/vehicle_provider.dart';
import 'screens/splash_screen.dart';
import 'utils/colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const ParkShareApp());
}

class ParkShareApp extends StatelessWidget {
  const ParkShareApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ParkingProvider()),
        ChangeNotifierProvider(create: (_) => VehicleProvider()),
      ],
      child: MaterialApp(
        title: 'ParkShare Driver',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          primaryColor: AppColors.primary,
          scaffoldBackgroundColor: AppColors.background,
          textTheme: GoogleFonts.interTextTheme(),
          appBarTheme: const AppBarTheme(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 0,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
```

### models/account.dart
```dart
class Account {
  final String id;
  final String accountType;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? licenseId;
  final String? licensePhoto;
  final bool licenseVerified;
  final double availableBalance;
  final String? mobileNumber;
  final String? address;
  final String? paymentMethod;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;

  Account({
    required this.id,
    required this.accountType,
    required this.email,
    this.firstName,
    this.lastName,
    this.licenseId,
    this.licensePhoto,
    this.licenseVerified = false,
    this.availableBalance = 0.0,
    this.mobileNumber,
    this.address,
    this.paymentMethod,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
  });

  factory Account.fromMap(Map<String, dynamic> map, String id) {
    return Account(
      id: id,
      accountType: map['accountType'] ?? 'Driver',
      email: map['email'] ?? '',
      firstName: map['firstName'],
      lastName: map['lastName'],
      licenseId: map['licenseId'],
      licensePhoto: map['licensePhoto'],
      licenseVerified: map['licenseVerified'] ?? false,
      availableBalance: (map['availableBalance'] ?? 0.0).toDouble(),
      mobileNumber: map['mobileNumber'],
      address: map['address'],
      paymentMethod: map['paymentMethod'],
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      updatedAt: map['updatedAt']?.toDate() ?? DateTime.now(),
      isActive: map['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'accountType': accountType,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'licenseId': licenseId,
      'licensePhoto': licensePhoto,
      'licenseVerified': licenseVerified,
      'availableBalance': availableBalance,
      'mobileNumber': mobileNumber,
      'address': address,
      'paymentMethod': paymentMethod,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'isActive': isActive,
    };
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}
```

### models/vehicle.dart
```dart
class Vehicle {
  final String id;
  final String driverId;
  final String plateNumber;
  final String vehicleType;
  final String qrCode;
  final DateTime? lastTimeIn;
  final DateTime? lastTimeOut;
  final bool isCurrentlyParked;
  final String? currentParkingSlot;
  final DateTime createdAt;
  final DateTime updatedAt;

  Vehicle({
    required this.id,
    required this.driverId,
    required this.plateNumber,
    required this.vehicleType,
    required this.qrCode,
    this.lastTimeIn,
    this.lastTimeOut,
    this.isCurrentlyParked = false,
    this.currentParkingSlot,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Vehicle.fromMap(Map<String, dynamic> map, String id) {
    return Vehicle(
      id: id,
      driverId: map['driverId'] ?? '',
      plateNumber: map['plateNumber'] ?? '',
      vehicleType: map['vehicleType'] ?? 'Sedan',
      qrCode: map['qrCode'] ?? '',
      lastTimeIn: map['lastTimeIn']?.toDate(),
      lastTimeOut: map['lastTimeOut']?.toDate(),
      isCurrentlyParked: map['isCurrentlyParked'] ?? false,
      currentParkingSlot: map['currentParkingSlot'],
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      updatedAt: map['updatedAt']?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'driverId': driverId,
      'plateNumber': plateNumber,
      'vehicleType': vehicleType,
      'qrCode': qrCode,
      'lastTimeIn': lastTimeIn,
      'lastTimeOut': lastTimeOut,
      'isCurrentlyParked': isCurrentlyParked,
      'currentParkingSlot': currentParkingSlot,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
```

### models/parking_slot.dart
```dart
class ParkingSlot {
  final String id;
  final String ownerAccountId;
  final String slotName;
  final String location;
  final Map<String, double>? coordinates;
  final double ratePerHour;
  final bool isAvailable;
  final String? currentVehicleId;
  final String parkingType;
  final bool reservationAllowed;
  final DateTime? lastEntryTime;
  final DateTime? lastExitTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  ParkingSlot({
    required this.id,
    required this.ownerAccountId,
    required this.slotName,
    required this.location,
    this.coordinates,
    required this.ratePerHour,
    this.isAvailable = true,
    this.currentVehicleId,
    this.parkingType = 'Open',
    this.reservationAllowed = true,
    this.lastEntryTime,
    this.lastExitTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ParkingSlot.fromMap(Map<String, dynamic> map, String id) {
    return ParkingSlot(
      id: id,
      ownerAccountId: map['ownerAccountId'] ?? '',
      slotName: map['slotName'] ?? '',
      location: map['location'] ?? '',
      coordinates: map['coordinates'] != null 
          ? Map<String, double>.from(map['coordinates'])
          : null,
      ratePerHour: (map['ratePerHour'] ?? 0.0).toDouble(),
      isAvailable: map['isAvailable'] ?? true,
      currentVehicleId: map['currentVehicleId'],
      parkingType: map['parkingType'] ?? 'Open',
      reservationAllowed: map['reservationAllowed'] ?? true,
      lastEntryTime: map['lastEntryTime']?.toDate(),
      lastExitTime: map['lastExitTime']?.toDate(),
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      updatedAt: map['updatedAt']?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'ownerAccountId': ownerAccountId,
      'slotName': slotName,
      'location': location,
      'coordinates': coordinates,
      'ratePerHour': ratePerHour,
      'isAvailable': isAvailable,
      'currentVehicleId': currentVehicleId,
      'parkingType': parkingType,
      'reservationAllowed': reservationAllowed,
      'lastEntryTime': lastEntryTime,
      'lastExitTime': lastExitTime,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  double? get latitude => coordinates?['lat'];
  double? get longitude => coordinates?['lng'];
}
```

### services/firebase_service.dart
```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/account.dart';
import '../models/vehicle.dart';
import '../models/parking_slot.dart';

class FirebaseService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Collections
  static const String _accountsCollection = 'accounts';
  static const String _vehiclesCollection = 'vehicles';
  static const String _parkingSlotsCollection = 'parkingSlots';
  static const String _parkingInvoicesCollection = 'parkingInvoices';
  static const String _parkingReservationsCollection = 'parkingReservations';

  // Account Operations
  static Future<Account?> getAccount(String userId) async {
    try {
      final doc = await _firestore
          .collection(_accountsCollection)
          .doc(userId)
          .get();
      
      if (doc.exists) {
        return Account.fromMap(doc.data()!, doc.id);
      }
      return null;
    } catch (e) {
      print('Error getting account: $e');
      return null;
    }
  }

  static Future<bool> updateAccount(String userId, Map<String, dynamic> data) async {
    try {
      await _firestore
          .collection(_accountsCollection)
          .doc(userId)
          .update({
        ...data,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      return true;
    } catch (e) {
      print('Error updating account: $e');
      return false;
    }
  }

  // Vehicle Operations
  static Future<List<Vehicle>> getUserVehicles(String userId) async {
    try {
      final querySnapshot = await _firestore
          .collection(_vehiclesCollection)
          .where('driverId', isEqualTo: userId)
          .get();

      return querySnapshot.docs
          .map((doc) => Vehicle.fromMap(doc.data(), doc.id))
          .toList();
    } catch (e) {
      print('Error getting vehicles: $e');
      return [];
    }
  }

  static Future<String?> addVehicle(Vehicle vehicle) async {
    try {
      final docRef = await _firestore
          .collection(_vehiclesCollection)
          .add(vehicle.toMap());
      return docRef.id;
    } catch (e) {
      print('Error adding vehicle: $e');
      return null;
    }
  }

  // Parking Slot Operations
  static Future<List<ParkingSlot>> getAvailableParkingSlots() async {
    try {
      final querySnapshot = await _firestore
          .collection(_parkingSlotsCollection)
          .where('isAvailable', isEqualTo: true)
          .get();

      return querySnapshot.docs
          .map((doc) => ParkingSlot.fromMap(doc.data(), doc.id))
          .toList();
    } catch (e) {
      print('Error getting parking slots: $e');
      return [];
    }
  }

  static Stream<List<ParkingSlot>> getAvailableParkingSlotsStream() {
    return _firestore
        .collection(_parkingSlotsCollection)
        .where('isAvailable', isEqualTo: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ParkingSlot.fromMap(doc.data(), doc.id))
            .toList());
  }

  // Reservation Operations
  static Future<String?> createReservation(Map<String, dynamic> reservationData) async {
    try {
      final docRef = await _firestore
          .collection(_parkingReservationsCollection)
          .add({
        ...reservationData,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (e) {
      print('Error creating reservation: $e');
      return null;
    }
  }
}
```

### services/auth_service.dart
```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/account.dart';

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  static User? get currentUser => _auth.currentUser;

  static Stream<User?> get authStateChanges => _auth.authStateChanges();

  static Future<UserCredential?> signInWithEmailAndPassword(
      String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign in error: $e');
      return null;
    }
  }

  static Future<UserCredential?> createUserWithEmailAndPassword(
      String email, String password) async {
    try {
      return await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign up error: $e');
      return null;
    }
  }

  static Future<bool> createDriverAccount(
      String userId, Map<String, dynamic> accountData) async {
    try {
      await _firestore.collection('accounts').doc(userId).set({
        ...accountData,
        'accountType': 'Driver',
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        'isActive': true,
        'licenseVerified': false,
        'availableBalance': 0.0,
      });
      return true;
    } catch (e) {
      print('Error creating account: $e');
      return false;
    }
  }

  static Future<void> signOut() async {
    await _auth.signOut();
  }

  static Future<bool> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      return true;
    } catch (e) {
      print('Password reset error: $e');
      return false;
    }
  }
}
```

### utils/colors.dart
```dart
import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color secondary = Color(0xFF64748B);
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color border = Color(0xFFE2E8F0);
}
```

### utils/constants.dart
```dart
class AppConstants {
  static const String appName = 'ParkShare Driver';
  static const String appVersion = '1.0.0';
  
  // Firebase Collections
  static const String accountsCollection = 'accounts';
  static const String vehiclesCollection = 'vehicles';
  static const String parkingSlotsCollection = 'parkingSlots';
  static const String parkingInvoicesCollection = 'parkingInvoices';
  static const String parkingReservationsCollection = 'parkingReservations';
  
  // Vehicle Types
  static const List<String> vehicleTypes = [
    'Sedan',
    'SUV',
    'Motorcycle',
    'Truck',
  ];
  
  // Payment Methods
  static const List<String> paymentMethods = [
    'GCash',
    'Credit Card',
    'Other',
  ];
  
  // Parking Types
  static const List<String> parkingTypes = [
    'Open',
    'Covered',
    'Reserved',
  ];
}
```

## Key Features Implementation

### 1. Driver Onboarding Flow
- Welcome screen with app introduction
- Registration with email/phone + OTP verification
- Driver's license photo upload and verification
- Payment method setup (GCash/Card integration)

### 2. Parking Booking System
- Real-time parking map with availability
- Slot selection and pre-payment system
- QR code generation for reservations
- Push notifications for booking confirmations

### 3. QR Code System
- Vehicle QR code display for entry/exit
- QR scanner integration for manual scanning
- Automatic entry/exit processing
- Real-time parking status updates

### 4. Payment Integration
- GCash API integration
- Credit card processing
- Prepaid balance management
- Automatic fee calculation and deduction

### 5. Real-time Features
- Live parking availability updates
- Push notifications for reservations
- Real-time location tracking
- Live chat support (future feature)

## Setup Instructions

1. **Create Flutter Project**: Follow the project setup steps above
2. **Firebase Configuration**: Set up Firebase project and add configuration files
3. **Dependencies**: Run `flutter pub get` to install all dependencies
4. **Platform Setup**: Configure Android and iOS permissions
5. **Build and Test**: Run `flutter run` to test the application

## Additional Features

### Security Features
- Encrypted QR codes with time-based validation
- Secure payment processing
- User authentication with Firebase Auth
- Data privacy compliance

### Offline Capabilities
- Local storage for user data
- Offline QR code display
- Cached parking slot information
- Sync when connection restored

### Analytics and Monitoring
- User behavior tracking
- Crash reporting
- Performance monitoring
- Usage analytics

This comprehensive Flutter project structure provides a complete foundation for the ParkShare driver mobile application with all the features specified in your requirements.
