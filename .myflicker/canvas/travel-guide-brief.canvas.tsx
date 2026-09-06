// skills: canvas
import { Button, Card, CardBody, CardHeader, Divider, H1, H3, Row, Stack, Text, useCanvasAction, useCanvasState, useHostTheme } from "codeflicker/canvas";

type SelectionMap = Record<string, string[]>;

// Canvas style source: references/website-design/themes/C-editorial.md
// 内容站场景采用编辑排版方向：暖白底、近黑文字、陶红少量强调、阅读优先。
const themePresets = [
  { label: "编辑杂志感", value: "editorial" },
  { label: "极简轻量", value: "minimal" },
  { label: "温暖旅行感", value: "warm" },
];

const questions = [
  { id: "goal", question: "这本旅行手册最重要的用途是什么？", hint: "可多选", multi: true, options: ["自己旅行时查看", "分享给同行者", "记录完整旅程", "作为可持续更新的行程中枢"] },
  { id: "modules", question: "首版必须保留哪些模块？", hint: "已根据你的要求预选核心模块，可继续调整", multi: true, options: ["行程倒计时", "路线总览图", "已确认机票与酒店", "逐日行程", "待办清单", "实用贴士"] },
  { id: "interaction", question: "哪些交互需要首版实现？", hint: "可多选", multi: true, options: ["地点点击后打开 Google Maps", "每天路线展开／收起", "白天黑夜自动换色", "跨时区倒计时", "手机端优先阅读"] },
  { id: "content", question: "当前信息不足的每日行程如何处理？", hint: "避免捏造尚未确定的安排", multi: false, options: ["显示为待补充状态", "先按文档已有内容整理", "只做日期骨架和住宿地点"] },
  { id: "visual", question: "视觉方向更偏向哪一种？", hint: "主题可在后续继续调整", multi: false, options: themePresets.map((item) => item.label) },
  { id: "delivery", question: "这次先做到什么程度？", hint: "后续可以继续迭代每日行程", multi: false, options: ["先完成可运行网页", "完成后继续本地预览调整", "同时准备部署上线"] },
];

function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const { tokens } = useHostTheme();
  return <div onClick={onClick} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${selected ? tokens.accent.primary : tokens.stroke.secondary}`, background: selected ? tokens.fill.secondary : tokens.fill.tertiary, color: selected ? tokens.text.primary : tokens.text.secondary, cursor: "pointer", userSelect: "none", fontSize: 13 }}>{label}</div>;
}

export default function TravelGuideBrief() {
  const { tokens } = useHostTheme();
  const dispatch = useCanvasAction();
  const [selections, setSelections] = useCanvasState<SelectionMap>("travel-guide-brief-selections", {
    modules: ["行程倒计时", "路线总览图", "已确认机票与酒店", "逐日行程", "待办清单", "实用贴士"],
    interaction: ["地点点击后打开 Google Maps", "每天路线展开／收起", "白天黑夜自动换色", "跨时区倒计时", "手机端优先阅读"],
    content: ["显示为待补充状态"],
  });

  const toggle = (id: string, value: string, multi: boolean) => setSelections((prev) => {
    const current = prev[id] ?? [];
    if (!multi) return { ...prev, [id]: [value] };
    return { ...prev, [id]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] };
  });

  const summary = questions.map((q) => `${q.question}：${(selections[q.id] ?? []).join("、") || "未选择"}`).join("\n");

  return <Stack gap={22}>
    <Stack gap={8}>
      <Text size="small" tone="tertiary" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>Travel Guide Brief</Text>
      <H1>关西旅行手册 · 需求确认</H1>
      <Text tone="secondary">路线和订单信息已从 Docs 读取。请一次性确认下面的产品与视觉方向，确认后我会直接开始制作。</Text>
    </Stack>
    <Divider />
    {questions.map((q, index) => <Stack key={q.id} gap={9}>
      <Row gap={10} align="center"><Text size="small" weight="bold" style={{ color: tokens.accent.primary }}>Q{index + 1}</Text><H3>{q.question}</H3></Row>
      <Text size="small" tone="tertiary" style={{ paddingLeft: 28 }}>{q.hint}</Text>
      <Row gap={8} wrap style={{ paddingLeft: 28 }}>{q.options.map((option) => <Option key={option} label={option} selected={(selections[q.id] ?? []).includes(option)} onClick={() => toggle(q.id, option, q.multi)} />)}</Row>
    </Stack>)}
    <Card>
      <CardHeader>MyFlicker 默认假设</CardHeader>
      <CardBody><Stack gap={6}><Text size="small" tone="secondary">1. 先完成 10.1–10.11 的路线骨架，不捏造尚未确定的每日细节。</Text><Text size="small" tone="secondary">2. 机票和酒店展示已确认信息，但隐藏证件号、订单号、房间号等敏感字段。</Text><Text size="small" tone="secondary">3. 首版优先手机端，地点可点击打开 Google Maps，待办清单保持纯列表。</Text></Stack></CardBody>
    </Card>
    <Row gap={10} wrap>
      <Button onClick={() => dispatch({ type: "appendToAgentInput", text: `确认制作关西旅行手册网页。\n${summary}` })}>确认并开始制作</Button>
      <Button variant="secondary" onClick={() => dispatch({ type: "appendToAgentInput", text: "按 MyFlicker 默认假设直接开始制作关西旅行手册网页。" })}>按默认假设开始</Button>
    </Row>
  </Stack>;
}
