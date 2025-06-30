chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "log") {
        chrome.storage.local.get({ log: [] }, (data) => {
            const updatedLog = [...data.log, message.payload];
            chrome.storage.local.set({ log: updatedLog });
        });
    }
});
