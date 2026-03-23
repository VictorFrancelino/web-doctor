import type { DomItem } from "../types";
import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import { getAttr } from "../utils";

function labelRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const hasValidFor = getAttr(currentTag, 'for') !== '';
	if (!hasValidFor) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Unlinked <label>',
			msg: 'Labels must have a \'for\' attribute matching an input\'s \'id\'.'
		});
	}
}

export default labelRules;
