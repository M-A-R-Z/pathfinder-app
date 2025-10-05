import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './UserLandingPage.css';
import AboutUs1 from '../assets/About Us 1.png';
import AboutUs2 from '../assets/About Us 2.png';
import AboutUs3 from '../assets/About Us 3.png';

const UserLandingPage = () => {
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Email submitted:', email);
      setEmail('');
      alert('Thank you for subscribing!');
    }
  };

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close menu after clicking
    
    let element;
    if (sectionId === 'home') {
      element = document.querySelector('.hero');
    } else if (sectionId === 'about') {
      element = document.getElementById('about-section');
    } else if (sectionId === 'faq') {
      element = document.getElementById('faq-section');
    }

    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.nav');
      const hamburger = document.querySelector('.hamburger');
      
      if (isMenuOpen && nav && !nav.contains(event.target) && !hamburger.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Intersection Observer to track active section
  useEffect(() => {
    const sections = [
      { id: 'home', element: document.querySelector('.hero') },
      { id: 'about', element: document.getElementById('about-section') },
      { id: 'faq', element: document.getElementById('faq-section') }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px', 
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('hero')) {
            setActiveSection('home');
          } else {
            const sectionId = entry.target.id || 'home';
            const mappedId = sectionId === 'about-section' ? 'about' : 
                            sectionId === 'faq-section' ? 'faq' : 
                            sectionId || 'home';
            setActiveSection(mappedId);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      if (section.element) {
        observer.observe(section.element);
      }
    });

    return () => {
      sections.forEach(section => {
        if (section.element) {
          observer.unobserve(section.element);
        }
      });
    };
  }, []);

  // Scroll animation observer for About and FAQ sections
  useEffect(() => {
    const animateOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe About section elements
    const aboutText = document.querySelector('.about-text');
    const ctaButton = document.querySelector('.cta-button');
    const studyImages = document.querySelectorAll('.study-image');
    
    if (aboutText) animateOnScroll.observe(aboutText);
    if (ctaButton) animateOnScroll.observe(ctaButton);
    studyImages.forEach(img => animateOnScroll.observe(img));

    // Observe FAQ section elements
    const faqItems = document.querySelectorAll('.faq-item');
    const questionBubbles = document.querySelectorAll('.question-bubble');
    
    faqItems.forEach(item => animateOnScroll.observe(item));
    questionBubbles.forEach(bubble => animateOnScroll.observe(bubble));

    return () => {
      if (aboutText) animateOnScroll.unobserve(aboutText);
      if (ctaButton) animateOnScroll.unobserve(ctaButton);
      studyImages.forEach(img => animateOnScroll.unobserve(img));
      faqItems.forEach(item => animateOnScroll.unobserve(item));
      questionBubbles.forEach(bubble => animateOnScroll.unobserve(bubble));
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Sticky Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav">
            <div className="logo" onClick={(e) => scrollToSection('home', e)}>
              <span className="logo-icon">🎓</span>
              <span className="logo-text">Strandify</span>
            </div>
            
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
              <a 
                href="#home" 
                onClick={(e) => scrollToSection('home', e)}
                className={activeSection === 'home' ? 'active' : ''}
              >
                HOME
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection('about', e)}
                className={activeSection === 'about' ? 'active' : ''}
              >
                ABOUT US
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection('faq', e)}
                className={activeSection === 'faq' ? 'active' : ''}
              >
                FAQ
              </a>
              <Link to="/userlogin" onClick={() => setIsMenuOpen(false)}>LOG-IN</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Strandify</h1>
              <div className="hero-subtitle">
                <h2>TAKE THE QUIZ</h2>
                <h3>FIND YOUR FIT</h3>
              </div>
              <p className="hero-description">
                Not sure which SHS strand suits your interests and skills?
              </p>
              <p className="hero-subtitle-text">
                <span className="brand-name">Strandify</span> helps you discover the best academic path based on your strengths and preferences.
              </p>
            </div>
            <div className="hero-image">
              <div className="students-group">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className={`student student-${num}`}>
                    <div className="student-avatar"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="about">
        <div className="container">         
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">ABOUT US</h2>
              <div className="about-description">
                <p>
                  <span className="brand-name">Strandify</span> bridges the gap between what you love doing and what the world needs. We believe your future should be exciting and sustainable. That means offering guidance that balances passion with practicality, and yes, aligning with real-world industry demands.
                </p>
                <p>
                  Whether you're thinking about anything specific, we've got your back. We break down overwhelming choices into bite-sized decisions, backed by data, presented with clarity.
                </p>
              </div>
              <Link to="/userlogin">
                <button className="cta-button">FIND OUT NOW</button>
              </Link>
            </div>
            <div className="about-images">
              <div className="image-grid">
                <div className="study-image study-1">
                  <img src={AboutUs1} alt="Study environment 1" />
                </div>
                <div className="study-image study-2">
                  <img src={AboutUs2} alt="Study environment 2" />
                </div>
                <div className="study-image study-3">
                  <img src={AboutUs3} alt="Study environment 3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="faq">
        <div className="container">
          <div className="faq-content">
            <div className="faq-text">
              <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
              <div className="faq-list">
                {[
                  {
                    question: "How does Strandify help me choose the right strand?",
                    answer: "Strandify uses advanced assessment algorithms to match your interests, skills, and career goals with the most suitable SHS strand for your future success."
                  },
                  {
                    question: "Is the assessment free to take?",
                    answer: "Yes! Our basic strand assessment is completely free. We also offer premium features for more detailed career guidance and personalized recommendations."
                  },
                  {
                    question: "How long does the assessment take?",
                    answer: "The assessment typically takes 15-20 minutes to complete. Take your time to answer thoughtfully for the most accurate results."
                  },
                  {
                    question: "Can I retake the assessment?",
                    answer: "Absolutely! You can retake the assessment anytime as your interests and goals evolve. We recommend retaking it if your preferences change significantly."
                  }
                ].map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="faq-visual">
              <div className="faq-graphic">
                {[
                  { emoji: '❓', class: 'bubble-1' },
                  { emoji: '💡', class: 'bubble-2' },
                  { emoji: '🎯', class: 'bubble-3' },
                  { emoji: '✅', class: 'bubble-4' }
                ].map((bubble, index) => (
                  <div key={index} className={`question-bubble ${bubble.class}`}>
                    <span>{bubble.emoji}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h3 className="newsletter-title">KEEP IN TOUCH</h3>
            <form className="newsletter-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
              <button type="submit" className="submit-button">Sign Up</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Strandify. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLandingPage;