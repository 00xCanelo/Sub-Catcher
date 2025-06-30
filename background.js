chrome.runtime.onMessage.addListener((o,e,l)=>{"log"===o.type&&chrome.storage.local.get({log:[]},e=>{e=[...e.log,o.payload];chrome.storage.local.set({log:e})})});
