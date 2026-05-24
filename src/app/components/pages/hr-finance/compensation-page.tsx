import {
  Award,
  BarChart3,
  DollarSign,
  Plus,
  Search,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { NeonCard } from '../../core/neon-card';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface SalaryStructure {
  id: string;
  name: string;
  baseSalary: number;
  performanceBonus: number;
  commission: number;
  allowance: number;
  total: number;
}

interface IncentivePlan {
  id: string;
  name: string;
  type: 'performance' | 'sales' | 'innovation' | 'retention';
  target: string;
  reward: string;
  participants: number;
  status: 'active' | 'draft' | 'completed';
}

interface SalaryRecord {
  id: string;
  employee: string;
  department: string;
  month: string;
  base: number;
  bonus: number;
  deduction: number;
  net: number;
}

const MOCK_SALARY_STRUCTURES: SalaryStructure[] = [
  {
    id: 's1',
    name: 'P1 高级工程师',
    baseSalary: 25000,
    performanceBonus: 5000,
    commission: 3000,
    allowance: 2000,
    total: 35000,
  },
  {
    id: 's2',
    name: 'P2 资深工程师',
    baseSalary: 20000,
    performanceBonus: 4000,
    commission: 2000,
    allowance: 1500,
    total: 27500,
  },
  {
    id: 's3',
    name: 'P3 中级工程师',
    baseSalary: 15000,
    performanceBonus: 3000,
    commission: 1500,
    allowance: 1000,
    total: 20500,
  },
  {
    id: 's4',
    name: 'M1 技术经理',
    baseSalary: 35000,
    performanceBonus: 8000,
    commission: 5000,
    allowance: 3000,
    total: 51000,
  },
];

const MOCK_INCENTIVE_PLANS: IncentivePlan[] = [
  {
    id: 'i1',
    name: 'Q2 绩效冲刺计划',
    type: 'performance',
    target: '完成率 ≥ 95%',
    reward: '额外2个月奖金',
    participants: 42,
    status: 'active',
  },
  {
    id: 'i2',
    name: '新人留存激励',
    type: 'retention',
    target: '入职满1年',
    reward: '留任奖金 ¥5,000',
    participants: 18,
    status: 'active',
  },
  {
    id: 'i3',
    name: '创新提案奖励',
    type: 'innovation',
    target: '提案被采纳',
    reward: '¥1,000-10,000',
    participants: 65,
    status: 'active',
  },
  {
    id: 'i4',
    name: 'Q1 销售冠军',
    type: 'sales',
    target: '销售额 TOP3',
    reward: '奖金 ¥20,000',
    participants: 28,
    status: 'completed',
  },
];

const MOCK_SALARY_RECORDS: SalaryRecord[] = [
  {
    id: 'r1',
    employee: '张三',
    department: '技术部',
    month: '2026-04',
    base: 25000,
    bonus: 5500,
    deduction: 1200,
    net: 29300,
  },
  {
    id: 'r2',
    employee: '李四',
    department: '营销部',
    month: '2026-04',
    base: 20000,
    bonus: 4200,
    deduction: 980,
    net: 23220,
  },
  {
    id: 'r3',
    employee: '王五',
    department: '技术部',
    month: '2026-04',
    base: 15000,
    bonus: 2800,
    deduction: 750,
    net: 17050,
  },
  {
    id: 'r4',
    employee: '赵六',
    department: '运营部',
    month: '2026-04',
    base: 18000,
    bonus: 3600,
    deduction: 890,
    net: 20710,
  },
  {
    id: 'r5',
    employee: '孙七',
    department: '营销部',
    month: '2026-04',
    base: 22000,
    bonus: 8500,
    deduction: 1100,
    net: 29400,
  },
];

const TYPE_LABELS: Record<IncentivePlan['type'], string> = {
  performance: '绩效',
  sales: '销售',
  innovation: '创新',
  retention: '留存',
};

const TYPE_COLORS: Record<IncentivePlan['type'], string> = {
  performance: '#8b5cf6',
  sales: '#22c55e',
  innovation: '#f97316',
  retention: '#06b6d4',
};

const STATUS_LABELS: Record<IncentivePlan['status'], string> = {
  active: '进行中',
  draft: '草稿',
  completed: '已完成',
};

export function CompensationPage() {
  const tc = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'structure' | 'incentive' | 'records'>('structure');

  const totalPayroll = useMemo(() => MOCK_SALARY_RECORDS.reduce((sum, r) => sum + r.net, 0), []);
  const avgSalary = useMemo(
    () => Math.round(totalPayroll / MOCK_SALARY_RECORDS.length),
    [totalPayroll],
  );
  const activePlans = useMemo(
    () => MOCK_INCENTIVE_PLANS.filter(p => p.status === 'active').length,
    [],
  );

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return MOCK_SALARY_RECORDS;
    const q = searchQuery.toLowerCase();
    return MOCK_SALARY_RECORDS.filter(
      r => r.employee.toLowerCase().includes(q) || r.department.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const kpiCards = [
    {
      label: '本月总薪酬',
      value: `¥${totalPayroll.toLocaleString()}`,
      icon: DollarSign,
      color: tc.primary,
      trend: '+5.2%',
      trendUp: true,
    },
    {
      label: '人均薪资',
      value: `¥${avgSalary.toLocaleString()}`,
      icon: Users,
      color: tc.secondary,
      trend: '+3.8%',
      trendUp: true,
    },
    {
      label: '激励计划',
      value: `${activePlans} 个`,
      icon: Award,
      color: tc.accent,
      trend: '活跃',
      trendUp: true,
    },
    {
      label: '绩效达标率',
      value: '87.5%',
      icon: Target,
      color: '#eab308',
      trend: '+2.1%',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: tc.textPrimary }}>
            薪酬激励管理
          </h1>
          <p className="text-sm" style={{ color: tc.textSecondary }}>
            薪酬结构 · 绩效奖金 · 激励方案 · 薪资报表
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
          style={{ background: tc.gradientButton, color: tc.textPrimary, boxShadow: tc.shadowMd }}
        >
          <Plus className="w-5 h-5" />
          新建方案
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(kpi => {
          const Icon = kpi.icon;
          return (
            <NeonCard key={kpi.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8" style={{ color: kpi.color }} />
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: kpi.trendUp ? tc.success : tc.destructive }}
                >
                  {kpi.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpi.trend}
                </div>
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
        {(['structure', 'incentive', 'records'] as const).map(tab => {
          const labels = { structure: '薪酬结构', incentive: '激励方案', records: '薪资记录' };
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

      {activeTab === 'structure' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            薪酬等级结构
          </h2>
          <div className="space-y-4">
            {MOCK_SALARY_STRUCTURES.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-lg"
                style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5" style={{ color: tc.primary }} />
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {s.name}
                    </h3>
                  </div>
                  <span className="text-xl font-bold" style={{ color: tc.primary }}>
                    ¥{s.total.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    {
                      label: '基本工资',
                      value: s.baseSalary,
                      pct: Math.round((s.baseSalary / s.total) * 100),
                    },
                    {
                      label: '绩效奖金',
                      value: s.performanceBonus,
                      pct: Math.round((s.performanceBonus / s.total) * 100),
                    },
                    {
                      label: '提成',
                      value: s.commission,
                      pct: Math.round((s.commission / s.total) * 100),
                    },
                    {
                      label: '补贴',
                      value: s.allowance,
                      pct: Math.round((s.allowance / s.total) * 100),
                    },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-xs mb-1" style={{ color: tc.textMuted }}>
                        {item.label}
                      </p>
                      <p className="font-bold text-sm" style={{ color: tc.textPrimary }}>
                        ¥{item.value.toLocaleString()}
                        <span className="ml-1 text-xs font-normal" style={{ color: tc.textMuted }}>
                          ({item.pct}%)
                        </span>
                      </p>
                      <div
                        className="mt-1 h-1 rounded-full"
                        style={{ background: tc.borderSubtle }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.pct}%`, background: tc.primary }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {activeTab === 'incentive' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            激励方案管理
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_INCENTIVE_PLANS.map(plan => (
              <div
                key={plan.id}
                className="p-4 rounded-lg"
                style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: `${TYPE_COLORS[plan.type]}20`,
                        color: TYPE_COLORS[plan.type],
                      }}
                    >
                      {TYPE_LABELS[plan.type]}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background:
                          plan.status === 'active' ? `${tc.success}20` : `${tc.textMuted}20`,
                        color: plan.status === 'active' ? tc.success : tc.textMuted,
                      }}
                    >
                      {STATUS_LABELS[plan.status]}
                    </span>
                  </div>
                  <Users className="w-4 h-4" style={{ color: tc.textMuted }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: tc.textPrimary }}>
                  {plan.name}
                </h3>
                <div className="space-y-1 text-sm" style={{ color: tc.textSecondary }}>
                  <p>🎯 目标: {plan.target}</p>
                  <p>🏆 奖励: {plan.reward}</p>
                  <p>👥 参与人数: {plan.participants}人</p>
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {activeTab === 'records' && (
        <NeonCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: tc.textPrimary }}>
              薪资发放记录
            </h2>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
            >
              <Search className="w-4 h-4" style={{ color: tc.textMuted }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索员工/部门..."
                className="bg-transparent outline-none text-sm w-40"
                style={{ color: tc.textPrimary }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                  {['员工', '部门', '月份', '基本工资', '奖金', '扣款', '实发'].map(h => (
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
                {filteredRecords.map(r => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                    <td className="py-3 px-2 font-medium" style={{ color: tc.textPrimary }}>
                      {r.employee}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textSecondary }}>
                      {r.department}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textMuted }}>
                      {r.month}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textPrimary }}>
                      ¥{r.base.toLocaleString()}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.success }}>
                      +¥{r.bonus.toLocaleString()}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.destructive }}>
                      -¥{r.deduction.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 font-bold" style={{ color: tc.primary }}>
                      ¥{r.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: `1px solid ${tc.borderSubtle}` }}
          >
            <span className="text-sm" style={{ color: tc.textMuted }}>
              共 {filteredRecords.length} 条记录
            </span>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: tc.primary }} />
              <span className="text-sm font-medium" style={{ color: tc.textSecondary }}>
                合计实发: ¥{filteredRecords.reduce((s, r) => s + r.net, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
