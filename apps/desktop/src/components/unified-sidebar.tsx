import { cn } from "@/lib/utils";
import { useUnifiedSidebarStore } from "@/stores/unified-sidebar";
import { BooksPanel } from "./panels/books-panel";
import { SearchPanel } from "./panels/search-panel";

export function UnifiedSidebar() {
	const { activePanel, isOpen, width } = useUnifiedSidebarStore();

	if (!isOpen || !activePanel) {
		return null;
	}

	return (
		<div
			className={cn(
				"shrink-0 bg-sidebar border-r border-sidebar-border/30 transition-all duration-200",
				"flex flex-col h-full",
			)}
			style={{ width: `${width}px` }}
		>
			{activePanel === "search" && <SearchPanel />}
			{activePanel === "books" && <BooksPanel />}
		</div>
	);
}
