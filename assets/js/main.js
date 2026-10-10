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
  if (newsGrid && cfg.news) {
    var fmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });
    newsGrid.innerHTML = cfg.news.slice(0, 3).map(function (n, i) {
      var date = n.date ? fmt.format(new Date(n.date + "T12:00:00")) : "";
      return (
        '<a class="card reveal" data-delay="' + i + '" href="' + esc(n.url || "#") + '">' +
          '<div class="card__media">' +
            '<img src="' + esc(n.image) + '" alt="" loading="lazy">' +
            '<span class="card__cat">' + esc(n.category) + "</span>" +
            (n.example ? '<span class="card__example">Contenido de ejemplo</span>' : "") +
          "</div>" +
          '<div class="card__body">' +
            '<time class="card__date" datetime="' + esc(n.date) + '">' + esc(date) + "</time>" +
            '<h3 class="card__title">' + esc(n.title) + "</h3>" +
            (n.excerpt ? '<p class="card__excerpt">' + esc(n.excerpt) + "</p>" : "") +
            '<span class="card__more">Leer noticia <i class="arrow"></i></span>' +
          "</div>" +
        "</a>"
      );
    }).join("");
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

  /* ---------- Parallax discreto ---------- */
  var parallax = document.querySelector(".community__media img");
  if (parallax && !reduceMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = parallax.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
          parallax.style.transform = "translate3d(0," + (-p * 12) + "%,0)";
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
