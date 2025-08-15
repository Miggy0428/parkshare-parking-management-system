'use client';

import { useEffect, useState } from 'react';
import { mockFirebaseService } from '../../lib/firebase-config-fixed';
import { commissionService } from '../../lib/commission-service';
import { SystemStats, CommissionReport } from '../../lib/types';
import ProtectedRoute, { DashboardHeader } from '../../components/ProtectedRoute';
import RevenueChart from '../../components/charts/RevenueChart';
import CustomPieChart from '../../components/charts/PieChart';
import { theme } from '../../lib/theme';

function AdminDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [commissionReports, setCommissionReports] = useState<CommissionReport[]>([]);
  const [commissionSummary, setCommissionSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'commissions' | 'users'>('overview');

  // Mock revenue data for charts
  const [revenueData] = useState([
    { date: '2024-01-01', gross: 4500, net: 4050, commission: 450 },
    { date: '2024-01-02', gross: 5200, net: 4680, commission: 520 },
    { date: '2024-01-03', gross: 3800, net: 3420, commission: 380 },
    { date: '2024-01-04', gross: 6100, net: 5490, commission: 610 },
    { date: '2024-01-05', gross: 4900, net: 4410, commission: 490 },
    { date: '2024-01-06', gross: 5500, net: 4950, commission: 550 },
    { date: '2024-01-07', gross: 7200, net: 6480, commission: 720 },
    { date: '2024-01-08', gross: 6800, net: 6120, commission: 680 },
    { date: '2024-01-09', gross: 5900, net: 5310, commission: 590 },
    { date: '2024-01-10', gross: 8100, net: 7290, commission: 810 },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, reportsData, summaryData] = await Promise.all([
          mockFirebaseService.getSystemStats(),
          commissionService.getCommissionReports(),
          commissionService.getCommissionSummary()
        ]);
        
        setStats(statsData);
        setCommissionReports(reportsData);
        setCommissionSummary(summaryData);
      } catch (err: any) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleExportReport = async (reportId: string) => {
    try {
      const csvContent = await commissionService.exportCommissionReport(reportId);
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commission-report-${reportId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const newReport = await commissionService.generateCommissionReport('monthly');
      setCommissionReports(prev => [newReport, ...prev]);
      alert('Commission report generated successfully!');
    } catch (error) {
      console.error('Generate report error:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.gradients.background }}>
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
          ></div>
          <p style={{ color: theme.colors.text.secondary }}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.gradients.background }}>
        <div 
          className="max-w-md p-6 rounded-lg shadow-lg"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.error}`,
          }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: theme.colors.error }}>
            Error Loading Dashboard
          </h2>
          <p style={{ color: theme.colors.text.secondary }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 rounded-lg font-medium"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userBreakdownData = stats ? [
    { name: 'Drivers', value: stats.totalDrivers, color: theme.colors.primary },
    { name: 'Municipalities', value: stats.totalMunicipals, color: theme.colors.success },
    { name: 'Establishments', value: stats.totalEstablishments, color: theme.colors.info },
  ] : [];

  const parkingData = stats ? [
    { name: 'Available', value: stats.availableSlots, color: theme.colors.success },
    { name: 'Occupied', value: stats.occupiedSlots, color: theme.colors.error },
  ] : [];

  return (
    <div className="min-h-screen" style={{ background: theme.gradients.background }}>
      {/* Header */}
      <div 
        className="shadow-sm border-b px-6 py-4"
        style={{ 
          background: theme.gradients.primary,
          borderColor: theme.colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.light }}>
              ParkShare Admin Dashboard
            </h1>
            <p style={{ color: theme.colors.text.light, opacity: 0.9 }}>
              System overview and management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: theme.colors.text.light,
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Generate Report
            </button>
            <div className="text-right">
              <p className="text-sm" style={{ color: theme.colors.text.light, opacity: 0.8 }}>
                System Administrator
              </p>
              <button 
                className="text-sm underline hover:no-underline"
                style={{ color: theme.colors.text.light }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b" style={{ borderColor: theme.colors.border }}>
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'System Overview' },
              { id: 'analytics', label: 'Analytics & Charts' },
              { id: 'commissions', label: 'Commission Reports' },
              { id: 'users', label: 'User Management' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-current'
                    : 'border-transparent hover:border-current'
                }`}
                style={{ 
                  color: activeTab === tab.id ? theme.colors.primary : theme.colors.text.secondary,
                  borderColor: activeTab === tab.id ? theme.colors.primary : 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* System Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: theme.colors.primary },
                { label: 'Parking Slots', value: stats.totalParkingSlots, icon: '🅿️', color: theme.colors.success },
                { label: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: theme.colors.info },
                { label: 'Total Commissions', value: `₱${stats.totalCommissions.toLocaleString()}`, icon: '📊', color: theme.colors.warning },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold mt-1" style={{ color: theme.colors.text.primary }}>
                        {stat.value}
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                className="p-6 rounded-lg shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                  User Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Drivers', value: stats.totalDrivers, color: theme.colors.primary },
                    { label: 'Municipalities', value: stats.totalMunicipals, color: theme.colors.success },
                    { label: 'Establishments', value: stats.totalEstablishments, color: theme.colors.info },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span style={{ color: theme.colors.text.secondary }}>{item.label}</span>
                      </div>
                      <span className="font-semibold" style={{ color: theme.colors.text.primary }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className="p-6 rounded-lg shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                  Parking Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.success }}
                      ></div>
                      <span style={{ color: theme.colors.text.secondary }}>Available Slots</span>
                    </div>
                    <span className="font-semibold" style={{ color: theme.colors.success }}>
                      {stats.availableSlots}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.error }}
                      ></div>
                      <span style={{ color: theme.colors.text.secondary }}>Occupied Slots</span>
                    </div>
                    <span className="font-semibold" style={{ color: theme.colors.error }}>
                      {stats.occupiedSlots}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: theme.colors.text.secondary }}>Occupancy Rate</span>
                    <span className="font-semibold" style={{ color: theme.colors.text.primary }}>
                      {((stats.occupiedSlots / stats.totalParkingSlots) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div 
              className="p-6 rounded-lg shadow-sm border"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Revenue Analytics (Last 10 Days)
              </h3>
              <RevenueChart data={revenueData} type="area" />
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div 
                className="p-6 rounded-lg shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <CustomPieChart data={userBreakdownData} title="User Distribution" />
              </div>
              
              <div 
                className="p-6 rounded-lg shadow-sm border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <CustomPieChart data={parkingData} title="Parking Slot Status" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div 
            className="p-6 rounded-lg shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                Commission Reports
              </h3>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.light,
                }}
              >
                Generate New Report
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.colors.background }}>
                    {['Report ID', 'Period', 'Date Range', 'Total Commission', 'Transactions', 'Status', 'Actions'].map((header) => (
                      <th 
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commissionReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize" style={{ color: theme.colors.text.secondary }}>
                        {report.reportPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.text.secondary }}>
                        {report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.text.primary }}>
                        ₱{report.totalCommissionAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.text.secondary }}>
                        {report.transactionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{ 
                            backgroundColor: theme.colors.success + '20',
                            color: theme.colors.success,
                          }}
                        >
                          {report.reportStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleExportReport(report.id)}
                          className="hover:underline"
                          style={{ color: theme.colors.primary }}
                        >
                          Export CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div 
            className="p-6 rounded-lg shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
              User Management
            </h3>
            <p className="mb-4" style={{ color: theme.colors.text.secondary }}>
              User management features will be implemented here, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6" style={{ color: theme.colors.text.secondary }}>
              <li>View all registered users</li>
              <li>Activate/deactivate user accounts</li>
              <li>Verify driver licenses</li>
              <li>Manage user permissions</li>
              <li>View user activity logs</li>
            </ul>
            <div className="space-x-4">
              <button 
                className="px-4 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                View All Users
              </button>
              <button 
                className="px-4 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                Pending Verifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
