'use client';

import { useEffect, useState } from 'react';
import { mockFirebaseService } from '../../lib/firebase-config-fixed';
import { ParkingSlot, Vehicle } from '../../lib/types';

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'available' | 'history' | 'vehicles' | 'profile'>('available');

  // Mock driver ID - in real app, this would come from authentication
  const driverId = 'driver_001';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [slotsData, vehiclesData] = await Promise.all([
          mockFirebaseService.getAvailableParkingSlots(),
          mockFirebaseService.getUserVehicles(driverId)
        ]);
        
        setParkingSlots(slotsData);
        setUserVehicles(vehiclesData);
        
        // Set first vehicle as selected by default
        if (vehiclesData.length > 0) {
          setSelectedVehicle(vehiclesData[0].id);
        }
      } catch (err: any) {
        setError('Error loading parking spaces. Please try again.');
        console.error('Driver dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time parking slots updates
    const unsubscribe = mockFirebaseService.onAvailableSlotsChange((updatedSlots) => {
      setParkingSlots(updatedSlots);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [driverId]);

  const handleReservation = async (slotId: string) => {
    if (!selectedVehicle) {
      alert('Please select a vehicle first');
      return;
    }

    try {
      const reservationData = {
        driverId,
        vehicleId: selectedVehicle,
        parkingSlotId: slotId,
        duration: 2, // Default 2 hours
        reservationTime: new Date()
      };

      const reservationId = await mockFirebaseService.createReservation(reservationData);
      
      // Update slot availability locally
      setParkingSlots(prev => 
        prev.map(slot => 
          slot.id === slotId 
            ? { ...slot, isAvailable: false }
            : slot
        )
      );

      alert(`Reservation successful! Reservation ID: ${reservationId}`);
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Reservation failed. Please try again.');
    }
  };

  const calculateDistance = (slot: ParkingSlot): string => {
    // Mock distance calculation - in real app would use GPS coordinates
    const distances = ['0.2 km', '0.5 km', '0.8 km', '1.2 km', '1.5 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const getSlotImage = (parkingType: string): string => {
    // Return placeholder image based on parking type
    const images = {
      'Open': '🅿️',
      'Covered': '🏢',
      'Reserved': '🔒'
    };
    return images[parkingType as keyof typeof images] || '🅿️';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available parking spaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="error-message max-w-md">
          <h2 className="text-lg font-semibold mb-2">Error Loading Parking Spaces</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600">Find and reserve parking spaces</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-lg font-semibold text-green-600">₱500.00</p>
            </div>
            <button className="btn-primary">
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Selection */}
      {userVehicles.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Select Vehicle:</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="input-field max-w-xs"
            >
              {userVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} ({vehicle.vehicleType})
                </option>
              ))}
            </select>
            <button className="btn-secondary text-sm">
              Manage Vehicles
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'available', label: 'Available Parking' },
              { id: 'history', label: 'Parking History' },
              { id: 'vehicles', label: 'My Vehicles' },
              { id: 'profile', label: 'Profile' }
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
        {activeTab === 'available' && (
          <div>
            {/* Search and Filters */}
            <div className="dashboard-card mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search by location..."
                    className="input-field"
                  />
                </div>
                <div className="flex space-x-4">
                  <select className="input-field">
                    <option>All Types</option>
                    <option>Open</option>
                    <option>Covered</option>
                    <option>Reserved</option>
                  </select>
                  <select className="input-field">
                    <option>Sort by Distance</option>
                    <option>Sort by Price</option>
                    <option>Sort by Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Parking Spaces */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parkingSlots.map((slot) => (
                <div key={slot.id} className="parking-slot-card parking-slot-available">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{getSlotImage(slot.parkingType)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{slot.slotName}</h3>
                        <p className="text-sm text-gray-600">{slot.location}</p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-semibold text-blue-600">₱{slot.ratePerHour}/hour</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{slot.parkingType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{calculateDistance(slot)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reservations:</span>
                      <span className="font-medium">
                        {slot.reservationAllowed ? 'Allowed' : 'Walk-in only'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleReservation(slot.id)}
                      disabled={!selectedVehicle}
                      className={`w-full py-2 px-4 rounded-lg font-medium ${
                        selectedVehicle
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Reserve Now
                    </button>
                    <button className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {parkingSlots.length === 0 && (
              <div className="dashboard-card text-center py-12">
                <div className="text-6xl mb-4">🅿️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Parking</h3>
                <p className="text-gray-600 mb-4">
                  There are currently no available parking spaces in your area.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Parking History</h3>
            
            <div className="space-y-4">
              {/* Mock parking history */}
              {[
                {
                  id: 1,
                  location: 'City Hall Parking Lot',
                  slot: 'A1',
                  date: '2024-01-15',
                  duration: '2h 30m',
                  amount: '₱62.50',
                  status: 'Completed'
                },
                {
                  id: 2,
                  location: 'Downtown Mall Parking',
                  slot: 'B1',
                  date: '2024-01-14',
                  duration: '1h 45m',
                  amount: '₱52.50',
                  status: 'Completed'
                },
                {
                  id: 3,
                  location: 'City Hall Parking Lot',
                  slot: 'A3',
                  date: '2024-01-13',
                  duration: '3h 15m',
                  amount: '₱81.25',
                  status: 'Completed'
                }
              ].map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{record.location}</h4>
                      <p className="text-sm text-gray-600">Slot {record.slot} • {record.date}</p>
                      <p className="text-sm text-gray-600">Duration: {record.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{record.amount}</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="btn-secondary">Load More</button>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
              <button className="btn-primary">Add Vehicle</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userVehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{vehicle.plateNumber}</h4>
                      <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vehicle.isCurrentlyParked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {vehicle.isCurrentlyParked ? 'Parked' : 'Available'}
                    </span>
                  </div>

                  {vehicle.isCurrentlyParked && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Currently parked at: {vehicle.currentParkingSlot}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 btn-secondary text-sm">Edit</button>
                    <button className="flex-1 btn-secondary text-sm">QR Code</button>
                  </div>
                </div>
              ))}
            </div>

            {userVehicles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Vehicles Added</h4>
                <p className="text-gray-600 mb-4">Add your vehicle to start making reservations</p>
                <button className="btn-primary">Add Your First Vehicle</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" defaultValue="Mike" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" defaultValue="Johnson" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" defaultValue="driver@email.com" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input type="tel" defaultValue="+1234567890" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License ID</label>
                <div className="flex items-center space-x-4">
                  <input type="text" defaultValue="DL123456789" className="input-field flex-1" />
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select defaultValue="GCash" className="input-field">
                  <option>GCash</option>
                  <option>Credit Card</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button className="btn-primary">Save Changes</button>
                <button className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
