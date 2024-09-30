// ==UserScript==
// @name         Widescreen Theater Mode
// @version      0.0.4
// @description  expand theater mode to cover the entire screen
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/newer_theater_mode.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/newer_theater_mode.user.js
// @grant        none
// ==/UserScript==

let actual_page;
let build_button = true;
let toggle_button_element = "theater_button";
let toggle_button_selector = `#${toggle_button_element}`;

let theater_button;
let theater_state = false; //false = default
let nav_bar_state = false; //false = default

let player_selector = "#full-bleed-container";
let youtube_theater_button_selector =
  "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-size-button.ytp-button";

let create_theater_button = () => {
  "use strict";
  let target = document.querySelector("#end");

  if (!target) {
    setTimeout(() => {
      console.log("waiting on theater button creation");
      create_theater_button();
    }, 2000);
  } else {
    let elem = document.createElement("button");
    elem.innerHTML = "Theater";
    elem.id = toggle_button_element;
    elem.type = "submit";
    elem.name = "formBtn";
    elem.style =
      "font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #c3adf7; background-color: #333333; color: #c3adf7;";
    target.appendChild(elem);
    build_button = false;
    theater_button = document.querySelector(toggle_button_selector);
  }
};

let update_theater_button_status = (color) => {
  "use strict";

  let bt = document.querySelector(toggle_button_selector);
  if (!bt) {
    setTimeout(() => {
      console.log("waiting on theater button color function");
      update_theater_button_status(color);
    }, 2000);
  } else {
    switch (color) {
      case "green":
        bt.style.borderColor = "#4CAF50";
        bt.style.color = "#4CAF50";
        break;
      case "red":
        bt.style.borderColor = "#FF2E2E";
        bt.style.color = "#FF2E2E";
        break;
      case "yellow":
        bt.style.borderColor = "#FFD700";
        bt.style.color = "#FFD700";
        break;
      case "white":
        bt.style.borderColor = "#FFFFFF";
        bt.style.color = "#FFFFFF";
        break;
      default:
        bt.style.borderColor = "#ffa500";
        bt.style.color = "#ffa500";
        break;
    }
  }
};

let move_nav_bar = (status) => {
  "use strict";

  let content = document.querySelector("#content");
  let masthead = document.querySelector("#masthead-container");
  let page_manager = document.querySelector("#page-manager");
  let new_masthead_parent = document.querySelector(
    "#page-manager > ytd-watch-flexy",
  );
  let columns = document.querySelector("#columns");

  if (youtube_theater_mode_status()) {
    if (status) {
      if (!nav_bar_state) {
        new_masthead_parent.insertBefore(masthead, columns);
        masthead.setAttribute(
          "style",
          "position: relative; background-color: rgba(0, 0, 0, 0.95);",
        );
        columns.setAttribute("style", "position: block;");
        page_manager.setAttribute("style", "margin-top: 0;");
        nav_bar_state = true;
      }
    } else {
      if (nav_bar_state) {
        content.insertBefore(masthead, content.firstChild);
        player.removeAttribute("style");
        masthead.removeAttribute("style");
        columns.removeAttribute("style");
        page_manager.removeAttribute("style");
        nav_bar_state = false;
      }
    }
  } else {
    if (nav_bar_state) {
      content.insertBefore(masthead, content.firstChild);
      player.removeAttribute("style");
      masthead.removeAttribute("style");
      columns.removeAttribute("style");
      page_manager.removeAttribute("style");
      nav_bar_state = false;
    }
  }
};

let move_video = (changed) => {
  "use strict";

  let reset_player = () => {
    player.removeAttribute("style");
    video.removeAttribute("style");

    player.setAttribute("style", "height: 56.25vw;");
    video.setAttribute("style", "width: auto;");

    theater_state = false;
    update_theater_button_status("red");
    move_nav_bar(false);
  };

  let player = document.querySelector(player_selector);
  let video = document.querySelector(
    "#movie_player > div.html5-video-container > video",
  );

  if (youtube_theater_mode_status()) {
    if (changed) {
      if (theater_state) {
        reset_player();
      }
    } else {
      if (!theater_state) {
        player.setAttribute(
          "style",
          "position: block; top: 0; left: 0; max-height: 100vh; max-width: 100vw; min-height: 0; min-width: 0; width: 100%; height: 100vh; z-index: 1000;",
        );
        video.setAttribute(
          "style",
          "position: block; max-height: 100vh; max-width: 100vw; min-height: 0; min-width: 0; width: 100%; height: auto; z-index: 1000;",
        );

        theater_state = true;
        update_theater_button_status("green");
        move_nav_bar(true);
      }
    }
  } else {
    reset_player();
  }
};

//returns true if in theater mode
let youtube_theater_mode_status = () => {
  "use strict";

  let yt_theater_button = document.querySelector(
    youtube_theater_button_selector,
  );

  if (yt_theater_button) {
    let yt_theater_button_status = yt_theater_button.getAttribute("title");
    if (yt_theater_button_status.includes("Default")) {
      return true;
    } else if (yt_theater_button_status.includes("Theater")) {
      return false;
    } else {
      return false;
    }
  }
};

let main_fn = () => {
  "use strict";

  if (build_button) {
    create_theater_button();
  }

  if (document.querySelector(youtube_theater_button_selector)) {
    setTimeout(() => {
      console.log("waiting for loading complete");
      if (youtube_theater_mode_status()) {
        move_video(false);
      }
    }, 500);
  } else {
    setTimeout(() => {
      console.log("waiting for youtube theater button");
      main_fn();
    }, 2000);
  }
};

let site_fn = () => {
  "use strict";
  if (window.location.href != actual_page) {
    window.history.__proto__.pushState = (a, b, url) => {
      console.debug(`[new_better_theater.js] state: ${a}`);
      window.location.href = url;
      actual_page = url;
    };
  }
  if (is_site_fn()) {
    main_fn();
  } else {
    console.info("[new_better_theater.js] Ignore this page");
  }
};

let is_site_fn = () => {
  "use strict";
  if (window.location.href.match(/https?:\/\/www\.youtube\.com\/watch\.*/)) {
    move_nav_bar(true);
    return true;
  } else {
    update_theater_button_status("white");
    move_nav_bar(false);
    return false;
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key == "t") {
    if (!youtube_theater_mode_status()) {
      move_video(true);
      move_nav_bar(false);
    }
  }
});

document.addEventListener("yt-navigate-finish", (e) => {
  site_fn();
});

document.addEventListener("click", function (e) {
  const target = e.target.id;

  if (target == toggle_button_element) {
    if (theater_state) {
      move_video(true);
      move_nav_bar(false);
    } else if (!theater_state) {
      if (youtube_theater_mode_status()) {
        move_video(false);
        move_nav_bar(true);
      }
    } else {
      update_theater_button_status("yellow");
    }
  }
});

(() => {
  "use strict";
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    actual_page = url;
  };
})();
