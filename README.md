# Alibaba-MVP

Alibaba-MVP 是一个面向阿里国际站卖家的前端演示系统，当前实现为 React + Ant Design 的运营驾驶舱原型。项目通过本地 mock 数据模拟客户会话、业务卡片捕获、任务链路、账号身份与 Agent 配置管理，便于快速展示 MaaAlibaba/Supplier Intelligence 类产品的核心交互闭环。

## 项目亮点

- **运营驾驶舱**：聚合历史消息、未读跟进、卡片资产、Agent 能力与任务状态，提供快捷入口和趋势视图。
- **聊天工作台**：支持客户会话列表、聊天时间线、买家消息翻译、AI 回复建议、客户意图/阶段分析、草稿保存提示与模拟发送。
- **客户信息沉淀**：展示买家身份、联系方式、行为数据、质量标签、潜力分和可用性信息。
- **业务卡片资产池**：统一展示产品卡、询盘卡与通用卡，支持按类型过滤和分页复核。
- **系统状态监控**：模拟身份、代理、Receiver 与任务队列状态，支持刷新健康检查和创建测试任务。
- **Agent 控制台**：管理 LLM 层级配置、系统 Agent、普通 AgentPreset、工具授权和测试对话历史。
- **账号操作模拟**：支持卖家账号信息查看、切换账号、登出与缓存清除提示。

## 技术栈

- **框架**：React 19、React Router DOM 6
- **UI 组件**：Ant Design 5、@ant-design/icons
- **内容渲染**：marked（Markdown 分析结果渲染）
- **工程脚手架**：react-scripts 5
- **数据来源**：本地 mock 数据与异步 mock service

## 目录结构

```text
Alibaba-MVP/
├── README.md
└── React-Example/
    ├── public/                 # CRA 静态资源
    ├── src/
    │   ├── components/          # 通用组件：状态标签、卡片渲染、任务表格、趋势图等
    │   ├── layouts/             # 应用布局、导航、账号弹窗
    │   ├── mock/                # 会话、客户、卡片、Agent、任务、状态等 mock 数据
    │   ├── pages/               # 首页、聊天、卡片池、系统状态、Agent 控制台
    │   ├── services/            # 异步 mock 服务：翻译、建议、分析、状态刷新、任务生命周期
    │   ├── utils/               # 时间格式化、分组、文本导出工具
    │   ├── App.js               # 路由与 Ant Design 主题配置
    │   └── index.js             # 应用入口
    ├── package.json
    ├── package-lock.json
    └── pnpm-lock.yaml
```

## 快速开始

> 推荐使用 Node.js 18+。项目目录中同时存在 `package-lock.json` 与 `pnpm-lock.yaml`，请选择一种包管理器并保持一致。

### 1. 进入前端目录

```bash
cd React-Example
```

### 2. 安装依赖

使用 pnpm：

```bash
pnpm install
```

或使用 npm：

```bash
npm install
```

### 3. 启动开发服务

```bash
pnpm dev
# 或
npm run dev
```

启动后访问：

```text
http://localhost:3000
```

### 4. 构建生产包

```bash
pnpm build
# 或
npm run build
```

## 可用脚本

在 [React-Example/package.json](React-Example/package.json) 中定义了以下脚本：

| 命令 | 说明 |
| --- | --- |
| `npm start` / `pnpm start` | 启动 CRA 开发服务器 |
| `npm run dev` / `pnpm dev` | 启动 CRA 开发服务器 |
| `npm run build` / `pnpm build` | 生成生产构建产物 |
| `npm test` / `pnpm test` | 运行测试 |
| `npm run eject` / `pnpm eject` | 弹出 CRA 配置（不可逆，谨慎使用） |

## 页面说明

### 首页 / 运营驾驶舱

首页汇总运营关键指标，包括历史消息、未读消息、卡片资产数量、Agent 数量、重点客户雷达、Agent 能力矩阵、任务链路摘要和卡片捕获趋势。

### 聊天工作台

聊天页围绕客户会话处理设计，包含：

- 按更新时间分组的客户会话列表
- 聊天消息时间线与业务卡片内嵌展示
- 买家消息翻译与重新翻译
- AI 回复建议弹窗，并可一键填充到输入框
- 客户意图分析、客户阶段分析的 Markdown 渲染结果
- 客户详情页签与批量导出模拟
- 发送前确认、测试填充与模拟发送

### 卡片池

卡片池用于复核从消息流中捕获的业务卡片，当前支持产品卡、询盘卡和通用卡的筛选、展示与分页。

### 系统状态

系统状态页展示身份、代理、Receiver 等关键链路的健康状态，并提供 mock 任务创建、任务生命周期演示和任务删除能力。

### Agent 控制台

Agent 控制台包含三个核心区域：

- **LLM 配置**：维护全局 SYSTEM_PROMPT、模型层级、Base URL、API Key、上下文窗口和工具轮次。
- **系统 Agent**：编辑内置翻译、回复建议、客户意图分析、客户阶段分析等 Agent 的等级和 Prompt。
- **普通 Agent**：创建、编辑、删除 AgentPreset，配置工具授权，并通过测试对话台验证 Prompt 行为。

## 数据与限制

当前版本是前端 MVP / 原型演示，主要逻辑均基于本地 mock：

- 不会真实调用阿里国际站、CRM、LLM 或外部 UI 自动化接口。
- 发送消息、翻译、客户分析、状态刷新和任务执行均为模拟流程。
- Agent、LLM 配置和账号操作只在前端状态中演示，不会持久化到后端。
- 导出聊天功能会在浏览器侧生成模拟 TXT 文件。


