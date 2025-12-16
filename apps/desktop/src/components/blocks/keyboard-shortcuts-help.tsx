/**
 * 快捷键帮助面板
 */
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const shortcuts = [
	{ keys: ["Ctrl", "K"], description: "命令面板", category: "全局" },
	{ keys: ["Ctrl", "Shift", "F"], description: "搜索面板", category: "全局" },
	{ keys: ["Ctrl", "B"], description: "文件面板", category: "全局" },
	{ keys: ["Ctrl", "Tab"], description: "下一个标签", category: "导航" },
	{ keys: ["Ctrl", "Shift", "Tab"], description: "上一个标签", category: "导航" },
	{ keys: ["Ctrl", "S"], description: "保存", category: "编辑" },
	{ keys: ["Ctrl", "B"], description: "加粗", category: "格式" },
	{ keys: ["Ctrl", "I"], description: "斜体", category: "格式" },
	{ keys: ["Ctrl", "U"], description: "下划线", category: "格式" },
	{ keys: ["Ctrl", "Z"], description: "撤销", category: "编辑" },
	{ keys: ["Ctrl", "Shift", "Z"], description: "重做", category: "编辑" },
];

export function KeyboardShortcutsHelp() {
	// 按分类分组
	const categories = shortcuts.reduce((acc, shortcut) => {
		const category = shortcut.category;
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(shortcut);
		return acc;
	}, {} as Record<string, typeof shortcuts>);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="size-7">
					<Keyboard className="size-3.5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 p-0 shadow-2xl border border-border/40 bg-popover/95 backdrop-blur-xl rounded-xl">
				<div className="flex flex-col py-1">
					<div className="px-3 py-2 border-b border-border/40">
						<h4 className="font-medium text-xs uppercase tracking-wider text-muted-foreground/80">Keyboard Shortcuts</h4>
					</div>
					<div className="max-h-[400px] overflow-y-auto p-2 space-y-3 custom-scrollbar">
						{Object.entries(categories).map(([category, items]) => (
							<div key={category}>
								<div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1 px-1">
									{category}
								</div>
								<div className="space-y-0.5">
									{items.map((shortcut, index) => (
										<div
											key={index}
											className="flex items-center justify-between text-sm px-2 py-1.5 hover:bg-muted/50 rounded-md transition-colors"
										>
											<span className="text-muted-foreground text-xs">
												{shortcut.description}
											</span>
											<div className="flex items-center gap-1">
												{shortcut.keys.map((key, keyIndex) => (
													<kbd
														key={keyIndex}
														className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border"
													>
														{key}
													</kbd>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
