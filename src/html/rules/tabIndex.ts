import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";
import { getAttributeValue, hasAttribute } from "../utils";

const naturallyFocusableTags = new Set([
  'button',
  'input',
  'select',
  'textarea',
  'details'
]);

function tabIndexRule(currentTag: DomItem, logs: DiagnosticLog[]) {
	const tabValue = getAttributeValue(currentTag, 'tabindex');

	if (tabValue === null) return;

	const numValue = Number(tabValue);

	if (isNaN(numValue) || !Number.isInteger(numValue)) {
    addLog(logs, {
      type: DiagnosticLevel.ERROR,
      title: 'Invalid TabIndex',
      msg: `The tabindex value '${tabValue}' is invalid. It must be an integer (e.g., 0 or -1).`
		});

    return;
	}

	if (numValue > 0) {
    addLog(logs, {
      type: DiagnosticLevel.ERROR,
      title: 'Positive TabIndex',
      msg: 'Avoid tabindex > 0. It breaks natural keyboard navigation and can confuse users. Prefer using 0 or -1.'
    });
  }

  if (numValue === 0) {
    const isNaturallyFocusable = naturallyFocusableTags.has(currentTag.tag);
		const isLinkWithHref = currentTag.tag === 'a' &&
			hasAttribute(currentTag, 'href');

    if (isNaturallyFocusable || isLinkWithHref) {
      addLog(logs, {
        type: DiagnosticLevel.INFO,
        title: 'Redundant TabIndex',
        msg: `The <${currentTag.tag}> element is naturally focusable. Adding tabindex="0" is redundant.`
      });
    }
  }
}

export default tabIndexRule;
