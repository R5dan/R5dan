const modules = {
  css: [],
  js: [],
};

function module(urls, { css, js }) {
  urls.forEach(function (url) {
    const module = modules[url];
    if (module) {
      module.css.push(...css);
      module.js.push(...js);
    } else {
      modules[url] = {
        css: css,
        js: js,
      };
    }
  });
}

function loadCSS(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;

    // Inject the CSS into the active tab
    chrome.scripting.insertCSS(
      {
        target: { tabId: tabId },
        files: [url],
      },
      () => {
        console.log("CSS injected!");
      },
    );
  });
}

function loadJS(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [url],
    });
  });
}

function run() {
  const url = window.location.href;
  const mods = modules[url] ?? { css: [], js: [] };
  modules.css.push(...modules["<all_urls>"].css);
  modules.js.push(...modules["<all_urls>"].js);

  modules.css.forEach(function (url) {
    loadCSS(url);
  });
  modules.js.forEach(function (url) {
    loadJS(url);
  });
}

module(["<all_urls>"], {
  css: ["action/mono/css.css"],
  js: [],
});

run();
