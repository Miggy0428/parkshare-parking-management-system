class Account {
  final String id;
  final String accountType;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? licenseId;
  final String? licensePhoto;
  final bool licenseVerified;
  final double availableBalance;
  final String? mobileNumber;
  final String? address;
  final String? paymentMethod;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;

  Account({
    required this.id,
    required this.accountType,
    required this.email,
    this.firstName,
    this.lastName,
    this.licenseId,
    this.licensePhoto,
    this.licenseVerified = false,
    this.availableBalance = 0.0,
    this.mobileNumber,
    this.address,
    this.paymentMethod,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
  });

  factory Account.fromMap(Map<String, dynamic> map, String id) {
    return Account(
      id: id,
      accountType: map['accountType'] ?? 'Driver',
      email: map['email'] ?? '',
      firstName: map['firstName'],
      lastName: map['lastName'],
      licenseId: map['licenseId'],
      licensePhoto: map['licensePhoto'],
      licenseVerified: map['licenseVerified'] ?? false,
      availableBalance: (map['availableBalance'] ?? 0.0).toDouble(),
      mobileNumber: map['mobileNumber'],
      address: map['address'],
      paymentMethod: map['paymentMethod'],
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      updatedAt: map['updatedAt']?.toDate() ?? DateTime.now(),
      isActive: map['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'accountType': accountType,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'licenseId': licenseId,
      'licensePhoto': licensePhoto,
      'licenseVerified': licenseVerified,
      'availableBalance': availableBalance,
      'mobileNumber': mobileNumber,
      'address': address,
      'paymentMethod': paymentMethod,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'isActive': isActive,
    };
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}
