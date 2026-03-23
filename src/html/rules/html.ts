import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { getAttr } from "../utils";

function htmlRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const langAttr = getAttr(currentTag, 'lang');
	if (!langAttr) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Missing \'lang\' attribute',
			msg: 'The <html> tag needs a \'lang\' attribute (e.g., lang="en") for screen readers.'
		});
	} else {
		if (langAttr.length < 2) {
			addLog(logs, {
				type: DiagnosticLevel.ERROR,
        title: 'Invalid \'lang\' attribute',
        msg: `The language code '${langAttr}' is invalid. Use a standard BCP 47 language tag (like 'en' or 'pt-BR').`
      });
		}

		if (langAttr.includes('{') || langAttr.includes('%')) {
			addLog(logs, {
				type: DiagnosticLevel.ERROR,
        title: 'Uncompiled Template Variable',
        msg: `The lang attribute contains template syntax ('${langAttr}'). Ensure your HTML is fully compiled before running the audit.`
      });
		}
	}
}

export default htmlRules;
