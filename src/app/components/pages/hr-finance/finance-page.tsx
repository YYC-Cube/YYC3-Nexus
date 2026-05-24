import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  FileText,
  PieChart,
  Plus,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { NeonCard } from '../../core/neon-card';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface FinanceRecord {
  id: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  department: string;
  status: 'confirmed' | 'pending' | 'draft';
}

interface BudgetItem {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  department: string;
}

const MOCK_RECORDS: FinanceRecord[] = [
  {
    id: 'f1',
    category: '客户服务收入',
    type: 'income',
    amount: 285000,
    date: '2026-05-01',
    department: '营销部',
    status: 'confirmed',
  },
  {
    id: 'f2',
    category: '技术咨询服务',
    type: 'income',
    amount: 156000,
    date: '2026-05-02',
    department: '技术部',
    status: 'confirmed',
  },
  {
    id: 'f3',
    category: '员工薪酬',
    type: 'expense',
    amount: -320000,
    date: '2026-05-05',
    department: '人事部',
    status: 'confirmed',
  },
  {
    id: 'f4',
    category: '办公租赁',
    type: 'expense',
    amount: -45000,
    date: '2026-05-05',
    department: '行政部',
    status: 'confirmed',
  },
  {
    id: 'f5',
    category: '营销推广费',
    type: 'expense',
    amount: -78000,
    date: '2026-05-06',
    department: '营销部',
    status: 'pending',
  },
  {
    id: 'f6',
    category: 'SaaS订阅收入',
    type: 'income',
    amount: 198000,
    date: '2026-05-07',
    department: '产品部',
    status: 'confirmed',
  },
  {
    id: 'f7',
    category: '服务器费用',
    type: 'expense',
    amount: -35000,
    date: '2026-05-08',
    department: '技术部',
    status: 'pending',
  },
  {
    id: 'f8',
    category: '培训费用',
    type: 'expense',
    amount: -12000,
    date: '2026-05-08',
    department: '人事部',
    status: 'draft',
  },
];

const MOCK_BUDGETS: BudgetItem[] = [
  {
    id: 'b1',
    name: '技术部预算',
    allocated: 500000,
    spent: 355000,
    remaining: 145000,
    department: '技术部',
  },
  {
    id: 'b2',
    name: '营销部预算',
    allocated: 380000,
    spent: 278000,
    remaining: 102000,
    department: '营销部',
  },
  {
    id: 'b3',
    name: '人事部预算',
    allocated: 200000,
    spent: 132000,
    remaining: 68000,
    department: '人事部',
  },
  {
    id: 'b4',
    name: '行政部预算',
    allocated: 150000,
    spent: 89000,
    remaining: 61000,
    department: '行政部',
  },
];

export function FinancePage() {
  const tc = useThemeColors();
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'records'>('overview');

  const totalIncome = useMemo(
    () => MOCK_RECORDS.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0),
    [],
  );
  const totalExpense = useMemo(
    () =>
      MOCK_RECORDS.filter(r => r.type === 'expense').reduce((s, r) => s + Math.abs(r.amount), 0),
    [],
  );
  const netProfit = totalIncome - totalExpense;
  const profitRate = Math.round((netProfit / totalIncome) * 100);

  const kpiCards = [
    {
      label: '本月收入',
      value: `¥${totalIncome.toLocaleString()}`,
      icon: ArrowUpRight,
      color: tc.success,
      trend: '+12.3%',
      trendUp: true,
    },
    {
      label: '本月支出',
      value: `¥${totalExpense.toLocaleString()}`,
      icon: ArrowDownRight,
      color: tc.destructive,
      trend: '+5.1%',
      trendUp: false,
    },
    {
      label: '净利润',
      value: `¥${netProfit.toLocaleString()}`,
      icon: DollarSign,
      color: tc.primary,
      trend: `${profitRate}%`,
      trendUp: true,
    },
    {
      label: '预算执行率',
      value: `${Math.round((totalExpense / MOCK_BUDGETS.reduce((s, b) => s + b.allocated, 0)) * 100)}%`,
      icon: PieChart,
      color: tc.accent,
      trend: '正常',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: tc.textPrimary }}>
            财务管理
          </h1>
          <p className="text-sm" style={{ color: tc.textSecondary }}>
            收支总览 · 预算管理 · 费用报表 · 财务分析
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: tc.bgCard,
              color: tc.textSecondary,
              border: `1px solid ${tc.borderSubtle}`,
            }}
          >
            <RefreshCw className="w-4 h-4" />
            同步
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
            style={{ background: tc.gradientButton, color: tc.textPrimary, boxShadow: tc.shadowMd }}
          >
            <Plus className="w-5 h-5" />
            新建记录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(kpi => {
          const Icon = kpi.icon;
          return (
            <NeonCard key={kpi.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8" style={{ color: kpi.color }} />
                <span className="text-xs" style={{ color: tc.textMuted }}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-sm mb-1" style={{ color: tc.textMuted }}>
                {kpi.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: tc.textPrimary }}>
                {kpi.value}
              </p>
            </NeonCard>
          );
        })}
      </div>

      <div className="flex gap-2 border-b pb-2" style={{ borderColor: tc.borderSubtle }}>
        {(['overview', 'budget', 'records'] as const).map(tab => {
          const labels = { overview: '收支总览', budget: '预算管理', records: '费用明细' };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-t-lg text-sm font-medium transition-colors"
              style={{
                background: activeTab === tab ? tc.bgCard : 'transparent',
                color: activeTab === tab ? tc.primary : tc.textMuted,
                borderBottom:
                  activeTab === tab ? `2px solid ${tc.primary}` : '2px solid transparent',
              }}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeonCard className="p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: tc.textPrimary }}>
              <TrendingUp className="w-5 h-5 inline mr-2" style={{ color: tc.success }} />
              收入明细
            </h2>
            <div className="space-y-3">
              {MOCK_RECORDS.filter(r => r.type === 'income').map(r => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
                >
                  <div>
                    <p className="font-medium text-sm" style={{ color: tc.textPrimary }}>
                      {r.category}
                    </p>
                    <p className="text-xs" style={{ color: tc.textMuted }}>
                      {r.department} · {r.date}
                    </p>
                  </div>
                  <span className="font-bold" style={{ color: tc.success }}>
                    +¥{r.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </NeonCard>
          <NeonCard className="p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: tc.textPrimary }}>
              <ArrowDownRight className="w-5 h-5 inline mr-2" style={{ color: tc.destructive }} />
              支出明细
            </h2>
            <div className="space-y-3">
              {MOCK_RECORDS.filter(r => r.type === 'expense').map(r => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
                >
                  <div>
                    <p className="font-medium text-sm" style={{ color: tc.textPrimary }}>
                      {r.category}
                    </p>
                    <p className="text-xs" style={{ color: tc.textMuted }}>
                      {r.department} · {r.date}
                    </p>
                  </div>
                  <span className="font-bold" style={{ color: tc.destructive }}>
                    ¥{Math.abs(r.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </NeonCard>
        </div>
      )}

      {activeTab === 'budget' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            <BarChart3 className="w-5 h-5 inline mr-2" style={{ color: tc.primary }} />
            部门预算执行
          </h2>
          <div className="space-y-4">
            {MOCK_BUDGETS.map(b => {
              const pct = Math.round((b.spent / b.allocated) * 100);
              const barColor = pct > 90 ? tc.destructive : pct > 70 ? '#eab308' : tc.success;
              return (
                <div
                  key={b.id}
                  className="p-4 rounded-lg"
                  style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {b.name}
                    </h3>
                    <span className="text-sm font-medium" style={{ color: barColor }}>
                      {pct}% 已使用
                    </span>
                  </div>
                  <div className="h-2 rounded-full mb-3" style={{ background: tc.borderSubtle }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span style={{ color: tc.textMuted }}>预算: </span>
                      <span style={{ color: tc.textPrimary }}>¥{b.allocated.toLocaleString()}</span>
                    </div>
                    <div>
                      <span style={{ color: tc.textMuted }}>已用: </span>
                      <span style={{ color: tc.destructive }}>¥{b.spent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span style={{ color: tc.textMuted }}>剩余: </span>
                      <span style={{ color: tc.success }}>¥{b.remaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </NeonCard>
      )}

      {activeTab === 'records' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            <FileText className="w-5 h-5 inline mr-2" style={{ color: tc.primary }} />
            费用明细记录
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                  {['类别', '类型', '金额', '日期', '部门', '状态'].map(h => (
                    <th
                      key={h}
                      className="text-left py-3 px-2 font-medium"
                      style={{ color: tc.textMuted }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_RECORDS.map(r => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                    <td className="py-3 px-2 font-medium" style={{ color: tc.textPrimary }}>
                      {r.category}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background:
                            r.type === 'income' ? `${tc.success}20` : `${tc.destructive}20`,
                          color: r.type === 'income' ? tc.success : tc.destructive,
                        }}
                      >
                        {r.type === 'income' ? '收入' : '支出'}
                      </span>
                    </td>
                    <td
                      className="py-3 px-2 font-bold"
                      style={{ color: r.type === 'income' ? tc.success : tc.destructive }}
                    >
                      {r.type === 'income' ? '+' : ''}¥{Math.abs(r.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textMuted }}>
                      {r.date}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textSecondary }}>
                      {r.department}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ color: r.status === 'confirmed' ? tc.success : tc.textMuted }}
                      >
                        {r.status === 'confirmed'
                          ? '已确认'
                          : r.status === 'pending'
                            ? '待审批'
                            : '草稿'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
