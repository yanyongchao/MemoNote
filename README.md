# MemoNote

MemoNote 是一个轻量级个人备忘录应用，支持登录、注册、创建笔记、编辑笔记、搜索、收藏、置顶和个人中心统计。

项目采用 pnpm workspace 管理：

- `packages/server`: Express + Prisma + MySQL 后端服务
- `packages/app`: Expo + Expo Router + HeroUI Native 移动端应用
- `docs`: PRD 和页面参考图

## 技术栈

### Server

- Node.js
- Express 5
- Prisma 7
- MySQL
- Zod
- jose JWT
- Vitest + Supertest
- Biome

### App

- Expo SDK 57
- React Native 0.86
- Expo Router
- HeroUI Native
- Uniwind / Tailwind CSS
- Zustand
- Axios
- MMKV

## 环境要求

- Node.js 24+
- pnpm 10+
- MySQL
- iOS Simulator / Android Emulator / Expo Go

## 安装依赖

在项目根目录执行：

```bash
pnpm install
```

## 环境变量

### Server

开发环境变量位于 `packages/server/.env.development`。

关键变量：

```bash
NODE_ENV=development
PORT=8080
HOST=localhost
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/memonote?timezone=%2B08:00"
CORS_ORIGIN="http://localhost:8080"
USER_AUTH_TOKEN_SECRET="development-user-auth-secret"
USER_AUTH_TOKEN_EXPIRES_IN_SECONDS=2592000
```

`DATABASE_URL` 建议带 `timezone=%2B08:00`，避免数据库时区配置差异导致连接失败。

### App

开发环境变量位于 `packages/app/.env.development`。

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080/
EXPO_PUBLIC_ENV=development
```

如果在真机上运行，`localhost` 指的是手机自身，需要把 `EXPO_PUBLIC_API_URL` 改成电脑局域网 IP，例如：

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.10:8080/
```

修改 Expo 环境变量后需要重启 Expo。

## 数据库初始化

先创建数据库：

```sql
CREATE DATABASE memonote CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后在项目根目录执行迁移：

```bash
pnpm db:migrate
```

生成 Prisma Client：

```bash
pnpm db:generate
```

可选：执行 seed：

```bash
pnpm db:seed
```

## 启动开发环境

### 启动后端

在项目根目录：

```bash
pnpm dev:server
```

默认地址：

```text
http://localhost:8080
```

Swagger 文档：

```text
http://localhost:8080
```

OpenAPI JSON：

```text
http://localhost:8080/swagger.json
```

### 启动 App

进入 app 包：

```bash
cd packages/app
pnpm start
```

常用启动方式：

```bash
pnpm start
pnpm ios
pnpm android
```

`expo start --ios` 会启动 Metro 并在 iOS Simulator 中打开 Expo Go 或开发客户端。它不会编译原生 iOS 代码；需要编译原生代码时使用 `pnpm ios` / `expo run:ios`。

## 常用命令

### 根目录命令

```bash
pnpm dev:server
pnpm build:server
pnpm start:server
pnpm check:server
pnpm test:server
pnpm db:migrate
pnpm db:generate
pnpm db:seed
pnpm db:studio
```

### Server

```bash
cd packages/server
pnpm start:dev
pnpm build
pnpm test
pnpm check
pnpm db:migrate
```

### App

```bash
cd packages/app
pnpm start
pnpm typecheck
pnpm lint
pnpm ios
pnpm android
```

## 功能接口

### Auth

- `POST /auth/register`: 注册
- `POST /auth/login`: 登录

### Notes

所有 `/notes` 接口都需要 `Authorization: Bearer <token>`。

- `GET /notes`: 获取全部笔记
- `GET /notes?q=keyword`: 搜索笔记
- `GET /notes?favorite=true`: 获取收藏笔记
- `GET /notes/stats`: 获取笔记数和收藏数
- `GET /notes/:id`: 获取笔记详情
- `POST /notes`: 新建笔记
- `PUT /notes/:id`: 编辑笔记
- `PATCH /notes/:id`: 更新置顶/收藏状态
- `DELETE /notes/:id`: 删除笔记

## App 页面

- 登录页：`packages/app/src/app/(auth)/login.tsx`
- 注册页：`packages/app/src/app/(auth)/register.tsx`
- 首页：`packages/app/src/app/(tabs)/index.tsx`
- 收藏：`packages/app/src/app/(tabs)/favorites.tsx`
- 我的：`packages/app/src/app/(tabs)/profile.tsx`
- 新建笔记：`packages/app/src/app/notes/new.tsx`
- 笔记详情：`packages/app/src/app/notes/[id].tsx`
- 编辑笔记：`packages/app/src/app/notes/[id]/edit.tsx`
- 搜索：`packages/app/src/app/search.tsx`

## 开发约定

- 后端按 `model / repository / service / controller / router` 分层。
- App 端 API 请求放在 `packages/app/src/api`。
- 登录态使用 Zustand 管理。
- Token 存储在 MMKV，并由 `http.ts` 自动注入到请求头。
- 路由使用 Expo Router 文件路由。

## 测试和检查

后端：

```bash
pnpm --filter server test
pnpm --filter server check
pnpm --filter server build
```

App：

```bash
cd packages/app
pnpm typecheck
pnpm lint
```

当前 app lint 可能会出现 axios 默认导入的 warning，不影响构建。

## 常见问题

### `pnpm db:seed` 报 timezone 错误

连接参数里不要使用 `timezone=Asia/Shanghai`，可以改为固定偏移量：

```bash
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/memonote?timezone=%2B08:00"
```

### App 请求 `/notes` 返回 HTML

通常是请求打到了 Swagger UI 或 Expo 页面，而不是 JSON API。检查：

- server 是否已重启并加载最新 `/notes` 路由
- `EXPO_PUBLIC_API_URL` 是否指向后端，例如 `http://localhost:8080/`
- 真机运行时不要使用 `localhost`，改为电脑局域网 IP
- 是否已经登录，`/notes` 需要 Bearer token

### Expo 修改 `.env` 后不生效

Expo 的 `EXPO_PUBLIC_*` 变量会在启动时注入，修改后需要重启：

```bash
pnpm start
```

必要时清缓存：

```bash
pnpm start --clear
```
