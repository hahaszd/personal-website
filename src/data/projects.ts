// 项目实践记录：手填占位数据。按「做了什么 / 怎么做 / 结果 / 日期 / 链接」组织，
// 与博客互相印证——讲「是什么」的同时亮出「我真做了什么」。
// TODO: 用你两个公开项目的真实信息替换下面的占位内容。

export interface Project {
  /** 项目名 */
  name: string;
  /** 一句话简介 */
  tagline: string;
  /** 做了什么 */
  what: string;
  /** 怎么做（技术 / 方法 / 踩了什么坑） */
  how: string;
  /** 结果 / 现状 */
  result: string;
  /** 日期，YYYY-MM 或 YYYY-MM-DD */
  date: string;
  /** GitHub 或其它链接 */
  links: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    name: '项目一（待填）',
    tagline: '一句话说清这个项目解决了什么问题。',
    what: 'TODO：描述这个项目做了什么。',
    how: 'TODO：技术栈、关键决策、踩过的坑与你的判断。',
    result: 'TODO：上线 / 数据 / 反馈 / 当前进展。',
    date: '2026-01',
    links: [{ label: 'GitHub', href: 'https://github.com/hahaszd' }],
  },
  {
    name: '项目二（待填）',
    tagline: '一句话说清这个项目解决了什么问题。',
    what: 'TODO：描述这个项目做了什么。',
    how: 'TODO：技术栈、关键决策、踩过的坑与你的判断。',
    result: 'TODO：上线 / 数据 / 反馈 / 当前进展。',
    date: '2026-01',
    links: [{ label: 'GitHub', href: 'https://github.com/hahaszd' }],
  },
];
