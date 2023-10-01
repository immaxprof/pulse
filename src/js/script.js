$(document).ready(function () {
  $(".carousel__inner").slick({
    dots: false,
    speed: 800,
    adaptiveHeight: false,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><img src="icons/left.svg" alt="slide" /></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img src="icons/right.svg" alt="slide" /></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 476,
        settings: {
          autoplay: true,
          autoplaySpeed: 2000,
          arrows: false,
          dots: true,
          fade: true,
          cssEase: "linear",
        },
      },
    ],
  });
});

// TABS

const catalog = document.querySelector(".catalog");
const catalogContents = catalog.querySelectorAll(".catalog__content");
const tabs = catalog.querySelectorAll(".catalog__tab");

const resetCatalogContent = (content) => {
  backVisibleBtns = content.querySelectorAll(".catalog-item__back--show");
  frontInvisibleBtns = content.querySelectorAll(
    ".catalog-item__front--fadeout"
  );
  backVisibleBtns.forEach((btn) =>
    btn.classList.remove("catalog-item__back--show")
  );
  frontInvisibleBtns.forEach((btn) =>
    btn.classList.remove("catalog-item__front--fadeout")
  );
};

const makeTabActive = (tab, cl) => {
  const prevActiveTab = catalog.querySelector("." + cl);
  const prevActiveContent = catalog.querySelector(
    ".catalog__content:not(.visually-hidden)"
  );

  resetCatalogContent(prevActiveContent);

  prevActiveTab.classList.remove(cl);
  tab.classList.add(cl);
};

const showContent = (index, cl) => {
  const prevActiveContent = catalog.querySelector(
    ".catalog__content:not(." + cl + ")"
  );
  prevActiveContent.classList.add(cl);
  catalogContents[index].classList.remove(cl);
};

tabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => {
    makeTabActive(tab, "catalog__tab--active");
    showContent(tabIndex, "visually-hidden");
  });
});

// let catalogItemFront = document.querySelector(".catalog-item__front");
// let catalogItemBack = document.querySelector(".catalog-item__back");

// let frontBackSwitchers = document.querySelectorAll(".catalog-item__btn");

let catalogItems = document.querySelectorAll(".catalog-item");

const toggleBack = (front, back) => {
  back.classList.toggle("catalog-item__back--show");
  front.classList.toggle("catalog-item__front--fadeout");
  back.scrollTo({ top: 0 });
};

const configureCatalogItem = (catalogItem) => {
  const btns = catalogItem.querySelectorAll(".catalog-item__btn");
  const front = catalogItem.querySelector(".catalog-item__front");
  const back = catalogItem.querySelector(".catalog-item__back");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleBack(front, back);
    });
  });
};

catalogItems.forEach((catalogItem) => configureCatalogItem(catalogItem));

// const toggleFrontBack = () => {
//   frontBackSwitchers.forEach((el) => {
//     el.setAttribute("disabled", true);
//   });
//   setTimeout(() => {
//     frontBackSwitchers.forEach((el) => {
//       el.removeAttribute("disabled");
//     });
//   }, 300);

//   catalogItemFront.classList.toggle("catalog-item__front--fadeout");

//   if (catalogItemFront.classList.contains("catalog-item__front--back")) {
//     catalogItemFront.classList.remove("catalog-item__front--back");
//   } else {
//     setTimeout(() => {
//       catalogItemFront.classList.add("catalog-item__front--back");
//     }, 300);
//   }
// };

// frontBackSwitchers.forEach((el) => {
//   el.addEventListener("click", toggleFrontBack);
// });

// const toggleBack = () => {
//   catalogItemBack.classList.toggle("catalog-item__back--show");
//   catalogItemFront.classList.toggle("catalog-item__front--fadeout");
//   catalogItemBack.scrollTo({ top: 0 });
// };

// frontBackSwitchers.forEach((el) => {
//   el.addEventListener("click", toggleBack);
// });
