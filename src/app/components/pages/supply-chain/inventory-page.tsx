import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { NeonCard } from '../../core/neon-card';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'hardware' | 'software' | 'material' | 'service';
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'critical' | 'overstock';
}

interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  quantity: number;
  operator: string;
  timestamp: string;
  note: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv001',
    name: 'MacBook Pro 16"',
    sku: 'HW-MBP-16',
    category: 'hardware',
    quantity: 25,
    unit: '台',
    minStock: 5,
    maxStock: 50,
    unitPrice: 18999,
    location: 'A区-01',
    lastUpdated: '2026-05-08',
    status: 'normal',
  },
  {
    id: 'inv002',
    name: '4K显示器',
    sku: 'HW-MON-4K',
    category: 'hardware',
    quantity: 3,
    unit: '台',
    minStock: 5,
    maxStock: 30,
    unitPrice: 3299,
    location: 'A区-02',
    lastUpdated: '2026-05-07',
    status: 'critical',
  },
  {
    id: 'inv003',
    name: 'JetBrains 全家桶',
    sku: 'SW-JB-ALL',
    category: 'software',
    quantity: 50,
    unit: '许可',
    minStock: 10,
    maxStock: 100,
    unitPrice: 1699,
    location: '虚拟',
    lastUpdated: '2026-05-06',
    status: 'normal',
  },
  {
    id: 'inv004',
    name: 'A4复印纸',
    sku: 'MT-PAP-A4',
    category: 'material',
    quantity: 120,
    unit: '箱',
    minStock: 30,
    maxStock: 200,
    unitPrice: 89,
    location: 'B区-01',
    lastUpdated: '2026-05-05',
    status: 'normal',
  },
  {
    id: 'inv005',
    name: '机械键盘',
    sku: 'HW-KB-MEC',
    category: 'hardware',
    quantity: 8,
    unit: '把',
    minStock: 10,
    maxStock: 40,
    unitPrice: 599,
    location: 'A区-03',
    lastUpdated: '2026-05-08',
    status: 'low',
  },
  {
    id: 'inv006',
    name: '投影仪',
    sku: 'HW-PJT-01',
    category: 'hardware',
    quantity: 15,
    unit: '台',
    minStock: 3,
    maxStock: 10,
    unitPrice: 4500,
    location: 'C区-01',
    lastUpdated: '2026-05-04',
    status: 'overstock',
  },
  {
    id: 'inv007',
    name: 'AWS S3 存储',
    sku: 'SV-AWS-S3',
    category: 'service',
    quantity: 10,
    unit: 'TB',
    minStock: 5,
    maxStock: 50,
    unitPrice: 2300,
    location: '云端',
    lastUpdated: '2026-05-08',
    status: 'normal',
  },
  {
    id: 'inv008',
    name: '墨盒(黑色)',
    sku: 'MT-INK-BK',
    category: 'material',
    quantity: 4,
    unit: '个',
    minStock: 10,
    maxStock: 50,
    unitPrice: 189,
    location: 'B区-02',
    lastUpdated: '2026-05-07',
    status: 'critical',
  },
];

const MOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mv001',
    itemId: 'inv001',
    itemName: 'MacBook Pro 16"',
    type: 'inbound',
    quantity: 10,
    operator: '李四',
    timestamp: '2026-05-08 14:30',
    note: '新员工入职设备',
  },
  {
    id: 'mv002',
    itemId: 'inv002',
    itemName: '4K显示器',
    type: 'outbound',
    quantity: 5,
    operator: '王五',
    timestamp: '2026-05-08 10:15',
    note: '技术部领用',
  },
  {
    id: 'mv003',
    itemId: 'inv004',
    itemName: 'A4复印纸',
    type: 'outbound',
    quantity: 20,
    operator: '赵六',
    timestamp: '2026-05-07 16:00',
    note: '各部门领用',
  },
  {
    id: 'mv004',
    itemId: 'inv006',
    itemName: '投影仪',
    type: 'transfer',
    quantity: 2,
    operator: '张三',
    timestamp: '2026-05-07 09:30',
    note: 'C区→D区调拨',
  },
  {
    id: 'mv005',
    itemId: 'inv005',
    itemName: '机械键盘',
    type: 'adjustment',
    quantity: -3,
    operator: '李四',
    timestamp: '2026-05-06 11:20',
    note: '盘点调整-损坏',
  },
];

const CATEGORY_LABELS: Record<InventoryItem['category'], string> = {
  hardware: '硬件设备',
  software: '软件许可',
  material: '办公耗材',
  service: '云服务',
};
const STATUS_LABELS: Record<InventoryItem['status'], string> = {
  normal: '正常',
  low: '偏低',
  critical: '告急',
  overstock: '积压',
};
const STATUS_COLORS: Record<InventoryItem['status'], string> = {
  normal: '#22c55e',
  low: '#f97316',
  critical: '#ef4444',
  overstock: '#3b82f6',
};
const MOVEMENT_LABELS: Record<StockMovement['type'], string> = {
  inbound: '入库',
  outbound: '出库',
  transfer: '调拨',
  adjustment: '调整',
};

export function InventoryPage() {
  const tc = useThemeColors();
  const [activeTab, setActiveTab] = useState<'stock' | 'movements' | 'alerts'>('stock');
  const [searchQuery, setSearchQuery] = useState('');

  const totalValue = useMemo(
    () => MOCK_INVENTORY.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    [],
  );
  const alertCount = useMemo(
    () => MOCK_INVENTORY.filter(i => i.status === 'critical' || i.status === 'low').length,
    [],
  );
  const totalSKUs = MOCK_INVENTORY.length;

  const filteredItems = useMemo(() => {
    if (!searchQuery) return MOCK_INVENTORY;
    const q = searchQuery.toLowerCase();
    return MOCK_INVENTORY.filter(
      i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const kpiCards = [
    {
      label: '库存总值',
      value: `¥${(totalValue / 10000).toFixed(1)}万`,
      icon: Warehouse,
      color: tc.primary,
    },
    { label: 'SKU总数', value: `${totalSKUs} 个`, icon: Package, color: tc.secondary },
    {
      label: '库存预警',
      value: `${alertCount} 项`,
      icon: AlertTriangle,
      color: alertCount > 0 ? tc.destructive : tc.success,
    },
    { label: '周转率', value: '4.2次/月', icon: TrendingUp, color: tc.accent },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: tc.textPrimary }}>
            库存管理
          </h1>
          <p className="text-sm" style={{ color: tc.textSecondary }}>
            库存查询 · 入库/出库 · 库存预警 · 盘点管理 · AI智能补货
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
            入库登记
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
        {(['stock', 'movements', 'alerts'] as const).map(tab => {
          const labels = { stock: '库存查询', movements: '出入库记录', alerts: '库存预警' };
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

      {activeTab === 'stock' && (
        <NeonCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: tc.textPrimary }}>
              库存明细
            </h2>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
            >
              <Search className="w-4 h-4" style={{ color: tc.textMuted }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索名称/SKU..."
                className="bg-transparent outline-none text-sm w-48"
                style={{ color: tc.textPrimary }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                  {['名称', 'SKU', '类别', '库存', '状态', '库位', '单价', '库存值'].map(h => (
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
                {filteredItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                    <td className="py-3 px-2 font-medium" style={{ color: tc.textPrimary }}>
                      {item.name}
                    </td>
                    <td className="py-3 px-2 font-mono text-xs" style={{ color: tc.textMuted }}>
                      {item.sku}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textSecondary }}>
                      {CATEGORY_LABELS[item.category]}
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-bold" style={{ color: tc.textPrimary }}>
                        {item.quantity}
                      </span>
                      <span className="text-xs ml-1" style={{ color: tc.textMuted }}>
                        {item.unit}
                      </span>
                      <span className="text-xs ml-1" style={{ color: tc.textMuted }}>
                        (min:{item.minStock})
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background: `${STATUS_COLORS[item.status]}20`,
                          color: STATUS_COLORS[item.status],
                        }}
                      >
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs" style={{ color: tc.textMuted }}>
                      {item.location}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textSecondary }}>
                      ¥{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 font-bold" style={{ color: tc.primary }}>
                      ¥{(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeonCard>
      )}

      {activeTab === 'movements' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            出入库记录
          </h2>
          <div className="space-y-3">
            {MOCK_MOVEMENTS.map(mv => {
              const isInbound = mv.type === 'inbound';
              const MovementIcon = isInbound
                ? ArrowDownRight
                : mv.type === 'outbound'
                  ? ArrowUpRight
                  : mv.type === 'transfer'
                    ? RefreshCw
                    : BarChart3;
              return (
                <div
                  key={mv.id}
                  className="p-4 rounded-lg flex items-center justify-between"
                  style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${isInbound ? tc.success : tc.destructive}20` }}
                    >
                      <MovementIcon
                        className="w-5 h-5"
                        style={{ color: isInbound ? tc.success : tc.destructive }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            background: `${isInbound ? tc.success : tc.destructive}20`,
                            color: isInbound ? tc.success : tc.destructive,
                          }}
                        >
                          {MOVEMENT_LABELS[mv.type]}
                        </span>
                        <h3 className="font-semibold text-sm" style={{ color: tc.textPrimary }}>
                          {mv.itemName}
                        </h3>
                      </div>
                      <p className="text-xs mt-1" style={{ color: tc.textMuted }}>
                        {mv.note} · {mv.operator} · {mv.timestamp}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-lg ${isInbound ? '' : ''}`}
                    style={{ color: isInbound ? tc.success : tc.destructive }}
                  >
                    {isInbound ? '+' : mv.type === 'adjustment' ? '' : '-'}
                    {Math.abs(mv.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </NeonCard>
      )}

      {activeTab === 'alerts' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            <AlertTriangle className="w-5 h-5 inline mr-2" style={{ color: tc.destructive }} />
            库存预警
          </h2>
          <div className="space-y-3">
            {MOCK_INVENTORY.filter(i => i.status === 'critical' || i.status === 'low').map(item => (
              <div
                key={item.id}
                className="p-4 rounded-lg"
                style={{
                  background: `${STATUS_COLORS[item.status]}08`,
                  border: `1px solid ${STATUS_COLORS[item.status]}30`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className="w-5 h-5"
                      style={{ color: STATUS_COLORS[item.status] }}
                    />
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {item.name}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: `${STATUS_COLORS[item.status]}20`,
                        color: STATUS_COLORS[item.status],
                      }}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>
                  <span className="font-mono text-xs" style={{ color: tc.textMuted }}>
                    {item.sku}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span style={{ color: tc.textMuted }}>
                    当前:{' '}
                    <strong style={{ color: STATUS_COLORS[item.status] }}>{item.quantity}</strong>{' '}
                    {item.unit}
                  </span>
                  <span style={{ color: tc.textMuted }}>
                    安全库存: <strong style={{ color: tc.textPrimary }}>{item.minStock}</strong>{' '}
                    {item.unit}
                  </span>
                  <span style={{ color: tc.textMuted }}>
                    缺口:{' '}
                    <strong style={{ color: tc.destructive }}>
                      {Math.max(0, item.minStock - item.quantity)}
                    </strong>{' '}
                    {item.unit}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 rounded text-xs font-medium"
                    style={{ background: `${tc.primary}20`, color: tc.primary }}
                  >
                    立即补货
                  </button>
                  <button
                    className="px-3 py-1 rounded text-xs"
                    style={{
                      background: tc.bgCard,
                      color: tc.textSecondary,
                      border: `1px solid ${tc.borderSubtle}`,
                    }}
                  >
                    生成采购单
                  </button>
                </div>
              </div>
            ))}
            {alertCount === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: tc.success }} />
                <p className="text-lg font-semibold" style={{ color: tc.textPrimary }}>
                  所有库存状态正常
                </p>
                <p className="text-sm" style={{ color: tc.textMuted }}>
                  暂无预警项目
                </p>
              </div>
            )}
          </div>
        </NeonCard>
      )}
    </div>
  );
}
