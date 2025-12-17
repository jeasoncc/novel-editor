// Font Configuration Demo Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFontSettings } from "@/stores/font";
import { FontConfigManager, FONT_PRESETS } from "@/lib/font-config";

export function FontDemo() {
	const fontSettings = useFontSettings();
	
	const currentConfig = {
		fontFamily: fontSettings.fontFamily,
		fontSize: fontSettings.fontSize,
		lineHeight: fontSettings.lineHeight,
		letterSpacing: fontSettings.letterSpacing,
		uiFontFamily: fontSettings.uiFontFamily,
		uiFontSize: fontSettings.uiFontSize,
		uiScale: fontSettings.uiScale,
		cardSize: fontSettings.cardSize,
		cardBorderRadius: fontSettings.cardBorderRadius,
		paragraphSpacing: fontSettings.paragraphSpacing,
		firstLineIndent: fontSettings.firstLineIndent,
	};

	const applyPreset = (presetName: keyof typeof FONT_PRESETS) => {
		const preset = FONT_PRESETS[presetName];
		fontSettings.setFontFamily(preset.fontFamily);
		fontSettings.setFontSize(preset.fontSize);
		fontSettings.setLineHeight(preset.lineHeight);
		fontSettings.setLetterSpacing(preset.letterSpacing);
		fontSettings.setUiFontFamily(preset.uiFontFamily);
		fontSettings.setUiFontSize(preset.uiFontSize);
		fontSettings.setUiScale(preset.uiScale);
		fontSettings.setCardSize(preset.cardSize);
		fontSettings.setCardBorderRadius(preset.cardBorderRadius);
		fontSettings.setParagraphSpacing(preset.paragraphSpacing);
		fontSettings.setFirstLineIndent(preset.firstLineIndent);
	};

	return (
		<div className="space-y-6 p-6">
			<Card>
				<CardHeader>
					<CardTitle>Font Configuration Demo</CardTitle>
					<CardDescription>
						Test the font configuration system with live preview
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Current Settings Display */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
						<div>
							<div className="text-xs font-medium text-muted-foreground mb-1">UI Font</div>
							<div className="text-sm">{FontConfigManager.getFontDisplayName(currentConfig.uiFontFamily)}</div>
							<div className="text-xs text-muted-foreground">{currentConfig.uiFontSize}px</div>
						</div>
						<div>
							<div className="text-xs font-medium text-muted-foreground mb-1">Editor Font</div>
							<div className="text-sm">{FontConfigManager.getFontDisplayName(currentConfig.fontFamily)}</div>
							<div className="text-xs text-muted-foreground">{currentConfig.fontSize}px</div>
						</div>
						<div>
							<div className="text-xs font-medium text-muted-foreground mb-1">Card Style</div>
							<div className="text-sm capitalize">{currentConfig.cardSize}</div>
							<div className="text-xs text-muted-foreground">{currentConfig.cardBorderRadius}px radius</div>
						</div>
					</div>

					{/* Preset Buttons */}
					<div>
						<div className="text-sm font-medium mb-3">Quick Presets:</div>
						<div className="flex flex-wrap gap-2">
							{Object.keys(FONT_PRESETS).map((presetName) => (
								<Button
									key={presetName}
									variant="outline"
									size="sm"
									onClick={() => applyPreset(presetName as keyof typeof FONT_PRESETS)}
									className="capitalize"
								>
									{presetName}
								</Button>
							))}
						</div>
					</div>

					{/* Live Preview */}
					<div className="space-y-4">
						<div className="text-sm font-medium">Live Preview:</div>
						
						{/* UI Elements Preview */}
						<Card className="font-ui card-radius">
							<CardHeader className="card-padding">
								<CardTitle className="text-base">UI Elements Preview</CardTitle>
								<CardDescription>
									This card uses the UI font settings
								</CardDescription>
							</CardHeader>
							<CardContent className="card-padding space-y-3">
								<Button size="sm">Sample Button</Button>
								<div className="text-sm text-muted-foreground">
									UI text with current font: {FontConfigManager.getFontDisplayName(currentConfig.uiFontFamily)}
								</div>
							</CardContent>
						</Card>

						{/* Editor Preview */}
						<Card className="card-radius">
							<CardHeader className="card-padding">
								<CardTitle className="text-base">Editor Preview</CardTitle>
								<CardDescription>
									This shows how text looks in the editor
								</CardDescription>
							</CardHeader>
							<CardContent className="card-padding">
								<div className="font-editor p-4 border rounded bg-background">
									<h3 className="text-xl font-bold mb-4">Chapter One: The Beginning</h3>
									<p style={{ 
										textIndent: `${currentConfig.firstLineIndent}em`,
										marginBottom: `${currentConfig.paragraphSpacing}em`
									}}>
										The old lighthouse stood defiant against the crashing waves, its beacon cutting through the thick fog like a silver blade. For generations, it had guided sailors home, but tonight, the light seemed to flicker with an eerie, irregular rhythm.
									</p>
									<p style={{ 
										textIndent: `${currentConfig.firstLineIndent}em`,
										marginBottom: `${currentConfig.paragraphSpacing}em`
									}}>
										Elias wiped the salt spray from his glasses and squinted into the dark. He had tended this lamp for forty years, knowing every gear and lens by heart. But the sound echoing from the lantern room wasn't mechanical—it was a whisper.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}