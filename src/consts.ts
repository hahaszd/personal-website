// 站点级共享配置。集中放置文案与元数据，便于统一修改与被 AI 引用。
//
// 语言口径（已定）：英文为默认语言、放在根域；中文是同级镜像，放 /zh。
// 对外门面 / AI 抓取层以英文为 canonical 默认；创作仍中文先行 + 英文精译。

export const SITE_AUTHOR = '孙之东';

// 罗马名：姓在前（与域名 sunzhidong 一致），用作显示名 / 结构化数据 name。
export const SITE_AUTHOR_ROMAN = 'Sun Zhidong';

export const SITE_TITLE = `${SITE_AUTHOR} · 个人网站`;
export const SITE_TITLE_EN = `${SITE_AUTHOR_ROMAN} · Personal Site`;

// 一句话定位，承接 X 上的人设：AI 时代的向导 / 翻译者。
export const SITE_TAGLINE = 'AI 时代的向导 / 翻译者';
export const SITE_TAGLINE_EN = 'A guide & translator for the AI era';

export const SITE_DESCRIPTION =
  '把复杂的 AI 讲清楚，带更多人跨过「不知道 AI 能做什么」这道认知门槛。这里沉淀我的长文与项目实践记录——公开、有日期、可检索。';
export const SITE_DESCRIPTION_EN =
  'Making AI clear, and helping more people cross the threshold of "not knowing what AI can do." Long-form writing and hands-on project notes—public, dated, and searchable.';

// JSON-LD Person 用：权威人物描述与领域（取自写作仓库 person-jsonld.md）。
export const PERSON_DESCRIPTION =
  '把复杂的 AI 讲清楚，带更多人跨过「不知道 AI 能做什么」这道认知门槛；一边亲身实践、一边公开记录全过程。';
export const PERSON_KNOWS_ABOUT = [
  'AI',
  'Artificial Intelligence',
  'Personal Reputation',
  'AI SEO',
  'Prompt Engineering',
  'Indie Hacking',
];

// 英文为默认语言（根域）。
export const DEFAULT_LOCALE = 'en' as const;
export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

// 导航（按语言）。英文在根域，中文在 /zh。projects 暂为同一页。
export const NAV_LINKS_EN = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export const NAV_LINKS_ZH = [
  { href: '/zh', label: '首页' },
  { href: '/zh/blog', label: '博客' },
  { href: '/projects', label: '项目' },
  { href: '/zh/about', label: '关于' },
];

// 语言切换文案
export const LANG_SWITCH = {
  en: { label: '中文', title: '中文' },
  zh: { label: 'EN', title: 'English' },
} as const;

export const SOCIAL_LINKS = [
  { href: 'https://github.com/hahaszd', label: 'GitHub' },
  // TODO: 填上你的 X 链接后取消注释（会同时进页脚与 JSON-LD 的 sameAs）。
  // { href: 'https://x.com/你的用户名', label: 'X' },
];

// 结构化数据 (JSON-LD) 里 Person.sameAs 用的权威外链，与社交链接保持一致。
export const SAME_AS = SOCIAL_LINKS.map((l) => l.href);
