import React from 'react';
import type { Lead, LeadProduct } from '@prisma/client';
import { TrendingUp, DollarSign, Trophy, BarChart3 } from 'lucide-react';

interface RevenueSummaryCardsProps {
  leads: (Lead & { leadProducts: LeadProduct[] })[];
}

export function RevenueSummaryCards({ leads }: RevenueSummaryCardsProps) {
  // Calculate metrics
  const metrics = React.useMemo(() => {
    let totalRevenue = 0;
    let wonRevenue = 0;
    let projectedRevenue = 0;
    let dealCount = 0;

    leads.forEach((lead) => {
      lead.leadProducts?.forEach((product) => {
        const revenue = Number(product.revenueAmount || 0);
        const projected = Number(product.projectedRevenue || 0);

        totalRevenue += revenue + projected;

        if (product.status === 'WON') {
          wonRevenue += revenue;
        }

        if (projected > 0) {
          projectedRevenue += projected;
        }

        if (revenue > 0 || projected > 0) {
          dealCount++;
        }
      });
    });

    const avgDealSize = dealCount > 0 ? totalRevenue / dealCount : 0;

    return {
      totalRevenue,
      wonRevenue,
      projectedRevenue,
      avgDealSize,
    };
  }, [leads]);

  const cards = [
    {
      label: 'Total Pipeline Value',
      value: `$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: TrendingUp,
      color: 'from-green-500 to-blue-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Won Deals',
      value: `$${metrics.wonRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: Trophy,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Projected Revenue',
      value: `$${metrics.projectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: BarChart3,
      color: 'from-green-500 to-pink-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Avg Deal Size',
      value: `$${metrics.avgDealSize.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4 transition-all hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}
