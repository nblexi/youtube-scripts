// ==UserScript==
// @name         better youtube theater
// @version      0.9.4
// @description  expand video
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/set_theatre.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/set_theatre.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;

let pageManager;
let container;
let container_original_class;
let container_original_style;
let secondary;
let secondary_original_style;
let video;
let video_original_style;
let video_original_height;
let video_original_width;
let video_original_minHeight;
let video_original_minWidth;
let video_original_overflow;
let video_original_top;
let video_original_left;
let columns;
let columns_original_style;
let masthead;
let masthead_original_style;
let hidden_button;
let theater_container;
let theater_mode_butt;
let fullscreen_button;
let container_new_style =
  'margin-top: 0px; margin-bottom: 4vh; position: fixed; top: 0px; left: 0px; width: 100vw; min-width: 100vw; background-color: #000000; height: auto; min-height: 100vh;';
let columns_new_style =
  'position: absolute; margin-left: 0px; margin-right: 0px; top: 107vh; width: 100%; min-width: 100%; background-color: rgba(0, 0, 0, 0.9);';
let masthead_new_style =
  'transform: translateY(101vh); position: absolute; background-color: rgba(0, 0, 0, 0.95);';
let clip_button;
let vars_initialized = false;
let masthead_vars_initialized = false;
let custom_nav_bar = false;
let custom_video = false;
let manual_override = false;
let sts_button;
let mv_chat;
let chat_button_created = false;
let width_button;
let chat_dir = true;
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

let create_chat_button = () => {
  if (!chat_button_created) {
    let target = document.querySelector('#end');

    if (!target) {
      setTimeout(() => {
        create_chat_button();
      }, 2000);
    } else {
      let elem = document.createElement('button');
      elem.innerHTML = 'Move Chat';
      elem.id = 'lexcode_button_move-chat';
      elem.type = 'submit';
      elem.name = 'formBtn';
      elem.style =
        'font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FFFFFF; background-color: #333333; color: #FFFFFF;';
      target.appendChild(elem);
      create_button = false;
      mv_chat = document.querySelector('#lexcode_button_move-chat');
    }
    chat_button_created = true;
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

  let get_original = (storage_var, v, info) => {
    if (v) {
      storage_var = v.getAttribute(info);
    }
  };

  pageManager = document.querySelector('#page-manager');
  video = document.querySelector('video');
  columns = document.querySelector('#columns');
  secondary = document.querySelector('#secondary-inner');
  masthead = document.querySelector('#masthead-container');
  theater_container = document.querySelector('#player-full-bleed-container');
  container = document.querySelector('#player-full-bleed-container');

  theater_mode_butt = document.querySelector(
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-size-button.ytp-button'
  );
  fullscreen_button = document.getElementsByClassName(
    'ytp-fullscreen-button'
  )[0];

  check_variable(pageManager, '#page-manager');
  check_variable(container, '#player-container');
  check_variable(video, 'video');
  check_variable(columns, '#columns');
  check_variable(secondary, '#secondary-inner');
  check_variable(masthead, '#masthead-container');
  check_variable(theater_container, '#player-full-bleed-container');

  setTimeout(() => {
    get_original(container_original_class, container, 'class');
    get_original(container_original_style, container, 'style');
    get_original(video_original_style, video, 'style');
    get_original(video_original_height, video, 'height');
    get_original(video_original_width, video, 'width');
    get_original(columns_original_style, columns, 'style');
    get_original(secondary_original_style, secondary, 'style');
    get_original(masthead_original_style, masthead, 'style');
    if (video) {
      video_original_minHeight = video.minHeight;
      video_original_minWidth = video.minWidth;
      video_original_overflow = video.overflow;

      video_original_top = video.style.top;
      video_original_left = video.style.left;
    }
  }, 2000);

  if (!theater_container) {
    click(document.getElementsByClassName('ytp-size-button').item(0));
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

  setTimeout(() => {
    masthead_original_style = masthead.getAttribute('style');
  }, 2000);

  masthead_vars_initialized = true;

  if (cb != 'none') {
    cb();
  }
};

let find_button_and_status = (what_to_return) => {
  'use strict';
  let element_collection = document.getElementsByClassName('ytp-size-button');
  let button = element_collection.item(0);

  if (what_to_return == 'button') {
    return button;
  } else if (what_to_return == 'status') {
    let status_collection = document.getElementsByTagName('ytd-watch-grid');
    let ytd_watch_flexy = status_collection.item(0);
    return ytd_watch_flexy.theater;
  }
};

let is_live = () => {
  let chat = document.getElementById('chat');
  if (chat) {
    create_chat_button();
    return true;
  } else {
    return false;
  }
};

let is_truffle = () => {
  // TODO, idk how to find non-channel-specific selector
  // let truffle = document.querySelector();
};

let video_exists = (debug) => {
  'use strict';
  let button_status;
  let button;

  button = find_button_and_status('button');

  if (debug) {
    console.debug('[set_theatre] Page Fully Loaded');
  }

  button_status = find_button_and_status('status');

  if (debug) {
    //console.dir(button);
    console.log(
      `[set-theatre] button_dataset_tooltip: ${button.dataset.titleNoTooltip}`
    );
    console.log(`[set-theatre] button title: ${button.title}`);
    console.log(`[set-theatre] button status: ${button_status}`);
  }
  if (button_status) {
    if (debug) {
      console.info(`[set_theatre] Video is already in theatre mode`);
    }
    if (!custom_nav_bar) {
      lower_nav_bar();
    }
    if (!custom_video) {
      expand_video();
    }
  } else if (!button_status) {
    if (debug) {
      console.debug(`[set_theatre] Video is not in theatre mode`);
    }
    click(document.getElementsByClassName('ytp-size-button').item(0));
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
  let live_status = is_live();
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
        button = find_button_and_status('button');
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

        if (live_status) {
          move_chat(0);
        }

        console.info(`[set-theatre] video expanded`);
        update_button_status(0);
      } else {
        init_vars(expand_video);
      }
    }
  }
};

let move_chat = (direction) => {
  secondary = document.querySelector('#secondary-inner');
  if (secondary) {
    if (direction == 0) {
      secondary.style.marginTop = '110vh';
      chat_dir = true;
    } else if (direction == 1) {
      secondary.style.marginTop = '0vh';
      chat_dir = false;
    }
  }
};

let restore_video = () => {
  'use strict';
  let was_paused = false;
  let live_status = is_live();
  if (!vars_initialized) {
    init_vars(restore_video);
    console.log(
      `[set-theatre] vars !initialized in restore-video ${vars_initialized}`
    );
  } else {
    if (video.paused) {
      was_paused = true;
    } else {
      video.pause();
    }
    if (container_original_style == null) {
      container.removeAttribute('style');
    } else {
      container.setAttribute('style', container_original_style);
    }
    if (secondary_original_style == null) {
      secondary.removeAttribute('style');
    } else {
      secondary.setAttribute('style', secondary_original_style);
    }
    if (container_original_class == null) {
      container.removeAttribute('class');
    } else {
      container.setAttribute('class', container_original_class);
    }
    if (video_original_style == null) {
      video.removeAttribute('style');
    } else {
      video.setAttribute('style', video_original_style);
    }
    if (columns_original_style == null) {
      columns.setAttribute(
        'style',
        'position: absolute; margin-left: 0px; margin-right: 0px; top: 50px; width: 100%; min-width: 100%;'
      );
    } else {
      columns.setAttribute('style', columns_original_style);
      columns.style.top = '0vh';
    }
    video.height = video_original_height;
    video.width = video_original_width;
    video.style.height = video_original_height;
    video.style.width = video_original_width;
    video.minHeight = video_original_minHeight;
    video.minWidth = video_original_minWidth;
    video.overflow = video_original_overflow;

    video.style.top = video_original_top;
    video.style.left = video_original_left;
    if (was_paused) {
      video.play();
      video.pause();
    } else {
      video.play();
    }

    if (live_status) {
      move_chat(1);
    }

    console.info(`[set-theatre] video restored`);
    custom_video = false;
    update_button_status(1);
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

let key_pressed = (evt) => {
  'use strict';
  /*if (!vars_initialized) {
    init_vars();
  }
  if (evt.key == ';') {
    // ;
    un_clip_mode();
  } else if (evt.key == `'`) {
    // '
    clip_mode();
  }*/
};

let clicked = (e) => {
  'use strict';
  if (clip_button && is_site()) {
    if (e.target) {
      if (e.target.parentNode.textContent == 'Clip\n  Clip\n\n') {
        console.log('[set-theatre] clicked clip container interaction layer?');
        clip_mode();
      } else if (e.target.textContent == 'Clip\n  Clip\n\n') {
        //clip link/button container
        console.log('[set-theatre] clicked clip container');
        clip_mode();
      } else if (
        e.target.id == 'text' &&
        e.target.textContent == 'Discard clip'
      ) {
        //discard clip button
        console.log('[set-theatre] clicked discard clip');
        un_clip_mode();
      } else if (
        (e.target.iconName && e.target.iconName == 'scissors') ||
        (e.target.id == 'text' && e.target.textContent == 'Clip')
      ) {
        //scissors icon or clip text
        console.log('[set-theatre] clicked clip');
        clip_mode();
      }
    }
  }
};

let non_video_mode = () => {
  'use strict';
  restore_nav_bar();
  update_button_status(3);
};

let un_clip_mode = () => {
  'use strict';
  manual_override = false;
  if (!custom_nav_bar || !custom_video) {
    expand_video();
    lower_nav_bar();
  }
  if (!find_button_and_status('status')) {
    click(document.getElementsByClassName('ytp-size-button').item(0));
  }
};

let clip_mode = () => {
  'use strict';
  manual_override = true;
  if (custom_nav_bar || custom_video) {
    restore_nav_bar();
    restore_video();
  }
  if (find_button_and_status('status')) {
    click(document.getElementsByClassName('ytp-size-button').item(0));
  }
};

window.addEventListener('keydown', (e) => {
  key_pressed(e);
});
document.addEventListener('yt-navigate-finish', (e) => {
  manual_override = false;
  site();
});

document.addEventListener('click', (e) => {
  clicked(e);

  const target = e.target.closest('#lexcode_button_theatre'); // Or any other selector.

  if (target) {
    if (custom_nav_bar || custom_video) {
      clip_mode();
    } else if (!custom_nav_bar || !custom_video) {
      un_clip_mode();
    }
  }

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

  const cht = e.target.closest('#lexcode_button_move-chat');

  if (cht) {
    if (chat_dir) {
      move_chat(1);
    } else if (!chat_dir) {
      move_chat(0);
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
