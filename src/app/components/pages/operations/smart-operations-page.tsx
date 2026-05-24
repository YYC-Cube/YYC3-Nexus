import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  HardDrive,
  Play,
  RefreshCw,
  Settings,
  Shield,
  TrendingUp,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { NeonCard } from '../../core/neon-card';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface ServiceStatus {
  name: string;
  status: 'online' | 'warning' | 'critical';
  uptime: number;
  requests: number;
  latencyMs: number;
  lastIncident: string | null;
}

interface AIOpsAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  autoHealable: boolean;
  healed: boolean;
}

interface CapacityForecast {
  resource: string;
  current: number;
  predicted7d: number;
  predicted30d: number;
  unit: string;
  status: 'safe' | 'watch' | 'critical';
}

interface SelfHealAction {
  id: string;
  trigger: string;
  action: string;
  status: 'success' | 'failed' | 'running';
  timestamp: string;
  durationMs: number;
}

const MOCK_SERVICES: ServiceStatus[] = [
  {
    name: 'API服务',
    status: 'online',
    uptime: 99.99,
    requests: 125000,
    latencyMs: 42,
    lastIncident: null,
  },
  {
    name: '数据库',
    status: 'online',
    uptime: 99.95,
    requests: 89000,
    latencyMs: 18,
    lastIncident: null,
  },
  {
    name: '缓存服务',
    status: 'online',
    uptime: 99.98,
    requests: 210000,
    latencyMs: 5,
    lastIncident: null,
  },
  {
    name: '消息队列',
    status: 'warning',
    uptime: 98.5,
    requests: 45000,
    latencyMs: 230,
    lastIncident: '2026-05-07 14:22',
  },
  {
    name: 'AI代理服务',
    status: 'online',
    uptime: 99.92,
    requests: 32000,
    latencyMs: 850,
    lastIncident: null,
  },
  {
    name: 'CDN节点',
    status: 'online',
    uptime: 99.99,
    requests: 580000,
    latencyMs: 12,
    lastIncident: null,
  },
];

const MOCK_ALERTS: AIOpsAlert[] = [
  {
    id: 'a1',
    severity: 'warning',
    title: '消息队列积压',
    description: 'MQ积压消息超过阈值(5000条)，当前积压: 8,200条',
    source: 'AI预测引擎',
    timestamp: '2026-05-08 23:15',
    autoHealable: true,
    healed: false,
  },
  {
    id: 'a2',
    severity: 'critical',
    title: '内存使用率异常',
    description: 'Node进程内存使用达到87%，接近OOM阈值(90%)',
    source: '异常检测',
    timestamp: '2026-05-08 23:10',
    autoHealable: true,
    healed: true,
  },
  {
    id: 'a3',
    severity: 'info',
    title: 'CPU负载波动',
    description: 'CPU使用率从42%波动至65%，在正常范围内',
    source: '趋势分析',
    timestamp: '2026-05-08 22:45',
    autoHealable: false,
    healed: false,
  },
  {
    id: 'a4',
    severity: 'warning',
    title: 'API响应时间上升',
    description: 'AI代理服务P99延迟从800ms上升至1200ms',
    source: '性能监控',
    timestamp: '2026-05-08 22:30',
    autoHealable: true,
    healed: false,
  },
  {
    id: 'a5',
    severity: 'info',
    title: 'SSL证书即将到期',
    description: 'DigiCert证书将在30天后到期，建议提前续费',
    source: '安全扫描',
    timestamp: '2026-05-08 20:00',
    autoHealable: false,
    healed: false,
  },
];

const MOCK_CAPACITY: CapacityForecast[] = [
  { resource: 'CPU', current: 42, predicted7d: 48, predicted30d: 62, unit: '%', status: 'safe' },
  { resource: '内存', current: 68, predicted7d: 75, predicted30d: 85, unit: '%', status: 'watch' },
  { resource: '磁盘', current: 55, predicted7d: 60, predicted30d: 72, unit: '%', status: 'safe' },
  { resource: '带宽', current: 35, predicted7d: 42, predicted30d: 55, unit: '%', status: 'safe' },
  {
    resource: '数据库连接池',
    current: 72,
    predicted7d: 80,
    predicted30d: 90,
    unit: '%',
    status: 'watch',
  },
];

const MOCK_HEALS: SelfHealAction[] = [
  {
    id: 'h1',
    trigger: '内存使用率 > 85%',
    action: '自动清理缓存 + 重启僵死进程',
    status: 'success',
    timestamp: '2026-05-08 23:10',
    durationMs: 3200,
  },
  {
    id: 'h2',
    trigger: 'API 5xx错误率 > 1%',
    action: '自动回滚至上一个稳定版本',
    status: 'success',
    timestamp: '2026-05-07 16:45',
    durationMs: 8500,
  },
  {
    id: 'h3',
    trigger: '数据库慢查询 > 5s',
    action: '自动添加缺失索引 + 优化查询计划',
    status: 'success',
    timestamp: '2026-05-06 10:20',
    durationMs: 1200,
  },
  {
    id: 'h4',
    trigger: 'CDN缓存命中率 < 80%',
    action: '自动刷新热点资源缓存',
    status: 'success',
    timestamp: '2026-05-05 08:15',
    durationMs: 500,
  },
];

const SEVERITY_COLORS = { info: '#3b82f6', warning: '#f97316', critical: '#ef4444' };
const STATUS_LABELS: Record<string, string> = {
  online: '正常运行',
  warning: '警告',
  critical: '严重',
};
const HEAL_LABELS: Record<string, string> = { success: '成功', failed: '失败', running: '执行中' };

export function SmartOperationsPage() {
  const tc = useThemeColors();
  const [activeTab, setActiveTab] = useState<'monitor' | 'aiops' | 'capacity' | 'selfheal'>(
    'monitor',
  );

  const criticalAlerts = useMemo(
    () => MOCK_ALERTS.filter(a => a.severity === 'critical').length,
    [],
  );
  const healedCount = useMemo(() => MOCK_HEALS.filter(h => h.status === 'success').length, []);
  const healSuccessRate = useMemo(
    () => Math.round((healedCount / MOCK_HEALS.length) * 100),
    [healedCount],
  );

  const systemMetrics = [
    { label: '系统正常运行时间', value: '99.98%', icon: CheckCircle2, color: tc.success },
    { label: 'CPU使用率', value: '42%', icon: Cpu, color: tc.primary },
    { label: '内存使用', value: '68%', icon: HardDrive, color: tc.secondary },
    { label: '网络流量', value: '2.4GB/s', icon: Wifi, color: tc.accent },
  ];

  const aiopsMetrics = [
    {
      label: 'AI告警',
      value: `${criticalAlerts} 严重`,
      icon: AlertTriangle,
      color: criticalAlerts > 0 ? tc.destructive : tc.success,
    },
    { label: '自愈成功率', value: `${healSuccessRate}%`, icon: Wrench, color: tc.success },
    { label: '平均恢复时间', value: '3.4秒', icon: Clock, color: tc.primary },
    { label: '预测准确率', value: '94.2%', icon: Brain, color: tc.accent },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: tc.textPrimary }}>
            智能运维系统
          </h1>
          <p className="text-sm" style={{ color: tc.textSecondary }}>
            系统监控 · AIOps自愈 · 容量预测 · 故障预警 · 智能巡检
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
            刷新
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
            style={{ background: tc.gradientButton, color: tc.textPrimary, boxShadow: tc.shadowMd }}
          >
            <Settings className="w-5 h-5" />
            配置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {systemMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <NeonCard key={metric.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8" style={{ color: metric.color }} />
              </div>
              <p className="text-sm mb-1" style={{ color: tc.textMuted }}>
                {metric.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: tc.textPrimary }}>
                {metric.value}
              </p>
            </NeonCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {aiopsMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <NeonCard key={metric.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8" style={{ color: metric.color }} />
              </div>
              <p className="text-sm mb-1" style={{ color: tc.textMuted }}>
                {metric.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: tc.textPrimary }}>
                {metric.value}
              </p>
            </NeonCard>
          );
        })}
      </div>

      <div className="flex gap-2 border-b pb-2" style={{ borderColor: tc.borderSubtle }}>
        {(['monitor', 'aiops', 'capacity', 'selfheal'] as const).map(tab => {
          const labels = {
            monitor: '服务监控',
            aiops: 'AIOps告警',
            capacity: '容量预测',
            selfheal: '自愈记录',
          };
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

      {activeTab === 'monitor' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            服务状态监控
          </h2>
          <div className="space-y-4">
            {MOCK_SERVICES.map(service => (
              <div
                key={service.name}
                className="p-4 rounded-lg"
                style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'animate-pulse' : ''}`}
                      style={{
                        background:
                          service.status === 'online'
                            ? tc.success
                            : service.status === 'warning'
                              ? '#f97316'
                              : tc.destructive,
                        boxShadow: `0 0 10px ${service.status === 'online' ? tc.success : '#f97316'}`,
                      }}
                    />
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {service.name}
                    </h3>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: service.status === 'online' ? tc.success : '#f97316' }}
                  >
                    {STATUS_LABELS[service.status]}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: tc.textMuted }}>
                      正常运行时间
                    </p>
                    <p className="font-bold" style={{ color: tc.textPrimary }}>
                      {service.uptime}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: tc.textMuted }}>
                      请求处理
                    </p>
                    <p className="font-bold" style={{ color: tc.primary }}>
                      {service.requests.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: tc.textMuted }}>
                      平均延迟
                    </p>
                    <p
                      className="font-bold"
                      style={{ color: service.latencyMs > 200 ? '#f97316' : tc.textPrimary }}
                    >
                      {service.latencyMs}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: tc.textMuted }}>
                      最近故障
                    </p>
                    <p className="text-sm" style={{ color: tc.textMuted }}>
                      {service.lastIncident || '无'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {activeTab === 'aiops' && (
        <NeonCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: tc.textPrimary }}>
              <Brain className="w-5 h-5 inline mr-2" style={{ color: tc.primary }} />
              AIOps 智能告警
            </h2>
            <div className="flex gap-2">
              {(['all', 'critical', 'warning', 'info'] as const).map(s => (
                <span
                  key={s}
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    background:
                      s === 'critical'
                        ? `${tc.destructive}20`
                        : s === 'warning'
                          ? '#f9731620'
                          : s === 'info'
                            ? '#3b82f620'
                            : `${tc.bgCard}`,
                    color: s === 'all' ? tc.textMuted : SEVERITY_COLORS[s],
                  }}
                >
                  {s === 'all'
                    ? `全部(${MOCK_ALERTS.length})`
                    : s === 'critical'
                      ? `严重(${MOCK_ALERTS.filter(a => a.severity === 'critical').length})`
                      : s === 'warning'
                        ? `警告(${MOCK_ALERTS.filter(a => a.severity === 'warning').length})`
                        : `信息(${MOCK_ALERTS.filter(a => a.severity === 'info').length})`}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_ALERTS.map(alert => (
              <div
                key={alert.id}
                className="p-4 rounded-lg"
                style={{
                  background: `${SEVERITY_COLORS[alert.severity]}08`,
                  border: `1px solid ${SEVERITY_COLORS[alert.severity]}30`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className="w-5 h-5"
                      style={{ color: SEVERITY_COLORS[alert.severity] }}
                    />
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {alert.title}
                    </h3>
                    {alert.healed && (
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: `${tc.success}20`, color: tc.success }}
                      >
                        已自愈
                      </span>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: tc.textMuted }}>
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: tc.textSecondary }}>
                  {alert.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: tc.textMuted }}>
                    来源: {alert.source}
                  </span>
                  {alert.autoHealable && !alert.healed && (
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium"
                      style={{ background: `${tc.primary}20`, color: tc.primary }}
                    >
                      <Play className="w-3 h-3" />
                      执行自愈
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {activeTab === 'capacity' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            <TrendingUp className="w-5 h-5 inline mr-2" style={{ color: tc.accent }} />
            AI容量预测
          </h2>
          <div className="space-y-4">
            {MOCK_CAPACITY.map(cap => {
              const statusColor =
                cap.status === 'safe'
                  ? tc.success
                  : cap.status === 'watch'
                    ? '#eab308'
                    : tc.destructive;
              return (
                <div
                  key={cap.resource}
                  className="p-4 rounded-lg"
                  style={{ background: tc.bgCard, border: `1px solid ${tc.borderSubtle}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold" style={{ color: tc.textPrimary }}>
                      {cap.resource}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: `${statusColor}20`, color: statusColor }}
                    >
                      {cap.status === 'safe' ? '安全' : cap.status === 'watch' ? '关注' : '严重'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs" style={{ color: tc.textMuted }}>
                        当前
                      </p>
                      <p className="text-lg font-bold" style={{ color: tc.textPrimary }}>
                        {cap.current}
                        {cap.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: tc.textMuted }}>
                        7天预测
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: cap.predicted7d > 70 ? '#f97316' : tc.textPrimary }}
                      >
                        {cap.predicted7d}
                        {cap.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: tc.textMuted }}>
                        30天预测
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{
                          color:
                            cap.predicted30d > 80
                              ? tc.destructive
                              : cap.predicted30d > 70
                                ? '#f97316'
                                : tc.textPrimary,
                        }}
                      >
                        {cap.predicted30d}
                        {cap.unit}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: tc.borderSubtle }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${cap.current}%`, background: statusColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="mt-4 p-3 rounded-lg"
            style={{ background: `${tc.accent}10`, border: `1px solid ${tc.accent}30` }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: tc.accent }} />
              <span className="text-sm" style={{ color: tc.textSecondary }}>
                AI预测模型基于过去90天的负载数据训练，准确率 94.2%
              </span>
            </div>
          </div>
        </NeonCard>
      )}

      {activeTab === 'selfheal' && (
        <NeonCard className="p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: tc.textPrimary }}>
            <Zap className="w-5 h-5 inline mr-2" style={{ color: tc.success }} />
            自愈执行记录
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                  {['触发条件', '自愈动作', '状态', '执行时间', '耗时'].map(h => (
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
                {MOCK_HEALS.map(heal => (
                  <tr key={heal.id} style={{ borderBottom: `1px solid ${tc.borderSubtle}` }}>
                    <td className="py-3 px-2 font-medium" style={{ color: tc.textPrimary }}>
                      {heal.trigger}
                    </td>
                    <td className="py-3 px-2" style={{ color: tc.textSecondary }}>
                      {heal.action}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background:
                            heal.status === 'success' ? `${tc.success}20` : `${tc.destructive}20`,
                          color: heal.status === 'success' ? tc.success : tc.destructive,
                        }}
                      >
                        {HEAL_LABELS[heal.status]}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs" style={{ color: tc.textMuted }}>
                      {heal.timestamp}
                    </td>
                    <td className="py-3 px-2 font-mono" style={{ color: tc.textSecondary }}>
                      {(heal.durationMs / 1000).toFixed(1)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: `1px solid ${tc.borderSubtle}` }}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: tc.textMuted }}>
                共 {MOCK_HEALS.length} 次自愈
              </span>
              <span className="text-sm" style={{ color: tc.success }}>
                成功率 {healSuccessRate}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: tc.primary }} />
              <span className="text-sm" style={{ color: tc.textSecondary }}>
                平均恢复时间:{' '}
                {(
                  MOCK_HEALS.reduce((s, h) => s + h.durationMs, 0) /
                  MOCK_HEALS.length /
                  1000
                ).toFixed(1)}
                s
              </span>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
