import type { DomItem } from "../types";
import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import {
	hasNonEmptyAttribute,
	hasChildTag,
	hasTextContent
} from "../utils";

function labelRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const hasNestedInput = hasChildTag(
		currentTag,
		['input', 'select', 'textarea']
	);
	const hasValidFor = hasNonEmptyAttribute(currentTag, 'for');

	if (!hasValidFor && !hasNestedInput) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Unlinked <label>',
			msg: 'Labels must have a \'for\' attribute matching an input\'s \'id\', or they must wrap the input element.'
		});
	}

	const hasText = hasTextContent(currentTag);
	const hasAriaLabel = hasNonEmptyAttribute(currentTag, 'aria-label');
	const hasChildren = currentTag.children && currentTag.children.length > 0;

	if (!hasText && !hasAriaLabel && !hasChildren) {
    addLog(logs, {
      type: DiagnosticLevel.ERROR,
      title: 'Empty <label>',
      msg: 'Labels must contain text to describe the associated input for screen readers.'
    });
  }
}

export default labelRules;
