// ==UserScript==
// @name         expand youtube video description
// @version      0.4.6
// @description  edit description by auto-expanding and adding like information
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/edit_description.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/edit_description.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;
let loaded_like_count;
let elems_created = false;

let expand_description = () => {
  setTimeout(() => {
    let see_more = document.querySelector(
      '#description #description-inline-expander #expand'
    );

    if (!see_more) {
      setTimeout(() => {
        expand_description();
      }, 2000);
    } else {
      see_more.click();
      console.info('[description] expanded description');
    }
  }, 2000);
};

let main = () => {
  'use strict';
  expand_description();
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[description] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site()) {
    main();
  } else {
    console.info('[description] Ignore this page');
  }
};

let is_site = () => {
  'use strict';
  if (window.location.href.match(/https?:\/\/www\.youtube\.com\/watch\.*/)) {
    return true;
  } else {
    return false;
  }
};

document.addEventListener('yt-navigate-finish', (e) => {
  site();
});

(() => {
  'use strict';
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    current_page = url;
  };
})();
