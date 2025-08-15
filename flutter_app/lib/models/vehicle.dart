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

  String get displayName => '$plateNumber ($vehicleType)';
  
  String get statusText => isCurrentlyParked ? 'Parked' : 'Available';
  
  String get vehicleIcon {
    switch (vehicleType.toLowerCase()) {
      case 'motorcycle':
        return '🏍️';
      case 'suv':
        return '🚙';
      case 'truck':
        return '🚚';
      default:
        return '🚗';
    }
  }
}
