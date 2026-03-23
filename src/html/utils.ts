import type { DomItem } from "./types";

export function getAttributeValue(
	tag: DomItem,
	attrName: string
): string | null {
	const attr = tag.attributes.find(a => a.name === attrName);
	return attr ? attr.value.trim() : null;
}

export function hasAttribute(tag: DomItem, attrName: string): boolean {
  return tag.attributes?.some(a => a.name === attrName) ?? false;
}

export function hasTextContent(tag: DomItem): boolean {
	return tag.content !== undefined &&
		tag.content !== null &&
		tag.content.trim() !== '';
}

export function hasChildTag(
	tag: DomItem,
	targetTags: string | string[]
): boolean {
  if (!tag.children || tag.children.length === 0) return false;

	const tagsToFind = Array.isArray(targetTags) ? targetTags : [targetTags];

  return tag.children.some(child => tagsToFind.includes(child.tag));
}

export function hasNonEmptyAttribute(tag: DomItem, attrName: string): boolean {
	const val = getAttributeValue(tag, attrName);
	return val !== null && val !== '';
}
