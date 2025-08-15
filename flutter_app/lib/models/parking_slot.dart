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
  
  String get availabilityStatus => isAvailable ? 'Available' : 'Occupied';
  
  String get typeIcon {
    switch (parkingType) {
      case 'Covered':
        return '🏢';
      case 'Reserved':
        return '🔒';
      default:
        return '🅿️';
    }
  }
}
