import type { DiagnosticLog } from "../../logs";
import { addLog, DiagnosticLevel } from "../../logs";

function assignmentExpressionRules(currentNode: any, logs: DiagnosticLog[]) {
	const hasInnerHtml = currentNode.left?.property?.name === 'innerHTML';
	if (hasInnerHtml) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'Usage of innerHTML',
			msg: `Avoid 'innerHTML' due to Cross-Site Scripting (XSS) risks. Use 'textContent' or direct DOM manipulation.`
		});
	}
}

export default assignmentExpressionRules;
