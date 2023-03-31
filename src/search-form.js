import ApiService from './api-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const apiService = new ApiService();
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
// gallery.addEventListener("click", onGalleryContainerClick)

async function onSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.query.value;
  if (apiService.query.trim() === '') {
    return;
  }
  clearArticlesContainer();
  await apiService.resetPage();
  await apiService
    .fetchArticles()
    .then(({ totalHits, hits }) => {
      renderCard(hits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    })
    .catch(err => console.log(err));
  isVisibleBtn();
  // lightbox.open();
  lightbox.refresh();
}

function isVisibleBtn() {
  if (gallery.innerHTML === '') {
    loadMoreBtn.classList.add('is-hidden');
    return;
  }
  loadMoreBtn.classList.remove('is-hidden');
}

function clearArticlesContainer() {
  gallery.innerHTML = '';
}

async function onLoadMore() {
  try {
    await apiService.fetchArticles().then(({ hits }) => {
      renderCard(hits);
    });
    lightbox.refresh();
  } catch (error) {
    loadMoreBtn.classList.add('is-hidden');
  }
}

function renderCard(card) {
  const cardListMarkup = card
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="image-link" href="${largeImageURL}">
    <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" height="240px"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </a>
  </div>
  `;
  }).join('');
  gallery.insertAdjacentHTML('beforeEnd', cardListMarkup);
}

const lightbox = new SimpleLightbox(".image-link", {
  captionsData: "alt",
  captionDelay: 250,
});

