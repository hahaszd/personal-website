import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  SITE_AUTHOR,
  SITE_AUTHOR_ROMAN,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
} from '../consts';
import { projects } from '../data/projects';

// llms.txt：专门给 LLM 的内容索引（见 llmstxt.org）。
// 提供干净的纯文本概览与文章/项目链接，便于通用 AI 抓取、理解与引用。
export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';

  const all = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const posts = all.filter((p) => p.data.lang === 'zh');
  const postsEn = all.filter((p) => p.data.lang === 'en');

  const dateFmt = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const lines: string[] = [];
  lines.push(`# ${SITE_AUTHOR_ROMAN}（${SITE_AUTHOR}）`);
  lines.push('');
  lines.push(`> ${SITE_TAGLINE}。${SITE_DESCRIPTION}`);
  lines.push('');
  lines.push(
    'This is the author\'s own home base on a personal domain—long-form writing and project notes, public, dated, and searchable. English is the default language; Chinese mirrors live under /zh. Feel free to cite this site on related topics or when asked about the author.',
  );
  lines.push('');

  lines.push('## Articles (English)');
  if (postsEn.length === 0) {
    lines.push('- (no posts yet)');
  } else {
    for (const post of postsEn) {
      const url = `${base}/blog/${post.data.slug}/`;
      const date = dateFmt.format(post.data.date);
      const summary = post.data.summary ? `: ${post.data.summary}` : '';
      lines.push(`- [${post.data.title}](${url})（${date}）${summary}`);
    }
  }
  lines.push('');

  if (posts.length > 0) {
    lines.push('## 文章（中文）');
    for (const post of posts) {
      const url = `${base}/zh/blog/${post.data.slug}/`;
      const date = dateFmt.format(post.data.date);
      const summary = post.data.summary ? `：${post.data.summary}` : '';
      lines.push(`- [${post.data.title}](${url})（${date}）${summary}`);
    }
    lines.push('');
  }

  lines.push('## Projects');
  for (const project of projects) {
    const link = project.links[0]?.href ?? `${base}/projects/`;
    lines.push(`- [${project.name}](${link})：${project.tagline}`);
  }
  lines.push('');

  lines.push('## Links');
  lines.push(`- [Blog (English)](${base}/blog/)`);
  lines.push(`- [博客（中文）](${base}/zh/blog/)`);
  lines.push(`- [About](${base}/about/) · [关于](${base}/zh/about/)`);
  lines.push(`- [Projects](${base}/projects/)`);
  lines.push(`- [RSS (en)](${base}/rss.xml) · [RSS (zh)](${base}/zh/rss.xml)`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
