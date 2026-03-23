import type { DomItem } from "../types";
import { addLog, DiagnosticLevel, type DiagnosticLog } from "../../logs";
import { getAttr, hasValidAttr } from "../utils";

function imgRules(currentTag: DomItem, logs: DiagnosticLog[]) {
	const srcAttr = getAttr(currentTag, 'src');
	const altAttr = getAttr(currentTag, 'alt');

	const hasLoadingLazy = getAttr(currentTag, 'loading') === 'lazy';
	const hasFetchpriority = getAttr(currentTag, 'fetchpriority') === 'high';
	const hasDecodingAsync = getAttr(currentTag, 'decoding') === 'async';
	const hasSizes = hasValidAttr(currentTag, 'sizes');
	const hasSrcset = hasValidAttr(currentTag, 'srcset');
	const hasWidth = hasValidAttr(currentTag, 'width');
	const hasHeight = hasValidAttr(currentTag, 'height');

	const isExternal = srcAttr ?
		srcAttr.startsWith('http://') || srcAttr.startsWith('https://')
		: null;

	if (srcAttr && !isExternal) {
		if (
			srcAttr.endsWith('.jpg') ||
			srcAttr.endsWith('.jpeg') ||
			srcAttr.endsWith('.png')
		) {
			addLog(logs, {
				type: DiagnosticLevel.INFO,
        title: 'Legacy Image Format',
        msg: `Avoid using '${srcAttr.split('.').pop()}' formats. Prefer modern formats like WebP or AVIF, which provide superior compression and drastically reduce page load times.`
      });
		}

		if (hasSrcset && !hasSizes) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
        title: 'Missing \'sizes\' Attribute',
        msg: 'When using \'srcset\', you must include the \'sizes\' attribute. Without it, the browser assumes the image is 100vw, which ruins responsive image optimization.'
      });
		}

		if (!hasSrcset && !srcAttr.endsWith('.svg')) {
			addLog(logs, {
				type: DiagnosticLevel.INFO,
        title: 'Missing \'srcset\' Attribute',
        msg: 'Provide a \'srcset\' attribute for raster images. This allows the browser to download appropriately sized images for mobile devices, saving bandwidth and improving performance.'
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
          msg: `The image '${srcAttr}' is ${imgSizeInKb.toFixed(1)}KB. Keep web images under ${maxKb}KB. Consider using WebP or AVIF.`
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
			msg: 'Always set explicit \'width\' and \'height\' attributes on <img> tags to prevent Cumulative Layout Shift.'
		});
	}

	if (altAttr === null) {
		addLog(logs, {
			type: DiagnosticLevel.ERROR,
			title: 'Missing \'alt\' attribute',
			msg: 'Images must have an \'alt\' attribute. Use alt="" for decorative images.'
		});
	} else {
		const altLength = altAttr.length;
		if (altLength > 125) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
        title: 'Alt Text Too Long',
        msg: `The alt text is ${altLength} characters. Keep it under 125 characters or use 'aria-describedby'.`
      });
		}

		const altContent = altAttr.toLowerCase();
		if (
			altContent.endsWith('.png') ||
			altContent.endsWith('.jpg') ||
			altContent.endsWith('.jpeg') ||
			altContent.endsWith('.webp') ||
			altContent.endsWith('.svg')
		) {
			addLog(logs, {
				type: DiagnosticLevel.WARNING,
        title: 'Invalid Alt Text (File Extension)',
        msg: `Do not use file names or extensions (like '${altAttr}') in the 'alt' attribute. Screen readers will read this aloud. Describe the image content instead.`
      });
		}
	}
}

export default imgRules;
