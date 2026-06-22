// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 站点 URL：本期使用 Vercel 默认域名占位，接入自定义域名后改这里即可。
// canonical / sitemap / RSS / OG 都依赖 `site`，部署后请更新为真实地址。
const SITE_URL = 'https://sunzhidong.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // 默认静态输出（SSG）：保证正文为可直出 HTML，便于被通用 AI 抓取与引用。
  trailingSlash: 'ignore',
  // 语言口径：英文为默认（根域），中文镜像放 /zh。
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
