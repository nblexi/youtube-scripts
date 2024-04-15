// ==UserScript==
// @name         pretify youtube
// @version      0.0.5
// @description  new UI bad
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/remove_content.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/remove_content.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;
let original_secondary = true;
let content_section_element = '#bottom-grid';

let content_visibility = () => {
  let content_section = document.querySelector(content_section_element);

  if (!content_section) {
    setTimeout(() => {
      content_visibility();
    }, 2000);
  } else {
    content_section.remove();

    console.log('content_visibility');
    if (document.querySelector(content_section_element)) {
      content_visibility();
    } else {
      console.info('[content] removed content');
    }
  }
};

let prep_secondary = () => {
  if (original_secondary) {
    let columns = document.querySelector('#columns');
    let primary = document.querySelector('#primary');
    let secondary = document.querySelector('#secondary');

    primary.style = ' min-width: 0;';
    secondary.style = 'padding-left: 2vw; width: 80%';

    columns.insertBefore(primary, null);

    original_secondary = false;
  }
  content_visibility();
};

let main = () => {
  'use strict';
  prep_secondary();
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[content] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site()) {
    main();
  } else {
    console.info('[content] Ignore this page');
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
