import 'package:flutter/foundation.dart';
import '../models/vehicle.dart';
import '../services/firebase_service.dart';

class VehicleProvider with ChangeNotifier {
  List<Vehicle> _userVehicles = [];
  Vehicle? _selectedVehicle;
  bool _isLoading = false;
  String? _error;

  List<Vehicle> get userVehicles => _userVehicles;
  Vehicle? get selectedVehicle => _selectedVehicle;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadUserVehicles(String userId) async {
    _setLoading(true);
    try {
      _userVehicles = await FirebaseService.getUserVehicles(userId);
      
      // Set first vehicle as selected if none is selected
      if (_selectedVehicle == null && _userVehicles.isNotEmpty) {
        _selectedVehicle = _userVehicles.first;
      }
      
      _error = null;
    } catch (e) {
      _error = 'Failed to load vehicles: ${e.toString()}';
      _userVehicles = [];
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> addVehicle(String userId, Map<String, dynamic> vehicleData) async {
    _setLoading(true);
    try {
      final vehicleId = await FirebaseService.addVehicle({
        ...vehicleData,
        'driverId': userId,
        'qrCode': _generateQRCode(vehicleData['plateNumber']),
        'isCurrentlyParked': false,
        'createdAt': DateTime.now(),
        'updatedAt': DateTime.now(),
      });

      if (vehicleId != null) {
        await loadUserVehicles(userId);
        _error = null;
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Failed to add vehicle: ${e.toString()}';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> updateVehicle(String vehicleId, Map<String, dynamic> updates) async {
    _setLoading(true);
    try {
      final success = await FirebaseService.updateVehicle(vehicleId, {
        ...updates,
        'updatedAt': DateTime.now(),
      });

      if (success) {
        // Update local state
        _userVehicles = _userVehicles.map((vehicle) {
          if (vehicle.id == vehicleId) {
            return Vehicle.fromMap({
              ...vehicle.toMap(),
              ...updates,
              'updatedAt': DateTime.now(),
            }, vehicleId);
          }
          return vehicle;
        }).toList();

        // Update selected vehicle if it was the one updated
        if (_selectedVehicle?.id == vehicleId) {
          _selectedVehicle = _userVehicles.firstWhere((v) => v.id == vehicleId);
        }

        _error = null;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Failed to update vehicle: ${e.toString()}';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> deleteVehicle(String vehicleId) async {
    _setLoading(true);
    try {
      final success = await FirebaseService.deleteVehicle(vehicleId);
      
      if (success) {
        _userVehicles.removeWhere((vehicle) => vehicle.id == vehicleId);
        
        // Update selected vehicle if it was deleted
        if (_selectedVehicle?.id == vehicleId) {
          _selectedVehicle = _userVehicles.isNotEmpty ? _userVehicles.first : null;
        }
        
        _error = null;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Failed to delete vehicle: ${e.toString()}';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  void selectVehicle(Vehicle vehicle) {
    _selectedVehicle = vehicle;
    notifyListeners();
  }

  void selectVehicleById(String vehicleId) {
    final vehicle = _userVehicles.firstWhere(
      (v) => v.id == vehicleId,
      orElse: () => _userVehicles.isNotEmpty ? _userVehicles.first : throw Exception('No vehicles found'),
    );
    selectVehicle(vehicle);
  }

  String _generateQRCode(String plateNumber) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final random = (timestamp % 10000).toString();
    return 'PARKSHARE_${plateNumber}_${timestamp}_$random';
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Get vehicle by ID
  Vehicle? getVehicleById(String vehicleId) {
    try {
      return _userVehicles.firstWhere((vehicle) => vehicle.id == vehicleId);
    } catch (e) {
      return null;
    }
  }

  // Get currently parked vehicles
  List<Vehicle> get parkedVehicles {
    return _userVehicles.where((vehicle) => vehicle.isCurrentlyParked).toList();
  }

  // Get available vehicles (not currently parked)
  List<Vehicle> get availableVehicles {
    return _userVehicles.where((vehicle) => !vehicle.isCurrentlyParked).toList();
  }
}
