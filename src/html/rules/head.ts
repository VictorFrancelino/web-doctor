import { addErrorLog, type DiagnosticLog } from "../../logs";
import type { DomItem } from "../types";
import { getAttr, hasValidAttr } from "../utils";

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
			addErrorLog(logs, {
        title: 'Invalid Tag in <head>',
        msg: `The tag <${child.tag}> is not allowed inside the <head>. Move it to the <body>.`
      });
		}

		if (child.tag === 'title' && child.content !== '') {
			if (hasTitleTag) {
				addErrorLog(logs, {
          title: 'Multiple <title> Tags',
          msg: 'Found more than one <title> tag in the <head>. Search engines only expect one. Remove the duplicates.'
        });
			}

			if (child.content && child.content.length > 70) {
				addErrorLog(logs, {
			    title: '<title> Too Long',
			    msg: 'Your title exceeds 70 characters. Search engines will truncate it. Keep it concise for better CTR.'
				});
			}

			hasTitleTag = true;
			continue;
		}

		if (child.tag === 'meta') {
			const hasNameAttr = getAttr(child, 'name') === 'description';
			const hasContentAttr = hasValidAttr(child, 'content');
			if (hasNameAttr && hasContentAttr) {
				const contentAttrValue = getAttr(child, 'content');
				if (
					contentAttrValue &&
					(contentAttrValue.length < 50 || contentAttrValue?.length > 160)
				) {
					addErrorLog(logs, {
				    title: 'Suboptimal Meta Description Length',
				    msg: 'Meta description should be between 50 and 160 characters. Current length is suboptimal for search engine snippets.'
					});
				}

				hasMetaDescriptionTag = true;
				continue;
			}

			const charset = getAttr(child, 'charset');
			const hasCharsetAttr = charset && charset.toLowerCase() === 'utf-8';
			if (hasCharsetAttr) {
				hasMetaCharset = true;
				continue;
			}

			const hasViewportAttr = getAttr(child, 'name') === 'viewport';
			const hasViewportContentAttr = hasValidAttr(child, 'content');
			if (hasViewportAttr && hasViewportContentAttr) {
				const viewportContent = getAttr(child, 'content');
				if (
					viewportContent?.includes('user-scalable=no') ||
					viewportContent?.includes('user-scalable=0') ||
					viewportContent?.includes('maximum-scale=1')
				) {
					addErrorLog(logs, {
				    title: 'Accessibility Violation (Zoom Blocked)',
				    msg: 'The viewport meta tag restricts zooming (user-scalable=no or maximum-scale=1). This prevents visually impaired users from enlarging text. Remove these restrictions.'
					});
				}

				hasMetaViewport = true;
				continue;
			}
		}

		if (child.tag === 'script') {
			const hasSrcAttr = hasValidAttr(child, 'src');
			if (hasSrcAttr) {
				const hasDefer = getAttr(child, 'defer') !== null;
				const hasAsync = getAttr(child, 'async') !== null;
        const isModule = getAttr(child, 'type') === 'module';

				if (!hasDefer && !hasAsync && !isModule) {
					addErrorLog(logs, {
				    title: 'Render-Blocking Script',
				    msg: `The script '${getAttr(child, 'src')}' in the <head> lacks a 'defer' or 'async' attribute. This halts HTML parsing and delays the first paint.`
					});
				}
			}
		}
	}

	if (!hasTitleTag) {
		addErrorLog(logs, {
      title: 'Missing <title> tag',
      msg: 'The <head> must contain a <title> tag with text content. This is critical for SEO and browser tabs.'
    });
	}

	if (!hasMetaDescriptionTag) {
		addErrorLog(logs, {
      title: 'Missing Meta Description',
      msg: 'Add a <meta name="description" content="..."> tag. Search engines use this to display your site\'s summary in search results.'
    });
	}

	if (!hasMetaCharset) {
		addErrorLog(logs, {
      title: 'Missing Charset',
      msg: 'Add <meta charset="UTF-8"> to the <head>. This prevents garbled text and security vulnerabilities.'
    });
	}

	if (!hasMetaViewport) {
		addErrorLog(logs, {
      title: 'Missing Viewport Meta Tag',
      msg: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to ensure your site is responsive on mobile devices.'
    });
	}
}

export default headRules;
