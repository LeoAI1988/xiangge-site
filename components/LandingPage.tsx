"use client";

import { ArrowDown, ArrowRight, Check, Download, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import skillDownloadManifest from "../public/skill-downloads/manifest.json";

type SkillDownloadManifestItem = {
  slug: string;
  title: string;
  description: string;
  category: "创作与发布" | "投资与研究" | "商业与策略" | "通用工具";
  download: string;
};

const skillDownloads = skillDownloadManifest as SkillDownloadManifestItem[];
const skillCategoryOrder: SkillDownloadManifestItem["category"][] = ["创作与发布", "投资与研究", "商业与策略", "通用工具"];
const skillDownloadsByCategory = skillCategoryOrder.map((category) => ({
  category,
  skills: skillDownloads.filter((skill) => skill.category === category),
}));

const courseChapters = [
  {
    number: "01",
    title: "AI生态全景及工具基础",
    lessons: [
      "1-1 课程导读、学习方法及AI应用的五个层级",
      "1-2 全球AI生态格局演变及大模型、智能体的发展路径",
      "1-3 进入AI世界你必须知道的概念、网站及工具",
    ],
  },
  {
    number: "02",
    title: "智能体基础操作，提效+赋能（工具的使用）",
    lessons: [
      "2-1 Codex的下载、安装、GPT账号注册",
      "2-2 GPT会员订阅、Codex首次登录、基础设置",
      "2-3 PDF生成公司官网",
      "2-4 Claude Code安装",
      "2-5 CC-Switch的安装",
      "2-6 爬取小红书全部逐字稿并总结专项手册",
      "2-7 Codex手册生成PPT",
      "2-8 Hermes的安装及腾讯云的使用",
      "2-9 WorkBuddy、CodeBuddy、QClaw、TraeWork的优势场景",
    ],
  },
  {
    number: "03",
    title: "知识库基础使用",
    lessons: [
      "3-1 AI原生的思维方式、生活工作范式",
      "3-2 什么是知识库，选型和搭建",
      "3-3 基础使用1——孩子阶段成长评估报告",
      "3-4 基础使用2——行业调研深度报告",
      "3-5 基础使用3——简历筛选及面试准备",
      "3-6 基础使用4——内容创作",
    ],
  },
  {
    number: "04",
    title: "内容创作全链路及复利系统",
    lessons: [
      "4-1 内容创作全链路闭环",
      "4-2 信息采集——朋友圈爬取及蒸馏",
      "4-3 信息采集——YouTube视频总结/下载",
      "4-4 信息采集——X自动监测信息链及淀选题库",
      "4-5 短视频剪辑——口播短视频自动化",
      "4-6 短视频剪辑——混剪短视频自动化",
      "4-7 短视频剪辑——数字人搭建及短视频自动化",
      "4-8 公众号爆款+知识库——改写公众号",
      "4-9 X选题库+知识库——改写公众号",
      "4-10 爆款短视频+知识库——改写公众号",
      "4-11 YouTube总结——改写公众号——改写短视频文案——自动剪辑闭环",
      "4-12 作家/博主蒸馏写作Skill",
    ],
  },
  {
    number: "05",
    title: "商业化落地及AI数字资产",
    lessons: [
      "5-1 筛选/咨询——客户评估H5小工具开发",
      "5-2 成交转化——话术总结、销售经营复盘",
      "5-3 运营——媒体号日常诊断",
      "5-4 产品/交付——商品详情页制作",
      "5-5 产品/交付——复杂网站全栈开发",
      "5-6 产品/交付——后端、域名、服务器及ICP备案闭环",
      "5-7 投资——量化体系搭建",
      "5-8 数字资产管理",
    ],
  },
  {
    number: "06",
    title: "自我价值实现、完成心愿",
    lessons: [
      "6-1 复杂网站案例拆解1",
      "6-2 复杂网站案例拆解2",
    ],
  },
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">亚</span>
          <span>亚里士多翔的 AI 世界</span>
        </a>
        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="页面导航">
          <a href="#profile" onClick={() => setMenuOpen(false)}>亚里士多翔</a>
          <a href="#course" onClick={() => setMenuOpen(false)}>正课大纲</a>
          <a href="#bonus" onClick={() => setMenuOpen(false)}>赠送大礼包</a>
          <a href="#skills" onClick={() => setMenuOpen(false)}>Skill 资产库</a>
          <a className="mobile-claim" href="#claim" onClick={() => setMenuOpen(false)}>添加微信获取资料</a>
        </nav>
        <a className="header-cta" href="#claim">添加微信获取资料</a>
        <button className="menu-button" type="button" aria-label="打开导航" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-system-label"><Sparkles size={15} /><span>AI BUSINESS OPERATING SYSTEM</span><i>2026</i></div>
            <p className="eyebrow light">给有业务的人学 AI</p>
            <h1 id="hero-title">让 AI 从一个工具，<span>变成你的业务系统。</span></h1>
            <p className="hero-copy">不是教你多学几个软件，而是把 AI 接进引流、内容、咨询、成交和复盘，让重复工作自动运转，让经验成为复利资产。</p>
            <div className="hero-actions">
              <a className="button primary glow-button" href="#claim">添加微信获取资料 <ArrowRight size={18} /></a>
              <a className="button glass" href="#course">查看正课大纲</a>
            </div>
            <div className="hero-metrics" aria-label="核心权益">
              <div><strong>5 层</strong><span>AI 应用逐级进阶</span></div>
              <div><strong>6 章</strong><span>从地图到毕业实战</span></div>
              <div><strong>{skillDownloads.length} 个</strong><span>业务 Skill 资产</span></div>
            </div>
          </div>
          <a className="scroll-cue" href="#profile" aria-label="继续向下浏览"><span>SCROLL TO EXPLORE</span><ArrowDown size={17} /></a>
        </section>

        <section id="profile" className="section white-section">
          <div className="section-inner profile-layout">
            <figure className="profile-photo">
              <img src="./xiangge-profile.jpg" alt="亚里士多翔个人照片" />
              <figcaption>亚里士多翔 · AI 原生工作流实践者</figcaption>
            </figure>
            <div className="profile-content">
              <h2>《有用的AI课》搭建你的AI复利系统</h2>
              <p>流水的大模型，铁打的系统。亚里士多翔把 AI 放回真实的工作与生活，从一张地图开始，先看清 AI 世界的全貌，再搭基础、建知识库、做实战。</p>
              <p>这不是只教软件按钮的工具课，也不是堆概念的入门课，而是一套面向零代码基础用户的 AI 原生工作系统。你会把 Agent、知识库、内容创作和项目实践串起来，让每次工作都留下可复用的数字资产。</p>
              <p>这套课程不一定会让你一夜暴富，但会带你从提效、赋能走到商业化、复利系统与自我实现。真正做到，有用。技术会不断更替，但系统和思维方式会持续为你创造价值。</p>
              <div className="tag-list"><span>AI 原生思维</span><span>Agent 与知识库</span><span>内容与项目实战</span><span>数字资产沉淀</span></div>
            </div>
          </div>
        </section>

        <section className="section logic-section">
          <div className="section-inner">
            <div className="section-heading"><p className="eyebrow">课程底层逻辑</p><h2>从会用工具，到拥有自己的 AI 资产</h2><p>把重复劳动交给 AI，把经验沉淀成 SOP、模板、知识库和 Skill。</p></div>
            <div className="logic-grid">
              <article><span>1.0</span><h3>AI 工具提效</h3><p>先让 AI 接住选题、脚本、问答、资料整理和初稿生成。</p></article>
              <article><span>2.0</span><h3>AI 工作流系统</h3><p>让引流、内容、咨询、成交、交付和复盘都有稳定流程。</p></article>
              <article><span>3.0</span><h3>AI 资产沉淀</h3><p>把经验打包成知识库、SOP、Agent 和 Skill，持续复用。</p></article>
            </div>
          </div>
        </section>

        <section id="course" className="section white-section">
          <div className="section-inner">
            <div className="section-heading wide"><p className="eyebrow">有用的AI课</p><h2>《有用的AI课》搭建你的AI复利系统，沉淀个人成长，创造数字资产</h2><p>从地图、基础设施到真实案例，把 AI 工具、知识库、Agent、内容生产和商业化实践连成一套可持续生长的系统。</p></div>
            <div className="course-facts">
              <div><strong>适合人群</strong><span>一人公司、创业老板、自媒体、知识工作者、咨询行业、团队管理者和职场白领</span></div>
              <div><strong>学习重点</strong><span>先建立 AI 世界地图，再打基础、建知识库，进入内容与商业化实战</span></div>
              <div><strong>最终结果</strong><span>形成会自动生长的复利系统，把个人成长沉淀为数字资产</span></div>
            </div>
            <div className="course-grid">
              {courseChapters.map(({ number, title, lessons }) => (
                <article className="course-chapter" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <ul>{lessons.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="bonus" className="section bonus-section">
          <div className="section-inner">
            <div className="section-heading"><p className="eyebrow">赠送大礼包</p><h2>没有对比就看不清价值</h2><p>先拿一套 1980 元年课，再决定要不要买。添加微信即可免费领取，先对比课程质量，再决定是否购买我的几百元正课。</p></div>
            <article className="bonus-feature">
              <div><span className="resource-label">免费见面礼</span><h3>某 AI 头部博主的 1980 元年课</h3><p>这套年课免费送给大家，权当见面礼。你可以拿它和我的几百元正课放在一起对比，看看哪套内容更有用。不买也没关系，先把课拿走，少一点被割韭菜的风险。</p>
                <ul><li><Check size={18} />免费领取某 AI 头部博主年课</li><li><Check size={18} />对比 1980 元年课与几百元正课</li><li><Check size={18} />不买正课也可以先学习</li></ul>
              </div>
              <a className="button primary" href="#claim">添加微信获取年课</a>
            </article>
            <div className="bonus-grid">
              <article><span className="resource-label">赠送 PDF</span><h3>《2026超级个体AI生存手册》</h3><p>理解超级个体在 AI 时代的能力结构、机会判断和行动路径。</p><a href="#claim">添加微信获取 PDF</a></article>
              <article><span className="resource-label">赠送 PDF</span><h3>《AI一人公司行动指南》</h3><p>从业务选择、内容获客到轻量交付，建立一个人的 AI 增长系统。</p><a href="#claim">添加微信获取 PDF</a></article>
            </div>
          </div>
        </section>

        <section id="skills" className="section white-section">
          <div className="section-inner">
            <div className="section-heading wide"><p className="eyebrow">亚里士多翔 Skill 资产库</p><h2>把可复用的能力，变成你的数字资产</h2><p>所有 Skill 均与公开仓库同步，并经过精简、脱敏和安装校验。</p></div>
            <div className="skill-categories">
              {skillDownloadsByCategory.map(({ category, skills }) => (
                <section className="skill-category" key={category} aria-labelledby={`skill-category-${category}`}>
                  <div className="skill-category-heading">
                    <h3 id={`skill-category-${category}`}>{category}</h3>
                    <span>{skills.length} 个 Skill</span>
                  </div>
                  <div className="skill-grid">
                    {skills.map((skill) => (
                      <article key={skill.slug}>
                        <span>{String(skillDownloads.findIndex((item) => item.slug === skill.slug) + 1).padStart(2, "0")}</span>
                        <h3>{skill.title}</h3>
                        <p>{skill.description}</p>
                        <a className="button secondary-dark" href={`.${skill.download}`} download>
                          <Download size={16} />
                          立即下载
                        </a>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="skill-callout"><div><h3>{skillDownloads.length} 个 Skill 已开放</h3><p>无需登记，也无需配置后端，点击上方按钮即可直接下载。</p></div><a className="button dark" href="#skills"><Download size={18} />查看全部</a></div>
          </div>
        </section>

        <section id="claim" className="section claim-section">
          <div className="section-inner claim-layout">
            <div className="claim-copy"><p className="eyebrow light">领取年课与资料</p><h2>添加微信获取资料</h2><p>扫描二维码添加好友，备注“资料”，我会把年课和相关学习资料发给你。</p>
              <ul><li><Check size={19} />1980 元 AI 年课</li><li><Check size={19} />有用的 AI 课介绍</li><li><Check size={19} />首批 Skill 下载信息</li></ul>
            </div>
            <aside className="wechat-card" aria-label="微信联系方式">
              <span>扫码添加微信</span>
              <img className="wechat-qr" src="./wechat-qr.jpg" alt="微信二维码" width={888} height={1137} />
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div><span>亚里士多翔的 AI 世界</span><span className="site-footer-links"><a href="#top">返回顶部</a><a className="icp-link" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">粤ICP备2026089185号-2</a></span></div></footer>
    </div>
  );
}
