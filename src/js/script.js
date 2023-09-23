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
