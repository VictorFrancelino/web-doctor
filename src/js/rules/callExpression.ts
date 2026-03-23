import type { DiagnosticLog } from "../../logs";
import { addLog, DiagnosticLevel } from "../../logs";

function callExpressionRules(currentNode: any, logs: DiagnosticLog[]) {
	const funcName = currentNode.callee?.name;
	if (funcName === 'alert') {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: `Usage of ${funcName}()`,
			msg: `Avoid 'alert()'. It blocks the main thread and ruins the User Experience.`
		});
	} else if (funcName === 'eval') {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: `Usage of ${funcName}()`,
			msg: `Never use 'eval()'. It is a severe security vulnerability.`
		});
	}
}

export default callExpressionRules;
