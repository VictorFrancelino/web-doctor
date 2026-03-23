import type { AstItem } from "./types";
import { DiagnosticLevel, type DiagnosticLog, addLog } from "../logs";
import hasNoProperties from "./rules/hasNoProperties";
import hasIdSelector from "./rules/hasIdSelector";
import deeplyNestedSelector from "./rules/deeplyNestedSelector";
import hasHeavyProperty from "./rules/hasHeavyProperty";
import isOverqualifiedSelector from "./rules/isOverqualifiedSelector";
import hasIsImportantFlag from "./rules/hasIsImportantFlag";
import colorValueHasLiteralName from "./rules/colorValueHasLiteralName";

function analyzeCss(cssAst: AstItem[]): DiagnosticLog[] {
	const logs: DiagnosticLog[] = [];

	for (let item of cssAst) {
		hasNoProperties(item, logs);
		hasIdSelector(item, logs);
		deeplyNestedSelector(item, logs);
		hasHeavyProperty(item, logs);
		isOverqualifiedSelector(item, logs);

		for (let declaration of item.properties) {
			hasIsImportantFlag(declaration, logs);

			switch (declaration.property) {
				case "outline":
					if (outlineValueHasNoneOrZero(declaration.value)) {
						addLog(logs, {
							type: DiagnosticLevel.ERROR,
							title: 'Outline Set to None',
							msg: `Never remove the outline without providing a custom focus state. It breaks keyboard accessibility.`
						});
					}
					break;
				case "color":
					if (colorValueHasLiteralName(declaration.value)) {
						addLog(logs, {
							type: DiagnosticLevel.INFO,
							title: 'Literal Color Name',
							msg: `Avoid literal colors like '${declaration.value}'. Use HEX, RGB, HSL, or CSS variables for consistency.`
						});
					}
					break;
				case "z-index":
					if (hasExcessiveZIndex(declaration.value)) {
						addLog(logs, {
							type: DiagnosticLevel.WARNING,
							title: 'Excessive z-index',
							msg: `Avoid z-index values over 100. Use a structured z-index scale or CSS variables to prevent overlaps.`
						});
					}
					break;
				case "font-size":
					if (isPixelBasedFont(declaration.value)) {
						addLog(logs, {
							type: DiagnosticLevel.WARNING,
							title: 'Pixel-based Font Size',
							msg: `Use relative units (rem, em) instead of 'px' for font sizes to respect user accessibility settings.`
						});
					}
					break;
			}
		}
	}

	return logs;
}

function outlineValueHasNoneOrZero(value: string) {
	const isNone = value === "none";
	const isZero = value === "0";

	return isNone || isZero;
}

function hasExcessiveZIndex(value: string) {
	return Number(value) > 100;
}

function isPixelBasedFont(value: string) {
	return !value.startsWith('var') && value.includes("px");
}

export default analyzeCss;
