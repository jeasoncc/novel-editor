import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Moon, Sun, Monitor } from "lucide-react";
import { themes } from "@/lib/themes";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/design")({
  component: DesignSettings,
});

function DesignSettings() {
  const { mode, setMode, theme: activeTheme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">
                Customize the look and feel of the editor.
            </p>
        </div>
        <Separator />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Controls */}
            <div className="lg:col-span-5 space-y-8">
          
          {/* Mode Section */}
          <section className="space-y-4">
             <div className="space-y-1">
                <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Theme Mode</h2>
                <p className="text-sm text-muted-foreground">Choose how you want the app to look.</p>
             </div>
             <div className="grid grid-cols-3 gap-3">
                <button
                   onClick={() => setMode("light")}
                   className={cn(
                     "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground transition-all",
                     mode === "light" && "border-primary bg-accent"
                   )}
                >
                   <Sun className="size-6" />
                   <span className="text-sm font-medium">Light</span>
                </button>
                <button
                   onClick={() => setMode("dark")}
                   className={cn(
                     "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground transition-all",
                     mode === "dark" && "border-primary bg-accent"
                   )}
                >
                   <Moon className="size-6" />
                   <span className="text-sm font-medium">Dark</span>
                </button>
                <button
                   onClick={() => setMode("system")}
                   className={cn(
                     "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground transition-all",
                     mode === "system" && "border-primary bg-accent"
                   )}
                >
                   <Monitor className="size-6" />
                   <span className="text-sm font-medium">System</span>
                </button>
             </div>
          </section>

          <Separator />

          {/* Color Section */}
          <section className="space-y-4">
             <div className="space-y-1">
                <h2 className="text-sm font-medium leading-none">Accent Color</h2>
                <p className="text-sm text-muted-foreground">Select the primary color for buttons, links, and highlights.</p>
             </div>
             <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {themes.map((t) => {
                    const isActive = activeTheme === t.key;
                    // Extract primary color for preview circle
                    // css string format: "--primary: 222.2 84% 4.9%; ..."
                    const match = t.css.match(/--primary:\s*([^;]+)/);
                    const colorVal = match ? `hsl(${match[1]})` : '#000';
                    
                    return (
                        <div key={t.key} className="flex flex-col items-center gap-2 group">
                             <button
                                onClick={() => setTheme(t.key)}
                                className={cn(
                                    "size-10 rounded-full flex items-center justify-center shadow-sm ring-offset-2 ring-offset-background transition-all hover:scale-110",
                                    isActive && "ring-2 ring-primary"
                                )}
                                style={{ backgroundColor: colorVal }}
                             >
                                {isActive && <Check className="size-5 text-white drop-shadow-md" />}
                             </button>
                             <span className={cn("text-xs capitalize text-muted-foreground transition-colors", isActive && "text-foreground font-medium")}>
                                {t.name}
                             </span>
                        </div>
                    )
                })}
             </div>
          </section>

            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-7">
                <div className="sticky top-24">
                    <Card className="overflow-hidden border-2 border-border/50 shadow-xl">
                 <CardHeader className="border-b bg-muted/30 p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="size-3 rounded-full bg-red-500/20" />
                            <div className="size-3 rounded-full bg-yellow-500/20" />
                            <div className="size-3 rounded-full bg-green-500/20" />
                        </div>
                        <div className="mx-auto text-xs font-medium text-muted-foreground/50">Preview</div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0 min-h-[400px] bg-background flex">
                    {/* Mock Sidebar */}
                    <div className="w-48 border-r border-border bg-sidebar text-sidebar-foreground p-3 hidden sm:flex flex-col gap-4">
                        <div className="h-8 w-full bg-sidebar-accent/50 rounded-md animate-pulse" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                                <div className="size-4 rounded bg-primary/20" />
                                <span className="text-xs font-medium">Chapter 1</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md text-muted-foreground hover:bg-sidebar-accent/50">
                                <div className="size-4 rounded border border-muted-foreground/20" />
                                <span className="text-xs">Scene 1</span>
                            </div>
                             <div className="flex items-center gap-2 p-2 rounded-md text-muted-foreground hover:bg-sidebar-accent/50">
                                <div className="size-4 rounded border border-muted-foreground/20" />
                                <span className="text-xs">Scene 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Mock Editor */}
                    <div className="flex-1 p-8">
                        <div className="max-w-lg mx-auto space-y-6">
                             <div className="space-y-2">
                                <h1 className="text-3xl font-serif font-bold text-foreground">The Beginning</h1>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Draft</span>
                                    <span>•</span>
                                    <span>Just now</span>
                                </div>
                             </div>
                             <div className="space-y-4 font-serif text-lg leading-relaxed text-foreground/90">
                                 <p>The wind howled through the ancient pines, carrying secrets from a forgotten age. <span className="bg-primary/20 text-primary-foreground px-1 rounded">Elara</span> pulled her cloak tighter, her eyes scanning the horizon.</p>
                                 <p>“We shouldn’t be here,” Kael whispered, his hand trembling near his sword hilt.</p>
                                 <p>She ignored him, stepping forward into the clearing. The ruins stood silent, bathed in the pale light of the twin moons.</p>
                             </div>
                             <div className="pt-4 flex gap-2">
                                 <Button>Save Changes</Button>
                                 <Button variant="secondary">Discard</Button>
                                 <Button variant="ghost">Export</Button>
                             </div>
                        </div>
                    </div>
                 </CardContent>
              </Card>
              <div className="mt-4 text-center">
                 <p className="text-xs text-muted-foreground">This preview reflects your current theme settings.</p>
              </div>
                </div>
            </div>
        </div>
    </div>
  );
}
