export type DomItem = {
	tag: string;
  attributes: AttributeItem[];
	content?: string;
	children?: DomItem[];
};

export type AttributeItem = {
  name: string;
  value: string;
};
