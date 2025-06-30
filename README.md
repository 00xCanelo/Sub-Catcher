# 00xCanelo Sub Catcher


[Extension Icon: Icons/icon128.png]

## Overview

Sub Catcher is a Chrome extension designed to help security researchers, pentesters, and bug bounty hunters automatically extract and collect subdomains related to a target domain from SecurityTrails ([https://securitytrails.com](https://securitytrails.com/)). It parses SecurityTrails domain and DNS pages, compiles unique subdomains, and lets you download the results as a text file.

---

## Features

- Auto-detects the target domain from SecurityTrails URLs.
- Crawls up to 100 pages of subdomain listings with built-in delay and retry logic.
- Handles HTTP 429 (rate limiting) gracefully by waiting before retrying.
- Collects unique subdomains in a set to avoid duplicates.
- Provides progress logs visible in the extension popup.
- Exports the full list of discovered subdomains as a `.txt` file.
- Stores progress and count data using Chrome's local storage.

---

## Installation

### Load Locally (For Development / Testing)

1. Clone this repository:
    
    `git clone https://github.com/00xCanelo/Sub-Catcher`
    
2. Open Chrome and go to:
    
    `chrome://extensions/`
    
3. Enable **Developer mode** (toggle at the top right).
4. Click **Load unpacked** and select the cloned repository folder.
5. The extension icon should appear in the Chrome toolbar.

---

## Usage

1. Visit a SecurityTrails DNS or domain list page for your target, for example:
    
    `https://securitytrails.com/list/apex_domain/example.com`
    
2. Click the **Sub Catcher** extension icon in your toolbar.
3. The extension will automatically begin crawling and extracting subdomains.
4. There is button `Start The Hunt` will start also the crawling
5. Progress and logs will be displayed in the popup.
6. When finished, the extension downloads a text file with all collected subdomains.

---

## Permissions

- `storage` — to save progress and data locally.
- `scripting` and `activeTab` — to interact with SecurityTrails pages.
- `tabs` — to manage tabs and fetch content.

---

## File Structure

```
/
├── Icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── background.js
├── content.js
├── manifest.json
├── popup.html
├── popup.js
└── README.md
```

---

## Contributing

Contributions are welcome! Feel free to:

- Report bugs or issues.
- Suggest new features.
- Submit pull requests.

---

## Contact

Created by 00xCanelo ([https://github.com/00xCanelo](https://github.com/00xCanelo)).

---

## Disclaimer

This tool is intended for authorized security research and pentesting purposes only. Use responsibly and comply with all applicable laws and platform terms of service.

---

Enjoy hunting subdomains! 🚀
