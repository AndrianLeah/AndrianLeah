// Draws the stars and downloads badges of the README as SVG files in badges/.
//
// The README shows them by relative path, so GitHub serves them from this repository. Badges
// from an external service go through GitHub's image proxy, which gives up after a few seconds
// and then shows a broken image.
//
// Runs every day from .github/workflows/badges.yml. Locally: node scripts/badges.mjs
// (set GITHUB_TOKEN to avoid the API's limit for anonymous requests).

import { mkdir, writeFile } from 'node:fs/promises'

const OWNER = 'AndrianLeah'
const REPOS = [
	{ name: 'craft-mcp-hub', color: '#1ba572' },
	{ name: 'ai-remove-lightcraft', color: '#f5c518' },
]

const headers = {
	Accept: 'application/vnd.github+json',
	'User-Agent': 'profile-badges',
	...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
}

async function api(path) {
	const response = await fetch(`https://api.github.com${path}`, { headers })
	if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`)
	return response.json()
}

/** Downloads of every asset of every release, as shields.io's "downloads/total" counts them */
async function totalDownloads(repo) {
	let total = 0
	for (let page = 1; ; page++) {
		const releases = await api(`/repos/${OWNER}/${repo}/releases?per_page=100&page=${page}`)
		for (const release of releases)
			for (const asset of release.assets) total += asset.download_count
		if (releases.length < 100) return total
	}
}

/** 1234 → 1.2k, as on shields.io */
function metric(n) {
	if (n < 1000) return String(n)
	const k = n / 1000
	return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`
}

// Advance widths of Verdana at 11 px, the font of the badges
const WIDTHS = {
	' ': 3.87, '.': 3.94, k: 6.47, ...Object.fromEntries([...'0123456789'].map((d) => [d, 7])),
	a: 6.68, b: 6.84, c: 5.75, d: 6.84, e: 6.6, f: 3.87, g: 6.84, h: 6.97, i: 3.02, j: 3.79,
	l: 3.02, m: 10.66, n: 6.97, o: 6.67, p: 6.84, q: 6.84, r: 4.69, s: 5.73, t: 4.33, u: 6.97,
	v: 6.47, w: 8.98, x: 6.47, y: 6.47, z: 5.73,
}
const textWidth = (text) => [...text].reduce((sum, ch) => sum + (WIDTHS[ch] ?? 7), 0)

/** Dark text on light colours (the yellow), white on dark ones, as shields.io does */
function textColors(hex) {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
	return luminance > 0.65 ? { fill: '#333', shadow: '#ccc' } : { fill: '#fff', shadow: '#010101' }
}

/** A "flat" badge, drawn like shields.io's */
function badge(label, value, color) {
	const lw = Math.round(textWidth(label) + 10)
	const vw = Math.round(textWidth(value) + 10)
	const width = lw + vw
	const text = (content, x, fill, shadow) => {
		const length = Math.round(textWidth(content) * 10)
		return (
			`<text aria-hidden="true" x="${x}" y="150" fill="${shadow}" fill-opacity=".3" transform="scale(.1)" textLength="${length}">${content}</text>` +
			`<text x="${x}" y="140" transform="scale(.1)" fill="${fill}" textLength="${length}">${content}</text>`
		)
	}
	const value_ = textColors(color)
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${value}"><title>${label}: ${value}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${width}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${lw}" height="20" fill="#555"/><rect x="${lw}" width="${vw}" height="20" fill="${color}"/><rect width="${width}" height="20" fill="url(#s)"/></g><g text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">${text(label, lw * 5, '#fff', '#010101')}${text(value, lw * 10 + vw * 5, value_.fill, value_.shadow)}</g></svg>\n`
}

await mkdir('badges', { recursive: true })
for (const { name, color } of REPOS) {
	const [repo, downloads] = await Promise.all([api(`/repos/${OWNER}/${name}`), totalDownloads(name)])
	await writeFile(`badges/${name}-stars.svg`, badge('stars', metric(repo.stargazers_count), color))
	await writeFile(`badges/${name}-downloads.svg`, badge('downloads', metric(downloads), color))
	console.log(`${name}: ${repo.stargazers_count} stars, ${downloads} downloads`)
}
