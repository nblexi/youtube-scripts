// ==UserScript==
// @name         youtube likes
// @version      0.9.5
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
let auto_like_enabled = false;
let autoL_sts_button;
let ytp_like_button;
let create_auto_like_button = true;
let create_custom_like_button = true;

let youtube_like_button_element =
  '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button';

let lbtimer;

let create_custom_like_status_button = () => {
  'use strict';

  let target = document.querySelector(
    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls'
  );
  let lb = document.querySelector(youtube_like_button_element);

  if (!target) {
    setTimeout(() => {
      create_custom_like_status_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.id = 'custom_like_button';
    elem.className = 'ytp-button';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; border-radius: 8px; margin-right: 10px; border: 2px solid #FFFFFF; color: #FFFFFF;';
    target.prepend(elem);
    create_custom_like_button = false;
    ytp_like_button = document.querySelector('#custom_like_button');

    if (!lb) {
      lbtimer = setInterval(() => {
        update_custom_like_button(true);
      }, 2000);
    } else {
      clearInterval(lbtimer);
      update_custom_like_button(true);
    }
  }
};

let update_custom_like_button = (inv) => {
  'use strict';

  let custom_like_button = document.querySelector('#custom_like_button');

  if (!custom_like_button) {
    setTimeout(() => {
      update_custom_like_button(inv);
    }, 2000);
  } else {
    if (inv) {
      if (like_button_status()) {
        custom_like_button.style.borderColor = '#4CAF50';
        custom_like_button.style.color = '#4CAF50';
        custom_like_button.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
      } else {
        custom_like_button.style.borderColor = '#FFFFFF';
        custom_like_button.style.color = '#FFFFFF';
        custom_like_button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      }
    } else {
      if (like_button_status()) {
        custom_like_button.style.borderColor = '#FFFFFF';
        custom_like_button.style.color = '#FFFFFF';
        custom_like_button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      } else {
        custom_like_button.style.borderColor = '#4CAF50';
        custom_like_button.style.color = '#4CAF50';
        custom_like_button.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
      }
    }
  }
};

let create_auto_like_status_button = () => {
  'use strict';

  let target = document.querySelector('#end');
  if (!target) {
    setTimeout(() => {
      create_auto_like_status_button();
    }, 2000);
  } else {
    let elem = document.createElement('button');
    elem.innerHTML = 'Like';
    elem.id = 'auto_like_button';
    elem.type = 'submit';
    elem.name = 'formBtn';
    elem.style =
      'font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FF2E2E; background-color: #333333; color: #FF2E2E;';
    target.appendChild(elem);
    create_auto_like_button = false;
    autoL_sts_button = document.querySelector('#auto_like_button');
  }
};

let update_auto_like_button_status = (color) => {
  'use strict';

  let auto_like_button = document.querySelector('#auto_like_button');
  if (auto_like_button) {
    if (color === 1) {
      auto_like_button.style.borderColor = '#FF2E2E';
      auto_like_button.style.color = '#FF2E2E';
    } else if (color === 0) {
      auto_like_button.style.borderColor = '#4CAF50';
      auto_like_button.style.color = '#4CAF50';
    } else {
      auto_like_button.style.borderColor = '#FFFFFF';
      auto_like_button.style.color = '#FFFFFF';
    }
  }
};

let like_button_status = () => {
  'use strict';

  let like_button = document.querySelector(youtube_like_button_element);

  let like_button_aria_pressed = like_button.getAttribute('aria-pressed');

  if (like_button_aria_pressed == 'true' || like_button_aria_pressed == true) {
    return true;
  } else {
    return false;
  }
};

let like_video = () => {
  'use strict';

  let like_button = document.querySelector(youtube_like_button_element);
  like_button.click();
  update_custom_like_button(false);
};

let main = () => {
  'use strict';

  console.info('[auto-like] main');

  if (create_auto_like_button) {
    create_auto_like_status_button();
  }

  if (create_custom_like_button) {
    create_custom_like_status_button();
  }

  setTimeout(() => {
    if (auto_like_enabled) {
      update_auto_like_button_status(0);

      let button_status = like_button_status();

      if (button_status == false) {
        like_video();
      }
    } else {
      update_auto_like_button_status(1);
    }
  }, 1000);
};

let site = () => {
  'use strict';
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      window.location.href = url;
      current_page = url;
    };
  }

  if (is_video()) {
    main();
  } else {
    console.info('[auto-like] ignore this page');

    update_auto_like_button_status(3);
  }
};

let is_video = () => {
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
  const auto_like_button = e.target.closest('#auto_like_button'); // Or any other selector.

  if (auto_like_button) {
    if (auto_like_enabled === true) {
      update_auto_like_button_status(1);
      auto_like_enabled = false;
    } else if (auto_like_enabled === false) {
      update_auto_like_button_status(0);
      site();
      auto_like_enabled = true;
    }
  }

  const custom_like_button = e.target.closest('#custom_like_button');
  if (custom_like_button) {
    like_video();
  }

  const youtube_player_like_button = e.target.closest(
    youtube_like_button_element
  );

  if (youtube_player_like_button) {
    update_custom_like_button(true);
  }
});

(() => {
  'use strict';
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    current_page = url;
  };
})();
