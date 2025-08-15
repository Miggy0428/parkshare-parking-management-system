import 'package:flutter/foundation.dart';
import '../models/account.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  Account? _currentUser;
  bool _isLoading = false;
  String? _error;

  Account? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;

  Future<void> checkAuthStatus() async {
    _setLoading(true);
    try {
      _currentUser = await AuthService.getCurrentUser();
      _error = null;
    } catch (e) {
      _error = e.toString();
      _currentUser = null;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    try {
      _currentUser = await AuthService.signInWithEmailAndPassword(email, password);
      _error = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _currentUser = null;
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signUp(String email, String password, Map<String, dynamic> userData) async {
    _setLoading(true);
    try {
      _currentUser = await AuthService.createUserWithEmailAndPassword(email, password, userData);
      _error = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _currentUser = null;
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    _setLoading(true);
    try {
      await AuthService.signOut();
      _currentUser = null;
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
