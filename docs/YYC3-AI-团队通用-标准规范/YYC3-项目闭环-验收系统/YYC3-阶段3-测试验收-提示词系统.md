---
file: YYC3-阶段3-测试验收-提示词系统.md
description: YYC³ 阶段3 测试验收提示词 — 单元测试、组件测试、E2E测试、覆盖率分析
author: YanYuCloudCube Team <admin@0379.email>
version: v1.1.0
created: 2026-05-24
updated: 2026-05-24
status: stable
tags: [验收],[测试],[提示词],[阶段3]
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
| 阶段编号 | YYC3-VA-3 |
| 阶段名称 | 测试验收 |
| 适用范围 | 单元测试、组件测试、集成测试、E2E测试、覆盖率分析 |
| 前置条件 | 阶段2 编码验收通过 |
| 输出产物 | 测试验收报告 |
| 验收角色 | 测试工程师 / QA 负责人 |

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

## 📝 提示词 3-A：单元测试质量审查

```
你是一位资深的测试工程师，负责审查 YYC3 项目的单元测试质量。

## 测试框架

- 运行器：Vitest 3.2
- 组件测试：@testing-library/react 16 + @testing-library/user-event 14
- DOM 断言：@testing-library/jest-dom 6
- 环境：jsdom 25
- 覆盖率：@vitest/coverage-v8

## 审查维度

### 1. 测试执行结果

```bash
pnpm test
# 等效于 vitest run
```

关注指标：
- 总测试数
- 通过数 / 失败数 / 跳过数
- 测试执行时间
- 快照数量

### 2. 覆盖率分析

```bash
pnpm test:coverage
# vitest run --coverage
```

覆盖率阈值（vitest.config.ts 中定义）：
| 类型 | 阈值 | 说明 |
|------|------|------|
| lines | 10% | 代码行覆盖率 |
| branches | 55% | 分支覆盖率 |
| functions | 55% | 函数覆盖率 |
| statements | 10% | 语句覆盖率 |

对每个未达标模块分析原因并制定提升计划。

### 3. 测试质量检查

对每个测试文件检查：

#### 3.1 测试命名
- 描述是否清晰（中文或英文均可，但需统一）
- 是否覆盖 正常/异常/边界 三种场景
- 是否使用 describe/it 结构化组织

#### 3.2 测试独立性
- 每个测试是否可独立运行
- 是否有测试间共享状态
- 是否正确使用 beforeEach/afterEach 清理

#### 3.3 断言质量
- 每个测试是否有明确的断言
- 断言是否具体（避免模糊的 toBeTruthy）
- 是否测试了关键行为而非实现细节

#### 3.4 Mock 使用
- vi.mock 路径是否正确
- Mock 数据是否合理
- 是否在测试后恢复 Mock

#### 3.5 异步测试
- 是否正确使用 waitFor
- 是否处理了异步错误
- 是否有超时保护

### 4. 导入路径检查

测试文件中的导入路径必须与源码结构匹配：
- tests/components/ui/ → ../../../src/app/components/ui/
- tests/components/pages/ → ../../../src/app/components/pages/
- tests/components/panels/ → ../../../src/app/components/panels/
- tests/components/ → ../../src/app/components/

## 输出格式

| 测试文件 | 测试数 | 通过 | 失败 | 跳过 | 耗时 | 问题 |
|----------|--------|------|------|------|------|------|
| ui/button.test.tsx | 41 | 41 | 0 | 0 | 426ms | 无 |
| ui/dialog.test.tsx | 26 | 26 | 0 | 0 | 4086ms | 超时风险 |

## 验收标准

✅ pnpm test 全部通过（0 失败）
✅ 行覆盖率 ≥ 阈值
✅ 分支覆盖率 ≥ 55%
✅ 函数覆盖率 ≥ 55%
✅ 无跳过的测试（除非有注释说明）
✅ 所有测试文件导入路径正确
✅ 无超时测试（单测试 ≤ 5s）
```

---

## 📝 提示词 3-B：组件测试完整性审查

```
你是一位资深的 React 组件测试专家，负责审查组件测试的完整性。

## 审查框架

### 1. UI 原子组件测试覆盖

对每个 UI 组件验证以下测试类别：

| 测试类别 | 必须覆盖 | 说明 |
|----------|----------|------|
| 基础渲染 | ✅ | 组件能正确渲染到 DOM |
| Props 传递 | ✅ | 各种 props 正确应用 |
| 交互事件 | ✅ | 点击/输入/拖拽等用户交互 |
| 状态变化 | ✅ | 加载/禁用/选中/展开等状态 |
| 样式类名 | ✅ | data-slot 和 className 正确 |
| 无障碍 | ✅ | ARIA 属性和键盘操作 |
| 快照 | 推荐 | toMatchSnapshot 捕获结构 |
| 边界情况 | 推荐 | 空值/超长/特殊字符 |

### 2. Radix UI 组件特殊处理

对于使用 Radix UI 的组件（Dialog, DropdownMenu, Popover 等）：
- 必须使用 waitFor 等待 Portal 渲染
- 必须从 @testing-library/react 导入 waitFor（非 vitest）
- 使用 fireEvent.pointerDown 触发关闭行为
- 使用 fireEvent.click 替代 userEvent（避免 pointer-events 问题）
- CheckboxItem 等有状态组件需要 onSelect preventDefault

### 3. 测试用例模板

标准组件测试结构：
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from 'path/to/component';

describe('Component Name', () => {
  describe('Rendering', () => {
    it('should render with default props', () => { ... });
    it('should apply data-slot attribute', () => { ... });
  });

  describe('Interactions', () => {
    it('should handle click', async () => { ... });
  });

  describe('States', () => {
    it('should handle disabled state', () => { ... });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => { ... });
  });

  describe('Snapshots', () => {
    it('should match snapshot', () => { ... });
  });
});
```

## 执行步骤

1. 列出 src/app/components/ui/ 下所有组件
2. 检查 tests/components/ui/ 下是否有对应测试文件
3. 逐个检查测试类别覆盖情况
4. 标记未覆盖的测试类别
5. 生成测试覆盖矩阵

## 输出格式

| 组件 | 渲染 | Props | 交互 | 状态 | 样式 | a11y | 快照 | 边界 | 覆盖率 |
|------|------|-------|------|------|------|------|------|------|--------|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 100% |
| Dialog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | 87% |

## 验收标准

✅ 所有 UI 组件有对应测试文件
✅ 每个组件覆盖 渲染/Props/交互/状态/a11y 五大类别
✅ Radix UI 组件使用正确的异步测试模式
✅ 测试矩阵覆盖率 ≥ 85%
```

---

## 📝 提示词 3-C：E2E 测试审查

```
你是一位资深的 E2E 测试工程师，负责审查 YYC3 项目的端到端测试。

## 测试框架

- Playwright 1.60
- 配置：tests/playwright.config.ts
- 测试目录：tests/e2e/

## 审查范围

### 1. 关键用户流程覆盖

检查以下流程是否有 E2E 测试：
- [ ] 应用启动和首屏加载
- [ ] 主题切换（Cyberpunk ↔ Liquid Glass）
- [ ] AI 对话流程（选择模型 → 输入消息 → 接收回复）
- [ ] 布局管理（面板拖拽/分割/合并）
- [ ] 设置修改和持久化
- [ ] 文件系统操作

### 2. 跨页面流程

- [ ] 从首页导航到各功能页面
- [ ] 页面间数据传递
- [ ] 浏览器前进/后退

### 3. Playwright 配置审查

检查 playwright.config.ts：
- 浏览器配置（Chrome/Firefox/WebKit）
- 超时设置
- 截图/视频录制配置
- Base URL 配置

## 执行步骤

```bash
pnpm test:e2e
# playwright test
```

## 验收标准

✅ Playwright 配置正确
✅ 关键用户流程有 E2E 测试
✅ 所有 E2E 测试通过
✅ 测试报告可查看（pnpm test:e2e:report）
```

---

## 📋 验收报告模板

```markdown
# YYC3 测试验收报告

## 一、报告概述

| 项目 | 内容 |
|------|------|
| 项目名称 | YYC³ AI 营销智能中枢 |
| 验收阶段 | 阶段3 - 测试验收 |
| 验收日期 | {YYYY-MM-DD} |
| 验收版本 | v1.0.2 |
| 验收人 | {姓名/角色} |

## 二、测试执行总览

| 指标 | 值 |
|------|------|
| 测试文件数 | {N}（通过 {N} / 失败 {N}） |
| 测试用例数 | {N}（通过 {N} / 失败 {N} / 跳过 {N}） |
| 执行总耗时 | {N}s |
| 快照数量 | {N} |

## 三、覆盖率报告

| 类型 | 阈值 | 实际值 | 状态 |
|------|------|--------|------|
| Lines | 10% | {N}% | ✅/❌ |
| Branches | 55% | {N}% | ✅/❌ |
| Functions | 55% | {N}% | ✅/❌ |
| Statements | 10% | {N}% | ✅/❌ |

## 四、组件测试矩阵

| 组件 | 渲染 | Props | 交互 | 状态 | 样式 | a11y | 快照 | 综合 |
|------|------|-------|------|------|------|------|------|------|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dialog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

## 五、问题清单

| 编号 | 测试文件 | 问题 | 原因 | 修复方案 | 状态 |
|------|----------|------|------|----------|------|
| T001 | {file} | {问题} | {原因} | {方案} | 已修复 |

## 六、验收结论

- [ ] ✅ 通过：所有测试通过，覆盖率达标
- [ ] ⚠️ 有条件通过：测试通过但覆盖率需提升
- [ ] ❌ 不通过：存在测试失败
```

---

## 🎯 阶段3验收检查清单

```
阶段3 - 测试验收检查清单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 3.1 pnpm test 全部通过（0 失败）
□ 3.2 覆盖率达标（lines ≥ 10%, branches ≥ 55%, functions ≥ 55%）
□ 3.3 所有 UI 组件有测试文件
□ 3.4 每个组件覆盖渲染/Props/交互/状态/a11y
□ 3.5 Radix UI 组件使用正确异步模式
□ 3.6 无跳过的测试（除非有注释）
□ 3.7 无超时测试（单测试 ≤ 5s）
□ 3.8 测试导入路径全部正确
□ 3.9 E2E 关键流程有覆盖
□ 3.10 测试验收报告已生成

全部通过 → 进入 阶段4：部署验收
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

<div align="center">

> 「***YanYuCloudCube***」言启象限 | 语枢未来
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**

</div>
