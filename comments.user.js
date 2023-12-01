// ==UserScript==
// @name         remove youtube comments
// @version      0.8.3
// @description  youtube comments are a cesspool
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/comments.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/comments.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;
let comments_section;
let commentsvisible = true;

let comment_visibility = () => {
  if (commentsvisible) {
    comments_section = document.querySelector('#comments');

    if (!comments_section) {
      setTimeout(() => {
        comment_visibility();
      }, 2000);
    } else {
      console.info('[comments] removed comments');
      commentsvisible = false;
      comments_section.remove();
    }
  }
};

let main = () => {
  'use strict';
  comment_visibility();
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[comments] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site()) {
    main();
  } else {
    console.info('[comments] Ignore this page');
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
