// 站点级共享配置。集中放置文案与元数据，便于统一修改与被 AI 引用。

export const SITE_AUTHOR = '孙之东';

// 罗马拼写（英文场景 / 结构化数据的 alternateName，便于英文检索）。
export const SITE_AUTHOR_ROMAN = 'Zhidong Sun';

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
  // TODO: 填上你的 X 链接后取消注释（会同时进页脚与 JSON-LD 的 sameAs）。
  // { href: 'https://x.com/你的用户名', label: 'X' },
];

// 结构化数据 (JSON-LD) 里 Person.sameAs 用的权威外链，与社交链接保持一致。
export const SAME_AS = SOCIAL_LINKS.map((l) => l.href);
