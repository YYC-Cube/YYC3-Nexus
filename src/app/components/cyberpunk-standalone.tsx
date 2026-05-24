import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  Bot,
  Brain,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Code,
  Cpu,
  Crown,
  Database,
  DollarSign,
  FileText,
  GitBranch,
  Handshake,
  Heart,
  HeartHandshake,
  History,
  Image,
  Languages,
  Layers,
  LayoutDashboard,
  Link,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Package,
  PenTool,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PlayCircle,
  Radio,
  RefreshCw,
  Rocket,
  ScrollText,
  Search,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  UserCircle,
  UserPlus,
  Users,
  Volume2,
  Wifi,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { useAIModel } from './context/ai-model-context';
import { type PageId, useApp, useRealtimeSimulation } from './context/app-context';
import { useI18n } from './context/i18n-context';
import { CommandPalette, useCommandPalette } from './core/command-palette';
import { DataExportModal } from './core/data-export-modal';
import { GlitchText } from './core/glitch-text';
import { NeonCard } from './core/neon-card';
import { NotificationDrawer } from './core/notification-drawer';
import { OnboardingTutorial } from './core/onboarding-tutorial';
import { PageTransition } from './core/page-transition';
import { ParticleCanvas } from './core/particle-canvas';
import { ThemeSwitcherButtonCompact } from './core/theme-switcher-button';
import { getThemeNavColor, useThemeColors } from './hooks/use-theme-colors';
import { ModelSettings } from './model-settings';
import { ChatInterface } from './pages/ai/chat-interface';

const ActivityLogPage = lazy(() =>
  import('./core/activity-log').then(m => ({ default: m.ActivityLogPage })),
);
const AIToolsPage = lazy(() =>
  import('./pages/ai/ai-tools-page').then(m => ({ default: m.AIToolsPage })),
);
const AppOverviewPage = lazy(() =>
  import('./pages/dashboard/app-overview-page').then(m => ({ default: m.AppOverviewPage })),
);
const BrandManagementPage = lazy(() =>
  import('./pages/marketing/brand-management-page').then(m => ({ default: m.BrandManagementPage })),
);
const CampaignExecutionPage = lazy(() =>
  import('./pages/marketing/campaign-execution-page').then(m => ({
    default: m.CampaignExecutionPage,
  })),
);
const ChannelCenterPage = lazy(() =>
  import('./pages/integration/channel-center-page').then(m => ({ default: m.ChannelCenterPage })),
);
const CollabCreationPage = lazy(() =>
  import('./pages/profile/collab-creation-page').then(m => ({ default: m.CollabCreationPage })),
);
const CustomerAcquisitionPage = lazy(() =>
  import('./pages/marketing/customer-acquisition-page').then(m => ({
    default: m.CustomerAcquisitionPage,
  })),
);
const CustomerCarePage = lazy(() =>
  import('./pages/customer/customer-care-page').then(m => ({ default: m.CustomerCarePage })),
);
const DashboardPage = lazy(() =>
  import('./pages/dashboard/dashboard-page').then(m => ({ default: m.DashboardPage })),
);
const DataIntegrationPage = lazy(() =>
  import('./pages/integration/data-integration-page').then(m => ({
    default: m.DataIntegrationPage,
  })),
);
const DecisionSupportPage = lazy(() =>
  import('./pages/dashboard/decision-support-page').then(m => ({ default: m.DecisionSupportPage })),
);
const FormHistory = lazy(() => import('./form-history').then(m => ({ default: m.FormHistory })));
const FormTemplateBuilder = lazy(() =>
  import('./form-template-builder').then(m => ({ default: m.FormTemplateBuilder })),
);
const InsightsEnhancedPage = lazy(() =>
  import('./pages/customer/insights-enhanced').then(m => ({ default: m.InsightsEnhancedPage })),
);
const LeftPanelPage = lazy(() =>
  import('./left-panel-page').then(m => ({ default: m.LeftPanelPage })),
);
const MarketingAnalyticsPage = lazy(() =>
  import('./pages/marketing/marketing-analytics-page').then(m => ({
    default: m.MarketingAnalyticsPage,
  })),
);
const MarketingAssetsPage = lazy(() =>
  import('./pages/marketing/marketing-assets-page').then(m => ({ default: m.MarketingAssetsPage })),
);
const MarketingStrategyPage = lazy(() =>
  import('./pages/marketing/marketing-strategy-page').then(m => ({
    default: m.MarketingStrategyPage,
  })),
);
const NLPProcessingPage = lazy(() =>
  import('./pages/ai/nlp-processing-page').then(m => ({ default: m.NLPProcessingPage })),
);
const NumberDatabasePage = lazy(() =>
  import('./number-database').then(m => ({ default: m.NumberDatabasePage })),
);
const ParameterSettingsPage = lazy(() =>
  import('./pages/settings/parameter-settings-page').then(m => ({
    default: m.ParameterSettingsPage,
  })),
);
const PlatformIntegrationPage = lazy(() =>
  import('./pages/integration/platform-integration-page').then(m => ({
    default: m.PlatformIntegrationPage,
  })),
);
const PlatformSettingsPage = lazy(() =>
  import('./pages/settings/platform-settings-page').then(m => ({
    default: m.PlatformSettingsPage,
  })),
);
const ProfilePage = lazy(() =>
  import('./pages/profile/profile-page').then(m => ({ default: m.ProfilePage })),
);
const QuickActionsPage = lazy(() =>
  import('./pages/developer/quick-actions-page').then(m => ({ default: m.QuickActionsPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/settings/settings-page-standalone').then(m => ({ default: m.SettingsPage })),
);
const SmartCreationPage = lazy(() =>
  import('./pages/ai/smart-creation-page').then(m => ({ default: m.SmartCreationPage })),
);
const SmartFormPage = lazy(() =>
  import('./smart-form-system').then(m => ({ default: m.SmartFormPage })),
);
const SmartMarketingEnginePage = lazy(() =>
  import('./pages/marketing/smart-marketing-engine-page').then(m => ({
    default: m.SmartMarketingEnginePage,
  })),
);
const SmartOperationsPage = lazy(() =>
  import('./pages/operations/smart-operations-page').then(m => ({
    default: m.SmartOperationsPage,
  })),
);
const TaskBoardPage = lazy(() =>
  import('./pages/tasks/task-board-page').then(m => ({ default: m.TaskBoardPage })),
);
const WechatConfigPage = lazy(() =>
  import('./pages/integration/wechat-config-page').then(m => ({ default: m.WechatConfigPage })),
);
const CompensationPage = lazy(() =>
  import('./pages/hr-finance/compensation-page').then(m => ({ default: m.CompensationPage })),
);
const FinancePage = lazy(() =>
  import('./pages/hr-finance/finance-page').then(m => ({ default: m.FinancePage })),
);
const ProcurementPage = lazy(() =>
  import('./pages/supply-chain/procurement-page').then(m => ({ default: m.ProcurementPage })),
);
const InventoryPage = lazy(() =>
  import('./pages/supply-chain/inventory-page').then(m => ({ default: m.InventoryPage })),
);

function PageLoader() {
  const tc = useThemeColors();
  return (
    <div className="flex items-center justify-center h-full" style={{ background: tc.bgBase }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: `${tc.primary}30`, borderTopColor: tc.primary }}
        />
        <span className="text-xs" style={{ color: tc.textMuted }}>
          加载中...
        </span>
      </div>
    </div>
  );
}

const NAV_LABEL_KEYS: Record<string, string> = {
  dashboard: 'nav.dashboard',
  chat: 'nav.chat',
  clm: 'nav.clm',
  aicall: 'nav.aicall',
  tools: 'nav.tools',
  workflow: 'nav.workflow',
  logs: 'nav.logs',
  insights: 'nav.insights',
  settings: 'nav.settings',
  forms: 'nav.forms',
  contacts: 'nav.contacts',
  customerCare: 'nav.customerCare',
  collab: 'nav.collab',
  // Platform Integration
  paramSettings: 'nav.paramSettings',
  platformSettings: 'nav.platformSettings',
  wechatConfig: 'nav.wechatConfig',
  channelCenter: 'nav.channelCenter',
  dataIntegration: 'nav.dataIntegration',
  // HR & Finance
  compensation: 'nav.compensation',
  finance: 'nav.finance',
  // Supply Chain
  procurement: 'nav.procurement',
  inventory: 'nav.inventory',
  // AI Marketing
  marketingPlan: 'nav.marketingPlan',
  promotionExec: 'nav.promotionExec',
  marketingAnalytics: 'nav.marketingAnalytics',
  marketingAssets: 'nav.marketingAssets',
  customerAcquisition: 'nav.customerAcquisition',
  brandMgmt: 'nav.brandMgmt',
  intelligentOps: 'nav.intelligentOps',
  platformHub: 'nav.platformHub',
  aiCreativeTools: 'nav.aiCreativeTools',
  aiMarketingEngine: 'nav.aiMarketingEngine',
  appOverview: 'nav.appOverview',
  aiDecisionSupport: 'nav.aiDecisionSupport',
  nlpProcessing: 'nav.nlpProcessing',
  quickActions: 'nav.quickActions',
  taskBoard: 'nav.taskBoard',
  devWorkspace: 'nav.devWorkspace',
};

const SIDEBAR_PERSONAL_KEYS: Record<string, string> = {
  history: 'nav.history',
  favorites: 'nav.favorites',
  profile: 'nav.profile',
};

// --- Nav item type ---
interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
  color: string;
  badge?: number;
}
interface NavGroup {
  groupKey: string;
  labelKey: string;
  items: NavItem[];
}

// Core features (flat — always visible)
const coreNavItems: NavItem[] = [
  { id: 'dashboard', label: '数据驾驶舱', icon: LayoutDashboard, color: '#00f0ff' },
  { id: 'chat', label: 'AI 聊天', icon: MessageCircle, color: '#00f0ff' },
  { id: 'clm', label: '客户生命周期', icon: Users, color: '#00d4ff', badge: 5 },
  { id: 'aicall', label: 'AI 智能呼叫', icon: Phone, color: '#00ffcc', badge: 3 },
  { id: 'customerCare', label: '客户关怀中心', icon: Heart, color: '#00d4ff', badge: 8 },
  { id: 'contacts', label: '号码库', icon: Database, color: '#00ffc8', badge: 10 },
  { id: 'forms', label: '智能表单', icon: ClipboardList, color: '#41ffdd' },
  { id: 'tools', label: 'AI 工具', icon: Wrench, color: '#00ffc8' },
  { id: 'workflow', label: '工作流', icon: GitBranch, color: '#41ffdd' },
  { id: 'logs', label: '操作日志', icon: ScrollText, color: '#00ffc8' },
  { id: 'collab', label: '协同创作', icon: Layers, color: '#00ffcc' },
  { id: 'insights', label: '数据洞察', icon: BarChart3, color: '#00f0ff' },
  { id: 'quickActions', label: '一键操作', icon: Zap, color: '#f97316' },
  { id: 'taskBoard', label: '任务看板', icon: Target, color: '#22c55e' },
  { id: 'devWorkspace', label: '开发工作台', icon: Code, color: '#3b82f6' },
  { id: 'settings', label: '设置', icon: Settings, color: '#008b9d' },
];

// Collapsible nav groups
const navGroups: NavGroup[] = [
  {
    groupKey: 'platformIntegration',
    labelKey: 'nav.group.platformIntegration',
    items: [
      { id: 'paramSettings', label: '参数设置', icon: Settings, color: '#8b5cf6' },
      { id: 'platformSettings', label: '平台设置', icon: Server, color: '#3b82f6' },
      { id: 'wechatConfig', label: '微信配置', icon: MessageSquare, color: '#22c55e' },
      { id: 'channelCenter', label: '渠道中心', icon: Radio, color: '#f97316' },
      { id: 'dataIntegration', label: '数据集成', icon: Database, color: '#06b6d4' },
    ],
  },
  {
    groupKey: 'hrFinance',
    labelKey: 'nav.group.hrFinance',
    items: [
      { id: 'compensation', label: '薪酬激励管理', icon: Award, color: '#8b5cf6' },
      { id: 'finance', label: '财务管理', icon: DollarSign, color: '#22c55e' },
    ],
  },
  {
    groupKey: 'supplyChain',
    labelKey: 'nav.group.supplyChain',
    items: [
      { id: 'procurement', label: '采购管理', icon: ShoppingCart, color: '#f97316' },
      { id: 'inventory', label: '库存管理', icon: Package, color: '#06b6d4' },
    ],
  },
  {
    groupKey: 'aiMarketing',
    labelKey: 'nav.group.aiMarketing',
    items: [
      { id: 'appOverview', label: '应用总览看板', icon: LayoutDashboard, color: '#00f0ff' },
      { id: 'marketingPlan', label: '营销方案策划', icon: Megaphone, color: '#8b5cf6' },
      { id: 'promotionExec', label: '推广活动执行', icon: PlayCircle, color: '#22c55e' },
      { id: 'marketingAnalytics', label: '营销效果分析', icon: BarChart3, color: '#3b82f6' },
      { id: 'marketingAssets', label: '营销素材管理', icon: Image, color: '#ec4899' },
      { id: 'customerAcquisition', label: '客户获取系统', icon: UserPlus, color: '#22c55e' },
      { id: 'brandMgmt', label: '品牌管理平台', icon: Award, color: '#eab308' },
      { id: 'aiCreativeTools', label: '智能创作工具', icon: PenTool, color: '#8b5cf6' },
      { id: 'aiMarketingEngine', label: '智能营销引擎', icon: Rocket, color: '#f97316' },
      { id: 'aiDecisionSupport', label: '智能决策支持', icon: Brain, color: '#a855f7' },
      { id: 'nlpProcessing', label: '自然语言处理', icon: Languages, color: '#14b8a6' },
      { id: 'platformHub', label: '平台对接中心', icon: Link, color: '#06b6d4' },
      { id: 'intelligentOps', label: '智能运维系统', icon: Wrench, color: '#ef4444' },
    ],
  },
];

// Flat list of all nav items for top bar (core only) and lookups
const navItems = coreNavItems;

const sidebarPersonal = [
  { id: 'history', label: '历史记录', icon: History, color: '#00f0ff' },
  { id: 'favorites', label: '收藏夹', icon: Star, color: '#00ffcc' },
  { id: 'profile', label: '个人资料', icon: UserCircle, color: '#00d4ff' },
];

/**
 * Full-screen standalone cyberpunk terminal layout.
 * Renders the complete application shell: top header bar, proximity-sensing
 * sidebar navigation, page content area with transitions, and status footer.
 * Integrates realtime simulation, keyboard shortcuts, and responsive mobile drawer.
 *
 * @param onSwitchMode - Callback to switch to widget (floating panel) mode.
 */
export function CyberpunkStandalone({ onSwitchMode }: { onSwitchMode: () => void }) {
  const {
    activePage,
    setActivePage,
    sidebarPinned,
    setSidebarPinned,
    unreadCount,
    theme,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useApp();
  const { t } = useI18n();
  const { openModelSettings } = useAIModel();
  const tc = useThemeColors();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sensorGlow, setSensorGlow] = useState(0);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    platformIntegration: true,
    aiMarketing: true,
  });
  const toggleGroup = useCallback((key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);
  // Auto-expand group when one of its items is active
  useEffect(() => {
    for (const g of navGroups) {
      if (g.items.some(i => i.id === activePage) && collapsedGroups[g.groupKey]) {
        setCollapsedGroups(prev => ({ ...prev, [g.groupKey]: false }));
        break;
      }
    }
  }, [activePage, collapsedGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  // i18n-aware data arrays
  const _tools = [
    { name: t('tools.codeGen'), desc: t('tools.codeGenDesc'), icon: Cpu, color: '#00f0ff' },
    { name: t('tools.dataFlow'), desc: t('tools.dataFlowDesc'), icon: Activity, color: '#00d4ff' },
    { name: t('tools.security'), desc: t('tools.securityDesc'), icon: Shield, color: '#00ffcc' },
    { name: t('tools.knowledge'), desc: t('tools.knowledgeDesc'), icon: Brain, color: '#00ffc8' },
    { name: t('tools.perf'), desc: t('tools.perfDesc'), icon: Zap, color: '#008b9d' },
    {
      name: t('tools.warehouse'),
      desc: t('tools.warehouseDesc'),
      icon: Database,
      color: '#00f0ff',
    },
  ];

  const _workflowNodes = [
    { label: t('workflow.inputAnalysis'), status: 'completed', color: '#00ffc8' },
    { label: t('workflow.intentRecog'), status: 'completed', color: '#00ffc8' },
    { label: t('workflow.taskExec'), status: 'active', color: '#00f0ff' },
    { label: t('workflow.resultOpt'), status: 'pending', color: '#ffffff33' },
    { label: t('workflow.learnFeedback'), status: 'pending', color: '#ffffff33' },
  ];

  const _insightMetrics = [
    { label: t('insights.responseTime'), value: '12ms', change: '-18%', color: '#00f0ff' },
    { label: t('insights.taskSuccess'), value: '98.7%', change: '+2.3%', color: '#00ffc8' },
    { label: t('insights.satisfaction'), value: '4.8/5', change: '+0.3', color: '#00ffcc' },
    { label: t('insights.sysLoad'), value: '42%', change: '-5%', color: '#00d4ff' },
  ];
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cmdPalette = useCommandPalette();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sensorZoneRef = useRef<HTMLDivElement>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Phase 4: Realtime simulation — auto-push notifications & activities
  useRealtimeSimulation();

  // Phase 4: Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Ctrl+. → Toggle notification drawer
      if ((e.ctrlKey || e.metaKey) && e.key === '.') {
        e.preventDefault();
        setNotifDrawerOpen(prev => !prev);
      }
      // Ctrl+/ → Toggle sidebar pin
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setSidebarPinned(!sidebarPinned);
      }
      // Ctrl+E → Open export modal
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setExportModalOpen(true);
      }
      // Ctrl+N → Navigate to chat (new session)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setActivePage('chat');
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [sidebarPinned, setSidebarPinned, setActivePage]);

  // Responsive: detect mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close mobile sidebar when navigating
  const handleNavClick = useCallback(
    (page: PageId) => {
      setActivePage(page);
      if (isMobile) setMobileSidebarOpen(false);
    },
    [isMobile, setActivePage, setMobileSidebarOpen],
  );

  // Proximity sensor: detect mouse near the sidebar edge
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarPinned) return;
      const threshold = 80; // px from left edge
      const dist = e.clientX;
      if (dist <= threshold) {
        const intensity = Math.max(0, 1 - dist / threshold);
        setSensorGlow(intensity);
        if (dist <= 60) {
          clearTimeout(collapseTimerRef.current);
          setSidebarExpanded(true);
        }
      } else if (!sidebarRef.current?.contains(e.target as Node)) {
        setSensorGlow(0);
        collapseTimerRef.current = setTimeout(() => {
          setSidebarExpanded(false);
        }, 400);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(collapseTimerRef.current);
    };
  }, [sidebarPinned]);

  const handleSidebarEnter = () => {
    clearTimeout(collapseTimerRef.current);
    setSidebarExpanded(true);
    setSensorGlow(1);
  };

  const handleSidebarLeave = () => {
    if (sidebarPinned) return;
    setSensorGlow(0);
    collapseTimerRef.current = setTimeout(() => {
      setSidebarExpanded(false);
    }, 300);
  };

  const isExpanded = sidebarExpanded || sidebarPinned;

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: tc.bgBase }}>
      {/* Circuit Grid BG — cyberpunk only */}
      {tc.isCyberpunk && theme.circuitGridEnabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,240,255,${(0.04 * theme.neonIntensity) / 100}) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,${(0.04 * theme.neonIntensity) / 100}) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      )}
      {/* Scanlines — cyberpunk only */}
      {tc.isCyberpunk && theme.scanlineEnabled && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
            animation: 'scanline-move 12s linear infinite',
          }}
        />
      )}

      {/* Particle Background — cyberpunk only */}
      {tc.isCyberpunk && <ParticleCanvas />}

      {/* === HEADER === */}
      <header
        aria-label={t('header.ariaLabel')}
        className="relative z-50 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6"
        style={{
          background: tc.headerBg,
          borderBottom: tc.isCyberpunk
            ? `2px solid ${tc.headerBorder}`
            : `1px solid ${tc.headerBorder}`,
          boxShadow: tc.isCyberpunk
            ? `0 0 ${(15 * theme.neonIntensity) / 100}px rgba(0,240,255,${(0.4 * theme.neonIntensity) / 100}), 0 0 ${(30 * theme.neonIntensity) / 100}px rgba(0,240,255,${(0.15 * theme.neonIntensity) / 100})`
            : tc.headerGlow,
          backdropFilter: theme.blurEnabled ? tc.backdropFilter : 'none',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" style={{ color: tc.primary }} />
            </button>
          )}
          {/* Logo */}
          <div
            className={`flex items-center gap-2 sm:gap-3 ${tc.isLiquidGlass ? 'logo-liquid' : ''}`}
            style={{
              animation: theme.springAnimEnabled
                ? tc.isCyberpunk
                  ? 'float-rotate 6s ease-in-out infinite'
                  : 'logoFloat 6s ease-in-out infinite'
                : 'none',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: tc.gradientPrimary,
                boxShadow: tc.isCyberpunk
                  ? '0 0 15px rgba(0,240,255,0.5), 0 0 30px rgba(0,212,255,0.3)'
                  : '0 0 15px rgba(0,255,135,0.4), 0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {tc.isCyberpunk ? (
                  <GlitchText
                    color="rgba(255,255,255,0.9)"
                    className="tracking-wider"
                    style={{ textShadow: '0 0 10px rgba(0,240,255,0.5)' }}
                    interval={[4000, 10000]}
                    intensity={1.2}
                  >
                    YYC³
                  </GlitchText>
                ) : (
                  <span
                    className="tracking-wider"
                    style={{
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 0 10px rgba(0,255,135,0.3)',
                    }}
                  >
                    YYC³
                  </span>
                )}
                {tc.isCyberpunk ? (
                  <GlitchText
                    color="#00d4ff"
                    className="text-[10px] px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: 'rgba(0,212,255,0.3)',
                      background: 'rgba(0,212,255,0.08)',
                      textShadow: '0 0 8px rgba(0,212,255,0.5)',
                    }}
                    interval={[5000, 12000]}
                    intensity={0.8}
                  >
                    {t('brand.subtitle')}
                  </GlitchText>
                ) : (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      border: `1px solid rgba(0,255,135,0.2)`,
                      background: 'rgba(0,255,135,0.08)',
                      color: '#00ff87',
                    }}
                  >
                    {t('brand.subtitle')}
                  </span>
                )}
              </div>
              <span
                className="text-[9px] hidden sm:block -mt-0.5 tracking-[0.15em]"
                style={{ color: tc.isCyberpunk ? 'rgba(0,240,255,0.4)' : 'rgba(0,255,135,0.4)' }}
              >
                {t('brand.system')}
              </span>
            </div>
          </div>
        </div>

        {/* Center Nav - compact (hidden on mobile/tablet) */}
        <nav className="hidden lg:flex items-center gap-1" aria-label={t('ui.mainNav')}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            const c = getThemeNavColor(item.color, tc.isCyberpunk);
            const navStyle = tc.navItemStyle(c, active);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300"
                style={navStyle}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs">
                  {NAV_LABEL_KEYS[item.id] ? t(NAV_LABEL_KEYS[item.id]) : item.label}
                </span>
                {item.badge && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-medium"
                    style={{ background: c, boxShadow: tc.navBadgeShadow(c) }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => cmdPalette.setOpen(true)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors group flex items-center gap-2"
            title={t('ui.searchHint')}
          >
            <Search
              className="w-4 h-4 transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            />
            <span className="sr-only">{t('ui.search')}</span>
            <kbd
              className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px]"
              style={{
                background: tc.alpha(tc.primary, 0.06),
                border: `1px solid ${tc.alpha(tc.primary, 0.15)}`,
                color: tc.alpha(tc.primary, 0.35),
              }}
            >
              ⌘K
            </kbd>
          </button>
          <button
            onClick={openModelSettings}
            className="relative p-2 rounded-xl hover:bg-white/5 transition-colors group"
            title={t('header.aiModel')}
            aria-label={t('header.aiModel')}
          >
            <Bot className="w-4 h-4 transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span className="sr-only">{t('ui.aiModel')}</span>
          </button>
          <button
            onClick={() => setNotifDrawerOpen(true)}
            className="relative p-2 rounded-xl hover:bg-white/5 transition-colors group"
            title={t('header.notifications')}
            aria-label={
              unreadCount > 0
                ? t('header.unreadNotif', { count: unreadCount })
                : t('header.notifications')
            }
          >
            <Bell
              className="w-4 h-4 transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] text-white"
                style={{
                  background: tc.isCyberpunk ? '#005f73' : tc.primary,
                  boxShadow: tc.isCyberpunk
                    ? '0 0 6px #005f73'
                    : `0 0 8px ${tc.alpha(tc.primary, 0.5)}`,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {/* Theme Switcher Button */}
          <div className="hidden sm:block">
            <ThemeSwitcherButtonCompact />
          </div>
          <button
            onClick={onSwitchMode}
            className="hidden sm:block px-3 py-1.5 rounded-xl text-xs transition-all duration-300 border"
            style={{
              borderColor: tc.alpha(tc.secondary, 0.25),
              color: tc.secondary,
              background: tc.alpha(tc.secondary, 0.05),
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 0 15px ${tc.alpha(tc.secondary, 0.4)}`;
              e.currentTarget.style.background = tc.alpha(tc.secondary, 0.15);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = tc.alpha(tc.secondary, 0.05);
            }}
          >
            {t('header.widgetMode')}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px-36px)] sm:h-[calc(100vh-64px-40px)] relative z-10">
        {/* === MOBILE SIDEBAR DRAWER === */}
        {isMobile && mobileSidebarOpen && (
          <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: theme.blurEnabled ? 'blur(4px)' : 'none',
                animation: 'fade-in 0.2s ease-out both',
              }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <div
              className="absolute left-0 top-0 bottom-0 w-72 border-r overflow-y-auto"
              style={{
                background: tc.isCyberpunk ? 'rgba(10,10,10,0.96)' : 'rgba(10,15,10,0.92)',
                borderColor: tc.sidebarBorderExpanded,
                backdropFilter: theme.blurEnabled ? tc.backdropFilter : 'none',
                boxShadow: tc.isCyberpunk
                  ? `4px 0 30px rgba(0,240,255,${(0.15 * theme.neonIntensity) / 100})`
                  : '4px 0 30px rgba(0,0,0,0.2)',
                animation: 'slide-in-left 0.35s var(--spring-easing) both',
                scrollbarWidth: 'none',
              }}
            >
              {/* Close button */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: tc.alpha(tc.primary, 0.1) }}
              >
                <span
                  className="text-xs tracking-wider uppercase"
                  style={{ color: tc.alpha(tc.primary, 0.6) }}
                >
                  {t('nav.menu')}
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4 text-white/30" />
                </button>
              </div>
              {/* Nav items */}
              <div className="p-3 space-y-0.5">
                <p
                  className="text-[9px] tracking-[0.2em] mb-2 px-3 uppercase"
                  style={{
                    color: tc.alpha(tc.primary, 0.4),
                    textShadow: `0 0 5px ${tc.alpha(tc.primary, 0.3)}`,
                  }}
                >
                  {t('nav.coreFeatures')}
                </p>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  const mc = getThemeNavColor(item.color, tc.isCyberpunk);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
                      style={{
                        background: active ? tc.navActiveBg(mc) : 'transparent',
                        boxShadow: active ? tc.navActiveGlow(mc) : 'none',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={{
                          background: active ? tc.alpha(mc, 0.12) : tc.alpha(mc, 0.04),
                          border: `1px solid ${active ? tc.alpha(mc, 0.3) : tc.alpha(mc, 0.12)}`,
                          boxShadow: active
                            ? `0 0 8px ${tc.alpha(mc, 0.15)}, inset 0 0 4px ${tc.alpha(mc, 0.05)}`
                            : `0 0 4px ${tc.alpha(mc, 0.06)}`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4 transition-all duration-300"
                          style={{ color: active ? mc : tc.alpha(mc, 0.6) }}
                        />
                      </div>
                      <span
                        className="text-sm transition-colors duration-300"
                        style={{ color: active ? mc : tc.textSecondary }}
                      >
                        {NAV_LABEL_KEYS[item.id] ? t(NAV_LABEL_KEYS[item.id]) : item.label}
                      </span>
                      {item.badge && (
                        <span
                          className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] text-white font-medium"
                          style={{ background: mc, boxShadow: tc.navBadgeShadow(mc) }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Nav Groups (mobile drawer) */}
              {navGroups.map(group => {
                const isCollapsed = collapsedGroups[group.groupKey] ?? true;
                return (
                  <div key={group.groupKey} className="px-3 mt-1">
                    <button
                      onClick={() => toggleGroup(group.groupKey)}
                      className="w-full flex items-center justify-between px-3 py-1.5"
                    >
                      <span
                        className="text-[9px] tracking-[0.2em] uppercase"
                        style={{ color: tc.alpha(tc.primary, 0.35) }}
                      >
                        {t(group.labelKey)}
                      </span>
                      <ChevronDown
                        className="w-3 h-3 transition-transform duration-300"
                        style={{
                          color: tc.alpha(tc.primary, 0.25),
                          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>
                    {!isCollapsed && (
                      <div className="space-y-0.5">
                        {group.items.map(item => {
                          const GIcon = item.icon;
                          const active = activePage === item.id;
                          const mc = getThemeNavColor(item.color, tc.isCyberpunk);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.id)}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300"
                              style={{
                                background: active ? tc.navActiveBg(mc) : 'transparent',
                                boxShadow: active ? tc.navActiveGlow(mc) : 'none',
                              }}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{
                                  background: active ? tc.alpha(mc, 0.12) : tc.alpha(mc, 0.04),
                                  border: `1px solid ${active ? tc.alpha(mc, 0.3) : tc.alpha(mc, 0.12)}`,
                                }}
                              >
                                <GIcon
                                  className="w-3.5 h-3.5"
                                  style={{ color: active ? mc : tc.alpha(mc, 0.55) }}
                                />
                              </div>
                              <span
                                className="text-[12px]"
                                style={{ color: active ? mc : tc.textSecondary }}
                              >
                                {NAV_LABEL_KEYS[item.id] ? t(NAV_LABEL_KEYS[item.id]) : item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Divider */}
              <div className="mx-4 my-2">
                <div
                  className="h-px"
                  style={{
                    background: tc.isCyberpunk
                      ? 'linear-gradient(90deg, transparent, rgba(0,240,255,0.15), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(0,255,135,0.1), transparent)',
                  }}
                />
              </div>
              {/* Personal */}
              <div className="p-3 space-y-0.5">
                <p
                  className="text-[9px] tracking-[0.2em] mb-2 px-3 uppercase"
                  style={{ color: tc.alpha(tc.secondary, 0.4) }}
                >
                  {t('nav.personal')}
                </p>
                {sidebarPersonal.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'profile') handleNavClick('profile');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={{
                          background: `${item.color}06`,
                          border: `1px solid ${item.color}20`,
                          boxShadow: `0 0 4px ${item.color}10`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4 transition-all duration-300"
                          style={{ color: `${item.color}85` }}
                        />
                      </div>
                      <span className="text-sm text-white/40 transition-colors duration-300 hover:text-white/60">
                        {SIDEBAR_PERSONAL_KEYS[item.id]
                          ? t(SIDEBAR_PERSONAL_KEYS[item.id])
                          : item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === SENSOR EDGE LINE === (desktop only) */}
        {!isMobile && (
          <div
            ref={sensorZoneRef}
            className="absolute left-0 top-0 bottom-0 w-1 z-30 pointer-events-none transition-all duration-500"
            style={{
              background:
                sensorGlow > 0
                  ? `linear-gradient(180deg, transparent, ${tc.alpha(tc.primary, sensorGlow * 0.6)}, ${tc.alpha(tc.secondary, sensorGlow * 0.4)}, transparent)`
                  : 'transparent',
              boxShadow:
                sensorGlow > 0
                  ? `0 0 ${sensorGlow * 20}px ${tc.alpha(tc.primary, sensorGlow * 0.5)}, 0 0 ${sensorGlow * 40}px ${tc.alpha(tc.primary, sensorGlow * 0.2)}`
                  : 'none',
            }}
          />
        )}

        {/* === SENSING SIDEBAR === (desktop only) */}
        {!isMobile && (
          <aside
            ref={sidebarRef}
            onMouseEnter={handleSidebarEnter}
            onMouseLeave={handleSidebarLeave}
            aria-label={t('ui.sidebarNav')}
            className="shrink-0 border-r relative z-20 overflow-hidden"
            style={{
              width: isExpanded ? 256 : 68,
              transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              background: tc.sidebarBg,
              borderColor: isExpanded ? tc.sidebarBorderExpanded : tc.sidebarBorder,
              backdropFilter: theme.blurEnabled ? tc.backdropFilter : 'none',
              boxShadow: tc.isCyberpunk
                ? isExpanded
                  ? `4px 0 25px rgba(0,240,255,${(0.08 * theme.neonIntensity) / 100}), inset 0 0 30px rgba(0,240,255,0.02)`
                  : `${sensorGlow * 3}px 0 ${sensorGlow * 15}px rgba(0,240,255,${sensorGlow * 0.1})`
                : isExpanded
                  ? '4px 0 30px rgba(0,0,0,0.15), inset 0 0 30px rgba(0,255,135,0.02)'
                  : `${sensorGlow * 3}px 0 ${sensorGlow * 15}px rgba(0,255,135,${sensorGlow * 0.05})`,
            }}
          >
            {/* Sensor pulse strip */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[2px] transition-all duration-500"
              style={{
                background: isExpanded
                  ? tc.isCyberpunk
                    ? 'linear-gradient(180deg, transparent, rgba(0,240,255,0.4), rgba(0,212,255,0.3), transparent)'
                    : 'linear-gradient(180deg, transparent, rgba(0,255,135,0.3), rgba(6,182,212,0.2), transparent)'
                  : sensorGlow > 0
                    ? `linear-gradient(180deg, transparent, ${tc.alpha(tc.primary, sensorGlow * 0.3)}, transparent)`
                    : 'transparent',
                boxShadow: isExpanded ? `0 0 8px ${tc.alpha(tc.primary, 0.3)}` : 'none',
              }}
            />

            <div className="h-full overflow-y-auto py-3" style={{ scrollbarWidth: 'none' }}>
              {/* Pin Toggle */}
              <div className={`flex ${isExpanded ? 'justify-end px-4' : 'justify-center'} mb-2`}>
                <button
                  onClick={() => setSidebarPinned(!sidebarPinned)}
                  className="p-1.5 rounded-lg transition-all duration-300 hover:bg-white/5 group"
                  title={sidebarPinned ? t('ui.unpinSidebar') : t('ui.pinSidebar')}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-sm border transition-all duration-300"
                    style={{
                      borderColor: sidebarPinned ? tc.primary : 'rgba(255,255,255,0.15)',
                      background: sidebarPinned ? tc.alpha(tc.primary, 0.2) : 'transparent',
                      boxShadow: sidebarPinned ? `0 0 8px ${tc.alpha(tc.primary, 0.4)}` : 'none',
                    }}
                  >
                    {sidebarPinned && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: tc.primary }}
                        />
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Main Features Section */}
              <div className="mb-4">
                {isExpanded && (
                  <h3
                    className="text-[9px] tracking-[0.2em] mb-2 px-5 uppercase"
                    style={{
                      color: tc.alpha(tc.primary, 0.4),
                      textShadow: `0 0 5px ${tc.alpha(tc.primary, 0.3)}`,
                      animation: 'spring-in 0.3s var(--spring-easing) both',
                    }}
                  >
                    {t('nav.coreFeatures')}
                  </h3>
                )}
                <div className="space-y-0.5 px-2">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const active = activePage === item.id;
                    const label = NAV_LABEL_KEYS[item.id] ? t(NAV_LABEL_KEYS[item.id]) : item.label;
                    const c = getThemeNavColor(item.color, tc.isCyberpunk);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className="w-full flex items-center rounded-xl transition-all duration-300 group relative"
                        style={{
                          padding: isExpanded ? '8px 12px' : '10px 0',
                          justifyContent: isExpanded ? 'flex-start' : 'center',
                          gap: isExpanded ? 12 : 0,
                          background: active ? tc.navActiveBg(c) : 'transparent',
                          boxShadow: active ? tc.navActiveGlow(c) : 'none',
                        }}
                        title={!isExpanded ? label : undefined}
                      >
                        {/* Icon container */}
                        <div
                          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: active ? tc.alpha(c, 0.12) : tc.alpha(c, 0.04),
                            border: `1px solid ${active ? tc.alpha(c, 0.3) : tc.alpha(c, 0.12)}`,
                            boxShadow: active
                              ? `0 0 8px ${tc.alpha(c, 0.15)}, inset 0 0 4px ${tc.alpha(c, 0.05)}`
                              : `0 0 4px ${tc.alpha(c, 0.06)}`,
                          }}
                        >
                          <Icon
                            className="w-4 h-4 transition-all duration-300"
                            style={{ color: active ? c : tc.alpha(c, 0.6) }}
                          />
                        </div>

                        {/* Label (only when expanded) */}
                        {isExpanded && (
                          <span
                            className="text-sm whitespace-nowrap overflow-hidden transition-all duration-300"
                            style={{
                              color: active ? c : tc.textSecondary,
                              textShadow: active ? `0 0 6px ${tc.alpha(c, 0.2)}` : 'none',
                              animation: 'spring-in 0.3s var(--spring-easing) both',
                            }}
                          >
                            {label}
                          </span>
                        )}

                        {/* Glow Ring Indicator (collapsed sidebar) */}
                        {item.badge && !isExpanded && (
                          <div
                            className="absolute -inset-0.5 rounded-xl pointer-events-none"
                            style={{
                              border: `2px solid ${c}`,
                              boxShadow: tc.isCyberpunk
                                ? `0 0 8px ${c}60, 0 0 16px ${c}40, inset 0 0 6px ${c}20`
                                : `0 0 10px ${tc.alpha(c, 0.3)}`,
                              animation: 'neon-pulse 2s ease-in-out infinite',
                            }}
                          />
                        )}

                        {/* Badge Number (expanded sidebar) */}
                        {item.badge && isExpanded && (
                          <span
                            className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] text-white font-medium"
                            style={{
                              background: c,
                              boxShadow: tc.navBadgeShadow(c),
                              minWidth: 18,
                              textAlign: 'center',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Active indicator */}
                        {active && isExpanded && (
                          <ChevronRight className="ml-auto w-3 h-3 shrink-0" style={{ color: c }} />
                        )}

                        {/* Active left bar */}
                        {active && (
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300"
                            style={{
                              height: 24,
                              background: c,
                              boxShadow: tc.isCyberpunk
                                ? `0 0 6px ${c}80, 0 0 12px ${c}40`
                                : `0 0 8px ${tc.alpha(c, 0.4)}`,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* === Collapsible Nav Groups (Platform Integration + AI Marketing) === */}
              {navGroups.map(group => {
                const isCollapsed = collapsedGroups[group.groupKey] ?? true;
                const hasActive = group.items.some(i => activePage === i.id);
                const groupColor = group.items[0]?.color || tc.primary;
                return (
                  <div key={group.groupKey} className="mb-1">
                    {/* Group header — clickable to toggle */}
                    {isExpanded ? (
                      <button
                        onClick={() => toggleGroup(group.groupKey)}
                        className="w-full flex items-center justify-between px-5 py-1.5 group/gh transition-colors"
                        style={{ animation: 'spring-in 0.3s var(--spring-easing) both' }}
                      >
                        <span
                          className="text-[9px] tracking-[0.2em] uppercase transition-colors"
                          style={{
                            color: hasActive
                              ? tc.alpha(groupColor, 0.7)
                              : tc.alpha(tc.primary, 0.35),
                            textShadow: hasActive
                              ? `0 0 5px ${tc.alpha(groupColor, 0.3)}`
                              : `0 0 5px ${tc.alpha(tc.primary, 0.2)}`,
                          }}
                        >
                          {t(group.labelKey)}
                        </span>
                        <ChevronDown
                          className="w-3 h-3 transition-transform duration-300"
                          style={{
                            color: tc.alpha(tc.primary, 0.25),
                            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                          }}
                        />
                      </button>
                    ) : (
                      <div className="flex justify-center py-1">
                        <div
                          className="w-5 h-0.5 rounded-full"
                          style={{ background: tc.alpha(groupColor, hasActive ? 0.4 : 0.12) }}
                        />
                      </div>
                    )}
                    {/* Group items */}
                    {(!isCollapsed || !isExpanded) && (
                      <div
                        className="space-y-0.5 px-2"
                        style={{
                          animation: isExpanded
                            ? 'spring-in 0.3s var(--spring-easing) both'
                            : undefined,
                        }}
                      >
                        {(isExpanded
                          ? group.items
                          : group.items.filter(i => activePage === i.id)
                        ).map(item => {
                          const GIcon = item.icon;
                          const active = activePage === item.id;
                          const label = NAV_LABEL_KEYS[item.id]
                            ? t(NAV_LABEL_KEYS[item.id])
                            : item.label;
                          const c = getThemeNavColor(item.color, tc.isCyberpunk);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavClick(item.id)}
                              className="w-full flex items-center rounded-xl transition-all duration-300 group relative"
                              style={{
                                padding: isExpanded ? '6px 12px' : '10px 0',
                                justifyContent: isExpanded ? 'flex-start' : 'center',
                                gap: isExpanded ? 10 : 0,
                                background: active ? tc.navActiveBg(c) : 'transparent',
                                boxShadow: active ? tc.navActiveGlow(c) : 'none',
                              }}
                              title={!isExpanded ? label : undefined}
                            >
                              <div
                                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                                style={{
                                  background: active ? tc.alpha(c, 0.12) : tc.alpha(c, 0.04),
                                  border: `1px solid ${active ? tc.alpha(c, 0.3) : tc.alpha(c, 0.12)}`,
                                  boxShadow: active ? `0 0 6px ${tc.alpha(c, 0.12)}` : 'none',
                                }}
                              >
                                <GIcon
                                  className="w-3.5 h-3.5 transition-all duration-300"
                                  style={{ color: active ? c : tc.alpha(c, 0.55) }}
                                />
                              </div>
                              {isExpanded && (
                                <span
                                  className="text-[12px] whitespace-nowrap overflow-hidden transition-all duration-300"
                                  style={{
                                    color: active ? c : tc.textSecondary,
                                    textShadow: active ? `0 0 6px ${tc.alpha(c, 0.2)}` : 'none',
                                  }}
                                >
                                  {label}
                                </span>
                              )}
                              {active && isExpanded && (
                                <ChevronRight
                                  className="ml-auto w-3 h-3 shrink-0"
                                  style={{ color: c }}
                                />
                              )}
                              {active && (
                                <div
                                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300"
                                  style={{
                                    height: 20,
                                    background: c,
                                    boxShadow: tc.isCyberpunk
                                      ? `0 0 6px ${c}80, 0 0 12px ${c}40`
                                      : `0 0 8px ${tc.alpha(c, 0.4)}`,
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Divider */}
              <div className="mx-4 mb-4">
                <div
                  className="h-px"
                  style={{
                    background: tc.isCyberpunk
                      ? 'linear-gradient(90deg, transparent, rgba(0,240,255,0.15), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(0,255,135,0.1), transparent)',
                  }}
                />
              </div>

              {/* Personal Section */}
              <div className="mb-4">
                {isExpanded && (
                  <h3
                    className="text-[9px] tracking-[0.2em] mb-2 px-5 uppercase"
                    style={{
                      color: tc.alpha(tc.secondary, 0.4),
                      textShadow: `0 0 5px ${tc.alpha(tc.secondary, 0.3)}`,
                      animation: 'spring-in 0.3s var(--spring-easing) 0.05s both',
                    }}
                  >
                    {t('nav.personal')}
                  </h3>
                )}
                <div className="space-y-0.5 px-2">
                  {sidebarPersonal.map(item => {
                    const Icon = item.icon;
                    const label = SIDEBAR_PERSONAL_KEYS[item.id]
                      ? t(SIDEBAR_PERSONAL_KEYS[item.id])
                      : item.label;
                    const pc = getThemeNavColor(item.color, tc.isCyberpunk);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'profile') handleNavClick('profile');
                        }}
                        className="w-full flex items-center rounded-xl transition-all duration-300 hover:bg-white/5 group"
                        style={{
                          padding: isExpanded ? '8px 12px' : '10px 0',
                          justifyContent: isExpanded ? 'flex-start' : 'center',
                          gap: isExpanded ? 12 : 0,
                        }}
                        title={!isExpanded ? label : undefined}
                      >
                        <div
                          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: tc.alpha(pc, 0.04),
                            border: `1px solid ${tc.alpha(pc, 0.12)}`,
                            boxShadow: `0 0 4px ${tc.alpha(pc, 0.06)}`,
                          }}
                        >
                          <Icon
                            className="w-4 h-4 transition-all duration-300 group-hover:scale-110"
                            style={{ color: tc.alpha(pc, 0.55) }}
                          />
                        </div>
                        {isExpanded && (
                          <span
                            className="text-sm text-white/35 group-hover:text-white/60 transition-colors whitespace-nowrap"
                            style={{ animation: 'spring-in 0.3s var(--spring-easing) both' }}
                          >
                            {label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Status (only when expanded) */}
              {isExpanded && (
                <div
                  className="mx-3 rounded-2xl p-3 border"
                  style={{
                    background: tc.alpha(tc.primary, 0.03),
                    borderColor: tc.alpha(tc.primary, 0.12),
                    boxShadow: `inset 0 0 20px ${tc.alpha(tc.primary, 0.02)}`,
                    animation: 'spring-in 0.4s var(--spring-easing) 0.1s both',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: tc.statusOnline,
                        boxShadow: tc.statusOnlineGlow,
                        animation: 'neon-pulse 2s ease-in-out infinite',
                      }}
                    />
                    <span className="text-[9px] tracking-wider" style={{ color: tc.statusOnline }}>
                      {t('sidebar.systemOnline')}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/25">{t('sidebar.cpu')}</span>
                      <span style={{ color: tc.primary }}>42%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full w-[42%]"
                        style={{
                          background: `linear-gradient(90deg, ${tc.primary}, ${tc.secondary})`,
                          boxShadow: `0 0 6px ${tc.alpha(tc.primary, 0.5)}`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/25">{t('ui.memory')}</span>
                      <span style={{ color: tc.secondary }}>67%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full w-[67%]"
                        style={{
                          background: `linear-gradient(90deg, ${tc.secondary}, ${tc.accent})`,
                          boxShadow: `0 0 6px ${tc.alpha(tc.secondary, 0.5)}`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* === MAIN CONTENT with Page Transition === */}
        <main className="flex-1 overflow-hidden relative" aria-label={t('ui.mainContent')}>
          <Suspense fallback={<PageLoader />}>
            <PageTransition pageKey={activePage}>
              {activePage === 'dashboard' && (
                <DashboardPage onOpenExport={() => setExportModalOpen(true)} />
              )}
              {activePage === 'chat' && <ChatPage />}
              {activePage === 'clm' && <CLMPage />}
              {activePage === 'aicall' && <AICallPage />}
              {activePage === 'customerCare' && <CustomerCarePage />}
              {activePage === 'contacts' && <NumberDatabasePage />}
              {activePage === 'forms' && <FormsTabPage />}
              {activePage === 'tools' && <AIToolsPage />}
              {activePage === 'workflow' && <WorkflowPage />}
              {activePage === 'logs' && <ActivityLogPage />}
              {activePage === 'collab' && <CollabCreationPage />}
              {activePage === 'insights' && <InsightsEnhancedPage />}
              {activePage === 'quickActions' && <QuickActionsPage />}
              {activePage === 'taskBoard' && <TaskBoardPage />}
              {activePage === 'devWorkspace' && <LeftPanelPage />}
              {activePage === 'settings' && <SettingsPage />}
              {activePage === 'profile' && <ProfilePage />}
              {/* Platform Integration modules */}
              {activePage === 'paramSettings' && <ParameterSettingsPage />}
              {activePage === 'platformSettings' && <PlatformSettingsPage />}
              {activePage === 'wechatConfig' && <WechatConfigPage />}
              {activePage === 'channelCenter' && <ChannelCenterPage />}
              {activePage === 'dataIntegration' && <DataIntegrationPage />}
              {activePage === 'compensation' && <CompensationPage />}
              {activePage === 'finance' && <FinancePage />}
              {activePage === 'procurement' && <ProcurementPage />}
              {activePage === 'inventory' && <InventoryPage />}
              {/* AI Marketing modules */}
              {activePage === 'marketingPlan' && <MarketingStrategyPage />}
              {activePage === 'promotionExec' && <CampaignExecutionPage />}
              {activePage === 'marketingAnalytics' && <MarketingAnalyticsPage />}
              {activePage === 'marketingAssets' && <MarketingAssetsPage />}
              {activePage === 'customerAcquisition' && <CustomerAcquisitionPage />}
              {activePage === 'brandMgmt' && <BrandManagementPage />}
              {activePage === 'intelligentOps' && <SmartOperationsPage />}
              {activePage === 'platformHub' && <PlatformIntegrationPage />}
              {activePage === 'aiCreativeTools' && <SmartCreationPage />}
              {activePage === 'aiMarketingEngine' && <SmartMarketingEnginePage />}
              {activePage === 'appOverview' && <AppOverviewPage />}
              {activePage === 'aiDecisionSupport' && <DecisionSupportPage />}
              {activePage === 'nlpProcessing' && <NLPProcessingPage />}
            </PageTransition>
          </Suspense>
        </main>
      </div>

      {/* === FOOTER STATUS BAR === */}
      <footer
        role="contentinfo"
        aria-label={t('footer.ariaLabel')}
        className="relative z-50 h-9 sm:h-10 flex items-center justify-between px-3 sm:px-6"
        style={{
          background: tc.footerBg,
          borderTop: tc.isCyberpunk
            ? `2px solid ${tc.footerBorder}`
            : `1px solid ${tc.footerBorder}`,
          boxShadow: tc.isCyberpunk
            ? `0 0 ${(10 * theme.neonIntensity) / 100}px rgba(0,240,255,${(0.3 * theme.neonIntensity) / 100}), 0 0 ${(20 * theme.neonIntensity) / 100}px rgba(0,240,255,${(0.1 * theme.neonIntensity) / 100})`
            : `0 -2px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.03)`,
          backdropFilter: theme.blurEnabled ? tc.backdropFilter : 'none',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: tc.statusOnline,
                boxShadow: tc.statusOnlineGlow,
                animation: 'neon-pulse 2s ease-in-out infinite',
              }}
            />
            <span
              className="text-[9px] sm:text-[10px] tracking-wider"
              style={{ color: tc.statusOnline }}
            >
              {t('footer.online')}
            </span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Wifi className="w-3 h-3" style={{ color: tc.alpha(tc.primary, 0.5) }} />
            <span className="text-[10px] text-white/30">12ms</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5">
            <Shield className="w-3 h-3" style={{ color: tc.alpha(tc.success, 0.5) }} />
            <span className="text-[10px] text-white/30">{t('footer.secure')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <Cpu className="w-3 h-3" style={{ color: tc.alpha(tc.secondary, 0.5) }} />
            <span className="text-[10px] text-white/30">{t('footer.gpu')}</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <span className="text-[9px] sm:text-[10px] text-white/20 tracking-wider">
            YYC³ {t('brand.version')}{' '}
            <span className="hidden md:inline">| {t('brand.tagline')}</span>
          </span>
        </div>
      </footer>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette open={cmdPalette.open} onClose={cmdPalette.onClose} />

      {/* Notification Drawer */}
      <NotificationDrawer open={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />

      {/* Onboarding Tutorial */}
      <OnboardingTutorial />

      {/* Data Export Modal (Ctrl+E) */}
      <DataExportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />

      {/* AI Model Settings Modal */}
      <ModelSettings />
    </div>
  );
}

/* ======================================================================
   SUB PAGES
   ====================================================================== */

function ChatPage() {
  const { t } = useI18n();
  const sessions = [
    t('chat.session1'),
    t('chat.session2'),
    t('chat.session3'),
    t('chat.session4'),
    t('chat.session5'),
  ];

  return (
    <div className="h-full flex" style={{ animation: 'spring-in 0.4s var(--spring-easing) both' }}>
      <div
        className="w-72 shrink-0 border-r overflow-y-auto hidden xl:block"
        style={{
          borderColor: 'rgba(0,240,255,0.1)',
          background: 'rgba(5,5,5,0.5)',
          scrollbarWidth: 'none',
        }}
      >
        <div className="p-4">
          <button
            className="w-full py-2.5 rounded-xl text-sm mb-4 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,212,255,0.15))',
              border: '1px solid rgba(0,240,255,0.3)',
              color: '#00f0ff',
              boxShadow: '0 0 10px rgba(0,240,255,0.2)',
            }}
          >
            {t('chat.newSession')}
          </button>
          {sessions.map((title, i) => (
            <div
              key={i}
              className="px-3 py-3 rounded-xl mb-1 cursor-pointer transition-all duration-300"
              style={{
                background: i === 0 ? 'rgba(0,240,255,0.08)' : 'transparent',
                border: i === 0 ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
              }}
            >
              <p
                className="text-sm truncate"
                style={{ color: i === 0 ? '#00f0ff' : 'rgba(255,255,255,0.4)' }}
              >
                {title}
              </p>
              <p className="text-[10px] text-white/20 mt-0.5">
                {i === 0 ? t('chat.justNow') : t('chat.hoursAgo', { n: i * 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}

/* =========================================================
   客户全生命周期管理 (CLM) Page
   ========================================================= */

function CLMPage() {
  const { t } = useI18n();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const clmStages = [
    {
      label: t('clm.acquisition'),
      sublabel: 'Acquisition',
      icon: Megaphone,
      color: '#00f0ff',
      count: 342,
      trend: '+28%',
    },
    {
      label: t('clm.conversion'),
      sublabel: 'Conversion',
      icon: Target,
      color: '#00d4ff',
      count: 156,
      trend: '+15%',
    },
    {
      label: t('clm.closing'),
      sublabel: 'Closing',
      icon: Handshake,
      color: '#00ffcc',
      count: 89,
      trend: '+12%',
    },
    {
      label: t('clm.service'),
      sublabel: 'Service',
      icon: HeartHandshake,
      color: '#00ffc8',
      count: 534,
      trend: '+8%',
    },
    {
      label: t('clm.loyalty'),
      sublabel: 'Loyalty',
      icon: Crown,
      color: '#41ffdd',
      count: 267,
      trend: '+22%',
    },
  ];

  const clmCustomers = [
    {
      name: t('clm.mock.name1'),
      company: t('clm.mock.company1'),
      stage: t('clm.conversion'),
      value: '¥128,000',
      health: 92,
      color: '#00ffc8',
      lastContact: t('clm.mock.time.hoursAgo', { n: 2 }),
    },
    {
      name: t('clm.mock.name2'),
      company: t('clm.mock.company2'),
      stage: t('clm.closing'),
      value: '¥256,000',
      health: 88,
      color: '#00ffc8',
      lastContact: t('clm.mock.time.daysAgo', { n: 1 }),
    },
    {
      name: t('clm.mock.name3'),
      company: t('clm.mock.company3'),
      stage: t('clm.acquisition'),
      value: '¥64,000',
      health: 65,
      color: '#00ffcc',
      lastContact: t('clm.mock.time.daysAgo', { n: 3 }),
    },
    {
      name: t('clm.mock.name4'),
      company: t('clm.mock.company4'),
      stage: t('clm.service'),
      value: '¥512,000',
      health: 95,
      color: '#00ffc8',
      lastContact: t('clm.mock.time.justNow'),
    },
    {
      name: t('clm.mock.name5'),
      company: t('clm.mock.company5'),
      stage: t('clm.loyalty'),
      value: '¥1,024,000',
      health: 98,
      color: '#00ffc8',
      lastContact: t('clm.mock.time.hoursAgo', { n: 5 }),
    },
  ];

  const filtered = selectedStage
    ? clmCustomers.filter(c => c.stage === selectedStage)
    : clmCustomers;

  return (
    <div
      className="h-full overflow-y-auto p-6"
      style={{ scrollbarWidth: 'none', animation: 'spring-in 0.4s var(--spring-easing) both' }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-[#00d4ff] tracking-wider flex items-center gap-3"
            style={{ textShadow: '0 0 15px rgba(0,212,255,0.5)' }}
          >
            <Users className="w-6 h-6" />
            {t('clm.title')}
          </h2>
          <p className="text-xs text-white/25 mt-1 tracking-wider">{t('clm.subtitle')}</p>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,240,255,0.15))',
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00d4ff',
          }}
        >
          <UserPlus className="w-3.5 h-3.5" /> {t('clm.addCustomer')}
        </button>
      </div>

      {/* Lifecycle Pipeline */}
      <div className="mb-6">
        <NeonCard color="#00d4ff" hoverable={false}>
          <h3 className="text-xs text-white/40 mb-5 uppercase tracking-wider">{t('clm.funnel')}</h3>
          <div className="flex items-stretch gap-3">
            {clmStages.map((stage, i) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.label;
              return (
                <div key={i} className="contents">
                  <button
                    onClick={() => setSelectedStage(isSelected ? null : stage.label)}
                    className="flex-1 rounded-2xl p-4 border transition-all duration-400 group relative overflow-hidden"
                    style={{
                      background: isSelected ? `${stage.color}15` : 'rgba(10,10,10,0.5)',
                      borderColor: isSelected ? `${stage.color}50` : `${stage.color}15`,
                      boxShadow: isSelected
                        ? `0 0 20px ${stage.color}25, inset 0 0 15px ${stage.color}08`
                        : 'none',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    {/* Background glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${stage.color}10, transparent 70%)`,
                      }}
                    />
                    <div className="relative z-10">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mx-auto transition-all duration-300"
                        style={{
                          background: `${stage.color}15`,
                          border: `1px solid ${stage.color}30`,
                          boxShadow: isSelected ? `0 0 12px ${stage.color}40` : 'none',
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stage.color }} />
                      </div>
                      <p
                        className="text-sm text-center mb-0.5"
                        style={{ color: isSelected ? stage.color : 'rgba(255,255,255,0.6)' }}
                      >
                        {stage.label}
                      </p>
                      <p className="text-[9px] text-center text-white/20 mb-2">{stage.sublabel}</p>
                      <p
                        className="text-xl text-center"
                        style={{ color: stage.color, textShadow: `0 0 12px ${stage.color}50` }}
                      >
                        {stage.count}
                      </p>
                      <p className="text-[10px] text-center mt-1" style={{ color: '#00ffc8' }}>
                        <ArrowUpRight className="w-3 h-3 inline" /> {stage.trend}
                      </p>
                    </div>
                  </button>
                  {i < clmStages.length - 1 && (
                    <div className="flex items-center shrink-0">
                      <div
                        className="w-6 h-0.5 rounded-full relative overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(90deg, ${stage.color}, ${clmStages[i + 1].color})`,
                            animation: 'data-flow-h 2s linear infinite',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </NeonCard>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: t('clm.totalCustomers'),
            value: '1,388',
            icon: Users,
            color: '#00f0ff',
            change: '+12%',
          },
          {
            label: t('clm.conversionRate'),
            value: '45.6%',
            icon: TrendingUp,
            color: '#00d4ff',
            change: '+3.2%',
          },
          {
            label: t('clm.healthScore'),
            value: '87.6',
            icon: Activity,
            color: '#00ffc8',
            change: '+5%',
          },
          {
            label: t('clm.lifetime'),
            value: '¥98.4K',
            icon: Award,
            color: '#00ffcc',
            change: '+18%',
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <NeonCard key={i} color={m.color}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">
                    {m.label}
                  </p>
                  <p
                    className="text-xl"
                    style={{ color: m.color, textShadow: `0 0 10px ${m.color}50` }}
                  >
                    {m.value}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${m.color}10`, border: `1px solid ${m.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: `${m.color}80` }} />
                </div>
              </div>
              <p className="text-[10px] mt-2" style={{ color: '#00ffc8' }}>
                <ArrowUpRight className="w-3 h-3 inline" /> {m.change}
              </p>
            </NeonCard>
          );
        })}
      </div>

      {/* Customer Table */}
      <NeonCard color="#00d4ff" hoverable={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-white/50 tracking-wider">
            {selectedStage
              ? t('clm.stageCustomers', { stage: selectedStage })
              : t('clm.allCustomers')}{' '}
            · {t('clm.realtimeBoard')}
          </h3>
          {selectedStage && (
            <button
              onClick={() => setSelectedStage(null)}
              className="text-[10px] text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors"
            >
              {t('clm.clearFilter')}
            </button>
          )}
        </div>
        <div className="space-y-2">
          {filtered.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
              style={{
                background: 'rgba(10,10,10,0.4)',
                borderColor: 'rgba(255,255,255,0.04)',
                animation: `spring-in 0.3s var(--spring-easing) ${i * 0.05}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,240,255,0.15))',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
              >
                <span className="text-xs text-white/70">{c.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate">{c.name}</p>
                <p className="text-[10px] text-white/25">{c.company}</p>
              </div>
              <div className="hidden sm:block text-center">
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{
                    background: `${clmStages.find(s => s.label === c.stage)?.color}15`,
                    color: clmStages.find(s => s.label === c.stage)?.color,
                    border: `1px solid ${clmStages.find(s => s.label === c.stage)?.color}30`,
                  }}
                >
                  {c.stage}
                </span>
              </div>
              <div className="hidden md:block text-right">
                <p
                  className="text-sm text-[#00ffcc]"
                  style={{ textShadow: '0 0 6px rgba(0,255,204,0.3)' }}
                >
                  {c.value}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 w-24">
                <div className="flex-1 h-1 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${c.health}%`,
                      background: c.health > 80 ? '#00ffc8' : c.health > 60 ? '#00ffcc' : '#005f73',
                      boxShadow: `0 0 4px ${c.health > 80 ? '#00ffc8' : c.health > 60 ? '#00ffcc' : '#005f73'}50`,
                    }}
                  />
                </div>
                <span
                  className="text-[10px]"
                  style={{
                    color: c.health > 80 ? '#00ffc8' : c.health > 60 ? '#00ffcc' : '#005f73',
                  }}
                >
                  {c.health}
                </span>
              </div>
              <span className="text-[10px] text-white/15 hidden xl:block">{c.lastContact}</span>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  );
}

/* =========================================================
   AI 智能呼叫 Page
   ========================================================= */

function AICallPage() {
  const { t } = useI18n();

  const callStats = [
    { label: t('call.todayCalls'), value: '247', icon: PhoneCall, color: '#00ffcc', change: '+34' },
    {
      label: t('call.connectRate'),
      value: '78.3%',
      icon: PhoneForwarded,
      color: '#00ffc8',
      change: '+5.2%',
    },
    { label: t('call.avgDuration'), value: '4:32', icon: Clock, color: '#00f0ff', change: '-0:18' },
    { label: t('call.aiConversion'), value: '23.7%', icon: Bot, color: '#00d4ff', change: '+8.1%' },
  ];

  const callQueue = [
    {
      name: t('clm.mock.name1'),
      company: t('clm.mock.company1'),
      type: t('call.aiOutbound'),
      status: t('call.calling'),
      duration: '2:34',
      aiScore: 92,
      color: '#00ffc8',
    },
    {
      name: t('clm.mock.name2'),
      company: t('clm.mock.company2'),
      type: t('call.aiFollowup'),
      status: t('call.waiting'),
      duration: '--',
      aiScore: 85,
      color: '#00ffcc',
    },
    {
      name: t('clm.mock.name3'),
      company: t('clm.mock.company3'),
      type: t('call.manualTransfer'),
      status: t('call.queued'),
      duration: '--',
      aiScore: 67,
      color: '#41ffdd',
    },
    {
      name: t('clm.mock.name4'),
      company: t('clm.mock.company4'),
      type: t('call.aiCallback'),
      status: t('call.done'),
      duration: '6:12',
      aiScore: 96,
      color: '#00f0ff',
    },
    {
      name: t('clm.mock.name5'),
      company: t('clm.mock.company5'),
      type: t('call.aiOutbound'),
      status: t('call.done'),
      duration: '3:45',
      aiScore: 88,
      color: '#00ffc8',
    },
  ];

  const callFlowSteps = [
    { label: t('call.scheduling'), icon: Clock, status: 'done' },
    { label: t('call.scriptGen'), icon: Brain, status: 'done' },
    { label: t('call.autoCall'), icon: PhoneCall, status: 'active' },
    { label: t('call.realtimeAnalysis'), icon: Activity, status: 'pending' },
    { label: t('call.aiSummary'), icon: FileText, status: 'pending' },
    { label: t('call.feedbackLearn'), icon: RefreshCw, status: 'pending' },
  ];
  return (
    <div
      className="h-full overflow-y-auto p-6"
      style={{ scrollbarWidth: 'none', animation: 'spring-in 0.4s var(--spring-easing) both' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-[#00ffcc] tracking-wider flex items-center gap-3"
            style={{ textShadow: '0 0 15px rgba(0,255,204,0.5)' }}
          >
            <Phone className="w-6 h-6" />
            {t('call.title')}
          </h2>
          <p className="text-xs text-white/25 mt-1 tracking-wider">{t('call.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all duration-300"
            style={{
              background: 'rgba(0,255,204,0.08)',
              border: '1px solid rgba(0,255,204,0.3)',
              color: '#00ffcc',
            }}
          >
            <Mic className="w-3.5 h-3.5" /> {t('call.scriptLib')}
          </button>
          <button
            className="px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,204,0.15), rgba(0,240,255,0.15))',
              border: '1px solid rgba(0,255,204,0.3)',
              color: '#00ffcc',
              boxShadow: '0 0 12px rgba(0,255,204,0.15)',
            }}
          >
            <PhoneCall className="w-3.5 h-3.5" /> {t('call.startCall')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {callStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <NeonCard key={i} color={s.color}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">
                    {s.label}
                  </p>
                  <p
                    className="text-xl"
                    style={{ color: s.color, textShadow: `0 0 10px ${s.color}50` }}
                  >
                    {s.value}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: `${s.color}80` }} />
                </div>
              </div>
              <p
                className="text-[10px] mt-2"
                style={{ color: s.change.startsWith('+') ? '#00ffc8' : '#00f0ff' }}
              >
                {s.change.startsWith('+') ? (
                  <ArrowUpRight className="w-3 h-3 inline" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 inline" />
                )}{' '}
                {s.change}
              </p>
            </NeonCard>
          );
        })}
      </div>

      {/* Call Flow Pipeline */}
      <NeonCard color="#00ffcc" hoverable={false} className="mb-6">
        <h3 className="text-xs text-white/40 mb-5 uppercase tracking-wider">
          {t('call.pipeline')}
        </h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {callFlowSteps.map((step, i) => {
            const Icon = step.icon;
            const statusColor =
              step.status === 'done'
                ? '#00ffc8'
                : step.status === 'active'
                  ? '#00ffcc'
                  : 'rgba(255,255,255,0.15)';
            return (
              <div key={i} className="contents">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500"
                    style={{
                      borderColor: statusColor,
                      background:
                        step.status === 'active' ? 'rgba(0,255,204,0.12)' : 'rgba(10,10,10,0.5)',
                      boxShadow:
                        step.status === 'active'
                          ? '0 0 18px rgba(0,255,204,0.3), inset 0 0 8px rgba(0,255,204,0.1)'
                          : 'none',
                      animation:
                        step.status === 'active' ? 'border-glow 2s ease-in-out infinite' : 'none',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: statusColor }} />
                  </div>
                  <span className="text-[10px] whitespace-nowrap" style={{ color: statusColor }}>
                    {step.label}
                  </span>
                </div>
                {i < callFlowSteps.length - 1 && (
                  <div
                    className="flex-1 min-w-6 h-0.5 rounded-full relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {step.status === 'done' && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, #00ffc8, ${callFlowSteps[i + 1].status === 'done' ? '#00ffc8' : '#00ffcc'})`,
                        }}
                      />
                    )}
                    {step.status === 'active' && (
                      <div
                        className="absolute top-0 left-0 h-full w-1/2 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #00ffcc, transparent)',
                          animation: 'data-flow-h 2s linear infinite',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Call Queue */}
        <div className="xl:col-span-2">
          <NeonCard color="#00ffcc" hoverable={false}>
            <h3 className="text-sm text-white/50 tracking-wider mb-4">{t('call.queue')}</h3>
            <div className="space-y-2">
              {callQueue.map((call, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    background:
                      call.status === t('call.calling')
                        ? 'rgba(0,255,200,0.05)'
                        : 'rgba(10,10,10,0.4)',
                    borderColor:
                      call.status === t('call.calling')
                        ? 'rgba(0,255,200,0.2)'
                        : 'rgba(255,255,255,0.04)',
                    animation:
                      call.status === t('call.calling')
                        ? 'border-glow 3s ease-in-out infinite'
                        : 'none',
                  }}
                >
                  {/* Status dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      background:
                        call.status === t('call.calling')
                          ? '#00ffc8'
                          : call.status === t('call.waiting')
                            ? '#00ffcc'
                            : call.status === t('call.queued')
                              ? '#41ffdd'
                              : 'rgba(255,255,255,0.15)',
                      boxShadow:
                        call.status === t('call.calling')
                          ? '0 0 8px #00ffc8'
                          : call.status === t('call.waiting')
                            ? '0 0 6px #00ffcc'
                            : 'none',
                      animation:
                        call.status === t('call.calling')
                          ? 'neon-pulse 1.5s ease-in-out infinite'
                          : 'none',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/75 truncate">
                      {call.name} · <span className="text-white/30">{call.company}</span>
                    </p>
                  </div>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full hidden sm:inline-block"
                    style={{
                      background: call.type.includes('AI')
                        ? 'rgba(0,212,255,0.1)'
                        : 'rgba(65,255,221,0.1)',
                      color: call.type.includes('AI') ? '#00d4ff' : '#41ffdd',
                      border: `1px solid ${call.type.includes('AI') ? 'rgba(0,212,255,0.2)' : 'rgba(0,139,157,0.2)'}`,
                    }}
                  >
                    {call.type}
                  </span>
                  <span className="text-xs text-white/30 hidden md:block w-12 text-center">
                    {call.duration}
                  </span>
                  <span
                    className="text-[10px] hidden lg:block"
                    style={{
                      color:
                        call.status === t('call.calling')
                          ? '#00ffc8'
                          : call.status === t('call.done')
                            ? 'rgba(255,255,255,0.2)'
                            : '#00ffcc',
                    }}
                  >
                    {call.status}
                  </span>
                  <div className="hidden xl:flex items-center gap-1.5 w-16">
                    <Bot className="w-3 h-3" style={{ color: `${call.color}80` }} />
                    <span className="text-[10px]" style={{ color: call.color }}>
                      {call.aiScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </NeonCard>
        </div>

        {/* AI Call Panel */}
        <div>
          <NeonCard color="#00f0ff" hoverable={false} className="mb-5">
            <h3 className="text-sm text-white/50 tracking-wider mb-4">
              {t('call.aiRealtimeAnalysis')}
            </h3>
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(0,240,255,0.05)',
                  border: '1px solid rgba(0,240,255,0.1)',
                }}
              >
                <Volume2
                  className="w-4 h-4 text-[#00f0ff]"
                  style={{ animation: 'neon-pulse 1s ease-in-out infinite' }}
                />
                <div className="flex-1">
                  <p className="text-xs text-white/60">{t('aiAnalysis.voiceSentiment')}</p>
                  <p className="text-sm text-[#00ffc8]">{t('aiAnalysis.sentimentPositive')}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(0,212,255,0.05)',
                  border: '1px solid rgba(0,212,255,0.1)',
                }}
              >
                <Brain className="w-4 h-4 text-[#00d4ff]" />
                <div className="flex-1">
                  <p className="text-xs text-white/60">{t('aiAnalysis.intentRecognition')}</p>
                  <p className="text-sm text-[#00d4ff]">{t('aiAnalysis.intentResult')}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(0,255,204,0.05)',
                  border: '1px solid rgba(0,255,204,0.1)',
                }}
              >
                <Zap className="w-4 h-4 text-[#00ffcc]" />
                <div className="flex-1">
                  <p className="text-xs text-white/60">{t('aiAnalysis.recommendStrategy')}</p>
                  <p className="text-sm text-[#00ffcc]">{t('aiAnalysis.strategyResult')}</p>
                </div>
              </div>
            </div>
          </NeonCard>

          <NeonCard color="#00d4ff" hoverable={false}>
            <h3 className="text-sm text-white/50 tracking-wider mb-3">
              {t('call.efficiencyRing')}
            </h3>
            <div className="flex justify-center py-3">
              <div className="relative w-28 h-28">
                {/* Outer ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#callGrad)"
                    strokeWidth="6"
                    strokeDasharray={`${78.3 * 2.64} ${100 * 2.64}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="callGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00ffcc" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-xl text-[#00ffcc]"
                    style={{ textShadow: '0 0 10px rgba(0,255,204,0.5)' }}
                  >
                    78.3%
                  </span>
                  <span className="text-[9px] text-white/25">接通率</span>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}

function WorkflowPage() {
  const { t } = useI18n();

  // Define workflowNodes inside the component
  const workflowNodes = [
    { label: t('workflow.inputAnalysis'), status: 'completed', color: '#00ffc8' },
    { label: t('workflow.intentRecog'), status: 'completed', color: '#00ffc8' },
    { label: t('workflow.taskExec'), status: 'active', color: '#00f0ff' },
    { label: t('workflow.resultOpt'), status: 'pending', color: '#ffffff33' },
    { label: t('workflow.learnFeedback'), status: 'pending', color: '#ffffff33' },
  ];

  return (
    <div
      className="h-full overflow-y-auto p-6"
      style={{ scrollbarWidth: 'none', animation: 'spring-in 0.4s var(--spring-easing) both' }}
    >
      <h2
        className="text-[#008b9d] mb-6 tracking-wider"
        style={{ textShadow: '0 0 15px rgba(0,139,157,0.5)' }}
      >
        {t('workflow.title')}
      </h2>
      <NeonCard color="#008b9d" hoverable={false} className="mb-6">
        <h3 className="text-sm text-white/60 mb-6">{t('workflow.activeFlow')}</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {workflowNodes.map((node, i) => (
            <div key={i} className="contents">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500"
                  style={{
                    borderColor: node.color,
                    background: node.status === 'active' ? `${node.color}20` : 'rgba(10,10,10,0.5)',
                    boxShadow:
                      node.status === 'active'
                        ? `0 0 20px ${node.color}40, inset 0 0 10px ${node.color}15`
                        : 'none',
                    animation:
                      node.status === 'active' ? 'border-glow 2s ease-in-out infinite' : 'none',
                  }}
                >
                  <span className="text-lg">
                    {i === 0 ? '📥' : i === 1 ? '🧠' : i === 2 ? '⚡' : i === 3 ? '🔧' : '📊'}
                  </span>
                </div>
                <span
                  className="text-[10px] whitespace-nowrap"
                  style={{
                    color: node.status === 'pending' ? 'rgba(255,255,255,0.2)' : node.color,
                  }}
                >
                  {node.label}
                </span>
              </div>
              {i < workflowNodes.length - 1 && (
                <div
                  className="flex-1 min-w-8 h-0.5 rounded-full relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {node.status === 'completed' && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${node.color}, ${workflowNodes[i + 1].color})`,
                      }}
                    />
                  )}
                  {node.status === 'active' && (
                    <div
                      className="absolute top-0 left-0 h-full w-1/2 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${node.color}, transparent)`,
                        animation: 'data-flow-h 2s linear infinite',
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </NeonCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: t('workflow.completedTasks'), value: '1,247', color: '#00ffc8' },
          { label: t('workflow.activeFlows'), value: '8', color: '#00f0ff' },
          { label: t('workflow.avgTime'), value: '2.3s', color: '#008b9d' },
        ].map((stat, i) => (
          <NeonCard key={i} color={stat.color}>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{stat.label}</p>
            <p
              className="text-2xl"
              style={{ color: stat.color, textShadow: `0 0 15px ${stat.color}60` }}
            >
              {stat.value}
            </p>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Phase 8: Forms Tab Page (sub-tabs wrapper)
// ==========================================
function FormsTabPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<'fill' | 'history' | 'builder'>('fill');
  const tabs = [
    { id: 'fill' as const, label: t('forms.fillForm'), icon: ClipboardList, color: '#008b9d' },
    { id: 'history' as const, label: t('forms.history'), icon: History, color: '#00f0ff' },
    { id: 'builder' as const, label: t('forms.builder'), icon: Layers, color: '#00d4ff' },
  ];
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-6 pt-4 pb-0 shrink-0">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs transition-all duration-300"
              style={{
                background: active ? `${t.color}10` : 'transparent',
                borderBottom: active ? `2px solid ${t.color}` : '2px solid transparent',
                color: active ? t.color : 'rgba(255,255,255,0.3)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === 'fill' && <SmartFormPage />}
        {tab === 'history' && (
          <div className="h-full overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
            <FormHistory />
          </div>
        )}
        {tab === 'builder' && (
          <div className="h-full overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
            <FormTemplateBuilder />
          </div>
        )}
      </div>
    </div>
  );
}

// FormInsightsSection and InsightsPage moved to insights-enhanced.tsx
// ToolsPage moved to ai-tools-page.tsx
// ProfilePage added in profile-page.tsx
