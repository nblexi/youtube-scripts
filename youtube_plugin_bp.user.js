// ==UserScript==
// @name         BOILERPLATE
// @version      0.6.0
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
let create_button = true;
let CHANGE_button;
let CHANGE_state;
let CHANGE_button_element = '#CHANGE_button';

let create_CHANGE_button = () => {
  'use strict';
  let target = document.querySelector('#end');

  if (!target) {
    setTimeout(() => {
      create_CHANGE_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.innerHTML = 'BOILERPLATE';
    elem.id = CHANGE_button_element;
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FF2E2E; background-color: #333333; color: #FF2E2E;';
    target.appendChild(elem);
    create_button = false;
    CHANGE_button = document.querySelector(CHANGE_button_element);
  }
};

let update_CHANGE_button_status = (color) => {
  'use strict';
  let bt = document.querySelector(CHANGE_button_element);
  if (!bt) {
    setTimeout(() => {
      update_CHANGE_button_status(color);
    }, 2000);
  } else {
    if (color === 'green') {
      bt.style.borderColor = '#4CAF50';
      bt.style.color = '#4CAF50';
    } else if (color === 'red') {
      bt.style.borderColor = '#FF2E2E';
      bt.style.color = '#FF2E2E';
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
    create_CHANGE_button();
  }
  //do
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[BOILERPLATE.js] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site()) {
    main();
  } else {
    console.info('[BOILERPLATE.js] Ignore this page');
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
  console.log(`[BOILERPLATE.js] keydown ${e}`);
});

document.addEventListener('click', (e) => {
  console.log(`[BOILERPLATE.js] click ${e}`);
});*/

document.addEventListener('yt-navigate-finish', (e) => {
  site();
});

document.addEventListener('click', function (e) {
  const target = e.target.closest(CHANGE_button_element);

  if (target) {
    if (CHANGE_state) {
      CHANGE_state = false;
      update_CHANGE_button_status('red');
    } else if (!CHANGE_state) {
      CHANGE_state = true;
      update_CHANGE_button_status('green');
    } else {
      update_CHANGE_button_status(0);
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
