// ==UserScript==
// @name         expand youtube video description
// @version      0.4.5
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

let is_live = () => {
  let chat = document.getElementById('chat');
  if (chat) {
    return true;
  } else {
    return false;
  }
};

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

let create_data_fields = () => {
  let data_div = document.querySelector('#info-container');

  if (!data_div) {
    setTimeout(() => {
      create_data_fields();
    }, 2000);
  } else {
    let empty_elem = document.createElement('span');
    empty_elem.id = 'lexcode_span_spacer';
    empty_elem.dir = 'auto';
    empty_elem.className = 'style-scope yt-formatted-string bold';
    empty_elem.innerHTML = `&nbsp &nbsp`;
    data_div.appendChild(empty_elem);

    let elem = document.createElement('span');
    elem.id = 'lexcode_span_likes';
    elem.dir = 'auto';
    elem.className = 'style-scope yt-formatted-string bold';
    elem.innerText = `likes`;
    data_div.appendChild(elem);
    console.info(`[description] like elements created`);
    elems_created = true;

    append_data();
  }
};

let append_data = () => {
  let live_check = is_live();
  let created_elem = document.querySelector('#lexcode_span_likes');
  let like_button = document.querySelector(
    '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
  );

  let get_like_count = (lb) => {
    let like_number_string = lb.ariaLabel;
    if (like_number_string) {
      let like_number_array = like_number_string.replace(/[^0-9]/g, '');
      let like_number = like_number_array;

      console.info(
        `[description] "${like_number_string}" became "${like_number}"`
      );

      return like_number;
    } else {
      console.info(
        `[description] {like_number_string} == "${like_number_string}"`
      );
    }
  };

  let set_like_count = (ln) => {
    let like_text;
    if (ln == 1) {
      like_text = 'like';
    } else {
      like_text = 'likes';
    }
    created_elem.innerText = `${ln} ${like_text}`;
  };

  if (created_elem && like_button) {
    if (live_check) {
      created_elem.innerText = ``;
    } else {
      let like_number = get_like_count(like_button);

      if (loaded_like_count) {
        if (loaded_like_count == like_number) {
          console.info(
            `[description] loaded old like button, old like count: ${loaded_like_count}`
          );
          setTimeout(() => {
            like_button = document.querySelector(
              '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button'
            );
            like_number = get_like_count(like_button);

            loaded_like_count = like_number;
            console.info(
              `[description] loaded new like button, new like count: ${like_number}`
            );
            set_like_count(like_number);
          }, 2000);
        }
      } else {
        console.info(
          `[description] old like count: ${loaded_like_count}, new like count: ${like_number}`
        );
        loaded_like_count = like_number;
        set_like_count(like_number);
      }
    }
  } else {
    setTimeout(() => {
      append_data();
    }, 2000);
  }
};

let main = () => {
  'use strict';

  if (!elems_created) {
    create_data_fields();
  } else {
    console.info(`[description] elements existed already`);
    append_data();
  }
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
