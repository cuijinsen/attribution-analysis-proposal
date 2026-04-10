import React from 'react'
import {
  Typography, Table, Card, Row, Col, Tag, Alert, Timeline,
  Space, Descriptions, Steps,
} from 'antd'
import {
  CheckCircleOutlined, CloseCircleOutlined, ExperimentOutlined,
  ThunderboltOutlined, SafetyOutlined, ApiOutlined,
  BranchesOutlined, AimOutlined, FundOutlined,
  RocketOutlined, GithubOutlined, LinkOutlined,
  BellOutlined, FlagOutlined, SendOutlined,
  ScheduleOutlined, MailOutlined, TrophyOutlined,
} from '@ant-design/icons'
import MermaidChart from './components/MermaidChart'

const { Title, Paragraph, Text } = Typography

/* ============================================================
   一、背景与现状
   ============================================================ */
export const BackgroundSection: React.FC = () => (
  <section id="sec-background" className="section-block">
    <Title level={2} className="section-title">一、需求背景与现状</Title>

    <Title level={3} className="section-subtitle">1.1 已有能力</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '能力域', dataIndex: 'domain', width: 120 },
        { title: '现状', dataIndex: 'status' },
        { title: '代码位置', dataIndex: 'code', render: (t: string) => <Text code>{t}</Text> },
      ]}
      dataSource={[
        { key: '1', domain: '指标中心', status: 'DataEngineService / ModelDataQueryService 取数', code: 'modules/engine/cal/' },
        { key: '2', domain: '指标拆解树', status: 'X6 画布 + KPI 卡片 + 维度拆解 + 公式节点', code: 'webui/src/core/canvas/' },
        { key: '3', domain: '结构归因', status: 'BFS 贡献度计算 + 关键路径高亮', code: 'canvas/attribution.ts' },
        { key: '4', domain: 'LLM 对接', status: '同步 + SSE 流式，归因/节点/异常/预测解读', code: 'LlmService.java' },
        { key: '5', domain: '维度拆解', status: '按字段拆解 + 筛选器 + 14 种 FilterConverter', code: 'BreakdownService' },
        { key: '6', domain: '告警', status: '阈值 / 趋势 / 异常 / 对比四种规则', code: 'alertEngine.ts' },
        { key: '7', domain: '协作', status: '心跳 + 锁定 + 评论 + 审计 + 督办', code: 'collaboration/' },
      ]}
    />

    <Title level={3} className="section-subtitle">1.2 现有归因的局限</Title>
    <div className="code-block" style={{ marginBottom: 20 }}>
      <pre>贡献度 = 子节点值 / 父节点值{'\n'}关键路径 = 逐层取贡献度最高的子节点</pre>
    </div>
    <Row gutter={[14, 14]}>
      {[
        { t: '变化量归因', d: '只看静态比例，不计算 delta 归因' },
        { t: '维度归因', d: '无法回答"哪个地区导致下降"' },
        { t: '多期对比', d: '缺少同比/环比自动归因' },
        { t: '异常根因', d: '异常检测与归因割裂' },
        { t: '自然语言交互', d: 'LLM 只做单次解读' },
        { t: '证据生成', d: '缺少数据支撑和置信度' },
      ].map((item, i) => (
        <Col key={i} xs={24} sm={12} md={8}>
          <Card size="small" hoverable>
            <Text strong>{item.t}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>{item.d}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
)

/* ============================================================
   二、产品形态
   ============================================================ */
export const ProductSection: React.FC = () => (
  <section id="sec-product" className="section-block">
    <Title level={2} className="section-title">二、产品形态分析</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '形态', dataIndex: 'form', width: 130 },
        { title: '描述', dataIndex: 'desc' },
        { title: '优势', dataIndex: 'pros' },
        { title: '劣势', dataIndex: 'cons' },
        {
          title: '判断', dataIndex: 'verdict', width: 100,
          render: (t: string, r: any) => <Tag color={r.color}>{t}</Tag>,
        },
      ]}
      dataSource={[
        { key: 'a', form: 'A. 嵌入拆解树', desc: 'KPI 卡片增加归因入口', pros: '上下文连贯', cons: '耦合风险（245 文件）', verdict: 'MVP 推荐', color: 'green' },
        { key: 'b', form: 'B. 独立插件', desc: '新建 attribution 插件', pros: '解耦清晰', cons: '需重复建 UI', verdict: '中后期', color: 'orange' },
        { key: 'c', form: 'C. 对话助手', desc: 'Copilot 侧边面板', pros: '语言体验好', cons: '脱离业务上下文', verdict: '辅助入口', color: 'red' },
      ]}
    />
    <Alert
      type="info"
      showIcon
      style={{ marginTop: 20 }}
      message={<>建议 <Text strong>A 为主入口 + C 为辅助入口</Text>。<Text code>canvasStore.ts</Text> 已预留 <Text code>attributionPanel</Text> / <Text code>aiInterpretPanel</Text> 状态槽位。</>}
    />
  </section>
)

/* ============================================================
   三、架构拆分
   ============================================================ */
const archDiagram = `
graph TD
  subgraph Frontend["前端 · 指标拆解树插件"]
    A["X6 画布 (已有)"]
    B["归因面板 UI (新增)"]
    C["对话面板 UI (新增)"]
    D["Zustand Store"]
  end
  A --> D
  B --> D
  C --> D
  D -->|HTTP / SSE| E["指标中心 (已有)"]
  D -->|HTTP / SSE| F["归因引擎 (新增)"]
  D -->|HTTP / SSE| G["Agent 层 (新增)"]
  G -->|调用| F
  F -->|取数| E

  style A fill:#e8f6ef,stroke:#16a34a
  style B fill:#eaf2ff,stroke:#2563eb
  style C fill:#eaf2ff,stroke:#2563eb
  style D fill:#fff4e5,stroke:#d97706
  style E fill:#e8f6ef,stroke:#16a34a
  style F fill:#eaf2ff,stroke:#2563eb
  style G fill:#fdf2ff,stroke:#a21caf
`

export const ArchitectureSection: React.FC = () => (
  <section id="sec-arch" className="section-block">
    <Title level={2} className="section-title">三、架构拆分方案</Title>

    <Title level={3} className="section-subtitle">3.1 模块关系图</Title>
    <MermaidChart chart={archDiagram} />

    <Title level={3} className="section-subtitle">3.2 三个后端模块</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card title={<span style={{ color: '#10b981' }}>A. 指标中心</span>} extra={<Tag color="green">已有</Tag>}>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
            <li>指标值查询（单值/批量/趋势）</li>
            <li>维度拆解查询</li>
            <li>公式计算</li>
            <li>同比环比</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title={<span style={{ color: '#3b82f6' }}>B. 归因引擎</span>} extra={<Tag color="blue">新增</Tag>}>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
            <li>结构归因 / 维度归因</li>
            <li>变化量分解</li>
            <li>异常根因分析</li>
            <li>证据链生成</li>
            <li>主因排序</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title={<span style={{ color: '#ec4899' }}>C. Agent 层</span>} extra={<Tag color="magenta">新增</Tag>}>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
            <li>意图识别</li>
            <li>流程编排</li>
            <li>工具调用</li>
            <li>结果解释</li>
            <li>多轮追问</li>
          </ul>
        </Card>
      </Col>
    </Row>
  </section>
)

/* ============================================================
   四、归因引擎
   ============================================================ */
const rootCauseDiagram = `
graph LR
  A["GMV 下降 100万"] --> B["订单量下降 贡献 80%"]
  B --> C["华东地区 贡献 60%"]
  C --> D["安卓端 贡献 45%"]
  D --> E["3/15 突降 置信度 92%"]
  style A fill:#fee2e2,stroke:#dc2626
  style B fill:#fee2e2,stroke:#dc2626
  style C fill:#fff7ed,stroke:#ea580c
  style D fill:#fef9c3,stroke:#ca8a04
  style E fill:#ecfdf3,stroke:#16a34a
`

export const EngineSection: React.FC = () => (
  <section id="sec-engine" className="section-block">
    <Title level={2} className="section-title">四、归因引擎详细设计</Title>

    <Title level={3} className="section-subtitle">4.1 六项核心能力</Title>
    <Timeline
      items={[
        {
          dot: <ThunderboltOutlined style={{ color: '#6366f1', fontSize: 16 }} />,
          children: (
            <>
              <Text strong style={{ fontSize: 15 }}>1. 结构归因</Text>
              <Paragraph type="secondary" style={{ margin: '6px 0' }}>从"静态比例"升级为"变化量贡献"</Paragraph>
              <div className="code-block">
                <pre>旧: 贡献度 = childValue / parentValue{'\n'}新: 变化贡献 = (child_now - child_prev) / (parent_now - parent_prev)</pre>
              </div>
              <Paragraph type="secondary">使用差异分解法: ΔG = P̄ₙ × ΔQ + Q̄ₒ × ΔP + ΔP × ΔQ</Paragraph>
            </>
          ),
        },
        {
          dot: <FundOutlined style={{ color: '#6366f1', fontSize: 16 }} />,
          children: (
            <>
              <Text strong style={{ fontSize: 15 }}>2. 维度归因</Text>
              <Paragraph type="secondary" style={{ margin: '6px 0' }}>回答"哪个地区/渠道/终端导致变化最大"</Paragraph>
              <div className="waterfall-chart">
                <div className="wf-bar negative" style={{ height: 120 }}><span>华东 -60万<br />60%</span></div>
                <div className="wf-bar negative" style={{ height: 60 }}><span>华南 -30万<br />30%</span></div>
                <div className="wf-bar negative" style={{ height: 30 }}><span>华北 -15万<br />15%</span></div>
                <div className="wf-bar positive" style={{ height: 10 }}><span>西南 +5万<br />-5%</span></div>
              </div>
            </>
          ),
        },
        {
          dot: <BranchesOutlined style={{ color: '#6366f1', fontSize: 16 }} />,
          children: (
            <>
              <Text strong style={{ fontSize: 15 }}>3. 主因路径分析</Text>
              <Paragraph type="secondary" style={{ margin: '6px 0' }}>组合结构归因 + 维度归因 + 异常检测为完整根因链路</Paragraph>
              <MermaidChart chart={rootCauseDiagram} />
            </>
          ),
        },
        {
          dot: <AimOutlined style={{ color: '#6366f1', fontSize: 16 }} />,
          children: (
            <>
              <Text strong style={{ fontSize: 15 }}>4. 异常检测联动</Text>
              <Paragraph type="secondary">检测异常 → 自动触发归因 → 生成根因报告</Paragraph>
            </>
          ),
        },
        {
          dot: <ExperimentOutlined style={{ color: '#6366f1', fontSize: 16 }} />,
          children: (
            <>
              <Text strong style={{ fontSize: 15 }}>5. 结果排序</Text>
              <Paragraph type="secondary"><Text code>score = |contribution| × confidence × recency_weight</Text></Paragraph>
            </>
          ),
        },
        {
          dot: <SafetyOutlined style={{ color: '#6366f1', fontSize: 16 }} />,
          children: (
            <>
              <Text strong style={{ fontSize: 15 }}>6. 证据生成</Text>
              <Paragraph type="secondary">为每条结论附上数据、趋势、异常日期等证据</Paragraph>
            </>
          ),
        },
      ]}
    />

    <Title level={3} className="section-subtitle">4.2 能力分层</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="后端（归因引擎）" className="split-card" headStyle={{ color: '#10b981' }}>
          {['数值计算（差异分解/贡献度）', '维度拆解查询', '异常检测（统计方法）', '排序和过滤', '证据数据组装'].map((s, i) => (
            <div key={i} style={{ padding: '6px 0', color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
              <CheckCircleOutlined style={{ color: '#10b981', marginRight: 10 }} />{s}
            </div>
          ))}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Agent 层（LLM 驱动）" className="split-card" headStyle={{ color: '#a855f7' }}>
          {['意图识别（理解用户问题）', '分析流程编排', '工具选择和调用', '自然语言结果解释', '多轮追问上下文管理'].map((s, i) => (
            <div key={i} style={{ padding: '6px 0', color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
              <CheckCircleOutlined style={{ color: '#a855f7', marginRight: 10 }} />{s}
            </div>
          ))}
        </Card>
      </Col>
    </Row>
  </section>
)

/* ============================================================
   五、LLM 边界
   ============================================================ */
const llmSequence = `
sequenceDiagram
  participant U as 用户
  participant A as Agent
  participant L as LLM
  participant E as 归因引擎

  U->>A: "为什么这周 GMV 下滑？"
  A->>L: 意图识别
  L-->>A: {indicator: GMV, period: week}
  A->>L: 流程编排
  L-->>A: [结构归因→维度归因→异常检测]

  A->>E: structural_attribution(GMV)
  E-->>A: {主因: 订单量, 贡献: 80%}

  A->>E: dimension_attribution(订单量, 地区)
  E-->>A: {主因: 华东, 贡献: 60%}

  A->>E: anomaly_check(华东_订单量)
  E-->>A: {异常: true, date: 3/15}

  A->>L: 结果解释
  L-->>A: 自然语言报告
  A-->>U: GMV 下降 100 万，主因是华东地区订单量减少...
`

export const LLMSection: React.FC = () => (
  <section id="sec-llm" className="section-block">
    <Title level={2} className="section-title">五、LLM / Agent 的职责边界</Title>
    <Alert
      type="warning"
      showIcon
      message="LLM 不做数值计算，只做编排和解释。"
      style={{ marginBottom: 24 }}
    />

    <Title level={3} className="section-subtitle">5.1 工具调用流程</Title>
    <MermaidChart chart={llmSequence} />

    <Title level={3} className="section-subtitle">5.2 防失控机制</Title>
    <Row gutter={[14, 14]}>
      {[
        { t: '数据锚定', d: '每条结论必须引用工具返回的数据' },
        { t: '工具白名单', d: '只能调用预定义工具，禁止自由 SQL' },
        { t: '数值校验', d: '输出数值与工具返回一致性检查' },
        { t: '结构化输出', d: 'JSON 格式输出工具调用计划' },
        { t: '降级方案', d: 'LLM 解析失败时回退规则引擎' },
      ].map((item, i) => (
        <Col key={i} xs={24} sm={12}>
          <Card size="small" hoverable>
            <Text strong>{item.t}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>{item.d}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
)

/* ============================================================
   六、JDK8 落地
   ============================================================ */
export const JDK8Section: React.FC = () => (
  <section id="sec-jdk8" className="section-block">
    <Title level={2} className="section-title">六、JDK8 约束下的落地方案</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '方案', dataIndex: 'plan' },
        {
          title: 'JDK8 兼容', dataIndex: 'compat',
          render: (t: string, r: any) => <Tag color={r.compatColor}>{t}</Tag>,
        },
        {
          title: '判断', dataIndex: 'verdict',
          render: (t: string, r: any) => r.verdictColor ? <Tag color={r.verdictColor}>{t}</Tag> : t,
        },
      ]}
      dataSource={[
        { key: '1', plan: '插件内部 Java Agent', compat: '兼容', compatColor: 'green', verdict: '推荐', verdictColor: 'green' },
        { key: '2', plan: 'LangChain4j', compat: 'JDK11+', compatColor: 'red', verdict: '不可用', verdictColor: '' },
        { key: '3', plan: 'Spring AI', compat: 'JDK17+', compatColor: 'red', verdict: '不可用', verdictColor: '' },
        { key: '4', plan: '独立 Python Agent', compat: '独立进程', compatColor: 'green', verdict: '可选', verdictColor: 'orange' },
      ]}
    />

    <Title level={3} className="section-subtitle">轻量 Agent 核心实现</Title>
    <div className="code-block">
      <pre>{`\
`}<span className="kw">public class</span> <span className="cls">AttributionAgent</span> {'{'}{`
    `}<span className="kw">private final</span> LlmService llmService;{`
    `}<span className="kw">private final</span> ToolRegistry toolRegistry;{`
    `}<span className="kw">private final</span> ConversationManager conversation;{`

    `}<span className="kw">public</span> Stream&lt;String&gt; <span className="fn">analyze</span>(String userQuery, String treeId) {'{'}{`
        `}String systemPrompt = PromptBuilder.buildSystemPrompt({`
            `}toolRegistry.getToolDescriptions(){`
        `});{`
        `}List&lt;Message&gt; messages = conversation.getHistory();{`
        `}messages.add(<span className="kw">new</span> UserMessage(userQuery));{`

        `}<span className="kw">for</span> (<span className="kw">int</span> i = 0; i &lt; 5; i++) {'{'}{`
            `}LlmResponse response = llmService.chat(systemPrompt, messages);{`
            `}<span className="kw">if</span> (response.hasToolCalls()) {'{'}{`
                `}<span className="kw">for</span> (ToolCall call : response.getToolCalls()) {'{'}{`
                    `}Object result = toolRegistry.execute({`
                        `}call.getName(), call.getParams(){`
                    `});{`
                    `}messages.add(<span className="kw">new</span> ToolResultMessage({`
                        `}call.getId(), toJson(result){`
                    `}));{`
                `}{'}'}{`
            `}{'}'} <span className="kw">else</span> {'{'}{`
                `}<span className="kw">return</span> Stream.of(response.getText());{`
            `}{'}'}{`
        `}{'}'}{`
        `}<span className="kw">return</span> Stream.of(<span className="str">"分析完成，请查看归因面板。"</span>);{`
    `}{'}'}{`
`}{'}'}</pre>
    </div>
  </section>
)

/* ============================================================
   七、技术选型
   ============================================================ */
export const TechSelectionSection: React.FC = () => (
  <section id="sec-tech" className="section-block">
    <Title level={2} className="section-title">七、开源技术选型</Title>

    <Title level={3} className="section-subtitle">7.1 Python Agent 框架对比</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        {
          title: '框架', dataIndex: 'name',
          render: (t: string, r: any) => r.url
            ? <a href={r.url} target="_blank" rel="noopener noreferrer">{t} <LinkOutlined /></a>
            : t,
        },
        { title: 'Stars', dataIndex: 'stars', width: 80 },
        { title: '维护方', dataIndex: 'by', width: 110 },
        { title: '核心特点', dataIndex: 'feat' },
        {
          title: '判断', dataIndex: 'verdict', width: 90,
          render: (t: string, r: any) => <Tag color={r.tagColor}>{t}</Tag>,
        },
      ]}
      dataSource={[
        { key: '1', name: 'Pydantic AI', url: 'https://github.com/pydantic/pydantic-ai', stars: '16k', by: 'Pydantic 团队', feat: '类型安全、结构化输出验证、依赖注入', verdict: '推荐', tagColor: 'green' },
        { key: '2', name: 'OpenAI Agents SDK', url: 'https://github.com/openai/openai-agents-python', stars: '21k', by: 'OpenAI', feat: 'Handoffs、Guardrails、Session', verdict: '可选', tagColor: 'orange' },
        { key: '3', name: 'Google ADK', url: 'https://github.com/google/adk-python', stars: '19k', by: 'Google', feat: '多 Agent 编排、内置 UI、A2A 协议', verdict: '可选', tagColor: 'orange' },
        { key: '4', name: 'Agno', url: 'https://github.com/agno-agi/agno', stars: '20k', by: '社区', feat: 'API 极简、Playground UI', verdict: '可选', tagColor: 'orange' },
        { key: '5', name: 'CrewAI', url: 'https://github.com/crewAIInc/crewAI', stars: '27k', by: '社区', feat: '角色扮演多 Agent', verdict: '不匹配', tagColor: 'red' },
        { key: '6', name: 'LangChain', url: 'https://github.com/langchain-ai/langchain', stars: '100k', by: 'LangChain', feat: '功能全但过重', verdict: '过重', tagColor: 'red' },
      ]}
    />

    <Title level={3} className="section-subtitle">7.2 综合对比</Title>
    <Table
      pagination={false}
      size="small"
      bordered
      columns={[
        { title: '', dataIndex: 'dim', width: 100, fixed: 'left' },
        { title: '自建 Java', dataIndex: 'java' },
        { title: 'Pydantic AI', dataIndex: 'pydantic' },
        { title: 'OpenAI SDK', dataIndex: 'openai' },
        { title: 'Google ADK', dataIndex: 'adk' },
        { title: 'Agno', dataIndex: 'agno' },
      ]}
      dataSource={[
        { key: '1', dim: '代码量', java: '~500 行', pydantic: '~150 行', openai: '~100 行', adk: '~120 行', agno: '~80 行' },
        { key: '2', dim: '运维成本', java: '无', pydantic: '独立服务', openai: '独立服务', adk: '独立服务', agno: '独立服务' },
        { key: '3', dim: '类型安全', java: 'Java 原生', pydantic: '高', openai: '中', adk: '中', agno: '低' },
        { key: '4', dim: '输出验证', java: '需自行实现', pydantic: '自动重试', openai: 'Guardrails', adk: '一般', agno: '一般' },
        { key: '5', dim: '部署门槛', java: '无', pydantic: 'Py 3.10+', openai: 'Py 3.10+', adk: 'Py 3.10+', agno: 'Py 3.9+' },
      ]}
    />

    <Title level={3} className="section-subtitle">7.3 参考项目</Title>
    <Row gutter={[14, 14]}>
      {[
        { t: 'LinkedIn Thirdeye', d: 'Java · 时间序列异常检测 + 根因分析', url: 'https://github.com/startreedata/thirdeye' },
        { t: 'MS Adtributor 论文', d: '多维度归因算法', url: 'https://www.microsoft.com/en-us/research/publication/adtributor-revenue-debugging-in-advertising-systems/' },
        { t: 'Apache Commons Math', d: 'Java · 统计计算 · JDK8 兼容', url: 'https://github.com/apache/commons-math' },
        { t: 'Tablesaw', d: 'Java · 轻量数据表 · JDK8 兼容', url: 'https://github.com/jtablesaw/tablesaw' },
        { t: 'Netflix Lumen', d: '指标分析方法论', url: '' },
        { t: 'Uber Mastermind', d: 'Python · 异常检测 + 归因', url: '' },
      ].map((item, i) => (
        <Col key={i} xs={24} sm={12} md={8}>
          <Card size="small" hoverable>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer"><Text strong>{item.t}</Text> <LinkOutlined /></a>
            ) : (
              <Text strong>{item.t}</Text>
            )}
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>{item.d}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
)

/* ============================================================
   八、方案对比
   ============================================================ */
interface PlanData {
  letter: string; title: string; tag: string; tagColor: string;
  items: string[]; pro: string; con: string; className?: string;
}
const plans: PlanData[] = [
  {
    letter: 'A', title: '插件内增强', tag: 'MVP 可选', tagColor: 'blue',
    items: ['全部代码在现有插件内', 'Java Agent 复用 LlmService', 'JDK8 + Commons Math + X6', '无额外运维'],
    pro: '优：开发快、部署简单', con: '劣：归因引擎与插件耦合',
  },
  {
    letter: 'B', title: '归因引擎独立 + Agent 独立', tag: '早期不推荐', tagColor: 'orange',
    items: ['3 个独立服务 + 1 个前端插件', 'Java 微服务 + Python Agent', 'Redis + 消息队列'],
    pro: '优：解耦清晰', con: '劣：运维高、部署复杂',
  },
  {
    letter: 'C', title: 'Agent 中心化', tag: '有风险', tagColor: 'orange',
    items: ['Agent 为核心，归因做工具', '对话为主入口', '重度依赖 LLM Function Calling'],
    pro: '优：交互体验好', con: '劣：延迟大、成本高、受 LLM 可用性制约',
  },
  {
    letter: 'D', title: '混合渐进式', tag: '推荐', tagColor: 'green',
    items: ['MVP = 方案 A，成熟后向 B 演进', '确定性分析为主，对话为辅', '阶段一插件内 → 阶段二独立 JAR → 阶段三独立服务'],
    pro: '优：快速上线、风险可控、渐进演进', con: '劣：初始设计需预留拆分接口',
    className: 'plan-card-d',
  },
]

export const PlansSection: React.FC = () => (
  <section id="sec-plans" className="section-block">
    <Title level={2} className="section-title">八、四套方案对比</Title>
    <Row gutter={[16, 16]}>
      {plans.map((p) => (
        <Col key={p.letter} xs={24} md={12}>
          <Card
            className={p.className}
            hoverable
            title={<>方案 {p.letter} · {p.title}</>}
            extra={<Tag color={p.tagColor}>{p.tag}</Tag>}
          >
            <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginBottom: 12 }}>
              {p.items.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
            </ul>
            <div style={{ fontSize: 13 }}>
              <Text style={{ color: '#10b981' }}>{p.pro}</Text>
              <br />
              <Text style={{ color: '#ef4444', opacity: 0.85 }}>{p.con}</Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
)

/* ============================================================
   九、总结矩阵
   ============================================================ */
const levelRender = (val: string) => {
  const colorMap: Record<string, string> = {
    '高': '#10b981', '较高': '#10b981', '低': '#ef4444', '中': '#f59e0b', '较好': '#10b981', '一般': '#ef4444', '好': '#10b981',
  }
  return <Text style={{ color: colorMap[val] || undefined, fontWeight: 600 }}>{val}</Text>
}

export const SummarySection: React.FC = () => (
  <section id="sec-summary" className="section-block">
    <Title level={2} className="section-title">九、方案对比总结</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '', dataIndex: 'dim', width: 100, fixed: 'left' },
        { title: 'A 插件内', dataIndex: 'a', render: levelRender },
        { title: 'B 平台化', dataIndex: 'b', render: levelRender },
        { title: 'C Agent中心', dataIndex: 'c', render: levelRender },
        { title: 'D 混合渐进', dataIndex: 'd', render: levelRender },
      ]}
      dataSource={[
        { key: '1', dim: '开发速度', a: '高', b: '低', c: '中', d: '较高' },
        { key: '2', dim: '运维成本', a: '低', b: '高', c: '中', d: '低' },
        { key: '3', dim: '扩展性', a: '低', b: '高', c: '较高', d: '较高' },
        { key: '4', dim: '用户体验', a: '较好', b: '一般', c: '好', d: '较好' },
        { key: '5', dim: 'BI 适配', a: '高', b: '低', c: '中', d: '高' },
        { key: '6', dim: '判断', a: 'MVP 可选', b: '早期不推荐', c: '有风险', d: '推荐' },
      ]}
      rowClassName={(_, index) => index === 5 ? 'summary-verdict-row' : ''}
    />
  </section>
)

/* ============================================================
   十、MVP 计划
   ============================================================ */
const mvpPhases = [
  {
    phase: '阶段一', time: '2~4 周', title: '确定性归因', desc: '不依赖 LLM，纯规则引擎', active: true,
    items: ['后端: DeltaDecomposer + DimensionalAttributor', '前端: 归因按钮 → 面板（瀑布图 + 路径高亮 + 证据卡片）', 'API: 增强 /indicator/tree/calc/'],
  },
  {
    phase: '阶段二', time: '2 周', title: 'LLM 解释层', desc: '复用 LlmService + SSE 流式',
    items: ['归因结果传给 LLM 做自然语言解释', '面板底部增加 "AI 解读" 区域'],
  },
  {
    phase: '阶段三', time: '2~4 周', title: '对话式追问', desc: 'Java Agent + 多轮对话',
    items: ['AttributionAgent + 5~7 个工具', '顶部工具栏对话入口', '多轮追问: 归因 → 拆解 → 筛选 → 维度切换'],
  },
  {
    phase: '阶段四', time: '按需', title: '平台化拆分', desc: '归因能力跨产品共享时拆分',
    items: [],
  },
]

export const MVPSection: React.FC = () => (
  <section id="sec-mvp" className="section-block">
    <Title level={2} className="section-title">十、MVP 实施计划</Title>
    <Row gutter={[14, 14]}>
      {mvpPhases.map((p, i) => (
        <Col key={i} xs={24} sm={12} md={6}>
          <Card
            className={p.active ? 'roadmap-active' : undefined}
            hoverable
            style={{ height: '100%' }}
          >
            <Tag color="purple" style={{ fontSize: 11, marginBottom: 4 }}>{p.phase}</Tag>
            <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 10 }}>{p.time}</Text>
            <Text strong style={{ display: 'block', fontSize: 15, marginBottom: 6 }}>{p.title}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 13, marginBottom: 10 }}>{p.desc}</Text>
            {p.items.length > 0 && (
              <ul style={{ paddingLeft: 16, color: 'rgba(71,85,105,0.86)', fontSize: 12, margin: 0 }}>
                {p.items.map((item, j) => <li key={j} style={{ marginBottom: 3 }}>{item}</li>)}
              </ul>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  </section>
)

/* ============================================================
   十一、结论
   ============================================================ */
const conclusions = [
  { q: '产品形态', a: '嵌入拆解树（主入口）+ 对话面板（辅助）' },
  { q: '归因引擎', a: '不独立，插件内部 Java 模块' },
  { q: 'Agent', a: '不独立，JDK8 自建轻量 Agent' },
  { q: 'LLM 职责', a: '只做编排和解释，不做计算' },
  { q: 'JDK8 限制', a: '自建 Agent (~500 行) + Commons Math' },
  { q: '推荐方案', a: '方案 D（混合渐进式）', highlight: true },
]

export const ConclusionSection: React.FC = () => (
  <section id="sec-conclusion" className="section-block">
    <Title level={2} className="section-title">十一、结论</Title>
    <Row gutter={[14, 14]}>
      {conclusions.map((c, i) => (
        <Col key={i} xs={24} sm={12} md={8}>
          <Card size="small" hoverable>
            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 }}>{c.q}</Text>
            <div style={{ marginTop: 8 }}>
              {c.highlight ? (
                <Tag color="purple" style={{ fontSize: 14, padding: '4px 14px' }}>{c.a}</Tag>
              ) : (
                <Text strong>{c.a}</Text>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    <Alert
      type="success"
      showIcon
      style={{ marginTop: 28 }}
      message="平台化和 Agent 中心化都是可行的长期方向，当前阶段先在插件内做出 MVP，验证产品价值后再推进架构演进。"
    />
  </section>
)

/* ============================================================
   十二、预警机制追加评估
   ============================================================ */
const alertMechanismFlow = `
flowchart TD
  A[规则引擎扫描指标] --> B{达到预警阈值?}
  B -->|否| Z[继续监控]
  B -->|是| C[生成预警事件]
  C --> D[自动触发归因分析]
  D --> E[生成证据卡片与处置建议]
  E --> F[按推送策略路由]
  F --> G[客户与责任人接收]
  G --> H[回写状态与审计日志]

  style A fill:#eaf2ff,stroke:#2563eb
  style C fill:#fff7ed,stroke:#ea580c
  style D fill:#ecfdf3,stroke:#16a34a
  style E fill:#fdf4ff,stroke:#a21caf
  style F fill:#e0f2fe,stroke:#0284c7
  style G fill:#ecfdf3,stroke:#16a34a
  style H fill:#f8fafc,stroke:#64748b
`

export const AlertPlanSection: React.FC = () => (
  <section id="sec-alert-plan" className="section-block">
    <Title level={2} className="section-title">十二、预警机制追加架构方案评估</Title>

    <Title level={3} className="section-subtitle">12.1 触发与归因闭环</Title>
    <MermaidChart chart={alertMechanismFlow} />

    <Title level={3} className="section-subtitle">12.2 机制实现要点</Title>
    <Row gutter={[14, 14]}>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><BellOutlined /> 预警规则配置</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>阈值类型：绝对值/同比/环比/波动率</li>
            <li>监控粒度：日/周/月与维度切片</li>
            <li>静默窗口：夜间或节假日降噪</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><ApiOutlined /> 达阈自动归因</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>触发后调用结构归因 + 维度归因</li>
            <li>输出主因路径、贡献度与置信度</li>
            <li>自动附带异常时间点证据</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><SendOutlined /> 推送接收配置</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>接收对象：客户/负责人/协同群组</li>
            <li>渠道：站内、邮件、Webhook、IM</li>
            <li>支持升级策略与回执追踪</li>
          </ul>
        </Card>
      </Col>
    </Row>

    <Title level={3} className="section-subtitle">12.3 架构方案评估</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '方案', dataIndex: 'name', width: 170 },
        { title: '实现方式', dataIndex: 'impl' },
        { title: '优点', dataIndex: 'pros' },
        { title: '风险', dataIndex: 'risk' },
        { title: '结论', dataIndex: 'verdict', width: 100, render: (t: string, r: any) => <Tag color={r.color}>{t}</Tag> },
      ]}
      dataSource={[
        {
          key: 'a',
          name: 'A. 插件内闭环预警',
          impl: '规则检测 + 归因触发 + 推送在同一插件',
          pros: '上线快、链路短、无需额外运维',
          risk: '中后期跨系统复用能力弱',
          verdict: 'MVP 推荐',
          color: 'green',
        },
        {
          key: 'b',
          name: 'B. 独立预警中心',
          impl: '事件总线 + 独立服务统一推送',
          pros: '可复用、跨产品统一治理',
          risk: '改造重、建设周期长',
          verdict: '中后期',
          color: 'orange',
        },
        {
          key: 'c',
          name: 'C. 混合双层',
          impl: '插件内快速闭环 + 外部预留标准接口',
          pros: '兼顾交付速度与演进空间',
          risk: '接口治理要求较高',
          verdict: '推荐',
          color: 'green',
        },
      ]}
    />

    <Alert
      type="success"
      showIcon
      style={{ marginTop: 22 }}
      message="建议采用 C 方案：达到预警值后自动归因并按客户接收配置推送，先在插件内落地，再向统一预警中心演进。"
    />
  </section>
)

/* ============================================================
   十三、目标机制追加评估
   ============================================================ */
const targetMechanismFlow = `
flowchart TD
  A[目标库加载周期目标] --> B[实时值对比目标值]
  B --> C{偏差超出容忍带?}
  C -->|否| Z[记录达成率]
  C -->|是| D[生成目标偏差事件]
  D --> E[触发归因分析]
  E --> F[拆解责任维度与主因路径]
  F --> G[推送到目标负责人/客户]
  G --> H[跟踪整改与复盘]

  style A fill:#eaf2ff,stroke:#2563eb
  style B fill:#eef2ff,stroke:#4f46e5
  style D fill:#fff7ed,stroke:#ea580c
  style E fill:#ecfdf3,stroke:#16a34a
  style F fill:#fdf4ff,stroke:#a21caf
  style G fill:#e0f2fe,stroke:#0284c7
  style H fill:#f8fafc,stroke:#64748b
`

export const TargetPlanSection: React.FC = () => (
  <section id="sec-target-plan" className="section-block">
    <Title level={2} className="section-title">十三、目标机制追加架构方案评估</Title>

    <Title level={3} className="section-subtitle">13.1 目标偏差自动化闭环</Title>
    <MermaidChart chart={targetMechanismFlow} />

    <Title level={3} className="section-subtitle">13.2 机制实现要点</Title>
    <Row gutter={[14, 14]}>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><FlagOutlined /> 目标配置模型</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>目标周期：月/季/年 + 口径版本</li>
            <li>目标对象：总目标与维度子目标</li>
            <li>容忍带：绝对偏差与百分比偏差</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><BranchesOutlined /> 偏差归因分析</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>目标偏差触发后自动计算贡献路径</li>
            <li>识别责任维度（区域/渠道/端）</li>
            <li>输出可执行纠偏建议</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><SendOutlined /> 责任推送与协同</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>按责任矩阵推送对应负责人</li>
            <li>抄送客户/管理者并带处置链接</li>
            <li>支持追踪、升级、关闭流程</li>
          </ul>
        </Card>
      </Col>
    </Row>

    <Title level={3} className="section-subtitle">13.3 架构方案评估</Title>
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '方案', dataIndex: 'name', width: 170 },
        { title: '实现方式', dataIndex: 'impl' },
        { title: '优点', dataIndex: 'pros' },
        { title: '风险', dataIndex: 'risk' },
        { title: '结论', dataIndex: 'verdict', width: 100, render: (t: string, r: any) => <Tag color={r.color}>{t}</Tag> },
      ]}
      dataSource={[
        {
          key: 'a',
          name: 'A. 目标看板增强',
          impl: '在现有拆解树/看板中增加目标偏差闭环',
          pros: '改造小、用户迁移成本低',
          risk: '复杂目标场景治理能力有限',
          verdict: 'MVP 推荐',
          color: 'green',
        },
        {
          key: 'b',
          name: 'B. 独立目标管理域',
          impl: '独立目标服务 + 规则引擎 + 推送中心',
          pros: '标准化强、适配多业务线',
          risk: '建设成本高、周期长',
          verdict: '中后期',
          color: 'orange',
        },
        {
          key: 'c',
          name: 'C. 混合渐进',
          impl: '看板内闭环起步，保留目标域接口',
          pros: '当前可交付，未来可拆分',
          risk: '前期需约束接口边界',
          verdict: '推荐',
          color: 'green',
        },
      ]}
    />

    <Alert
      type="success"
      showIcon
      style={{ marginTop: 22 }}
      message="建议采用 C 方案：目标偏差触发后自动归因、自动推送责任人和客户接收对象，实现目标管理闭环。"
    />
  </section>
)

/* ============================================================
   十四、里程碑规划与评估
   ============================================================ */
const milestoneFlow = `
flowchart LR
  M0["M0 · 4月底\nAgent MVP"]
  M1["M1 · 5~6月\n增强归因"]
  M2["M2 · 7~8月\n完整闭环"]
  M3["M3 · 按需\n平台化"]

  M0 --> M1 --> M2 --> M3

  style M0 fill:#dcfce7,stroke:#16a34a,stroke-width:2px
  style M1 fill:#eaf2ff,stroke:#2563eb
  style M2 fill:#fff7ed,stroke:#ea580c
  style M3 fill:#f3e8ff,stroke:#9333ea
`

const existingCapFlow = `
flowchart TB
  subgraph JAVA["Java 后端 已有"]
    AS["AlertDetectionService\n4种规则 邮件+站内推送"]
    LS["LlmService\nOpenAI/Azure/Claude\n同步+SSE流式"]
    AD["AnomalyDetectionService\nZ-Score 滑动均值"]
    SS["SupervisionService\n督办 订阅 审计"]
  end

  subgraph FE["前端 已有"]
    AT["attribution.ts\nBFS贡献度 关键路径"]
    AE["alertEngine.ts\n规则评估 阈值/目标/衍生"]
    CS["canvasStore\n画布状态 协作 面板"]
  end

  subgraph NEW["新增 Agent 层"]
    AG["Agno Agent\nPython FastAPI"]
    JA["Java Agent Proxy\nHTTP 桥接"]
  end

  AG -->|HTTP 调用| AS
  AG -->|HTTP 调用| LS
  AG -->|HTTP 调用| AD
  JA -->|反向代理| AG
  FE -->|请求| JA

  style JAVA fill:#eaf2ff,stroke:#2563eb
  style FE fill:#ecfdf3,stroke:#16a34a
  style NEW fill:#fff7ed,stroke:#ea580c
`

const agnoArchFlow = `
flowchart LR
  U["用户 前端对话框"] -->|SSE| JP["Java Plugin\nAgent Proxy"]
  JP -->|HTTP| AGNO["Agno Agent\nFastAPI :8100"]

  subgraph TOOLS["Agent 工具集 调用 Java 已有 API"]
    T1["attribution_tool\n调用归因计算"]
    T2["alert_tool\n查询预警事件"]
    T3["anomaly_tool\n异常检测"]
    T4["data_tool\n取指标数据"]
    T5["breakdown_tool\n维度拆解"]
  end

  AGNO --> TOOLS
  TOOLS -->|HTTP 回调| JP2["Java API\n/indicator/tree/*"]

  style U fill:#ecfdf3,stroke:#16a34a
  style JP fill:#eaf2ff,stroke:#2563eb
  style AGNO fill:#fff7ed,stroke:#ea580c
  style TOOLS fill:#fdf4ff,stroke:#a21caf
  style JP2 fill:#eaf2ff,stroke:#2563eb
`

interface MilestoneItem {
  milestone: string
  time: string
  color: string
  tagColor: string
  summary: string
  reuse: { scope: string; detail: string }[]
  newBuild: { scope: string; detail: string }[]
  agent: { scope: string; detail: string }[]
  push: { scope: string; detail: string }[]
  deliverables: string[]
  exitCriteria: string
}

const milestones: MilestoneItem[] = [
  {
    milestone: 'M0 · Agent MVP',
    time: '4月底（~3 周）',
    color: '#16a34a',
    tagColor: 'green',
    summary: '基于 Agno (Python) 搭建归因 Agent，复用全部已有 Java 服务作为工具，跑通"对话式归因 + 邮件推送"端到端链路。同时在 Java 侧保留 Agent Proxy 为后续纯 Java Agent 验证做准备。',
    reuse: [
      { scope: 'AlertDetectionService', detail: '4 种规则检测 + 事件 CRUD + 去重 + 定时扫描 → 预警能力直接复用，零改造' },
      { scope: 'AlertNotificationService', detail: '邮件 (SMTP) + 站内推送 → 推送通道直接复用，Agent 触发即可' },
      { scope: 'LlmService', detail: 'OpenAI/Azure/Claude 同步 + SSE → Agent 通过 HTTP 调用获取 LLM 解读' },
      { scope: 'AnomalyDetectionService', detail: 'Z-Score + 滑动均值 → Agent 异常检测工具直接复用' },
      { scope: 'attribution.ts', detail: 'BFS 全树贡献度 + 关键路径 → 前端归因结果作为 Agent 输入上下文' },
      { scope: 'alertEngine.ts', detail: '前端规则评估 → 阈值/目标达成率/衍生指标三种 subject → 零改造' },
      { scope: '督办/订阅/评论/审计', detail: 'SupervisionService + SubscriptionService + CommentService + AuditLogService → 全部作为 Agent 可调用工具' },
    ],
    newBuild: [
      { scope: 'Agno Agent 服务', detail: 'Python FastAPI 服务 (port 8100)；定义 AttributionAgent，注册 5~7 个工具函数，每个工具通过 HTTP 回调 Java API' },
      { scope: 'Java Agent Proxy', detail: '新建 AgentProxyController，SSE 转发前端请求到 Agno，透传 session/auth；为后续替换为纯 Java Agent 留接口' },
      { scope: '归因工具简化', detail: 'attribution_tool: 接收节点 ID → 调用前端传来的归因结果（或调用 Java calc API 重算）→ 返回 Top-N 贡献路径' },
      { scope: '对话前端组件', detail: '拆解树工具栏增加对话入口，连接 AgentProxy SSE，展示多轮对话 + 引用跳转' },
      { scope: 'Agent 邮件推送', detail: 'Agent 在归因结论生成后，调用 AlertNotificationService 已有邮件通道发送归因摘要' },
    ],
    agent: [
      { scope: 'Agno Agent', detail: 'Python 侧：agno.Agent + agno.Tool 注册 → 工具调用 Java API → LLM 编排 → 流式输出' },
      { scope: 'Java Proxy', detail: 'AgentProxyController /indicator/tree/agent/chat (SSE)，转发到 http://localhost:8100/v1/runs' },
      { scope: '工具集 M0', detail: 'attribution_tool（归因）、alert_query_tool（查预警）、anomaly_tool（异常检测）、data_query_tool（取数）、notify_tool（推送邮件）' },
      { scope: '双栈验证', detail: '同一组测试用例，分别跑 Agno 和 Java SimpleAgent → 对比延迟/准确率/编排质量/运维成本 → M1 确定主力栈' },
    ],
    push: [
      { scope: '渠道', detail: '复用已有 EmailCenter.getDispatcher().send()，邮件模板包含归因摘要 + 证据 + 查看链接' },
      { scope: '触发方式', detail: 'Agent 归因完成后 → 自动调用 notify_tool → 邮件发送（无需用户手动）' },
    ],
    deliverables: [
      'Agno Agent 服务 (Python FastAPI + 5 个 Tool)',
      'Java AgentProxyController (SSE 转发)',
      'Java SimpleAgent (轻量对比验证)',
      '前端对话组件 (SSE + 多轮)',
      '归因 → 邮件推送自动闭环',
      '双栈 (Agno vs Java) 评估报告',
    ],
    exitCriteria: '对话追问"为什么GMV下降了?" → Agent 调用归因+异常检测 → 输出根因 → 邮件推送到收件人，端到端 < 30s。Java SimpleAgent 完成同场景对比。',
  },
  {
    milestone: 'M1 · 增强归因 + 维度分析',
    time: '5~6 月（4~6 周）',
    color: '#2563eb',
    tagColor: 'blue',
    summary: '根据 M0 双栈评估确定主力 Agent 栈；新增维度归因工具 + 多通道推送 + LLM 解读嵌入推送。',
    reuse: [
      { scope: '前端维度拆解', detail: '已有 14 种 FilterConverter + BreakdownService → Agent 维度拆解工具直接调用' },
      { scope: '订阅服务', detail: 'SubscriptionService (daily/realtime/alert_only) → Agent 按订阅模式定向推送' },
    ],
    newBuild: [
      { scope: 'DimensionalAttributor', detail: 'Java 新增：按维度字段拆分变化量，回答"哪个地区导致了下降"' },
      { scope: 'breakdown_tool', detail: 'Agent 新工具：调用 DimensionalAttributor → 返回维度贡献度排名' },
      { scope: 'IM Webhook', detail: '企业微信/飞书/钉钉 Webhook 推送适配器' },
      { scope: 'LLM 摘要嵌入', detail: 'Agent 归因结论 → LLM 生成摘要 → 自动嵌入邮件/IM 卡片' },
    ],
    agent: [
      { scope: '主力栈确定', detail: '根据 M0 评估报告决定：沿用 Agno OR 迁移到纯 Java Agent' },
      { scope: '新工具', detail: '+breakdown_tool（维度归因）、+comparison_tool（同比/环比）、+trend_tool（趋势分析）' },
      { scope: '记忆', detail: 'Agent 接入会话记忆（Agno SqliteDb 或 Java 侧 session store），支持多轮上下文' },
    ],
    push: [
      { scope: '渠道', detail: '邮件 + 站内 + 企业 IM (Webhook)' },
      { scope: '策略', detail: '静默窗口（夜间/休息日降噪）、聚合推送（同一指标多条预警合并）' },
    ],
    deliverables: [
      'DimensionalAttributor 维度归因模块',
      'Agent 新工具 3 个 (breakdown/comparison/trend)',
      'IM Webhook 推送适配器',
      'Agent 记忆 + 多轮上下文',
      'LLM 摘要自动嵌入推送消息',
    ],
    exitCriteria: '维度归因准确率 > 80%；推送到达率 > 99%；Agent 3 轮对话内定位维度根因。',
  },
  {
    milestone: 'M2 · 完整闭环 + 目标管理',
    time: '7~8 月（6~8 周）',
    color: '#ea580c',
    tagColor: 'orange',
    summary: '完整预警/目标闭环：多期归因、分级升级推送、目标偏差自动归因、Agent 知识库增强。',
    reuse: [
      { scope: '全部已有', detail: 'M0 + M1 所有服务和 Agent 工具持续复用' },
    ],
    newBuild: [
      { scope: '多期归因', detail: '同比/环比自动归因 + 日历效应校正' },
      { scope: '目标管理域', detail: '独立目标配置 + 偏差检测 + 责任矩阵 + 纠偏触发' },
      { scope: '推送升级', detail: '分级升级：30min 未响应 → 逐级升级 → 群通知' },
      { scope: '审计看板', detail: '预警/目标/归因全链路审计 + 复盘看板' },
    ],
    agent: [
      { scope: '知识库', detail: 'Agent 接入 RAG：历史归因报告 + 业务知识库 → 提升归因解释准确性' },
      { scope: '置信度', detail: 'Agent 输出每条归因的置信度分数 + 证据引用' },
      { scope: '自动化', detail: 'Agent 定时巡检：主动发现异常 → 生成归因报告 → 推送 → 无人值守' },
    ],
    push: [
      { scope: '渠道', detail: '全通道：邮件 + 站内 + IM + 短信 + 自定义 Webhook' },
      { scope: '策略', detail: '分级升级 + 回执追踪 + 超时自动关闭' },
    ],
    deliverables: [
      '多期归因引擎',
      '目标管理域 (配置/检测/责任矩阵)',
      '分级推送升级策略',
      'Agent RAG 知识库',
      '审计 + 复盘看板',
    ],
    exitCriteria: '预警 → 推送 → 处置闭环率 > 90%；目标偏差检测覆盖率 100%；Agent 巡检周报自动生成。',
  },
  {
    milestone: 'M3 · 平台化',
    time: '按需',
    color: '#9333ea',
    tagColor: 'purple',
    summary: '归因引擎 + Agent + 推送中心抽离为平台能力，跨业务线复用。',
    reuse: [
      { scope: '全部', detail: 'M0~M2 所有服务、工具、Agent 作为平台化基础' },
    ],
    newBuild: [
      { scope: '归因 SDK', detail: '归因引擎独立为 API 服务，支持任意指标体系接入' },
      { scope: '统一推送中心', detail: '所有应用共享消息路由 + 渠道 + 模板管理' },
      { scope: '统一预警中心', detail: '跨产品规则编排 + 事件聚合' },
    ],
    agent: [
      { scope: 'Agent Hub', detail: '多 Agent 注册中心，按领域分工：归因 Agent / 预警 Agent / 报告 Agent' },
      { scope: 'Agent Marketplace', detail: '工具集市场化：第三方可注册工具供 Agent 调用' },
    ],
    push: [
      { scope: '平台', detail: '统一推送中心：集中管理所有渠道、模板、配额' },
    ],
    deliverables: [
      '归因 Engine SDK / API',
      '统一预警中心',
      '统一推送中心',
      'Agent Hub + Marketplace',
    ],
    exitCriteria: '>= 2 个业务线接入；推送中心日均 > 10k 消息。',
  },
]

export const MilestoneSection: React.FC = () => (
  <section id="sec-milestone" className="section-block">
    <Title level={2} className="section-title">十四、里程碑规划与评估</Title>

    {/* 已有能力盘点 */}
    <Title level={3} className="section-subtitle">14.1 现有能力盘点（已实现，可直接复用）</Title>
    <Alert
      type="success"
      showIcon
      style={{ marginBottom: 16 }}
      message="当前插件已有完整的预警检测、邮件推送、LLM 对接、异常检测、协作等服务，Agent 层只需编排调用，无需重写底层能力。"
    />
    <MermaidChart chart={existingCapFlow} />
    <Table
      pagination={false}
      size="middle"
      bordered
      style={{ marginTop: 16 }}
      columns={[
        { title: '已有服务', dataIndex: 'service', width: 200 },
        { title: '能力', dataIndex: 'capability' },
        { title: 'Agent 复用方式', dataIndex: 'reuseAs' },
      ]}
      dataSource={[
        { key: '1', service: 'AlertDetectionService', capability: '4 种规则(阈值/目标偏离/波动/连续异常) + 事件CRUD + 去重 + 1分钟定时扫描', reuseAs: 'alert_query_tool / alert_detect_tool' },
        { key: '2', service: 'AlertNotificationService', capability: '邮件(SMTP) + 站内推送 + 规则级通知配置 + 接收人管理', reuseAs: 'notify_tool' },
        { key: '3', service: 'LlmService', capability: 'OpenAI/Azure/Claude 同步+SSE，支持7种 provider', reuseAs: 'Agno Agent 的 LLM backend / LLM 解读工具' },
        { key: '4', service: 'AnomalyDetectionService', capability: 'Z-Score + 滑动均值 + 自动模式，纯 Java 无依赖', reuseAs: 'anomaly_tool' },
        { key: '5', service: 'attribution.ts (前端)', capability: 'BFS 全树贡献度 + 关键路径 + 根因定位 + 贡献度等级', reuseAs: 'Agent 输入上下文 / attribution_tool' },
        { key: '6', service: 'alertEngine.ts (前端)', capability: '3种判断对象(值/达成率/衍生) + 可配规则 + 自动扫描', reuseAs: '前端预警联动' },
        { key: '7', service: 'ModelDataQueryService', capability: '指标取数 + 筛选 + 维度拆解 + 14种 FilterConverter', reuseAs: 'data_query_tool / breakdown_tool' },
        { key: '8', service: '协作服务群', capability: '督办 + 订阅(每日/实时/仅预警) + 评论 + 审计日志', reuseAs: 'supervision_tool / comment_tool' },
      ]}
    />

    {/* Agno 双栈架构 */}
    <Title level={3} className="section-subtitle">14.2 M0 双栈架构：Agno (Python) + Java Agent Proxy</Title>
    <MermaidChart chart={agnoArchFlow} />
    <Row gutter={[14, 14]} style={{ marginTop: 16 }}>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><ExperimentOutlined /> 为什么用 Agno</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>Python 生态 Agent 框架成熟，Agno 20 行即可启动</li>
            <li>内置 FastAPI 运行时，原生 SSE 流式 + 会话隔离</li>
            <li>Tool 注册极简：@tool 装饰器 HTTP 调用 Java API</li>
            <li>内置 SqliteDb 会话存储 + tracing 审计</li>
            <li>团队协作（Team）和工作流（Workflow）一步到位</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><SafetyOutlined /> Java Proxy 的价值</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>前端不直连 Python，统一 Java 入口保持架构一致</li>
            <li>Proxy 层做权限校验 + 请求审计 + 限流</li>
            <li>后续可平滑替换为纯 Java Agent 而前端无感</li>
            <li>M0 同时在 Proxy 内实现简单 SimpleAgent 做对比</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><ThunderboltOutlined /> 双栈验证策略</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>同一组测试用例，分别跑 Agno 和 Java SimpleAgent</li>
            <li>对比维度：响应延迟、工具调用准确率、编排质量、运维成本</li>
            <li>M0 结束出评估报告，M1 确定主力栈</li>
            <li>无论哪条路线胜出，Java API 工具集不变</li>
          </ul>
        </Card>
      </Col>
    </Row>

    {/* 整体节奏 */}
    <Title level={3} className="section-subtitle">14.3 整体节奏</Title>
    <MermaidChart chart={milestoneFlow} />

    {milestones.map((m, idx) => (
      <div key={idx} style={{ marginBottom: 32 }}>
        <Title level={3} className="section-subtitle" style={{ borderLeft: `4px solid ${m.color}`, paddingLeft: 12 }}>
          14.{idx + 4} {m.milestone}
          <Tag color={m.tagColor} style={{ marginLeft: 10, fontSize: 12, verticalAlign: 'middle' }}>{m.time}</Tag>
        </Title>

        <Alert type="info" showIcon icon={<ScheduleOutlined />} style={{ marginBottom: 16 }} message={m.summary} />

        {/* 复用已有服务 */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><CheckCircleOutlined /> 复用已有服务</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '服务', dataIndex: 'scope', width: 180 },
              { title: '复用说明', dataIndex: 'detail' },
            ]}
            dataSource={m.reuse.map((a, i) => ({ key: `r${i}`, ...a }))}
          />
        </Card>

        {/* 新建内容 */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><RocketOutlined /> 新建内容</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '模块', dataIndex: 'scope', width: 180 },
              { title: '实现说明', dataIndex: 'detail' },
            ]}
            dataSource={m.newBuild.map((a, i) => ({ key: `n${i}`, ...a }))}
          />
        </Card>

        {/* Agent */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><ApiOutlined /> Agent 层</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '能力项', dataIndex: 'scope', width: 180 },
              { title: '说明', dataIndex: 'detail' },
            ]}
            dataSource={m.agent.map((a, i) => ({ key: `ag${i}`, ...a }))}
          />
        </Card>

        {/* 推送 */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><MailOutlined /> 推送能力</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '能力项', dataIndex: 'scope', width: 120 },
              { title: '说明', dataIndex: 'detail' },
            ]}
            dataSource={m.push.map((a, i) => ({ key: `p${i}`, ...a }))}
          />
        </Card>

        {/* 交付物 & 退出标准 */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={14}>
            <Card size="small" title={<><RocketOutlined /> 交付物</>} style={{ height: '100%' }}>
              <ul style={{ paddingLeft: 18, margin: 0, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
                {m.deliverables.map((d, i) => <li key={i} style={{ marginBottom: 4 }}>{d}</li>)}
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card size="small" title={<><TrophyOutlined /> 退出标准</>} style={{ height: '100%' }}>
              <Paragraph style={{ margin: 0, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>{m.exitCriteria}</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    ))}

    {/* M0 简化策略 */}
    <Title level={3} className="section-subtitle">14.8 M0 归因引擎简化说明</Title>
    <Alert
      type="info"
      showIcon
      style={{ marginBottom: 16 }}
      message="M0 不是从零造归因引擎，而是让 Agent 编排已有服务。归因能力本身已经在插件中运行，Agent 的价值是让用户用自然语言驱动这些能力。"
    />
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '维度', dataIndex: 'dimension', width: 140 },
        { title: 'M0 范围', dataIndex: 'mvpDo' },
        { title: '简化依据', dataIndex: 'reason' },
        { title: '何时补齐', dataIndex: 'when', width: 80 },
      ]}
      dataSource={[
        { key: '1', dimension: '归因算法', mvpDo: '复用现有 BFS 贡献度 + 关键路径，Agent 包装为 attribution_tool', reason: '已有 attribution.ts 全套实现，无需新写算法', when: '\u2014' },
        { key: '2', dimension: '维度归因', mvpDo: 'M0 不做；Agent 仅展示拆解树关键路径', reason: '需新增 DimensionalAttributor，工作量偏大', when: 'M1' },
        { key: '3', dimension: '异常检测', mvpDo: '复用 AnomalyDetectionService (Z-Score + 滑动均值)', reason: '已有 3 种算法（含自动模式），零改造', when: '\u2014' },
        { key: '4', dimension: '预警检测', mvpDo: '复用 AlertDetectionService 全部 4 种规则', reason: '阈值/目标偏离/波动/连续异常全部已实现', when: '\u2014' },
        { key: '5', dimension: '推送', mvpDo: '复用 AlertNotificationService 邮件通道', reason: '已有 SMTP + 规则级接收人配置', when: 'M1 加 IM' },
        { key: '6', dimension: 'LLM 解读', mvpDo: '复用 LlmService，Agent 在归因后自动调 LLM 生成摘要', reason: '已有同步 + SSE，支持 7 种 provider', when: '\u2014' },
        { key: '7', dimension: 'Agent 编排', mvpDo: 'Agno Agent + 5 个 Tool；Java SimpleAgent 对比验证', reason: 'Agno 20 行搭建，Tool 是 HTTP 调用已有 API', when: 'M1 定栈' },
        { key: '8', dimension: '对话 UI', mvpDo: '拆解树工具栏增加对话入口，SSE 流式展示', reason: '复用已有 requestSSE 基础设施', when: 'M1 增强' },
      ]}
    />

    <Alert
      type="warning"
      showIcon
      style={{ marginTop: 22 }}
      message="M0 核心原则：Agent 从第一天就上线，不做技术储备。已有服务是 Agent 的手脚，Agent 只需学会什么时候用哪只手。4月底交付，端到端验证用自然语言驱动归因分析 + 邮件推送的产品价值。"
    />
  </section>
)
