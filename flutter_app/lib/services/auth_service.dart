import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/account.dart';

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  static User? get currentUser => _auth.currentUser;

  static Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Mock authentication for development
  static Future<Account?> getCurrentUser() async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      // For development, return null to show login screen
      // In production, this would check Firebase Auth state
      return null;
    } catch (e) {
      print('Error getting current user: $e');
      return null;
    }
  }

  static Future<Account> signInWithEmailAndPassword(String email, String password) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 1000));
      
      // Mock authentication - in production, use Firebase Auth
      if (email == 'driver@email.com' && password == 'demo123') {
        return Account(
          id: 'driver_001',
          accountType: 'Driver',
          email: email,
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
      } else {
        throw Exception('Invalid email or password');
      }
    } catch (e) {
      print('Sign in error: $e');
      throw Exception('Login failed: ${e.toString()}');
    }
  }

  static Future<Account> createUserWithEmailAndPassword(
      String email, String password, Map<String, dynamic> userData) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 1200));
      
      // Mock user creation
      final userId = 'user_${DateTime.now().millisecondsSinceEpoch}';
      
      return Account(
        id: userId,
        accountType: 'Driver',
        email: email,
        firstName: userData['firstName'],
        lastName: userData['lastName'],
        licenseId: userData['licenseId'],
        licenseVerified: false,
        availableBalance: 0.0,
        mobileNumber: userData['mobileNumber'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    } catch (e) {
      print('Sign up error: $e');
      throw Exception('Registration failed: ${e.toString()}');
    }
  }

  static Future<void> signOut() async {
    try {
      // In production, would call Firebase Auth signOut
      await Future.delayed(const Duration(milliseconds: 300));
      print('User signed out');
    } catch (e) {
      print('Sign out error: $e');
      throw Exception('Sign out failed');
    }
  }

  static Future<bool> resetPassword(String email) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 800));
      
      // In production, would call Firebase Auth sendPasswordResetEmail
      print('Password reset email sent to: $email');
      return true;
    } catch (e) {
      print('Password reset error: $e');
      return false;
    }
  }

  static Future<bool> updateProfile(Map<String, dynamic> userData) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 600));
      
      // In production, would update Firestore user document
      print('Profile updated: $userData');
      return true;
    } catch (e) {
      print('Profile update error: $e');
      return false;
    }
  }

  static Future<bool> verifyPhoneNumber(String phoneNumber) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 1000));
      
      // In production, would use Firebase Auth phone verification
      print('Phone verification initiated for: $phoneNumber');
      return true;
    } catch (e) {
      print('Phone verification error: $e');
      return false;
    }
  }

  static Future<bool> uploadLicensePhoto(String imagePath) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 1500));
      
      // In production, would upload to Firebase Storage
      print('License photo uploaded: $imagePath');
      return true;
    } catch (e) {
      print('License upload error: $e');
      return false;
    }
  }
}
