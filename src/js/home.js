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

  async function main() {}
});
