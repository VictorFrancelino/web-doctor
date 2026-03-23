import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";
import { hasNonEmptyAttribute } from "../utils";

function inlineCss(currentTag: DomItem, logs: DiagnosticLog[]) {
	if (hasNonEmptyAttribute(currentTag, 'style')) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'Inline CSS',
			msg: 'Avoid the \'style\' attribute. Use external stylesheets (.css).'
		});
	}
}

export default inlineCss;
