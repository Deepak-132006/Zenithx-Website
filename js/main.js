document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    "home",
    "how-it-works",
    "features",
    "faq",
    "testimonials",
    "contact",
  ];
  let loadedCount = 0;
  const total = sections.length;

  sections.forEach(async (section) => {
    try {
      const res = await fetch(`${section}.html`);
      if (!res.ok) throw new Error(`${section}.html not fetched`);

      const html = await res.text();
      document.getElementById(section).innerHTML = html;
      console.log(`${section}.html loaded`);

      setupHamburger();
      if (section === "faq") setupFAQAccordion();
    } catch (err) {
      console.error(err);
      document.getElementById(section).innerHTML = "<p>Page not Found</p>";
    } finally {
      loadedCount++;
      if (loadedCount === total) hideLoader();
    }
  });

  function hideLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = "none";
      document.body.classList.add("loaded");
    }, 400);
  }

  const links = document.querySelectorAll('nav a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((id) => {
      const sectionEl = document.getElementById(id);
      if (!sectionEl) return;
      const sectionTop = sectionEl.offsetTop;
      const sectionHeight = sectionEl.offsetHeight;

      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = id;
      }
    });

    navLinks.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) {
        a.classList.add("active");
      }
    });
  });
});

function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  if (hamburger.dataset.bound === "true") return;
  hamburger.dataset.bound = "true";

  hamburger.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
      navLinks.classList.add("hide");
    } else {
      navLinks.classList.remove("hide");
      navLinks.classList.add("show");
    }
    hamburger.classList.toggle("active");
  });
}
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // close all
      faqItems.forEach(i => {
        i.classList.remove("active");
        const ans = i.querySelector(".faq-answer");
        ans.style.height = 0;
        ans.style.opacity = 0;
      });

      // open clicked one
      if (!isActive) {
        item.classList.add("active");
        answer.style.height = answer.scrollHeight + "px";
        answer.style.opacity = 1;
      }
    });
  });
}
