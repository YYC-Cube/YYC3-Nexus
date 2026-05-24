import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Truck,
  UserPlus,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { NeonCard } from '../../core/neon-card';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface ProcurementRequest {
  id: string;
  title: string;
  category: 'material' | 'service' | 'equipment' | 'software';
  requester: string;
  department: string;
  amount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'rejected';
  createdAt: string;
  vendor: string;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  orders: number;
  totalSpend: number;
  status: 'active' | 'evaluating' | 'blacklisted';
}

const MOCK_REQUESTS: ProcurementRequest[] = [
  {
    id: 'PR-2026-001',
    title: '服务器扩容采购',
    category: 'equipment',
    requester: '王五',
    department: '技术部',
    amount: 128000,
    priority: 'urgent',
    status: 'approved',
    createdAt: '2026-05-06',
    vendor: '华为云',
  },
  {
    id: 'PR-2026-002',
    title: '办公文具批量采购',
    category: 'material',
    requester: '李四',
    department: '行政部',
    amount: 8500,
    priority: 'low',
    status: 'ordered',
    createdAt: '2026-05-05',
    vendor: '得力办公',
  },
  {
    id: 'PR-2026-003',
    title: 'AI模型API服务订阅',
    category: 'software',
    requester: '张三',
    department: '技术部',
    amount: 45000,
    priority: 'high',
    status: 'pending',
    createdAt: '2026-05-07',
    vendor: 'OpenAI',
  },
  {
    id: 'PR-2026-004',
    title: '品牌设计外包服务',
    category: 'service',
    requester: '赵六',
    department: '营销部',
    amount: 65000,
    priority: 'medium',
    status: 'draft',
    createdAt: '2026-05-08',
    vendor: '待定',
  },
  {
    id: 'PR-2026-005',
    title: 'SSL证书续费',
    category: 'software',
    requester: '王五',
    department: '技术部',
    amount: 3200,
    priority: 'medium',
    status: 'received',
    createdAt: '2026-05-01',
    vendor: 'DigiCert',
  },
  {
    id: 'PR-2026-006',
    title: '会议室音视频设备',
    category: 'equipment',
    requester: '李四',
    department: '行政部',
    amount: 38000,
    priority: 'high',
    status: 'approved',
    createdAt: '2026-05-04',
    vendor: '海康威视',
  },
];

const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: '华为云',
    category: '云服务',
    rating: 4.8,
    orders: 42,
    totalSpend: 560000,
    status: 'active',
  },
  {
    id: 'v2',
    name: '得力办公',
    category: '办公用品',
    rating: 4.2,
    orders: 28,
    totalSpend: 85000,
    status: 'active',
  },
  {
    id: 'v3',
    name: 'DigiCert',
    category: '安全证书',
    rating: 4.5,
    orders: 12,
    totalSpend: 38000,
    status: 'active',
  },
  {
    id: 'v4',
    name: '海康威视',
    category: '安防设备',
    rating: 4.6,
    orders: 8,
    totalSpend: 120000,
    status: 'active',
  },
  {
    id: 'v5',
    name: '测试供应商',
    category: '外包',
    rating: 2.1,
    orders: 3,
    totalSpend: 15000,
    status: 'evaluating',
  },
];

const CATEGORY_LABELS: Record<ProcurementRequest['category'], string> = {
  material: '物料',
  service: '服务',
  equipment: '设备',
  software: '软件',
};
const PRIORITY_COLORS: Record<ProcurementRequest['priority'], string> = {
  low: '#94a3b8',
  medium: '#3b82f6',
  high: '#f97316',
  urgent: '#ef4444',
};
const STATUS_LABELS: Record<ProcurementRequest['status'], string> = {
  draft: '草稿',
  pending: '待审批',
  approved: '已审批',
  ordered: '已下单',
  received: '已到货',
  rejected: '已驳回',
};

export function ProcurementPage() {
  const tc = useThemeColors();
  const [activeTab, setActiveTab] = useState<'requests' | 'vendors' | 'analytics'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProcurementRequest['status']>('all');

  const totalSpend = useMemo(() => MOCK_REQUESTS.reduce((s, r) => s + r.amount, 0), []);
  const pendingCount = useMemo(() => MOCK_REQUESTS.filter(r => r.status === 'pending').length, []);
  const activeVendors = useMemo(() => MOCK_VENDORS.filter(v => v.status === 'active').length, []);

  const filteredRequests = useMemo(() => {
    let list = MOCK_REQUESTS;
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.requester.includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return list;
  }, [searchQuery, statusFilter]);

  const kpiCards = [
    {
      label: '本月采购额',
      value: `¥${totalSpend.toLocaleString()}`,
      icon: Package,
      color: tc.primary,
    },
    { label: '待审批', value: `${pendingCount} 件`, icon: Clock, color: '#f97316' },
    { label: '活跃供应商', value: `${activeVendors} 家`, icon: Truck, color: tc.success },
    { label: '合规率', value: '98.5%', icon: Shield, color: tc.accent },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: tc.textPrimary }}>
            采购管理
          </h1>
          <p className="text-sm" style={{ color: tc.textSecondary }}>
            采购需求 · 供应商管理 · 审批流程 · 成本分析 · AI智能采购
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
            新建采购
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
        {(['requests', 'vendors', 'analytics'] as const).map(tab => {
          const labels = { requests: '采购需求', vendors: '供应商管理', analytics: '成本分析' };
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

      {activeTab === 'requests' && (
        <NeonCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: tc.textPrimary }}>
              采购需求列表
            </h2>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
              >
                <Search className="w-4 h-4" style={{ color: tc.textMuted }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="搜索采购单..."
                  className="bg-transparent outline-none text-sm w-40"
                  style={{ color: tc.textPrimary }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: tc.bgCard,
                  color: tc.textPrimary,
                  border: `1px solid ${tc.borderSubtle}`,
                }}
              >
                <option value="all">全部状态</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {filteredRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-lg"
                style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{ background: `${tc.primary}20`, color: tc.primary }}
                    >
                      {req.id}
                    </span>
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {req.title}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: `${PRIORITY_COLORS[req.priority]}20`,
                        color: PRIORITY_COLORS[req.priority],
                      }}
                    >
                      {req.priority === 'urgent'
                        ? '紧急'
                        : req.priority === 'high'
                          ? '高'
                          : req.priority === 'medium'
                            ? '中'
                            : '低'}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        req.status === 'approved' || req.status === 'received'
                          ? tc.success
                          : req.status === 'rejected'
                            ? tc.destructive
                            : tc.textMuted,
                    }}
                  >
                    {STATUS_LABELS[req.status]}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <span style={{ color: tc.textMuted }}>类别: </span>
                    <span style={{ color: tc.textSecondary }}>{CATEGORY_LABELS[req.category]}</span>
                  </div>
                  <div>
                    <span style={{ color: tc.textMuted }}>申请人: </span>
                    <span style={{ color: tc.textSecondary }}>{req.requester}</span>
                  </div>
                  <div>
                    <span style={{ color: tc.textMuted }}>供应商: </span>
                    <span style={{ color: tc.textSecondary }}>{req.vendor}</span>
                  </div>
                  <div>
                    <span style={{ color: tc.textMuted }}>日期: </span>
                    <span style={{ color: tc.textSecondary }}>{req.createdAt}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold" style={{ color: tc.primary }}>
                      ¥{req.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: `1px solid ${tc.borderSubtle}` }}
          >
            <span className="text-sm" style={{ color: tc.textMuted }}>
              共 {filteredRequests.length} 条采购单
            </span>
            <span className="text-sm font-medium" style={{ color: tc.textSecondary }}>
              合计: ¥{filteredRequests.reduce((s, r) => s + r.amount, 0).toLocaleString()}
            </span>
          </div>
        </NeonCard>
      )}

      {activeTab === 'vendors' && (
        <NeonCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: tc.textPrimary }}>
              供应商管理
            </h2>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: `${tc.primary}20`, color: tc.primary }}
            >
              <UserPlus className="w-4 h-4" />
              添加供应商
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_VENDORS.map(v => (
              <div
                key={v.id}
                className="p-4 rounded-lg flex items-center justify-between"
                style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                    style={{ background: `${tc.primary}20`, color: tc.primary }}
                  >
                    {v.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {v.name}
                    </h3>
                    <p className="text-xs" style={{ color: tc.textMuted }}>
                      {v.category} · {v.orders}笔订单
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: tc.textMuted }}>
                      评分
                    </p>
                    <p
                      className="font-bold"
                      style={{
                        color:
                          v.rating >= 4 ? tc.success : v.rating >= 3 ? '#eab308' : tc.destructive,
                      }}
                    >
                      {v.rating}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: tc.textMuted }}>
                      累计采购
                    </p>
                    <p className="font-bold" style={{ color: tc.textPrimary }}>
                      ¥{v.totalSpend.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      background: v.status === 'active' ? `${tc.success}20` : `${'#eab308'}20`,
                      color: v.status === 'active' ? tc.success : '#eab308',
                    }}
                  >
                    {v.status === 'active' ? '合作中' : '评估中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeonCard className="p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: tc.textPrimary }}>
              <BarChart3 className="w-5 h-5 inline mr-2" style={{ color: tc.primary }} />
              采购类别分布
            </h2>
            <div className="space-y-3">
              {(['equipment', 'software', 'service', 'material'] as const).map(cat => {
                const total = MOCK_REQUESTS.filter(r => r.category === cat).reduce(
                  (s, r) => s + r.amount,
                  0,
                );
                const pct = Math.round((total / totalSpend) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span style={{ color: tc.textSecondary }}>{CATEGORY_LABELS[cat]}</span>
                      <span style={{ color: tc.textPrimary }}>
                        ¥{total.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: tc.borderSubtle }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: tc.primary }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </NeonCard>
          <NeonCard className="p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: tc.textPrimary }}>
              <FileText className="w-5 h-5 inline mr-2" style={{ color: tc.accent }} />
              审批效率
            </h2>
            <div className="space-y-4">
              {[
                { label: '平均审批周期', value: '2.3天', icon: Clock, color: tc.primary },
                { label: '一次通过率', value: '85.7%', icon: CheckCircle2, color: tc.success },
                { label: '紧急采购响应', value: '< 4小时', icon: ArrowUpRight, color: '#f97316' },
                { label: '供应商满意度', value: '4.5/5.0', icon: ArrowDownRight, color: tc.accent },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                      <span className="text-sm" style={{ color: tc.textSecondary }}>
                        {item.label}
                      </span>
                    </div>
                    <span className="font-bold" style={{ color: tc.textPrimary }}>
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </NeonCard>
        </div>
      )}
    </div>
  );
}
