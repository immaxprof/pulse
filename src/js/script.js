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

// ДОБАВЛЕНИЕ КЛАССА FADE СКРЫТЫМ ЭЛЕМЕНТАМ
document.querySelectorAll(".fadeable.visually-hidden").forEach((el) => {
  el.classList.add("fade");
});

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

  prevActiveTab.classList.remove(cl);
  tab.classList.add(cl);
};

const showContent = (index, cl) => {
  const prevActiveContent = catalog.querySelector(
    ".catalog__content:not(." + cl + ")"
  );

  resetCatalogContent(prevActiveContent);

  prevActiveContent.classList.add(cl);
  catalogContents[index].classList.remove(cl);
};

tabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => {
    makeTabActive(tab, "catalog__tab--active");
    showContent(tabIndex, "visually-hidden");
  });
});
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

// MODAL;

const modalFadeDuration = 400;

const btnTop = document.querySelector(".button--top");
const btnPromo = document.querySelector(".button--promo");
const btnsBuy = document.querySelectorAll(".button--buy");

const modals = document.querySelectorAll(".modal");
const modalCloseBtns = document.querySelectorAll(".modal__close");
const modalWrappers = document.querySelectorAll(".modal__wrapper");

const modalConsultation = document.querySelector(".modal--consultation");
const modalOrder = document.querySelector(".modal--order");
const modalThanks = document.querySelector(".modal--thanks");

function fade(modal, flag = "in") {
  if (flag == "in") {
    modal.classList.remove("visually-hidden");
    modal.style.opacity = 1;
  } else if (flag == "out") {
    modal.style.opacity = 0;

    setTimeout(() => {
      modal.classList.add("visually-hidden");
    }, modalFadeDuration);
  }
}

function changeSubtitle(modal, btn) {
  const catalogItem = btn.closest(".catalog-item");
  modal.querySelector(".modal__subtitle").textContent =
    catalogItem.querySelector("h4").textContent;
}

function isModalOpen() {
  return !!document.querySelector(".modal:not(.visually-hidden)");
}

function showModal(modal) {
  fade(modal, "in");
  document.addEventListener("keydown", escClose);
  document.body.style.overflow = "hidden"; // скрывает прокрутку
}

function closeModal() {
  const openModal = document.querySelector(".modal:not(.visually-hidden)");
  fade(openModal, "out");

  document.removeEventListener("keydown", escClose);
  document.activeElement.blur();
  document.body.style.overflow = "auto"; // вновь показывает прокрутку
}

function escClose(e) {
  if (e.key == "Escape") {
    closeModal();
  }
}

modalWrappers.forEach((wrapper) => {
  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", () => {
    closeModal();
  });
});

modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal();
  });
});

[btnTop, btnPromo].forEach((btn) => {
  btn.addEventListener("click", () => {
    showModal(modalConsultation);
  });
});

btnsBuy.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeSubtitle(modalOrder, btn);
    showModal(modalOrder);
  });
});

// PHONE INPUT MASK

var eventCalllback = function (e) {
  var el = e.target,
    clearVal = el.dataset.phoneClear,
    pattern = el.dataset.phonePattern,
    matrix_def = "+7(___) ___-__-__",
    matrix = pattern ? pattern : matrix_def,
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = e.target.value.replace(/\D/g, "");
  if (clearVal !== "false" && e.type === "blur") {
    if (val.length < matrix.match(/([\_\d])/g).length) {
      e.target.value = "";
      return;
    }
  }
  if (def.length >= val.length) val = def;
  e.target.value = matrix.replace(/./g, function (a) {
    return /[_\d]/.test(a) && i < val.length
      ? val.charAt(i++)
      : i >= val.length
      ? ""
      : a;
  });
};
var phone_inputs = document.querySelectorAll("[data-phone-pattern]");
for (let elem of phone_inputs) {
  for (let ev of ["input", "blur", "focus"]) {
    elem.addEventListener(ev, eventCalllback);
  }
}

// ОТПРАВКА ФОРМЫ
const forms = document.querySelectorAll(".feedform");

forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const modalOrderActive = form.closest(".modal--order");

    if (modalOrderActive) {
      const orderItem = modalOrderActive.querySelector(".modal__subtitle");
      formData.append("order", orderItem.textContent);
    }

    fetch("sendmail.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // console.log("then1");
        // console.log(response);
        if (response.ok) {
          return response.json();
        }
        console.error("Ошибка отправки данных");
        form.reset();
        exit();
      })
      .then((result) => {
        // console.log("then1");
        form.reset();
        console.log(result.message);

        if (modalOrderActive) {
          showModal(modalThanks);
        }

        if (isModalOpen()) {
          closeModal();
        }
      })
      .catch((err) => {
        console.error(`Ошибка передачи данных: ${err}`);
      });
  });
});

// FADING IN OUT

function fadeOut(el) {
  const transitionendHandler = () => {
    el.classList.add("visually-hidden");
    el.removeEventListener("transitionend", transitionendHandler);
  };

  el.addEventListener("transitionend", transitionendHandler);
  el.classList.add("fade");
}

function fadeIn(el) {
  el.classList.remove("visually-hidden");
  setTimeout(() => {
    el.classList.remove("fade");
  }, 10);
}

function isVisible(el) {
  return el.classList.contains("visually-hidden");
}

// HIDING UP LINK AT THE 1000 PX TOP SCROLL OF THE PAGE
const upLinkShowScroll = 1000;
const pageup = document.querySelector(".pageup");

function scrollHandler() {
  console.log("scrollHandler");
  if (window.scrollY >= upLinkShowScroll) {
    if (isVisible(pageup)) {
      // console.log("fadeIn");
      fadeIn(pageup);
    }
  } else {
    if (!isVisible(pageup)) {
      // console.log("fadeOut");
      fadeOut(pageup);
    }
  }
}

let timer = null;

window.addEventListener("scroll", () => {
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(function () {
    scrollHandler();
  }, 80);
});

// SMOOTH SCROLLING VANILLA JS
// pageup.addEventListener("click", (e) => {
//   e.preventDefault();
//   document.getElementById("toppage").scrollIntoView({ behavior: "smooth" });
// });

// $(function () {
//   $("a[href^='#").click(function () {
//     let _href = $(this).attr("href");
//     $("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
//     return false;
//   });
// });

// ПЛАВНАЯ ПРОКРУТКА К ЯКОРЮ JQUERY

// $(window).scroll(function () {
//   if ($(this).scrollTop() > 1600) {
//     $(".pageup").fadeIn();
//   } else {
//     $(".pageup").fadeOut();
//   }
// });

// $("a[href=#up]").click(function () {
//   const _href = $(this).attr("href");
//   $("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
//   return false;
// });

// ПЛАВНАЯ ПРОКРУТКА К ЯКОРЮ БЕЗ JQUERY
pageup.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("pageup");

  scrollToTop();
});

function easeInOutQuard(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function makeAnimation({ timing, duration, draw }) {
  const start = performance.now();
  let requestId = 0;

  function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;

    if (timeFraction > 1) timeFraction = 1;

    // timing(timeFraction)
    // Функция расчёта времени, как CSS-свойство transition-timing-function, которая будет вычислять прогресс анимации (как ось y у кривой Безье) в зависимости от прошедшего времени (0 в начале, 1 в конце).
    const progress = timing(timeFraction);

    //   draw(progress)
    // Функция отрисовки, которая получает аргументом значение прогресса анимации и отрисовывает его. Значение progress=0 означает, что анимация находится в начале, и значение progress=1 – в конце.

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else {
      if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = 0;
      }
    }
  }

  requestId = requestAnimationFrame(animate);
}

function scrollToTop(durationMax = 700, durationMin = 300) {
  console.log("scrollToTop");
  const page = document.documentElement;
  const scrollCurrent = page.scrollTop;

  // GET SCROLL DURATION
  const viewPortHeight = window.visualViewport.height;
  const scrollDistMax = page.scrollHeight - viewPortHeight;
  const distanse = page.scrollTop;
  const duration =
    ((durationMax - durationMin) / scrollDistMax) * distanse + durationMin;
  console.log(`duration = ${duration}`);

  makeAnimation({
    duration: duration,
    timing: easeInOutQuard,
    draw(progress) {
      page.scrollTop = scrollCurrent * (1 - progress);
    },
  });
}

// Добавление класса анимации к отзывам при прокрутке
const responseListItems = document.querySelectorAll(".responses li");
// console.log(firstResponse);

const observer = new IntersectionObserver(addFadeIn, {
  rootMargin: "-100px",
});

responseListItems.forEach((item) => observer.observe(item));

function addFadeIn(entries, observer) {
  entries.forEach((entry) => {
    const isIntersecting = entry.isIntersecting;
    if (isIntersecting) {
      // console.log(entry.target);
      entry.target.classList.add("fadeInUp");
      observer.unobserve(entry.target);
    }
  });
}

// TEST

// const html = document.documentElement;

// window.addEventListener("scroll", () => {
//   console.log("scrolling...");
//   console.log(`window.scrollY: ${window.scrollY}`);
//   console.log(`window.scrollTop: ${html.scrollTop}`);
// });

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
