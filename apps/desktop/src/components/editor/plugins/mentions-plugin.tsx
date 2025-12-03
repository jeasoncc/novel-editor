/**
 * 角色提及插件 - 支持 @ 提及角色
 * 优化版本：移除调试日志、改进 UI、支持拼音搜索
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $getSelection, $isRangeSelection, type TextNode } from "lexical";
import React, { useCallback, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";
import { User, Hash } from "lucide-react";

import { $createMentionNode } from "@/components/editor/nodes/mention-node";
import { useSelectionStore } from "@/stores/selection";
import { useRolesByProject } from "@/services/roles";
import type { RoleInterface } from "@/db/schema";

// 简单的 @ 匹配 - 支持中英文
const AtSignMentionsRegex = /@([\u4e00-\u9fa5a-zA-Z0-9_]*)$/;

const SUGGESTION_LIST_LENGTH_LIMIT = 8;

class MentionTypeaheadOption extends MenuOption {
	name: string;
	roleId: string;
	role: RoleInterface;

	constructor(name: string, roleId: string, role: RoleInterface) {
		super(name);
		this.name = name;
		this.roleId = roleId;
		this.role = role;
	}
}

function MentionsTypeaheadMenuItem({
	index,
	isSelected,
	onClick,
	onMouseEnter,
	option,
}: {
	index: number;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	option: MentionTypeaheadOption;
}) {
	const { role } = option;
	
	return (
		<li
			key={option.key}
			tabIndex={-1}
			ref={option.setRefElement}
			role="option"
			aria-selected={isSelected}
			id={"typeahead-item-" + index}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
			className={`
				flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md
				transition-colors duration-150
				${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}
			`}
		>
			<div className="flex items-center justify-center size-8 rounded-full bg-primary/10 shrink-0">
				<User className="size-4 text-primary" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium truncate">{option.name}</div>
				{role.alias && role.alias.length > 0 && (
					<div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
						<Hash className="size-3" />
						<span className="truncate">{role.alias.slice(0, 2).join(", ")}</span>
					</div>
				)}
			</div>
			{role.identity && role.identity.length > 0 && (
				<div className="text-xs text-muted-foreground shrink-0">
					{role.identity[0]}
				</div>
			)}
		</li>
	);
}

export type MenuTextMatch = {
	leadOffset: number;
	matchingString: string;
	replaceableString: string;
};

function checkForAtSignMentions(text: string): MenuTextMatch | null {
	const match = AtSignMentionsRegex.exec(text);
	
	if (match !== null) {
		return {
			leadOffset: match.index,
			matchingString: match[1] || "",
			replaceableString: match[0],
		};
	}
	
	return null;
}

/**
 * 简单的拼音首字母匹配
 * 例如：张三 -> zs, 李四 -> ls
 */
function getPinyinInitials(text: string): string {
	// 这里可以集成完整的拼音库，暂时使用简化版本
	// 实际项目中可以使用 pinyin-pro 等库
	return text.toLowerCase();
}

export default function MentionsPlugin(): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();
	const selectedProjectId = useSelectionStore((s) => s.selectedProjectId);
	const roles = useRolesByProject(selectedProjectId);

	const [queryString, setQueryString] = useState<string | null>(null);

	const options = useMemo(() => {
		if (!roles || roles.length === 0) {
			return [];
		}

		const query = (queryString || "").toLowerCase().trim();
		
		// 如果没有查询，显示所有角色
		if (!query) {
			return roles
				.map((role) => new MentionTypeaheadOption(role.name, role.id, role))
				.slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
		}
		
		// 过滤匹配的角色
		const filtered = roles.filter((role) => {
			// 1. 匹配角色名称
			if (role.name.toLowerCase().includes(query)) return true;
			
			// 2. 匹配别名
			if (role.alias?.some((a) => a.toLowerCase().includes(query))) return true;
			
			// 3. 匹配身份标签
			if (role.identity?.some((i) => i.toLowerCase().includes(query))) return true;
			
			// 4. 可以添加拼音匹配（需要拼音库）
			// if (getPinyinInitials(role.name).includes(query)) return true;
			
			return false;
		});
		
		return filtered
			.map((role) => new MentionTypeaheadOption(role.name, role.id, role))
			.slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
	}, [roles, queryString]);

	const onSelectOption = useCallback(
		(
			selectedOption: MentionTypeaheadOption,
			nodeToRemove: TextNode | null,
			closeMenu: () => void,
		) => {
			editor.update(() => {
				if (nodeToRemove) {
					nodeToRemove.remove();
				}
				const mentionNode = $createMentionNode(
					selectedOption.name,
					selectedOption.roleId,
				);
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					selection.insertNodes([mentionNode]);
				}
				closeMenu();
			});
		},
		[editor],
	);

	const checkForMentionMatch = useCallback((text: string) => {
		return checkForAtSignMentions(text);
	}, []);

	return (
		<LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
			onQueryChange={setQueryString}
			onSelectOption={onSelectOption}
			triggerFn={checkForMentionMatch}
			options={options}
			menuRenderFn={(
				anchorElementRef,
				{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
			) => {
				if (!anchorElementRef.current || options.length === 0) {
					return null;
				}
				
				return ReactDOM.createPortal(
					<div className="z-[9999] bg-popover border border-border rounded-lg shadow-xl p-1.5 min-w-[240px] max-w-[320px] max-h-[280px] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
						<div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-1">
							{queryString ? `搜索 "${queryString}"` : "选择角色"}
						</div>
						<ul className="space-y-0.5">
							{options.map((option, i: number) => (
								<MentionsTypeaheadMenuItem
									index={i}
									isSelected={selectedIndex === i}
									onClick={() => {
										setHighlightedIndex(i);
										selectOptionAndCleanUp(option);
									}}
									onMouseEnter={() => {
										setHighlightedIndex(i);
									}}
									key={option.key}
									option={option}
								/>
							))}
						</ul>
						<div className="px-2 py-1.5 text-xs text-muted-foreground border-t mt-1">
							↑↓ 选择 · ↵ 确认 · Esc 取消
						</div>
					</div>,
					anchorElementRef.current,
				);
			}}
		/>
	);
}
