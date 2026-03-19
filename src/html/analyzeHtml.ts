import type { DomItem } from "./types";
import { type DiagnosticLog } from "../logs";
import {
	badTags,
	inlineJs,
	inlineCss,
	tabIndexRule,
	htmlRules,
	headRules,
	imgRules,
	labelRules,
	inputRules,
	buttonRules,
	linkRules
} from './rules';

function analyzeHtml(dom: DomItem[]): DiagnosticLog[] {
	const logs: DiagnosticLog[] = [];

	for (let currentTag of dom) {
		badTags(currentTag, logs);
		inlineJs(currentTag, logs);
		inlineCss(currentTag, logs);
		tabIndexRule(currentTag, logs);

		switch (currentTag.tag) {
			case 'html': {
				htmlRules(currentTag, logs);
				break;
			}
			case 'head': {
				headRules(currentTag, logs);
				break;
			}
			case 'img': {
				imgRules(currentTag, logs);
				break;
			}
			case 'label': {
				labelRules(currentTag, logs);
        break;
			}
			case 'input': {
				inputRules(currentTag, logs);
        break;
			}
			case 'button': {
				buttonRules(currentTag, logs);
        break;
			}
			case 'a': {
				linkRules(currentTag, logs);
        break;
			}
		}
  }

	return logs;
}

export default analyzeHtml;
