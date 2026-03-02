import { readdir } from "node:fs/promises";
import { join } from "node:path";

const TARGET_EXTENSIONS = ['.html', '.css', '.js'];
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);

export async function scanDirectory(dir: string) {
	const filesFound: string[] = [];

	async function recursiveScan(currentPath: string) {
		const entries = await readdir(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			if (IGNORED_DIRS.has(entry.name)) continue;

			const fullPath = join(currentPath, entry.name);

			if (entry.isDirectory()) await recursiveScan(fullPath);
			else if (entry.isFile()) {
				const isTarget = TARGET_EXTENSIONS.some(
					ext => entry.name.endsWith(ext)
				);
				if (isTarget) filesFound.push(fullPath);
			}
		}
	}

	await recursiveScan(dir);
	return filesFound;
}
