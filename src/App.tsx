import React, { useState, useEffect } from 'react'
import {
  ConfigProvider, Layout, Anchor, Typography, Space, Tag, Button,
  FloatButton, theme, Divider,
} from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'
import Giscus from '@giscus/react'
import {
  BackgroundSection, ProductSection, ArchitectureSection,
  EngineSection, LLMSection, JDK8Section, TechSelectionSection,
  PlansSection, SummarySection, MVPSection, ConclusionSection,
} from './Sections'
import './App.css'

const { Sider, Content } = Layout
const { Title, Paragraph, Text } = Typography

const anchorItems = [
  { key: 'hero', href: '#hero', title: '概述' },
  { key: 'bg', href: '#sec-background', title: '一、背景与现状' },
  { key: 'prod', href: '#sec-product', title: '二、产品形态' },
  { key: 'arch', href: '#sec-arch', title: '三、架构拆分' },
  { key: 'engine', href: '#sec-engine', title: '四、归因引擎' },
  { key: 'llm', href: '#sec-llm', title: '五、LLM 边界' },
  { key: 'jdk8', href: '#sec-jdk8', title: '六、JDK8 落地' },
  { key: 'tech', href: '#sec-tech', title: '七、技术选型' },
  { key: 'plans', href: '#sec-plans', title: '八、方案对比' },
  { key: 'summary', href: '#sec-summary', title: '九、总结矩阵' },
  { key: 'mvp', href: '#sec-mvp', title: '十、MVP 计划' },
  { key: 'conclusion', href: '#sec-conclusion', title: '十一、结论' },
  { key: 'comments', href: '#sec-comments', title: '💬 评论' },
]

const App: React.FC = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b5bfd',
          borderRadius: 12,
          colorBgBase: '#f8fafc',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorText: '#0f172a',
          colorTextSecondary: '#475569',
          colorBorderSecondary: '#e2e8f0',
          colorLink: '#3b5bfd',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif',
        },
        components: {
          Layout: { siderBg: 'transparent', bodyBg: 'transparent' },
          Table: { headerBg: '#f5f7fb', rowHoverBg: '#f8faff', borderColor: '#e6ebf4' },
          Card: { colorBgContainer: '#ffffff', colorBorderSecondary: '#e6ebf4' },
          Anchor: { colorPrimary: '#3b5bfd', fontSize: 13 },
          Timeline: { dotBg: 'transparent' },
          Tag: { defaultBg: '#eef3ff', defaultColor: '#3b5bfd' },
        },
      }}
    >
      {/* Reading progress bar */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        {/* Sidebar */}
        <Sider width={260} className="app-sider" breakpoint="lg" collapsedWidth={0} trigger={null}>
          <div className="sider-inner">
            <div className="sider-header">
              <span className="sider-header-label">目录</span>
            </div>
            <Anchor targetOffset={100} items={anchorItems} affix={false} />
          </div>
        </Sider>

        {/* Main */}
        <Layout style={{ marginLeft: 260, background: 'transparent' }}>
          <Content className="app-content">
            {/* Hero */}
            <section id="hero" className="hero-section">
              <div className="hero-inner">
                <Title level={1} className="hero-title">
                  指标拆解树
                  <br />
                  <span className="hero-highlight">归因分析能力建设方案</span>
                </Title>
                <Paragraph className="hero-subtitle">
                  基于 <Text code>plugin-rsl-bi-indicator-tree</Text> 代码库分析 · 2026-04-10
                </Paragraph>
                <Space size={8} wrap className="hero-badges">
                  <Tag>JDK8</Tag>
                  <Tag>React 18</Tag>
                  <Tag>AntV X6</Tag>
                  <Tag>Zustand</Tag>
                  <Tag color="purple">LLM Agent</Tag>
                </Space>
                <Space size={12} className="hero-links">
                  <Button type="primary" size="large" href="#sec-background" icon={<ArrowDownOutlined />}>
                    开始阅读
                  </Button>
                </Space>
              </div>
            </section>

            <BackgroundSection />
            <ProductSection />
            <ArchitectureSection />
            <EngineSection />
            <LLMSection />
            <JDK8Section />
            <TechSelectionSection />
            <PlansSection />
            <SummarySection />
            <MVPSection />
            <ConclusionSection />

            {/* Comments */}
            <section id="sec-comments" className="section-block">
              <Title level={2} className="section-title">💬 评论讨论</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                欢迎在下方留言讨论方案细节、提出改进建议。评论基于 GitHub Discussions。
              </Paragraph>
              <div className="giscus-container">
                <Giscus
                  repo="cuijinsen/attribution-analysis-proposal"
                  repoId="R_kgDOR-1xkA"
                  category="General"
                  categoryId="DIC_kwDOR-1xkM4C6hUJ"
                  mapping="pathname"
                  strict="0"
                  reactionsEnabled="1"
                  emitMetadata="0"
                  inputPosition="top"
                  theme="light"
                  lang="zh-CN"
                />
              </div>
            </section>

            {/* Footer */}
            <Divider style={{ borderColor: '#e6ebf4', marginTop: 80 }} />
            <footer className="app-footer">
              <Paragraph type="secondary">
                基于 <Text code>plugin-rsl-bi-indicator-tree</Text> 代码库分析 · 2026-04-10
              </Paragraph>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                开源仓库超链见第七章技术选型与参考项目。
              </Paragraph>
            </footer>
          </Content>
        </Layout>
      </Layout>

      <FloatButton.BackTop style={{ right: 32, bottom: 32 }} />
    </ConfigProvider>
  )
}

export default App
