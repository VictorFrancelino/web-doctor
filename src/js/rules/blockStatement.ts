import type { DiagnosticLog } from "../../logs";
import { addLog, DiagnosticLevel } from "../../logs";

function blockStatementRules(currentNode: any, logs: DiagnosticLog[]) {
	const hasNoCodeInBlock = currentNode.body.length === 0
	if (hasNoCodeInBlock) {
		addLog(logs, {
			type: DiagnosticLevel.INFO,
			title: 'Empty Block Statement',
			msg: `Remove empty blocks (e.g., empty 'if' or 'function') to keep the code clean and maintainable.`
		});
	}
}

export default blockStatementRules;
