// Firebase configuration and initialization
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Mock data for development
export const mockData = {
  accounts: [
    {
      id: 'admin_001',
      accountType: 'Admin' as const,
      email: 'admin@parkshare.com',
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      adminLevel: 'Super' as const,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'municipal_001',
      accountType: 'Municipal' as const,
      email: 'municipal@city.gov',
      businessName: 'City Parking Authority',
      contactPerson: 'John Smith',
      address: '123 City Hall, Downtown',
      totalParkingSlots: 50,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'establishment_001',
      accountType: 'Establishment' as const,
      email: 'business@mall.com',
      businessName: 'Downtown Shopping Mall',
      contactPerson: 'Jane Doe',
      address: '456 Shopping District',
      totalParkingSlots: 200,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'driver_001',
      accountType: 'Driver' as const,
      email: 'driver@email.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      licenseId: 'DL123456789',
      licenseVerified: true,
      availableBalance: 500.00,
      mobileNumber: '+1234567890',
      paymentMethod: 'GCash',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  parkingSlots: [
    {
      id: 'slot_001',
      ownerAccountId: 'municipal_001',
      slotName: 'A1',
      location: 'City Hall Parking Lot',
      coordinates: { lat: 14.5995, lng: 120.9842 },
      ratePerHour: 25.00,
      isAvailable: true,
      parkingType: 'Open' as const,
      reservationAllowed: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'slot_002',
      ownerAccountId: 'establishment_001',
      slotName: 'B1',
      location: 'Downtown Mall Parking',
      coordinates: { lat: 14.6000, lng: 120.9850 },
      ratePerHour: 30.00,
      isAvailable: true,
      parkingType: 'Covered' as const,
      reservationAllowed: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'slot_003',
      ownerAccountId: 'municipal_001',
      slotName: 'A2',
      location: 'City Hall Parking Lot',
      coordinates: { lat: 14.5996, lng: 120.9843 },
      ratePerHour: 25.00,
      isAvailable: false,
      currentVehicleId: 'vehicle_001',
      parkingType: 'Open' as const,
      reservationAllowed: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  vehicles: [
    {
      id: 'vehicle_001',
      driverId: 'driver_001',
      plateNumber: 'ABC-123',
      vehicleType: 'Sedan' as const,
      qrCode: 'PARKSHARE_vehicle_001_ABC-123_1234567890_abc123',
      isCurrentlyParked: true,
      currentParkingSlot: 'slot_003',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]
};

// Mock service functions
export const mockFirebaseService = {
  // Account operations
  async getAccount(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return mockData.accounts.find(acc => acc.id === userId) || null;
  },

  async getAllAccounts() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.accounts;
  },

  async getAccountsByType(accountType: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.accounts.filter(acc => acc.accountType === accountType);
  },

  // Parking slot operations
  async getAvailableParkingSlots() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.parkingSlots.filter(slot => slot.isAvailable);
  },

  async getParkingSlotsByOwner(ownerAccountId: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.parkingSlots.filter(slot => slot.ownerAccountId === ownerAccountId);
  },

  // Vehicle operations
  async getUserVehicles(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData.vehicles.filter(vehicle => vehicle.driverId === userId);
  },

  // System statistics
  async getSystemStats() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const drivers = mockData.accounts.filter(acc => acc.accountType === 'Driver');
    const municipals = mockData.accounts.filter(acc => acc.accountType === 'Municipal');
    const establishments = mockData.accounts.filter(acc => acc.accountType === 'Establishment');
    const availableSlots = mockData.parkingSlots.filter(slot => slot.isAvailable);
    const occupiedSlots = mockData.parkingSlots.filter(slot => !slot.isAvailable);

    return {
      totalUsers: mockData.accounts.length,
      totalDrivers: drivers.length,
      totalMunicipals: municipals.length,
      totalEstablishments: establishments.length,
      totalParkingSlots: mockData.parkingSlots.length,
      occupiedSlots: occupiedSlots.length,
      availableSlots: availableSlots.length,
      totalRevenue: 125000,
      todayRevenue: 3500,
      totalCommissions: 12500,
      pendingCommissions: 2100
    };
  },

  // Revenue analytics
  async getRevenueAnalytics(ownerAccountId?: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock revenue data
    const mockAnalytics = {
      totalGrossRevenue: ownerAccountId ? 45000 : 125000,
      totalNetRevenue: ownerAccountId ? 40500 : 112500,
      totalCommissions: ownerAccountId ? 4500 : 12500,
      dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        gross: Math.floor(Math.random() * 2000) + 1000,
        net: Math.floor(Math.random() * 1800) + 900,
        commission: Math.floor(Math.random() * 200) + 100
      })),
      weeklyRevenue: [],
      monthlyRevenue: []
    };

    return mockAnalytics;
  },

  // Real-time parking slots subscription (mock)
  onAvailableSlotsChange(callback: (slots: any[]) => void) {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const availableSlots = mockData.parkingSlots.filter(slot => slot.isAvailable);
      callback(availableSlots);
    }, 5000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  },

  // Reservation operations
  async createReservation(reservationData: any) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const reservationId = `RES_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Reservation created:', reservationId, reservationData);
    return reservationId;
  }
};
