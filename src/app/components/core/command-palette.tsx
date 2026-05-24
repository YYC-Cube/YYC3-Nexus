import { Command } from 'cmdk';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Code,
  Database,
  FileText,
  GitBranch,
  History,
  Image,
  Languages,
  LayoutDashboard,
  Link,
  MessageCircle,
  MessageSquare,
  Mic,
  PenTool,
  Phone,
  PhoneCall,
  PlayCircle,
  Radio,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Target,
  UserCircle,
  UserPlus,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  type ComponentType,
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { type PageId, useApp } from '../context/app-context';
import { useI18n } from '../context/i18n-context';

// ==========================================
// YYC³ 命令面板 — Ctrl+K Command Palette
// Cyberpunk-themed global command interface
// ==========================================

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  action: () => void;
  category: 'navigation' | 'customer' | 'action' | 'tool' | 'recent';
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Global command palette overlay (Ctrl+K / Cmd+K).
 * Provides fuzzy search across navigation, customer actions,
 * quick operations, and AI tools. Renders as a centered modal with `cmdk`.
 */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { setActivePage, addActivity } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const navigate = useCallback(
    (page: PageId) => {
      setActivePage(page);
      addActivity({
        action: t('cmd.quickNav'),
        target: t('cmd.jumpedTo', { page }),
        type: 'system',
        color: '#00f0ff',
      });
      onClose();
    },
    [setActivePage, addActivity, onClose, t],
  );

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: t('nav.dashboard'),
      sublabel: t('cmd.navDashSub'),
      icon: LayoutDashboard,
      color: '#00f0ff',
      category: 'navigation',
      action: () => navigate('dashboard'),
      keywords: ['首页', 'home', 'dashboard', '数据'],
    },
    {
      id: 'nav-chat',
      label: t('nav.chat'),
      sublabel: t('cmd.navChatSub'),
      icon: MessageCircle,
      color: '#00f0ff',
      category: 'navigation',
      action: () => navigate('chat'),
      keywords: ['聊天', 'chat', '对话', 'ai'],
    },
    {
      id: 'nav-clm',
      label: t('nav.clm'),
      sublabel: t('cmd.navClmSub'),
      icon: Users,
      color: '#00d4ff',
      category: 'navigation',
      action: () => navigate('clm'),
      keywords: ['客户', 'customer', 'clm', '生命周期'],
    },
    {
      id: 'nav-aicall',
      label: t('nav.aicall'),
      sublabel: t('cmd.navAicallSub'),
      icon: Phone,
      color: '#00ffcc',
      category: 'navigation',
      action: () => navigate('aicall'),
      keywords: ['呼叫', 'call', '电话', '外呼'],
    },
    {
      id: 'nav-tools',
      label: t('tools.title'),
      sublabel: t('cmd.navToolsSub'),
      icon: Wrench,
      color: '#00ffc8',
      category: 'navigation',
      action: () => navigate('tools'),
      keywords: ['工具', 'tools'],
    },
    {
      id: 'nav-workflow',
      label: t('workflow.title'),
      sublabel: t('cmd.navWorkflowSub'),
      icon: GitBranch,
      color: '#008b9d',
      category: 'navigation',
      action: () => navigate('workflow'),
      keywords: ['工作流', 'workflow', '流程'],
    },
    {
      id: 'nav-insights',
      label: t('nav.insights'),
      sublabel: t('cmd.navInsightsSub'),
      icon: BarChart3,
      color: '#00f0ff',
      category: 'navigation',
      action: () => navigate('insights'),
      keywords: ['洞察', '分析', 'insights', '数据'],
    },
    {
      id: 'nav-quickActions',
      label: t('nav.quickActions'),
      sublabel: 'AI smart one-click operations',
      icon: Zap,
      color: '#f97316',
      category: 'navigation',
      action: () => navigate('quickActions'),
      keywords: ['一键', '操作', 'quick', 'actions', '快捷'],
    },
    {
      id: 'nav-taskBoard',
      label: t('nav.taskBoard'),
      sublabel: 'AI智能任务看板管理',
      icon: Target,
      color: '#22c55e',
      category: 'navigation',
      action: () => navigate('taskBoard'),
      keywords: ['任务', '看板', 'task', 'board', 'kanban', 'todo'],
    },
    {
      id: 'nav-devWorkspace',
      label: t('nav.devWorkspace'),
      sublabel: 'IDE-like开发工作台面板',
      icon: Code,
      color: '#3b82f6',
      category: 'navigation',
      action: () => navigate('devWorkspace'),
      keywords: ['开发', '工作台', 'dev', 'workspace', 'IDE', 'panel', '文件', 'explorer'],
    },
    {
      id: 'nav-logs',
      label: t('nav.logs'),
      sublabel: t('cmd.navLogsSub'),
      icon: History,
      color: '#00ffc8',
      category: 'navigation',
      action: () => navigate('logs'),
      keywords: ['日志', 'logs', '活动', '记录'],
    },
    {
      id: 'nav-settings',
      label: t('cmd.sysSettings'),
      sublabel: t('cmd.navSettingsSub'),
      icon: Settings,
      color: '#005f73',
      category: 'navigation',
      action: () => navigate('settings'),
      keywords: ['设置', 'settings', '配置'],
    },

    // Platform Integration
    {
      id: 'nav-paramSettings',
      label: t('nav.paramSettings'),
      sublabel: '系统参数配置管理',
      icon: Settings,
      color: '#8b5cf6',
      category: 'navigation',
      action: () => navigate('paramSettings'),
      keywords: ['参数', '配置', 'param', 'settings'],
    },
    {
      id: 'nav-platformSettings',
      label: t('nav.platformSettings'),
      sublabel: '平台级统一配置',
      icon: Server,
      color: '#3b82f6',
      category: 'navigation',
      action: () => navigate('platformSettings'),
      keywords: ['平台', 'platform', '配置'],
    },
    {
      id: 'nav-wechatConfig',
      label: t('nav.wechatConfig'),
      sublabel: '微信公众号/小程序配置',
      icon: MessageSquare,
      color: '#22c55e',
      category: 'navigation',
      action: () => navigate('wechatConfig'),
      keywords: ['微信', 'wechat', '公众号'],
    },
    {
      id: 'nav-channelCenter',
      label: t('nav.channelCenter'),
      sublabel: '全渠道统一管理',
      icon: Radio,
      color: '#f97316',
      category: 'navigation',
      action: () => navigate('channelCenter'),
      keywords: ['渠道', 'channel', '抖音', '小红书'],
    },
    {
      id: 'nav-dataIntegration',
      label: t('nav.dataIntegration'),
      sublabel: '企业级数据集成',
      icon: Database,
      color: '#06b6d4',
      category: 'navigation',
      action: () => navigate('dataIntegration'),
      keywords: ['数据', '集成', 'data', '同步'],
    },

    // AI Marketing
    {
      id: 'nav-marketingPlan',
      label: t('nav.marketingPlan'),
      sublabel: 'AI营销方案策划',
      icon: Sparkles,
      color: '#8b5cf6',
      category: 'navigation',
      action: () => navigate('marketingPlan'),
      keywords: ['营销', '方案', '策划', 'marketing'],
    },
    {
      id: 'nav-promotionExec',
      label: t('nav.promotionExec'),
      sublabel: '推广活动执行引擎',
      icon: PlayCircle,
      color: '#22c55e',
      category: 'navigation',
      action: () => navigate('promotionExec'),
      keywords: ['推广', '活动', 'promotion'],
    },
    {
      id: 'nav-marketingAnalytics',
      label: t('nav.marketingAnalytics'),
      sublabel: '营销效果分析',
      icon: BarChart3,
      color: '#3b82f6',
      category: 'navigation',
      action: () => navigate('marketingAnalytics'),
      keywords: ['效果', '分析', 'analytics', '归因'],
    },
    {
      id: 'nav-marketingAssets',
      label: t('nav.marketingAssets'),
      sublabel: '营销素材管理',
      icon: Image,
      color: '#ec4899',
      category: 'navigation',
      action: () => navigate('marketingAssets'),
      keywords: ['素材', '图片', 'assets', '创意'],
    },
    {
      id: 'nav-customerAcquisition',
      label: t('nav.customerAcquisition'),
      sublabel: '全渠道获客系统',
      icon: UserPlus,
      color: '#22c55e',
      category: 'navigation',
      action: () => navigate('customerAcquisition'),
      keywords: ['获客', '线索', 'acquisition'],
    },
    {
      id: 'nav-brandMgmt',
      label: t('nav.brandMgmt'),
      sublabel: '品牌资产与舆情',
      icon: Award,
      color: '#eab308',
      category: 'navigation',
      action: () => navigate('brandMgmt'),
      keywords: ['品牌', '舆情', 'brand'],
    },
    {
      id: 'nav-intelligentOps',
      label: t('nav.intelligentOps'),
      sublabel: 'AIOps智能运维',
      icon: Wrench,
      color: '#ef4444',
      category: 'navigation',
      action: () => navigate('intelligentOps'),
      keywords: ['运维', 'ops', '监控', '故障'],
    },
    {
      id: 'nav-platformHub',
      label: t('nav.platformHub'),
      sublabel: '第三方平台对接',
      icon: Link,
      color: '#06b6d4',
      category: 'navigation',
      action: () => navigate('platformHub'),
      keywords: ['对接', '平台', 'API', 'hub'],
    },
    {
      id: 'nav-aiCreativeTools',
      label: t('nav.aiCreativeTools'),
      sublabel: 'AI内容创作引擎',
      icon: PenTool,
      color: '#8b5cf6',
      category: 'navigation',
      action: () => navigate('aiCreativeTools'),
      keywords: ['创作', 'AI', '文案', 'creative'],
    },
    {
      id: 'nav-aiMarketingEngine',
      label: t('nav.aiMarketingEngine'),
      sublabel: '营销自动化核心',
      icon: Rocket,
      color: '#f97316',
      category: 'navigation',
      action: () => navigate('aiMarketingEngine'),
      keywords: ['引擎', '自动化', 'engine', '推荐'],
    },
    {
      id: 'nav-appOverview',
      label: t('nav.appOverview'),
      sublabel: '全局运营数据看板',
      icon: LayoutDashboard,
      color: '#00f0ff',
      category: 'navigation',
      action: () => navigate('appOverview'),
      keywords: ['总览', '看板', 'overview', 'KPI'],
    },
    {
      id: 'nav-aiDecisionSupport',
      label: t('nav.aiDecisionSupport'),
      sublabel: 'AI辅助商业决策',
      icon: Brain,
      color: '#a855f7',
      category: 'navigation',
      action: () => navigate('aiDecisionSupport'),
      keywords: ['决策', '推演', 'decision', '预测'],
    },
    {
      id: 'nav-nlpProcessing',
      label: t('nav.nlpProcessing'),
      sublabel: 'NLP语义理解引擎',
      icon: Languages,
      color: '#14b8a6',
      category: 'navigation',
      action: () => navigate('nlpProcessing'),
      keywords: ['NLP', '语义', '情感', '意图', '自然语言'],
    },

    // Customer shortcuts
    {
      id: 'cust-zhangmy',
      label: '张明远',
      sublabel: '星际科技 · 转化阶段 · ¥128,000',
      icon: UserCircle,
      color: '#00d4ff',
      category: 'customer',
      action: () => navigate('clm'),
      keywords: ['张明远', '星际科技'],
    },
    {
      id: 'cust-lisq',
      label: '李思琪',
      sublabel: '云端数据 · 成交阶段 · ¥256,000',
      icon: UserCircle,
      color: '#00d4ff',
      category: 'customer',
      action: () => navigate('clm'),
      keywords: ['李思琪', '云端数据'],
    },
    {
      id: 'cust-wangjh',
      label: '王建华',
      sublabel: '量子计算 · 获客阶段 · ¥64,000',
      icon: UserCircle,
      color: '#00f0ff',
      category: 'customer',
      action: () => navigate('clm'),
      keywords: ['王建华', '��子计算'],
    },
    {
      id: 'cust-chenyw',
      label: '陈雅文',
      sublabel: '智链网络 · 服务阶段 · ¥512,000',
      icon: UserCircle,
      color: '#00ffc8',
      category: 'customer',
      action: () => navigate('clm'),
      keywords: ['陈雅文', '智链网络'],
    },
    {
      id: 'cust-zhaopf',
      label: '赵鹏飞',
      sublabel: '未来能源 · 忠诚阶段 · ¥1,024,000',
      icon: UserCircle,
      color: '#00ffcc',
      category: 'customer',
      action: () => navigate('clm'),
      keywords: ['赵鹏飞', '未来能源'],
    },

    // Actions
    {
      id: 'act-newcust',
      label: t('cmd.custAdd'),
      sublabel: t('cmd.custAddSub'),
      icon: UserPlus,
      color: '#00d4ff',
      category: 'action',
      action: () => navigate('clm'),
      keywords: ['新增', '添加', '客户'],
    },
    {
      id: 'act-newcall',
      label: t('cmd.startCall'),
      sublabel: t('cmd.startCallSub'),
      icon: PhoneCall,
      color: '#00ffcc',
      category: 'action',
      action: () => navigate('aicall'),
      keywords: ['呼叫', '电话', '外呼'],
    },
    {
      id: 'act-script',
      label: t('cmd.scriptLib'),
      sublabel: t('cmd.scriptLibSub'),
      icon: Mic,
      color: '#00ffcc',
      category: 'action',
      action: () => navigate('aicall'),
      keywords: ['话术', '模板', '脚本'],
    },
    {
      id: 'act-report',
      label: t('cmd.genReport'),
      sublabel: t('cmd.genReportSub'),
      icon: FileText,
      color: '#00f0ff',
      category: 'action',
      action: () => navigate('insights'),
      keywords: ['报告', 'report', '分析'],
    },

    // Tools
    {
      id: 'tool-codegen',
      label: t('cmd.toolCodegen'),
      sublabel: t('cmd.toolCodegenSub'),
      icon: Brain,
      color: '#00f0ff',
      category: 'tool',
      action: () => navigate('tools'),
      keywords: ['代码', '生成', 'code'],
    },
    {
      id: 'tool-dataflow',
      label: t('cmd.toolDataflow'),
      sublabel: t('cmd.toolDataflowSub'),
      icon: Activity,
      color: '#00d4ff',
      category: 'tool',
      action: () => navigate('tools'),
      keywords: ['数据流', '监控'],
    },
    {
      id: 'tool-security',
      label: t('cmd.toolSecurity'),
      sublabel: t('cmd.toolSecuritySub'),
      icon: Shield,
      color: '#00ffcc',
      category: 'tool',
      action: () => navigate('tools'),
      keywords: ['安全', '防护'],
    },
    {
      id: 'tool-perf',
      label: t('cmd.toolPerf'),
      sublabel: t('cmd.toolPerfSub'),
      icon: Zap,
      color: '#005f73',
      category: 'tool',
      action: () => navigate('tools'),
      keywords: ['性能', '优化'],
    },
  ];

  const categoryLabels: Record<string, { label: string; sublabel: string; color: string }> = {
    navigation: { label: t('cmd.pageNav'), sublabel: 'Navigation', color: '#00f0ff' },
    customer: { label: t('cmd.custSearch'), sublabel: 'Customers', color: '#00d4ff' },
    action: { label: t('cmd.quickActions'), sublabel: 'Actions', color: '#00ffcc' },
    tool: { label: t('cmd.aiTools'), sublabel: 'Tools', color: '#00ffc8' },
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />

      {/* Command Panel */}
      <div
        className="relative w-full max-w-[640px] mx-4 rounded-2xl border overflow-hidden"
        style={{
          background: 'rgba(10,10,10,0.96)',
          borderColor: 'rgba(0,240,255,0.3)',
          boxShadow:
            '0 0 40px rgba(0,240,255,0.15), 0 0 80px rgba(0,240,255,0.05), 0 25px 50px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(30px)',
          animation: 'spring-in 0.25s var(--spring-easing) both',
        }}
      >
        {/* Circuit grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <Command
          className="relative z-10"
          filter={(value, search) => {
            const item = commands.find(c => c.id === value);
            if (!item) return 0;
            const s = search.toLowerCase();
            if (item.label.toLowerCase().includes(s)) return 1;
            if (item.sublabel?.toLowerCase().includes(s)) return 0.8;
            if (item.keywords?.some(k => k.toLowerCase().includes(s))) return 0.6;
            return 0;
          }}
        >
          {/* Search Input */}
          <div
            className="flex items-center gap-3 px-5 border-b"
            style={{ borderColor: 'rgba(0,240,255,0.15)' }}
          >
            <Search className="w-5 h-5 shrink-0" style={{ color: '#00f0ff' }} />
            <Command.Input
              ref={inputRef}
              value={search}
              onValueChange={setSearch}
              placeholder={t('cmd.searchPlaceholder')}
              className="flex-1 h-14 bg-transparent text-white/90 text-sm placeholder:text-white/20 outline-none border-none"
              style={{ caretColor: '#00f0ff' }}
            />
            <div className="flex items-center gap-1.5">
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{
                  background: 'rgba(0,240,255,0.08)',
                  border: '1px solid rgba(0,240,255,0.2)',
                  color: 'rgba(0,240,255,0.5)',
                }}
              >
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          <Command.List
            className="max-h-[400px] overflow-y-auto py-2 px-2"
            style={{ scrollbarWidth: 'none' }}
          >
            <Command.Empty className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="w-8 h-8" style={{ color: 'rgba(0,240,255,0.2)' }} />
                <p className="text-sm text-white/20">{t('cmd.noMatch')}</p>
                <p className="text-[10px] text-white/10">{t('cmd.noMatchHint')}</p>
              </div>
            </Command.Empty>

            {Object.keys(categoryLabels).map(cat => {
              const catInfo = categoryLabels[cat];
              const catCommands = commands.filter(c => c.category === cat);
              if (catCommands.length === 0) return null;

              return (
                <Command.Group
                  key={cat}
                  heading={
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div
                        className="w-1 h-3 rounded-full"
                        style={{
                          background: catInfo.color,
                          boxShadow: `0 0 6px ${catInfo.color}80`,
                        }}
                      />
                      <span
                        className="text-[10px] tracking-[0.15em] uppercase"
                        style={{ color: `${catInfo.color}80` }}
                      >
                        {catInfo.label}
                      </span>
                      <span className="text-[9px] text-white/15">{catInfo.sublabel}</span>
                    </div>
                  }
                >
                  {catCommands.map(cmd => {
                    const Icon = cmd.icon;
                    return (
                      <Command.Item
                        key={cmd.id}
                        value={cmd.id}
                        onSelect={() => cmd.action()}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl mx-1 mb-0.5 cursor-pointer transition-all duration-200 group"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = `${cmd.color}10`;
                          e.currentTarget.style.borderColor = `${cmd.color}25`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                          style={{
                            background: `${cmd.color}12`,
                            border: `1px solid ${cmd.color}25`,
                          }}
                        >
                          <Icon className="w-4 h-4" style={{ color: cmd.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/75 group-hover:text-white/90 truncate transition-colors">
                            {cmd.label}
                          </p>
                          {cmd.sublabel && (
                            <p className="text-[10px] text-white/20 truncate">{cmd.sublabel}</p>
                          )}
                        </div>
                        <ArrowRight
                          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
                          style={{ color: cmd.color }}
                        />
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              );
            })}
          </Command.List>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-2.5 border-t"
            style={{ borderColor: 'rgba(0,240,255,0.1)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <kbd
                  className="px-1.5 py-0.5 rounded text-[9px]"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  ↑
                </kbd>
                <kbd
                  className="px-1.5 py-0.5 rounded text-[9px]"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  ↓
                </kbd>
                <span className="text-[9px] text-white/15 ml-1">{t('cmd.navHint')}</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd
                  className="px-1.5 py-0.5 rounded text-[9px]"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  ↵
                </kbd>
                <span className="text-[9px] text-white/15 ml-1">{t('cmd.confirmHint')}</span>
              </div>
            </div>
            <span className="text-[9px] text-white/10 tracking-wider">{t('cmd.cmdCenter')}</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

/**
 * Hook that manages the Ctrl+K / Cmd+K shortcut to toggle the command palette.
 * Returns `{ open, setOpen }` for controlled rendering.
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen, onClose: () => setOpen(false) };
}
