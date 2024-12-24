// Select the element you want to observe
const mainTitle = document.querySelector('.sant-adria-title');
const mainSubtitle = document.querySelector('.main-subtitle');
const section2 = document.querySelector('.section2');
const rainCanvas = document.querySelector('.rainCanvas');

// // Create an Intersection Observer
const section2Observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('intersecting');
        mainTitle.classList.add('sant-adria-title--fixed');
        mainSubtitle.classList.add('main-subtitle--fixed');
        rainCanvas.classList.add('rainCanvas--show');
      } else {
        console.log('not intersecting');
        rainCanvas.classList.remove('rainCanvas--show');
      }
    });
  },
  {
    root: null, // Viewport is the root by default
    threshold: 0.6, // Trigger as soon as any part of the element is visible
    rootMargin: '0px 0px 0px 0px', // Adjust this to trigger exactly when it's at the top
  }
);

// Start observing the target element
section2Observer.observe(section2);
