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
  M0["M0 · 4月底\n过渡Agent MVP"]
  M1["M1 · 5~6月\n增强+标准化"]
  M2["M2 · 7~8月\n对接Data Agent"]
  M3["M3 · 按需\n深度融合"]

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

  subgraph TOOL["标准化 Tool API 层 (永久资产)"]
    TL["Tool 接口合约\nHTTP REST + JSON Schema"]
  end

  subgraph AGENT["Agent 层 (可替换)"]
    AG["过渡: Agno Agent"]
    DA["目标: 公司 Data Agent"]
  end

  AG -.->|"M0~M1 过渡"| TL
  DA -.->|"M2 接入"| TL
  TL -->|调用| AS
  TL -->|调用| LS
  TL -->|调用| AD
  FE -->|数据| TL

  style JAVA fill:#eaf2ff,stroke:#2563eb
  style FE fill:#ecfdf3,stroke:#16a34a
  style TOOL fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
  style AGENT fill:#fff7ed,stroke:#ea580c
`

const transitionFlow = `
flowchart LR
  subgraph M0_M1["M0~M1 过渡阶段"]
    FE1["前端"] -->|SSE| JP1["Java Plugin\nAgent Proxy"]
    JP1 -->|HTTP| AG1["Agno Agent\nFastAPI :8100"]
    AG1 --> TL1["Tool API"]
    TL1 --> API1["Java Services"]
  end

  subgraph M2_AFTER["M2 对接 Data Agent"]
    FE2["前端"] -->|SSE| JP2["Java Plugin\nAgent Proxy"]
    JP2 -->|标准协议| DA2["公司 Data Agent\n中台"]
    DA2 --> TL2["Tool API\n(同一套)"]
    TL2 --> API2["Java Services"]
  end

  M0_M1 ==>|"Proxy 层切换\n前端零改动\nTool API 不变"| M2_AFTER

  style M0_M1 fill:#ecfdf3,stroke:#16a34a
  style M2_AFTER fill:#eaf2ff,stroke:#2563eb
  style AG1 fill:#fff7ed,stroke:#ea580c
  style DA2 fill:#fdf4ff,stroke:#9333ea
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
    milestone: 'M0 \u00b7 \u8fc7\u6e21 Agent MVP',
    time: '4\u6708\u5e95\uff08~3 \u5468\uff09',
    color: '#16a34a',
    tagColor: 'green',
    summary: '\u7528 Agno (Python) \u5feb\u901f\u642d\u5efa\u8fc7\u6e21\u6027 Agent\uff0c\u590d\u7528\u5168\u90e8\u5df2\u6709 Java \u670d\u52a1\u4f5c\u4e3a\u5de5\u5177\uff0c\u8dd1\u901a\u201c\u5bf9\u8bdd\u5f0f\u5f52\u56e0 + \u90ae\u4ef6\u63a8\u9001\u201d\u7aef\u5230\u7aef\u94fe\u8def\u3002\u91cd\u70b9\u662f\u5b9a\u4e49\u6e05\u6670\u7684 Tool API \u5408\u7ea6\uff0c\u4f5c\u4e3a\u540e\u7eed\u5bf9\u63a5 Data Agent \u7684\u6c38\u4e45\u8d44\u4ea7\u3002',
    reuse: [
      { scope: 'AlertDetectionService', detail: '4 \u79cd\u89c4\u5219\u68c0\u6d4b + \u4e8b\u4ef6 CRUD + \u53bb\u91cd + \u5b9a\u65f6\u626b\u63cf \u2192 \u9884\u8b66\u80fd\u529b\u76f4\u63a5\u590d\u7528\uff0c\u96f6\u6539\u9020' },
      { scope: 'AlertNotificationService', detail: '\u90ae\u4ef6 (SMTP) + \u7ad9\u5185\u63a8\u9001 \u2192 \u63a8\u9001\u901a\u9053\u76f4\u63a5\u590d\u7528\uff0cAgent \u89e6\u53d1\u5373\u53ef' },
      { scope: 'LlmService', detail: 'OpenAI/Azure/Claude \u540c\u6b65 + SSE \u2192 Agent \u901a\u8fc7 HTTP \u8c03\u7528\u83b7\u53d6 LLM \u89e3\u8bfb' },
      { scope: 'AnomalyDetectionService', detail: 'Z-Score + \u6ed1\u52a8\u5747\u503c \u2192 Agent \u5f02\u5e38\u68c0\u6d4b\u5de5\u5177\u76f4\u63a5\u590d\u7528' },
      { scope: 'attribution.ts', detail: 'BFS \u5168\u6811\u8d21\u732e\u5ea6 + \u5173\u952e\u8def\u5f84 \u2192 \u524d\u7aef\u5f52\u56e0\u7ed3\u679c\u4f5c\u4e3a Agent \u8f93\u5165\u4e0a\u4e0b\u6587' },
      { scope: '\u7763\u529e/\u8ba2\u9605/\u8bc4\u8bba/\u5ba1\u8ba1', detail: '\u5168\u90e8\u4f5c\u4e3a Agent \u53ef\u8c03\u7528\u5de5\u5177' },
    ],
    newBuild: [
      { scope: 'Tool API \u5408\u7ea6\u5c42', detail: '\u5b9a\u4e49\u6807\u51c6\u5316\u7684 Tool \u63a5\u53e3\u89c4\u8303\uff08HTTP REST + JSON Schema\uff09\uff0c\u6bcf\u4e2a Tool \u5177\u5907\u72ec\u7acb endpoint\u3001\u5165\u53c2/\u51fa\u53c2 schema\u3001\u9274\u6743\u3002\u8fd9\u5957\u5408\u7ea6\u662f\u6c38\u4e45\u8d44\u4ea7\uff0c\u65e0\u8bba Agent \u5982\u4f55\u66f4\u6362\u90fd\u4e0d\u53d8' },
      { scope: 'Agno Agent \u670d\u52a1\uff08\u8fc7\u6e21\uff09', detail: 'Python FastAPI \u670d\u52a1 (port 8100)\uff1b\u6ce8\u518c 5~7 \u4e2a Tool\uff0c\u6bcf\u4e2a\u901a\u8fc7 HTTP \u56de\u8c03 Java API\u3002\u8fc7\u6e21\u65b9\u6848\uff0cM2 \u5c06\u88ab Data Agent \u66ff\u4ee3' },
      { scope: 'Java Agent Proxy', detail: '\u65b0\u5efa AgentProxyController\uff0cSSE \u8f6c\u53d1\u524d\u7aef\u8bf7\u6c42\u5230 Agent\uff0c\u900f\u4f20 session/auth\u3002Proxy \u662f\u6c38\u4e45\u7ec4\u4ef6\uff0c\u540e\u7eed\u5207\u6362\u5230 Data Agent \u65f6\u53ea\u9700\u6539 Proxy \u4e0b\u6e38\u5730\u5740' },
      { scope: '\u5bf9\u8bdd\u524d\u7aef\u7ec4\u4ef6', detail: '\u62c6\u89e3\u6811\u5de5\u5177\u680f\u589e\u52a0\u5bf9\u8bdd\u5165\u53e3\uff0c\u8fde\u63a5 AgentProxy SSE\uff0c\u5c55\u793a\u591a\u8f6e\u5bf9\u8bdd + \u5f15\u7528\u8df3\u8f6c' },
      { scope: 'Agent \u90ae\u4ef6\u63a8\u9001', detail: 'Agent \u5728\u5f52\u56e0\u7ed3\u8bba\u751f\u6210\u540e\uff0c\u8c03\u7528 notify_tool \u901a\u8fc7\u5df2\u6709\u90ae\u4ef6\u901a\u9053\u53d1\u9001\u5f52\u56e0\u6458\u8981' },
    ],
    agent: [
      { scope: 'Agno Agent\uff08\u8fc7\u6e21\uff09', detail: 'Python \u4fa7 agno.Agent + Tool \u6ce8\u518c \u2192 \u5de5\u5177\u8c03\u7528 Java API \u2192 LLM \u7f16\u6392 \u2192 \u6d41\u5f0f\u8f93\u51fa\u3002M2 \u5c06\u88ab\u516c\u53f8 Data Agent \u66ff\u6362' },
      { scope: 'Agent Proxy', detail: 'AgentProxyController /indicator/tree/agent/chat (SSE)\uff0c\u8f6c\u53d1\u5230 Agno\uff0c\u540e\u7eed\u5207\u6362\u4e3a Data Agent \u65f6\u524d\u7aef\u65e0\u611f' },
      { scope: '\u5de5\u5177\u96c6 M0', detail: 'attribution_tool\u3001alert_query_tool\u3001anomaly_tool\u3001data_query_tool\u3001notify_tool \u2014\u2014 \u8fd9\u4e9b\u5de5\u5177\u662f\u6c38\u4e45\u8d44\u4ea7\uff0c\u540e\u7eed\u76f4\u63a5\u6ce8\u518c\u5230 Data Agent' },
      { scope: '\u8bbe\u8ba1\u539f\u5219', detail: 'Agent \u53ef\u66ff\u6362\uff0cTool API \u4e0d\u53ef\u66ff\u6362 \u2014\u2014 \u6240\u6709\u5de5\u5177\u6309 Data Agent \u6807\u51c6\u5408\u7ea6\u8bbe\u8ba1\uff0c\u7830\u4fdd M2 \u5bf9\u63a5\u96f6\u6539\u9020' },
    ],
    push: [
      { scope: '\u6e20\u9053', detail: '\u590d\u7528\u5df2\u6709 EmailCenter\uff0c\u90ae\u4ef6\u6a21\u677f\u5305\u542b\u5f52\u56e0\u6458\u8981 + \u8bc1\u636e + \u67e5\u770b\u94fe\u63a5' },
      { scope: '\u89e6\u53d1\u65b9\u5f0f', detail: 'Agent \u5f52\u56e0\u5b8c\u6210\u540e \u2192 \u81ea\u52a8\u8c03\u7528 notify_tool \u2192 \u90ae\u4ef6\u53d1\u9001' },
    ],
    deliverables: [
      '\u6807\u51c6\u5316 Tool API \u5408\u7ea6\u6587\u6863\uff08JSON Schema + \u63a5\u53e3\u89c4\u8303\uff09',
      'Agno Agent \u670d\u52a1\uff08\u8fc7\u6e21\uff0cPython FastAPI + 5 \u4e2a Tool\uff09',
      'Java AgentProxyController (SSE \u8f6c\u53d1\uff0c\u6c38\u4e45\u7ec4\u4ef6)',
      '\u524d\u7aef\u5bf9\u8bdd\u7ec4\u4ef6 (SSE + \u591a\u8f6e)',
      '\u5f52\u56e0 \u2192 \u90ae\u4ef6\u63a8\u9001\u81ea\u52a8\u95ed\u73af',
      'Data Agent \u5bf9\u63a5\u53ef\u884c\u6027\u8bc4\u4f30\u62a5\u544a',
    ],
    exitCriteria: '\u5bf9\u8bdd\u8ffd\u95ee\u201c\u4e3a\u4ec0\u4e48GMV\u4e0b\u964d\u4e86?\u201d \u2192 Agent \u8c03\u7528\u5f52\u56e0+\u5f02\u5e38\u68c0\u6d4b \u2192 \u8f93\u51fa\u6839\u56e0 \u2192 \u90ae\u4ef6\u63a8\u9001\uff0c\u7aef\u5230\u7aef < 30s\u3002Tool API \u5408\u7ea6\u6587\u6863\u5b8c\u6210\u8bc4\u5ba1\u3002',
  },
  {
    milestone: 'M1 \u00b7 \u589e\u5f3a + \u6807\u51c6\u5316',
    time: '5~6 \u6708\uff084~6 \u5468\uff09',
    color: '#2563eb',
    tagColor: 'blue',
    summary: '\u589e\u5f3a\u5f52\u56e0\u80fd\u529b\uff08\u7ef4\u5ea6\u5f52\u56e0\u3001\u591a\u671f\u5bf9\u6bd4\uff09\uff0c\u6269\u5c55\u63a8\u9001\u6e20\u9053\uff0c\u5c06 Tool API \u5b8c\u5168\u5bf9\u9f50 Data Agent \u6807\u51c6\u534f\u8bae\uff0c\u4e3a M2 \u65e0\u7f1d\u5207\u6362\u505a\u51c6\u5907\u3002',
    reuse: [
      { scope: '\u524d\u7aef\u7ef4\u5ea6\u62c6\u89e3', detail: '\u5df2\u6709 14 \u79cd FilterConverter + BreakdownService \u2192 Agent \u7ef4\u5ea6\u62c6\u89e3\u5de5\u5177\u76f4\u63a5\u8c03\u7528' },
      { scope: '\u8ba2\u9605\u670d\u52a1', detail: 'SubscriptionService (daily/realtime/alert_only) \u2192 Agent \u6309\u8ba2\u9605\u6a21\u5f0f\u5b9a\u5411\u63a8\u9001' },
    ],
    newBuild: [
      { scope: 'DimensionalAttributor', detail: 'Java \u65b0\u589e\uff1a\u6309\u7ef4\u5ea6\u5b57\u6bb5\u62c6\u5206\u53d8\u5316\u91cf\uff0c\u56de\u7b54\u201c\u54ea\u4e2a\u5730\u533a\u5bfc\u81f4\u4e86\u4e0b\u964d\u201d' },
      { scope: 'breakdown_tool', detail: 'Tool API \u65b0\u589e\uff1a\u8c03\u7528 DimensionalAttributor \u2192 \u8fd4\u56de\u7ef4\u5ea6\u8d21\u732e\u5ea6\u6392\u540d' },
      { scope: 'IM Webhook', detail: '\u4f01\u4e1a\u5fae\u4fe1/\u98de\u4e66/\u9489\u9489 Webhook \u63a8\u9001\u9002\u914d\u5668' },
      { scope: 'Tool API \u5bf9\u9f50 Data Agent', detail: '\u6309 Data Agent \u6807\u51c6\u534f\u8bae\u6539\u9020 Tool\uff1a\u7edf\u4e00\u63cf\u8ff0\u683c\u5f0f\u3001\u53c2\u6570 schema\u3001\u9274\u6743\u65b9\u5f0f\u3001\u9519\u8bef\u7801\u89c4\u8303\u3001\u5de5\u5177\u6ce8\u518c\u6d41\u7a0b' },
    ],
    agent: [
      { scope: 'Agno \u7ee7\u7eed\u4f7f\u7528', detail: 'M1 \u4ecd\u7528 Agno \u8fc7\u6e21\uff0c\u65b0\u589e 3 \u4e2a\u5de5\u5177 (breakdown/comparison/trend)' },
      { scope: '\u8bb0\u5fc6', detail: 'Agent \u63a5\u5165\u4f1a\u8bdd\u8bb0\u5fc6\uff08Agno SqliteDb\uff09\uff0c\u652f\u6301\u591a\u8f6e\u4e0a\u4e0b\u6587' },
      { scope: 'Data Agent \u9884\u5bf9\u63a5', detail: '\u4e0e Data Agent \u56e2\u961f\u5bf9\u9f50\u63a5\u53e3\u534f\u8bae\uff0c\u5b8c\u6210 Tool \u6ce8\u518c\u6d41\u7a0b\u6d4b\u8bd5\uff0c\u786e\u4fdd M2 \u5207\u6362\u65e0\u963b\u529b' },
    ],
    push: [
      { scope: '\u6e20\u9053', detail: '\u90ae\u4ef6 + \u7ad9\u5185 + \u4f01\u4e1a IM (Webhook)' },
      { scope: '\u7b56\u7565', detail: '\u9759\u9ed8\u7a97\u53e3\uff08\u591c\u95f4/\u4f11\u606f\u65e5\u964d\u566a\uff09\u3001\u805a\u5408\u63a8\u9001\uff08\u540c\u4e00\u6307\u6807\u591a\u6761\u9884\u8b66\u5408\u5e76\uff09' },
    ],
    deliverables: [
      'DimensionalAttributor \u7ef4\u5ea6\u5f52\u56e0\u6a21\u5757',
      'Agent \u65b0\u5de5\u5177 3 \u4e2a (breakdown/comparison/trend)',
      'IM Webhook \u63a8\u9001\u9002\u914d\u5668',
      'Tool API \u5b8c\u5168\u5bf9\u9f50 Data Agent \u6807\u51c6',
      'Data Agent \u63a5\u5165\u6d4b\u8bd5\u62a5\u544a',
    ],
    exitCriteria: '\u7ef4\u5ea6\u5f52\u56e0\u51c6\u786e\u7387 > 80%\uff1b\u5168\u90e8 Tool API \u901a\u8fc7 Data Agent \u6807\u51c6\u534f\u8bae\u9a8c\u8bc1\uff1b\u63a8\u9001\u5230\u8fbe\u7387 > 99%\u3002',
  },
  {
    milestone: 'M2 \u00b7 \u5bf9\u63a5 Data Agent',
    time: '7~8 \u6708\uff086~8 \u5468\uff09',
    color: '#ea580c',
    tagColor: 'orange',
    summary: '\u4e0b\u7ebf Agno \u8fc7\u6e21 Agent\uff0c\u5c06\u6307\u6807\u62c6\u89e3\u6811\u7684 Tool API \u6b63\u5f0f\u6ce8\u518c\u5230\u516c\u53f8 Data Agent \u4e2d\u53f0\uff0cAgent Proxy \u5207\u6362\u4e0b\u6e38\u5730\u5740\uff0c\u524d\u7aef\u96f6\u6539\u52a8\u3002\u540c\u65f6\u5229\u7528 Data Agent \u53ef\u89c6\u5316\u7f16\u6392\u80fd\u529b\u6784\u5efa\u66f4\u590d\u6742\u7684\u5206\u6790\u5de5\u4f5c\u6d41\u3002',
    reuse: [
      { scope: '\u5168\u90e8 Tool API', detail: 'M0 + M1 \u5efa\u8bbe\u7684\u6240\u6709 Tool API \u76f4\u63a5\u6ce8\u518c\u5230 Data Agent\uff0c\u96f6\u4ee3\u7801\u6539\u52a8' },
      { scope: 'Agent Proxy', detail: '\u4ec5\u4fee\u6539 Proxy \u4e0b\u6e38\u5730\u5740\uff1a\u4ece localhost:8100 \u5207\u4e3a Data Agent \u4e2d\u53f0\u5730\u5740' },
    ],
    newBuild: [
      { scope: 'Data Agent \u5de5\u5177\u6ce8\u518c', detail: '\u5c06\u5168\u90e8 Tool\uff08\u5f52\u56e0/\u9884\u8b66/\u5f02\u5e38/\u53d6\u6570/\u63a8\u9001/\u7ef4\u5ea6\uff09\u6ce8\u518c\u5230 Data Agent \u5de5\u5177\u4e2d\u5fc3' },
      { scope: '\u591a\u671f\u5f52\u56e0', detail: '\u540c\u6bd4/\u73af\u6bd4\u81ea\u52a8\u5f52\u56e0 + \u65e5\u5386\u6548\u5e94\u6821\u6b63' },
      { scope: '\u76ee\u6807\u7ba1\u7406\u57df', detail: '\u72ec\u7acb\u76ee\u6807\u914d\u7f6e + \u504f\u5dee\u68c0\u6d4b + \u8d23\u4efb\u77e9\u9635 + \u7ea0\u504f\u89e6\u53d1' },
      { scope: 'Data Agent \u5de5\u4f5c\u6d41', detail: '\u5229\u7528 Data Agent \u53ef\u89c6\u5316\u7f16\u6392\u80fd\u529b\uff0c\u6784\u5efa\u201c\u5b9a\u65f6\u5de1\u68c0 \u2192 \u5f02\u5e38\u53d1\u73b0 \u2192 \u5f52\u56e0\u5206\u6790 \u2192 \u63a8\u9001\u62a5\u544a\u201d\u81ea\u52a8\u5316\u5de5\u4f5c\u6d41' },
      { scope: '\u5ba1\u8ba1\u770b\u677f', detail: '\u9884\u8b66/\u76ee\u6807/\u5f52\u56e0\u5168\u94fe\u8def\u5ba1\u8ba1 + \u590d\u76d8\u770b\u677f' },
    ],
    agent: [
      { scope: '\u4e0b\u7ebf Agno', detail: '\u505c\u6b62 Agno FastAPI \u670d\u52a1\uff0c\u79fb\u9664 Python \u4f9d\u8d56\uff0c\u8fd0\u7ef4\u590d\u6742\u5ea6\u964d\u4e3a\u96f6' },
      { scope: 'Data Agent \u4e3b\u5bfc', detail: '\u6240\u6709 Agent \u6d41\u91cf\u7ecf\u7531\u516c\u53f8 Data Agent \u4e2d\u53f0\uff0c\u4eab\u53d7\u4e2d\u53f0\u7684\u8d1f\u8f7d\u5747\u8861\u3001\u76d1\u63a7\u3001\u591a\u6a21\u578b\u5207\u6362\u7b49\u80fd\u529b' },
      { scope: '\u7f16\u6392\u589e\u5f3a', detail: '\u5229\u7528 Data Agent \u7684 Workflow/Orchestration \u6784\u5efa\u591a\u6b65\u5206\u6790\u6d41\u7a0b' },
    ],
    push: [
      { scope: '\u6e20\u9053', detail: '\u5168\u901a\u9053\uff1a\u90ae\u4ef6 + \u7ad9\u5185 + IM + \u77ed\u4fe1 + \u81ea\u5b9a\u4e49 Webhook' },
      { scope: '\u7b56\u7565', detail: '\u5206\u7ea7\u5347\u7ea7 + \u56de\u6267\u8ffd\u8e2a + \u8d85\u65f6\u81ea\u52a8\u5173\u95ed' },
    ],
    deliverables: [
      'Data Agent \u5de5\u5177\u6ce8\u518c\u5b8c\u6210\uff08\u5168\u90e8 Tool\uff09',
      'Agno \u6b63\u5f0f\u4e0b\u7ebf\uff0c\u751f\u4ea7\u73af\u5883\u5207\u6362\u5230 Data Agent',
      '\u591a\u671f\u5f52\u56e0\u5f15\u64ce',
      '\u76ee\u6807\u7ba1\u7406\u57df',
      'Data Agent \u81ea\u52a8\u5316\u5de5\u4f5c\u6d41',
      '\u5ba1\u8ba1 + \u590d\u76d8\u770b\u677f',
    ],
    exitCriteria: 'Agno \u5b8c\u5168\u4e0b\u7ebf\uff0c\u751f\u4ea7\u6d41\u91cf 100% \u7ecf\u7531 Data Agent\uff1b\u524d\u7aef\u96f6\u6539\u52a8\u9a8c\u8bc1\u901a\u8fc7\uff1b\u76ee\u6807\u504f\u5dee\u68c0\u6d4b\u8986\u76d6\u7387 100%\u3002',
  },
  {
    milestone: 'M3 \u00b7 \u6df1\u5ea6\u878d\u5408',
    time: '\u6309\u9700',
    color: '#9333ea',
    tagColor: 'purple',
    summary: '\u6df1\u5ea6\u878d\u5408 Data Agent \u751f\u6001\uff1a\u5171\u4eab\u77e5\u8bc6\u5e93\u3001\u8de8\u4e1a\u52a1\u7ebf Agent \u534f\u4f5c\u3001\u5f52\u56e0\u80fd\u529b\u5e73\u53f0\u5316\u8f93\u51fa\u3002',
    reuse: [
      { scope: '\u5168\u90e8', detail: 'M0~M2 \u6240\u6709\u670d\u52a1\u3001Tool API\u3001Proxy \u4f5c\u4e3a\u57fa\u7840' },
    ],
    newBuild: [
      { scope: '\u5f52\u56e0 SDK', detail: '\u5f52\u56e0\u5f15\u64ce\u72ec\u7acb\u4e3a API \u670d\u52a1\uff0c\u652f\u6301\u4efb\u610f\u6307\u6807\u4f53\u7cfb\u63a5\u5165' },
      { scope: '\u7edf\u4e00\u63a8\u9001\u4e2d\u5fc3', detail: '\u6240\u6709\u5e94\u7528\u5171\u4eab\u6d88\u606f\u8def\u7531 + \u6e20\u9053 + \u6a21\u677f\u7ba1\u7406' },
      { scope: '\u7edf\u4e00\u9884\u8b66\u4e2d\u5fc3', detail: '\u8de8\u4ea7\u54c1\u89c4\u5219\u7f16\u6392 + \u4e8b\u4ef6\u805a\u5408' },
    ],
    agent: [
      { scope: 'Data Agent \u77e5\u8bc6\u5e93', detail: '\u63a5\u5165 Data Agent RAG\uff1a\u5386\u53f2\u5f52\u56e0\u62a5\u544a + \u4e1a\u52a1\u77e5\u8bc6 \u2192 \u63d0\u5347\u89e3\u91ca\u51c6\u786e\u6027' },
      { scope: '\u8de8\u4e1a\u52a1\u7ebf\u534f\u4f5c', detail: '\u901a\u8fc7 Data Agent \u5de5\u5177\u5e02\u573a\uff0c\u5176\u4ed6\u4e1a\u52a1\u7ebf\u53ef\u76f4\u63a5\u8c03\u7528\u5f52\u56e0\u5de5\u5177' },
    ],
    push: [
      { scope: '\u5e73\u53f0', detail: '\u7edf\u4e00\u63a8\u9001\u4e2d\u5fc3\uff1a\u96c6\u4e2d\u7ba1\u7406\u6240\u6709\u6e20\u9053\u3001\u6a21\u677f\u3001\u914d\u989d' },
    ],
    deliverables: [
      '\u5f52\u56e0 Engine SDK / API',
      '\u7edf\u4e00\u9884\u8b66\u4e2d\u5fc3',
      '\u7edf\u4e00\u63a8\u9001\u4e2d\u5fc3',
      'Data Agent \u77e5\u8bc6\u5e93\u63a5\u5165',
      '\u8de8\u4e1a\u52a1\u7ebf\u5de5\u5177\u5e02\u573a\u5f00\u653e',
    ],
    exitCriteria: '>= 2 \u4e2a\u4e1a\u52a1\u7ebf\u901a\u8fc7 Data Agent \u8c03\u7528\u5f52\u56e0\u5de5\u5177\uff1b\u63a8\u9001\u4e2d\u5fc3\u65e5\u5747 > 10k \u6d88\u606f\u3002',
  },
]

export const MilestoneSection: React.FC = () => (
  <section id="sec-milestone" className="section-block">
    <Title level={2} className="section-title">\u5341\u56db\u3001\u91cc\u7a0b\u7891\u89c4\u5212\u4e0e\u8bc4\u4f30</Title>

    {/* \u5df2\u6709\u80fd\u529b\u76d8\u70b9 */}
    <Title level={3} className="section-subtitle">14.1 \u73b0\u6709\u80fd\u529b\u76d8\u70b9\uff08\u5df2\u5b9e\u73b0\uff0c\u53ef\u76f4\u63a5\u590d\u7528\uff09</Title>
    <Alert
      type="success"
      showIcon
      style={{ marginBottom: 16 }}
      message="\u5f53\u524d\u63d2\u4ef6\u5df2\u6709\u5b8c\u6574\u7684\u9884\u8b66\u68c0\u6d4b\u3001\u90ae\u4ef6\u63a8\u9001\u3001LLM \u5bf9\u63a5\u3001\u5f02\u5e38\u68c0\u6d4b\u3001\u534f\u4f5c\u7b49\u670d\u52a1\u3002\u8fc7\u6e21 Agent \u548c\u672a\u6765 Data Agent \u90fd\u53ea\u9700\u7f16\u6392\u8c03\u7528\uff0c\u65e0\u9700\u91cd\u5199\u5e95\u5c42\u80fd\u529b\u3002"
    />
    <MermaidChart chart={existingCapFlow} />
    <Table
      pagination={false}
      size="middle"
      bordered
      style={{ marginTop: 16 }}
      columns={[
        { title: '\u5df2\u6709\u670d\u52a1', dataIndex: 'service', width: 200 },
        { title: '\u80fd\u529b', dataIndex: 'capability' },
        { title: 'Tool API \u8f93\u51fa', dataIndex: 'reuseAs' },
      ]}
      dataSource={[
        { key: '1', service: 'AlertDetectionService', capability: '4 \u79cd\u89c4\u5219(\u9608\u503c/\u76ee\u6807\u504f\u79bb/\u6ce2\u52a8/\u8fde\u7eed\u5f02\u5e38) + \u4e8b\u4ef6CRUD + \u53bb\u91cd + 1\u5206\u949f\u5b9a\u65f6\u626b\u63cf', reuseAs: 'alert_query_tool / alert_detect_tool' },
        { key: '2', service: 'AlertNotificationService', capability: '\u90ae\u4ef6(SMTP) + \u7ad9\u5185\u63a8\u9001 + \u89c4\u5219\u7ea7\u901a\u77e5\u914d\u7f6e + \u63a5\u6536\u4eba\u7ba1\u7406', reuseAs: 'notify_tool' },
        { key: '3', service: 'LlmService', capability: 'OpenAI/Azure/Claude \u540c\u6b65+SSE\uff0c\u652f\u63017\u79cd provider', reuseAs: 'llm_tool' },
        { key: '4', service: 'AnomalyDetectionService', capability: 'Z-Score + \u6ed1\u52a8\u5747\u503c + \u81ea\u52a8\u6a21\u5f0f\uff0c\u7eaf Java \u65e0\u4f9d\u8d56', reuseAs: 'anomaly_tool' },
        { key: '5', service: 'attribution.ts (\u524d\u7aef)', capability: 'BFS \u5168\u6811\u8d21\u732e\u5ea6 + \u5173\u952e\u8def\u5f84 + \u6839\u56e0\u5b9a\u4f4d + \u8d21\u732e\u5ea6\u7b49\u7ea7', reuseAs: 'attribution_tool' },
        { key: '6', service: 'ModelDataQueryService', capability: '\u6307\u6807\u53d6\u6570 + \u7b5b\u9009 + \u7ef4\u5ea6\u62c6\u89e3 + 14\u79cd FilterConverter', reuseAs: 'data_query_tool / breakdown_tool' },
        { key: '7', service: '\u534f\u4f5c\u670d\u52a1\u7fa4', capability: '\u7763\u529e + \u8ba2\u9605(\u6bcf\u65e5/\u5b9e\u65f6/\u4ec5\u9884\u8b66) + \u8bc4\u8bba + \u5ba1\u8ba1\u65e5\u5fd7', reuseAs: 'supervision_tool / comment_tool' },
      ]}
    />

    {/* \u8fc7\u6e21\u67b6\u6784 \u2192 Data Agent */}
    <Title level={3} className="section-subtitle">14.2 \u67b6\u6784\u8bbe\u8ba1\uff1a\u8fc7\u6e21 Agent \u2192 \u516c\u53f8 Data Agent</Title>
    <Alert
      type="warning"
      showIcon
      style={{ marginBottom: 16 }}
      message="\u6838\u5fc3\u8bbe\u8ba1\u539f\u5219\uff1aAgent \u53ef\u66ff\u6362\uff0cTool API \u4e0d\u53ef\u66ff\u6362\u3002M0~M1 \u7528 Agno \u8fc7\u6e21\u5feb\u901f\u9a8c\u8bc1\uff0cM2 \u5207\u6362\u5230\u516c\u53f8 Data Agent \u4e2d\u53f0\uff0c\u524d\u7aef\u548c Tool API \u5c42\u96f6\u6539\u52a8\u3002"
    />
    <MermaidChart chart={transitionFlow} />
    <Row gutter={[14, 14]} style={{ marginTop: 16 }}>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><ExperimentOutlined /> \u4e3a\u4ec0\u4e48\u8fc7\u6e21</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>\u516c\u53f8 Data Agent \u4e2d\u53f0\u5c1a\u5728\u5efa\u8bbe\u4e2d\uff0c\u652f\u6491\u4e0d\u4e86 4 \u6708\u5e95\u4e0a\u7ebf</li>
            <li>Agno 20 \u884c\u5373\u53ef\u542f\u52a8\uff0c\u51e0\u5929\u5185\u8dd1\u901a\u7aef\u5230\u7aef</li>
            <li>\u8fc7\u6e21\u671f\u9a8c\u8bc1\u4ea7\u54c1\u4ef7\u503c\uff0c\u4e0d\u7b49 Data Agent \u5c31\u7eea</li>
            <li>\u6240\u6709\u5de5\u4f5c\u91cf\u96f6\u6d6a\u8d39\uff1aTool API \u662f\u6c38\u4e45\u8d44\u4ea7</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><SafetyOutlined /> \u4e3a\u4ec0\u4e48\u80fd\u65e0\u7f1d\u5207\u6362</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li>Agent Proxy \u5c42\u89e3\u8026\uff1a\u524d\u7aef\u53ea\u8ba4 Proxy\uff0c\u4e0d\u77e5\u9053\u4e0b\u6e38\u662f Agno \u8fd8\u662f Data Agent</li>
            <li>Tool API \u5408\u7ea6\u4ece M0 \u5f00\u59cb\u5c31\u6309 Data Agent \u6807\u51c6\u8bbe\u8ba1</li>
            <li>\u5207\u6362\u65f6\u53ea\u6539 Proxy \u914d\u7f6e\u7684\u4e0b\u6e38\u5730\u5740\uff0c\u4e00\u884c\u914d\u7f6e</li>
            <li>\u56de\u6eda\u65b9\u6848\uff1a\u5982\u679c Data Agent \u4e0d\u7a33\u5b9a\uff0c\u7acb\u5373\u5207\u56de Agno</li>
          </ul>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <Text strong><ThunderboltOutlined /> \u6c38\u4e45\u8d44\u4ea7 vs \u8fc7\u6e21\u7ec4\u4ef6</Text>
          <ul style={{ paddingLeft: 18, color: 'rgba(51,65,85,0.88)', fontSize: 13, marginTop: 8 }}>
            <li><Text strong>\u6c38\u4e45\uff1a</Text> Tool API \u5408\u7ea6\u3001Java \u670d\u52a1\u3001Agent Proxy\u3001\u524d\u7aef\u5bf9\u8bdd UI</li>
            <li><Text strong>\u8fc7\u6e21\uff1a</Text> Agno Agent (M0~M1)\uff0cM2 \u540e\u4e0b\u7ebf</li>
            <li>\u8fc7\u6e21\u671f\u4ea7\u51fa\u7684 Tool API \u5408\u7ea6\u548c\u6d4b\u8bd5\u7528\u4f8b 100% \u590d\u7528</li>
            <li>\u5de5\u4f5c\u91cf\u6295\u5165\u6bd4\uff1a\u6c38\u4e45\u8d44\u4ea7 85% / \u8fc7\u6e21\u7ec4\u4ef6 15%</li>
          </ul>
        </Card>
      </Col>
    </Row>

    {/* \u6574\u4f53\u8282\u594f */}
    <Title level={3} className="section-subtitle">14.3 \u6574\u4f53\u8282\u594f</Title>
    <MermaidChart chart={milestoneFlow} />

    {milestones.map((m, idx) => (
      <div key={idx} style={{ marginBottom: 32 }}>
        <Title level={3} className="section-subtitle" style={{ borderLeft: `4px solid ${m.color}`, paddingLeft: 12 }}>
          14.{idx + 4} {m.milestone}
          <Tag color={m.tagColor} style={{ marginLeft: 10, fontSize: 12, verticalAlign: 'middle' }}>{m.time}</Tag>
        </Title>

        <Alert type="info" showIcon icon={<ScheduleOutlined />} style={{ marginBottom: 16 }} message={m.summary} />

        {/* \u590d\u7528\u5df2\u6709\u670d\u52a1 */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><CheckCircleOutlined /> \u590d\u7528\u5df2\u6709\u670d\u52a1</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '\u670d\u52a1', dataIndex: 'scope', width: 180 },
              { title: '\u590d\u7528\u8bf4\u660e', dataIndex: 'detail' },
            ]}
            dataSource={m.reuse.map((a, i) => ({ key: `r${i}`, ...a }))}
          />
        </Card>

        {/* \u65b0\u5efa\u5185\u5bb9 */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><RocketOutlined /> \u65b0\u5efa\u5185\u5bb9</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '\u6a21\u5757', dataIndex: 'scope', width: 180 },
              { title: '\u5b9e\u73b0\u8bf4\u660e', dataIndex: 'detail' },
            ]}
            dataSource={m.newBuild.map((a, i) => ({ key: `n${i}`, ...a }))}
          />
        </Card>

        {/* Agent */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><ApiOutlined /> Agent \u5c42</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '\u80fd\u529b\u9879', dataIndex: 'scope', width: 180 },
              { title: '\u8bf4\u660e', dataIndex: 'detail' },
            ]}
            dataSource={m.agent.map((a, i) => ({ key: `ag${i}`, ...a }))}
          />
        </Card>

        {/* \u63a8\u9001 */}
        <Card size="small" style={{ marginBottom: 12 }} title={<><MailOutlined /> \u63a8\u9001\u80fd\u529b</>}>
          <Table
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: '\u80fd\u529b\u9879', dataIndex: 'scope', width: 120 },
              { title: '\u8bf4\u660e', dataIndex: 'detail' },
            ]}
            dataSource={m.push.map((a, i) => ({ key: `p${i}`, ...a }))}
          />
        </Card>

        {/* \u4ea4\u4ed8\u7269 & \u9000\u51fa\u6807\u51c6 */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={14}>
            <Card size="small" title={<><RocketOutlined /> \u4ea4\u4ed8\u7269</>} style={{ height: '100%' }}>
              <ul style={{ paddingLeft: 18, margin: 0, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>
                {m.deliverables.map((d, i) => <li key={i} style={{ marginBottom: 4 }}>{d}</li>)}
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card size="small" title={<><TrophyOutlined /> \u9000\u51fa\u6807\u51c6</>} style={{ height: '100%' }}>
              <Paragraph style={{ margin: 0, color: 'rgba(51,65,85,0.88)', fontSize: 13 }}>{m.exitCriteria}</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    ))}

    {/* \u8fc7\u6e21\u7b56\u7565\u6982\u89c8 */}
    <Title level={3} className="section-subtitle">14.8 \u8fc7\u6e21\u7b56\u7565\u4e0e\u5de5\u4f5c\u91cf\u5206\u6790</Title>
    <Alert
      type="info"
      showIcon
      style={{ marginBottom: 16 }}
      message="\u8fc7\u6e21 Agent \u4e0d\u662f\u6d6a\u8d39\uff0c\u800c\u662f\u6295\u8d44\u3002M0~M1 \u7684\u6838\u5fc3\u4ea7\u51fa\u662f\u6807\u51c6\u5316\u7684 Tool API \u5408\u7ea6\u548c\u7ecf\u8fc7\u9a8c\u8bc1\u7684\u5de5\u5177\u96c6\uff0c\u8fd9\u4e9b\u5728\u5bf9\u63a5 Data Agent \u65f6 100% \u590d\u7528\u3002\u8fc7\u6e21\u7ec4\u4ef6\uff08Agno\uff09\u4ec5\u5360\u603b\u5de5\u4f5c\u91cf\u7684 ~15%\u3002"
    />
    <Table
      pagination={false}
      size="middle"
      bordered
      columns={[
        { title: '\u7ef4\u5ea6', dataIndex: 'dimension', width: 160 },
        { title: '\u8fc7\u6e21\u671f (M0~M1)', dataIndex: 'transition' },
        { title: 'Data Agent \u671f (M2+)', dataIndex: 'dataAgent' },
        { title: '\u590d\u7528\u7387', dataIndex: 'reuse', width: 80 },
      ]}
      dataSource={[
        { key: '1', dimension: 'Tool API \u5408\u7ea6', transition: '\u5b9a\u4e49\u6807\u51c6\u5316\u63a5\u53e3\uff08JSON Schema + REST\uff09', dataAgent: '\u76f4\u63a5\u6ce8\u518c\u5230 Data Agent \u5de5\u5177\u4e2d\u5fc3', reuse: '100%' },
        { key: '2', dimension: 'Java \u670d\u52a1\u5c42', transition: '\u5df2\u6709 8+ \u670d\u52a1\uff0c\u5c01\u88c5\u4e3a Tool endpoint', dataAgent: '\u540c\u4e00\u5957 endpoint\uff0c\u96f6\u6539\u52a8', reuse: '100%' },
        { key: '3', dimension: 'Agent Proxy', transition: '\u8f6c\u53d1\u5230 Agno (localhost:8100)', dataAgent: '\u5207\u6362\u4e0b\u6e38\u5730\u5740\u5230 Data Agent', reuse: '95%' },
        { key: '4', dimension: '\u524d\u7aef\u5bf9\u8bdd UI', transition: 'SSE \u5bf9\u63a5 Proxy\uff0c\u591a\u8f6e\u5bf9\u8bdd + \u5f15\u7528\u8df3\u8f6c', dataAgent: '\u96f6\u6539\u52a8\uff0cProxy \u62bd\u8c61\u4e86 Agent \u5dee\u5f02', reuse: '100%' },
        { key: '5', dimension: '\u6d4b\u8bd5\u7528\u4f8b', transition: '\u7aef\u5230\u7aef\u6d4b\u8bd5 + \u5de5\u5177\u51c6\u786e\u7387\u9a8c\u8bc1', dataAgent: '\u540c\u4e00\u5957\u6d4b\u8bd5\u7528\u4f8b\u9a8c\u8bc1 Data Agent \u96c6\u6210', reuse: '100%' },
        { key: '6', dimension: 'Agno Agent\uff08\u8fc7\u6e21\uff09', transition: 'Python FastAPI + Tool \u6ce8\u518c + \u4f1a\u8bdd\u5b58\u50a8', dataAgent: '\u4e0b\u7ebf\u5e9f\u5f03\uff0c\u7531 Data Agent \u66ff\u4ee3', reuse: '0%' },
        { key: '7', dimension: '\u603b\u5de5\u4f5c\u91cf\u5360\u6bd4', transition: '\u6c38\u4e45\u8d44\u4ea7 ~85% / \u8fc7\u6e21\u4ee3\u7801 ~15%', dataAgent: '\u8fc7\u6e21\u4ee3\u7801\u5b8c\u5168\u79fb\u9664\uff0c\u65e0\u6280\u672f\u8d1f\u503a', reuse: '\u2014' },
      ]}
    />

    <Alert
      type="warning"
      showIcon
      style={{ marginTop: 22 }}
      message="M0 \u6838\u5fc3\u539f\u5219\uff1aAgent \u4ece\u7b2c\u4e00\u5929\u5c31\u4e0a\u7ebf\uff0c\u7528 Agno \u8fc7\u6e21\u5feb\u901f\u9a8c\u8bc1\u4ea7\u54c1\u4ef7\u503c\u3002\u6240\u6709\u5de5\u4f5c\u91cf\u6295\u5165\u5728\u6807\u51c6\u5316 Tool API \u4e0a\uff0cM2 \u65e0\u7f1d\u5207\u6362\u5230\u516c\u53f8 Data Agent \u4e2d\u53f0\u3002\u8fc7\u6e21\u4e0d\u662f\u6d6a\u8d39\uff0c\u662f\u62a2\u8dd1\u3002"
    />
  </section>
)
