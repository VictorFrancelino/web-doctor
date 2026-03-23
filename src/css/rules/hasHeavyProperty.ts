import type { DiagnosticLog } from "../../logs";
import type { AstItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";

function hasHeavyProperty(item: AstItem, logs: DiagnosticLog[]) {
	if (item.selector === "*") {
		const hasHeavyProperty = item.properties.some(
			declaration => isNotLayoutProperty(declaration.property)
		);
		if (hasHeavyProperty) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
				title: 'Heavy Universal Selector',
				msg: `Avoid expensive properties on the '*' selector. Limit it to layout resets (margin, padding, box-sizing).`
			});
		}
	}
}

function isNotLayoutProperty(property: string) {
	const isMargin = property === "margin";
	const isPadding = property === "padding";
	const isBoxSizing = property === "box-sizing";

	return !isMargin && !isPadding && !isBoxSizing;
}

export default hasHeavyProperty;
