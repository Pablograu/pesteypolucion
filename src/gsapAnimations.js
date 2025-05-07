import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import camera from './camera';
import renderer from './renderer';
import sun from './meshes/sun';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Create master timeline
const masterTimeline = gsap.timeline();

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

// Add loading animation to master timeline
masterTimeline.add(loadingAnimation());

// Rain animation enhancement
const enhanceRain = () => {
  const rainTl = gsap.timeline();

  rainTl.to('.rain-canvas', {
    opacity: 0.4,
    duration: 2,
    ease: 'power2.inOut',
  });

  return rainTl;
};

// Add rain animation to master timeline
masterTimeline.add(enhanceRain(), '+=1'); // Add a slight delay after loading

const animateSection1 = () => {
  const titleLetters = gsap.utils.toArray('.title div span');
  // Create a stagger effect with custom transformations
  gsap.set(titleLetters, {
    y: 120,
    opacity: 0,
  });

  // Subtitle animation with glow effect
  gsap.set('.subtitle', {
    opacity: 0,
    y: 30,
    scale: 0.9,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: document.querySelector('.section1'),
      start: 'top top',
      end: '+=200%',
      scrub: 2,
      pin: true,
      anticipatePin: 1,
      pinSpacing: true,
      id: 'section1', // Add ID for better debugging
    },
    onStart: () => {
      console.log('Section 1 animation started');
    },
    onComplete: () => {
      console.log('Section 1 animation complete');
    },
    onReverseComplete: () => console.log('Section 1 reversed complete'),
  });

  tl.to(camera.position, { y: 50, z: -300, duration: 5 });
  tl.to(renderer, { toneMappingExposure: 0.15, duration: 5 }, '<');
  tl.to(sun.position, { y: 50, duration: 5 }, '<');

  tl.to(camera.position, { x: -150, z: -325, duration: 5 });
  tl.to(camera.rotation, { y: -0.46, duration: 5 }, '<');

  tl.to(titleLetters, {
    y: 20,
    opacity: 1,
    duration: 3.2,
    stagger: 0.1,
    ease: 'back.out(1.2)',
    delay: 0.5,
  });

  tl.to('.subtitle', {
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

  // This will stay as a separate animation since it's infinite
  gsap.to('.subtitle', {
    y: -10,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 5,
  });

  return tl;
};

// Section 2 animations
const animateSection2 = () => {
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
    '.section2 .article-title, .section2 .article-source, .section2 .article-subtitle, .section2 .article-text'
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
  const section2TL = gsap.timeline({
    scrollTrigger: {
      trigger: '.section2',
      start: 'top center',
      end: 'bottom bottom+=50',
      scrub: true,
      // markers: true, // Set to true for debugging
      id: 'section2', // Add ID for better debugging
    },
    onStart: () => {
      console.log('<<< Section 2 animation started');
    },
  });

  // Get all character spans
  const allChars = gsap.utils.toArray('.section2 .char');

  // Set initial state - low opacity
  gsap.set(allChars, { opacity: 0.1 });

  // Animate characters to full opacity as scroll progresses
  section2TL.to(allChars, {
    opacity: 1,
    stagger: {
      each: 0.015, // Very small stagger for smoother appearance
      from: 'start',
    },
    ease: 'power1.inOut',
  });

  // Special animation for highlighted text
  const highlights = document.querySelectorAll('.section2 .highlight');
  highlights.forEach((highlight) => {
    const highlightChars = highlight.querySelectorAll('.char');

    section2TL.to(
      highlightChars,
      {
        color: '#ff5500', // Adjust to your preferred highlight color
        fontWeight: 'bold',
        textShadow: '0 0 3px rgba(255,85,0,0.3)',
        duration: 0.3,
        stagger: {
          each: 0.05,
          from: 'start',
        },
        ease: 'power2.inOut',
      },
      '<+=0.1'
    ); // Slight delay from previous animation
  });

  // Iframe animation
  section2TL.from(
    '.section2 iframe',
    {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.5,
      ease: 'back.out(1.2)',
    },
    '>-=0.2'
  );

  return section2TL;
};

// Section 4 animations
const animateSection4 = () => {
  const section4Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section4',
      start: 'top 75%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      id: 'section4', // Add ID for better debugging
    },
  });

  // Function to split text into spans for animation
  const splitTextIntoSpans = (selector) => {
    const element = document.querySelector(selector);
    const text = element.textContent;
    element.innerHTML = text
      .split('')
      .map((char) =>
        char === 'e' || char === 'c'
          ? `<br><span class="char">${char.toUpperCase()}</span>`
          : `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
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
        duration: 0.2,
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
      backgroundColor: 'rgba(0, 240, 255, 0.5)',
      boxShadow: '0 0 80px rgba(0, 240, 255, 0.4)',
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
  const parallaxTl = gsap.timeline();

  // Subtle parallax for section backgrounds
  parallaxTl.add(
    gsap.to('.section2::before', {
      backgroundPosition: `${Math.random() * 10}% ${Math.random() * 10}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        id: 'parallax-section2-before',
      },
    })
  );

  parallaxTl.add(
    gsap.to('.section2', {
      backgroundPosition: `${Math.random() * 10}% ${Math.random() * 10}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        id: 'parallax-section2',
      },
    }),
    '<'
  );

  parallaxTl.add(
    gsap.to('.section4::before', {
      backgroundPosition: `${Math.random() * 10}% ${Math.random() * 10}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section4',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        id: 'parallax-section4-before',
      },
    }),
    '<'
  );

  return parallaxTl;
};

// Text reveal animations
const createTextRevealEffects = () => {
  const revealTl = gsap.timeline();

  // Subtitle text reveal animation
  const subtitleLetters = gsap.utils.toArray('.subtitle');
  subtitleLetters.forEach((letter, index) => {
    revealTl.add(
      gsap
        .timeline({
          scrollTrigger: {
            trigger: letter,
            start: 'top 80%',
            once: true,
            id: `subtitle-reveal-${index}`,
          },
        })
        .to(letter, {
          color: '#ffcc00',
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        })
    );
  });

  // Highlight text reveal animation
  const highlights = gsap.utils.toArray('.highlight');
  highlights.forEach((highlight, index) => {
    revealTl.add(
      gsap
        .timeline({
          scrollTrigger: {
            trigger: highlight,
            start: 'top 80%',
            once: true,
            id: `highlight-reveal-${index}`,
          },
        })
        .from(highlight, {
          textShadow: '0 0 20px rgba(255, 204, 0, 0.8)',
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.out',
        })
    );
  });

  return revealTl;
};

// Execute all animations
document.addEventListener('DOMContentLoaded', () => {
  // Wait for fonts to load before starting animations
  document.fonts.ready.then(() => {
    // Create all section timelines but don't run them yet
    animateSection1();
    animateSection2();
    animateSection4();
    createParallaxEffects();
    createTextRevealEffects();

    // Add all section timelines to master timeline with appropriate sequencing
    // Note: We don't need to add the ScrollTrigger-controlled timelines to the master
    // since they are already triggered by scroll events
    // But we can ensure they have proper labels for debugging

    // Add labels to the master timeline to mark where each section should begin
    masterTimeline.addLabel('section1Start');
    masterTimeline.addLabel('section2Start', 'section1Start+=3');
    masterTimeline.addLabel('section4Start', 'section2Start+=3');

    // Log the master timeline structure
    console.log('Master timeline created with all sections');

    // Refresh ScrollTrigger to ensure all triggers work properly
    ScrollTrigger.refresh();
  });
});

// Cleanup function for ScrollTrigger
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  masterTimeline.kill();
});

// Export the master timeline for debugging purposes
window.masterTimeline = masterTimeline;
