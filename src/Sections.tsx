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
