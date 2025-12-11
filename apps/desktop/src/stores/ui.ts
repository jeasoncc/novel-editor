import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RightPanelView = "outline" | "characters" | "drawings" | null;

interface UIState {
	rightPanelView: RightPanelView;
	setRightPanelView: (view: RightPanelView) => void;
	rightSidebarOpen: boolean;
	setRightSidebarOpen: (open: boolean) => void;
	toggleRightSidebar: () => void;
}

export const useUIStore = create<UIState>()(
	persist(
		(set) => ({
			rightPanelView: null,
			setRightPanelView: (view) => set({ rightPanelView: view }),
			rightSidebarOpen: true,
			setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
			toggleRightSidebar: () =>
				set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
		}),
		{
			name: "novel-editor-ui",
			partialize: (state) => ({
				rightSidebarOpen: state.rightSidebarOpen,
			}),
		},
	),
);
