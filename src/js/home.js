(function () {
  "use strict";

  /** variables */
  let errorBox = null;
  let loadingIndicator = null;
  let postList = null;
  let postListContainer = null;

  let page = 1;
  let perPage = 10;

  document.addEventListener("DOMContentLoaded", initiate, false);

  /*************************************************** */

  function initiate() {
    errorBox = document.querySelector(".error-box");
    loadingIndicator = document.querySelector(".loading");

    postList = document.querySelector(".post-list");
    postListContainer = document.querySelector(".post-list__container");

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

  const createElement = ({
    tagName = "div",
    className,
    appendTo,
    callback,
  }) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (appendTo) appendTo.appendChild(element);
    if (callback) callback(element);
  };
})();
