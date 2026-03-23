import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addLog, DiagnosticLevel } from "../../logs";
import {
	getAttributeValue,
	hasAttribute,
	hasNonEmptyAttribute
} from "../utils";

function inputRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const typeAttr = getAttributeValue(currentTag, 'type');
	const typeLower = typeAttr?.toLowerCase();

	const hasId = hasNonEmptyAttribute(currentTag, 'id');
	const hasName = hasNonEmptyAttribute(currentTag, 'name');

	if (!hasId && !hasName) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Anonymous <input>',
			msg: 'Inputs need an \'id\' (for labels) or \'name\' (for forms submission).'
		});
	}

	if (!typeAttr) {
		addLog(logs, {
      type: DiagnosticLevel.INFO,
      title: 'Missing <input> Type',
      msg: 'Always specify a \'type\' attribute (e.g., type="text"). Relying on browser defaults can lead to bugs.'
    });
	} else {
		if (typeLower === 'radio' || typeLower === 'checkbox') {
      if (!hasAttribute(currentTag, 'value')) {
        addLog(logs, {
          type: DiagnosticLevel.ERROR,
          title: `Missing Value on ${typeAttr}`,
          msg: `Inputs of type '${typeLower}' must have a 'value' attribute. Otherwise, the server only receives "on".`
        });
			}
		}

		if (typeLower === 'image') {
      if (!hasAttribute(currentTag, 'alt')) {
        addLog(logs, {
          type: DiagnosticLevel.ERROR,
          title: 'Missing Alt on Image Input',
          msg: 'Inputs of type="image" act as buttons and must have an \'alt\' attribute for screen readers.'
        });
      }
    }
	}
}

export default inputRules;
