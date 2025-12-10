/**
 * 图表预设配置
 * 提供常用的图表样式和布局
 */

export interface DiagramPreset {
	id: string;
	name: string;
	description: string;
	type: "mermaid" | "plantuml";
	category: "structure" | "flow" | "timeline" | "custom";
	template: string;
}

export const mermaidPresets: DiagramPreset[] = [
	{
		id: "simple-flow",
		name: "简单流程图",
		description: "线性流程展示",
		type: "mermaid",
		category: "flow",
		template: `graph LR
    A[开始] --> B[步骤1]
    B --> C[步骤2]
    C --> D[结束]`,
	},
	{
		id: "three-act",
		name: "三幕结构",
		description: "经典三幕剧结构",
		type: "mermaid",
		category: "structure",
		template: `graph TD
    subgraph act1[第一幕：开端]
        A1[引入]
        A2[铺垫]
    end
    subgraph act2[第二幕：发展]
        B1[冲突]
        B2[高潮]
    end
    subgraph act3[第三幕：结局]
        C1[解决]
        C2[收尾]
    end
    act1 ==> act2
    act2 ==> act3`,
	},
	{
		id: "character-network",
		name: "角色关系网",
		description: "展示角色之间的关系",
		type: "mermaid",
		category: "structure",
		template: `graph TD
    A[主角] --> B[配角1]
    A --> C[配角2]
    B -.朋友.- C
    D[反派] -.敌对.- A`,
	},
	{
		id: "timeline",
		name: "故事时间线",
		description: "按时间顺序展示事件",
		type: "mermaid",
		category: "timeline",
		template: `timeline
    title 故事时间线
    第一天 : 事件1
    第二天 : 事件2
    第三天 : 事件3`,
	},
];

export const plantumlPresets: DiagramPreset[] = [
	{
		id: "component-diagram",
		name: "组件图",
		description: "展示系统组件关系",
		type: "plantuml",
		category: "structure",
		template: `@startuml
!theme plain
skinparam backgroundColor transparent

package "第一部分" {
  [章节1]
  [章节2]
}

package "第二部分" {
  [章节3]
  [章节4]
}

[章节1] --> [章节2]
[章节2] --> [章节3]
[章节3] --> [章节4]

@enduml`,
	},
	{
		id: "sequence-diagram",
		name: "时序图",
		description: "展示事件发生顺序",
		type: "plantuml",
		category: "flow",
		template: `@startuml
!theme plain
skinparam backgroundColor transparent

actor 主角
participant 配角1
participant 配角2

主角 -> 配角1: 对话1
配角1 -> 配角2: 对话2
配角2 -> 主角: 对话3

@enduml`,
	},
];

/**
 * 获取所有预设
 */
export function getAllPresets(): DiagramPreset[] {
	return [...mermaidPresets, ...plantumlPresets];
}

/**
 * 根据类型获取预设
 */
export function getPresetsByType(
	type: "mermaid" | "plantuml",
): DiagramPreset[] {
	return type === "mermaid" ? mermaidPresets : plantumlPresets;
}

/**
 * 根据分类获取预设
 */
export function getPresetsByCategory(
	category: DiagramPreset["category"],
): DiagramPreset[] {
	return getAllPresets().filter((preset) => preset.category === category);
}

/**
 * 根据 ID 获取预设
 */
export function getPresetById(id: string): DiagramPreset | undefined {
	return getAllPresets().find((preset) => preset.id === id);
}
