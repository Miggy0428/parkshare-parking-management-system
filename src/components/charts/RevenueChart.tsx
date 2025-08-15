'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { theme } from '../../lib/theme';

interface RevenueChartProps {
  data: Array<{
    date: string;
    gross: number;
    net: number;
    commission: number;
  }>;
  type?: 'line' | 'area';
}

export default function RevenueChart({ data, type = 'area' }: RevenueChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-lg shadow-lg border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
        >
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₱{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'area') {
    return (
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.colors.success} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.colors.success} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.colors.info} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.colors.info} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis 
              dataKey="date" 
              stroke={theme.colors.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.colors.text.secondary}
              fontSize={12}
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="gross"
              stroke={theme.colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#grossGradient)"
              name="Gross Revenue"
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke={theme.colors.success}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#netGradient)"
              name="Net Revenue"
            />
            <Area
              type="monotone"
              dataKey="commission"
              stroke={theme.colors.info}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#commissionGradient)"
              name="Commission"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
          <XAxis 
            dataKey="date" 
            stroke={theme.colors.text.secondary}
            fontSize={12}
          />
          <YAxis 
            stroke={theme.colors.text.secondary}
            fontSize={12}
            tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="gross"
            stroke={theme.colors.primary}
            strokeWidth={3}
            dot={{ fill: theme.colors.primary, strokeWidth: 2, r: 4 }}
            name="Gross Revenue"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke={theme.colors.success}
            strokeWidth={3}
            dot={{ fill: theme.colors.success, strokeWidth: 2, r: 4 }}
            name="Net Revenue"
          />
          <Line
            type="monotone"
            dataKey="commission"
            stroke={theme.colors.info}
            strokeWidth={3}
            dot={{ fill: theme.colors.info, strokeWidth: 2, r: 4 }}
            name="Commission"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
