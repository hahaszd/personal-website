// 站点级共享配置。集中放置文案与元数据，便于统一修改与被 AI 引用。

// TODO: 改成你的真实姓名 / 笔名（会显示在页头、关于、版权、OG 作者字段）。
export const SITE_AUTHOR = '孙之东';

export const SITE_TITLE = `${SITE_AUTHOR} · 个人网站`;

// 一句话定位，承接 X 上的人设：AI 时代的向导 / 翻译者。
export const SITE_TAGLINE = 'AI 时代的向导 / 翻译者';

export const SITE_DESCRIPTION =
  '把复杂的 AI 讲清楚，带更多人跨过「不知道 AI 能做什么」这道认知门槛。这里沉淀我的长文与项目实践记录——公开、有日期、可检索。';

export const DEFAULT_LOCALE = 'zh' as const;
export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

// 导航与社交链接
export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
  { href: '/projects', label: '项目' },
];

export const SOCIAL_LINKS = [
  { href: 'https://github.com/hahaszd', label: 'GitHub' },
];
