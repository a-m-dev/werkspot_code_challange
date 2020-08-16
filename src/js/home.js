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

    toggleVisibility({ element: loadingIndicator, isFlex: true });

    page++;

    const newPageData = await getTopStories();
    renderStories(newPageData);

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

    let selector = ".story-item__details-comments";
    let commentsElements = document.querySelectorAll(selector);

    for (let i = 0; i < commentsElements.length; i++) {
      commentsElements[i].addEventListener("click", (e) => {
        toggleRelatedCommentSection(e, commentsElements[i]);
      });
    }
  }

  function toggleRelatedCommentSection(e, element) {
    const targetId = e.currentTarget.dataset.id;
    loadStoryComments({ targetId, element });

    const commentsSection = element.parentElement.nextElementSibling;
    toggleVisibility({ element: commentsSection, isFlex: false });
  }

  async function loadStoryComments({ targetId, element }) {
    const commentsSection = element.parentElement.nextElementSibling;

    const commentLoadingIndicator = commentsSection.querySelector(".loading");
    const commentList = commentsSection.querySelector(
      ".story-item__comments-container"
    );

    const stories = JSON.parse(localStorage.getItem("stories"));
    const commentIDs = stories[targetId].kids;

    const comments = await getComments(commentIDs);

    renderComments({
      comments,
      appendTo: commentList,
      loadingIndecator: commentLoadingIndicator,
    });

    let selector = ".story-item__comment-body-more";
    let readMores = commentsSection.querySelectorAll(selector);

    for (let i = 0; i < readMores.length; i++) {
      readMores[i].addEventListener("click", (e) =>
        toggleReadMore(e, readMores[i])
      );

      if (readMores[i].parentElement.scrollHeight < 75)
        readMores[i].classList.add("visible-off");
      else readMores[i].classList.remove("visible-off");
    }
  }

  function renderComments({ comments, appendTo, loadingIndecator }) {
    comments.map((comment) => {
      createElement({
        tagName: "section",
        className: "story-item__comment comment-height--limited",
        appendTo,
        callback: (commentElement) => {
          commentElement.innerHTML = Renderer.RenderComment(comment);
        },
      });
    });

    toggleVisibility({ element: loadingIndecator, isFlex: false });
  }

  async function getComments(commentIDs) {
    const loopedComments = await Promise.all(commentIDs.map(handleGetComment));
    return loopedComments;
  }

  async function handleGetComment(commentID, i) {
    const comments = JSON.parse(localStorage.getItem("comments")) || {};

    if (comments[commentID]) return comments[commentID];
    else {
      const commentData = await ServiceManagerInstance.getComment({
        id: commentID,
      });

      const oldComments = JSON.parse(localStorage.getItem("comments"));
      localStorage.setItem(
        "comments",
        JSON.stringify({ ...oldComments, [commentData.id]: commentData })
      );

      return commentData;
    }
  }

  function toggleReadMore(e, element) {
    const readMoreText = element.firstElementChild;
    const parent = element.parentElement.parentElement;

    if (parent.classList.contains("comment-height--limited")) {
      parent.classList.remove("comment-height--limited");
      parent.classList.add("comment-height--unlimited");

      readMoreText.innerHTML = "Less";
    } else {
      parent.classList.remove("comment-height--unlimited");
      parent.classList.add("comment-height--limited");
      readMoreText.innerHTML = "More...";
    }
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
