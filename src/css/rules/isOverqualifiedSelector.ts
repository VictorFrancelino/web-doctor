import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import type { AstItem } from "../types";

function isOverqualifiedSelector(currentItem: AstItem, logs: DiagnosticLog[]) {
	if (/(^|\s)[a-zA-Z0-9]+[\.#]/.test(currentItem.selector)) {
		addLog(logs, {
			type: DiagnosticLevel.INFO,
			title: 'Overqualified Selector',
			msg: `Avoid attaching tags to classes (e.g., 'div.btn'). Use just the class ('.btn') to keep specificity low.`
		});
	}
}

export default isOverqualifiedSelector;
