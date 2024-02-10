// ==UserScript==
// @name         youtube testing suite
// @version      0.1.3
// @description  test youtube features
// @author       lexi
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/nblexi/youtube-scripts/main/youtube-testing-suite.user.js
// @updateURL    https://raw.githubusercontent.com/nblexi/youtube-scripts/main/youtube-testing-suite.user.js
// @run-at       document-start
// ==/UserScript==

let suite = (window.suite = {});
let print_key_code = true;

suite.print_keycode = (whatdo) => {
  "use strict";
  if (whatdo) {
    print_key_code = true;
    output("info", `print key code now: ${print_key_code}`);
  } else {
    print_key_code = false;
    output("info", `print key code now: ${print_key_code}`);
  }
};

let output = (type, payload, optional) => {
  //https://developer.mozilla.org/en-US/docs/Web/API/console#using_string_substitutions
  payload = payload || null;
  optional = optional || null;

  let prefix = "[Testing Suite]";

  switch (type) {
    case "assert":
      //assert(assertion, obj1, obj2, /* … ,*/ objN) || assert(assertion, msg)
      console.assert(optional, `${prefix} ${payload}`);
      break;
    case "count":
      //count() || count(label) && countReset() || countReset(label)
      if (payload === null) {
        console.count();
      } else {
        console.count(payload);
      }
      break;
    case "info":
      //info(obj1, /* …, */ objN)
      if (payload === null) {
        console.info(`${optional}`);
      } else if (payload !== null && optional === null) {
        console.info(`${prefix} ${payload}`);
      } else {
        console.info(`${prefix} ${payload}`, optional);
      }
      break;
    case "dir":
      //dir(object)
      if (optional !== null) {
        console.log(`${prefix} ${payload}`);
        console.dir(optional);
      } else {
        console.dir(payload);
      }
      break;
    case "dirxml":
      //dirxml(object)
      if (optional !== null) {
        console.log(`${prefix} ${payload}`);
        console.dirxml(optional);
      } else {
        console.dirxml(payload);
      }
      break;
    case "group":
      //group() / group(label) || groupCollapsed() && groupEnd()
      if (optional !== null) {
        console.log(`${prefix} ${payload}`);
        console.groupCollapsed(optional);
      } else {
        console.group(payload);
      }
      break;
    case "log":
      //log(obj1, /* …, */ objN)
      if (payload === null) {
        console.log(`${optional}`);
      } else if (payload !== null && optional === null) {
        console.log(`${prefix} ${payload}`);
      } else {
        console.log(`${prefix} ${payload}`, optional);
      }
      break;
    case "debug":
      //debug(msg, subst1, /* …, */ substN)
      if (payload === null) {
        console.debug(`${optional}`);
      } else if (payload !== null && optional === null) {
        console.debug(`${prefix} ${payload}`);
      } else {
        console.debug(`${prefix} ${payload}`, optional);
      }
      break;
    case "warning":
      if (payload === null) {
        console.warn(`${optional}`);
      } else if (payload !== null && optional === null) {
        console.warn(`${prefix} ${payload}`);
      } else {
        console.warn(`${prefix} ${payload}`, optional);
      }
      break;
    case "error":
      //error(obj1, /* …, */ objN)
      if (payload === null) {
        console.err(`${optional}`);
      } else if (payload !== null && optional === null) {
        console.err(`${prefix} ${payload}`);
      } else {
        console.err(`${prefix} ${payload}`, optional);
      }
      break;
    case "default":
      console.warn("no type defined", payload, optional);
      break;
  }
};

let dispatchForCode = (event) => {
  let code;

  if (event.key !== undefined) {
    code = event.key;
  } else if (event.keyIdentifier !== undefined) {
    code = event.keyIdentifier;
  } else if (event.keyCode !== undefined) {
    code = event.keyCode;
  }

  return code;
};

window.addEventListener("keydown", (e) => {
  if (print_key_code) {
    output("log", "key:", dispatchForCode(e));
  }

  if (dispatchForCode(e) === "192" || dispatchForCode(e) === "`") {
    // `
    output("debug", "manual call");
  }
});

window.addEventListener("hashchange", (e) => {
  output("debug", "hashchange capture");
});

document.addEventListener("yt-navigate-finish", (e) => {
  output("debug", "yt-navigate-finish capture");
});

document.addEventListener("yt-navigate-start", (e) => {
  output("debug", "yt-navigate-start capture");
});

document.addEventListener("click", (e) => {
  output("log", "clicked", e.target);
  output("log", "id:", e.target.id);
  output("log", "title:", e.target.title);
  output("log", "textContent:", e.target.textContent);
  output("log", "innerText:", e.target.innerText);
  output("log", "outerText:", e.target.outerText);
  output("log", "className:", e.target.className);
  output("log", "tagName:", e.target.tagName);
  output("log", "nodeName:", e.target.nodeName);
  output("log", "localName:", e.target.localName);
  output("log", "attributes:", e.target.tagName);
  output("dirxml", e);
});

(() => {
  "use strict";
  output("info", "youtube-testing-suite loaded");
})();
