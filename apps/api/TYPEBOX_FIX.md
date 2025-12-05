# TypeBox 版本冲突修复

## 问题
`SyntaxError: export 'TypeSystemPolicy' not found in '@sinclair/typebox/system'`

## 原因
根目录 node_modules 中有 TypeBox 0.27.8，但新版本的 Elysia 需要更新的版本。

## 解决方案

### 方法 1: 在根目录添加 TypeBox（推荐）

在根目录 `package.json` 中添加：

```json
{
  "resolutions": {
    "@sinclair/typebox": "^0.32.35"
  }
}
```

然后运行：
```bash
cd /home/lotus/project/book2/novel-editor
rm -rf node_modules bun.lockb
bun install
```

### 方法 2: 在 api 项目中添加 resolutions

在 `apps/api/package.json` 中添加：

```json
{
  "resolutions": {
    "@sinclair/typebox": "^0.32.35"
  }
}
```

### 方法 3: 使用工作区覆盖

在根目录 `package.json` 中添加 `overrides` 字段。

## 临时解决方案

使用旧版本的 Elysia (1.1.22) 来匹配 TypeBox 0.27.8，但这限制了功能。

