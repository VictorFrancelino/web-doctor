import type { DiagnosticLog } from "../../logs";
import { addLog, DiagnosticLevel } from "../../logs";

function binaryExpressionRules(currentNode: any, logs: DiagnosticLog[]) {
	const hasDoubleEqualExpression = currentNode.operator === '=='
		|| currentNode.operator === '!=';
	if (hasDoubleEqualExpression) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'Loose Equality Operator',
			msg: `Avoid '${currentNode.operator}'. Always use strict equality ('===' or '!==') to prevent type coercion bugs.`
		});
	}
}

export default binaryExpressionRules;
