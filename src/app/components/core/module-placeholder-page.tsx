import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { useThemeColors } from "../hooks/use-theme-colors";
import { NeonCard } from "./neon-card";

// ==========================================
// YYC³ Module Placeholder Page
// Reusable template for modules under construction
// Supports Guidelines-02 feature descriptions
// ==========================================

export interface ModuleFeature {
  title: string;
  desc: string;
  icon?: LucideIcon;
  color?: string;
  status?: "ready" | "beta" | "planned";
}

export interface ModulePageConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  category: string;
  features: ModuleFeature[];
  aiCapabilities?: string[];
  stats?: { label: string; value: string; trend?: string; trendUp?: boolean }[];
}

const STATUS_MAP = {
  ready: { label: "已就绪", color: "#22c55e", icon: CheckCircle2 },
  beta: { label: "测试中", color: "#eab308", icon: Activity },
  planned: { label: "规划中", color: "#3b82f6", icon: Clock },
};

export function ModulePlaceholderPage({
  config,
}: {
  config: ModulePageConfig;
}) {
  const tc = useThemeColors();
  const Icon = config.icon;

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{
          background: `linear-gradient(90deg, ${config.color}, ${tc.primary}, ${tc.secondary})`,
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: tc.alpha(config.color, 0.1),
              border: `1px solid ${tc.alpha(config.color, 0.2)}`,
              boxShadow: `0 0 15px ${tc.alpha(config.color, 0.1)}`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <h1
              className="tracking-wider flex items-center gap-2"
              style={{
                color: tc.primary,
                textShadow: `0 0 15px ${tc.alpha(tc.primary, 0.4)}`,
              }}
            >
              {config.title}
            </h1>
            <p className="text-[10px] text-white/20 tracking-wider">
              {config.subtitle}
            </p>
          </div>
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-[9px]"
            style={{
              background: tc.alpha(config.color, 0.08),
              color: config.color,
              border: `1px solid ${tc.alpha(config.color, 0.15)}`,
            }}
          >
            {config.category}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      {config.stats && config.stats.length > 0 && (
        <div className="px-6 pb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {config.stats.map((stat, idx) => (
              <NeonCard key={stat.label} color={config.color}>
                <div
                  style={{
                    animation: `spring-in 0.35s var(--spring-easing) ${idx * 0.05}s both`,
                  }}
                >
                  <p className="text-[10px] text-white/30 mb-1">{stat.label}</p>
                  <p
                    className="text-xl mb-0.5"
                    style={{
                      color: config.color,
                      textShadow: `0 0 12px ${tc.alpha(config.color, 0.3)}`,
                    }}
                  >
                    {stat.value}
                  </p>
                  {stat.trend && (
                    <div className="flex items-center gap-1">
                      {stat.trendUp !== undefined && (
                        <ArrowUpRight
                          className="w-2.5 h-2.5"
                          style={{
                            color: stat.trendUp ? "#22c55e" : "#ef4444",
                            transform: stat.trendUp ? "none" : "rotate(90deg)",
                          }}
                        />
                      )}
                      <span
                        className="text-[9px]"
                        style={{
                          color: stat.trendUp
                            ? "#22c55e"
                            : stat.trendUp === false
                              ? "#ef4444"
                              : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  )}
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      )}

      {/* Feature Cards Grid */}
      <div className="px-6 pb-5">
        <h2 className="text-[12px] text-white/35 tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" style={{ color: tc.primary }} />
          功能模块
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {config.features.map((feature, idx) => {
            const FIcon = feature.icon || Sparkles;
            const fColor = feature.color || config.color;
            const statusInfo = feature.status
              ? STATUS_MAP[feature.status]
              : STATUS_MAP.planned;
            const StatusIcon = statusInfo.icon;
            return (
              <NeonCard key={feature.title} color={fColor}>
                <div
                  style={{
                    animation: `spring-in 0.35s var(--spring-easing) ${idx * 0.04}s both`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: tc.alpha(fColor, 0.1),
                          border: `1px solid ${tc.alpha(fColor, 0.2)}`,
                        }}
                      >
                        <FIcon
                          className="w-3.5 h-3.5"
                          style={{ color: fColor }}
                        />
                      </div>
                      <h4 className="text-[12px] text-white/70">
                        {feature.title}
                      </h4>
                    </div>
                    <span
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px]"
                      style={{
                        background: tc.alpha(statusInfo.color, 0.08),
                        color: statusInfo.color,
                        border: `1px solid ${tc.alpha(statusInfo.color, 0.15)}`,
                      }}
                    >
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/20 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </NeonCard>
            );
          })}
        </div>
      </div>

      {/* AI Capabilities */}
      {config.aiCapabilities && config.aiCapabilities.length > 0 && (
        <div className="px-6 pb-8">
          <h2 className="text-[12px] text-white/35 tracking-wider mb-3 flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" style={{ color: tc.accent }} />
            AI 智能特性
          </h2>
          <NeonCard color={tc.accent} hoverable={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {config.aiCapabilities.map((cap, idx) => (
                <div
                  key={cap}
                  className="flex items-center gap-2 py-1.5"
                  style={{
                    animation: `spring-in 0.3s var(--spring-easing) ${idx * 0.03}s both`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: tc.accent,
                      boxShadow: `0 0 4px ${tc.alpha(tc.accent, 0.5)}`,
                    }}
                  />
                  <span className="text-[11px] text-white/35">{cap}</span>
                </div>
              ))}
            </div>
          </NeonCard>
        </div>
      )}
    </div>
  );
}

export { MODULE_CONFIGS } from "../module-configs";
