'use client';

import { useEffect, useState } from 'react';
import { mockFirebaseService } from '../../lib/firebase-config-fixed';
import { ParkingSlot, RevenueAnalytics } from '../../lib/types';

export default function MunicipalDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'analytics' | 'scanner'>('overview');

  // Mock municipal account ID - in real app, this would come from authentication
  const municipalAccountId = 'municipal_001';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [slotsData, analyticsData] = await Promise.all([
          mockFirebaseService.getParkingSlotsByOwner(municipalAccountId),
          mockFirebaseService.getRevenueAnalytics(municipalAccountId)
        ]);
        
        setParkingSlots(slotsData);
        setRevenueAnalytics(analyticsData);
      } catch (err: any) {
        setError('Failed to load municipal dashboard data. Please try again.');
        console.error('Municipal dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time parking slots updates
    const unsubscribe = mockFirebaseService.onAvailableSlotsChange((updatedSlots) => {
      // Filter for this municipal's slots
      const municipalSlots = updatedSlots.filter(slot => slot.ownerAccountId === municipalAccountId);
      setParkingSlots(prev => {
        // Update existing slots with new availability status
        return prev.map(slot => {
          const updated = municipalSlots.find(s => s.id === slot.id);
          return updated ? { ...slot, ...updated } : slot;
        });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [municipalAccountId]);

  const handleSlotToggle = async (slotId: string, currentStatus: boolean) => {
    try {
      // In real implementation, would update Firebase
      setParkingSlots(prev => 
        prev.map(slot => 
          slot.id === slotId 
            ? { ...slot, isAvailable: !currentStatus }
            : slot
        )
      );
      console.log(`Toggled slot ${slotId} to ${!currentStatus ? 'available' : 'occupied'}`);
    } catch (error) {
      console.error('Error toggling slot:', error);
      alert('Failed to update slot status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading municipal dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="error-message max-w-md">
          <h2 className="text-lg font-semibold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = parkingSlots.filter(slot => slot.isAvailable);
  const occupiedSlots = parkingSlots.filter(slot => !slot.isAvailable);
  const occupancyRate = parkingSlots.length > 0 ? (occupiedSlots.length / parkingSlots.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Municipal Dashboard</h1>
            <p className="text-gray-600">City Parking Authority - Parking Management</p>
          </div>
          <div className="flex space-x-4">
            <button className="btn-secondary">
              Add New Slot
            </button>
            <button className="btn-primary">
              QR Scanner
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'slots', label: 'Parking Slots' },
              { id: 'analytics', label: 'Revenue Analytics' },
              { id: 'scanner', label: 'QR Scanner' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div>
            {/* Statistics */}
            <div className="stats-grid">
              <div className="dashboard-stat">
                <div className="dashboard-stat-value">{parkingSlots.length}</div>
                <div className="dashboard-stat-label">Total Slots</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-value text-green-600">{availableSlots.length}</div>
                <div className="dashboard-stat-label">Available</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-value text-red-600">{occupiedSlots.length}</div>
                <div className="dashboard-stat-label">Occupied</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat-value">{occupancyRate.toFixed(1)}%</div>
                <div className="dashboard-stat-label">Occupancy Rate</div>
              </div>
            </div>

            {/* Quick Overview */}
            <div className="content-grid">
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vehicle ABC-123 entered</p>
                      <p className="text-xs text-gray-500">Slot A1 • 2 minutes ago</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Entry</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vehicle XYZ-789 exited</p>
                      <p className="text-xs text-gray-500">Slot A3 • 15 minutes ago</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Exit</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment received</p>
                      <p className="text-xs text-gray-500">₱75.00 • 20 minutes ago</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Payment</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Entries</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Exits</span>
                    <span className="font-semibold">22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue (Gross)</span>
                    <span className="font-semibold text-green-600">₱1,850</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue (Net)</span>
                    <span className="font-semibold text-blue-600">₱1,665</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Commission</span>
                    <span className="font-semibold text-purple-600">₱185</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slots' && (
          <div>
            <div className="dashboard-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Parking Slots Management</h3>
                <div className="flex space-x-2">
                  <button className="btn-secondary">Filter</button>
                  <button className="btn-primary">Add New Slot</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parkingSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`parking-slot-card ${
                      slot.isAvailable ? 'parking-slot-available' : 'parking-slot-occupied'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{slot.slotName}</h4>
                        <p className="text-sm text-gray-600">{slot.location}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          slot.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {slot.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-medium">₱{slot.ratePerHour}/hr</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{slot.parkingType}</span>
                      </div>
                      {slot.currentVehicleId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">{slot.currentVehicleId}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSlotToggle(slot.id, slot.isAvailable)}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg ${
                          slot.isAvailable
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {slot.isAvailable ? 'Mark Occupied' : 'Mark Available'}
                      </button>
                      <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && revenueAnalytics && (
          <div>
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₱{revenueAnalytics.totalGrossRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Gross Revenue</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ₱{revenueAnalytics.totalNetRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Net Revenue</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ₱{revenueAnalytics.totalCommissions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Commissions</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Daily Revenue Trend (Last 30 Days)</h4>
                <div className="text-sm text-gray-600">
                  Revenue chart visualization would be implemented here using a charting library like Chart.js or Recharts.
                  The data is available in revenueAnalytics.dailyRevenue array.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">QR Scanner Interface</h3>
            <div className="text-center py-12">
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-gray-400">
                  <div className="text-4xl mb-2">📷</div>
                  <p>QR Scanner Camera View</p>
                </div>
              </div>
              <div className="space-x-4">
                <button className="btn-primary">Start Scanning</button>
                <button className="btn-secondary">Manual Entry</button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Scan vehicle QR codes for entry/exit processing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
