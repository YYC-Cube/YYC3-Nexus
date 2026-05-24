# Biome 团队培训指南

## 📚 目录

1. [Biome 简介](#biome-简介)
2. [安装与配置](#安装与配置)
3. [常用命令](#常用命令)
4. [VS Code 集成](#vs-code-集成)
5. [规则说明](#规则说明)
6. [常见问题](#常见问题)
7. [最佳实践](#最佳实践)

---

## Biome 简介

### 什么是 Biome？

**Biome** 是一个高性能的代码工具链，用于 **Lint（代码检查）** 和 **Format（代码格式化）**。

### 为什么从 ESLint + Prettier 迁移到 Biome？

| 特性 | ESLint + Prettier | Biome |
|------|-------------------|-------|
| **速度** | ~5-8s | **~130ms (快 40-60 倍)** |
| **依赖数量** | 11 个包 | **1 个包** |
| **配置复杂度** | 2+ 配置文件 | **1 个配置文件** |
| **功能** | Lint + Format 分离 | **统一工具链** |
| **语言支持** | 主要 JavaScript/TypeScript | **TS/JS/JSON/CSS/GraphQL** |

---

## 安装与配置

### 项目已完成的配置

✅ `package.json` - 已添加 `@biomejs/biome` 依赖
✅ `biome.json` - 主配置文件
✅ `.biomeignore` - 忽略规则文件
✅ `package.json scripts` - 已更新命令
✅ `lint-staged` - Pre-commit hooks 已配置

### 配置文件位置

```
project-root/
├── biome.json              # 主配置（规则、格式化选项）
├── .biomeignore            # 忽略文件/目录
├── package.json            # scripts + lint-staged
└── .vscode/settings.json   # 编辑器配置
```

---

## 常用命令

### 日常开发

```bash
# 🔍 检查代码质量（不修改）
pnpm lint
# 等同于: pnpm biome check .

# 🔧 自动修复可修复的问题
pnpm lint:fix
# 等同于: pnpm biome check --write .

# 🎨 格式化所有文件
pnpm format
# 等同于: pnpm biome format --write .

# ✅ 完整检查流程
pnpm typecheck    # TypeScript 类型检查
pnpm test         # 运行测试
pnpm lint         # Biome 检查
```

### 仅检查特定文件

```bash
# 检查单个文件
pnpm biome check src/app/App.tsx

# 检查目录
pnpm biome check src/app/components/core/

# 检查多个文件
pnpm biome check src/app/App.tsx src/app/components/
```

### CI/CD 环境

```bash
# 严格模式（warnings 也视为错误）
pnpm biome check . --error-on-warnings

# 应用所有修复（包括 unsafe）
pnpm biome check --write --unsafe .
```

---

## VS Code 集成

### 步骤 1: 安装扩展

1. 打开 VS Code
2. 按 `Cmd + Shift + X` 打开扩展面板
3. 搜索 `@biomejs/biome`
4. 点击 **Install**

或通过命令行：
```bash
code --install-extension biomejs.biome
```

### 步骤 2: 验证配置

项目已在 `.vscode/settings.json` 中预配置：

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

### 步骤 3: 重启 VS Code

按 `Cmd + Shift + P` → 输入 `Developer: Reload Window`

### 功能验证

1. 打开任意 `.ts` 或 `.tsx` 文件
2. 故意写一段格式错误的代码（如多余空格）
3. 保存文件 (`Cmd + S`)
4. 观察代码是否自动格式化 ✅

---

## 规则说明

### 错误级别

#### 🔴 Error（必须修复）

这些错误会：
- 在编辑器中显示红色波浪线
- 导致 `pnpm lint` 失败
- 阻塞 CI/CD 流程

**当前 Error 规则：**

| 规则 | 说明 | 示例 |
|------|------|------|
| `noUnusedVariables` | 未使用的变量 | `const x = 1;` (未使用) |
| `useConst` | 应使用 const | `let x = 1;` (x 未被重新赋值) |
| `noDebugger` | 禁止 debugger | `debugger;` |
| `noDoubleEquals` | 禁止 == | `if (x == 1)` |
| `noDangerouslySetInnerHTML` | XSS 风险 | `dangerouslySetInnerHTML={{...}}` |

#### 🟡 Warning（建议修复）

这些警告会：
- 在编辑器中显示黄色波浪线
- 显示在终端输出中
- **不会**阻塞构建或 CI

**当前 Warning 规则（主要类别）：**

**a11y（无障碍性）**
- `useButtonType`: 按钮缺少 type 属性
- `useAltText`: 图片缺少 alt 文本
- `noStaticElementInteractions`: 静态元素有交互事件
- `noLabelWithoutControl`: label 没有关联控件

**suspicious（可疑代码）**
- `noExplicitAny`: 使用了 any 类型
- `noArrayIndexKey`: 使用数组索引作为 key
- `useIterableCallbackReturn`: forEach 中返回值

**style（代码风格）**
- `noNonNullAssertion`: 非空断言 `!`

### 如何处理 Warnings？

**选项 1: 忽略特定行（不推荐频繁使用）**

```typescript
// biome-ignore lint/suspicious/noExplicitAny: <原因>
const data: any = fetchData();
```

**选项 2: 修复问题（推荐）**

```typescript
// ❌ Before
const handleClick = (e: any) => { ... }

// ✅ After
const handleClick = (e: React.MouseEvent) => { ... }
```

**选项 3: 调整规则级别（需团队讨论）**

在 `biome.json` 中修改：

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"  // 关闭规则
      }
    }
  }
}
```

---

## 常见问题

### Q1: 为什么我的代码保存后没有自动格式化？

**A:** 检查以下项：

1. ✅ 已安装 Biome 扩展？
2. ✅ VS Code 已重启？
3. ✅ 文件类型是否在配置中？（.ts, .tsx, .js, .jsx, .json, .css）
4. ✅ `"editor.formatOnSave": true` 是否设置？

### Q2: 如何临时禁用某个文件的检查？

**A:** 在文件顶部添加：

```typescript
// biome-ignore-file
// 此文件将跳过 Biome 检查
```

### Q3: 如何只运行 Lint 不运行 Format？

**A:** 

```bash
# 仅 Lint
pnpm biome lint .

# 仅 Format
pnpm biome format .
```

### Q4: Biome 和 ESLint 可以共存吗？

**A:** 不建议。我们已经完全移除了 ESLint。如果需要对比，可以暂时保留，但最终应该只使用一个。

### Q5: 为什么有些 warnings 不能自动修复？

**A:** 某些问题需要人工判断：

- `noArrayIndexKey`: 需要提供唯一的 key 值
- `a11y/*`: 需要添加语义化的 HTML 属性
- `noExplicitAny`: 需要定义正确的 TypeScript 类型

---

## 最佳实践

### ✅ 推荐做法

1. **保存时自动修复**
   - 启用 `editor.formatOnSave`
   - 启用 `codeActionsOnSave`

2. **提交前完整检查**
   ```bash
   pnpm test && pnpm typecheck && pnpm lint
   ```

3. **逐步修复 warnings**
   - 不要试图一次性修复所有 770 个 warnings
   - 优先修复正在编辑的文件
   - 每次提交时修复相关文件的 warnings

4. **团队协作**
   - 统一使用 Biome 配置（不要本地修改 `biome.json`）
   - PR Review 时关注新增的 warnings
   - 定期（如每周）清理 warnings

5. **CI/CD 失败处理**
   - 如果因为 Biome error 失败，运行 `pnpm lint:fix`
   - 如果仍有 error，手动查看并修复
   - 不要随意降低规则级别

### ❌ 避免的做法

1. **不要** 在 `biomeignore` 中忽略源代码文件
2. **不要** 频繁使用 `// biome-ignore` 注释
3. **不要** 修改团队的 `biome.json` 配置（除非讨论通过）
4. **不要** 提交有 error 的代码

---

## 学习资源

### 官方文档

- 📖 Biome 官方网站: https://biomejs.dev/
- 📘 配置参考: https://biomejs.dev/reference/configuration/
- 📝 规则列表: https://biomejs.dev/linter/rules/

### IDE 支持

- VS Code: `biomejs.biome`
- JetBrains: 内置支持（2023.3+）
- Vim/Neovim: `biomejs/biome`

### 工具

- **在线尝试**: https://biomejs.dev/playground
- **迁移指南**: https://biomejs.dev/guides/migrate-from-eslint-prettier/

---

## 快速参考卡

```bash
# 🚀 日常开发
pnpm dev                    # 启动开发服务器
pnpm test                   # 运行测试
pnpm lint                   # 检查代码
pnpm lint:fix               # 自动修复

🔧 问题排查
pnpm biome check <file>     # 检查特定文件
pnpm biome check --verbose . # 详细输出

📊 统计信息
pnpm biome check . 2>&1 | grep "Found"  # 查看 errors/warnings 数量
```

---

## 联系方式

如有问题，请：
1. 查看本文档的常见问题部分
2. 查阅官方文档
3. 在团队频道提问

---

**最后更新**: 2026-05-24  
**版本**: Biome 2.4.15  
**维护者**: YYC³ Team
