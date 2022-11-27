import { get } from "../api.js";
import { ApiUrl } from "../constants/ApiUrl.js";

const $ = (selector) => document.querySelector(selector);

async function fetchProducts(index) {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword");
  const data = await get(
    `${ApiUrl.PRODUCTS_SEARCH}${keyword}&sortKey=sales&sort=1&page=${index}&perpage=9`
  );
  return data;
}

const paginationHtml = `<nav class="pagination-container" role="navigation" aria-label="pagination">
<ul class="pagination-list">
  <li>
    <a class="pagination-link is-current" aria-label="1" aria-current="page">1</a>
  </li>
</ul>
</nav>`;

$(".footer-container").insertAdjacentHTML("beforebegin", paginationHtml);

async function refineData() {
  const { products, totalPage } = await fetchProducts(1);
  let productsTotalData = products;

  for (let i = 2; i <= totalPage; i++) {
    (await fetchProducts(i))["products"].forEach((product) => {
      productsTotalData.push(product);
    });
  }

  (function generatePagenationButton() {
    for (let i = 2; i <= totalPage; i++) {
      const pageButton = document.createElement("li");
      pageButton.innerHTML = `<a class="pagination-link" aria-label="${i}" aria-current="page">${i}</a>`;
      $(".pagination-list").append(pageButton);
    }
  })();

  return productsTotalData;
}

async function showProducts() {
  const productsTotalData = await refineData();

  let productsArr = [];

  for (let i = 0; i < productsTotalData.length; i += 9) {
    productsArr.push(productsTotalData.slice(i, i + 9));
  }

  let currentPageData = productsArr[0];
  if (!currentPageData) {
    $(".search-result-messege").innerText = `검색 결과가 존재하지 않습니다.`
  }
  (function showProductsPageOne() {
    currentPageData.forEach((product) => {
      renderData(product);
    });
  })();

  const paginationButton = document.querySelectorAll(".pagination-link");

  paginationButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (document.querySelectorAll(".product-container")) {
        const productContainers = document.querySelectorAll(".product-container");
        productContainers.forEach((container) => container.remove());
      }

      const pageButton = document.querySelectorAll(".pagination-link");
      const currentPage = e.target.getAttribute("aria-label");

      pageButton.forEach((button) => {
        button.classList.remove("is-current");
        window.scrollTo(0, 0);
      });
      e.target.classList.add("is-current");

      currentPageData = productsArr[currentPage - 1];
      currentPageData.forEach(async (product) => {
        renderData(product);
      });
    });
  });
}

await showProducts();

async function goToDetailPage() {
  const productContainer = document.querySelectorAll(".product-container");
  productContainer.forEach((container) => {
    container.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("id");
      window.location.href = `/product-detail?id=${productId}`;
    });
  });
}

async function renderData(product) {
  const { _id, name, brand, price, volume, alcoholDegree, image } = product;
  const imageUrl = "../" + decodeURIComponent(image).split("views")[1];

  let productSection = document.createElement("section");

  productSection.setAttribute("class", "product-container");
  productSection.setAttribute("id", _id);
  productSection.innerHTML = `<div class="product-div-container">
  <div class="product-image-wrapper">
    <img src="${imageUrl}" alt="Product Image" />
  </div>
  <div class="product-content-container">
    <div class="content-title-wrapper">
      <p class="content-name">${name}</p>
    </div>
    <div class="content-container">
      <div class="content-left-container">
        <p class="content-price">${Number(price).toLocaleString("ko-KR")}원</p>
        <p class="content-brand">${brand}</p>
      </div>
      <div class="content-right-container">
        <p class="content-alcoholDegree">${alcoholDegree}도</p>
        <p class="content-volume">${volume}ml</p>
      </div>
    </div>
  </div>
</div>`;

  const bodyContainer = document.querySelector(".body-container");
  bodyContainer.append(productSection);
  await goToDetailPage();
}