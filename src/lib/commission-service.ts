import { CommissionReport, Payment } from './types';

// Commission tracking and reporting service
export class CommissionService {
  private static readonly COMMISSION_RATE = 0.1; // 10%

  /**
   * Generate commission report for a specific period
   */
  static async generateCommissionReport(
    period: 'daily' | 'weekly' | 'monthly',
    startDate?: Date,
    endDate?: Date
  ): Promise<CommissionReport> {
    try {
      const reportId = this.generateReportId();
      const dates = this.calculateReportDates(period, startDate, endDate);

      // In real implementation, would query Firebase for payments in date range
      const payments = await this.getPaymentsInDateRange(dates.startDate, dates.endDate);
      
      // Calculate totals
      const totalGrossRevenue = payments.reduce((sum, payment) => sum + payment.grossAmount, 0);
      const totalCommissionAmount = payments.reduce((sum, payment) => sum + payment.commissionAmount, 0);
      const totalNetRevenue = payments.reduce((sum, payment) => sum + payment.netAmount, 0);
      const transactionCount = payments.length;

      // Group by owner for breakdown
      const ownerBreakdown = this.calculateOwnerBreakdown(payments);

      const report: CommissionReport = {
        id: reportId,
        reportPeriod: period,
        startDate: dates.startDate,
        endDate: dates.endDate,
        totalGrossRevenue,
        totalCommissionAmount,
        totalNetRevenue,
        transactionCount,
        ownerBreakdown,
        reportStatus: 'Generated',
        generatedAt: new Date(),
      };

      // Save report to database
      await this.saveReportToDatabase(report);

      return report;
    } catch (error) {
      console.error('Commission report generation error:', error);
      throw new Error('Failed to generate commission report. Please try again.');
    }
  }

  /**
   * Get all commission reports
   */
  static async getCommissionReports(): Promise<CommissionReport[]> {
    try {
      // In real implementation, would query Firebase
      // For now, return mock data
      const mockReports: CommissionReport[] = [
        {
          id: 'REPORT_001',
          reportPeriod: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          totalGrossRevenue: 50000,
          totalCommissionAmount: 5000,
          totalNetRevenue: 45000,
          transactionCount: 150,
          ownerBreakdown: [
            {
              ownerAccountId: 'municipal_001',
              ownerName: 'City Parking Authority',
              ownerType: 'Municipal',
              grossRevenue: 30000,
              commissionAmount: 3000,
              netRevenue: 27000,
              transactionCount: 90
            },
            {
              ownerAccountId: 'establishment_001',
              ownerName: 'Downtown Mall',
              ownerType: 'Establishment',
              grossRevenue: 20000,
              commissionAmount: 2000,
              netRevenue: 18000,
              transactionCount: 60
            }
          ],
          reportStatus: 'Generated',
          generatedAt: new Date('2024-02-01'),
        }
      ];

      return mockReports;
    } catch (error) {
      console.error('Error fetching commission reports:', error);
      throw new Error('Failed to fetch commission reports');
    }
  }

  /**
   * Calculate commission summary for admin dashboard
   */
  static async getCommissionSummary(): Promise<{
    totalCommissionsCollected: number;
    pendingCommissions: number;
    thisMonthCommissions: number;
    lastMonthCommissions: number;
    commissionGrowth: number;
  }> {
    try {
      // In real implementation, would query Firebase for payment data
      // For now, return mock data
      const mockSummary = {
        totalCommissionsCollected: 25000,
        pendingCommissions: 3500,
        thisMonthCommissions: 8000,
        lastMonthCommissions: 6500,
        commissionGrowth: 23.1 // percentage growth
      };

      return mockSummary;
    } catch (error) {
      console.error('Error fetching commission summary:', error);
      throw new Error('Failed to fetch commission summary');
    }
  }

  /**
   * Process commission collection (mark as collected)
   */
  static async collectCommissions(paymentIds: string[]): Promise<boolean> {
    try {
      // In real implementation, would:
      // 1. Update payment records to mark commissions as collected
      // 2. Create collection record for accounting
      // 3. Trigger payout process if needed

      console.log(`Collecting commissions for ${paymentIds.length} payments`);
      
      // Simulate collection process
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return true;
    } catch (error) {
      console.error('Commission collection error:', error);
      throw new Error('Failed to collect commissions');
    }
  }

  /**
   * Export commission report to CSV format
   */
  static async exportCommissionReport(reportId: string): Promise<string> {
    try {
      // In real implementation, would fetch report from database
      const report = await this.getReportById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }

      // Generate CSV content
      const csvContent = this.generateCSVContent(report);
      
      return csvContent;
    } catch (error) {
      console.error('Report export error:', error);
      throw new Error('Failed to export commission report');
    }
  }

  /**
   * Calculate commission breakdown by owner
   */
  private static calculateOwnerBreakdown(payments: Payment[]): CommissionReport['ownerBreakdown'] {
    const ownerMap = new Map<string, {
      ownerAccountId: string;
      ownerName: string;
      ownerType: 'Municipal' | 'Establishment';
      grossRevenue: number;
      commissionAmount: number;
      netRevenue: number;
      transactionCount: number;
    }>();

    payments.forEach(payment => {
      const existing = ownerMap.get(payment.ownerAccountId);
      
      if (existing) {
        existing.grossRevenue += payment.grossAmount;
        existing.commissionAmount += payment.commissionAmount;
        existing.netRevenue += payment.netAmount;
        existing.transactionCount += 1;
      } else {
        // In real implementation, would fetch owner details from database
        ownerMap.set(payment.ownerAccountId, {
          ownerAccountId: payment.ownerAccountId,
          ownerName: `Owner ${payment.ownerAccountId}`, // Mock name
          ownerType: 'Municipal', // Mock type
          grossRevenue: payment.grossAmount,
          commissionAmount: payment.commissionAmount,
          netRevenue: payment.netAmount,
          transactionCount: 1
        });
      }
    });

    return Array.from(ownerMap.values());
  }

  /**
   * Calculate report date range based on period
   */
  private static calculateReportDates(
    period: 'daily' | 'weekly' | 'monthly',
    startDate?: Date,
    endDate?: Date
  ): { startDate: Date; endDate: Date } {
    if (startDate && endDate) {
      return { startDate, endDate };
    }

    const now = new Date();
    let calculatedStartDate: Date;
    let calculatedEndDate: Date;

    switch (period) {
      case 'daily':
        calculatedStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        calculatedEndDate = new Date(calculatedStartDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        calculatedStartDate = new Date(now);
        calculatedStartDate.setDate(now.getDate() - dayOfWeek);
        calculatedStartDate.setHours(0, 0, 0, 0);
        calculatedEndDate = new Date(calculatedStartDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 7);
        break;
      case 'monthly':
        calculatedStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        calculatedEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        throw new Error('Invalid period specified');
    }

    return { startDate: calculatedStartDate, endDate: calculatedEndDate };
  }

  /**
   * Get payments in date range (mock implementation)
   */
  private static async getPaymentsInDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    // In real implementation, would query Firebase
    // For now, return mock data
    const mockPayments: Payment[] = [
      {
        id: 'PAY_001',
        invoiceId: 'INV_001',
        driverId: 'driver_001',
        parkingSlotId: 'slot_001',
        ownerAccountId: 'municipal_001',
        grossAmount: 100,
        commissionRate: 0.1,
        commissionAmount: 10,
        netAmount: 90,
        paymentMethod: 'GCash',
        paymentStatus: 'Completed',
        transactionId: 'TXN_001',
        commissionStatus: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return mockPayments.filter(payment => 
      payment.createdAt >= startDate && payment.createdAt < endDate
    );
  }

  /**
   * Generate unique report ID
   */
  private static generateReportId(): string {
    return `REPORT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save report to database (mock implementation)
   */
  private static async saveReportToDatabase(report: CommissionReport): Promise<void> {
    // Simulate database save
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Commission report saved:', report.id);
  }

  /**
   * Get report by ID (mock implementation)
   */
  private static async getReportById(reportId: string): Promise<CommissionReport | null> {
    // In real implementation, would query Firebase
    // For now, return mock data
    const reports = await this.getCommissionReports();
    return reports.find(report => report.id === reportId) || null;
  }

  /**
   * Generate CSV content from commission report
   */
  private static generateCSVContent(report: CommissionReport): string {
    const headers = [
      'Owner ID',
      'Owner Name',
      'Owner Type',
      'Gross Revenue',
      'Commission Amount',
      'Net Revenue',
      'Transaction Count'
    ];

    const rows = report.ownerBreakdown.map(owner => [
      owner.ownerAccountId,
      owner.ownerName,
      owner.ownerType,
      owner.grossRevenue.toString(),
      owner.commissionAmount.toString(),
      owner.netRevenue.toString(),
      owner.transactionCount.toString()
    ]);

    const csvContent = [
      `Commission Report - ${report.reportPeriod.toUpperCase()}`,
      `Period: ${report.startDate.toDateString()} to ${report.endDate.toDateString()}`,
      `Total Gross Revenue: ₱${report.totalGrossRevenue}`,
      `Total Commission: ₱${report.totalCommissionAmount}`,
      `Total Net Revenue: ₱${report.totalNetRevenue}`,
      `Total Transactions: ${report.transactionCount}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Validate commission calculations
   */
  static validateCommissionCalculation(grossAmount: number, commissionAmount: number, netAmount: number): boolean {
    const expectedCommission = grossAmount * this.COMMISSION_RATE;
    const expectedNet = grossAmount - expectedCommission;
    
    const commissionValid = Math.abs(commissionAmount - expectedCommission) < 0.01;
    const netValid = Math.abs(netAmount - expectedNet) < 0.01;
    
    return commissionValid && netValid;
  }
}

// Export default instance
export const commissionService = CommissionService;
