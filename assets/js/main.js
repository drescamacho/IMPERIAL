/* ==========================================================================
   CD IMPERIAL — Interacciones
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.IMPERIAL_CONFIG || {};
  var links = cfg.links || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Cifras ---------- */
  var statsGrid = document.getElementById("stats-grid");
  if (statsGrid && cfg.stats) {
    statsGrid.innerHTML = cfg.stats.map(function (s, i) {
      return (
        '<div class="stat reveal" data-delay="' + Math.min(i, 3) + '">' +
          '<p class="stat__value">' +
            (s.prefix ? '<span class="affix">' + esc(s.prefix) + "</span>" : "") +
            '<span class="count" data-target="' + Number(s.value) + '">' + Number(s.value) + "</span>" +
            (s.suffix ? '<span class="affix">' + esc(s.suffix) + "</span>" : "") +
          "</p>" +
          '<p class="stat__label">' + esc(s.label) + "</p>" +
          (s.note ? '<p class="stat__note">' + esc(s.note) + "</p>" : "") +
        "</div>"
      );
    }).join("");
  }

  function animateCount(el) {
    var target = Number(el.dataset.target);
    // Los años arrancan cerca de su valor para que el conteo sea legible.
    var start = target > 1000 ? target - 23 : 0;
    if (reduceMotion) { el.textContent = target; return; }
    var dur = 1600, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(start + (target - start) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = start;
    requestAnimationFrame(step);
  }

  /* ---------- Noticias ---------- */
  var newsGrid = document.getElementById("news-grid");
  var extIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  if (newsGrid && cfg.news) {
    var fmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });
    newsGrid.innerHTML = cfg.news.map(function (n, i) {
      var date = n.date ? fmt.format(new Date(n.date + "T12:00:00")) : "";
      var media = n.image
        ? '<div class="card__media"><img src="' + esc(n.image) + '" alt="" loading="lazy">'
        : '<div class="card__media card__media--crest"><img src="assets/img/crest-white.png" alt="" loading="lazy">';
      return (
        '<a class="card reveal" data-delay="' + Math.min(i, 3) + '" href="' + esc(n.url || "#") + '" target="_blank" rel="noopener">' +
          media +
            '<span class="card__source">' + esc(n.source || n.category) + "</span>" +
            '<span class="card__ext">' + extIcon + "</span>" +
          "</div>" +
          '<div class="card__body">' +
            '<p class="card__date"><b>' + esc(n.category) + "</b>" + (date ? ' · <time datetime="' + esc(n.date) + '">' + esc(date) + "</time>" : "") + "</p>" +
            '<h3 class="card__title">' + esc(n.title) + "</h3>" +
            '<span class="card__more">Leer en ' + esc(n.source || "el medio") + ' <i class="arrow"></i></span>' +
          "</div>" +
        "</a>"
      );
    }).join("");

    var prev = document.getElementById("news-prev");
    var next = document.getElementById("news-next");
    var bar = document.getElementById("news-bar");
    function cardStep() {
      var c = newsGrid.querySelector(".card");
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(newsGrid).columnGap || 24) : 300;
    }
    function updateSlider() {
      var max = newsGrid.scrollWidth - newsGrid.clientWidth;
      var ratio = max > 0 ? newsGrid.scrollLeft / max : 0;
      var visible = newsGrid.scrollWidth ? newsGrid.clientWidth / newsGrid.scrollWidth : 1;
      if (bar) {
        bar.style.width = Math.min(100, visible * 100) + "%";
        bar.style.transform = "translateX(" + (ratio * (1 / Math.min(1, visible) - 1) * 100) + "%)";
      }
      if (prev) prev.disabled = newsGrid.scrollLeft <= 4;
      if (next) next.disabled = newsGrid.scrollLeft >= max - 4;
    }
    if (prev) prev.addEventListener("click", function () { newsGrid.scrollBy({ left: -cardStep() }); });
    if (next) next.addEventListener("click", function () { newsGrid.scrollBy({ left: cardStep() }); });
    newsGrid.addEventListener("scroll", updateSlider, { passive: true });
    window.addEventListener("resize", updateSlider);
    updateSlider();

    // Arrastrar con el ratón (en táctil ya funciona de forma nativa)
    var drag = null;
    newsGrid.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      drag = { x: e.clientX, left: newsGrid.scrollLeft, moved: false };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5 && !drag.moved) { drag.moved = true; newsGrid.classList.add("is-dragging"); }
      if (drag.moved) newsGrid.scrollLeft = drag.left - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!drag) return;
      var moved = drag.moved;
      drag = null;
      if (moved) {
        newsGrid.classList.remove("is-dragging");
        var step = cardStep();
        newsGrid.scrollTo({ left: Math.round(newsGrid.scrollLeft / step) * step });
      }
    });
  }

  /* ---------- Patrocinadores ---------- */
  var sponsorsGrid = document.getElementById("sponsors-grid");
  if (sponsorsGrid) {
    var sponsors = cfg.sponsors || [];
    if (sponsors.length) {
      sponsorsGrid.innerHTML = sponsors.map(function (s) {
        return (
          '<a class="sponsor" href="' + esc(s.url || "#") + '" target="_blank" rel="noopener" title="' + esc(s.name) + '">' +
            '<img src="' + esc(s.logo) + '" alt="' + esc(s.name) + '" loading="lazy">' +
          "</a>"
        );
      }).join("");
    } else {
      var slots = ["Patrocinador principal", "Patrocinador oficial", "Colaborador", "Colaborador"];
      sponsorsGrid.innerHTML = slots.map(function (t) {
        return '<div class="sponsor sponsor--empty"><div><span>Tu marca aquí</span><small>' + t + "</small></div></div>";
      }).join("");
    }
  }

  /* ---------- Enlaces configurables ---------- */
  var wa = document.getElementById("cta-whatsapp");
  if (wa) wa.href = links.whatsapp || links.instagram || "#";
  var sp = document.getElementById("cta-sponsor");
  if (sp) {
    if (links.sponsorEmail) {
      sp.href = "mailto:" + links.sponsorEmail + "?subject=" + encodeURIComponent("Patrocinio CD Imperial");
      sp.removeAttribute("target");
    } else {
      sp.href = "https://ig.me/m/cd_imperial";
    }
  }
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Cabecera ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function setNav(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }
  burger.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  /* ---------- Sección activa en el menú ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav__list a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });

  /* ---------- Apariciones y contadores ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".count").forEach(animateCount);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a, i) { a.classList.toggle("is-active", sections[i] === entry.target); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Efectos ligados al scroll ---------- */
  var progress = document.getElementById("progress");
  var heroImg = document.getElementById("hero-img");
  var hero = document.querySelector(".hero");
  var community = document.querySelector(".community__media img");
  var speedEls = Array.prototype.slice.call(document.querySelectorAll("[data-speed]"));
  var driftEls = Array.prototype.slice.call(document.querySelectorAll("[data-drift]"));
  var mouseX = 0, mouseY = 0;

  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = "scaleX(" + (docH > 0 ? y / docH : 0) + ")";
    if (reduceMotion) return;

    if (hero && heroImg) {
      var hh = hero.offsetHeight;
      if (y < hh) {
        var p = y / hh;
        heroImg.parentElement.style.transform =
          "translate3d(" + (mouseX * -14) + "px," + (y * 0.35 + mouseY * -10) + "px,0)";
        heroImg.parentElement.style.opacity = String(1 - p * 0.6);
      }
    }
    speedEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var offset = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.speed);
      el.style.transform = "translate3d(0," + offset + "px,0)";
    });
    driftEls.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = "translate3d(" + (r.top * Number(el.dataset.drift)) + "px,0,0)";
    });
    if (community) {
      var cr = community.parentElement.getBoundingClientRect();
      if (cr.bottom > 0 && cr.top < vh) {
        var cp = (vh - cr.top) / (vh + cr.height);
        community.style.transform = "translate3d(0," + (-cp * 12) + "%,0)";
      }
    }
  }
  var queued = false;
  function requestFrame() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; frame(); });
  }
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame);
  if (hero && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
      requestFrame();
    });
  }
  frame();
})();
