import type { DiagnosticLog } from "../../logs";
import { addLog, DiagnosticLevel } from "../../logs";

function withStatementRules(logs: DiagnosticLog[]) {
	addLog(logs, {
		type: DiagnosticLevel.ERROR,
		title: `Usage of 'with' Statement`,
		msg: `Never use the 'with' statement. It creates unpredictable scopes and is forbidden in Strict Mode.`
	});
}

export default withStatementRules;
