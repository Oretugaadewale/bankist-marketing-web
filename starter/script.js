'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// To show the hidden modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// to close the modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////
//scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // scroling old way
  // const slcoords = section1.getBoundingClientRect();
  // console.log(slcoords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // new way of scrolling
  section1.scrollIntoView({ behaviour: 'smooth' });
});

//////////////////////////////////
//page navigation
//it help smooth scrolling to target each element instead of writing it one by one
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behaviour: 'smooth' });
//   });
// });

//1. add event listener to common paernt element
//2. determine what element originated the event
//////////////////////////////////////////////
//Event delegation
// This is better than page navigation use this
//navlink is the common element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //the single hadler

  //marching stategy to check if the element contain nav link only
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behaviour: 'smooth' });
  }
});

const h1 = document.querySelector('h1');

// //going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //going upward:parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('.header').style.background = 'var(--gradient-primary)';

//going sideways: sibling
// console.log(h1.preventElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
///////////////////////////////////////
//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
//parent element
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;
  //remove active classes of the content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active tab to make the tab move up and down
  clicked.classList.add('operations__tab--active');

  //active content area
  //To make the text context appear
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////////////
//menu fade animation. paasing arguement to event handler
// nav is the most common and also the parent
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//passing 'arguement' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////
//sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY); // to return the pixel scrolled from upper to left corner of the window
//   //nav has been selected b4 on menu fade animation
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//////////////////////////////////
//implementing sticky navigation using the intersection observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
//Apply sticky header using intersection observer APi
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; //destructuring happens here
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////////////////////////////
//Revealing Element on scroll
//Reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

////////////////////////////
//lazy loading image
//choosing all the image that has data-src
const imgTargets = document.querySelectorAll('img[data-src]');
//call back function
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // this makes the image to load before we reach it
});
//use image observer to observe each image
imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////
//building slide component
//puttting all the slider into one function
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  //Tell js no of slide
  const maxSlide = slides.length;
  //putting all slides side by side
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  //working on the dots  function to make it work under the image and appear
  //functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //activate the dot to make it bold
  const activateDot = function (slide) {
    //firstly we need to deactivate all the dots first
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //next slide (front or right)
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      // -1 is added cos the length start from 1 so it wont count the empty space
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //previous slide(back or left)
  const prevSlide = function () {
    if (curSlide === 0) {
      //first slide is always 0
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //initialization
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  //event handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //keyboard event using the keyboard to stroll left and right
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else {
      e.key === 'ArrowRight' && nextSlide();
    }
  });

  //you can also use this method on keyboard to scroll left oe right
  // document.addEventListener('keydown', function (e) {
  //   if (e.key === 'ArrowLeft') prevSlide();
  //   //short circuting
  //   e.key === 'ArrowRight' && nextSlide();
  // });
  // dot add event listener
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(curSlide);
    }
  });
};
slider();
/*
// Selecting element
console.log(document.documentElement); // show all html document
console.log(document.head); // to show all head
console.log(document.body); // to show all body

const header = document.querySelector('.header');

const allSection = document.querySelectorAll('.section');
console.log(allSection);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));

//how to add and remove cookies
//creating and inserting element programatically
const message = document.createElement('div');
message.innerHTML = `we use cookied for improved functionality and analytics <button class="btn
 btn--close-cookies">got it!</button>`;
header.append(message);

// header.prepend(message);
// To make it append twice up and down
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// delete
document
  .querySelector('.btn--close-cookies')
  .addEventListener('click', function () {
    message.remove();
  });

// style
message.style.backgroundColor = '#37383d';
message.style.width = '103%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

//This method returns an object containing the values of all CSS properties of an element
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(
  getComputedStyle(message).height,
  10 + 30 + 'px'
);

// changing the css variable or property
//:root
document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'beautiful minimalList logo';

//Non standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes
//version no must be in camel case but it dosent have to be so on html
console.log(logo.dataset.versionNumber);

//classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c', 'j');
logo.classList.contain('c', 'j'); // like include in an array
*/

//Events
// const h1 = document.querySelector('h1');

/*
//mouse event mouseenter
// h1.addEventListener('mouseenter', function (e) {
//   alert('addEventListener: Great! you are reading the heading :D');
// });

//we can also do it this way
const alertH1 = function (e) {
  alert('addEventListener: Great! you are reading the heading :D');
  //remove event listener
  // h1.removeEventListener('mouseenter', alertH1);
};
h1.addEventListener('mouseenter', alertH1); // we call the event lstener here

// you can also remove event listener like this
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
*/

/*
//Event propagation
//rgb(255,255,255)
//formular to generate randon integar
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)}`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  //stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
*/
////////////////////////////
// life cycle dom event
document.querySelector('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded');
});
