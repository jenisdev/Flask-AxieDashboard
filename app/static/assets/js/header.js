const swiper = new Swiper('.swiper-header', {
  loop: true,
  slidesPerView: 1,
  speed:1000,
  centeredSlides: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
     1168: {
        slidesPerView: 5,
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
        },
      }
  },
});

document.addEventListener('DOMContentLoaded', function () {
  var checkbox = document.querySelector('input[type="checkbox"]');

  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
     document.getElementById("swap-skin").style.backgroundImage =
          "url('img/light-swapskin.png')";
    } else {
      document.getElementById("swap-skin").style.backgroundImage =
          "url('img/dark-swapskin.png')";
    }
  });
});

var select = document.getElementsByClassName("swap-menu-selection");
var i;
var panel = document.getElementsByClassName('nav-menu');

for (i = 0; i < select.length; i++) {
  select[i].addEventListener("click", function() {
    if (panel[0].style.display === "block") {
      panel[0].style.display = "none";
    } else {
      panel[0].style.display = "block";
    }
  });
}
