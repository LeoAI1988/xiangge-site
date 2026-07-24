"use client";

import { ArrowDown, ArrowRight, Check, Download, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import skillDownloadManifest from "../public/skill-downloads/manifest.json";

type SkillDownloadManifestItem = {
  slug: string;
  title: string;
  description: string;
  download: string;
};

const skillDownloads = skillDownloadManifest as SkillDownloadManifestItem[];
const wechatNumber = "13751196386";

const courseModules = [
  ["01", "AI 不是工具，是你的第二个员工", "明确哪些工作交给 AI，哪些判断必须由人负责。"],
  ["02", "拆你的业务流程", "把引流、内容、咨询、成交、交付和复盘拆成清晰节点。"],
  ["03", "内容生产工作流", "搭建选题库、脚本库、朋友圈表达和直播复盘流程。"],
  ["04", "客户理解与咨询方案", "整理客户信息、提炼痛点并生成方案框架。"],
  ["05", "私域承接与成交 SOP", "沉淀私信问答、跟进节奏和成交辅助流程。"],
  ["06", "个人知识库搭建", "让案例、问题和行业资料成为可检索的业务大脑。"],
  ["07", "Agent、Codex 与 Skill", "从会提问升级到会分配任务，让 AI 按流程执行。"],
  ["08", "真实业务案例复盘", "拆解 AI 如何进入香港身份、教育规划等真实场景。"],
  ["09", "从工具到资产", "把 Prompt、模板、SOP 和 Skill 打包成复用资产。"],
  ["10", "上线、成交与迭代", "串起短视频、直播、页面、领取、购买和复盘闭环。"],
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  async function copyWeChat() {
    try {
      await navigator.clipboard.writeText("13751196386");
      setCopyMessage("微信号已复制，打开微信添加我即可获取资料。");
    } catch {
      setCopyMessage("复制未成功，请手动复制微信号 13751196386。");
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">翔</span>
          <span>翔哥 AI 工作流</span>
        </a>
        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="页面导航">
          <a href="#profile" onClick={() => setMenuOpen(false)}>翔哥是谁</a>
          <a href="#course" onClick={() => setMenuOpen(false)}>正课大纲</a>
          <a href="#bonus" onClick={() => setMenuOpen(false)}>赠送大礼包</a>
          <a href="#skills" onClick={() => setMenuOpen(false)}>Skill 资产库</a>
          <a className="mobile-claim" href="#claim" onClick={() => setMenuOpen(false)}>添加我的微信获取资料</a>
        </nav>
        <a className="header-cta" href="#claim">添加我的微信获取资料</a>
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
              <a className="button primary glow-button" href="#claim">添加我的微信获取资料 <ArrowRight size={18} /></a>
              <a className="button glass" href="#course">查看正课大纲</a>
            </div>
            <div className="hero-metrics" aria-label="核心权益">
              <div><strong>10 节</strong><span>基础内容免费领取</span></div>
              <div><strong>51 节</strong><span>完整目录持续更新</span></div>
              <div><strong>{skillDownloads.length} 个</strong><span>业务 Skill 资产</span></div>
            </div>
          </div>
          <a className="scroll-cue" href="#profile" aria-label="继续向下浏览"><span>SCROLL TO EXPLORE</span><ArrowDown size={17} /></a>
        </section>

        <section id="profile" className="section white-section">
          <div className="section-inner profile-layout">
            <figure className="profile-photo"><span className="profile-photo-label">REAL BUSINESS · REAL WORKFLOW</span>
              <img src="/xiangge-profile.jpg" alt="翔哥个人照片" />
              <figcaption>翔哥 · AI 业务工作流实践者</figcaption>
            </figure>
            <div className="profile-content">
              <p className="eyebrow">翔哥是谁</p>
              <h2>从专业服务一线长出来的 AI 实战派</h2>
              <p>翔哥长期从事建筑设计，后来进入香港身份、升学规划与家庭教育等专业服务领域。现在的核心方向，是把 AI 装进真实业务流程。</p>
              <p>课程不带你在代码细节里绕圈，而是解决怎么更快做选题、拆客户、出方案、承接私域、复盘业务，并把过程沉淀成可复用资产。</p>
              <div className="tag-list"><span>香港身份与教育规划</span><span>专业服务工作流</span><span>个人 IP 与私域转化</span><span>AI 高频实操</span></div>
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
            <div className="section-heading wide"><p className="eyebrow">翔哥的正课</p><h2>《把 AI 装进你的业务》AI 工作流实战课</h2><p>80% 工作流落地，加上 20% 行业与商业认知，帮助有业务的人真正把 AI 用起来。</p></div>
            <div className="course-facts">
              <div><strong>适合人群</strong><span>有业务、内容、咨询、课程或私域转化链路的人</span></div>
              <div><strong>学习重点</strong><span>从真实任务出发，边做边沉淀自己的工作流</span></div>
              <div><strong>最终结果</strong><span>形成能反复使用的业务 SOP、知识库和 Skill</span></div>
            </div>
            <div className="course-grid">
              {courseModules.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
            </div>
          </div>
        </section>

        <section id="bonus" className="section bonus-section">
          <div className="section-inner">
            <div className="section-heading"><p className="eyebrow">赠送大礼包</p><h2>先拿基础包，再决定要不要继续深入</h2><p>添加我的微信，即可获取 AI 学习资料和首批 Skill。</p></div>
            <article className="bonus-feature">
              <div><span className="resource-label">核心赠品</span><h3>AI 年课基础内容包</h3><p>覆盖 AI 趋势、工具入门、内容流量、知识库和工作流等主题，适合先建立完整认知，再进入翔哥的业务实战课。</p>
                <ul><li><Check size={18} />申请领取前 10 节基础内容</li><li><Check size={18} />完整 51 节学习目录</li><li><Check size={18} />后续新增资料持续更新</li></ul>
              </div>
              <a className="button primary" href="#claim">添加我的微信获取资料</a>
            </article>
            <div className="bonus-grid">
              <article><span className="resource-label">PDF 资料</span><h3>《2026 超级个体 AI 生存手册》</h3><p>理解超级个体在 AI 时代的能力结构、机会判断与行动路径。</p><a href="#claim">添加我的微信获取资料</a></article>
              <article><span className="resource-label">行动指南</span><h3>《AI 一人公司行动指南》</h3><p>从业务选择、内容获客到轻量交付，建立一个人的 AI 增长系统。</p><a href="#claim">添加我的微信获取资料</a></article>
            </div>
          </div>
        </section>

        <section id="skills" className="section white-section">
          <div className="section-inner">
            <div className="section-heading wide"><p className="eyebrow">翔哥 Skill 资产库</p><h2>把经验做成 AI 可以直接执行的能力</h2><p>从内容、咨询、销售到知识管理，逐步建立属于你的业务 Skill 库。</p></div>
            <div className="skill-grid">
              {skillDownloads.map((skill, index) => (
                <article key={skill.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                  <a className="button secondary-dark" href={skill.download} download>
                    <Download size={16} />
                    立即下载
                  </a>
                </article>
              ))}
            </div>
            <div className="skill-callout"><div><h3>{skillDownloads.length} 个 Skill 已开放</h3><p>无需登记，也无需配置后端，点击上方按钮即可直接下载。</p></div><a className="button dark" href="#skills"><Download size={18} />查看全部</a></div>
          </div>
        </section>

        <section id="claim" className="section claim-section">
          <div className="section-inner claim-layout">
            <div className="claim-copy"><p className="eyebrow light">获取资料</p><h2>添加我的微信获取资料</h2><p>添加微信号后备注“资料”，我会把相关内容发给你。</p>
              <ul><li><Check size={19} />前 10 节基础内容</li><li><Check size={19} />PDF 学习资料</li><li><Check size={19} />首批 Skill 下载信息</li></ul>
            </div>
            <aside className="wechat-card" aria-label="微信联系方式">
              <span>我的微信号</span>
              <strong>{wechatNumber}</strong>
              <button className="button primary submit-button" type="button" onClick={copyWeChat}>复制微信号</button>
              {copyMessage && <p className="copy-message" role="status">{copyMessage}</p>}
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div><span>翔哥 AI 工作流</span><a href="#top">返回顶部</a></div></footer>
    </div>
  );
}
