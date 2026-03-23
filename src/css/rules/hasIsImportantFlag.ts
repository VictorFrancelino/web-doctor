import type { DiagnosticLog } from "../../logs";
import type { PropertiesItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";

function hasIsImportantFlag(
	currentDeclaration: PropertiesItem, logs: DiagnosticLog[]
) {
	if (currentDeclaration.isImportant) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'Usage of !important',
			msg: `Avoid '!important' on '${currentDeclaration.property}'. It breaks the natural cascade of CSS.`
		});
	}
}

export default hasIsImportantFlag;
