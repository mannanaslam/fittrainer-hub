
// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const header = document.getElementById('header');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  
  if (mobileMenu.classList.contains('open')) {
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
  } else {
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  }
});

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    header.style.boxShadow = 'none';
  }
});

// Close mobile menu when clicking anywhere outside
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('open') && 
      !mobileMenu.contains(e.target) && 
      !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.remove('open');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  }
});

// Close mobile menu when clicking on a nav link
const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  });
});

// Simple animation for elements as they scroll into view
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.section-header, .feature-card, .testimonial-card, .pricing-card');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (elementPosition < screenPosition) {
      element.style.animation = 'fadeIn 0.5s ease-out forwards';
      element.style.opacity = '1';
    }
  });
};

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    }
  });
});

// Update active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current || 
        (current === '' && link.getAttribute('href') === '#')) {
      link.classList.add('active');
    }
  });
});

// Current year for copyright
document.querySelectorAll('.footer-bottom p').forEach(el => {
  el.innerHTML = el.innerHTML.replace('2023', new Date().getFullYear());
});
