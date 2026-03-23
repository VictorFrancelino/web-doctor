import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";

function inlineJs(currentTag: DomItem, logs: DiagnosticLog[]) {
	const hasInlineJs = currentTag.attributes.some(
		attr => attr.name.toLowerCase().startsWith('on')
	);

	if (hasInlineJs) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'Inline JavaScript',
			msg: 'Avoid \'on...\' attributes (like onclick). Use addEventListener() in a separate .js file.'
		});
	}
}

export default inlineJs;
