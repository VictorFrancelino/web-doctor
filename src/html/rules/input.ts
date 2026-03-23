import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";
import { getAttr } from "../utils";

function inputRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const hasId = getAttr(currentTag, 'id') !== '';
	const hasName = getAttr(currentTag, 'name') !== '';
	if (!hasId && !hasName) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Anonymous <input>',
			msg: 'Inputs need an \'id\' (for labels) or \'name\' (for forms).'
		});
	}
}

export default inputRules;
