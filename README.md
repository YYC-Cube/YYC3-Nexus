<div align="center">

<img src="public/YYC3-Family.png" alt="YYC³ Nexus" width="640" />

# YYC³ Nexus

### AI Marketing Intelligence Hub

**言枢·灵境 — AI 营销智能中枢**

> **_YanYuCloudCube™_**
> _言启象限 · 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_

---

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg?style=flat-square&logo=vite&logoColor=white)](https://github.com/YYC-Cube/YYC3-Nexus)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Tests](https://img.shields.io/badge/tests-906%2F906-brightgreen.svg?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![TSC](https://img.shields.io/badge/tsc-0%20errors-brightgreen.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Build](https://img.shields.io/badge/build-1.89s-brightgreen.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-FF6B9D.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Nexus/pulls)

</div>

---

## ✨ 核心特性

| 特性                | 描述                                                          |
| :------------------ | :------------------------------------------------------------ |
| 🤖 **AI 智能中枢**  | OpenAI / Claude / DeepSeek / Ollama 多模型切换 + MCP 工具协议 |
| 🎨 **双主题系统**   | Cyberpunk 霓虹风格 + Liquid Glass 液态玻璃                    |
| 📊 **全维度驾驶舱** | 实时 KPI 监控 · 营销分析 · 客户画像 · 渠道排行                |
| 💬 **智能客户关怀** | 五阶段全生命周期管理 · AI 评分 · CSV 导入导出                 |
| 📋 **任务看板**     | Kanban / List / Stats 三视图 · DnD 拖拽 · AI 推理引擎         |
| 📝 **智能表单**     | 可视化构建器 · 条件逻辑 · 模板库                              |
| 🔧 **开发者工作区** | Monaco 代码编辑器 · Git 集成 · 文件树浏览器                   |
| 🌍 **国际化**       | 🇨🇳 简体中文 (zh-CN) · 🇺🇸 English (en-US)                      |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YYC³ Nexus                                  │
│                    AI Marketing Intelligence Hub                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Dashboard│  │ AI Chat  │  │ Customer │  │ Marketing│           │
│  │  数据驾驶舱│  │ AI 对话  │  │ 客户关怀  │  │ 营销引擎 │           │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘           │
│        │             │             │             │                  │
│  ┌─────┴────┐  ┌─────┴────┐  ┌─────┴────┐  ┌─────┴────┐           │
│  │  Tasks   │  │ SmartForm│  │ Operations│  │Developer │           │
│  │ 任务看板  │  │ 智能表单  │  │ AIOps运维 │  │ 开发工作区│           │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘           │
│        │             │             │             │                  │
│  ┌─────┴────┐  ┌─────┴────┐  ┌─────┴────┐  ┌─────┴────┐           │
│  │HR&Finance│  │ Supply   │  │Integrate │  │ Settings │           │
│  │ 人事财务  │  │ 供应链   │  │ 平台集成  │  │ 系统设置  │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Component Layer                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ UI (51+) │  │ Core(17) │  │ Panels   │  │ Contexts │           │
│  │ Radix+shadcn│  │ NeonCard │  │ FileTree │  │ AI/Auth  │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
├─────────────────────────────────────────────────────────────────────┤
│  State Layer        │  Service Layer       │  i18n Layer            │
│  Zustand + Context  │  AI Proxy / Git      │  zh-CN / en-US         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

<table>
<tr><td width="140"><b>分类</b></td><td><b>技术</b></td><td width="80"><b>版本</b></td></tr>
<tr><td>⚡ 框架</td><td>React 18</td><td>18.3.1</td></tr>
<tr><td>🔷 语言</td><td>TypeScript (strict)</td><td>5.3+</td></tr>
<tr><td>⚡ 构建</td><td>Vite</td><td>6.3.5</td></tr>
<tr><td>🎨 样式</td><td>Tailwind CSS v4</td><td>4.3.0</td></tr>
<tr><td>🧩 UI 组件</td><td>Radix UI + shadcn/ui</td><td>30+ primitives</td></tr>
<tr><td>📦 状态</td><td>Zustand 5 (persist)</td><td>5.0.13</td></tr>
<tr><td>🔀 路由</td><td>React Router</td><td>7.15.1</td></tr>
<tr><td>🎬 动画</td><td>Motion</td><td>12.40.0</td></tr>
<tr><td>📊 图表</td><td>Recharts</td><td>2.15.2</td></tr>
<tr><td>✅ 测试</td><td>Vitest + Playwright</td><td>3.2.4</td></tr>
<tr><td>🔍 Lint</td><td>Biome 2</td><td>2.4.15</td></tr>
</table>

---

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/YYC-Cube/YYC3-Nexus.git
cd YYC3-My-Mymg

# 安装依赖 (需要 pnpm >= 8)
pnpm install

# 启动开发服务器 → http://localhost:20703
pnpm dev

# 构建生产版本
pnpm build

# 运行全部测试
pnpm test

# TypeScript 类型检查
pnpm typecheck

# 代码检查 + 自动修复
pnpm lint:fix
```

---

## 📁 项目结构

```
YYC3-My-Mymg/
├── src/app/
│   ├── components/                    # 组件库
│   │   ├── cyberpunk-standalone.tsx   # 主入口 + 39 页面路由 (React.lazy)
│   │   ├── pages/                     # 📂 领域分组页面 (12 domains)
│   │   │   ├── dashboard/    (3)      #   数据驾驶舱
│   │   │   ├── ai/           (4)      #   AI 对话 + NLP + 创作
│   │   │   ├── marketing/    (7)      #   营销全链路
│   │   │   ├── customer/     (3)      #   客户关系管理
│   │   │   ├── tasks/        (2)      #   任务看板
│   │   │   ├── operations/   (1)      #   AIOps 运维
│   │   │   ├── hr-finance/   (2)      #   薪酬 + 财务
│   │   │   ├── supply-chain/ (2)      #   采购 + 库存
│   │   │   ├── integration/  (4)      #   平台集成
│   │   │   ├── profile/      (2)      #   个人中心
│   │   │   ├── developer/    (2)      #   开发者工作区
│   │   │   └── settings/     (5)      #   系统设置
│   │   ├── core/              (17)    # 📂 核心组件 (NeonCard / CommandPalette...)
│   │   ├── context/           (6)     # 📂 全局上下文 (App / AI / Auth / i18n)
│   │   ├── integrations/      (5)     # 📂 YYC³ 生态集成
│   │   ├── services/                  # 📂 服务层 (AI Proxy / Git / Edge)
│   │   ├── hooks/                      # 📂 自定义 Hooks
│   │   ├── panels/                     # 📂 面板组件
│   │   ├── settings/                   # 📂 设置子面板
│   │   └── ui/                 (51+)   # 📂 shadcn/ui 基础组件
│   ├── config/                        # 配置文件
│   └── locales/                       # i18n 翻译 (zh-CN / en-US)
├── tests/                             # 测试文件
│   ├── components/                    # 组件测试 (38 files, 906 cases)
│   ├── e2e/                           # E2E 测试 (Playwright)
│   └── ...
├── docs/                              # 项目文档
└── package.json
```

---

## 📊 项目质量

| 指标                | 状态 | 说明                                         |
| :------------------ | :--: | :------------------------------------------- |
| TypeScript 严格模式 |  ✅  | 0 errors                                     |
| 单元测试            |  ✅  | 38 files · 906/906 passed                    |
| 构建时间            |  ✅  | 1.89s (2881 modules)                         |
| 主 Chunk            |  ⚡  | 198 KB (gzip 48 KB)                          |
| 页面 Chunk          |  ⚡  | 3-24 KB/页 (React.lazy)                      |
| Vendor 拆分         |  ⚡  | 11 chunks (react/dom/charts/motion/icons...) |
| Lint                |  ✅  | Biome 2 (Rust 驱动)                          |
| 无障碍              |  📈  | WCAG 2.1 AA 92%                              |
| 安全                |  🔒  | CSP + RBAC + XSS + Frame Guard               |

---

## 🧪 测试

```bash
pnpm test              # 运行全部测试 (906 tests, 38 files)
pnpm test:watch        # 监听模式
pnpm test:coverage     # 覆盖率报告
pnpm test:e2e          # E2E 测试 (Playwright)
```

---

## 🔐 安全

- 🔒 API Key 本地存储 + UI Masking
- 🛡️ AI 代理三模式: direct / proxy / hybrid
- ⏱️ Token Bucket 限流
- ✍️ 请求签名验证
- 📋 CSP 安全策略 + 6 项安全头
- 🔑 RBAC 路由权限守卫 (admin / editor / viewer)
- 🚫 XSS 防护 + Frame 嵌入防护

---

## 🤝 贡献指南

### 分支策略

| 分支         | 用途               |
| :----------- | :----------------- |
| `main`       | 生产分支（受保护） |
| `feature/*`  | 新功能开发         |
| `fix/*`      | Bug 修复           |
| `refactor/*` | 代码重构           |

### PR 要求

- ✅ `pnpm test` — 所有测试通过
- ✅ `pnpm typecheck` — TypeScript 零错误
- ✅ `pnpm lint` — Biome 检查通过
- ✅ 新功能需添加对应测试
- ✅ 更新相关文档

---

<div align="center">

**YanYuCloudCube™** · 言启象限 · 语枢未来

_Words Initiate Quadrants, Language Serves as Core for Future_

`© 2025-2026 YYC³ Team. All Rights Reserved.`

</div>
