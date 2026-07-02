# CLAUDE.md

个人网站(sunzhidong.com)——AI 时代的「地基」:一个自己掌控、开放、可被通用 AI 检索与引用的主场,用来沉淀长文与项目实践记录。

## 技术栈

- **Astro 6 + TypeScript**,静态生成(SSG),无前端框架(纯 `.astro` 组件)
- 部署 **Vercel**,自定义域名 `sunzhidong.com`,push 到 `main` 自动部署
- Node `>=22.12.0`,包管理用 npm
- 内容源为**独立私有写作仓库**,以 git submodule 挂载在 `content/writing/`

## 常用命令

```bash
npm install
npm run dev        # 本地开发 http://localhost:4321
npm run build      # 产物在 dist/
npm run preview    # 预览构建产物
npm run publish    # 发布新文章(见下方发布流程)
```

无测试、无 lint 脚本;验证方式是 `npm run build` 能通过。

## 架构

```
网站仓库(本文件夹)= 代码
├── content/writing/     ← git submodule → 私有写作仓库 insights-and-plan(内容源)
│   └── 文章/<YYYY-MM-DD-主题>/02-成稿/*.md
├── src/
│   ├── consts.ts            ← 站点文案/元数据/导航/社交链接(集中配置)
│   ├── content.config.ts    ← 自定义内容加载器(核心,见下)
│   ├── lib/posts.ts         ← 取文章/判断翻译/日期格式化
│   ├── data/projects.ts     ← 项目展示手填数据
│   ├── components/          ← BaseHead / Header / Footer
│   ├── layouts/BaseLayout.astro
│   └── pages/               ← 英文在根域,中文镜像在 /zh
├── scripts/publish.mjs      ← 一键发布脚本
└── astro.config.mjs         ← site URL / i18n / sitemap / markdown
```

## 内容加载约定(关键)

`src/content.config.ts` 里的自定义 loader 扫描 `content/writing/文章/**/02-成稿/*.md`,
成稿**不需要 frontmatter**,按约定推断:

- **标题**:正文首个 `# H1`
- **日期**:文件夹名 `YYYY-MM-DD-主题` 的日期段
- **摘要**:正文开头第一个 `>` 引用块
- **slug**:优先查 `content.config.ts` 里的 `SLUG_MAP`,否则回退到文件夹「主题」段
- **中文版择一**:优先文件名含「发布版」;否则取唯一 md;都不满足则跳过并告警
- **英文版**:文件名以 `-EN.md` 结尾(如 `Reputation-EN.md`),id 为 `${slug}-en`
- **frontmatter 可覆盖**:若成稿手填 `title/date/summary/slug/cover/lang/published`,优先用;`published: false` 则不发布

> 新增中英双语文章时,记得在 `content.config.ts` 的 `SLUG_MAP` 登记文件夹→英文 slug 的映射,让中英两版共用同一 slug。

## 双语约定

- 英文为默认语言,放**根域**;中文为镜像,放 `/zh`(`astro.config.mjs` i18n:`prefixDefaultLocale: false`)
- 导航/文案分 `NAV_LINKS_EN` / `NAV_LINKS_ZH` 等,集中在 `src/consts.ts`
- 创作中文先行 + 英文精译;对外 AI 抓取层以英文为 canonical

## SEO / AI 可检索(项目核心目标)

- JSON-LD 结构化数据:Person / WebSite / BlogPosting
- `src/pages/llms.txt.ts` — 专供 AI 爬虫的清单
- sitemap(`@astrojs/sitemap`)、RSS(`rss.xml`)、robots.txt
- canonical / OG / sitemap / RSS 都依赖 `astro.config.mjs` 的 `site`(即 `SITE_URL`)

## 发布新文章的流程

1. 在**写作仓库**(submodule)里写好文章并 `git add/commit/push`
2. 在**网站仓库**根目录运行 `npm run publish`
   - 内部执行 `git submodule update --remote --merge` 拉取写作仓库最新提交
   - 若 submodule 指针有变化 → 自动 commit + push
3. Vercel 监听到 push 后自动部署

私有 submodule 授权失败时:`gh auth refresh -h github.com` 或检查访问权限。

## 注意事项

- `content/writing/`(内容源 submodule)通过 `.claude/settings.json` 的 `permissions.deny` 挡在 Claude 的 Read/Edit 之外,避免 AI 索引污染;这只影响 Claude 的工具读取,**不影响 `npm run build`**(Astro loader 仍会正常 glob 它)
- 改站点文案/导航/社交链接 → 优先改 `src/consts.ts`,不要散落各页面
- 改域名 → 同步更新 `astro.config.mjs` 的 `SITE_URL`(影响 canonical/sitemap/RSS/OG)
- 项目展示内容是手填的,改 `src/data/projects.ts`
