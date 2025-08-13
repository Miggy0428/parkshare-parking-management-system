# Firebase Setup Guide for ParkShare System

This guide will walk you through setting up Firebase for the ParkShare parking management system.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `parkshare-system`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click "Save"

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure rules later)
4. Select your preferred location
5. Click "Done"

## 4. Configure Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user account data
    function getUserAccount() {
      return get(/databases/$(database)/documents/accounts/$(request.auth.uid)).data;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && getUserAccount().accountType == 'Admin';
    }
    
    // Helper function to check if user is municipal
    function isMunicipal() {
      return isAuthenticated() && getUserAccount().accountType == 'Municipal';
    }
    
    // Helper function to check if user is establishment
    function isEstablishment() {
      return isAuthenticated() && getUserAccount().accountType == 'Establishment';
    }
    
    // Helper function to check if user is business (Municipal or Establishment)
    function isBusiness() {
      return isMunicipal() || isEstablishment();
    }
    
    // Helper function to check if user is driver
    function isDriver() {
      return isAuthenticated() && getUserAccount().accountType == 'Driver';
    }
    
    // Accounts collection
    match /accounts/{accountId} {
      // Users can read/write their own account
      allow read, write: if isAuthenticated() && request.auth.uid == accountId;
      // Admins and business users can read all accounts
      allow read: if isAdmin() || isBusiness();
    }
    
    // Vehicles collection
    match /vehicles/{vehicleId} {
      // Drivers can read/write their own vehicles
      allow read, write: if isAuthenticated() && resource.data.driverId == request.auth.uid;
      // Admins and business users can read all vehicles
      allow read: if isAdmin() || isBusiness();
      // Only allow creating vehicles if the driverId matches the authenticated user
      allow create: if isAuthenticated() && request.resource.data.driverId == request.auth.uid;
    }
    
    // Parking slots collection
    match /parkingSlots/{slotId} {
      // Anyone authenticated can read parking slots
      allow read: if isAuthenticated();
      // Only owners and admins can create slots
      allow create: if isAuthenticated() && 
        (request.resource.data.ownerAccountId == request.auth.uid || isAdmin());
      // Only owners and admins can update/delete slots
      allow update, delete: if isAuthenticated() && 
        (resource.data.ownerAccountId == request.auth.uid || isAdmin());
    }
    
    // Parking invoices collection
    match /parkingInvoices/{invoiceId} {
      // Drivers can read their own invoices
      allow read: if isAuthenticated() && resource.data.driverId == request.auth.uid;
      // Business users and admins can read all invoices
      allow read: if isAdmin() || isBusiness();
      // Business users and admins can create invoices
      allow create: if isAdmin() || isBusiness();
      // Drivers can create their own invoices, business users and admins can create any
      allow create: if isAuthenticated() && request.resource.data.driverId == request.auth.uid;
      // Only business users and admins can update/delete invoices
      allow update, delete: if isAdmin() || isBusiness();
    }
    
    // Parking reservations collection
    match /parkingReservations/{reservationId} {
      // Drivers can read/write their own reservations
      allow read, write: if isAuthenticated() && resource.data.driverId == request.auth.uid;
      // Business users and admins can read all reservations
      allow read: if isAdmin() || isBusiness();
      // Only allow creating reservations if the driverId matches the authenticated user
      allow create: if isAuthenticated() && request.resource.data.driverId == request.auth.uid;
      // Business users and admins can update/delete any reservation
      allow update, delete: if isAdmin() || isBusiness();
    }
    
    // QR scan logs collection
    match /qrScanLogs/{logId} {
      // Only business users and admins can read/write scan logs
      allow read, write: if isAdmin() || isBusiness();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Users can only read/write their own notifications
      allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // Only allow creating notifications for the authenticated user
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 5. Set up Firebase Storage

1. Go to **Storage**
2. Click "Get started"
3. Choose "Start in test mode"
4. Select your preferred location
5. Click "Done"

### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // License photos
    match /licenses/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Profile photos
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select **Web** (</>) icon
4. Enter app nickname: `parkshare-web`
5. Click "Register app"
6. Copy the configuration object

Your config will look like:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 7. Update Environment Variables

Update your `.env.local` file with the Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 8. Create Initial Data Structure

### Sample Accounts Collection

Create these documents in the `accounts` collection:

**Admin Account** (Document ID: use Firebase Auth UID)
```json
{
  "accountType": "Admin",
  "email": "admin@parkshare.com",
  "firstName": "System",
  "lastName": "Administrator",
  "isActive": true,
  "adminLevel": "Super",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Municipal Account** (Document ID: use Firebase Auth UID)
```json
{
  "accountType": "Municipal",
  "email": "municipal@city.gov",
  "businessName": "City Parking Authority",
  "contactPerson": "John Smith",
  "address": "123 City Hall, Downtown",
  "totalParkingSlots": 50,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Establishment Account** (Document ID: use Firebase Auth UID)
```json
{
  "accountType": "Establishment",
  "email": "business@mall.com",
  "businessName": "Downtown Shopping Mall",
  "contactPerson": "Jane Doe",
  "address": "456 Shopping District",
  "totalParkingSlots": 200,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Driver Account** (Document ID: use Firebase Auth UID)
```json
{
  "accountType": "Driver",
  "email": "driver@email.com",
  "firstName": "Mike",
  "lastName": "Johnson",
  "licenseId": "DL123456789",
  "licenseVerified": true,
  "availableBalance": 500.00,
  "mobileNumber": "+1234567890",
  "paymentMethod": "GCash",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Sample Parking Slots Collection

```json
{
  "ownerAccountId": "municipal-user-id",
  "slotName": "A1",
  "location": "City Hall Parking Lot",
  "coordinates": {
    "lat": 14.5995,
    "lng": 120.9842
  },
  "ratePerHour": 25.00,
  "isAvailable": true,
  "parkingType": "Open",
  "reservationAllowed": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Sample Vehicle Collection

```json
{
  "driverId": "driver-user-id",
  "plateNumber": "ABC-123",
  "vehicleType": "Sedan",
  "qrCode": "PARKSHARE_vehicle-id_ABC-123_timestamp_random",
  "isCurrentlyParked": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 9. Create Firebase Auth Users

In Firebase Console > Authentication > Users:

1. Click "Add user"
2. Create users with these credentials:

- **Admin**: admin@parkshare.com / demo123
- **Municipal**: municipal@city.gov / demo123  
- **Establishment**: business@mall.com / demo123
- **Driver**: driver@email.com / demo123

## 10. Enable Firebase Extensions (Optional)

Consider enabling these extensions:
- **Trigger Email**: For sending notifications
- **Resize Images**: For profile/license photo processing
- **Delete User Data**: For GDPR compliance

## 11. Set up Firebase Functions (Optional)

For advanced features like automatic invoice generation:

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

## 12. Configure Indexes

Go to Firestore > Indexes and create these composite indexes:

**parkingSlots collection:**
- Fields: `ownerAccountId` (Ascending), `isAvailable` (Ascending)
- Fields: `isAvailable` (Ascending), `createdAt` (Descending)

**parkingInvoices collection:**
- Fields: `driverId` (Ascending), `createdAt` (Descending)
- Fields: `parkingSlotId` (Ascending), `createdAt` (Descending)

**qrScanLogs collection:**
- Fields: `scannedBy` (Ascending), `scanTime` (Descending)
- Fields: `vehicleId` (Ascending), `scanTime` (Descending)

## 13. Testing the Setup

1. Start your Next.js application:
```bash
npm run dev
```

2. Navigate to `http://localhost:8000`
3. Try logging in with the demo accounts
4. Test creating parking slots, vehicles, etc.

## 14. Production Considerations

### Security
- Update Firestore rules for production
- Enable App Check for additional security
- Set up proper CORS policies

### Performance
- Enable offline persistence
- Set up proper indexing
- Configure caching strategies

### Monitoring
- Enable Firebase Analytics
- Set up Crashlytics
- Configure Performance Monitoring

### Backup
- Enable automatic backups
- Set up export schedules
- Configure disaster recovery

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check Firestore security rules
   - Verify user authentication
   - Ensure proper document structure

2. **Configuration Errors**
   - Verify environment variables
   - Check Firebase project settings
   - Ensure proper initialization

3. **Network Issues**
   - Check internet connection
   - Verify Firebase project status
   - Test with different networks

### Debug Mode

Enable debug mode in development:
```javascript
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

This comprehensive setup guide should get your Firebase backend fully configured for the ParkShare system!
