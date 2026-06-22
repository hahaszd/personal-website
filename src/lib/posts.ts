import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;
export type Lang = 'zh' | 'en';

/** 取某语言的文章，按日期倒序。 */
export async function getPosts(lang: Lang): Promise<BlogEntry[]> {
  const all = await getCollection('blog');
  return all
    .filter((p) => p.data.lang === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 该 slug 是否存在另一语言版本（用于 hreflang / 语言切换）。 */
export async function hasTranslation(
  slug: string,
  otherLang: Lang,
): Promise<boolean> {
  const all = await getCollection('blog');
  return all.some((p) => p.data.slug === slug && p.data.lang === otherLang);
}

/** 文章详情页的本地化日期格式化。 */
export function formatDate(date: Date, lang: Lang): string {
  const locale = lang === 'en' ? 'en-US' : 'zh-CN';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: lang === 'en' ? 'long' : 'long',
    day: 'numeric',
  }).format(date);
}
