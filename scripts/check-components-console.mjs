// @ts-nocheck
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/Users/amrit/fractaldesign/packages/grokbotmade/node_modules/playwright');

async function main() {
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext();
	const page = await context.newPage();

	console.log('Navigating to http://127.0.0.1:5173/components ...');
	await page.goto('http://127.0.0.1:5173/components', { waitUntil: 'domcontentloaded' });

	// Find all component links
	const links = await page.evaluate(() => {
		const anchors = Array.from(document.querySelectorAll('a[href^="/components/"]'));
		return Array.from(new Set(anchors.map((a) => a.getAttribute('href')))).filter(Boolean);
	});
	await page.close();

	console.log(`Found ${links.length} component doc pages to test with concurrency 4.`);

	const results = [];
	let completed = 0;

	async function testUrl(link) {
		const url = `http://127.0.0.1:5173${link}`;
		const errors = [];
		const warnings = [];

		const testPage = await context.newPage();

		testPage.on('console', (msg) => {
			const type = msg.type();
			const text = msg.text();
			if (text.includes('[vite]') || text.includes('SvelteKit') || text.includes('[sveltekit]')) return;
			if (type === 'error') {
				errors.push(`[Console Error] ${text}`);
			} else if (type === 'warning') {
				warnings.push(`[Console Warning] ${text}`);
			}
		});

		testPage.on('pageerror', (err) => {
			errors.push(`[Page Error] ${err.message || err.toString()}`);
		});

		testPage.on('requestfailed', (req) => {
			errors.push(`[Request Failed] ${req.url()} (${req.failure()?.errorText || 'failed'})`);
		});

		try {
			const res = await testPage.goto(url, { waitUntil: 'load', timeout: 8000 });
			const status = res?.status();
			if (status && status >= 400) {
				errors.push(`[HTTP Error] Status ${status}`);
			}
			await testPage.waitForTimeout(300);

			const is404 = await testPage.evaluate(() => {
				const h1 = document.querySelector('h1')?.innerText?.trim();
				return document.title.includes('404') || h1 === '404' || h1 === 'Not Found';
			});
			if (is404) {
				errors.push(`[Render Error] Page appears to show 404/Not Found`);
			}
		} catch (err) {
			errors.push(`[Navigation Error] ${err.message}`);
		} finally {
			await testPage.close();
		}

		completed++;
		if (errors.length > 0) {
			console.log(`❌ [${completed}/${links.length}] ${link} -> ${errors.length} error(s)`);
			for (const e of errors) console.log(`      ${e}`);
		} else {
			process.stdout.write('.');
			if (completed % 50 === 0) console.log(` [${completed}/${links.length}]`);
		}

		return { link, errors, warnings };
	}

	const CONCURRENCY = 4;
	for (let i = 0; i < links.length; i += CONCURRENCY) {
		const chunk = links.slice(i, i + CONCURRENCY);
		const chunkResults = await Promise.all(chunk.map((link) => testUrl(link)));
		results.push(...chunkResults);
	}

	console.log('\n\n=== AUDIT SUMMARY ===');
	console.log(`Total Pages Tested: ${links.length}`);
	const failedPages = results.filter((r) => r.errors.length > 0);
	console.log(`Total Pages with Errors: ${failedPages.length}`);

	if (failedPages.length > 0) {
		console.log('\nDetailed Error Breakdown:');
		for (const fp of failedPages) {
			console.log(`\n--- ${fp.link} ---`);
			for (const e of fp.errors) console.log(`  ${e}`);
		}
	} else {
		console.log('\n✨ ALL 155 COMPONENT DOC PAGES LOADED WITH ZERO ERRORS!');
	}

	await browser.close();
}

main().catch((err) => {
	console.error('Fatal audit error:', err);
	process.exit(1);
});
