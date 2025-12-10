/**
 * 角色提及悬停提示插件
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, type NodeKey } from "lexical";
import { Calendar, Info, Tag, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { $isMentionNode } from "@/components/editor/nodes/mention-node";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/curd";
import type { RoleInterface } from "@/db/schema";

interface TooltipPosition {
	x: number;
	y: number;
}

export default function MentionTooltipPlugin(): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();
	const [tooltipData, setTooltipData] = useState<{
		role: RoleInterface;
		position: TooltipPosition;
	} | null>(null);

	useEffect(() => {
		const handleMouseOver = async (event: MouseEvent) => {
			const target = event.target as HTMLElement;

			// 检查是否是 mention 元素
			if (
				target.classList.contains("mention") ||
				target.hasAttribute("data-role-id")
			) {
				const roleId = target.getAttribute("data-role-id");
				if (!roleId) return;

				// 获取角色数据
				const role = await db.getRole(roleId);
				if (!role) return;

				// 计算提示框位置
				const rect = target.getBoundingClientRect();
				const position: TooltipPosition = {
					x: rect.left + rect.width / 2,
					y: rect.bottom + 8,
				};

				setTooltipData({ role, position });
			}
		};

		const handleMouseOut = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const relatedTarget = event.relatedTarget as HTMLElement;

			// 如果移动到 tooltip 上，不关闭
			if (
				relatedTarget &&
				(relatedTarget.classList.contains("mention-tooltip") ||
					relatedTarget.closest(".mention-tooltip"))
			) {
				return;
			}

			if (
				target.classList.contains("mention") ||
				target.hasAttribute("data-role-id")
			) {
				setTooltipData(null);
			}
		};

		const editorElement = editor.getRootElement();
		if (!editorElement) return;

		editorElement.addEventListener("mouseover", handleMouseOver);
		editorElement.addEventListener("mouseout", handleMouseOut);

		return () => {
			editorElement.removeEventListener("mouseover", handleMouseOver);
			editorElement.removeEventListener("mouseout", handleMouseOut);
		};
	}, [editor]);

	if (!tooltipData) return null;

	const { role, position } = tooltipData;

	return createPortal(
		<div
			className="mention-tooltip fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				transform: "translateX(-50%)",
			}}
			onMouseEnter={() => {
				// 保持 tooltip 打开
			}}
			onMouseLeave={() => {
				setTooltipData(null);
			}}
		>
			<Card className="w-80 shadow-xl border-2 bg-popover/95 backdrop-blur-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<User className="size-4" />
						{role.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{/* 身份标签 */}
					{role.identity && role.identity.length > 0 && (
						<div>
							<div className="flex items-center gap-1.5 mb-2">
								<Tag className="size-3.5 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									身份
								</span>
							</div>
							<div className="flex flex-wrap gap-1.5">
								{role.identity.map((id, index) => (
									<Badge key={index} variant="secondary" className="text-xs">
										{id}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* 别名 */}
					{role.alias && role.alias.length > 0 && (
						<div>
							<div className="flex items-center gap-1.5 mb-2">
								<Info className="size-3.5 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									别名
								</span>
							</div>
							<div className="text-sm text-foreground">
								{role.alias.join(", ")}
							</div>
						</div>
					)}

					{/* 基本设定 */}
					{role.basicSettings && (
						<div>
							<Separator className="my-2" />
							<div className="text-sm text-muted-foreground line-clamp-3">
								{role.basicSettings}
							</div>
						</div>
					)}

					{/* 关系 */}
					{role.relationships && role.relationships.length > 0 && (
						<div>
							<div className="flex items-center gap-1.5 mb-2">
								<User className="size-3.5 text-muted-foreground" />
								<span className="text-xs font-medium text-muted-foreground">
									关系
								</span>
							</div>
							<div className="text-sm text-foreground">
								{role.relationships.join(", ")}
							</div>
						</div>
					)}

					{/* 创建时间 */}
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
						<Calendar className="size-3" />
						<span>
							创建于 {new Date(role.createDate).toLocaleDateString("zh-CN")}
						</span>
					</div>
				</CardContent>
			</Card>
		</div>,
		document.body,
	);
}
