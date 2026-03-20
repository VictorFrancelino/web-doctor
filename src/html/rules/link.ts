import type { DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { addErrorLog } from "../../logs";
import { getAttr, hasValidAttr } from "../utils";

const GENERIC_LINK_TEXTS = new Set([
	'clique aqui',
	'saiba mais',
	'veja mais',
	'leia mais',
	'ver mais',
	'click here',
	'read more',
	'view more'
]);

function linkRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	let hasAltInside = false;

	const hrefContent = getAttr(currentTag, 'href');
	const isTargetBlank = getAttr(currentTag, 'target') === '_blank';
	const relAttr = getAttr(currentTag, 'rel') || '';
	const hasSecureRel =
		relAttr.includes('noopener') ||
		relAttr.includes('noreferrer');
	const hasAriaLabel = hasValidAttr(currentTag, 'aria-label');

	if (currentTag.children && currentTag.children.length > 0) {
		for (const child of currentTag.children) {
			if (child.tag === 'img') {
				const alt = getAttr(child, 'alt');
				if (alt && alt.trim() !== '') hasAltInside = true;
				else {
					addErrorLog(logs, {
				    title: 'Empty link containing an image',
				    msg: 'This link has no text content and the internal image lacks an "alt" attribute. Screen readers will not be able to describe the link destination.'
					});
				}
			}
		}
	}

	if (hrefContent !== null) {
		if (hrefContent === '#' ||hrefContent.startsWith('javascript:')) {
			addErrorLog(logs, {
		    title: 'Incorrect Link Usage',
		    msg: 'Links with "#" or "javascript:" should likely be <button> elements. Links are for navigation, buttons for actions.'
			});
		}
	} else {
		addErrorLog(logs, {
			title: 'Missing \'href\' attribute',
			msg: 'Links (<a>) must have an \'href\'. For elements that only trigger JS, use a <button>.'
		});
	}

	if (isTargetBlank && !hasSecureRel) {
		addErrorLog(logs, {
			title: 'Unsafe target="_blank"',
			msg: 'Add rel="noopener noreferrer" to prevent security vulnerabilities.'
		});
	}

	const linkText = (currentTag.content || '').toLowerCase().trim();
	const isGenericText = GENERIC_LINK_TEXTS.has(linkText);
	const hasNoText = linkText === '';

	if ((isGenericText || hasNoText) && !hasAriaLabel && !hasAltInside) {
		addErrorLog(logs, {
			title: 'Poor Link Text',
			msg: 'Avoid generic text like \'click here\' or empty links. Use descriptive text, an \'aria-label\', or an image with \'alt\'.'
		});
	}
}

export default linkRules;
