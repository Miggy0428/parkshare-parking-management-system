'use client';

import { useEffect, useState } from 'react';
import { mockFirebaseService } from '../../lib/firebase-config-fixed';
import { ParkingSlot, RevenueAnalytics } from '../../lib/types';

export default function EstablishmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'reservations' | 'analytics'>('overview');

  // Mock establishment account ID - in real app, this would come from authentication
  const establishmentAccountId = 'establishment_001';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [slotsData, analyticsData] = await Promise.all([
          mockFirebaseService.getParkingSlotsByOwner(establishmentAccountId),
          mockFirebaseService.getRevenueAnalytics(establishmentAccountId)
        ]);
        
        setParkingSlots(slotsData);
        setRevenueAnalytics(analyticsData);
      } catch (err: any) {
        setError('Failed to load establishment dashboard data. Please try again.');
        console.error('Establishment dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time parking slots updates
    const unsubscribe = mockFirebaseService.onAvailableSlotsChange((updatedSlots) => {
      // Filter for this establishment's slots
      const establishmentSlots = updatedSlots.filter(slot => slot.ownerAccountId === establishmentAccountId);
      setParkingSlots(prev => {
        // Update existing slots with new availability status
        return prev.map(slot => {
          const updated = establishmentSlots.find(s => s.id === slot.id);
          return updated ? { ...slot, ...updated } : slot;
        });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [establishmentAccountId]);

  const handleSlotUpdate = async (slotId: string, updates: Partial<ParkingSlot>) => {
    try {
      // In real implementation, would update Firebase
      setParkingSlots(prev => 
        prev.map(slot => 
          slot.id === slotId 
            ? { ...slot, ...updates }
            : slot
        )
      );
      console.log(`Updated slot ${slotId}:`, updates);
    } catch (error) {
      console.error('Error updating slot:', error);
      alert('Failed to update slot. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading establishment dashboard...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Establishment Dashboard</h1>
            <p className="text-gray-600">Downtown Shopping Mall - Parking Management</p>
          </div>
          <div className="flex space-x-4">
            <button className="btn-secondary">
              Staff Management
            </button>
            <button className="btn-primary">
              QR Scanner Access
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Business Overview' },
              { id: 'slots', label: 'Parking Management' },
              { id: 'reservations', label: 'Reservations' },
              { id: 'analytics', label: 'Revenue Analytics' }
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

            {/* Business Performance */}
            <div className="content-grid">
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Gross Revenue</p>
                      <p className="text-xl font-bold text-green-600">₱2,450</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">+12.5%</p>
                      <p className="text-xs text-gray-500">vs yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Net Revenue</p>
                      <p className="text-xl font-bold text-blue-600">₱2,205</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Commission: ₱245</p>
                      <p className="text-xs text-gray-500">10% to ParkShare</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Customer Visits</p>
                      <p className="text-xl font-bold text-purple-600">89</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Avg Duration</p>
                      <p className="text-xs text-gray-500">2.3 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Customer parked</p>
                      <p className="text-xs text-gray-500">Slot B1 • 5 minutes ago</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Entry</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment completed</p>
                      <p className="text-xs text-gray-500">₱90.00 • 12 minutes ago</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Payment</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reservation made</p>
                      <p className="text-xs text-gray-500">Slot B3 • 25 minutes ago</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Reservation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="text-2xl mb-2">🚗</div>
                  <p className="text-sm font-medium text-gray-900">Add Parking Slot</p>
                </button>
                <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="text-sm font-medium text-gray-900">View Revenue</p>
                </button>
                <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="text-sm font-medium text-gray-900">Staff Access</p>
                </button>
                <button className="p-4 text-center bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm font-medium text-gray-900">Generate Report</p>
                </button>
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
                  <button className="btn-secondary">Bulk Actions</button>
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
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reservations:</span>
                        <span className="font-medium">
                          {slot.reservationAllowed ? 'Allowed' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSlotUpdate(slot.id, { isAvailable: !slot.isAvailable })}
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

        {activeTab === 'reservations' && (
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reservation Management</h3>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Active Reservations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Confirmed Today</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                Reservation management interface will display:
              </p>
              <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                <li>• Upcoming reservations with customer details</li>
                <li>• Reservation status management</li>
                <li>• Automatic slot allocation</li>
                <li>• Customer communication tools</li>
                <li>• Cancellation and refund processing</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && revenueAnalytics && (
          <div>
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Analytics & Commission Breakdown</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₱{revenueAnalytics.totalGrossRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Gross Revenue</div>
                  <div className="text-xs text-gray-500 mt-1">Before commission</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ₱{revenueAnalytics.totalNetRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Net Revenue</div>
                  <div className="text-xs text-gray-500 mt-1">After 10% commission</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ₱{revenueAnalytics.totalCommissions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Commissions</div>
                  <div className="text-xs text-gray-500 mt-1">Paid to ParkShare</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Revenue Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Gross</span>
                      <span className="font-semibold">₱{revenueAnalytics.totalGrossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission (10%)</span>
                      <span className="font-semibold text-red-600">-₱{revenueAnalytics.totalCommissions.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-900 font-medium">Net Revenue</span>
                      <span className="font-bold text-green-600">₱{revenueAnalytics.totalNetRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Transaction</span>
                      <span className="font-semibold">₱85.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Retention</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Hours</span>
                      <span className="font-semibold">2PM - 6PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h4>
                <div className="text-sm text-gray-600">
                  Interactive revenue chart would be displayed here showing daily gross revenue, 
                  net revenue after commission, and commission amounts. The chart would use the 
                  data from revenueAnalytics.dailyRevenue array.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
