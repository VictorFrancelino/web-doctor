#!/usr/bin/env bun

import { version } from "./package.json";
import { cac } from "cac";
import figlet from "figlet";
import ora from "ora";
import pc from "picocolors";
import { scanDirectory } from "./src/scanner";
import {
	analyzeHtml, parseHtmlToDom,
	analyzeCss, parseCssToAst,
	analyzeJs, parseJsToAst
} from './src';

const cli = cac("web-doctor");

cli
	.command("[dir]", "Scan a directory for HTML, CSS, and JS files.")
	.action(async (dir) => {
		const targetDir = dir || ".";

		console.log(pc.green(pc.bold(await figlet.text(
			'Web Doctor', { font: 'Star Wars' }
		))));

		const dirMsg = targetDir === "."
			? "the current directory"
			: `the ${targetDir} directory`;

		console.log(pc.blue(`Diagnosis ${dirMsg}...`));

		try {
			const scanSpinner = ora('Scanning files...').start();
			const files = await scanDirectory(targetDir);

			if (files.length === 0) {
				scanSpinner.fail(pc.red('No HTML, CSS, or JS files were found.'));
				return;
			}

			scanSpinner.succeed(pc.dim(
				`Found ${pc.bold(String(files.length))} files for analysis.`
			));

			const analysisSpinner = ora("Analyzing files...").start();

			const analysisPromises = files.map(async (f) => {
				try {
					let logs, icon = "";
					const fullPath = `${targetDir}/${f}`;

					if (f.endsWith(".html")) {
						const dom = await parseHtmlToDom(fullPath);
						logs = analyzeHtml(dom);
						icon = "🧱";
					} else if (f.endsWith(".css")) {
						const ast = await parseCssToAst(fullPath);
						logs = analyzeCss(ast);
						icon = "🎨";
					} else if (f.endsWith(".js")) {
						const ast = await parseJsToAst(fullPath);
						logs = analyzeJs(ast);
						icon = "📄";
					}

					return { file: f, logs, icon };
				} catch (e) {
					return { file: f, logs: null, icon: "", error: true };
				}
			});

			const results = await Promise.all(analysisPromises);
			analysisSpinner.succeed(pc.dim("Analysis complete.\n"));

			let totalIssues = 0;

			for (const result of results) {
				if (!result) continue;

				if (result.error) {
					console.log(pc.red(`❌Failed to diagnose file: ${result.file}`));
					continue;
				}

				console.log(pc.bold(`${result.icon} ${result.file}`));

				if (result.logs && result.logs.length > 0) {
					totalIssues += result.logs.length;

					for (const log of result.logs) {
						console.log(pc.red(`   ✖ ${log.title}`));
						console.log(pc.dim(`     ${log.msg}\n`));
					}
				} else console.log(pc.green(`   ✔ No issues found\n`));
			}

			if (totalIssues === 0) {
				console.log(pc.green(pc.bold(`✔ All clear! No issues found.`)));
			} else {
				console.log(pc.red(pc.bold(
					`${totalIssues} issue${totalIssues > 1 ? 's' : ''} found across ${files.length} file${files.length > 1 ? 's' : ''}.`
				)));
			}
		} catch (e) {
			console.error(pc.red("Error reading directory:"), e);
		}
	});

cli.help();
cli.version(version);
cli.parse();
