import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import {
	getAttributeValue,
	hasAttribute,
	hasNonEmptyAttribute,
	hasTextContent
} from "../utils";

const tagsShouldInsideHead = new Set([
	'title',
	'meta',
	'link',
	'style',
	'script',
	'noscript',
	'base'
]);

function headRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	if (!currentTag.children) return;

	let hasTitleTag = false;
	let hasMetaDescriptionTag = false;
	let hasMetaCharset = false;
	let hasMetaViewport = false;

	for (const child of currentTag.children) {
		if (!tagsShouldInsideHead.has(child.tag)) {
			addLog(logs, {
				type: DiagnosticLevel.ERROR,
        title: 'Invalid Tag in <head>',
        msg: `The tag <${child.tag}> is not allowed inside the <head>. Move it to the <body>.`
      });
		}

		if (child.tag === 'title' && hasTextContent(child)) {
			if (hasTitleTag) {
				addLog(logs, {
					type: DiagnosticLevel.ERROR,
          title: 'Multiple <title> Tags',
          msg: 'Found more than one <title> tag in the <head>. Search engines only expect one. Remove the duplicates.'
        });
			}

			if (child.content!.length > 70) {
				addLog(logs, {
					type: DiagnosticLevel.WARNING,
			    title: '<title> Too Long',
			    msg: 'Your title exceeds 70 characters. Search engines will truncate it. Keep it concise for better CTR.'
				});
			}

			hasTitleTag = true;
			continue;
		}

		if (child.tag === 'meta') {
			const hasNameDescription = getAttributeValue(child, 'name') === 'description';
			const hasContent = hasNonEmptyAttribute(child, 'content');

			if (hasNameDescription && hasContent) {
				const contentAttrValue = getAttributeValue(child, 'content');

				if (
					contentAttrValue &&
					(contentAttrValue.length < 50 || contentAttrValue?.length > 160)
				) {
					addLog(logs, {
						type: DiagnosticLevel.WARNING,
				    title: 'Suboptimal Meta Description Length',
				    msg: 'Meta description should be between 50 and 160 characters. Current length is suboptimal for search engine snippets.'
					});
				}

				hasMetaDescriptionTag = true;
				continue;
			}

			const charset = getAttributeValue(child, 'charset');

			if (charset && charset.toLocaleLowerCase() === 'utf-8') {
				hasMetaCharset = true;
				continue;
			}

			const isViewport = getAttributeValue(child, 'name') === 'viewport';
			const hasViewportContent = hasNonEmptyAttribute(child, 'content');

			if (isViewport && hasViewportContent) {
				const viewportValue = getAttributeValue(child, 'content');

				if (
					viewportValue?.includes('user-scalable=no') ||
					viewportValue?.includes('user-scalable=0') ||
					viewportValue?.includes('maximum-scale=1')
				) {
					addLog(logs, {
						type: DiagnosticLevel.ERROR,
				    title: 'Accessibility Violation (Zoom Blocked)',
				    msg: 'The viewport meta tag restricts zooming (user-scalable=no or maximum-scale=1). This prevents visually impaired users from enlarging text. Remove these restrictions.'
					});
				}

				hasMetaViewport = true;
				continue;
			}
		}

		if (child.tag === 'script') {
			if (hasNonEmptyAttribute(child, 'src')) {
				const hasDefer = hasAttribute(child, 'defer');
				const hasAsync = hasAttribute(child, 'async');
        const isModule = getAttributeValue(child, 'type') === 'module';

				if (!hasDefer && !hasAsync && !isModule) {
					addLog(logs, {
						type: DiagnosticLevel.WARNING,
				    title: 'Render-Blocking Script',
				    msg: `The script '${getAttributeValue(child, 'src')}' in the <head> lacks a 'defer' or 'async' attribute. This halts HTML parsing and delays the first paint.`
					});
				}
			}
		}
	}

	if (!hasTitleTag) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
      title: 'Missing <title> tag',
      msg: 'The <head> must contain a <title> tag with text content. This is critical for SEO and browser tabs.'
    });
	}

	if (!hasMetaDescriptionTag) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
      title: 'Missing Meta Description',
      msg: 'Add a <meta name="description" content="..."> tag. Search engines use this to display your site\'s summary in search results.'
    });
	}

	if (!hasMetaCharset) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
      title: 'Missing Charset',
      msg: 'Add <meta charset="UTF-8"> to the <head>. This prevents garbled text and security vulnerabilities.'
    });
	}

	if (!hasMetaViewport) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
      title: 'Missing Viewport Meta Tag',
      msg: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to ensure your site is responsive on mobile devices.'
    });
	}
}

export default headRules;
