/**
 *
 * Service Manager of the project
 *
 */

class ServiceManager {
  constructor() {
    this.BASE_URL = "https://hacker-news.firebaseio.com/v0";
    this.END_POINTS = {
      topStoriesIDsList: () => `${this.BASE_URL}/topstories.json`,
      topStory: (id) => `${this.BASE_URL}/item/${id}.json`,
    };
  }

  async fetchBase({ url, options = {} }) {
    let fetchOptions = {
      mode: "cors",
      cache: "no-cache",
      ...options,
    };

    try {
      const response = await (await fetch(url, { ...fetchOptions })).json();
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  getTopStoriesIDsList = () =>
    this.fetchBase({ url: this.END_POINTS.topStoriesIDsList() });

  getTopStory = ({ id }) =>
    this.fetchBase({ url: this.END_POINTS.topStory(id) });

  getComment = ({ id }) =>
    this.fetchBase({ url: this.END_POINTS.topStory(id) });
}

const ServiceManagerInstance = new ServiceManager();
