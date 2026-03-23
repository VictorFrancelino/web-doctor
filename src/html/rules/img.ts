import type { DomItem } from "../types";
import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import { getAttributeValue, hasNonEmptyAttribute } from "../utils";

function imgRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const srcAttr = getAttributeValue(currentTag, 'src');
	const altAttr = getAttributeValue(currentTag, 'alt');

	const hasLoadingLazy = getAttributeValue(currentTag, 'loading') === 'lazy';
	const hasFetchpriority = getAttributeValue(
		currentTag,
		'fetchpriority'
	) === 'high';
	const hasDecodingAsync = getAttributeValue(
		currentTag,
		'decoding'
	) === 'async';

	const hasSizes = hasNonEmptyAttribute(currentTag, 'sizes');
	const hasSrcset = hasNonEmptyAttribute(currentTag, 'srcset');
	const hasWidth = hasNonEmptyAttribute(currentTag, 'width');
	const hasHeight = hasNonEmptyAttribute(currentTag, 'height');

	const isExternal = srcAttr
		? srcAttr.startsWith('http://') || srcAttr.startsWith('https://')
		: null;

	if (srcAttr && !isExternal) {
		const extension = srcAttr.split('.').pop()?.toLowerCase();
		const isLegacy = ['jpg', 'jpeg', 'png'].includes(extension || '');

		if (isLegacy) {
			addLog(logs, {
				type: DiagnosticLevel.INFO,
        title: 'Legacy Image Format',
        msg: `Avoid using '${extension}' formats. Prefer modern formats like WebP or AVIF for better compression.`
      });
		}

		if (hasSrcset && !hasSizes) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
        title: 'Missing \'sizes\' Attribute',
        msg: 'When using \'srcset\', you must include the \'sizes\' attribute for responsive optimization.'
      });
		}

		if (!hasSrcset && !srcAttr.endsWith('.svg')) {
			addLog(logs, {
				type: DiagnosticLevel.INFO,
        title: 'Missing \'srcset\' Attribute',
        msg: 'Provide a \'srcset\' attribute for raster images to serve appropriate sizes for mobile devices.'
      });
		}

		const imgFile = Bun.file(srcAttr);
		if (imgFile.size > 0) {
			const imgSizeInKb = imgFile.size / 1024;
			const maxKb = 500;

			if (imgSizeInKb > maxKb) {
				addLog(logs, {
					type: DiagnosticLevel.WARNING,
          title: 'Heavy Image Detected',
          msg: `The image '${srcAttr}' is ${imgSizeInKb.toFixed(1)}KB. Keep web images under ${maxKb}KB.`
        });
			}
		} else {
			addLog(logs, {
				type: DiagnosticLevel.ERROR,
        title: 'Broken Image Link',
        msg: `The image file '${srcAttr}' was not found in the directory.`
      });
		}
	}

	if (hasLoadingLazy && hasFetchpriority) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
      title: 'Conflicting Attributes (Lazy vs High Priority)',
      msg: 'An image cannot have both \'loading="lazy"\' and \'fetchpriority="high"\'. Decide if this image is critical for the initial render (high priority) or offscreen (lazy).'
  	});
	}

	if (!hasLoadingLazy && !hasFetchpriority) {
		addLog(logs, {
			type: DiagnosticLevel.INFO,
			title: 'Missing \'loading="lazy"\'',
			msg: 'Add loading="lazy" to images to defer offscreen loading and improve performance.',
		});
	}

	if (!hasDecodingAsync) {
		addLog(logs, {
			type: DiagnosticLevel.INFO,
      title: 'Missing \'decoding="async"\'',
      msg: 'Add decoding="async" to images. This allows the browser to decode images off the main thread, preventing UI freezes and improving render speed.'
    });
	}

	if (!hasWidth || !hasHeight) {
		addLog(logs, {
			type: DiagnosticLevel.WARNING,
			title: 'Missing Image Dimensions (CLS)',
			msg: 'Set explicit width and height to prevent Cumulative Layout Shift.'
		});
	}

	if (altAttr === null) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Missing \'alt\' attribute',
			msg: 'Images must have an \'alt\' attribute. Use alt="" for decorative images.'
		});
	} else if (altAttr !== '') {
		if (altAttr.length > 125) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
        title: 'Alt Text Too Long',
        msg: `The alt text is ${altAttr.length} characters. Keep it under 125 characters or use 'aria-describedby'.`
      });
		}

		const isFileName = /\.(png|jpg|jpeg|webp|svg)$/i.test(altAttr);

		if (isFileName) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
        title: 'Invalid Alt Text (File Extension)',
        msg: `Do not use file names or extensions (like '${altAttr}') in the 'alt' attribute. Screen readers will read this aloud. Describe the image content instead.`
      });
		}
	}
}

export default imgRules;
