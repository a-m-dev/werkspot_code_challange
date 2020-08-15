(function () {
  "use strict";

  /** variables */
  let errorBox = null;
  let loadingIndicator = null;
  let postList = null;
  let postListContainer = null;

  let moreBox = null;

  let page = 1;
  let perPage = 10;

  let previousY = 0;
  let previousRatio = 0;

  document.addEventListener("DOMContentLoaded", initiate, false);

  /*************************************************** */

  function initiate() {
    errorBox = document.querySelector(".error-box");
    loadingIndicator = document.querySelector(".loading");

    postList = document.querySelector(".post-list");
    postListContainer = document.querySelector(".post-list__container");

    moreBox = document.querySelector("#moreeeee");

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: thresholdArray(20),
    });

    observer.observe(moreBox);

    main();
  }

  async function main() {
    errorBox.classList.add("visible-off");
    postListContainer.classList.add("visible-off");
    loadingIndicator.classList.add("visible-on--flex");

    try {
      const topStoriesIDs = await ServiceManagerInstance.getTopStoriesIDsList();

      storeTopStories(topStoriesIDs);

      const topStories = await getTopStories();
      renderStories(topStories);

      toggleVisibility({ element: postListContainer });
    } catch (err) {
      console.error(err);
      toggleVisibility({ element: errorBox, isFlex: true });
    } finally {
      toggleVisibility({ element: loadingIndicator, isFlex: true });
    }
  }

  async function getTopStories() {
    const topStoryIDs = JSON.parse(localStorage.getItem("topStories"));

    const loopedResult = await Promise.all(
      topStoryIDs.map(getSliceOfStoryInventory)
    );

    return loopedResult.filter((el) => el !== undefined);
  }

  async function getSliceOfStoryInventory(id, i) {
    const stories = JSON.parse(localStorage.getItem("stories")) || {};

    if (i >= (page - 1) * perPage && i < page * perPage)
      if (stories[id]) return stories[id];
      else {
        const itemData = await ServiceManagerInstance.getTopStory({ id });

        const oldStories = JSON.parse(localStorage.getItem("stories"));
        localStorage.setItem(
          "stories",
          JSON.stringify({ ...oldStories, [itemData.id]: itemData })
        );

        return itemData;
      }
  }

  async function loadMore() {
    if (loadingIndicator.classList.contains("visible-on--flex")) return;

    // loading true
    toggleVisibility({ element: loadingIndicator, isFlex: true });

    // increment page
    page++;
    console.log({ page });

    // get data
    const newPageData = await getTopStories();
    console.log({ newPageData });
    renderStories(newPageData);

    // loading off
    toggleVisibility({ element: loadingIndicator, isFlex: true });
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

  function storeTopStories(topStoriesIDs) {
    localStorage.setItem("topStories", JSON.stringify(topStoriesIDs));
  }

  function renderStories(stories) {
    const count = postList.childElementCount;

    stories.map((storyItem, i) => {
      createElement({
        tagName: "article",
        className: "story-item",
        appendTo: postList,
        callback: (element) => {
          element.innerHTML = Renderer.RenderStory(storyItem, count + i);
        },
      });
    });
  }

  function createElement({ tagName = "div", className, appendTo, callback }) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (appendTo) appendTo.appendChild(element);
    if (callback) callback(element);
  }

  function handleIntersect(entries) {
    if (entries[0].intersectionRatio <= 0) return;

    entries.forEach((entry) => {
      const currentY = entry.boundingClientRect.y;
      const currentRatio = entry.intersectionRatio;
      const isIntersecting = entry.isIntersecting;

      // Scrolling down
      if (currentY < previousY) {
        if (currentRatio > previousRatio && isIntersecting) {
          loadMore();
        }
      }

      previousY = currentY;
      previousRatio = currentRatio;
    });
  }

  function thresholdArray(steps) {
    return Array(steps + 1)
      .fill(0)
      .map((_, index) => index / steps || 0);
  }
})();
