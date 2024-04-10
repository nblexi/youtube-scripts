// ==UserScript==
// @name         youtube chat mode
// @version      0.4.3
// @description  remove video element and rearrange chat
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/chat_mode.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/chat_mode.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

let chat_mode = (window.chat_mode = {});
let current_page;
let create_button = true;
let chat_sts_button;
let related;
let configured = false;

let fix_youtube_ineptness = () => {
  let view_count = document.querySelector(".view-count");
  view_count.style.display = "block";
};

let configure_site = () => {
  let theater_mode_button = document.querySelector("#lexcode_button_theatre");
  let player_container = document.querySelector("#player-theater-container");
  let player = document.querySelector("#movie_player");
  let video = document.querySelector("video");

  if (player || player_container) {
    if (video) {
      video.pause();
      video.muted = true;
    }
    if (player) {
      player.remove();
    }
    if (player_container) {
      player_container.remove();
    }
    related = document.querySelector("#related");
    let hide_chat = document.querySelector("#show-hide-button");
    let chat = document.querySelector("#chat");

    related.style.display = "none";
    //hide_chat.remove(); don't remove to leave the "exp chat" button for truffle

    chat.style.height = "90vh";
    const view_count = document.querySelector("#info-text");
    const count_target = document.querySelector(
      "ytd-expander.style-scope:nth-child(2) > div:nth-child(1)",
    );
    count_target.parentNode.insertBefore(view_count, count_target);

    const time_target = document.querySelector(".sticky");
    const time_live = document.querySelector("#info-strings");
    time_target.parentNode.insertBefore(time_live, time_target);

    fix_youtube_ineptness();

    if (theater_mode_button) {
      theater_mode_button.click();
    }

    configured = true;
  }
};

let create_status_button = () => {
  let target = document.querySelector("#end");
  let waittimer;

  if (!target) {
    waittimer = window.setInterval(() => {
      create_status_button();
    }, 2000);
  } else {
    window.clearInterval(waittimer);
    let elem = document.createElement("button");
    elem.innerHTML = "Chat";
    elem.id = "lexcode_button_chat_mode";
    elem.type = "submit";
    elem.name = "formBtn";
    elem.style =
      "font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #FFFFFF; background-color: #333333; color: #FFFFFF;";
    target.appendChild(elem);
    create_button = false;
    chat_sts_button = document.querySelector("#lexcode_button_chat_mode");
  }
};

let update_button_status = (color) => {
  let bt = document.querySelector("#lexcode_button_chat_mode");
  if (color === 1) {
    bt.style.borderColor = "#FF2E2E";
    bt.style.color = "#FF2E2E";
  } else if (color === 0) {
    bt.style.borderColor = "#4CAF50";
    bt.style.color = "#4CAF50";
  } else {
    bt.style.borderColor = "#FFFFFF";
    bt.style.color = "#FFFFFF";
  }
};

let main = () => {
  "use strict";

  if (create_button) {
    create_status_button();
  }
};

let site = () => {
  "use strict";
  if (window.location.href != current_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[chat_mode] state: ${a}`);
      window.location.href = url;
      current_page = url;
    };
  }
  if (is_site()) {
    main();
  } else {
    console.info("[chat_mode] Ignore this page");
  }
};

let is_site = () => {
  "use strict";
  if (window.location.href.match(/https?:\/\/www\.youtube\.com\/watch\.*/)) {
    return true;
  } else {
    return false;
  }
};

document.addEventListener("yt-navigate-finish", (e) => {
  site();
});

document.addEventListener("click", function (e) {
  const target = e.target.closest("#lexcode_button_chat_mode"); // Or any other selector.

  if (target) {
    if (configured === false) {
      update_button_status(0);
      configure_site();
    } else if (configured === true) {
      configured = true;
      window.location.reload();
    }
  }
});

(() => {
  "use strict";
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    current_page = url;
  };
})();
