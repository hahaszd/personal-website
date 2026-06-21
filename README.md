# 个人网站

AI 时代的「地基」：一个自己掌控、开放、可被通用 AI 检索与引用的主场，用来沉淀长文与项目实践记录。

技术栈：**Astro + TypeScript**，静态生成（SSG），部署 **Vercel**。内容源为独立的私有写作仓库，以 git submodule 挂载。

完整构想与设计原则见 [个人网站-建设方案与构想.md](个人网站-建设方案与构想.md)。

## 架构

```
网站仓库（本文件夹）
├── content/writing/        ← git submodule，指向写作仓库（内容源）
│   └── 文章/<YYYY-MM-DD-主题>/02-成稿/*.md
├── src/
│   ├── consts.ts           ← 站点文案 / 元数据（含需替换的 TODO）
│   ├── content.config.ts   ← 自定义内容加载器（解析无 frontmatter 的成稿）
│   ├── components/         ← BaseHead / Header / Footer
│   ├── layouts/           ← BaseLayout
│   ├── data/projects.ts    ← 项目展示的手填数据
│   └── pages/             ← 首页/关于、博客、项目、rss.xml、llms.txt、robots.txt
├── scripts/publish.mjs     ← 一键发布脚本
└── astro.config.mjs        ← site / i18n(中英预留) / sitemap / markdown
```

## 内容解析约定（成稿无需 frontmatter）

加载器 glob `content/writing/文章/**/02-成稿/*.md`，按约定推断：

- **标题**：正文首个 `# H1`
- **日期**：文件夹名 `YYYY-MM-DD-主题`
- **摘要**：正文开头第一个 `>` 引言块
- **slug**：文件夹名里「主题」那一段
- **多版本择一**：优先文件名含「发布版」；否则取唯一文件；都不满足则跳过并告警
- **可选 frontmatter 覆盖**：若成稿手动加了 `title / date / summary / slug / cover / lang / published`，优先用 frontmatter（`published: false` 则不发布）

不强制改写作流程。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run preview
```

## 发布新文章

1. 在**写作仓库**里 `git add/commit/push`（文章才会出现在 GitHub 上）。
2. 在**网站仓库**根目录运行 `npm run publish`（内部同步 submodule + 提交 + 推送）。
3. Vercel 监听到 push 后自动部署。

## 待办（需要你补全）

- `src/consts.ts`：把 `SITE_AUTHOR` 改成你的真实姓名/笔名。
- `src/data/projects.ts`：用你两个公开项目的真实信息替换占位内容。
- `astro.config.mjs`：部署后把 `SITE_URL` 改成真实域名（影响 canonical / sitemap / RSS / OG）。
- 挂载内容源 submodule（见下）。

## 内容源 submodule（私有写作仓库）

```bash
git submodule add https://github.com/hahaszd/insights-and-plan.git content/writing
git submodule update --init --recursive
```

> 注意：`content/writing/` 已写入 `.cursorignore`，仅用于避免 AI 索引污染，不影响构建。

## 部署到 Vercel

- 导入网站仓库，框架自动识别为 Astro，构建命令 `astro build`，输出目录 `dist`。
- 私有 submodule 授权：用同一 GitHub 账号（`hahaszd`）通过 Vercel 的 GitHub App 同时授权**网站仓库**与**写作仓库**；或配置 deploy key。
- 部署后验证已有文章自动出现在站上，并更新 `astro.config.mjs` 的 `SITE_URL`。
