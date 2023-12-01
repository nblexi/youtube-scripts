// ==UserScript==
// @name         BOILERPLATE
// @version      0.5
// @description  BOILERPLATE description
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/youtube_plugin_bp.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/youtube_plugin_bp.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;
let TEMPLATE_state;
let create_button = true;
let sts_button;

let create_status_button = () => {
  'use strict';
  let target = document.querySelector('#end');

  if (!target) {
    setTimeout(() => {
      create_status_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.innerHTML = 'BOILERPLATE';
    elem.id = 'lexcode_button_BOILERPLATE';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FF2E2E; background-color: #333333; color: #FF2E2E;';
    target.appendChild(elem);
    create_button = false;
    sts_button = document.querySelector('#lexcode_button_BOILERPLATE');
  }
};

let update_button_status = (color) => {
  'use strict';
  let bt = document.querySelector('#lexcode_button_BOILERPLATE');
  if (!bt) {
    setTimeout(() => {
      update_button_status(color);
    }, 2000);
  } else {
    if (color === 1) {
      //red
      bt.style.borderColor = '#FF2E2E';
      bt.style.color = '#FF2E2E';
    } else if (color === 0) {
      //green
      bt.style.borderColor = '#4CAF50';
      bt.style.color = '#4CAF50';
    } else {
      //white
      bt.style.borderColor = '#FFFFFF';
      bt.style.color = '#FFFFFF';
    }
  }
};

let main = () => {
  'use strict';

  if (create_button) {
    create_status_button();
  }
  //do
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[BOILERPLATE] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site()) {
    main();
  } else {
    console.info('[BOILERPLATE] Ignore this page');
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

/* window.addEventListener('keydown', (e) => {
  console.log(`[BOILERPLATE] keydown ${e}`);
});

document.addEventListener('click', (e) => {
  console.log(`[BOILERPLATE] click ${e}`);
});*/

document.addEventListener('yt-navigate-finish', (e) => {
  site();
});

document.addEventListener('click', function (e) {
  const target = e.target.closest('#lexcode_button_BOILERPLATE'); // Or any other selector.

  if (target) {
    if (TEMPLATE_state) {
      update_button_status(1);
      TEMPLATE_state = false;
    } else if (!TEMPLATE_state) {
      update_button_status(0);
      TEMPLATE_state = true;
    }
  }
});

(() => {
  'use strict';
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    current_page = url;
  };
})();
