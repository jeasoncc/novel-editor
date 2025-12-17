import { createFileRoute } from "@tanstack/react-router";
import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useIconTheme } from "@/hooks/use-icon-theme";
import { getDarkThemes, getLightThemes, type Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/design")({
	component: DesignSettings,
});

function DesignSettings() {
	const { theme: activeTheme, setTheme, currentTheme } = useTheme();
	const iconTheme = useIconTheme();
	const lightThemes = getLightThemes();
	const darkThemes = getDarkThemes();

	return (
		<div className="space-y-10 max-w-5xl">
			<div>
				<h3 className="text-lg font-medium">Design</h3>
				<p className="text-sm text-muted-foreground">
					Customize the appearance and theme of the editor.
				</p>
			</div>
			
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Left: Theme Selection */}
				<div className="lg:col-span-5 space-y-10">
					{/* Light Themes */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Sun className="size-4" />
							<h4 className="text-sm font-medium uppercase tracking-wider">Light Themes</h4>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{lightThemes.map((t) => (
								<ThemeCard
									key={t.key}
									theme={t}
									isActive={activeTheme === t.key}
									onSelect={() => setTheme(t.key)}
								/>
							))}
						</div>
					</div>

					{/* Dark Themes */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Moon className="size-4" />
							<h4 className="text-sm font-medium uppercase tracking-wider">Dark Themes</h4>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{darkThemes.map((t) => (
								<ThemeCard
									key={t.key}
									theme={t}
									isActive={activeTheme === t.key}
									onSelect={() => setTheme(t.key)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Right: Preview */}
				<div className="lg:col-span-7 space-y-4 min-w-0">
					<div className="sticky top-6 space-y-4">
						{/* Theme Preview */}
						<div className="rounded-lg border overflow-hidden shadow-sm">
							<div
								className="border-b p-4"
								style={{ background: currentTheme?.colors.sidebar }}
							>
								<div className="flex items-center gap-2">
									<div className="flex gap-1.5">
										<div className="size-3 rounded-full bg-red-500/80" />
										<div className="size-3 rounded-full bg-yellow-500/80" />
										<div className="size-3 rounded-full bg-green-500/80" />
									</div>
									<span
										className="text-xs ml-2 opacity-70"
										style={{ color: currentTheme?.colors.sidebarForeground }}
									>
										Preview - {currentTheme?.name}
									</span>
								</div>
							</div>
							<div className="p-0">
								<div className="flex h-[300px]">
									{/* Sidebar Mock */}
									<div
										className="w-48 border-r p-3 space-y-1"
										style={{
											background: currentTheme?.colors.sidebar,
											borderColor: currentTheme?.colors.sidebarBorder,
										}}
									>
										<div
											className="text-xs font-medium px-2 py-1 mb-2 opacity-70"
											style={{ color: currentTheme?.colors.sidebarForeground }}
										>
											Explorer
										</div>
										
										{/* Folder Item */}
										<div
											className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
											style={{
												color: currentTheme?.colors.sidebarForeground,
											}}
										>
											{(() => {
												const Icon = iconTheme.icons.folder.default;
												return <Icon className="size-3.5 shrink-0" style={{ color: currentTheme?.colors.folderColor }} />;
											})()}
											<span className="truncate opacity-90">My Novel</span>
										</div>

										{/* Active File Item */}
										<div
											className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
											style={{
												background: currentTheme?.colors.sidebarAccent,
												color: currentTheme?.colors.primary,
											}}
										>
											{(() => {
												const Icon = iconTheme.icons.file.default;
												return <Icon className="size-3.5 shrink-0" />;
											})()}
											<span className="truncate font-medium">Chapter 1</span>
										</div>

										{/* Inactive File Item */}
										<div
											className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
											style={{ color: currentTheme?.colors.sidebarForeground }}
										>
											{(() => {
												const Icon = iconTheme.icons.file.default;
												return <Icon className="size-3.5 shrink-0 opacity-70" />;
											})()}
											<span className="truncate opacity-70">Chapter 2</span>
										</div>
									</div>

									{/* Editor Mock */}
									<div
										className="flex-1 p-8"
										style={{ background: currentTheme?.colors.background }}
									>
										<h2
											className="text-2xl font-bold mb-6"
											style={{ color: currentTheme?.colors.foreground }}
										>
											The Beginning
										</h2>
										<p
											className="text-sm leading-relaxed mb-4"
											style={{ color: currentTheme?.colors.foreground }}
										>
											In a land far away, where the ancient ruins whisper secrets of the past, a lone traveler stood atop the hill...
										</p>
										<p
											className="text-sm leading-relaxed"
											style={{ color: currentTheme?.colors.mutedForeground }}
										>
											The wind howled through the broken pillars, carrying with it the scent of rain and forgotten memories.
										</p>
										<button
											className="mt-8 px-4 py-1.5 rounded text-xs font-medium opacity-90 hover:opacity-100 transition-opacity"
											style={{
												background: currentTheme?.colors.primary,
												color: currentTheme?.colors.primaryForeground,
											}}
										>
											Save Content
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface ThemeCardProps {
	theme: Theme;
	isActive: boolean;
	onSelect: () => void;
}

// Theme Card Component
function ThemeCard({ theme, isActive, onSelect }: ThemeCardProps) {
	const { colors } = theme;

	return (
		<button
			onClick={onSelect}
			className={cn(
				"relative flex flex-col rounded-xl border overflow-hidden transition-all duration-300 text-left group",
				"hover:shadow-md hover:-translate-y-1 hover:border-primary/50",
				isActive 
					? "border-primary ring-2 ring-primary/20 shadow-md bg-accent/5" 
					: "border-border/40 bg-card"
			)}
		>
			{/* Theme Preview */}
			<div
				className="h-24 w-full flex border-b border-border/10 transition-colors"
				style={{ background: colors.background }}
			>
				{/* Sidebar Mock */}
				<div
					className="w-1/3 h-full border-r flex flex-col pt-3 px-3 gap-2"
					style={{
						background: colors.sidebar,
						borderColor: colors.sidebarBorder,
					}}
				>
					<div 
						className="h-2 w-16 rounded-full opacity-70 mb-1"
						style={{ background: colors.sidebarForeground }}
					/>
					<div className="space-y-2">
						<div className="flex items-center gap-2 opacity-90">
							<div className="size-2 rounded-full shrink-0" style={{ background: colors.folderColor || colors.primary }} />
							<div className="h-1.5 w-full rounded-full" style={{ background: colors.sidebarForeground }} />
						</div>
						<div className="flex items-center gap-2 opacity-60 pl-2">
							<div className="size-1.5 rounded-full shrink-0" style={{ background: colors.sidebarForeground }} />
							<div className="h-1.5 w-full rounded-full" style={{ background: colors.sidebarForeground }} />
						</div>
					</div>
				</div>
				{/* Editor Mock */}
				<div className="flex-1 p-3 flex flex-col gap-2">
					<div
						className="h-2.5 w-24 rounded-full mb-1"
						style={{ background: colors.primary, opacity: 0.9 }}
					/>
					<div className="space-y-2">
						<div
							className="h-1.5 w-full rounded-full opacity-40"
							style={{ background: colors.foreground }}
						/>
						<div
							className="h-1.5 w-5/6 rounded-full opacity-30"
							style={{ background: colors.foreground }}
						/>
						<div
							className="h-1.5 w-4/6 rounded-full opacity-20"
							style={{ background: colors.foreground }}
						/>
					</div>
				</div>
			</div>

			{/* Theme Info */}
			<div className="px-4 py-3 bg-muted/20 group-hover:bg-muted/30 transition-colors">
				<div className="flex items-center justify-between gap-2">
					<div className="font-semibold text-sm text-card-foreground truncate">
						{theme.name}
					</div>
					{/* Color Palette Preview */}
					<div className="flex -space-x-1.5 shrink-0">
						<div className="size-4 rounded-full ring-2 ring-background z-30" style={{ background: colors.background }} />
						<div className="size-4 rounded-full ring-2 ring-background z-20" style={{ background: colors.sidebar }} />
						<div className="size-4 rounded-full ring-2 ring-background z-10" style={{ background: colors.primary }} />
					</div>
				</div>
			</div>

			{/* Selected Check */}
			{isActive && (
				<div
					className="absolute top-2 right-2 size-5 rounded-full flex items-center justify-center shadow-sm animate-in fade-in zoom-in duration-200"
					style={{ background: colors.primary }}
				>
					<Check
						className="size-3"
						style={{ color: colors.primaryForeground }}
					/>
				</div>
			)}
		</button>
	);
}
