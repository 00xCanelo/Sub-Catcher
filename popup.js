document.addEventListener("DOMContentLoaded", () => {
    const logBox = document.getElementById("logOutput");
    const status = document.getElementById("status");
    const wildcardEl = document.getElementById("wildcard");
    const countEl = document.getElementById("subdomainCount");
    const startBtn = document.getElementById("runScript");

    // Create and insert toggle log button
    const toggleLogBtn = document.createElement("button");
    toggleLogBtn.id = "toggleLogBtn";
    toggleLogBtn.textContent = "Remove Log";
    toggleLogBtn.style.backgroundColor = "#00c896";
    toggleLogBtn.style.border = "none";
    toggleLogBtn.style.color = "white";
    toggleLogBtn.style.padding = "10px 14px";
    toggleLogBtn.style.borderRadius = "6px";
    toggleLogBtn.style.cursor = "pointer";
    toggleLogBtn.style.marginBottom = "10px";
    toggleLogBtn.style.display = "block";
    toggleLogBtn.style.width = "100%";
    toggleLogBtn.style.fontWeight = "bold";
    toggleLogBtn.style.fontSize = "16px";
    toggleLogBtn.style.transition = "background 0.3s";
    startBtn.insertAdjacentElement('afterend', toggleLogBtn);

    toggleLogBtn.addEventListener("mouseover", () => {
        toggleLogBtn.style.backgroundColor = "#00a77b";
    });
    toggleLogBtn.addEventListener("mouseout", () => {
        toggleLogBtn.style.backgroundColor = "#00c896";
    });


    function renderLogs(logs) {
        logBox.innerHTML = "";
        logs.forEach(msg => {
            const p = document.createElement("p");
            p.textContent = msg;
            logBox.appendChild(p);
        });
        logBox.scrollTop = logBox.scrollHeight;
    }


    // Initial load of data
    chrome.storage.local.get(["log", "wildcard", "count"], (data) => {
        renderLogs(data.log || []);
        wildcardEl.textContent = data.wildcard || "-";
        countEl.textContent = data.count || 0;
    });

    // Listen for storage changes to update UI live
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            if (changes.wildcard) {
                wildcardEl.textContent = changes.wildcard.newValue || "-";
            }
            if (changes.count) {
                countEl.textContent = changes.count.newValue || "0";
            }
        }
    });
    

    // Listen for incoming log and status messages
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "log") {
            const p = document.createElement("p");
            p.textContent = message.payload;
            logBox.appendChild(p);
            logBox.scrollTop = logBox.scrollHeight;
        }
    });

    // Start script button click
    startBtn.addEventListener("click", async () => {

        startBtn.textContent = "In Progress...";
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab && tab.id) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            });
        }
    });

    // Toggle log display
    toggleLogBtn.addEventListener("click", () => {
        if (logBox.style.display === "none") {
            logBox.style.display = "block";
            toggleLogBtn.textContent = "Remove Log";
        } else {
            logBox.style.display = "none";
            toggleLogBtn.textContent = "View Log";
        }
    });


});
