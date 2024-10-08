// ==UserScript==
// @name         Theater Mode
// @version      0.0.7
// @description  expand video
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/better_theater_mode.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/better_theater_mode.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;

let pageManagerElement = '#page-manager';
let containerElement = '#player-full-bleed-container';
let theater_containerElement = '#player-full-bleed-container';
let secondaryElement = '#secondary-inner';
let columnsElement = '#columns';
let videoElement = 'video';
let mastheadElement = '#masthead-container';
let theater_mode_button = 'ytp-size-button';
let ytd_watch = 'ytd-watch-grid';
let movie_playerElement = '#movie_player';
let playerContainerElement = 'player-container-inner';

let pageManager;
let container;
let theater_container;
let secondary;
let video;
let columns;
let masthead;
let hidden_button;

let container_new_style =
  'margin-top: 0px; margin-bottom: 4vh; position: fixed; top: 0px; left: 0px; width: 100vw; min-width: 100vw; background-color: #000000; height: auto; min-height: 100vh;';
let columns_new_style =
  'position: absolute; margin-left: 0px; margin-right: 0px; top: 107vh; height: 100; min-height: 100%; width: 100%; min-width: 100%; background-color: rgba(0, 0, 0, 0.9);';
let masthead_new_style =
  'transform: translateY(101vh); position: absolute; background-color: rgba(0, 0, 0, 0.95);';

let vars_initialized = false;
let masthead_vars_initialized = false;

let custom_nav_bar_position = false;
let custom_video = false;

let width_button;
let width_status = false;
let create_width_button_bool = true;

let create_width_button = () => {
  'use strict';

  let target = document.querySelector(
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls'
  );

  if (!target) {
    setTimeout(() => {
      create_width_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.id = 'safari_width_button';
    elem.className = 'ytp-button';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; border-radius: 8px; margin-right: 10px; border: 2px solid #ddccff; color: #ddccff;';
    target.prepend(elem);
    create_width_button_bool = false;
    width_button = document.querySelector('#safari_width_button');
  }
};

let init_masthead_vars = (cb) => {
  'use strict';

  let tempMasthead = document.querySelector(mastheadElement);
  if (tempMasthead) {
    masthead = tempMasthead;
    masthead_vars_initialized = true;
  } else {
    console.warn(`[better_theater_mode.js] failed to get ${mastheadElement}`);
    masthead_vars_initialized = false;
  }

  if (cb != 'none') {
    cb();
  }
};

let set_to_theater_mode = () => {
  //https://stackoverflow.com/questions/53584026/toggle-the-cinema-mode-on-youtube-with-javascript

  console.log('[better_theater_mode.js] set_to_theater_mode()');
  const theaterButton = document.getElementsByClassName('ytp-size-button')?.[0];
  theaterButton?.click?.();

  const isDefaultView =
    document.getElementById(playerContainerElement)?.children?.length === 0;

  console.log(`[better_theater_mode.js] isDefaultView: ${isDefaultView}`);

  if (isDefaultView) {
    setTimeout(() => {
      theaterButton?.click?.(), 1;

      const isNowDefaultView =
        document.getElementById(playerContainerElement)?.children?.length === 0;

      console.log(
        `[better_theater_mode.js] new isDefaultView: ${isNowDefaultView}`
      );
    });
  }
};

let init_vars = (cb) => {
  'use strict';

  let check_variable = (v, ident) => {
    'use strict';

    let t = document.querySelector(ident);
    if (t) {
      v = t;
    } else {
      console.warn(`[better_theater_mode.js] failed to get ${ident}`);
      vars_initialized = false;
    }
  };

  pageManager = document.querySelector(pageManagerElement);
  video = document.querySelector(videoElement);
  columns = document.querySelector(columnsElement);
  secondary = document.querySelector(secondaryElement);
  container = document.querySelector(containerElement);
  theater_container = document.querySelector(theater_containerElement);
  vars_initialized = true;

  check_variable(pageManager, pageManagerElement);
  check_variable(video, videoElement);
  check_variable(columns, columnsElement);
  check_variable(secondary, secondaryElement);
  check_variable(container, containerElement);
  check_variable(theater_container, theater_containerElement);

  set_to_theater_mode();

  if (cb != 'none') {
    cb();
  }
};

let video_exists = () => {
  'use strict';

  let set_video = () => {
    if (!custom_nav_bar_position) {
      lower_nav_bar();
    }
    if (!custom_video) {
      expand_video();
    }
  };

  set_video();
};

let lower_nav_bar = () => {
  'use strict';

  if (!masthead_vars_initialized) {
    init_masthead_vars(lower_nav_bar);
  } else {
    if (hidden_button) {
      hidden_button.remove();
    }
    masthead.setAttribute('style', masthead_new_style);
    console.info(`[better_theater_mode.js] nav bar lowered`);
    custom_nav_bar_position = true;
  }
};

let restore_nav_bar = () => {
  'use strict';

  if (!masthead_vars_initialized) {
    init_masthead_vars(restore_nav_bar);
  } else {
    masthead.removeAttribute('style');
    console.info(`[better_theater_mode.js] nav bar restored`);
    custom_nav_bar_position = false;
  }
};

let expand_video = () => {
  'use strict';

  let was_paused = false;
  if (!vars_initialized) {
    init_vars(expand_video);
  } else {
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
    } else {
      init_vars(expand_video);
    }
  }
};

let get_current_browser = () => {
  if (navigator.userAgent.indexOf('Safari') != -1) {
    return true;
  } else {
    return false;
  }
};

let main = () => {
  'use strict';

  console.info('[better_theater_mode.js] main');

  if (create_width_button_bool && get_current_browser()) {
    create_width_button();
  }

  setTimeout(function () {
    init_vars('none');
    video_exists();
  }, 500);
};

let is_video = () => {
  'use strict';

  if (window.location.href.match(/https?:\/\/www\.youtube\.com\/watch\.*/)) {
    return true;
  } else {
    return false;
  }
};

let site = () => {
  'use strict';

  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      //console.debug(`[theatre] state: ${a}`);
      //console.debug(`[theatre] ??: ${b}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_video() === true) {
    main();
  } else {
    console.info('[better_theater_mode.js] ignore this page');
    restore_nav_bar();
  }
};

document.addEventListener('yt-navigate-finish', (e) => {
  'use strict';

  site();
});

document.addEventListener('click', (e) => {
  'use strict';

  if (get_current_browser()) {
    const width_button = e.target.closest('#safari_width_button');

    if (width_button) {
      let movie_player = document.querySelector(movie_playerElement);
      video = document.querySelector(videoElement);
      if (movie_player && video) {
        if (width_status) {
          movie_player.width = '100vw';
          movie_player.style.width = '100vw';
          movie_player.minWidth = '100vw';
          movie_player.setAttribute('width', '100vw');

          video.width = '100vw';
          video.style.width = '100vw';
          video.minWidth = '100vw';
          video.setAttribute('width', '100vw');
        } else {
          movie_player.width = '99vw';
          movie_player.style.width = '99vw';
          movie_player.minWidth = '99vw';
          movie_player.setAttribute('width', '99vw');

          video.width = '99vw';
          video.style.width = '99vw';
          video.minWidth = '99vw';
          video.setAttribute('width', '99vw');
        }
      }

      if (width_status) {
        width_status = false;
      } else {
        width_status = true;
      }
    }
  }
});

(() => {
  'use strict';

  window.history.__proto__.pushState = (a, b, url) => {
    window.location.href = url;
    current_page = url;
  };
})();
