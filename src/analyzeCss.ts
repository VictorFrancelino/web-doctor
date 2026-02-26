import postcss from "postcss";

type astItems = {
	selector: string;
	properties: propertiesItems[];
}

type propertiesItems = {
	propertie: string;
	value: string;
}

async function analyzeCss(path: string): Promise<astItems[]> {
	const code = await Bun.file(path).text();
	const ast = postcss.parse(code);

	const astCssItems: astItems[] = [];

	ast.walkRules(rule => {
		const properties: propertiesItems[] = [];

		let selector = rule.selector;

		rule.walkDecls(decl => {
			let propertie = decl.prop;
			let value = decl.value;

			properties.push({ propertie, value });
		});

		astCssItems.push({ selector, properties });
	});

	return astCssItems;
}

export default analyzeCss;
