(function Main() {
  "use strict";

  let mobileMenu = null;

  document.addEventListener("DOMContentLoaded", initiate, false);

  // ******************************************

  function initiate() {
    mobileMenu = document.querySelector(".navigator__mobile-menu");

    main();
  }

  function main() {
    mobileMenu.addEventListener("click", handleMobileMenu, false);
  }

  function handleMobileMenu(e) {
    const parent = e.currentTarget.parentElement;
    const navigatorList = e.currentTarget.nextElementSibling;

    if (parent.classList.contains("navigator--responsive-off")) {
      parent.classList.remove("navigator--responsive-off");
      parent.classList.add("navigator--responsive-on");
    } else {
      parent.classList.remove("navigator--responsive-on");
      parent.classList.add("navigator--responsive-off");
    }

    if (navigatorList.classList.contains("responsive")) {
      navigatorList.classList.remove("responsive");
    } else {
      navigatorList.classList.add("responsive");
    }
  }
})();
