#!/usr/bin/env node
// 一键发布：把写作仓库（submodule）的最新成稿同步进网站仓库并推送，触发 Vercel 部署。
//
// 前置：先在「写作仓库」里 git add/commit/push 你的新文章，
// 然后在「网站仓库」根目录运行：npm run publish
//
// 本脚本会：
//   1) git submodule update --remote --merge content/writing   （拉取写作仓库最新提交）
//   2) 若 submodule 指针有变化 → git add + commit + push        （网站仓库记录新内容）
//   3) Vercel 监听到 push 后自动重新部署

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SUBMODULE_PATH = 'content/writing';

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(msg) {
  console.log(`${c.cyan}›${c.reset} ${msg}`);
}
function ok(msg) {
  console.log(`${c.green}✓${c.reset} ${msg}`);
}
function warn(msg) {
  console.log(`${c.yellow}!${c.reset} ${msg}`);
}
function fail(msg) {
  console.error(`${c.red}✗ ${msg}${c.reset}`);
  process.exit(1);
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...opts }).trim();
}
function runLoud(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

// 0) 健全性检查
try {
  run('git rev-parse --is-inside-work-tree');
} catch {
  fail('当前目录不是 git 仓库。请在网站仓库根目录运行。');
}

if (!existsSync(path.join(process.cwd(), '.gitmodules'))) {
  fail(
    `未找到 .gitmodules。请先挂载内容源 submodule：\n  git submodule add https://github.com/hahaszd/insights-and-plan.git ${SUBMODULE_PATH}`,
  );
}

if (!existsSync(path.join(process.cwd(), SUBMODULE_PATH))) {
  log('submodule 尚未初始化，正在初始化…');
  runLoud(`git submodule update --init ${SUBMODULE_PATH}`);
}

// 1) 拉取写作仓库最新提交
log('拉取写作仓库最新成稿…');
try {
  runLoud(`git submodule update --remote --merge ${SUBMODULE_PATH}`);
} catch {
  fail(
    '更新 submodule 失败。若是私有仓库授权问题，请先 `gh auth refresh -h github.com` 或检查访问权限。',
  );
}

// 2) 检查 submodule 指针是否有变化
const status = run('git status --porcelain');
const changed = status
  .split('\n')
  .some((line) => line.trim().endsWith(SUBMODULE_PATH) || line.includes(SUBMODULE_PATH));

if (!changed) {
  ok('内容已是最新，无需发布。');
  process.exit(0);
}

// 3) 提交并推送
const submoduleRef = (() => {
  try {
    return run(`git -C ${SUBMODULE_PATH} rev-parse --short HEAD`);
  } catch {
    return 'unknown';
  }
})();

const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
const message = `content: sync writing @${submoduleRef} (${stamp})`;

log('记录新内容到网站仓库…');
runLoud(`git add ${SUBMODULE_PATH}`);
runLoud(`git commit -m ${JSON.stringify(message)}`);

log('推送到远端（Vercel 将自动部署）…');
runLoud('git push');

ok('发布完成。稍候 Vercel 会自动部署最新内容。');
