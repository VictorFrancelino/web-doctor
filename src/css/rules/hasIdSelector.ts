import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import type { AstItem } from "../types";

function hasIdSelector(currentItem: AstItem, logs: DiagnosticLog[]) {
	const hasIdSelector = /#\w+/.test(currentItem.selector);
	if (hasIdSelector) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'ID Selector Used',
			msg: `Avoid styling with IDs (like '${currentItem.selector}'). Use classes (.) for better reusability and lower specificity.`
		});
	}
}

export default hasIdSelector;
