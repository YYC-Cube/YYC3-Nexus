---
file: YYC3-阶段1-架构验收-提示词系统.md
description: YYC³ 阶段1 架构验收提示词 — 目录结构、依赖审查、状态管理、构建配置
author: YanYuCloudCube Team <admin@0379.email>
version: v1.1.0
created: 2026-05-24
updated: 2026-05-24
status: stable
tags: [验收],[架构],[提示词],[阶段1]
category: policy
language: zh-CN
audience: developers,managers,stakeholders
complexity: intermediate
---

<div align="center">

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

</div>


## 📋 文档说明

| 属性 | 值 |
|------|------|
| 阶段编号 | YYC3-VA-1 |
| 阶段名称 | 架构验收 |
| 适用范围 | 项目目录结构、技术选型、模块划分、数据流、状态管理 |
| 前置条件 | 阶段0 需求验收通过 |
| 输出产物 | 架构验收报告 |
| 验收角色 | 技术架构师 / 技术负责人 |

---

## 🧭 阶段定位

```
项目生命周期
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[0 需求] → [1 架构] → [2 编码] → [3 测试] → [4 部署] → [5 运维]
             ▲ 当前
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 提示词 1-A：目录结构合规性审查

```
你是一位资深的前端架构师，负责对 YYC3 项目的目录结构进行合规性审查。

## 项目技术栈

- 框架：React 18.3 + TypeScript 5.3
- 构建：Vite 6.3
- 样式：Tailwind CSS 4.3 + Emotion
- UI库：Radix UI + shadcn/ui 风格组件
- 状态：Zustand 5
- 路由：React Router 7
- 测试：Vitest 3 + Playwright
- 代码质量：Biome 2

## 审查标准

### 1. 分层架构检查

项目应遵循以下分层结构：

```
src/
├── app/
│   ├── components/        # UI 组件层
│   │   ├── ui/            # 基础 UI 原子组件（Button, Input, Dialog...）
│   │   ├── core/          # 核心业务组件（NeonCard, CommandPalette...）
│   │   ├── context/       # React Context 提供者
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── pages/         # 页面级组件（按功能分子目录）
│   │   ├── panels/        # 面板组件
│   │   ├── services/      # 服务层（AI、数据库、文件系统）
│   │   ├── settings/      # 设置模块
│   │   ├── integrations/  # 第三方集成
│   │   └── figma/         # 设计相关
│   ├── styles/            # 全局样式
│   ├── main.tsx           # 入口文件
│   └── App.tsx            # 根组件
tests/
├── components/            # 组件测试（镜像 src 结构）
│   ├── ui/                # 基础组件测试
│   ├── pages/             # 页面测试
│   ├── panels/            # 面板测试
│   └── ...
├── business/              # 业务逻辑测试
├── hooks/                 # Hook 测试
├── services/              # 服务层测试
├── stores/                # Store 测试
├── utils/                 # 工具函数测试
├── e2e/                   # 端到端测试
├── setup.ts               # 测试配置
└── playwright.config.ts   # E2E 配置
```

### 2. 命名规范检查

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | kebab-case.tsx | `file-explorer-panel.tsx` |
| 测试文件 | {组件名}.test.tsx | `file-explorer-panel.test.tsx` |
| Hook 文件 | use-{name}.ts | `use-theme.ts` |
| 工具文件 | kebab-case.ts | `format-date.ts` |
| 样式文件 | kebab-case.css | `global-styles.css` |
| 类型文件 | kebab-case.ts / .d.ts | `api-types.ts` |
| Context | {name}-context.tsx | `theme-switcher-context.tsx` |

### 3. 模块职责检查

每个模块是否有明确的单一职责：
- ui/ 仅包含无状态/半状态的原子组件
- hooks/ 仅包含自定义 React Hooks
- services/ 仅包含业务逻辑和 API 调用
- pages/ 仅包含页面级路由组件
- panels/ 仅包含面板级布局组件

## 执行步骤

1. 运行 `find src -type f -name "*.tsx" -o -name "*.ts" | head -50` 检查文件结构
2. 逐目录检查文件命名是否合规
3. 检查是否有文件放错目录（如 hook 放在 components/ 里）
4. 检查 tests/ 是否与 src/ 镜像对应
5. 检查是否有循环依赖（同层模块互相引用）

## 验收标准

✅ 目录结构 100% 符合分层架构规范
✅ 文件命名 100% 符合命名规范
✅ 模块职责清晰无越界
✅ 测试目录与源码目录 1:1 镜像
✅ 无循环依赖
```

---

## 📝 提示词 1-B：依赖关系与版本合规性审查

```
你是一位资深的前端工程化专家，负责审查 YYC3 项目的依赖关系。

## 审查范围

### 1. 核心依赖版本合规性

检查 package.json 中的每个依赖：

| 类别 | 包名 | 当前版本 | 合规版本 | 状态 |
|------|------|----------|----------|------|
| 框架 | react | 18.3.1 | 18.x | ✅ |
| 框架 | react-dom | 18.3.1 | 18.x | ✅ |
| 构建 | vite | 6.3.5 | 6.x | ✅ |
| 类型 | typescript | 5.3+ | 5.x | ✅ |
| 样式 | tailwindcss | 4.3.0 | 4.x | ✅ |
| 测试 | vitest | 3.2+ | 3.x | ✅ |

### 2. 依赖安全性检查

- 运行 `pnpm audit` 检查安全漏洞
- 检查是否有已知 CVE 的依赖
- 检查废弃的依赖

### 3. 依赖精简度检查

- 是否有未使用的依赖（检查 import 使用率）
- 是否有功能重叠的依赖（如 clsx + tailwind-merge）
- 是否有过重的依赖（bundle size 影响）

### 4. peerDependencies 冲突检查

- React / React-Dom 版本对齐
- TypeScript 版本与 @types 包对齐

## 输出格式

| 包名 | 类型 | 当前版本 | 问题 | 建议 | 优先级 |
|------|------|----------|------|------|--------|
| {name} | deps/devDeps | {ver} | {问题} | {建议} | P0-P3 |

## 验收标准

✅ 所有核心依赖版本合规
✅ 无高危安全漏洞
✅ 无未使用的依赖
✅ 无 peerDependencies 冲突
✅ 依赖树层级 ≤ 5
```

---

## 📝 提示词 1-C：状态管理架构审查

```
你是一位资深的 React 状态管理专家，负责审查 YYC3 项目的状态管理架构。

## 审查维度

### 1. 全局状态（Zustand）

检查所有 Zustand Store：
- 每个 Store 是否职责单一
- Store 之间是否有数据冗余
- 是否有不必要的全局状态（应该用局部状态的）
- Store 的 TypeScript 类型是否完整

### 2. Context 状态

检查 src/app/components/context/ 下所有 Context：
- 是否存在 Context 嵌套过深（> 3 层）
- 是否存在不必要的 re-render
- Context 的 value 是否使用 useMemo 优化

### 3. 局部状态

抽样检查组件内部：
- useState 是否有可以合并的状态
- useEffect 是否有可以作为派生状态的计算
- 是否有 prop drilling 超过 3 层

### 4. 服务端状态

- API 数据是否需要缓存策略
- 是否需要 SWR / React Query
- 数据获取是否在组件挂载时进行

## 执行步骤

1. `grep -r "create(" src/ --include="*.ts" --include="*.tsx" | grep zustand` 找到所有 Store
2. `grep -r "createContext" src/ --include="*.tsx"` 找到所有 Context
3. 逐个分析状态管理方案是否合理
4. 检查数据流是否单向、可追踪

## 验收标准

✅ 全局状态数量合理（建议 ≤ 10 个 Store）
✅ 每个 Store 职责单一
✅ Context 嵌套 ≤ 3 层
✅ 无 prop drilling 超过 3 层
✅ 状态更新链路可追踪
```

---

## 📝 提示词 1-D：构建配置审查

```
你是一位资深的前端工程化专家，负责审查 YYC3 项目的构建配置。

## 审查清单

### 1. Vite 配置（vite.config.ts）
- 插件配置是否正确
- 路径别名是否配置
- 构建优化选项（代码分割、Tree Shaking）
- 开发服务器配置

### 2. TypeScript 配置（tsconfig.json）
- strict 模式是否开启
- target 是否合理（ES2020）
- moduleResolution 是否正确（bundler）
- 路径映射是否配置

### 3. Vitest 配置（vitest.config.ts）
- 测试环境是否正确（jsdom）
- 覆盖率配置是否合理
- 排除项是否完整
- 阈值设置是否合理

### 4. Biome 配置
- 规则是否完整
- 格式化规则是否统一
- 是否有忽略项需要调整

## 验收标准

✅ Vite 构建成功无警告
✅ TypeScript strict 模式开启
✅ Vitest 覆盖率阈值合理
✅ Biome 检查通过无错误
✅ 所有配置文件有注释说明
```

---

## 📋 验收报告模板

```markdown
# YYC3 架构验收报告

## 一、报告概述

| 项目 | 内容 |
|------|------|
| 项目名称 | YYC³ AI 营销智能中枢 |
| 验收阶段 | 阶段1 - 架构验收 |
| 验收日期 | {YYYY-MM-DD} |
| 验收版本 | v1.0.2 |
| 验收人 | {姓名/角色} |

## 二、架构评分

| 维度 | 评分(1-10) | 说明 |
|------|------------|------|
| 目录结构合规性 | {N} | {说明} |
| 分层架构清晰度 | {N} | {说明} |
| 依赖版本合规性 | {N} | {说明} |
| 状态管理合理性 | {N} | {说明} |
| 构建配置完整性 | {N} | {说明} |
| **综合评分** | **{N}** | - |

## 三、依赖审查结果

| 类别 | 总数 | 合规 | 需更新 | 需移除 | 安全风险 |
|------|------|------|--------|--------|----------|
| dependencies | {N} | {N} | {N} | {N} | {N} |
| devDependencies | {N} | {N} | {N} | {N} | {N} |

## 四、架构问题清单

| 编号 | 问题描述 | 严重程度 | 影响范围 | 建议方案 | 状态 |
|------|----------|----------|----------|----------|------|
| A001 | {描述} | 高/中/低 | {范围} | {方案} | 待处理 |

## 五、验收结论

- [ ] ✅ 通过：架构合理，可进入编码阶段
- [ ] ⚠️ 有条件通过：需修复高优先级问题后进入
- [ ] ❌ 不通过：架构存在重大缺陷，需重新设计
```

---

## 🎯 阶段1验收检查清单

```
阶段1 - 架构验收检查清单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 1.1 目录结构符合分层架构规范
□ 1.2 文件命名 100% 符合 kebab-case 规范
□ 1.3 模块职责清晰无越界
□ 1.4 核心依赖版本合规
□ 1.5 无高危安全漏洞
□ 1.6 无未使用依赖
□ 1.7 Zustand Store 职责单一
□ 1.8 Context 嵌套 ≤ 3 层
□ 1.9 Vite 构建成功无警告
□ 1.10 TypeScript strict 模式开启
□ 1.11 Vitest 配置正确
□ 1.12 架构验收报告已生成

全部通过 → 进入 阶段2：编码验收
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

<div align="center">

> 「***YanYuCloudCube***」言启象限 | 语枢未来
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**

</div>
