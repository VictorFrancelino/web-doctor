#!/usr/bin/env bun

import { cac } from "cac";
import pc from "picocolors";
import { scanDirectory } from "./src/scanner";
import parseCssToAst from "./src/css/parseCssToAst";
import calcCssPoints from "./src/css/calcCssPoints";
import parseJsToAst from "./src/js/parseJsToAst";
import calcJsPoints from "./src/js/calcJsPoints";
import parseHtmlToDom from "./src/html/parseHtmlToDom";
import calcHtmlPoints from "./src/html/calcHtmlPoints";

const cli = cac("web-doctor");

cli
  .command("[dir]", "Scan a directory for HTML, CSS, and JS files.")
  .action(async dir => {
    const targetDir = dir || ".";

		console.log(pc.bgGreen(pc.black("Web Doctor")));

		const dirMsg = targetDir === '.'
			? 'the current directory'
			: `the directory: ${targetDir}`;

		console.log(pc.cyan(`\nStarting the diagnosis in ${dirMsg}.\n`));

		try {
			const files = await scanDirectory(targetDir);

			if (files.length === 0) {
				console.log(pc.red("No HTML, CSS, or JS files were found to parse."));
				return;
			}

			console.log(pc.green(`Found ${files.length} files for analysis.`));
			console.log(pc.yellow("\nAnalyzing health rules..."));

			let totalPoints = 0;
			let successfulFiles = 0;

			const analysisPromises = files.map(async (f) => {
				try {
					let points = 0;
					let icon = '';

					if (f.endsWith('.html')) {
						const dom = await parseHtmlToDom(f);
						points = calcHtmlPoints(dom);
						icon = '🧱';
					} else if (f.endsWith('.css')) {
						const ast = await parseCssToAst(f);
						points = calcCssPoints(ast);
						icon = '🎨';
					} else if (f.endsWith('.js')) {
						const ast = await parseJsToAst(f);
						points = calcJsPoints(ast);
						icon = '📄';
					}

					return { file: f, icon, points };
				} catch (e) {
					console.log(pc.red(`❌ Failed to diagnose file: ${f}`));
					return null;
				}
			});

			const results = await Promise.all(analysisPromises);

			for (const result of results) {
				if (result) {
					totalPoints += result.points;
					successfulFiles++;
					console.log(
						`${pc.cyan(`${result.icon} ${result.file}`)} -> ${formatPoints(result.points)}`
					);
				}
			}

			if (successfulFiles > 0) {
				const finalAverage = totalPoints / successfulFiles;
				console.log(pc.bold(
					`\n📊 Overall Health Score: ${formatPoints(Math.round(finalAverage))}`
				));
			}
		} catch (e) {
			console.error(pc.red("Error reading directory:"), e);
    }
  });

cli.help();
cli.version("0.4.1");
cli.parse();

function formatPoints(points: number) {
  if (points >= 9) return pc.green(`${points}/10 (Healthy)`);
  if (points >= 5) return pc.yellow(`${points}/10 (Attention)`);
  return pc.red(`${points}/10 (Critical)`);
}
