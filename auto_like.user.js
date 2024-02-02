// ==UserScript==
// @name         youtube likes
// @version      0.9.2
// @description  auto like youtube videos
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/auto_like.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/auto_like.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let current_page;
let enable = false;
let autoL_sts_button;
let ytp_like_button;
let create_button = true;
let create_ytp_button = true;

let lbtimer;

let create_like_button = () => {
  let target = document.querySelector(
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls'
  );
  let lb = document.querySelector(
    '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
  );

  if (!target) {
    setTimeout(() => {
      create_like_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.id = 'lexcode_button_ytplike';
    elem.className = 'ytp-button';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; border-radius: 8px; margin-right: 10px; border: 2px solid #FFFFFF; color: #FFFFFF;';
    target.prepend(elem);
    create_ytp_button = false;
    ytp_like_button = document.querySelector('#lexcode_button_ytplike');

    if (!lb) {
      lbtimer = setInterval(() => {
        update_ytp_button_status(true);
      }, 2000);
    } else {
      clearInterval(lbtimer);
      update_ytp_button_status(true);
    }
  }
};

let update_ytp_button_status = (inv) => {
  let mlbt = document.querySelector('#lexcode_button_ytplike');

  if (!mlbt) {
    setTimeout(() => {
      update_ytp_button_status(inv);
    }, 2000);
  } else {
    if (inv) {
      if (find_button_and_status('status')) {
        mlbt.style.borderColor = '#4CAF50';
        mlbt.style.color = '#4CAF50';
        mlbt.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
      } else {
        mlbt.style.borderColor = '#FFFFFF';
        mlbt.style.color = '#FFFFFF';
        mlbt.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      }
    } else {
      if (find_button_and_status('status')) {
        mlbt.style.borderColor = '#FFFFFF';
        mlbt.style.color = '#FFFFFF';
        mlbt.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      } else {
        mlbt.style.borderColor = '#4CAF50';
        mlbt.style.color = '#4CAF50';
        mlbt.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
      }
    }
  }
  /*
      mlbt.style.borderColor = '#FF2E2E';
      mlbt.style.color = '#FF2E2E';
      mlbt.style.backgroundColor = 'rgba(255, 46, 46, 0.5)';
  */
};

let create_status_button = () => {
  let target = document.querySelector('#end');
  if (!target) {
    setTimeout(() => {
      create_status_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.innerHTML = 'Like';
    elem.id = 'lexcode_button_autolike';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FF2E2E; background-color: #333333; color: #FF2E2E;';
    target.appendChild(elem);
    create_button = false;
    autoL_sts_button = document.querySelector('#lexcode_button_autolike');
  }
};

let update_button_status = (color) => {
  let albt = document.querySelector('#lexcode_button_autolike');
  if (albt) {
    if (color === 1) {
      albt.style.borderColor = '#FF2E2E';
      albt.style.color = '#FF2E2E';
    } else if (color === 0) {
      albt.style.borderColor = '#4CAF50';
      albt.style.color = '#4CAF50';
    } else {
      albt.style.borderColor = '#FFFFFF';
      albt.style.color = '#FFFFFF';
    }
  }
};

let find_button_and_status = (what_to_return) => {
  'use strict';

  let like_button = document.querySelector(
    '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
  );

  let like_button_aria_pressed = like_button.getAttribute('aria-pressed');

  if (what_to_return == 'button') {
    return like_button;
  } else if (what_to_return == 'status') {
    if (
      like_button_aria_pressed == 'true' ||
      like_button_aria_pressed == true
    ) {
      return true;
    } else {
      return false;
    }
  }
};

let like_video = () => {
  'use strict';
  let like_button = document.querySelector(
    '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
  );
  like_button.click();
  append_data();
  update_ytp_button_status(false);
};

let is_live = () => {
  let chat = document.getElementById('chat');
  if (chat) {
    return true;
  } else {
    return false;
  }
};

let append_data = () => {
  let live_check = is_live();
  let created_elem = document.querySelector('#lexcode_span_likes');

  if (!created_elem) {
    setTimeout(() => {
      append_data();
    }, 2000);
  } else {
    let like_button = document.querySelector(
      '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
    );

    if (like_button) {
      if (live_check) {
        if (created_elem) {
          created_elem.innerText = ``;
        }
      } else {
        let like_number_string = like_button.ariaLabel;
        if (like_number_string) {
          let like_number_array = like_number_string.replace(/[^0-9]/g, '');
          let like_number = like_number_array;

          console.info(
            `[auto-like] "${like_number_string}" became "${like_number}"`
          );

          let like_text;
          if (like_number == 1) {
            like_text = 'like';
          } else {
            like_text = 'likes';
          }
          if (created_elem) {
            created_elem.innerText = `${like_number} ${like_text}`;
          }
        } else {
          console.info(
            `[auto-like] {like_number_string} == "${like_number_string}"`
          );
        }
      }
    }
  }
};

let video_exists = (debug) => {
  let button_status;
  let like_button;
  let post_button_status;

  like_button = find_button_and_status('button');

  if (debug) {
    console.debug('[Auto-Like] Page Fully Loaded');
    console.debug('[Auto-Like] Like Button Element');
    //console.dir(like_button);
  }

  button_status = find_button_and_status('status');

  if (debug && button_status == false) {
    console.debug(`[Auto-Like] Video is not liked`);
  }

  if (button_status == false) {
    like_video();
    setTimeout(() => {
      post_button_status = find_button_and_status('status');
      if (post_button_status) {
        console.info(`[Auto-Like] Video was liked`);
      } else {
        console.error(`[Auto-Like] Video was not liked`);
      }
    }, 2000);
  } else {
    console.info(`[Auto-Like] Video is already liked`);
  }
};

let main = () => {
  'use strict';
  console.info('[auto-like] main');
  if (create_button) {
    create_status_button();
    if (enable) {
      update_button_status(0);
    } else {
      update_button_status(1);
    }
  }

  if (create_ytp_button) {
    create_like_button();
  }

  setTimeout(() => {
    if (enable) {
      update_button_status(0);
      video_exists(true);
    } else {
      update_button_status(1);
    }
  }, 1000);
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[auto-like] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  update_button_status(3);
  if (is_site()) {
    main();
  } else {
    console.info('[auto-like] Ignore this page');
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

document.addEventListener('click', function (e) {
  const target = e.target.closest('#lexcode_button_autolike'); // Or any other selector.

  if (target) {
    if (enable === true) {
      update_button_status(1);
      enable = false;
    } else if (enable === false) {
      update_button_status(0);
      site();
      enable = true;
    }
  }

  const ytp_btn = e.target.closest('#lexcode_button_ytplike');
  if (ytp_btn) {
    like_video();
  }

  const like = e.target.closest(
    '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
  );

  if (like) {
    append_data();
    update_ytp_button_status(true);
  }
});

(() => {
  'use strict';
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    current_page = url;
  };
})();
