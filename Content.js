(async function () {
    function log(message) {
        const entry = `[${new Date().toLocaleTimeString()}] ${message}`;
        chrome.runtime.sendMessage({ type: "log", payload: entry });

        chrome.storage.local.get({ log: [] }, (result) => {
            const updatedLog = [...result.log, entry];
            chrome.storage.local.set({ log: updatedLog });
        });
    }

    function extractWildcardFromURL() {
        const url = window.location.href;
        const matchDNS = url.match(/securitytrails\.com\/domain\/([^/]+)\/dns/);
        const matchList = url.match(/securitytrails\.com\/list\/apex_domain\/([^/?#]+)/);
        return (matchDNS && matchDNS[1]) || (matchList && matchList[1]) || null;
    }

    let wildcard = extractWildcardFromURL();
    if (!wildcard) {
        log('❌ Not on a valid SecurityTrails DNS or list page.');
        return;
    }

    log(`🎯 Auto-detected domain: ${wildcard}`);

    await runSubdomainCatcher(wildcard);

    async function runSubdomainCatcher(wildcard) {
        const totalPages = 100;
        const delayMs = 10000;
        const allSubdomains = new Set();
        const baseURL = `https://securitytrails.com/list/apex_domain/${wildcard}`;
        const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
        let consecutive404s = 0;

        async function fetchWithRetry(url, maxRetries = 3) {
            let retryCount = 0;
            while (retryCount < maxRetries) {
                try {
                    const res = await fetch(url);
                    if (res.status === 429) {
                        const waitTime = 10000 + retryCount * 15000;
                        log(`⚠️ Got 429. Waiting ${waitTime / 1000}s... (Retry ${retryCount + 1})`);
                        await sleep(waitTime);
                        retryCount++;
                    } else if (res.status === 404) {
                        return 404;
                    } else if (!res.ok) {
                        log(`❌ HTTP ${res.status} for ${url}`);
                        return null;
                    } else {
                        return await res.text();
                    }
                } catch (err) {
                    log(`❌ Fetch error: ${err}`);
                    return null;
                }
            }
            return null;
        }

        for (let page = 1; page <= totalPages; page++) {
            const url = page === 1 ? baseURL : `${baseURL}?page=${page}`;
            log(`⏳ Fetching: ${url}`);

            const html = await fetchWithRetry(url);
            if (html === 404) {
                consecutive404s++;
                log(`⚠️ Page ${page} returned 404 (Consecutive 404s: ${consecutive404s})`);
                if (consecutive404s >= 2) {
                    log(`🚫 Stopping: Too many 404s. Assuming no more pages.`);
                    break;
                }
                continue;
            }

            if (!html) continue;
            consecutive404s = 0;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = [...doc.querySelectorAll('a.link')];

            for (const a of links) {
                const match = a.getAttribute('href').match(/\/domain\/([^/]+)\//);
                if (match) {
                    allSubdomains.add(match[1]);
                }
            }

            log(`✅ Page ${page} done. Total so far: ${allSubdomains.size}`);
            chrome.storage.local.set({
                count: allSubdomains.size,
                wildcard
            })
            if (page < totalPages) {
                log(`⏱ Waiting ${delayMs / 1000}s before next page...`);
                await sleep(delayMs);
            }
        }

        log(`🎉 Done. Total unique subdomains: ${allSubdomains.size}`);


        const textContent = [...allSubdomains].join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const fileUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${wildcard}_subdomains_00xCanelo.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(fileUrl);


    }
})();
