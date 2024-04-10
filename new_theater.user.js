// ==UserScript==
// @name         new youtube theater
// @version      0.0.1
// @description  expand video
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/better_theatre.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/better_theatre.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;

let pageManager;
let container;
let secondary;
let video;
let columns;
let masthead;
let hidden_button;
let theater_container;
let theater_mode_button = 'ytp-size-button';
let ytd_watch = 'ytd-watch-grid';
let container_new_style =
  'margin-top: 0px; margin-bottom: 4vh; position: fixed; top: 0px; left: 0px; width: 100vw; min-width: 100vw; background-color: #000000; height: auto; min-height: 100vh;';
let columns_new_style =
  'position: absolute; margin-left: 0px; margin-right: 0px; top: 107vh; height: 100%; min-height: 100%; width: 100%; min-width: 100%; background-color: rgba(0, 0, 0, 0.9);';
let masthead_new_style =
  'transform: translateY(101vh); position: absolute; background-color: rgba(0, 0, 0, 0.95);';
let vars_initialized = false;
let masthead_vars_initialized = false;
let custom_nav_bar = false;
let custom_video = false;
let manual_override = false;
let sts_button;
let width_button;
let create_button = true;
let width_status = false;
let create_width_button_bool = true;

let create_status_button = () => {
  let target = document.querySelector('#end');

  if (!target) {
    setTimeout(() => {
      create_status_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.innerHTML = 'Theatre';
    elem.id = 'lexcode_button_theatre';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FF2E2E; background-color: #333333; color: #FF2E2E;';
    target.appendChild(elem);
    create_button = false;
    sts_button = document.querySelector('#lexcode_button_theatre');
  }
};

let create_width_button = () => {
  let target = document.querySelector(
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls'
  );

  if (!target) {
    setTimeout(() => {
      create_width_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.id = 'lexcode_button_width';
    elem.className = 'ytp-button';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; border-radius: 8px; margin-right: 10px; border: 2px solid #ddccff; color: #ddccff;';
    target.prepend(elem);
    create_width_button_bool = false;
    width_button = document.querySelector('#lexcode_button_width');
  }
};

let update_button_status = (color) => {
  let bt = document.querySelector('#lexcode_button_theatre');

  if (!bt) {
    setTimeout(() => {
      update_button_status(color);
    }, 2000);
  } else {
    if (color === 1) {
      bt.style.borderColor = '#FF2E2E';
      bt.style.color = '#FF2E2E';
    } else if (color === 0) {
      bt.style.borderColor = '#4CAF50';
      bt.style.color = '#4CAF50';
    } else {
      bt.style.borderColor = '#FFFFFF';
      bt.style.color = '#FFFFFF';
    }
  }
};

let init_vars = (cb) => {
  let check_variable = (v, ident) => {
    if (!v) {
      if (document.querySelector(ident)) {
        v = document.querySelector(ident);
      } else {
        console.log(`failed to get ${ident}`);
      }
    }
  };

  pageManager = document.querySelector('#page-manager');
  video = document.querySelector('video');
  columns = document.querySelector('#columns');
  secondary = document.querySelector('#secondary-inner');
  masthead = document.querySelector('#masthead-container');
  theater_container = document.querySelector('#player-full-bleed-container');
  container = theater_container;

  check_variable(pageManager, '#page-manager');
  check_variable(video, 'video');
  check_variable(columns, '#columns');
  check_variable(secondary, '#secondary-inner');
  check_variable(masthead, '#masthead-container');
  check_variable(container, '#player-full-bleed-container');
  check_variable(theater_container, '#player-full-bleed-container');

  if (!theater_container) {
    click(document.getElementsByClassName(theater_mode_button).item(0));
  }
  masthead_vars_initialized = true;
  vars_initialized = true;
  if (cb != 'none') {
    cb();
  }
};

let init_masthead_vars = (cb) => {
  masthead = document.querySelector('#masthead-container');

  if (!masthead) {
    masthead = document.querySelector('#masthead-container');
  } else {
    console.log(`failed to get masthead`);
  }

  masthead_vars_initialized = true;

  if (cb != 'none') {
    cb();
  }
};

let video_exists = (debug) => {
  'use strict';

  let element_collection = document.getElementsByClassName(theater_mode_button);
  let button = element_collection.item(0);

  let status_collection = document.getElementsByTagName(ytd_watch);
  let button_status = status_collection.item(0);

  if (button_status) {
    if (!custom_nav_bar) {
      lower_nav_bar();
    }
    if (!custom_video) {
      expand_video();
    }
  } else if (!button_status) {
    click(button);
    if (!custom_nav_bar) {
      lower_nav_bar();
    }
    if (!custom_video) {
      expand_video();
    }
  } else {
    console.info(`[set_theatre] button is undefined`);
    site();
  }
};

let lower_nav_bar = () => {
  'use strict';
  if (!masthead_vars_initialized) {
    init_masthead_vars(lower_nav_bar);
  } else {
    if (!manual_override) {
      if (hidden_button) {
        hidden_button.remove();
      }
      masthead.setAttribute('style', masthead_new_style);
      console.info(`[set-theatre] nav bar lowered`);
      update_button_status(0);
      custom_nav_bar = true;
    }
  }
};

let restore_nav_bar = () => {
  'use strict';
  if (!masthead_vars_initialized) {
    init_masthead_vars(restore_nav_bar);
  } else {
    masthead.removeAttribute('style');
    console.info(`[set-theatre] nav bar restored`);
    update_button_status(1);
    custom_nav_bar = false;
  }
};

let click = (cb) => {
  'use strict';
  if (cb) {
    let evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    console.info(`[set-theatre] simulated click`);

    cb.dispatchEvent(evt);
  }
};

let double_click = (cb) => {
  'use strict';
  if (cb) {
    let evt = new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    console.info(`[set-theatre] simulated double click`);
    cb.dispatchEvent(evt);
  }
};

let expand_video = () => {
  'use strict';
  let was_paused = false;
  if (!vars_initialized) {
    init_vars(expand_video);
  } else {
    if (!manual_override) {
      if (video) {
        if (video.paused) {
          was_paused = true;
        } else {
          video.pause();
        }
        if (hidden_button) {
          hidden_button.remove();
        }
        container.setAttribute('style', container_new_style);
        theater_container = video.setAttribute('height', 'auto');
        video.setAttribute('width', '100vw');
        video.setAttribute('height', 'auto');
        video.minHeight = 'auto';
        video.minWidth = '100vw';
        video.style.width = 'auto';
        video.style.top = '0';
        video.style.left = '0';
        video.style.height = '100%';
        video.overflow = 'hidden';
        columns.setAttribute('style', columns_new_style);
        custom_video = true;
        if (was_paused) {
          video.play();
          video.pause();
        } else {
          video.play();
        }

        console.info(`[set-theatre] video expanded`);
        update_button_status(0);
      } else {
        init_vars(expand_video);
      }
    }
  }
};

let main = () => {
  'use strict';
  console.info('[set_theatre] main');

  setTimeout(function () {
    init_vars('none');
  }, 2000);
  if (create_button) {
    create_status_button();
  }
  if (create_width_button_bool) {
    create_width_button();
  }
  setTimeout(function () {
    video_exists(true);
  }, 1000);
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[set-theatre] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site() === true) {
    main();
  } else {
    console.info('[set_theatre] Ignore this page');
    non_video_mode();
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

let non_video_mode = () => {
  'use strict';
  restore_nav_bar();
  update_button_status(3);
};

document.addEventListener('yt-navigate-finish', (e) => {
  manual_override = false;
  site();
});

document.addEventListener('click', (e) => {
  const width_button = e.target.closest('#lexcode_button_width');

  if (width_button) {
    let change_status = () => {
      if (width_status) {
        width_status = false;
      } else {
        width_status = true;
      }
    };

    if (video) {
      if (width_status) {
        video.width = '100vw';
        video.style.width = '100vw';
        video.minWidth = '100vw';
        video.setAttribute('width', '100vw');
      } else {
        video.width = '99vw';
        video.style.width = '99vw';
        video.minWidth = '99vw';
        video.setAttribute('width', '99vw');
      }
    }
    change_status();
  }
});

(() => {
  'use strict';
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    current_page = url;
  };
})();
