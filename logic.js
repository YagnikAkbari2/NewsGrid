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

const getData = async function () {
  try {
    const response = await fetch(
      `${API_URL}search? keywords=Amazon&language=en&apiKey=${API_KEY}`
    );

    if (!response.ok) throw new Erro("failed to fatched or api key Error");
    const data = await response.json();

    const newsData = data.news.map((obj) => createObject(obj));

    renderData(newsData);
  } catch (err) {
    console.warn(`${err} @@@@@@@ ${err.message}`);
  }
};
const init = function () {
  setTimeout(getData, 2000);
};
init();
