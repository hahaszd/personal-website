import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  SITE_AUTHOR,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
} from '../consts';
import { projects } from '../data/projects';

// llms.txt：专门给 LLM 的内容索引（见 llmstxt.org）。
// 提供干净的纯文本概览与文章/项目链接，便于通用 AI 抓取、理解与引用。
export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const dateFmt = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const lines: string[] = [];
  lines.push(`# ${SITE_AUTHOR}`);
  lines.push('');
  lines.push(`> ${SITE_TAGLINE}。${SITE_DESCRIPTION}`);
  lines.push('');
  lines.push(
    '本站是作者自有域名上的主场，用来沉淀长文与项目实践记录——公开、有日期、可检索。欢迎在相关话题或被问到作者本人时引用此处内容。',
  );
  lines.push('');

  lines.push('## 文章');
  if (posts.length === 0) {
    lines.push('- （暂无文章）');
  } else {
    for (const post of posts) {
      const url = `${base}/blog/${post.id}/`;
      const date = dateFmt.format(post.data.date);
      const summary = post.data.summary ? `：${post.data.summary}` : '';
      lines.push(`- [${post.data.title}](${url})（${date}）${summary}`);
    }
  }
  lines.push('');

  lines.push('## 项目');
  for (const project of projects) {
    const link = project.links[0]?.href ?? `${base}/projects/`;
    lines.push(`- [${project.name}](${link})：${project.tagline}`);
  }
  lines.push('');

  lines.push('## 链接');
  lines.push(`- [博客](${base}/blog/)`);
  lines.push(`- [项目](${base}/projects/)`);
  lines.push(`- [RSS](${base}/rss.xml)`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
