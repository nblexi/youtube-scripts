// ==UserScript==
// @name         Widescreen Theater Mode
// @version      0.0.7
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

let theater_state = false; //false = default theater mode
let nav_bar_state = false; //false = default nav bar position

//video container
let player_selector = "#full-bleed-container";
//default/theater mode switch button on player
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
    elem.name = "formtoggle_buttonn";
    elem.style =
      "font-size: 12px; padding: 10px; margin: 5px; border-radius: 8px; border: 2px solid #c3adf7; background-color: #333333; color: #c3adf7;";
    target.appendChild(elem);
    build_button = false;
  }
};

let update_theater_button_status = (color) => {
  "use strict";

  let toggle_button = document.querySelector(toggle_button_selector);
  if (!toggle_button) {
    setTimeout(() => {
      console.log("waiting on theater button color function");
      update_theater_button_status(color);
    }, 2000);
  } else {
    switch (color) {
      case "green":
        toggle_button.style.borderColor = "#4CAF50";
        toggle_button.style.color = "#4CAF50";
        break;
      case "red":
        toggle_button.style.borderColor = "#FF2E2E";
        toggle_button.style.color = "#FF2E2E";
        break;
      case "yellow":
        toggle_button.style.borderColor = "#FFD700";
        toggle_button.style.color = "#FFD700";
        break;
      case "white":
        toggle_button.style.borderColor = "#FFFFFF";
        toggle_button.style.color = "#FFFFFF";
        break;
      default:
        toggle_button.style.borderColor = "#ffa500";
        toggle_button.style.color = "#ffa500";
        break;
    }
  }
};

// status: true to move down, false to move to default
let move_nav_bar = (status) => {
  "use strict";

  let reset_nav_bar = () => {
    content.insertBefore(masthead, content.firstChild);
    player.removeAttribute("style");
    masthead.removeAttribute("style");
    columns.removeAttribute("style");
    page_manager.removeAttribute("style");
    nav_bar_state = false;
  };

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
        reset_nav_bar();
      }
    }
  } else {
    if (nav_bar_state) {
      reset_nav_bar();
    }
  }
};

//changed: true if theater mode has been modified
let move_video = (changed) => {
  "use strict";

  let reset_player = () => {
    player.removeAttribute("style");
    video.removeAttribute("style");

    player.setAttribute("style", "height: 56.25vw;");
    video.setAttribute("style", "width: 100%; height: auto;");

    theater_state = false;
    update_theater_button_status("red");
    move_nav_bar(false);
  };

  let player = document.querySelector(player_selector);
  let video = document.querySelector(
    "#movie_player > div.html5-video-container > video",
  );

  //if in theater mode
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

//i was getting a weird issue with "same function name" with another script so i appended _fn to repeat functions
let main_fn = () => {
  "use strict";

  if (build_button) {
    create_theater_button();
  }

  if (document.querySelector(youtube_theater_button_selector)) {
    setTimeout(() => {
      console.log("[new_better_theater.js] waiting for loading complete");
      if (youtube_theater_mode_status()) {
        move_video(false);
      }
    }, 500);
  } else {
    setTimeout(() => {
      console.log("[new_better_theater.js] waiting for youtube theater button");
      main_fn();
    }, 2000);
  }
};

let site_fn = () => {
  "use strict";
  //force update latest href (again)
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

//returns true if in youtube watch page
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

//built in youtube event listener for "finished navigating/loading"
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

  //force update latest href on page load
  window.history.__proto__.pushState = function (a, b, url) {
    window.location.href = url;
    actual_page = url;
  };
})();
