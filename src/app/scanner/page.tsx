'use client';

import { useState, useEffect } from 'react';
import { mockFirebaseService } from '../../lib/firebase-config-fixed';
import { paymentService } from '../../lib/payment-service';

export default function QRScanner() {
  const [scanResult, setScanResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState<'entry' | 'exit'>('entry');
  const [manualEntry, setManualEntry] = useState('');
  const [recentScans, setRecentScans] = useState<any[]>([]);

  // Mock scanner operator ID - in real app, this would come from authentication
  const scannerId = 'scanner_001';

  useEffect(() => {
    // Load recent scan history
    loadRecentScans();
  }, []);

  const loadRecentScans = async () => {
    try {
      // In real implementation, would fetch from Firebase
      const mockScans = [
        {
          id: 'scan_001',
          vehicleId: 'ABC-123',
          slotId: 'A1',
          scanType: 'Entry',
          scanTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          location: 'City Hall Parking'
        },
        {
          id: 'scan_002',
          vehicleId: 'XYZ-789',
          slotId: 'B1',
          scanType: 'Exit',
          scanTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          location: 'Downtown Mall'
        }
      ];
      setRecentScans(mockScans);
    } catch (error) {
      console.error('Error loading recent scans:', error);
    }
  };

  const handleScan = async (type: 'entry' | 'exit', qrCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Use provided QR code or simulate scanning
      const scannedCode = qrCode || `PARKSHARE_vehicle_${Date.now()}_${type}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Parse QR code to extract vehicle and slot information
      const qrData = parseQRCode(scannedCode);
      
      if (!qrData) {
        throw new Error('Invalid QR code format');
      }

      // Process the scan based on type
      if (type === 'entry') {
        await processEntry(qrData);
        setSuccess(`Vehicle ${qrData.vehicleId} successfully checked in to slot ${qrData.slotId}`);
      } else {
        await processExit(qrData);
        setSuccess(`Vehicle ${qrData.vehicleId} successfully checked out. Payment processed.`);
      }

      setScanResult(scannedCode);
      
      // Add to recent scans
      const newScan = {
        id: `scan_${Date.now()}`,
        vehicleId: qrData.vehicleId,
        slotId: qrData.slotId,
        scanType: type === 'entry' ? 'Entry' : 'Exit',
        scanTime: new Date(),
        location: 'Current Location'
      };
      setRecentScans(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10 scans

    } catch (err: any) {
      setError(err.message || 'Scanning failed. Please try again.');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseQRCode = (qrCode: string) => {
    try {
      // Expected format: PARKSHARE_vehicleId_plateNumber_timestamp_random
      const parts = qrCode.split('_');
      if (parts.length >= 3 && parts[0] === 'PARKSHARE') {
        return {
          vehicleId: parts[2] || 'Unknown', // Use plate number as vehicle ID
          slotId: 'A1', // In real implementation, this would be determined by location/scanner
          timestamp: parts[3] || Date.now().toString()
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const processEntry = async (qrData: any) => {
    // In real implementation, would:
    // 1. Verify QR code validity
    // 2. Check if slot is available
    // 3. Update slot status to occupied
    // 4. Create parking session record
    // 5. Log the entry scan

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
    console.log('Processing entry for:', qrData);
  };

  const processExit = async (qrData: any) => {
    // In real implementation, would:
    // 1. Calculate parking duration
    // 2. Calculate total fee
    // 3. Process payment with commission
    // 4. Update slot status to available
    // 5. Generate receipt
    // 6. Log the exit scan

    // Simulate payment processing
    const mockPaymentData = {
      invoiceId: `INV_${Date.now()}`,
      driverId: 'driver_001',
      parkingSlotId: qrData.slotId,
      ownerAccountId: 'municipal_001',
      grossAmount: 75.00,
      paymentMethod: 'GCash' as const,
      transactionId: `TXN_${Date.now()}`
    };

    await paymentService.processPayment(mockPaymentData);
    console.log('Processing exit and payment for:', qrData);
  };

  const handleManualEntry = async () => {
    if (!manualEntry.trim()) {
      setError('Please enter a QR code or vehicle ID');
      return;
    }

    await handleScan(scanMode, manualEntry);
    setManualEntry('');
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
    setScanResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Scanner Interface</h1>
            <p className="text-gray-600">Vehicle Entry/Exit Processing</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={clearMessages}
              className="btn-secondary"
            >
              Clear
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="max-w-4xl mx-auto">
          {/* Scanner Mode Selection */}
          <div className="dashboard-card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanner Mode</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setScanMode('entry')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  scanMode === 'entry'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vehicle Entry
              </button>
              <button
                onClick={() => setScanMode('exit')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  scanMode === 'exit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vehicle Exit
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="error-message mb-6">
              <h4 className="font-semibold mb-1">Scan Error</h4>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="success-message mb-6">
              <h4 className="font-semibold mb-1">Scan Successful</h4>
              <p>{success}</p>
            </div>
          )}

          {/* Main Scanner Interface */}
          <div className="dashboard-card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {scanMode === 'entry' ? 'Vehicle Entry Scanner' : 'Vehicle Exit Scanner'}
            </h3>
            
            <div className="text-center">
              {/* Camera Preview Placeholder */}
              <div className="w-80 h-80 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-lg font-medium">QR Scanner Camera View</p>
                  <p className="text-sm">Position QR code within the frame</p>
                </div>
              </div>

              {/* Scan Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => handleScan(scanMode)}
                  disabled={loading}
                  className={`btn-primary text-lg px-8 py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Scan for ${scanMode === 'entry' ? 'Entry' : 'Exit'}`
                  )}
                </button>

                <p className="text-sm text-gray-600">
                  Click to simulate QR code scanning
                </p>
              </div>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="dashboard-card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h3>
            <div className="flex space-x-4">
              <input
                type="text"
                value={manualEntry}
                onChange={(e) => setManualEntry(e.target.value)}
                placeholder="Enter QR code or vehicle plate number"
                className="input-field flex-1"
              />
              <button
                onClick={handleManualEntry}
                disabled={loading}
                className="btn-secondary"
              >
                Process
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Use this for manual entry when QR scanning is not available
            </p>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className="dashboard-card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Scan Result</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">QR Code Data:</p>
                <p className="font-mono text-sm bg-white p-2 rounded border">{scanResult}</p>
              </div>
            </div>
          )}

          {/* Recent Scans */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentScans.map((scan) => (
                    <tr key={scan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {scan.vehicleId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.slotId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          scan.scanType === 'Entry' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {scan.scanType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.scanTime.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {recentScans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No recent scans available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
