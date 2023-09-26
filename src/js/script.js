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

let catalogItemFront = document.querySelector(".catalog-item__front");
let frontBackSwitchers = document.querySelectorAll(".catalog-item__btn");

const toggleFrontBack = () => {
  frontBackSwitchers.forEach((el) => {
    el.setAttribute("disabled", true);
  });
  setTimeout(() => {
    frontBackSwitchers.forEach((el) => {
      el.removeAttribute("disabled");
    });
  }, 300);

  catalogItemFront.classList.toggle("catalog-item__front--fadeout");

  if (catalogItemFront.classList.contains("catalog-item__front--back")) {
    catalogItemFront.classList.remove("catalog-item__front--back");
  } else {
    setTimeout(() => {
      catalogItemFront.classList.add("catalog-item__front--back");
    }, 300);
  }
};

frontBackSwitchers.forEach((el) => {
  el.addEventListener("click", toggleFrontBack);
});
