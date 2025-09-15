import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './UserLandingPage.css';
import AboutUs1 from '../assets/About Us 1.png';
import AboutUs2 from '../assets/About Us 2.png';
import AboutUs3 from '../assets/About Us 3.png';

const UserLandingPage = () => {
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToHome = (e) => {
    e.preventDefault();
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToFAQ = (e) => {
    e.preventDefault();
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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

  return (
    <div className="landing-page">
      {/* Sticky Header */}
      <header className="header sticky-header">
        <div className="container">
          <div className="nav">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">PathFinder</span>
            </div>
            <div className="nav-links">
              <a 
                href="#home" 
                onClick={scrollToHome}
                className={activeSection === 'home' ? 'active' : ''}
              >
                HOME
              </a>
              <a 
                href="#about" 
                onClick={scrollToAbout}
                className={activeSection === 'about' ? 'active' : ''}
              >
                ABOUT US
              </a>
              <a 
                href="#faq" 
                onClick={scrollToFAQ}
                className={activeSection === 'faq' ? 'active' : ''}
              >
                FAQ
              </a>
              <Link to="/userlogin">USER</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">PathFinder</h1>
              <div className="hero-subtitle">
                <h2>TAKE THE QUIZ</h2>
                <h3>FIND YOUR FIT</h3>
              </div>
              <p className="hero-description">
                Not sure which SHS strand suits your interests and skills?
              </p>
              <p className="hero-subtitle-text">
                <span className="brand-name">PathFinder</span> helps you discover the best academic path based on your strengths and preferences.
              </p>
            </div>
            <div className="hero-image">
              <div className="students-group">
                <div className="student student-1">
                  <div className="student-avatar"></div>
                </div>
                <div className="student student-2">
                  <div className="student-avatar"></div>
                </div>
                <div className="student student-3">
                  <div className="student-avatar"></div>
                </div>
                <div className="student student-4">
                  <div className="student-avatar"></div>
                </div>
                <div className="student student-5">
                  <div className="student-avatar"></div>
                </div>
                <div className="student student-6">
                  <div className="student-avatar"></div>
                </div>
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
                  <span className="brand-name">PathFinder</span> bridges the gap between what you love doing and what the world needs. We believe your future should be exciting and sustainable. That means offering guidance that balances passion with practicality, and yes, aligning with real-world industry demands.
                </p>
                <p>
                  Whether you're thinking about anything specific, we've got your back. We break down overwhelming choices into bite-sized decisions, backed by data, presented with clarity.
                </p>
              </div>
              <button onClick={scrollToAbout} className="cta-button">FIND OUT NOW</button>
            </div>
            <div className="about-images">
              <div className="image-grid">
                <div className="study-image study-1"><img src={AboutUs1} alt="Study environment 1"></img></div>
                <div className="study-image study-2"><img src={AboutUs2} alt="Study environment 2"></img></div>
                <div className="study-image study-3"><img src={AboutUs3} alt="Study environment 3"></img></div>
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
                <div className="faq-item">
                  <div className="faq-question">
                    <h3>How does PathFinder help me choose the right strand?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>PathFinder uses advanced assessment algorithms to match your interests, skills, and career goals with the most suitable SHS strand for your future success.</p>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    <h3>Is the assessment free to take?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>Yes! Our basic strand assessment is completely free. We also offer premium features for more detailed career guidance and personalized recommendations.</p>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    <h3>How long does the assessment take?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>The assessment typically takes 15-20 minutes to complete. Take your time to answer thoughtfully for the most accurate results.</p>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    <h3>Can I retake the assessment?</h3>
                  </div>
                  <div className="faq-answer">
                    <p>Absolutely! You can retake the assessment anytime as your interests and goals evolve. We recommend retaking it if your preferences change significantly.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="faq-visual">
              <div className="faq-graphic">
                <div className="question-bubble bubble-1">
                  <span>❓</span>
                </div>
                <div className="question-bubble bubble-2">
                  <span>💡</span>
                </div>
                <div className="question-bubble bubble-3">
                  <span>🎯</span>
                </div>
                <div className="question-bubble bubble-4">
                  <span>✅</span>
                </div>
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
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Your Name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
              />
              <button onClick={handleEmailSubmit} className="submit-button">Sign - Up</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 PathFinder. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLandingPage;