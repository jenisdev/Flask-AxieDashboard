const swiper1 = new Swiper('.swiper-container-info', {
  loop: true,
  slidesPerView: 1,
  autoHeight: true,
  calculateHeight:true,
  speed: 3000,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
     
	breakpoints: {
	   1168: {
	      slidesPerView: 3,
	      autoplay: {
          delay: 35000000000,
          disableOnInteraction: false,
          direction: 'vertical',
        },
	    }
	},
});