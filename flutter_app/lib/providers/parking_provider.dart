import 'package:flutter/foundation.dart';
import '../models/parking_slot.dart';
import '../services/firebase_service.dart';

class ParkingProvider with ChangeNotifier {
  List<ParkingSlot> _availableSlots = [];
  List<ParkingSlot> _userReservations = [];
  bool _isLoading = false;
  String? _error;

  List<ParkingSlot> get availableSlots => _availableSlots;
  List<ParkingSlot> get userReservations => _userReservations;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadAvailableSlots() async {
    _setLoading(true);
    try {
      _availableSlots = await FirebaseService.getAvailableParkingSlots();
      _error = null;
    } catch (e) {
      _error = 'Failed to load parking slots: ${e.toString()}';
      _availableSlots = [];
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadUserReservations(String userId) async {
    _setLoading(true);
    try {
      _userReservations = await FirebaseService.getUserReservations(userId);
      _error = null;
    } catch (e) {
      _error = 'Failed to load reservations: ${e.toString()}';
      _userReservations = [];
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> reserveSlot(String slotId, String userId, String vehicleId, int duration) async {
    _setLoading(true);
    try {
      final success = await FirebaseService.createReservation({
        'slotId': slotId,
        'userId': userId,
        'vehicleId': vehicleId,
        'duration': duration,
        'reservationTime': DateTime.now(),
      });

      if (success) {
        // Update local state
        _availableSlots = _availableSlots.map((slot) {
          if (slot.id == slotId) {
            return ParkingSlot(
              id: slot.id,
              ownerAccountId: slot.ownerAccountId,
              slotName: slot.slotName,
              location: slot.location,
              coordinates: slot.coordinates,
              ratePerHour: slot.ratePerHour,
              isAvailable: false,
              currentVehicleId: vehicleId,
              parkingType: slot.parkingType,
              reservationAllowed: slot.reservationAllowed,
              lastEntryTime: slot.lastEntryTime,
              lastExitTime: slot.lastExitTime,
              createdAt: slot.createdAt,
              updatedAt: DateTime.now(),
            );
          }
          return slot;
        }).toList();
        
        _error = null;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Failed to reserve slot: ${e.toString()}';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> cancelReservation(String reservationId) async {
    _setLoading(true);
    try {
      final success = await FirebaseService.cancelReservation(reservationId);
      if (success) {
        await loadAvailableSlots();
        _error = null;
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Failed to cancel reservation: ${e.toString()}';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  List<ParkingSlot> filterSlots({
    String? searchQuery,
    String? parkingType,
    String? sortBy,
  }) {
    List<ParkingSlot> filtered = List.from(_availableSlots);

    // Apply search filter
    if (searchQuery != null && searchQuery.isNotEmpty) {
      filtered = filtered.where((slot) =>
          slot.location.toLowerCase().contains(searchQuery.toLowerCase()) ||
          slot.slotName.toLowerCase().contains(searchQuery.toLowerCase())).toList();
    }

    // Apply type filter
    if (parkingType != null && parkingType != 'All Types') {
      filtered = filtered.where((slot) => slot.parkingType == parkingType).toList();
    }

    // Apply sorting
    if (sortBy != null) {
      switch (sortBy) {
        case 'Price':
          filtered.sort((a, b) => a.ratePerHour.compareTo(b.ratePerHour));
          break;
        case 'Distance':
          // In a real app, this would calculate actual distance
          filtered.sort((a, b) => a.slotName.compareTo(b.slotName));
          break;
        case 'Rating':
          // In a real app, this would sort by user ratings
          filtered.sort((a, b) => b.slotName.compareTo(a.slotName));
          break;
      }
    }

    return filtered;
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Real-time updates simulation
  void startRealtimeUpdates() {
    // In a real app, this would set up Firebase listeners
    // For now, we'll simulate with periodic updates
    Future.delayed(const Duration(seconds: 30), () {
      if (_availableSlots.isNotEmpty) {
        loadAvailableSlots();
        startRealtimeUpdates();
      }
    });
  }
}
