---
file: YYC3-阶段4-部署验收-提示词系统.md
description: YYC³ 阶段4 部署验收提示词 — 构建流程、部署配置、预发布验证、性能基线
author: YanYuCloudCube Team <admin@0379.email>
version: v1.1.0
created: 2026-05-24
updated: 2026-05-24
status: stable
tags: [验收],[部署],[提示词],[阶段4]
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
| 阶段编号 | YYC3-VA-4 |
| 阶段名称 | 部署验收 |
| 适用范围 | 构建流程、打包产物、部署配置、环境管理 |
| 前置条件 | 阶段3 测试验收通过 |
| 输出产物 | 部署验收报告 |
| 验收角色 | DevOps 工程师 / 运维负责人 |

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

## 📝 提示词 4-A：构建流程验收

```
你是一位资深的前端工程化专家，负责验证 YYC3 项目的构建流程。

## 构建工具链

- 构建工具：Vite 6.3
- TypeScript：5.3
- 包管理器：pnpm 8+

## 验收步骤

### 1. 完整构建验证

```bash
pnpm build
# 等效于 tsc -b && vite build
```

检查项：
- TypeScript 编译是否成功
- Vite 构建是否成功
- 是否有构建警告
- 构建耗时是否合理（建议 ≤ 60s）

### 2. 构建产物分析

```bash
# 检查产物目录
ls -la dist/
# 检查产物大小
du -sh dist/
du -sh dist/assets/
```

检查项：
- dist/ 目录结构是否正确
- HTML 入口文件是否存在
- JS/CSS 产物是否生成
- 静态资源是否正确复制
- Source Map 是否生成

### 3. 产物大小分析

| 产物类型 | 建议大小 | 说明 |
|----------|----------|------|
| HTML | < 10KB | 入口文件 |
| JS（初始加载） | < 300KB | gzip 前 |
| JS（总大小） | < 1MB | gzip 前 |
| CSS | < 100KB | gzip 前 |
| 图片/字体 | < 500KB | 静态资源 |

### 4. 代码分割验证

检查 Vite 是否正确进行代码分割：
- node_modules 是否拆分为 vendor chunk
- 是否按路由进行懒加载
- 是否有动态 import 的代码分割

### 5. Tree Shaking 验证

检查是否有未使用的代码被打入产物：
- 未使用的组件
- 未使用的工具函数
- 未使用的第三方库功能

## 验收标准

✅ pnpm build 构建成功无错误
✅ 构建警告 ≤ 5 条
✅ 产物结构正确
✅ JS 初始加载 < 300KB
✅ CSS < 100KB
✅ 代码分割生效
✅ Tree Shaking 生效
```

---

## 📝 提示词 4-B：部署配置验收

```
你是一位资深的 DevOps 工程师，负责审查 YYC3 项目的部署配置。

## 审查维度

### 1. 环境变量管理

检查是否有 .env 文件配置：
```
.env                    # 所有环境共享
.env.local              # 本地开发（不提交）
.env.development        # 开发环境
.env.production         # 生产环境
.env.staging            # 预发布环境
```

检查项：
- 敏感信息是否使用环境变量（非硬编码）
- .env.local 是否在 .gitignore 中
- 环境变量是否有文档说明
- VITE_ 前缀的变量是否正确使用

### 2. Web 服务器配置

如果部署为静态站点，检查：
- SPA 路由回退（所有路由 → index.html）
- 缓存策略（静态资源长期缓存，HTML 短缓存）
- Gzip/Brotli 压缩
- HTTPS 重定向
- 安全头部（X-Frame-Options, CSP 等）

### 3. Docker 配置（如适用）

检查 Dockerfile：
- 基础镜像选择（nginx:alpine）
- 多阶段构建（build → serve）
- 端口暴露规范（按端口分配规则）
- 健康检查配置

### 4. CI/CD 配置

检查是否有持续集成配置：
- GitHub Actions / GitLab CI
- 构建流水线（lint → typecheck → test → build → deploy）
- 环境隔离（dev/staging/prod）
- 自动化部署触发条件

### 5. 端口分配规范

按 YYC3 端口分配规则检查：
| 服务类型 | 端口范围 | 实例 |
|----------|----------|------|
| 前端 | 20000-24999 | dev: 3171（已有） |
| 后端 | 25000-29999 | - |
| 中间件 | 30000-34999 | - |
| 容器 | 35000-39999 | - |
| AI 服务 | 40000-44999 | - |
| 运维 | 45000-49150 | - |

格式：XXYYZ（XX=大类编码, YY=模块号, Z=实例偏移）

## 验收标准

✅ 环境变量管理规范
✅ 部署配置完整
✅ 缓存策略合理
✅ 安全头部配置
✅ CI/CD 流水线配置
✅ 端口分配合规
```

---

## 📝 提示词 4-C：预发布验证

```
你是一位资深的 QA 工程师，负责对 YYC3 项目进行预发布验证。

## 验证步骤

### 1. 本地预览验证

```bash
pnpm preview
# 使用 vite preview 在本地预览构建产物
```

验证项：
- [ ] 页面可正常访问
- [ ] 路由切换正常
- [ ] 静态资源加载正常
- [ ] API 请求正常（如有后端）
- [ ] 主题切换正常

### 2. 多浏览器验证

在以下浏览器中验证：
- [ ] Chrome ≥ 90
- [ ] Edge ≥ 90
- [ ] Firefox ≥ 88
- [ ] Safari ≥ 14

### 3. 性能基线验证

使用 Lighthouse 进行性能评估：

| 指标 | 目标 | 说明 |
|------|------|------|
| Performance | ≥ 90 | 性能评分 |
| Accessibility | ≥ 90 | 无障碍评分 |
| Best Practices | ≥ 90 | 最佳实践评分 |
| SEO | ≥ 80 | SEO 评分 |
| LCP | ≤ 2.5s | 最大内容绘制 |
| FID | ≤ 100ms | 首次输入延迟 |
| CLS | ≤ 0.1 | 累积布局偏移 |

### 4. 安全验证

- [ ] 无 XSS 漏洞
- [ ] 无 CSRF 漏洞
- [ ] 无敏感信息泄露
- [ ] CSP 头部正确
- [ ] 依赖无高危漏洞（pnpm audit）

## 验收标准

✅ 本地预览正常
✅ 多浏览器兼容
✅ Lighthouse Performance ≥ 90
✅ Lighthouse Accessibility ≥ 90
✅ 无安全漏洞
```

---

## 📋 验收报告模板

```markdown
# YYC3 部署验收报告

## 一、报告概述

| 项目 | 内容 |
|------|------|
| 项目名称 | YYC³ AI 营销智能中枢 |
| 验收阶段 | 阶段4 - 部署验收 |
| 验收日期 | {YYYY-MM-DD} |
| 验收版本 | v1.0.2 |
| 验收人 | {姓名/角色} |

## 二、构建结果

| 指标 | 值 |
|------|------|
| 构建状态 | ✅ 成功 / ❌ 失败 |
| 构建耗时 | {N}s |
| 构建警告 | {N} 条 |
| 产物总大小 | {N}MB |
| JS 大小 | {N}KB |
| CSS 大小 | {N}KB |

## 三、性能基线

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| Performance | ≥ 90 | {N} | ✅/❌ |
| Accessibility | ≥ 90 | {N} | ✅/❌ |
| Best Practices | ≥ 90 | {N} | ✅/❌ |
| LCP | ≤ 2.5s | {N}s | ✅/❌ |
| FID | ≤ 100ms | {N}ms | ✅/❌ |
| CLS | ≤ 0.1 | {N} | ✅/❌ |

## 四、兼容性验证

| 浏览器 | 版本 | 状态 | 备注 |
|--------|------|------|------|
| Chrome | ≥ 90 | ✅ | - |
| Edge | ≥ 90 | ✅ | - |
| Firefox | ≥ 88 | ✅ | - |
| Safari | ≥ 14 | ✅ | - |

## 五、验收结论

- [ ] ✅ 通过：构建和部署配置完善，可上线
- [ ] ⚠️ 有条件通过：需优化后上线
- [ ] ❌ 不通过：构建或配置存在重大问题
```

---

## 🎯 阶段4验收检查清单

```
阶段4 - 部署验收检查清单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 4.1 pnpm build 构建成功
□ 4.2 构建警告 ≤ 5 条
□ 4.3 JS 初始加载 < 300KB
□ 4.4 代码分割生效
□ 4.5 环境变量管理规范
□ 4.6 缓存策略配置
□ 4.7 安全头部配置
□ 4.8 Lighthouse Performance ≥ 90
□ 4.9 多浏览器兼容验证通过
□ 4.10 无安全漏洞
□ 4.11 部署验收报告已生成

全部通过 → 进入 阶段5：运维验收
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

<div align="center">

> 「***YanYuCloudCube***」言启象限 | 语枢未来
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**

</div>
