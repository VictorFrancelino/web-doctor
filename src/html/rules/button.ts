import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";
import {
	getAttributeValue,
	hasNonEmptyAttribute,
	hasTextContent,
	hasChildTag
} from "../utils";

function buttonRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const typeAttr = getAttributeValue(currentTag, 'type');

	if (!typeAttr) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Untyped <button>',
			msg: 'Always define type="button" or type="submit" to prevent form bugs.'
		});
	} else {
		const validTypes = ['button', 'submit', 'reset'];

		if (!validTypes.includes(typeAttr.toLowerCase())) {
			addLog(logs, {
        type: DiagnosticLevel.ERROR,
        title: 'Invalid Button Type',
        msg: `The type '${typeAttr}' is invalid. Use 'button', 'submit', or 'reset'.`
      });
		}
	}

	const hasText = hasTextContent(currentTag);
	const hasAriaLabel = hasNonEmptyAttribute(currentTag, 'aria-label');

	if (!hasText && !hasAriaLabel) {
		const hasAltInside = currentTag.children?.some(
			child => child.tag === 'img' && hasNonEmptyAttribute(child, 'alt')
		);

		if (!hasAltInside) {
			addLog(logs, {
				type: DiagnosticLevel.ERROR,
				title: 'Empty Button',
				msg: 'Buttons without text must have an \'aria-label\' or an internal image with \'alt\' for screen readers.'
			});
		}
	}

	if (hasChildTag(currentTag, 'a')) {
    addLog(logs, {
      type: DiagnosticLevel.ERROR,
      title: 'Link Inside Button',
      msg: 'Never nest an <a> tag inside a <button>. It violates HTML specs and breaks screen readers.'
    });
	}
}

export default buttonRules;
