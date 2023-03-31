import Notiflix from 'notiflix';
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34805987-f2b531f3f349672084b6a5db6';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    return await axios
      .get(`${BASE_URL}`, {
        headers: {
          'Content-type': 'application/json',
        },
        params: {
          key: `${API_KEY}`,
          q: `${this.searchQuery}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: '40',
          page: `${this.page}`,
        },
      })
      .then(response => response.data)
      .then(({ totalHits, hits }) => {
        this.incrementPage();
        if (hits.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        return { totalHits, hits };
      })
      .catch(error =>
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        )
      );
  }

  incrementPage() {
    this.page = this.page + 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
