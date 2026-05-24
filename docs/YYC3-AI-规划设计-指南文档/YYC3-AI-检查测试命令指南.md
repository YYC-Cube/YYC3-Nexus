---
file: YYC3-My-Management-全局检查测试命令指导.md
description: YYC³ My-Management 项目全局检查与测试命令速查手册
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-05-03
updated: 2026-05-03
status: stable
tags: [quality-assurance],[testing],[ci-cd],[commands]
category: reference
language: zh-CN
audience: developers,qa-engineers
complexity: intermediate
---

# YYC³ My-Management — 全局检查与测试命令指导

## 1. 语法与类型检查

### 1.1 TypeScript 编译检查

```bash
# 全量类型检查（零错误标准）
npx tsc --noEmit

# 仅统计错误数量
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l

# 按文件分类查看错误
npx tsc --noEmit 2>&1 | grep "error TS" | cut -d'(' -f1 | sort | uniq -c | sort -rn
```

**验收标准**: `0 errors`

### 1.2 ESLint 代码规范检查

```bash
# 全量 lint（src/app 目录）
npx eslint src/app --ext .ts,.tsx

# 无缓存运行（确保最新结果）
npx eslint src/app --ext .ts,.tsx --no-cache

# 仅统计问题数量
npx eslint src/app --ext .ts,.tsx --no-cache 2>&1 | grep "problems"

# 分类统计（按规则）
npx eslint src/app --ext .ts,.tsx -f json --no-cache 2>/dev/null | \
  python3 -c "
import json,sys
from collections import Counter
data = json.load(sys.stdin)
rules = Counter()
for f in data:
    for m in f.get('messages',[]):
        rules[m.get('ruleId','unknown')] += 1
for rule, count in rules.most_common():
    print(f'{count:3d}  {rule}')
"

# 仅检查 no-unused-vars
npx eslint src/app --ext .ts,.tsx --no-cache 2>&1 | grep "no-unused-vars" | wc -l

# 仅检查 no-explicit-any
npx eslint src/app --ext .ts,.tsx --no-cache 2>&1 | grep "no-explicit-any" | wc -l

# 检查单个文件
npx eslint src/app/components/task-board-page.tsx --no-cache
```

**验收标准**: `0 errors, ≤ 60 warnings`（当前 58 个 `no-explicit-any`）

---

## 2. 单元测试

### 2.1 Vitest 全量测试

```bash
# 运行全部测试
npx vitest run

# 带详细输出
npx vitest run --reporter=verbose

# 仅统计结果
npx vitest run 2>&1 | grep -E "(Test Files|Tests)"

# 运行单个测试文件
npx vitest run tests/stores/task-store.test.ts

# 运行匹配模式的测试
npx vitest run --grep "dashboard"

# 监听模式（开发时使用）
npx vitest
```

**验收标准**: `17 test files, 376 tests, 100% pass rate`

### 2.2 测试覆盖率

```bash
# 生成覆盖率报告（v8 provider）
npx vitest run --coverage

# 覆盖率报告输出目录
# → coverage/index.html（浏览器打开查看详情）
```

**验收标准**: `statements ≥ 73%, core modules ≥ 90%`

---

## 3. E2E 测试（Playwright）

### 3.1 运行 E2E 测试

```bash
# 运行全部 E2E 测试
npx playwright test

# 运行指定测试文件
npx playwright test tests/e2e/app-navigation.spec.ts

# 带详细输出
npx playwright test --reporter=line

# 带浏览器界面（调试用）
npx playwright test --headed

# 仅运行 chromium
npx playwright test --project=chromium
```

**前提条件**: Dev server 必须在 `localhost:3171` 运行

```bash
# 启动开发服务器（另一个终端）
pnpm dev
```

**验收标准**: `app-navigation: 8/8 pass`

### 3.2 Playwright 安装与更新

```bash
# 首次安装浏览器
npx playwright install chromium

# 更新浏览器
npx playwright install --force chromium
```

---

## 4. 构建验证

### 4.1 生产构建

```bash
# 标准生产构建
npx vite build

# 验证构建输出
npx vite build 2>&1 | grep "✓ built"

# 检查构建产物中是否有 console 残留
grep -rl "console\.\(log\|warn\)" dist/assets/*.js 2>/dev/null | head -5

# 检查构建产物大小
ls -lh dist/assets/ | grep "vendor-react"
du -sh dist/
```

**验收标准**: `✓ built in < 5s, 0 console.log in runtime code`

### 4.2 开发服务器

```bash
# 启动开发服务器
pnpm dev

# 验证启动速度
pnpm dev 2>&1 | grep "ready in"
```

**验收标准**: `ready in < 500ms`

---

## 5. 一键全量验证

### 5.1 综合检查脚本

```bash
# 一次性运行所有检查
cd /Volumes/Knowledge/My-mgmt && \
echo "=== 1. TypeScript ===" && \
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l && \
echo "=== 2. ESLint ===" && \
npx eslint src/app --ext .ts,.tsx --no-cache 2>&1 | grep "problems" && \
echo "=== 3. Unit Tests ===" && \
npx vitest run 2>&1 | grep -E "(Test Files|Tests)" && \
echo "=== 4. Build ===" && \
npx vite build 2>&1 | grep "✓ built"
```

### 5.2 预期输出

```
=== 1. TypeScript ===
       0
=== 2. ESLint ===
✖ 58 problems (0 errors, 58 warnings)
=== 3. Unit Tests ===
 Test Files  17 passed (17)
      Tests  376 passed (376)
=== 4. Build ===
✓ built in 2.27s
```

---

## 6. 按阶段验证命令

### 第一阶段：代码语法类验证

| 检查项 | 命令 | 验收标准 |
|--------|------|----------|
| TypeScript 编译 | `npx tsc --noEmit` | 0 errors |
| ESLint 规则 | `npx eslint src/app --ext .ts,.tsx --no-cache` | 0 errors |
| 未使用变量 | `npx eslint src/app --ext .ts,.tsx --no-cache 2>&1 \| grep "no-unused-vars" \| wc -l` | 0 |
| console 残留 | `grep -rn "console\.log" src/app/components/*.tsx \| wc -l` | ≤ 1（模板字符串内） |

### 第二阶段：功能完整逻辑类验证

| 检查项 | 命令 | 验收标准 |
|--------|------|----------|
| 全量单元测试 | `npx vitest run` | 376/376 pass |
| 覆盖率报告 | `npx vitest run --coverage` | statements ≥ 73% |
| E2E 核心流程 | `npx playwright test tests/e2e/app-navigation.spec.ts` | 8/8 pass |

### 第三阶段：部署验证

| 检查项 | 命令 | 验收标准 |
|--------|------|----------|
| 生产构建 | `npx vite build` | ✓ built < 5s |
| 构建产物检查 | `ls -la dist/` | manifest + assets 存在 |
| console 清除 | `grep -c "console\.log" dist/assets/*.js \| grep -v ":0$"` | 仅模板字符串残留 |
| chunk 分析 | `ls -lh dist/assets/ \| grep vendor` | vendor-react < 700KB |

---

## 7. 常用修复命令

### 7.1 未使用变量修复

```bash
# ESLint unused-vars 规则要求未使用变量/参数以 _ 开头
# 修复示例（解构赋值）：
# const { settings } = useStore()  →  const { settings: _settings } = useStore()
# 修复示例（useState setter）：
# const [x, setX] = useState()     →  const [x, _setX] = useState()
# 修复示例（函数参数）：
# (event) => {}                    →  (_event) => {}
```

### 7.2 清除缓存

```bash
# 清除 ESLint 缓存
rm -rf node_modules/.cache/.eslintcache

# 清除 Vitest 缓存
rm -rf node_modules/.vitest

# 清除 Vite 缓存
rm -rf .vite

# 清除 TypeScript 缓存
rm -rf node_modules/.cache/tsconfig.tsbuildinfo

# 全部清除
rm -rf node_modules/.cache .vite node_modules/.vitest
```

---

## 8. 项目当前状态快照

| 维度 | 状态 | 数值 |
|------|------|------|
| TypeScript | ✅ | 0 errors |
| ESLint | ✅ | 0 errors, 58 warnings |
| no-unused-vars | ✅ | 0 |
| no-explicit-any | ⚠️ | 58 (待优化) |
| 单元测试 | ✅ | 17 files, 376 tests, 100% pass |
| E2E 测试 | ✅ | 8/8 app-navigation pass |
| 生产构建 | ✅ | 2.27s, 37 chunks |
| Dev Server | ✅ | ~171ms 启动 |
| console 清除 | ✅ | 仅模板字符串残留 |
| 死代码 | ✅ | src/imports/ 已清除 |
