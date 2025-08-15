import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp, 
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { 
  Account, 
  Vehicle, 
  ParkingSlot, 
  ParkingInvoice, 
  ParkingReservation, 
  QRScanLog, 
  Payment, 
  CommissionReport, 
  SystemStats, 
  RevenueAnalytics,
  ReservationInput 
} from './types';

// Firebase configuration
const firebaseConfig = {
  apiKey: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : '',
  authDomain: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : '',
  projectId: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : '',
  storageBucket: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : '',
  messagingSenderId: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : '',
  appId: typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : ''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collection names
const COLLECTIONS = {
  ACCOUNTS: 'accounts',
  VEHICLES: 'vehicles',
  PARKING_SLOTS: 'parkingSlots',
  PARKING_INVOICES: 'parkingInvoices',
  PARKING_RESERVATIONS: 'parkingReservations',
  QR_SCAN_LOGS: 'qrScanLogs',
  PAYMENTS: 'payments',
  COMMISSION_REPORTS: 'commissionReports'
};

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Helper function to convert Firestore document to typed object
const convertFirestoreDoc = <T>(doc: DocumentSnapshot<DocumentData>, id: string): T => {
  const data = doc.data();
  const converted: any = { ...data, id };
  
  // Convert all timestamp fields to Date objects
  Object.keys(converted).forEach(key => {
    if (converted[key] && typeof converted[key] === 'object' && converted[key].toDate) {
      converted[key] = convertTimestamp(converted[key]);
    }
  });
  
  return converted as T;
};

// Account Operations
const accountService = {
  async getAccount(userId: string): Promise<Account | null> {
    try {
      const docRef = doc(firestore, COLLECTIONS.ACCOUNTS, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirestoreDoc<Account>(docSnap, docSnap.id);
      }
      return null;
    } catch (error) {
      console.error('Error getting account:', error);
      throw new Error('Failed to fetch account data');
    }
  },

  async updateAccount(userId: string, data: Partial<Account>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.ACCOUNTS, userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account');
    }
  },

  async getAllAccounts(): Promise<Account[]> {
    try {
      const querySnapshot = await getDocs(collection(firestore, COLLECTIONS.ACCOUNTS));
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Account>(doc, doc.id));
    } catch (error) {
      console.error('Error getting all accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  },

  async getAccountsByType(accountType: string): Promise<Account[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.ACCOUNTS),
        where('accountType', '==', accountType)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Account>(doc, doc.id));
    } catch (error) {
      console.error('Error getting accounts by type:', error);
      throw new Error('Failed to fetch accounts by type');
    }
  }
};

// Vehicle Operations
const vehicleService = {
  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.VEHICLES),
        where('driverId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<Vehicle>(doc, doc.id));
    } catch (error) {
      console.error('Error getting user vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.VEHICLES));
      await setDoc(docRef, {
        ...vehicle,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw new Error('Failed to add vehicle');
    }
  },

  async updateVehicle(vehicleId: string, data: Partial<Vehicle>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.VEHICLES, vehicleId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw new Error('Failed to update vehicle');
    }
  }
};

// Parking Slot Operations
const parkingSlotService = {
  async getAvailableParkingSlots(): Promise<ParkingSlot[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.PARKING_SLOTS),
        where('isAvailable', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<ParkingSlot>(doc, doc.id));
    } catch (error) {
      console.error('Error getting available parking slots:', error);
      throw new Error('Failed to fetch available parking slots');
    }
  },

  onAvailableSlotsChange(callback: (slots: ParkingSlot[]) => void): () => void {
    const q = query(
      collection(firestore, COLLECTIONS.PARKING_SLOTS),
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const slots = querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<ParkingSlot>(doc, doc.id));
      callback(slots);
    }, (error: Error) => {
      console.error('Error in real-time parking slots listener:', error);
    });

    return unsubscribe;
  },

  async getParkingSlotsByOwner(ownerAccountId: string): Promise<ParkingSlot[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.PARKING_SLOTS),
        where('ownerAccountId', '==', ownerAccountId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<ParkingSlot>(doc, doc.id));
    } catch (error) {
      console.error('Error getting parking slots by owner:', error);
      throw new Error('Failed to fetch parking slots');
    }
  },

  async addParkingSlot(slot: Omit<ParkingSlot, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.PARKING_SLOTS));
      await setDoc(docRef, {
        ...slot,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding parking slot:', error);
      throw new Error('Failed to add parking slot');
    }
  },

  async updateParkingSlot(slotId: string, data: Partial<ParkingSlot>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.PARKING_SLOTS, slotId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating parking slot:', error);
      throw new Error('Failed to update parking slot');
    }
  }
};

// Reservation Operations
const reservationService = {
  async createReservation(reservationData: ReservationInput): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.PARKING_RESERVATIONS));
      const qrCode = `PARKSHARE_${docRef.id}_${Date.now()}`;
      
      await setDoc(docRef, {
        ...reservationData,
        qrCode,
        status: 'Pending',
        amountPaid: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw new Error('Failed to create reservation');
    }
  },

  async getUserReservations(driverId: string): Promise<ParkingReservation[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.PARKING_RESERVATIONS),
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<ParkingReservation>(doc, doc.id));
    } catch (error) {
      console.error('Error getting user reservations:', error);
      throw new Error('Failed to fetch reservations');
    }
  },

  async updateReservation(reservationId: string, data: Partial<ParkingReservation>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.PARKING_RESERVATIONS, reservationId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw new Error('Failed to update reservation');
    }
  }
};

// Invoice Operations
const invoiceService = {
  async createInvoice(invoiceData: Omit<ParkingInvoice, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.PARKING_INVOICES));
      await setDoc(docRef, {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  },

  async getInvoicesByDriver(driverId: string): Promise<ParkingInvoice[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.PARKING_INVOICES),
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<ParkingInvoice>(doc, doc.id));
    } catch (error) {
      console.error('Error getting invoices by driver:', error);
      throw new Error('Failed to fetch invoices');
    }
  },

  async updateInvoice(invoiceId: string, data: Partial<ParkingInvoice>): Promise<boolean> {
    try {
      const docRef = doc(firestore, COLLECTIONS.PARKING_INVOICES, invoiceId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw new Error('Failed to update invoice');
    }
  }
};

// Payment Operations
const paymentService = {
  async createPayment(paymentData: Omit<Payment, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.PAYMENTS));
      await setDoc(docRef, {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  },

  async getPaymentsByOwner(ownerAccountId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.PAYMENTS),
        where('ownerAccountId', '==', ownerAccountId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Payment>(doc, doc.id));
    } catch (error) {
      console.error('Error getting payments by owner:', error);
      throw new Error('Failed to fetch payments');
    }
  },

  async getAllPayments(): Promise<Payment[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.PAYMENTS),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Payment>(doc, doc.id));
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }
};

// System Statistics
const systemService = {
  async getSystemStats(): Promise<SystemStats> {
    try {
      // Get all accounts
      const accounts = await accountService.getAllAccounts();
      const drivers = accounts.filter(acc => acc.accountType === 'Driver');
      const municipals = accounts.filter(acc => acc.accountType === 'Municipal');
      const establishments = accounts.filter(acc => acc.accountType === 'Establishment');

      // Get all parking slots
      const allSlotsQuery = await getDocs(collection(firestore, COLLECTIONS.PARKING_SLOTS));
      const allSlots = allSlotsQuery.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<ParkingSlot>(doc, doc.id));
      const availableSlots = allSlots.filter((slot: ParkingSlot) => slot.isAvailable);
      const occupiedSlots = allSlots.filter((slot: ParkingSlot) => !slot.isAvailable);

      // Get payment data for revenue calculation
      const payments = await paymentService.getAllPayments();
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.grossAmount, 0);
      const totalCommissions = payments.reduce((sum, payment) => sum + payment.commissionAmount, 0);
      const pendingCommissions = payments
        .filter(payment => payment.commissionStatus === 'Pending')
        .reduce((sum, payment) => sum + payment.commissionAmount, 0);

      // Calculate today's revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayPayments = payments.filter(payment => payment.createdAt >= today);
      const todayRevenue = todayPayments.reduce((sum, payment) => sum + payment.grossAmount, 0);

      return {
        totalUsers: accounts.length,
        totalDrivers: drivers.length,
        totalMunicipals: municipals.length,
        totalEstablishments: establishments.length,
        totalParkingSlots: allSlots.length,
        occupiedSlots: occupiedSlots.length,
        availableSlots: availableSlots.length,
        totalRevenue,
        todayRevenue,
        totalCommissions,
        pendingCommissions
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw new Error('Failed to fetch system statistics');
    }
  },

  async getRevenueAnalytics(ownerAccountId?: string): Promise<RevenueAnalytics> {
    try {
      let payments: Payment[];
      
      if (ownerAccountId) {
        payments = await paymentService.getPaymentsByOwner(ownerAccountId);
      } else {
        payments = await paymentService.getAllPayments();
      }

      const totalGrossRevenue = payments.reduce((sum, payment) => sum + payment.grossAmount, 0);
      const totalNetRevenue = payments.reduce((sum, payment) => sum + payment.netAmount, 0);
      const totalCommissions = payments.reduce((sum, payment) => sum + payment.commissionAmount, 0);

      // Group by day, week, month (simplified implementation)
      const dailyRevenue: { date: string; gross: number; net: number; commission: number }[] = [];
      const weeklyRevenue: { week: string; gross: number; net: number; commission: number }[] = [];
      const monthlyRevenue: { month: string; gross: number; net: number; commission: number }[] = [];

      // This is a simplified implementation - in production, you'd want more sophisticated grouping
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      last30Days.forEach(dateStr => {
        const dayPayments = payments.filter(payment => 
          payment.createdAt.toISOString().split('T')[0] === dateStr
        );
        
        dailyRevenue.push({
          date: dateStr,
          gross: dayPayments.reduce((sum, p) => sum + p.grossAmount, 0),
          net: dayPayments.reduce((sum, p) => sum + p.netAmount, 0),
          commission: dayPayments.reduce((sum, p) => sum + p.commissionAmount, 0)
        });
      });

      return {
        totalGrossRevenue,
        totalNetRevenue,
        totalCommissions,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue
      };
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw new Error('Failed to fetch revenue analytics');
    }
  }
};

// QR Scan Log Operations
const qrScanService = {
  async logScan(scanData: Omit<QRScanLog, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.QR_SCAN_LOGS));
      await setDoc(docRef, {
        ...scanData,
        scanTime: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging QR scan:', error);
      throw new Error('Failed to log QR scan');
    }
  },

  async getScanLogs(scannedBy?: string): Promise<QRScanLog[]> {
    try {
      let q;
      if (scannedBy) {
        q = query(
          collection(firestore, COLLECTIONS.QR_SCAN_LOGS),
          where('scannedBy', '==', scannedBy),
          orderBy('scanTime', 'desc'),
          limit(100)
        );
      } else {
        q = query(
          collection(firestore, COLLECTIONS.QR_SCAN_LOGS),
          orderBy('scanTime', 'desc'),
          limit(100)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<QRScanLog>(doc, doc.id));
    } catch (error) {
      console.error('Error getting scan logs:', error);
      throw new Error('Failed to fetch scan logs');
    }
  }
};

// Commission Report Operations
const commissionService = {
  async createCommissionReport(reportData: Omit<CommissionReport, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(firestore, COLLECTIONS.COMMISSION_REPORTS));
      await setDoc(docRef, {
        ...reportData,
        generatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating commission report:', error);
      throw new Error('Failed to create commission report');
    }
  },

  async getCommissionReports(): Promise<CommissionReport[]> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.COMMISSION_REPORTS),
        orderBy('generatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => convertFirestoreDoc<CommissionReport>(doc, doc.id));
    } catch (error) {
      console.error('Error getting commission reports:', error);
      throw new Error('Failed to fetch commission reports');
    }
  }
};

// Export all services
export {
  accountService,
  vehicleService,
  parkingSlotService,
  reservationService,
  invoiceService,
  paymentService,
  systemService,
  qrScanService,
  commissionService
};
