import React, { useState, useEffect } from 'react'
import {
  ConfigProvider, Layout, Menu, Typography, Space, Tag, Button,
  FloatButton, theme, Divider,
} from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import Giscus from '@giscus/react'
import {
  BackgroundSection, ProductSection, ArchitectureSection,
  EngineSection, LLMSection, JDK8Section, TechSelectionSection,
  PlansSection, SummarySection, MVPSection, ConclusionSection,
  AlertPlanSection, TargetPlanSection, MilestoneSection,
} from './Sections'
import { SelectionCommentWidget } from './SelectionComment'
import './App.css'

const { Sider, Content } = Layout
const { Title, Paragraph, Text } = Typography

const sectionOrder = [
  'hero',
  'sec-background',
  'sec-product',
  'sec-arch',
  'sec-engine',
  'sec-llm',
  'sec-jdk8',
  'sec-tech',
  'sec-plans',
  'sec-summary',
  'sec-mvp',
  'sec-conclusion',
  'sec-alert-plan',
  'sec-target-plan',
  'sec-milestone',
  'sec-comments',
]

const menuItems: MenuProps['items'] = [
  {
    key: 'group-overview',
    label: '总览',
    children: [{ key: 'hero', label: <a href="#hero">概述</a> }],
  },
  {
    key: 'group-bg',
    label: '背景与产品',
    children: [
      { key: 'sec-background', label: <a href="#sec-background">一、背景与现状</a> },
      { key: 'sec-product', label: <a href="#sec-product">二、产品形态</a> },
    ],
  },
  {
    key: 'group-arch',
    label: '技术架构',
    children: [
      { key: 'sec-arch', label: <a href="#sec-arch">三、架构拆分</a> },
      { key: 'sec-engine', label: <a href="#sec-engine">四、归因引擎</a> },
      { key: 'sec-llm', label: <a href="#sec-llm">五、LLM 边界</a> },
      { key: 'sec-jdk8', label: <a href="#sec-jdk8">六、JDK8 落地</a> },
    ],
  },
  {
    key: 'group-decision',
    label: '选型与决策',
    children: [
      { key: 'sec-tech', label: <a href="#sec-tech">七、技术选型</a> },
      { key: 'sec-plans', label: <a href="#sec-plans">八、方案对比</a> },
      { key: 'sec-summary', label: <a href="#sec-summary">九、总结矩阵</a> },
      { key: 'sec-mvp', label: <a href="#sec-mvp">十、MVP 计划</a> },
      { key: 'sec-conclusion', label: <a href="#sec-conclusion">十一、结论</a> },
    ],
  },
  {
    key: 'group-extended',
    label: '扩展评估',
    children: [
      { key: 'sec-alert-plan', label: <a href="#sec-alert-plan">十二、预警机制</a> },
      { key: 'sec-target-plan', label: <a href="#sec-target-plan">十三、目标机制</a> },
      { key: 'sec-milestone', label: <a href="#sec-milestone">十四、里程碑规划</a> },
    ],
  },
  {
    key: 'group-collab',
    label: '互动',
    children: [{ key: 'sec-comments', label: <a href="#sec-comments">💬 评论讨论</a> }],
  },
]

const App: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)

      let current = 'hero'
      for (const id of sectionOrder) {
        const el = document.getElementById(id)
        if (el && window.scrollY + 160 >= el.offsetTop) {
          current = id
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
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
        <Sider width={260} className="app-sider" trigger={null}>
          <div className="sider-inner">
            <div className="sider-header">
              <span className="sider-header-label">目录</span>
            </div>
            <Menu
              mode="inline"
              items={menuItems}
              selectedKeys={[activeSection]}
              defaultOpenKeys={['group-overview', 'group-bg', 'group-arch', 'group-decision', 'group-extended', 'group-collab']}
              className="sider-menu"
            />
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
            <AlertPlanSection />
            <TargetPlanSection />
            <MilestoneSection />

            {/* Selection comments widget */}
            <SelectionCommentWidget />

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
