// 项目实践记录：按「做了什么 / 怎么做 / 结果 / 日期 / 链接」组织，
// 与博客互相印证——讲「是什么」的同时亮出「我真做了什么」。

export type ProjectStatus = 'completed' | 'paused' | 'ongoing';

export interface Project {
  /** 项目名 */
  name: string;
  /** 一句话简介 */
  tagline: string;
  /** 状态 */
  status: ProjectStatus;
  /** 做了什么 */
  what: string;
  /** 怎么做（技术 / 方法 / 踩了什么坑） */
  how: string;
  /** 结果 / 现状 */
  result: string;
  /** 日期，YYYY-MM 或 YYYY */
  date: string;
  /** GitHub 或其它链接 */
  links: { label: string; href: string }[];
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  completed: '已完成',
  paused: '已暂停',
  ongoing: '进行中',
};

export const projects: Project[] = [
  {
    name: 'VoiceSpark',
    tagline:
      '随时待命的灵感捕捉器：把你说的、以及你正在听的（YouTube / 播客 / 网课）即时转成可搜索、可编辑的文字。',
    status: 'completed',
    what: '一个轻量的网页工具，专注个人灵感捕捉与学习笔记——不是冗长的会议录音，而是 30 秒到 5 分钟的「碎片」。可同时录麦克风和系统声音、边看边记；转写后自动复制、可编辑、按历史搜索，也支持连续自动捕捉。',
    how: '纯前端（原生 HTML/CSS/JS + Web Audio / MediaRecorder，IndexedDB 本地存储，可装成 PWA）配 FastAPI 后端，转写走 Google Speech-to-Text，坚持隐私优先：音频只在转写时上传、不留存。最大的坑都在浏览器音频上——尤其 iOS/Safari 对系统声音支持有限，移动端录音稳定性来回打磨了很多版。',
    result: '已上线并持续维护（v1.0）。',
    date: '2026-01',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/hahaszd/voice-record_webapp',
      },
    ],
  },
  {
    name: 'PickupAI',
    tagline:
      '面向澳洲 tradie 的 24/7 AI 电话接待：自动接听来电、用自然对话收集工单、把线索短信发给老板。',
    status: 'paused',
    what: '一个多租户的 AI 电话接待系统：Twilio 接入来电与短信，OpenAI Realtime 实时语音对话收集工单信息，配老板端线索仪表盘、管理后台、Stripe 订阅与 14 天试用、落地页与演示流程，还写了一批免费获客的抓取脚本。',
    how: 'TypeScript / Node + Express，SQLite（PostgreSQL 备份），Docker 化部署在 Railway。难点在实时语音的延迟与打断处理，以及澳洲号码的合规（地址 / 监管 bundle）。',
    result: '功能基本跑通，但综合权衡市场与投入产出后暂停，目前没有继续推进的计划。公开出来，作为一次完整的「从 0 搭 AI 语音 SaaS」的实践记录。',
    date: '2026',
    links: [{ label: 'GitHub', href: 'https://github.com/hahaszd/pickupai' }],
  },
];
