// Core Account Interface
export interface Account {
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
  mobileNumber?: string;
  address?: string;
  paymentMethod?: string;
  // Business fields
  contactPerson?: string;
  businessName?: string;
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

// Vehicle Interface
export interface Vehicle {
  id: string;
  driverId: string;
  plateNumber: string;
  vehicleType: 'Sedan' | 'SUV' | 'Motorcycle' | 'Truck';
  qrCode: string; // Unique QR identifier
  lastTimeIn?: Date;
  lastTimeOut?: Date;
  isCurrentlyParked: boolean;
  currentParkingSlot?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Parking Slot Interface
export interface ParkingSlot {
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
  createdAt: Date;
  updatedAt: Date;
}

// Updated Parking Invoice Interface (with payment reference)
export interface ParkingInvoice {
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
  paymentId?: string; // New reference for payment
  createdAt: Date;
  updatedAt: Date;
}

// Parking Reservation Interface
export interface ParkingReservation {
  id: string;
  driverId: string;
  vehicleId: string;
  parkingSlotId: string;
  reservationTime: Date;
  duration: number;
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  amountPaid: number;
  qrCode: string; // Generated for this reservation
  createdAt: Date;
  updatedAt: Date;
}

// QR Scan Log Interface
export interface QRScanLog {
  id: string;
  scannedBy: string; // Account ID of scanner
  vehicleId: string;
  parkingSlotId: string;
  scanType: 'Entry' | 'Exit';
  scanTime: Date;
  location: string;
  deviceInfo?: string;
}

// NEW: Payment Interface for Commission System
export interface Payment {
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

// NEW: Commission Report Interface
export interface CommissionReport {
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

// System Statistics Interface for Admin Dashboard
export interface SystemStats {
  totalUsers: number;
  totalDrivers: number;
  totalMunicipals: number;
  totalEstablishments: number;
  totalParkingSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCommissions: number;
  pendingCommissions: number;
}

// Revenue Analytics Interface
export interface RevenueAnalytics {
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalCommissions: number;
  dailyRevenue: { date: string; gross: number; net: number; commission: number }[];
  weeklyRevenue: { week: string; gross: number; net: number; commission: number }[];
  monthlyRevenue: { month: string; gross: number; net: number; commission: number }[];
}

// Input types for service functions
export interface PaymentInput {
  invoiceId: string;
  driverId: string;
  parkingSlotId: string;
  ownerAccountId: string;
  grossAmount: number;
  paymentMethod: 'GCash' | 'Credit Card' | 'Prepaid';
  transactionId: string;
}

export interface ReservationInput {
  driverId: string;
  vehicleId: string;
  parkingSlotId: string;
  duration: number;
  reservationTime: Date;
}
