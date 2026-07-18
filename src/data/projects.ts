// 项目实践记录：按「做了什么 / 怎么做 / 结果 / 日期 / 链接」组织，
// 与博客互相印证——讲「是什么」的同时亮出「我真做了什么」。
//
// 双语：英文为默认（根域 /projects），中文为镜像（/zh/projects）。
// 语言无关字段（name / status / date / links）只写一次；
// 叙述字段（tagline / what / how / result）分 en / zh 两版。

export type ProjectStatus = 'completed' | 'paused' | 'ongoing';

/** 一个项目在某种语言下的叙述文案 */
export interface ProjectContent {
  /** 一句话简介 */
  tagline: string;
  /** 做了什么 */
  what: string;
  /** 怎么做（技术 / 方法 / 踩了什么坑） */
  how: string;
  /** 结果 / 现状 */
  result: string;
}

export interface Project {
  /** 项目名（语言无关，中英两页共用） */
  name: string;
  /** 状态 */
  status: ProjectStatus;
  /** 日期，YYYY-MM 或 YYYY */
  date: string;
  /** GitHub 或其它链接 */
  links: { label: string; href: string }[];
  /** 英文文案 */
  en: ProjectContent;
  /** 中文文案 */
  zh: ProjectContent;
}

export const STATUS_LABEL_EN: Record<ProjectStatus, string> = {
  completed: 'Shipped',
  paused: 'Paused',
  ongoing: 'In progress',
};

export const STATUS_LABEL_ZH: Record<ProjectStatus, string> = {
  completed: '已完成',
  paused: '已暂停',
  ongoing: '进行中',
};

export const projects: Project[] = [
  {
    name: 'CouncilBeacon',
    status: 'ongoing',
    date: '2026-06',
    links: [
      { label: 'councilbeacon.com.au', href: 'https://councilbeacon.com.au' },
    ],
    en: {
      tagline:
        'A public information portal that helps everyday NSW residents actually use, understand, and keep up with their local city council.',
      what:
        "A consumer-facing site that pulls each NSW council's scattered official information — rates, bin collection days, finances, safety, elections, public consultations, report-it links, recent updates — into plain-language, source-backed pages. Users find their council via map or search, browse local essentials, and subscribe to email digests or browser push to stay in the loop. It holds a strict content standard: facts only, every figure carries a source and an as-at date, neutral wording, no conclusions.",
      how:
        'Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, deployed on Vercel. Postgres stores subscribers, push subscriptions and ingested updates; Resend sends transactional and digest email; web-push (VAPID) handles browser notifications; Leaflet powers the council map. A news-ingestion pipeline runs on Vercel Cron to crawl each council daily and optionally calls an LLM for neutral summaries, degrading to deterministic truncation when no key is present. The engineering hallmark is "runs with zero config" — every integration degrades gracefully when its env vars are missing; the hard part was standardising 80+ councils\' heterogeneous official sources, captured in a reusable Claude Code skill.',
      result:
        'Around 80 NSW councils onboarded in batches with structured datasets; core features — find-your-council, per-topic pages, a "rates explained" page, subscription / push, and the crawl-and-summarise cron — are all built and running. Actively expanding council coverage.',
    },
    zh: {
      tagline:
        '帮普通 NSW 居民更省力地「用好、了解并跟上」自己所在城市议会的公开信息门户。',
      what:
        '一个面向公众的本地议会信息网站，把每个 NSW city council 分散在官方渠道的信息——rates（市政费）、垃圾收运日、财务、治安、选举、公众咨询、报事入口、近期动态——整理成通俗、有来源背书的页面。用户可用地图 / 搜索找到自己的议会，查看本地实用信息，并订阅邮件摘要或浏览器推送来跟进本地动态。产品坚持严格的内容规范：只呈现事实、每个数字都带来源与「截至日期」、中性措辞、不下结论。',
      how:
        '技术栈为 Next.js 16（App Router）+ React 19 + TypeScript + Tailwind v4，部署在 Vercel。用 Postgres 存订阅者 / 推送订阅 / 抓取到的动态，Resend 发事务与摘要邮件，web-push（VAPID）做浏览器推送，Leaflet 做议会地图。一套 news ingestion 管线通过 Vercel Cron 每日抓取各议会渠道、按需接 LLM 生成中性化摘要（无 key 时退化为确定性截取）。工程亮点是「零配置可跑」——每个集成缺环境变量时优雅降级；难点在于把 80+ 个议会异构的官方数据源标准化，为此沉淀了一个可复用的 Claude Code skill。',
      result:
        '已分批 onboard 约 80 个 NSW councils 的结构化数据集，主要功能（找议会、分主题页、rates 看懂页、订阅 / 推送、抓取 + 摘要 cron）均已实现并可运行，仍在持续扩充覆盖。',
    },
  },
  {
    name: 'AI Novel Studio',
    status: 'ongoing',
    date: '2026-07',
    links: [],
    en: {
      tagline:
        'A human-in-the-loop pipeline for writing web fiction fast with AI — grounded in 7,800+ hours of my own reading taste, with a full novel as the live test.',
      what:
        'The project starts from reading: it uses the WeRead API to pull my bookshelf and reading history (~7,865 hours, 1,437 reading days) and distils them into a six-point "taste model." From there the real goal is production — a human-in-the-loop workflow that uses AI to draft long-form fiction fast, with "reader taste = writing standard" at its core. To validate the tooling I am actually writing a novel with it (4 chapters finalised, drafts through chapter 8).',
      how:
        'The core is a self-designed P-1 → P4 pipeline (market / red-line checks → two-way deconstruction of reference books → a layered story bible with LOCK/ROLL fields → outline → detailed beats for the opening chapters → a validation gate → rolling production), backed by templates, a continuity ledger, character cards, multi-lens review and quality gates. It is a Markdown-based knowledge repo driven by Claude Code / agents, with a Python skill (chapter merging) and a JS workflow (unattended overnight review runs). The hard parts are long-range consistency, killing the "AI smell" in the prose, and navigating China\'s AI-content regulations — each researched and turned into an explicit strategy.',
      result:
        'The pipeline runs end to end on real output (the opening chapters passed a full release gate), the first proof the tooling works — but it has not passed the reader-validation gate yet: no real test-reader data, the novel is unfinished, and there is no product or revenue. Actively iterating.',
    },
    zh: {
      tagline:
        '从微信读书 7800+ 小时的阅读口味出发，搭一套「人把关 + AI 主力生产」的网文创作工作流，并以一本实战小说作为验证场。',
      what:
        '项目起点是「读」——用微信读书 API 拉取书架与阅读记录（累计约 7865 小时、1437 个阅读日），提炼出六条口味模型。真正的目标是「造」：一套人在环、用 AI 快速创作网文的工作流，内核是「读者口味 = 写作标准」。为验证工具，我实际动笔写第一本小说（已定稿 4 章，草稿推进到第 8 章）。',
      how:
        '核心是一套自建的 P-1 → P4 创作管线（市场 / 红线校验 → 双向拆书 → 设定圣经 LOCK/ROLL 分层 → 大纲 → 黄金三章细纲 → 验证 GATE → 滚动量产），配套模板、连续性账本、人物卡、多视角 review 与质量门。技术上是以 Markdown 为主、由 Claude Code / Agent 驱动的知识库，写了 Python skill（章节合并）和 JS Workflow（夜间无人值守跑 review）。难点在长程设定自洽、消除「AI 味」的语感把关，以及规避中国 AI 内容监管红线——都做了专门研究并沉淀成策略。',
      result:
        '管线已用真实产出跑通（黄金三章按完整放行标准过关），这是工具能力的第一个验证点；但尚未过「读者验证 GATE」——缺真实读者试读数据，小说未完结，产品与盈利均未落地。仍在持续迭代。',
    },
  },
  {
    name: 'Benefits Radar',
    status: 'ongoing',
    date: '2026-07',
    links: [],
    en: {
      tagline:
        'A deadline-radar for government benefits: personalised checklists and reminders so Australians stop missing the A$10bn+ in support they never claim each year.',
      what:
        'Tackles a real gap — Australians miss billions in government benefits every year, and around 90 "you only get it if you apply" programs have no personalised official reminder. The product is a 2-minute screener → personalised benefit checklist → tick-to-track → "you still have $X unclaimed" → email and calendar reminders. A first-class, hard-to-copy feature is filtering out dead / expired programs (every item carries a last-verified date), since negative knowledge is exactly where generic AI and content farms get it wrong.',
      how:
        'Validation-first, zero-cost cold start: prove demand through free "benefit calendar" material packs and a sign-up funnel before any paid spend. The real moat is a change-detection pipeline that continuously tracks federal / state rule changes and deadlines — every rule carries an official source URL. So far I have built source-backed rule libraries for NSW (~90 active + 14 closed) and VIC (~65 active), a Phase-0 validation plan with fixed go / kill thresholds, and the scaffolding for a web MVP (landing + screener + checklist + email + calendar feed, PWA).',
      result:
        'Officially in Phase 0 (zero-cost validation) as of July 2026 — rule libraries and validation plan done, web MVP in progress; no launch or users yet. Deliberately kept lean until demand is proven.',
    },
    zh: {
      tagline:
        '政府福利的「死线雷达」：个人化清单 + 提醒，帮澳洲人别再错过每年 100 亿澳元+ 没人领的福利。',
      what:
        '针对一个真实缺口——澳洲人每年错过巨额政府福利，约 90 个「不主动申请就拿不到」的项目没有任何个人化官方提醒。产品是「2 分钟筛查 → 个人化福利清单 → 打勾追踪 →『你还有 $X 没领』→ 邮件 + 日历提醒」。一个一等价值、也最难抄的差异点是「排除已关闭 / 过期项目」（每条挂最后核实日期）——负面知识正是通用 AI 和内容农场最常出错的地方。',
      how:
        '验证优先、零成本冷启动：先用免费的「福利日历」素材包 + 报名漏斗验证需求，达标才付费投放。真正的壁垒是一条持续侦测联邦 / 州规则变动与死线的「变更侦测管道」——每条规则都挂官方源 URL。目前已建成有来源背书的 NSW（约 90 活跃 + 14 已关闭）与 VIC（约 65 活跃）规则库、带固定通过 / 关停门槛的阶段 0 验证计划，以及网页 MVP 的骨架（landing + 筛查器 + 清单 + 邮件 + 日历订阅，PWA）。',
      result:
        '2026 年 7 月正式进入阶段 0（零成本验证）——规则库与验证计划已完成，网页 MVP 开发中；尚未上线、暂无用户。刻意保持精简，等需求被证实再加码。',
    },
  },
  {
    name: 'VoiceSpark',
    status: 'completed',
    date: '2026-01',
    links: [
      { label: 'voicespark.app', href: 'https://voicespark.app' },
      {
        label: 'GitHub',
        href: 'https://github.com/hahaszd/voice-record_webapp',
      },
    ],
    en: {
      tagline:
        "An always-on idea catcher: instantly turn what you say — and what you're listening to (YouTube / podcasts / online courses) — into searchable, editable text.",
      what:
        'A lightweight web tool focused on personal idea capture and study notes — not long meeting recordings, but 30-second to 5-minute "fragments." It records your microphone and system audio at the same time so you can take notes while you watch; transcripts are auto-copied, editable, searchable by history, and it supports continuous auto-capture.',
      how:
        'A pure front-end app (vanilla HTML/CSS/JS with Web Audio / MediaRecorder, IndexedDB for local storage, installable as a PWA) paired with a FastAPI backend, with transcription via Google Speech-to-Text. Privacy-first: audio is only uploaded during transcription and never stored. The hardest parts were all in browser audio — especially iOS/Safari\'s limited support for system audio — and mobile recording stability took many iterations.',
      result:
        'Live at voicespark.app and actively maintained, with 100+ iterative feature releases.',
    },
    zh: {
      tagline:
        '随时待命的灵感捕捉器：把你说的、以及你正在听的（YouTube / 播客 / 网课）即时转成可搜索、可编辑的文字。',
      what:
        '一个轻量的网页工具，专注个人灵感捕捉与学习笔记——不是冗长的会议录音，而是 30 秒到 5 分钟的「碎片」。可同时录麦克风和系统声音、边看边记；转写后自动复制、可编辑、按历史搜索，也支持连续自动捕捉。',
      how:
        '纯前端（原生 HTML/CSS/JS + Web Audio / MediaRecorder，IndexedDB 本地存储，可装成 PWA）配 FastAPI 后端，转写走 Google Speech-to-Text，坚持隐私优先：音频只在转写时上传、不留存。最大的坑都在浏览器音频上——尤其 iOS/Safari 对系统声音支持有限，移动端录音稳定性来回打磨了很多版。',
      result: '已上线 voicespark.app 并持续维护，迭代了 100+ 个功能版本。',
    },
  },
  {
    name: 'PickupAI',
    status: 'paused',
    date: '2026-04',
    links: [
      { label: 'getpickupai.com.au', href: 'https://www.getpickupai.com.au' },
      { label: 'GitHub', href: 'https://github.com/hahaszd/pickupai' },
    ],
    en: {
      tagline:
        'A 24/7 AI phone receptionist for Australian tradies: answers calls automatically, collects job details through natural conversation, and texts the lead to the boss.',
      what:
        'A multi-tenant AI phone reception system: Twilio handles inbound calls and SMS, OpenAI Realtime drives live voice conversation to collect job info, with a boss-facing lead dashboard, admin console, Stripe subscriptions with a 14-day trial, a landing page and demo flow, plus a set of scraping scripts for free lead generation.',
      how:
        'TypeScript / Node + Express, SQLite (with a PostgreSQL fallback), dockerized and deployed on Railway. The hard parts were latency and barge-in handling for real-time voice, and Australian phone-number compliance (address / regulatory bundles).',
      result:
        'Core functionality works end to end and the live site stays up as a demo, but after weighing the market against the effort I paused it — no current plans to push further. Published as a complete "building an AI voice SaaS from scratch" case study.',
    },
    zh: {
      tagline:
        '面向澳洲 tradie 的 24/7 AI 电话接待：自动接听来电、用自然对话收集工单、把线索短信发给老板。',
      what:
        '一个多租户的 AI 电话接待系统：Twilio 接入来电与短信，OpenAI Realtime 实时语音对话收集工单信息，配老板端线索仪表盘、管理后台、Stripe 订阅与 14 天试用、落地页与演示流程，还写了一批免费获客的抓取脚本。',
      how:
        'TypeScript / Node + Express，SQLite（PostgreSQL 备份），Docker 化部署在 Railway。难点在实时语音的延迟与打断处理，以及澳洲号码的合规（地址 / 监管 bundle）。',
      result:
        '功能基本跑通、线上站点保留着可体验的 demo，但综合权衡市场与投入产出后暂停，目前没有继续推进的计划。公开出来，作为一次完整的「从 0 搭 AI 语音 SaaS」的实践记录。',
    },
  },
];

/** 页面底部「验证中的产品探索」——只调研、还没大量写代码的想法，轻量一句带过。 */
export const EXPLORATIONS = {
  en: {
    heading: 'Explorations in validation',
    body: "A couple more product ideas I'm still validating before writing much code — deliberately kept at the research stage until demand is proven: a FIRB vacancy-fee compliance helper for foreign property owners, and a concert telephoto-phone rental side-project. Each has market research, a compliance analysis, and a lean validation plan; neither has shipped yet.",
  },
  zh: {
    heading: '验证中的产品探索',
    body: '还有几个正在验证、没大量写代码的产品想法——刻意停在调研阶段，等需求被证实再往前推：面向外国房产业主的 FIRB 空置费合规助手、以及演唱会长焦手机租赁副业。都有市场调研、合规分析与精益验证方案，但尚未上线。',
  },
};
