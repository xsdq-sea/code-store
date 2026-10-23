# code-store-ts

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## GitHub Pages 自动部署

站点地址：https://xsdq-sea.github.io/code-store/

GitHub 仓库的 Settings → Pages → Source 使用 **GitHub Actions**。
提交并推送到 `main` 后，`.github/workflows/deploy.yml` 会安装锁定依赖、构建 `dist`，
再通过 GitHub 官方 Pages Actions 发布。也可以在 Actions 中手动运行
**Deploy to GitHub Pages**。不需要提交 `dist`，也不需要配置个人访问令牌。

工作流使用 Node.js 24 和 `npm ci`。部署路径从 Pages 元数据自动获取，
当前为 `/code-store/`；以后绑定自定义域名时会自动使用域名对应的路径。
Vue Router 使用 hash 路由，例如 `/code-store/#/firstFrame`，支持直接访问和刷新。

本地验证与部署一致的构建：

```sh
npm run build-only -- --base /code-store/
npm run preview -- --base /code-store/
```

当前 `npm run build` 中的类型检查存在旧版 `vue-tsc` / `@vue/tsconfig` 与
TypeScript 6 的兼容问题，所以部署使用项目已有的 `build-only`，执行真实生产打包。
这不代表类型检查已通过；类型工具升级需另行处理。

GitHub Pages 仅托管静态前端。下载示例中的 `/api` 开发代理、WebSocket 和 SSE
示例中的 localhost 服务，以及 Service Worker 的 `/api/submit` 请求，需要单独部署
可供浏览器访问的后端；本次部署不包含这些服务。Service Worker 的测试读取接口由其自身模拟。

未来使用自有域名时，在 Settings → Pages → Custom domain 中填写域名，
并在域名服务商处配置对应 DNS。完成后重新运行部署即可，无需修改前端路径。
