import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";

const BAD_TAGS = new Set([
	'center',
	'font',
	'marquee',
	'b',
	'blink',
	'i',
	'br',
	'strike',
	'frame'
]);

function badTags(currentTag: DomItem, logs: DiagnosticLog[]) {
	if (BAD_TAGS.has(currentTag.tag)) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: `Obsolete tag detected`,
			msg: `Tag <${currentTag.tag}> is deprecated. Use CSS for styling or semantic HTML5 tags.`
		});
	}
}

export default badTags;
