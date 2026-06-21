import { defineCollection, z } from 'astro:content';
import type { Loader, LoaderContext } from 'astro/loaders';
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// 内容源（git submodule）根：content/writing/文章/<YYYY-MM-DD-主题>/02-成稿/*.md
const ARTICLES_DIR = path.resolve(process.cwd(), 'content/writing/文章');

const FOLDER_RE = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

/** 从正文推断标题：第一处 `# H1`。 */
function inferTitle(body: string): string | undefined {
  const m = body.match(/^\s*#\s+(.+?)\s*$/m);
  return m?.[1]?.trim();
}

/**
 * 从正文推断摘要：开头第一个引言块（连续的 `>` 行）。
 * 去掉每行的 `>` 前缀，并剥离可能的「引言」标签。
 */
function inferSummary(body: string): string | undefined {
  const lines = body.split(/\r?\n/);
  const collected: string[] = [];
  let started = false;
  for (const line of lines) {
    if (/^\s*>/.test(line)) {
      started = true;
      collected.push(line.replace(/^\s*>\s?/, ''));
    } else if (started) {
      if (line.trim() === '') continue; // 允许块内空行
      break;
    }
  }
  if (collected.length === 0) return undefined;
  let text = collected.join(' ').trim();
  text = text.replace(/^引言[:：]?\s*/, '').trim();
  return text || undefined;
}

/**
 * 在一个 `02-成稿/` 目录里择版本：
 * 1) 优先文件名含「发布版」；2) 否则取唯一 md；3) 都不满足 → 跳过并告警。
 */
function pickVersion(
  mdFiles: string[],
  folderName: string,
  logger: LoaderContext['logger'],
): string | undefined {
  if (mdFiles.length === 0) return undefined;
  const published = mdFiles.filter((f) => f.includes('发布版'));
  if (published.length >= 1) {
    if (published.length > 1) {
      logger.warn(
        `「${folderName}」有多个含「发布版」的文件，取第一个：${published[0]}`,
      );
    }
    return published[0];
  }
  if (mdFiles.length === 1) return mdFiles[0];
  logger.warn(
    `「${folderName}」的 02-成稿 有多个版本但无「发布版」标记，已跳过：${mdFiles.join(', ')}`,
  );
  return undefined;
}

function writingLoader(): Loader {
  return {
    name: 'writing-submodule-loader',
    load: async (context: LoaderContext) => {
      const { store, logger, parseData, generateDigest, renderMarkdown } =
        context;
      store.clear();

      if (!existsSync(ARTICLES_DIR)) {
        logger.warn(
          `未找到内容源目录：${ARTICLES_DIR}。请确认已挂载 submodule（git submodule update --init）。本次构建将不包含任何文章。`,
        );
        return;
      }

      const entries = await readdir(ARTICLES_DIR, { withFileTypes: true });
      for (const dirent of entries) {
        if (!dirent.isDirectory()) continue;
        const folderName = dirent.name;
        const folderMatch = folderName.match(FOLDER_RE);
        if (!folderMatch) continue; // 不符合 YYYY-MM-DD-主题 的目录忽略

        const inferredDate = folderMatch[1];
        const inferredSlug = folderMatch[2];

        const finalDir = path.join(ARTICLES_DIR, folderName, '02-成稿');
        if (!existsSync(finalDir)) continue;

        const allFiles = (await readdir(finalDir)).filter((f) =>
          f.toLowerCase().endsWith('.md'),
        );
        const chosen = pickVersion(allFiles, folderName, logger);
        if (!chosen) continue;

        const filePath = path.join(finalDir, chosen);
        const relativeFilePath = path.relative(process.cwd(), filePath);
        const raw = await readFile(filePath, 'utf-8');
        const { data: fm, content: body } = matter(raw);

        // 可选 frontmatter 覆盖；没有就回退到推断值。不强制改写作流程。
        if (fm.published === false) {
          logger.info(`「${folderName}」frontmatter 标记 published: false，已跳过。`);
          continue;
        }

        const title = (fm.title as string) ?? inferTitle(body);
        if (!title) {
          logger.warn(`「${folderName}」无法推断标题（缺少 # H1），已跳过。`);
          continue;
        }
        const slug = (fm.slug as string) ?? inferredSlug;
        const date = (fm.date as string) ?? inferredDate;
        const summary = (fm.summary as string) ?? inferSummary(body);
        const cover = (fm.cover as string) ?? undefined;
        const lang = (fm.lang as string) ?? 'zh';

        const fileStat = await stat(filePath);
        const id = slug;

        const data = await parseData({
          id,
          data: {
            title,
            date,
            summary,
            cover,
            lang,
            updated: fileStat.mtime.toISOString(),
            sourcePath: relativeFilePath,
          },
        });

        const digest = generateDigest(raw);
        const rendered = await renderMarkdown(body);

        store.set({
          id,
          data,
          body,
          filePath: relativeFilePath,
          digest,
          rendered,
        });
      }

      const count = store.keys().length;
      logger.info(`内容加载完成：共 ${count} 篇文章。`);
    },
  };
}

const blog = defineCollection({
  loader: writingLoader(),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    lang: z.string().default('zh'),
    updated: z.coerce.date().optional(),
    sourcePath: z.string().optional(),
  }),
});

export const collections = { blog };
