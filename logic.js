"use-strict";

import { API_URL } from "./config.js";
import { API_KEY } from "./config.js";

// search url
// const response = await fetch(
//   `${API_URL}latest-news?language=us&apiKey=${API_KEY}`
// );

const randomRange = (min = 0, max) =>
  Math.round(Math.random() * (max - min)) + min;

const createObject = function (data) {
  return {
    id: data.id,
    title: data.title,
    link: data.url,
    category: data.category[0],
    image: data.image,
    language: data.language,
    date: new Date(data.published).toISOString(),
    description: data.description,
    author: data.author,
  };
};

const titleConverter = function (title) {
  if (title.length > 50) {
    return `${title.slice(0, 50)}...`;
  }
  return title;
};

const renderCard = () => {
  let html = "";
  for (let i = 0; i <= 6; i++) {
    html += `<article class="empty-card">
      <div class="empty-image strip"></div>
      <div>
        <div class="empty-category strip sloved"></div>
        <div class="empty-title strip sloved"></div>
        <p class="empty-description strip"></p>
      </div>
    </article>`;
  }
  document
    .querySelector(".article-container")
    .insertAdjacentHTML("afterBegin", html);
};

const renderData = function (data) {
  document.querySelector(".article-container").textContent = "";
  const html = data
    .map((news) => {
      const classes = `class="card ${
        news.image !== "None" ? "" : "bg-primary"
      }"`;

      // prettier-ignore
      const category = ["sports","ent","tech"];

      const categoryClasses = `class="category category-${
        category[randomRange(0, category.length)]
      }"`;

      if (!news.title) {
        console.log(news);
      }

      return `
      <article ${classes}>
      <img src="${news.image}" alt="" />
      <div>
        <div ${categoryClasses}>${news.category}</div>
        <h3>
          <a href="${news.link}">${titleConverter(news.title)}</a>
        </h3>
        <p>
          ${news.description}
        </p>
      </div>
    </article>
  `;
    })
    .join("");

  document
    .querySelector(".article-container")
    .insertAdjacentHTML("beforeend", html);
};

const renderMainSection = (news) => {
  const html = `
  <div class="showcase-content">
      <div class="catagory catagory-sports">SPORTS</div>
      <h1>${news.title}</h1>
      <p>
        ${news.description}
      </p>
      <p>${news.publishDate}</p>
      <a href="#home-articles" class="btn btn-primary">Read More</a>
    </div>
  `;
  document
    .querySelector(".showcase-container")
    .insertAdjacentHTML("beforeend", html);
};

const getData = async function () {
  renderCard();
  try {
    const response = await fetch(
      `${API_URL}search? keywords=Amazon&language=en&apiKey=${API_KEY}`
    );

    if (!response.ok) throw new Erro("failed to fatched or api key Error");
    const data = await response.json();

    const newsData = data.news.map((obj) => createObject(obj));
    setTimeout(() => {
      renderData(newsData);
    }, 2000);
  } catch (err) {
    console.warn(`${err} @@@@@@@ ${err.message}`);
  }
};

const getMoreData = async () => {
  const res = await fetch(
    "https://api.marketaux.com/v1/news/all?symbols=TSLA%2CAMZN%2CMSFT&filter_entities=true&language=en&api_token=DhwX55w98hXvkYSsbLbNStzMWYACejXWaRN5HZ3k"
  );
  const data = await res.json();
  console.log(data.data[0]);
  const news = data.data[0];
  const generateDate = new Date(news.published_at)
    .toLocaleString()
    .split(",")[0];
  const generateNewsObject = {
    title: news.title,
    description: news.description,
    publishDate: generateDate,
    imageURL: news.image_url,
    url: news.url,
  };
  renderMainSection(generateNewsObject);
};

getMoreData();
getData();
