const glob = new Bun.Glob('**/*.{html,css,js}');
const ignore = ['node_modules', '.git', 'dist', 'build'];

export async function scanDirectory(dir: string): Promise<string[]> {
	const files: string[] = [];

	for await (const file of glob.scan({
		cwd: dir,
		followSymlinks: false,
		onlyFiles: true,
	})) {
		const parts = file.split('/');
		if (!parts.some(part => ignore.includes(part))) files.push(file);
	}

	return files;
}
