import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CACHE_DIR = join(import.meta.dirname, '.cache');

// Versions are pinned so results stay comparable over time.
const SOURCES = [
	{
		name: 'bootstrap-5.3.8',
		url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.css',
	},
	{
		name: 'webawesome-3.14.0',
		url: 'https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.14.0/dist-cdn/styles/native.css',
	},
	{
		name: 'mantine-9.7.2',
		url: 'https://cdn.jsdelivr.net/npm/@mantine/core@9.7.2/styles.css',
	},
];

/**
 * @param {{ name: string, url: string }} source
 * @returns {Promise<string>}
 */
async function readSource({ name, url }) {
	const cachePath = join(CACHE_DIR, `${name}.css`);

	try {
		return await readFile(cachePath, 'utf8');
	} catch {
		// Not cached yet.
	}

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}

	const css = await response.text();

	await mkdir(CACHE_DIR, { recursive: true });
	await writeFile(cachePath, css);

	return css;
}

/**
 * @returns {Promise<{ name: string, css: string }[]>}
 */
export function loadSources() {
	return Promise.all(
		SOURCES.map(async (source) => ({
			name: source.name,
			css: await readSource(source),
		})),
	);
}
