class HtmlRenderer {
  constructor() {}

  RenderStory(story, i) {
    const publishDate = moment(story.time * 1000).fromNow();
    const hostname = (story.url && new URL(story.url).hostname) || null;

    return `
    
      <a href="${story.url}" target="_blank" class='story-item__box'>
        <section class='story-item__box-index'>
          <span>${i + 1}</span>
        </section>

        <section class='story-item__box-title'>
          <h1>${story.title}</h1>
        </section>

        <div class='story-item__box-score'>
          <i class="icon-up-open ease-transition"></i>
          <p>${story.score.toLocaleString()}</p>
          <h6>points</h6>
          <i class="icon-down-open ease-transition"></i>
        </div>      
      </a>


      <section class='story-item__details'>
        <div class='story-item__details-time .story-item__details--no-hover ease-transition'>
          <i class="icon-clock"></i>
          <span>${publishDate}</span>
        </div>


        ${
          hostname !== null
            ? `<a href="${story.url}" target="_blank" class='story-item__details-source ease-transition'>
                <i class="icon-link"></i>
                <span>${hostname}</span>
              </a>`
            : ""
        }  

        ${
          story.kids && story.kids.length > 0
            ? `
                <div class='story-item__details-comments ease-transition' data-id="${
                  story.id
                }">
                  <i class="icon-comment"></i>
                  <span>${story.kids.length || 0} comments</span>
                </div>
              `
            : ""
        }
      </section>

      <article class='story-item__comments visible-off'>
        <section class="loading visible-on--flex">
          <div class="loading__indicator"></div>
        </section>

        <section class='story-item__comments-container'>
        </section>
      </article>
    `;
  }

  RenderComment(comment) {
    const publishDate = moment(comment.time * 1000).fromNow();

    return `
    
      <section class='story-item__comment-heading'>

        <div class='story-item__comment-heading-author'>
          by <b>${comment.by}</b>, <em>${publishDate}</em>
        </div>
      </section>

      <section class='story-item__comment-body'>
        ${comment.text}
        <div class='story-item__comment-body-more'>
          <span>Read More</span>
        </div>

      </section>
    `;
  }
}

const Renderer = new HtmlRenderer();
