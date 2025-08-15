import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/account.dart';
import '../models/parking_slot.dart';

class FirebaseService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Collections
  static const String _accountsCollection = 'accounts';
  static const String _parkingSlotsCollection = 'parkingSlots';
  static const String _vehiclesCollection = 'vehicles';
  static const String _reservationsCollection = 'parkingReservations';

  // Mock data for development
  static final List<Map<String, dynamic>> _mockParkingSlots = [
    {
      'id': 'slot_001',
      'ownerAccountId': 'municipal_001',
      'slotName': 'A1',
      'location': 'City Hall Parking Lot',
      'coordinates': {'lat': 14.5995, 'lng': 120.9842},
      'ratePerHour': 25.0,
      'isAvailable': true,
      'parkingType': 'Open',
      'reservationAllowed': true,
      'createdAt': DateTime.now(),
      'updatedAt': DateTime.now(),
    },
    {
      'id': 'slot_002',
      'ownerAccountId': 'establishment_001',
      'slotName': 'B1',
      'location': 'Downtown Mall Parking',
      'coordinates': {'lat': 14.6000, 'lng': 120.9850},
      'ratePerHour': 30.0,
      'isAvailable': true,
      'parkingType': 'Covered',
      'reservationAllowed': true,
      'createdAt': DateTime.now(),
      'updatedAt': DateTime.now(),
    },
    {
      'id': 'slot_003',
      'ownerAccountId': 'municipal_001',
      'slotName': 'A2',
      'location': 'City Hall Parking Lot',
      'coordinates': {'lat': 14.5996, 'lng': 120.9843},
      'ratePerHour': 25.0,
      'isAvailable': false,
      'currentVehicleId': 'vehicle_001',
      'parkingType': 'Open',
      'reservationAllowed': true,
      'createdAt': DateTime.now(),
      'updatedAt': DateTime.now(),
    },
  ];

  // Account Operations
  static Future<Account?> getAccount(String userId) async {
    try {
      // In development, return mock data
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Mock account data
      return Account(
        id: userId,
        accountType: 'Driver',
        email: 'driver@email.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        licenseId: 'DL123456789',
        licenseVerified: true,
        availableBalance: 500.0,
        mobileNumber: '+1234567890',
        paymentMethod: 'GCash',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    } catch (error) {
      print('Error getting account: $error');
      return null;
    }
  }

  // Parking Slot Operations
  static Future<List<ParkingSlot>> getAvailableParkingSlots() async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 800));
      
      // Return mock data for development
      return _mockParkingSlots
          .where((slot) => slot['isAvailable'] == true)
          .map((slotData) => ParkingSlot.fromMap(slotData, slotData['id']))
          .toList();
    } catch (error) {
      print('Error getting parking slots: $error');
      throw Exception('Failed to load parking slots');
    }
  }

  // Vehicle Operations
  static Future<List<dynamic>> getUserVehicles(String userId) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Return mock vehicle data
      return [
        {
          'id': 'vehicle_001',
          'driverId': userId,
          'plateNumber': 'ABC-123',
          'vehicleType': 'Sedan',
          'qrCode': 'PARKSHARE_vehicle_001_ABC-123_1234567890_abc123',
          'isCurrentlyParked': false,
          'createdAt': DateTime.now(),
          'updatedAt': DateTime.now(),
        }
      ];
    } catch (error) {
      print('Error getting vehicles: $error');
      return [];
    }
  }

  static Future<String?> addVehicle(Map<String, dynamic> vehicleData) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 600));
      
      // In real implementation, would add to Firestore
      final vehicleId = 'vehicle_${DateTime.now().millisecondsSinceEpoch}';
      print('Vehicle added: $vehicleId');
      return vehicleId;
    } catch (error) {
      print('Error adding vehicle: $error');
      return null;
    }
  }

  static Future<bool> updateVehicle(String vehicleId, Map<String, dynamic> data) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 400));
      
      print('Vehicle updated: $vehicleId');
      return true;
    } catch (error) {
      print('Error updating vehicle: $error');
      return false;
    }
  }

  static Future<bool> deleteVehicle(String vehicleId) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 400));
      
      print('Vehicle deleted: $vehicleId');
      return true;
    } catch (error) {
      print('Error deleting vehicle: $error');
      return false;
    }
  }

  // Reservation Operations
  static Future<bool> createReservation(Map<String, dynamic> reservationData) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 700));
      
      final reservationId = 'reservation_${DateTime.now().millisecondsSinceEpoch}';
      print('Reservation created: $reservationId');
      return true;
    } catch (error) {
      print('Error creating reservation: $error');
      return false;
    }
  }

  static Future<List<dynamic>> getUserReservations(String userId) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Return mock reservation data
      return [
        {
          'id': 'reservation_001',
          'driverId': userId,
          'vehicleId': 'vehicle_001',
          'parkingSlotId': 'slot_001',
          'reservationTime': DateTime.now().subtract(const Duration(hours: 2)),
          'duration': 2,
          'status': 'Active',
          'amountPaid': 50.0,
          'qrCode': 'PARKSHARE_reservation_001_${DateTime.now().millisecondsSinceEpoch}',
        }
      ];
    } catch (error) {
      print('Error getting reservations: $error');
      return [];
    }
  }

  static Future<bool> cancelReservation(String reservationId) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      print('Reservation cancelled: $reservationId');
      return true;
    } catch (error) {
      print('Error cancelling reservation: $error');
      return false;
    }
  }

  // Real-time updates (mock implementation)
  static Stream<List<ParkingSlot>> getAvailableParkingSlotsStream() {
    return Stream.periodic(const Duration(seconds: 30), (count) {
      return _mockParkingSlots
          .where((slot) => slot['isAvailable'] == true)
          .map((slotData) => ParkingSlot.fromMap(slotData, slotData['id']))
          .toList();
    });
  }
}
