export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  usage: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  category: string;
  tags: string[];
  source?: string;
  createdAt: string;
}

export const prompts: Prompt[] = [
  {
    id: "1",
    title: "对话交接",
    description: "当对话太长需要开新窗口时，让新AI快速了解你",
    content: `请根据我们之前所有的历史对话，为我生成一个详细的"相处模式说明书"，以便我在新对话中复制给你，让你能快速了解我。

这份说明书需包含：
1. 你对我的整体印象
2. 我分享过的关键个人信息与偏好
3. 我们之间建立的默契或共同风格
4. 你一贯的说话方式、语气和用词习惯

请尽力全面、有温度，像是在给另一个你写交接信。`,
    category: "沟通优化",
    tags: ["对话管理", "上下文", "效率"],
    usage: "在对话即将达到token限制时使用，生成一份个人画像供新对话使用",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "需求澄清专家",
    description: "将模糊需求转化为清晰可执行的任务",
    content: `我是一个需求澄清专家。当你给我一个模糊的需求时，我会：

1. 识别需求中不清楚的地方
2. 询问必要的上下文信息
3. 指出哪些信息如果不补充，我可以自行假设
4. 帮你整理成正式的任务提示词

请告诉我你的原始需求，我会帮你完善它。`,
    category: "沟通优化",
    tags: ["需求分析", "任务规划", "prompt工程"],
    usage: "在项目启动前使用，确保需求清晰完整",
    createdAt: "2024-02-03"
  },
  {
    id: "3",
    title: "代码审查员",
    description: "深度代码审查，发现潜在问题和改进点",
    content: `请扮演一位资深代码审查员，对以下代码进行全面审查：

【审查维度】
1. 代码质量和可读性
2. 潜在bug和边界情况
3. 性能优化机会
4. 安全漏洞
5. 设计模式应用
6. 测试覆盖情况

【输出格式】
- 🔴 严重问题：必须修复
- 🟡 建议改进：推荐采纳
- 🟢 良好实践：值得保持
- 💡 优化建议：可选提升

请提供具体的代码示例和改进方案。`,
    category: "代码开发",
    tags: ["代码审查", "质量", "最佳实践"],
    usage: "在提交代码前或代码review时使用",
    createdAt: "2024-02-20"
  },
  {
    id: "4",
    title: "Bug诊断专家",
    description: "系统性分析和解决bug",
    content: `我是一个Bug诊断专家。请描述你遇到的问题，我会按照以下流程帮你解决：

【诊断流程】
1. 问题确认：确保我理解症状
2. 信息收集：询问相关代码、环境、复现步骤
3. 根因分析：系统性排查可能原因
4. 解决方案：提供具体的修复方案
5. 预防措施：如何避免类似问题

【请提供】
- 错误现象描述
- 相关代码片段
- 运行环境信息
- 已尝试的解决方法`,
    category: "代码开发",
    tags: ["调试", "问题解决", "bug修复"],
    usage: "遇到难以解决的bug时使用",
    createdAt: "2024-03-08"
  },
  {
    id: "5",
    title: "学习路径规划师",
    description: "为任何技能制定系统学习计划",
    content: `请为我制定一个学习[技能名称]的系统化路径。

【规划框架】
1. 基础阶段（2-4周）
   - 核心概念理解
   - 环境搭建
   - 第一个可运行项目

2. 进阶阶段（4-8周）
   - 核心技能深入
   - 最佳实践学习
   - 中等复杂度项目

3. 实战阶段（持续）
   - 真实项目应用
   - 源码阅读
   - 社区贡献

【输出要求】
- 每个阶段的具体任务
- 推荐的学习资源
- 检验学习成果的标准
- 预计时间投入`,
    category: "学习成长",
    tags: ["学习", "规划", "技能提升"],
    usage: "学习新技术或技能前使用",
    createdAt: "2024-03-25"
  },
  {
    id: "6",
    title: "技术文档写手",
    description: "将技术内容转化为清晰的文档",
    content: `请将以下技术内容转化为专业的技术文档：

【文档结构】
1. 概述 - 一句话说明是什么
2. 背景 - 为什么需要这个
3. 使用场景 - 什么时候用
4. 快速开始 - 最小可运行示例
5. 详细说明 - 核心概念和API
6. 最佳实践 - 推荐用法
7. 常见问题 - FAQ

【写作风格】
- 简洁明了，避免冗余
- 代码示例完整可运行
- 适当使用图表说明
- 考虑不同读者水平`,
    category: "写作创作",
    tags: ["文档", "技术写作", "沟通"],
    usage: "需要写README、API文档或技术博客时使用",
    createdAt: "2024-04-10"
  },
  {
    id: "7",
    title: "创意思考伙伴",
    description: "Brainstorming和创意发散",
    content: `让我们来进行一次brainstorming session。

【主题】：[你的主题]

【思考框架】
1. 发散阶段 - 不加评判地产生尽可能多的想法
2. 连接阶段 - 寻找想法之间的关联和组合
3. 筛选阶段 - 评估可行性和价值
4. 深化阶段 - 对最有潜力的想法深入展开

【规则】
- 没有坏主意
- 鼓励疯狂的想法
- 在他人的想法上构建
- 延迟评判

请分享你的主题，我们开始！`,
    category: "思考分析",
    tags: ["brainstorming", "创意", "问题解决"],
    usage: "需要创新想法或解决复杂问题时使用",
    createdAt: "2024-04-28"
  },
  {
    id: "8",
    title: "决策分析助手",
    description: "系统性分析决策选项",
    content: `请帮我分析以下决策：

【决策问题】：[描述你的决策]
【选项】：[列出可选项]

【分析框架】
1. 目标澄清
   - 这个决策的核心目标是什么？
   - 成功的标准是什么？

2. 选项分析
   - 每个选项的 pros/cons
   - 所需资源和风险
   - 短期vs长期影响

3. 决策矩阵
   - 按重要性加权评分
   - 敏感性分析

4. 行动建议
   - 推荐方案及理由
   - 实施步骤
   - 风险缓解措施`,
    category: "思考分析",
    tags: ["决策", "分析", "理性思考"],
    usage: "面临重要决策时使用",
    createdAt: "2024-05-15"
  }
];

export const skills: Skill[] = [
  {
    id: "1",
    title: "Brainstorming",
    description: "在写代码前进行充分的构思和规划",
    instructions: [
      "激活时机：在开始写代码前自动激活",
      "核心流程：通过提问精炼粗糙想法，探索替代方案",
      "设计展示：分段展示设计方案供用户验证",
      "文档保存：将最终设计保存为设计文档",
      "禁止事项：不要直接跳转到代码实现"
    ],
    category: "开发流程",
    tags: ["设计", "规划", "思维"],
    source: "https://github.com/obra/superpowers",
    createdAt: "2024-01-20"
  },
  {
    id: "2",
    title: "Test-Driven Development",
    description: "红-绿-重构循环的测试驱动开发",
    instructions: [
      "RED：先写测试，确保测试失败",
      "GREEN：写最小代码让测试通过",
      "REFACTOR：重构代码，保持测试通过",
      "禁止：测试前不写任何实现代码",
      "提交：每个通过的阶段都要提交"
    ],
    category: "开发流程",
    tags: ["TDD", "测试", "质量"],
    source: "https://github.com/obra/superpowers",
    createdAt: "2024-02-05"
  },
  {
    id: "3",
    title: "Systematic Debugging",
    description: "四阶段系统性调试流程",
    instructions: [
      "Phase 1 - 复现：确保能稳定复现问题",
      "Phase 2 - 定位：缩小问题范围到最小代码",
      "Phase 3 - 假设：提出可能的原因假设",
      "Phase 4 - 验证：逐一验证假设",
      "工具使用：善用日志、断点、二分法"
    ],
    category: "问题解决",
    tags: ["调试", "问题排查", "系统化"],
    source: "https://github.com/obra/superpowers",
    createdAt: "2024-02-18"
  },
  {
    id: "4",
    title: "Subagent-Driven Development",
    description: "使用子代理并行处理复杂任务",
    instructions: [
      "任务分解：将大任务拆分为独立子任务",
      "代理分配：为每个子任务创建专门代理",
      "并行执行：同时运行多个子代理",
      "结果整合：合并各代理的输出",
      "质量检查：两阶段审查（规范符合+代码质量）"
    ],
    category: "开发流程",
    tags: ["代理", "并行", "效率"],
    source: "https://github.com/obra/superpowers",
    createdAt: "2024-03-12"
  },
  {
    id: "5",
    title: "Writing Plans",
    description: "创建详细的可执行计划",
    instructions: [
      "任务粒度：每个任务2-5分钟完成",
      "明确路径：包含确切的文件路径",
      "完整代码：提供完整的代码内容",
      "验证步骤：每个任务都有验证方法",
      "检查点：批处理中设置人工检查点"
    ],
    category: "项目管理",
    tags: ["规划", "任务管理", "执行"],
    source: "https://github.com/obra/superpowers",
    createdAt: "2024-04-01"
  },
  {
    id: "6",
    title: "Code Review",
    description: "请求和接收代码审查",
    instructions: [
      "自查清单：提交前对照规范自检",
      "问题分级：严重/建议/表扬",
      "具体反馈：指出具体位置和原因",
      "建设性：提供改进建议而非仅批评",
      "迭代处理：按优先级处理反馈"
    ],
    category: "代码质量",
    tags: ["代码审查", "协作", "质量"],
    source: "https://github.com/obra/superpowers",
    createdAt: "2024-04-20"
  }
];

export const categories = [
  "全部",
  "沟通优化",
  "代码开发",
  "学习成长",
  "写作创作",
  "思考分析",
  "开发流程",
  "问题解决",
  "项目管理",
  "代码质量"
];

export const stats = {
  totalPrompts: prompts.length,
  totalSkills: skills.length,
  totalCategories: [...new Set([...prompts.map(p => p.category), ...skills.map(s => s.category)])].length,
  topTags: [...new Set([...prompts.flatMap(p => p.tags), ...skills.flatMap(s => s.tags)])]
    .slice(0, 8)
};