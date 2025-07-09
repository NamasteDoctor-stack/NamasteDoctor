import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinksRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navbarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Hamburger menu toggle + disable/enable scrolling
  const handleHamburgerClick = () => {
    setMenuOpen((open) => !open);
    document.body.classList.toggle("no-scroll", !menuOpen);
  };

  const handleSectionNav = (sectionId) => (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Close menu on nav link click + re-enable scrolling + smooth scroll
  useEffect(() => {
    const navLinks = navLinksRef.current;
    if (!navLinks) return;
    const handleLinkClick = (e) => {
      const href = e.target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        setMenuOpen(false);
        document.body.classList.remove("no-scroll");
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        setMenuOpen(false);
        document.body.classList.remove("no-scroll");
      }
    };
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", handleLinkClick);
    });
    return () => {
      navLinks.querySelectorAll("a").forEach(link => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [location]);

  // Navbar hide/show on scroll
  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (!menuOpen && navbarRef.current) {
        if (prevScrollpos > currentScrollPos) {
          navbarRef.current.style.top = "0";
        } else {
          navbarRef.current.style.top = "-100px";
        }
      }
      prevScrollpos = currentScrollPos;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // Fade In on Scroll
  useEffect(() => {
    const faders = document.querySelectorAll(".fade-in");
    const appearOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new window.IntersectionObserver(function (entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, appearOptions);
    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
    return () => {
      faders.forEach(fader => {
        appearOnScroll.unobserve(fader);
      });
    };
  }, [location]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    document.body.classList.remove("no-scroll");
  }, [location]);

  return (
    <header className="navbar" ref={navbarRef} style={{ top: 0, transition: "top 0.3s" }}>
      <div className="navbar-container">
        <Link to="/" className="logo" style={{ cursor: "pointer", textDecoration: "none" }}>
          Namaste<span>Doctor</span>
        </Link>
        <nav>
          <ul
            className={`nav-links${menuOpen ? " active" : ""}`}
            id="navLinks"
            ref={navLinksRef}
          >
            <li><a href="#about-section" onClick={handleSectionNav('about-section')}>About</a></li>
            <li><a href="#posts-section" onClick={handleSectionNav('posts-section')}>Posts</a></li>
            <li><a href="#how-it-works" onClick={handleSectionNav('how-it-works')}>How It Works</a></li>
            <li><a href="#faq-section" onClick={handleSectionNav('faq-section')}>FAQ</a></li>
            <li><Link to="/chatbot">Chatbot</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="login-btn">Doctor's Login</Link></li>
          </ul>
          <div
            className={`hamburger${menuOpen ? " toggle" : ""}`}
            id="hamburger"
            ref={hamburgerRef}
            onClick={handleHamburgerClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 