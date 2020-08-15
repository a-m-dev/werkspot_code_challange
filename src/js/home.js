(function () {
  "use strict";

  /** variables */
  let errorBox = null;
  let loadingIndicator = null;
  let postList = null;
  let postListContainer = null;

  document.addEventListener("DOMContentLoaded", initiate, false);

  /*************************************************** */

  function initiate() {
    errorBox = document.querySelector(".error-box");
    loadingIndicator = document.querySelector("loading");
    postList = document.querySelector(".post-list");
    postListContainer = document.querySelector(".post-list__container");

    main();
  }

  async function main() {
    errorBox.classList.add("visible-off");
    postListContainer.classList.add("visible-off");
    loadingIndicator.classList.add("visible-on--flex");

    try {
    } catch (err) {
      console.error(err);
      toggleVisibility({ element: errorBox, isFlex: true });
    } finally {
      toggleVisibility({ element: loadingIndicator, isFlex: true });
    }
  }

  /** Utils */
  function toggleVisibility({ element, isFlex = false }) {
    switch (true) {
      case element.classList.contains("visible-on"): {
        element.classList.remove("visible-on");
        element.classList.add("visible-off");
        break;
      }
      case element.classList.contains("visible-on--flex"): {
        element.classList.remove("visible-on--flex");
        element.classList.add("visible-off");
        break;
      }

      case element.classList.contains("visible-off"): {
        element.classList.remove("visible-off");
        isFlex
          ? element.classList.add("visible-on--flex")
          : element.classList.add("visible-on");
        break;
      }
      default:
        break;
    }
  }
});
