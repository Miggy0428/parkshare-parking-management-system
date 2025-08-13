# Comprehensive Parking Management System Plan (Updated)

## System Architecture Overview

### Components:
1. **Admin Dashboard (ParkShare)** - Master dashboard to monitor all clients
2. **Municipal Dashboard** - City parking management with QR scanner access
3. **Establishment Dashboard** - Business parking management with QR scanner access
4. **Flutter Driver App** - Mobile app for drivers
5. **QR Scanner Interface** - Separate interface for entry/exit scanning
6. **Firebase Backend** - Real-time database and authentication

---

## 1. Updated Database Schema

### Collections:

#### Accounts
```typescript
interface Account {
  id: string;
  accountType: 'Driver' | 'Municipal' | 'Establishment' | 'Admin';
  email: string;
  // Driver fields
  firstName?: string;
  lastName?: string;
  licenseId?: string;
  licensePhoto?: string;
  licenseVerified?: boolean;
  availableBalance?: number;
  // Business fields
  contactPerson?: string;
  businessName?: string;
  address?: string;
  totalParkingSlots?: number;
  // Analytics (calculated)
  dailyIncome?: number;
  weeklyIncome?: number;
  monthlyIncome?: number;
  inboundCountToday?: number;
  outboundCountToday?: number;
  // Admin fields
  adminLevel?: 'Super' | 'Support';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

#### Vehicles
```typescript
interface Vehicle {
  id: string;
  driverId: string;
  plateNumber: string;
  vehicleType: 'Sedan' | 'SUV' | 'Motorcycle' | 'Truck';
  qrCode: string; // Unique QR identifier
  lastTimeIn?: Date;
  lastTimeOut?: Date;
  isCurrentlyParked: boolean;
  currentParkingSlot?: string;
}
```

#### ParkingSlots
```typescript
interface ParkingSlot {
  id: string;
  ownerAccountId: string; // Municipal or Establishment
  slotName: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  ratePerHour: number;
  isAvailable: boolean;
  currentVehicleId?: string;
  parkingType: 'Open' | 'Covered' | 'Reserved';
  reservationAllowed: boolean;
  lastEntryTime?: Date;
  lastExitTime?: Date;
}
```

#### ParkingInvoices
```typescript
interface ParkingInvoice {
  id: string;
  driverId: string;
  vehicleId: string;
  parkingSlotId: string;
  qrCodeUsed: string;
  entryTime: Date;
  exitTime?: Date;
  duration?: number; // in hours
  totalAmount: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  paymentMethod: 'GCash' | 'Credit Card' | 'Prepaid';
  reservationId?: string;
}
```

#### ParkingReservations
```typescript
interface ParkingReservation {
  id: string;
  driverId: string;
  vehicleId: string;
  parkingSlotId: string;
  reservationTime: Date;
  duration: number;
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  amountPaid: number;
  qrCode: string; // Generated for this reservation
}
```

#### QRScanLogs
```typescript
interface QRScanLog {
  id: string;
  scannedBy: string; // Account ID of scanner
  vehicleId: string;
  parkingSlotId: string;
  scanType: 'Entry' | 'Exit';
  scanTime: Date;
  location: string;
  deviceInfo?: string;
}
```

---

## 2. Web Dashboards Implementation

### A. Admin Dashboard (ParkShare)

**File: `src/app/admin/page.tsx`**

Features:
- Overview of all municipals and establishments
- Real-time system statistics
- Client management (activate/deactivate accounts)
- Revenue analytics across all partners
- System health monitoring
- User verification management

Key Components:
- Client status cards
- Revenue charts (daily/weekly/monthly)
- Real-time parking occupancy map
- Recent activities feed
- System alerts and notifications

### B. Municipal Dashboard

**File: `src/app/municipal/page.tsx`**

Features:
- City-wide parking overview
- QR scanner interface for personnel
- Revenue tracking
- Vehicle flow analytics
- Pricing management
- Staff management for QR scanning

### C. Establishment Dashboard

**File: `src/app/establishment/page.tsx`**

Features:
- Business parking lot management
- QR scanner interface
- Revenue analytics
- Reservation management
- Pricing controls
- Staff access management

### D. QR Scanner Interface

**File: `src/app/scanner/page.tsx`**

Features:
- Dedicated QR scanning interface
- Entry/Exit processing
- Real-time slot status updates
- Manual override capabilities
- Offline mode support
- Scanner device management

---

## 3. Updated User Workflows

### Driver Journey Implementation:

1. **Onboarding Flow:**
   - Registration with email/phone + OTP
   - Driver's license verification (photo upload + manual approval)
   - Payment method linking (GCash/Card integration)

2. **Booking Flow:**
   - Real-time parking map with availability
   - Slot selection and pre-payment (₱50 + fees)
   - QR code generation for reservation

3. **Parking Flow:**
   - QR scan at entrance (logs entry time)
   - QR scan at exit (calculates final fee)
   - Automatic payment processing

4. **Post-Visit:**
   - Digital receipt generation
   - Rating system for parking experience

### Business Partner Workflow:

1. **Onboarding:**
   - Business document submission
   - Parking layout mapping
   - QR scanner/sensor installation

2. **Daily Operations:**
   - Real-time occupancy monitoring
   - Revenue tracking and analytics
   - Dynamic pricing management

3. **Data Utilization:**
   - Peak hour analysis
   - Staff optimization insights
   - Stakeholder reporting

### Municipality Workflow:

1. **Integration:**
   - Data-sharing agreement setup
   - IoT sensor deployment or personnel QR scanner distribution

2. **Dashboard Management:**
   - City-wide parking heatmap
   - Underutilized space identification
   - Traffic congestion reporting

3. **Policy Making:**
   - Data-driven parking zone planning
   - Dynamic street parking pricing
   - Road pathway optimization (future feature)

---

## 4. Technical Implementation Plan

### Phase 1: Core Infrastructure
1. Firebase setup and configuration
2. Authentication system for all user types
3. Database schema implementation
4. Basic dashboard layouts

### Phase 2: Admin Dashboard
1. ParkShare admin interface
2. Client management system
3. System-wide analytics
4. User verification workflows

### Phase 3: Business Dashboards
1. Municipal dashboard with QR scanner integration
2. Establishment dashboard with reservation management
3. Real-time data synchronization
4. Revenue analytics implementation

### Phase 4: QR Scanner System
1. Dedicated scanner interface
2. Entry/exit processing logic
3. Offline mode capabilities
4. Device management system

### Phase 5: Mobile App Integration
1. Flutter driver app with all features
2. QR code generation and scanning
3. Payment integration
4. Real-time updates

### Phase 6: Advanced Features
1. Dynamic pricing algorithms
2. Predictive analytics
3. IoT sensor integration
4. Advanced reporting systems

---

## 5. Security and Access Control

### Role-Based Access:
- **Super Admin:** Full system access
- **Admin:** Client management and system monitoring
- **Municipal:** City parking management + QR scanning
- **Establishment:** Business parking management + QR scanning
- **Driver:** Mobile app access only
- **Scanner Personnel:** QR scanner interface only

### Security Measures:
- Firebase Authentication with role-based rules
- Encrypted QR codes with time-based validation
- Audit logs for all transactions
- Secure payment processing
- Data privacy compliance

---

## 6. Integration Points

### Payment Systems:
- GCash API integration
- Credit card processing
- Prepaid balance management
- Automatic fee calculation

### Real-time Features:
- WebSocket connections for live updates
- Push notifications for reservations
- Real-time parking availability
- Live revenue tracking

### External Services:
- SMS/Email notifications
- Map services for location
- Cloud storage for documents
- Analytics and reporting tools

---

## 7. NEW FEATURES: Driver Dashboard & Payment Commission System

### A. Driver Dashboard Implementation

**Missing Component:** The system has a Driver role but no corresponding dashboard page.

**File to Create: `src/app/driver/page.tsx`**

Features:
- Real-time available parking space listing
- Interactive parking space cards with details
- Reservation functionality (integrated with payment system)
- Personal parking history
- Payment method management
- Real-time updates of parking availability

Implementation Details:
```typescript
'use client';
// State management for loading, error, parkingSlots
// Data fetching using parkingSlotService.getAvailable()
// Real-time updates with realtimeService.onAvailableSlotsChange
// Responsive grid layout with parking space cards
// Integration with payment system for reservations
```

UI Components:
- Header with user welcome and balance display
- Search and filter functionality for parking spaces
- Grid of parking space cards showing:
  - Placeholder images with descriptive alt text
  - Slot name, location, rate per hour, type
  - Availability status and distance
  - Reserve button with payment integration
- Loading states and error handling
- Empty state when no spaces available

### B. Payment Commission System

**New Database Schema Extensions:**

#### Payments Collection
```typescript
interface Payment {
  id: string;
  invoiceId: string;
  driverId: string;
  parkingSlotId: string;
  ownerAccountId: string; // Municipal/Establishment
  
  // Payment Details
  grossAmount: number;      // Total amount paid by driver
  commissionRate: number;   // 10% (0.10)
  commissionAmount: number; // grossAmount * commissionRate
  netAmount: number;        // grossAmount - commissionAmount
  
  // Payment Method & Status
  paymentMethod: 'GCash' | 'Credit Card' | 'Prepaid';
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  transactionId: string;    // External payment processor ID
  
  // Commission Tracking
  commissionStatus: 'Pending' | 'Collected' | 'Paid';
  commissionCollectedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

#### Commission Reports Collection
```typescript
interface CommissionReport {
  id: string;
  reportPeriod: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  
  // Financial Summary
  totalGrossRevenue: number;
  totalCommissionAmount: number;
  totalNetRevenue: number;
  transactionCount: number;
  
  // Breakdown by Owner
  ownerBreakdown: {
    ownerAccountId: string;
    ownerName: string;
    ownerType: 'Municipal' | 'Establishment';
    grossRevenue: number;
    commissionAmount: number;
    netRevenue: number;
    transactionCount: number;
  }[];
  
  // Status
  reportStatus: 'Generated' | 'Reviewed' | 'Processed';
  generatedAt: Date;
  processedAt?: Date;
}
```

**Files to Create/Update:**

1. **NEW: `src/lib/payment-service.ts`**
   - Payment processing logic
   - Commission calculation (10% deduction)
   - Transaction recording
   - Payment status management

2. **NEW: `src/lib/commission-service.ts`**
   - Commission tracking and reporting
   - Automated report generation
   - Commission payout management
   - Financial analytics

3. **UPDATE: `src/lib/types.ts`**
   - Add Payment and CommissionReport interfaces
   - Update ParkingInvoice to include paymentId reference
   - Add commission-related fields to Account interface

4. **UPDATE: `src/lib/firebase-service.ts`**
   - Add paymentService with CRUD operations
   - Add commissionService integration
   - Update invoiceService for payment integration

5. **UPDATE: `src/app/admin/page.tsx`**
   - Add Commission Reports tab
   - Display commission dashboard with:
     - Total commissions collected
     - Pending commission payments
     - Commission breakdown by partner
     - Export functionality for accounting

6. **UPDATE: `src/app/establishment/page.tsx`**
   - Add Revenue Analytics tab showing:
     - Gross revenue vs net revenue
     - Commission deductions breakdown
     - Payment history with commission details
     - Monthly/weekly revenue trends

7. **UPDATE: `src/app/municipal/page.tsx`**
   - Similar revenue analytics as establishment
   - Municipal-specific commission reporting

8. **UPDATE: `src/app/scanner/page.tsx`**
   - Integrate payment processing on vehicle exit
   - Calculate parking fees with automatic commission deduction
   - Process payments and record transactions

### C. Implementation Phases

**Phase 1: Driver Dashboard (Immediate)**
1. Create `src/app/driver/page.tsx` with parking space listing
2. Implement real-time parking availability updates
3. Add basic UI for viewing available spaces
4. Test with existing Firebase data

**Phase 2: Payment System Foundation**
1. Update `src/lib/types.ts` with new payment interfaces
2. Create `src/lib/payment-service.ts` with core payment logic
3. Implement commission calculation (10% deduction)
4. Create Firebase collections for payments and commission reports

**Phase 3: Commission Tracking**
1. Create `src/lib/commission-service.ts`
2. Implement automated commission calculation
3. Add commission reporting functionality
4. Create admin dashboard for commission management

**Phase 4: UI Integration**
1. Update all dashboards with payment/commission views
2. Integrate payment processing in scanner interface
3. Add revenue analytics to partner dashboards
4. Implement commission payout tracking

**Phase 5: Testing & Optimization**
1. End-to-end payment flow testing
2. Commission calculation validation
3. Performance optimization for financial queries
4. Security audit for payment handling

### D. Commission System Flow

1. **Transaction Processing:**
   - Driver pays for parking (e.g., ₱100)
   - System calculates 10% commission (₱10)
   - Net amount to partner: ₱90
   - Commission to ParkShare: ₱10

2. **Commission Collection:**
   - Daily automated commission calculation
   - Weekly/monthly commission reports
   - Automated transfer to company bank account
   - Partner notification of commission deductions

3. **Reporting & Analytics:**
   - Real-time commission tracking
   - Partner-specific commission reports
   - Financial analytics and forecasting
   - Tax reporting compliance

### E. Security & Compliance

**Financial Security:**
- Encrypted payment data storage
- Secure commission calculation validation
- Audit trails for all financial transactions
- PCI DSS compliance for payment processing

**Access Control:**
- Role-based access to financial data
- Admin-only access to commission reports
- Partner access limited to their own revenue data
- Encrypted API communications

**Data Integrity:**
- Transaction validation and verification
- Automated reconciliation processes
- Backup and recovery for financial data
- Real-time fraud detection

---

This enhanced plan now includes both the driver dashboard for parking space listing and a comprehensive payment commission system that ensures ParkShare receives 10% of all transactions while providing transparent reporting to all stakeholders.
