import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Loading animation
const loadingAnimation = () => {
  const tl = gsap.timeline();

  tl.to('#progress-text', {
    duration: 2,
    text: 'CARGANDO SANT ADRIÀ...',
    ease: 'power1.in',
  }).to('#loading-modal', {
    duration: 1.5,
    opacity: 0,
    visibility: 'hidden',
    ease: 'power2.inOut',
    delay: 1,
  });

  return tl;
};

// Initialize main timeline
const mainTimeline = gsap.timeline();
mainTimeline.add(loadingAnimation());

// Rain animation enhancement
const enhanceRain = () => {
  gsap.to('.rain-canvas', {
    opacity: 0.4,
    duration: 2,
    ease: 'power2.inOut',
    delay: 3,
  });
};
enhanceRain();

// Existing section1 animation (not modified as requested)
gsap.from('.section1', { opacity: 0, duration: 1, delay: 0.5 });

// Text section animations
const animateTextSection = () => {
  const titleLetters = gsap.utils.toArray('.title div span');
  // Create a stagger effect with custom transformations
  gsap.set(titleLetters, {
    y: 120,
    opacity: 0,
  });

  gsap.to(titleLetters, {
    y: 20,
    opacity: 1,
    duration: 3.2,
    stagger: 0.1,
    ease: 'back.out(1.2)',
    delay: 0.5,
    scrollTrigger: {
      trigger: '.text-section',
      start: 'top 50%',
      end: 'bottom 20%',
      toggleActions: 'play reset play reset',
      markers: true,
    },
    onStart: () => {
      console.log('Text animation started');
    },
  });

  // Subtitle animation with glow effect
  gsap.set('.subtitle', {
    opacity: 0,
    y: 30,
    scale: 0.9,
  });

  const subtitleTimeline = gsap.timeline({ delay: 3.5 });
  subtitleTimeline
    .to('.subtitle', {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
    })
    .to('.subtitle', {
      scale: 1.05,
      textShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    })
    .to('.subtitle', {
      scale: 1,
      textShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
      duration: 0.5,
    });

  // Add subtle continuous floating animation to the subtitle
  gsap.to('.subtitle', {
    y: -10,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 5,
  });

  return subtitleTimeline;
};

// Section 2 animations
const animateSection2 = () => {
  const section2Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section2',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  section2Tl
    .from('.section2 .section-title', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
    })
    .from(
      '.section2::before',
      {
        opacity: 0,
        scale: 0.9,
        duration: 1.5,
        ease: 'power2.out',
      },
      '-=0.7'
    )
    .to(
      '.section2 .section-title',
      {
        textShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
        color: '#ffffff',
        duration: 0.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
      },
      '+=0.2'
    );

  return section2Tl;
};

// Section 3 animations
const animateSection3 = () => {
  // Helper function to safely split text while preserving HTML tags
  const splitTextIntoChars = (element) => {
    // Store the original innerHTML
    const originalHTML = element.innerHTML;
    let inTag = false;
    let currentTag = '';
    let result = '';

    // Process each character
    for (let i = 0; i < originalHTML.length; i++) {
      const char = originalHTML[i];

      // Handle HTML tags
      if (char === '<') {
        inTag = true;
        currentTag += char;
        continue;
      }

      if (inTag) {
        currentTag += char;
        if (char === '>') {
          inTag = false;
          result += currentTag;
          currentTag = '';
        }
        continue;
      }

      // Handle spaces
      if (char === ' ') {
        result += ' ';
        continue;
      }

      // Handle actual text characters - wrap in span
      result += `<span class="char">${char}</span>`;
    }

    return result;
  };

  // Process text elements to split into characters
  const textElements = document.querySelectorAll(
    '.section3 .article-title, .section3 .article-source, .section3 .article-subtitle, .section3 .article-text'
  );

  textElements.forEach((element) => {
    // For elements with .highlight children, we need to handle them specially
    if (element.querySelector('.highlight')) {
      const childNodes = Array.from(element.childNodes);

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Text node - split and replace
          const span = document.createElement('span');
          span.innerHTML = splitTextIntoChars({ innerHTML: node.textContent });
          node.parentNode.replaceChild(span, node);
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains('highlight')
        ) {
          // Highlight node - keep the class but split inner text
          node.innerHTML = splitTextIntoChars({ innerHTML: node.innerHTML });
        }
      });
    } else {
      // No highlights, just split all text
      element.innerHTML = splitTextIntoChars(element);
    }
  });

  // Create the scroll-linked animation
  const section3Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section3',
      start: 'top 75%',
      end: '+=180%',
      scrub: 5,
      //   markers: true, // Set to true for debugging
    },
  });

  // Get all character spans
  const allChars = gsap.utils.toArray('.section3 .char');

  // Set initial state - low opacity
  gsap.set(allChars, { opacity: 0.1 });

  // Animate characters to full opacity as scroll progresses
  section3Tl.to(allChars, {
    opacity: 1,
    stagger: {
      each: 0.015, // Very small stagger for smoother appearance
      from: 'start',
    },
    ease: 'power1.inOut',
  });

  // Special animation for highlighted text
  const highlights = document.querySelectorAll('.section3 .highlight');
  highlights.forEach((highlight) => {
    const highlightChars = highlight.querySelectorAll('.char');

    section3Tl.to(
      highlightChars,
      {
        color: '#ff5500', // Adjust to your preferred highlight color
        fontWeight: 'bold',
        textShadow: '0 0 3px rgba(255,85,0,0.3)',
        duration: 0.3,
        stagger: {
          each: 0.005,
          from: 'start',
        },
        ease: 'power2.inOut',
      },
      '<+=0.1'
    ); // Slight delay from previous animation
  });

  // Iframe animation
  section3Tl.from(
    '.section3 iframe',
    {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.5,
      ease: 'back.out(1.2)',
    },
    '>-=0.2'
  );

  return section3Tl;
};

// Initialize animation when the DOM is loaded
document.addEventListener('DOMContentLoaded', animateSection3);

// Section 4 animations
const animateSection4 = () => {
  const section4Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section4',
      start: 'top 75%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // Function to split text into spans for animation
  const splitTextIntoSpans = (selector) => {
    const element = document.querySelector(selector);
    const text = element.textContent;
    element.innerHTML = text
      .split('')
      .map(
        (char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
      )
      .join('');
  };

  // Split the text in the final message
  splitTextIntoSpans('.section4 .final-message');

  // Animate the characters
  section4Tl.from('.section4 .final-message .char', {
    opacity: 0,
    y: 50,
    rotateX: -90,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.05, // Stagger the animation for each character
  });

  // Special animation for highlighted spans
  const spans = gsap.utils.toArray('.section4 .final-message span');
  spans.forEach((span) => {
    section4Tl.to(
      span,
      {
        scale: 1.5,
        color: '#ff5252',
        textShadow: '0 0 30px rgba(255, 82, 82, 0.6)',
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
      },
      '-=0.3'
    );
  });

  // Special animation for the link
  section4Tl.to(
    '.section4 h4 a',
    {
      backgroundColor: 'rgba(0, 240, 255, 0.15)',
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
      duration: 0.6,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    },
    '-=0.2'
  );

  return section4Tl;
};

// Parallax effects for sections
const createParallaxEffects = () => {
  // Subtle parallax for section backgrounds
  gsap.to('.section2::before', {
    backgroundPosition: `${Math.random() * 10}% ${Math.random() * 10}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section2',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.section3', {
    backgroundPosition: `${Math.random() * 10}% ${Math.random() * 10}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section3',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.section4::before', {
    backgroundPosition: `${Math.random() * 10}% ${Math.random() * 10}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section4',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
};

// Cursor animations
const createCursorEffect = () => {
  // Create a cursor follower element
  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  document.body.appendChild(cursor);

  // Style the cursor follower
  gsap.set(cursor, {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 240, 255, 0.3)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    mixBlendMode: 'difference',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
  });

  // Create the cursor animation
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX - 15,
      y: e.clientY - 15,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  // Highlight effects on hover for interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, .highlight, .section-title, .final-message'
  );
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        duration: 0.3,
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'rgba(0, 240, 255, 0.3)',
        duration: 0.3,
      });
    });
  });
};

// Text reveal animations
const createTextRevealEffects = () => {
  // Subtitle text reveal animation
  const subtitleLetters = gsap.utils.toArray('.subtitle');
  subtitleLetters.forEach((letter) => {
    ScrollTrigger.create({
      trigger: letter,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(letter, {
          color: '#ffcc00',
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        });
      },
      once: true,
    });
  });

  // Highlight text reveal animation
  const highlights = gsap.utils.toArray('.highlight');
  highlights.forEach((highlight) => {
    ScrollTrigger.create({
      trigger: highlight,
      start: 'top 80%',
      onEnter: () => {
        gsap.from(highlight, {
          textShadow: '0 0 20px rgba(255, 204, 0, 0.8)',
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.out',
        });
      },
      once: true,
    });
  });
};

// Execute all animations
document.addEventListener('DOMContentLoaded', () => {
  // Wait for fonts to load before starting animations
  document.fonts.ready.then(() => {
    animateTextSection();
    animateSection2();
    animateSection3();
    animateSection4();
    createParallaxEffects();
    createCursorEffect();
    createTextRevealEffects();

    // Refresh ScrollTrigger to ensure all triggers work properly
    ScrollTrigger.refresh();
  });
});

// Cleanup function for ScrollTrigger
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
