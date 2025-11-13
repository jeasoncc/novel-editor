import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
	component: () => (
		<SidebarProvider open>
			<Toaster
				icons={{
					success: <CircleCheckIcon className="size-4 text-green-500" />,
					info: <InfoIcon className="size-4 text-blue-500" />,
					warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
					error: <OctagonXIcon className="size-4 text-red-500" />,
					loading: (
						<Loader2Icon className="size-4 animate-spin text-muted-foreground" />
					),
				}}
			/>
			<AppSidebar />
			<SidebarInset className="bg-background text-foreground">
				<div className="flex items-center gap-2 border-b px-4 py-2">
					<SidebarTrigger />
					<div className="text-sm text-muted-foreground">Workspace</div>
				</div>
				<Outlet />
			</SidebarInset>
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
					FormDevtoolsPlugin(),
				]}
			/>
		</SidebarProvider>
	),
});
