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
}

const ServiceManagerInstance = new ServiceManager();
