/* ==========================================================================
   CD IMPERIAL — Interacciones
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.IMPERIAL_CONFIG || {};
  var links = cfg.links || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  root.classList.add("js");
  requestAnimationFrame(function () { root.classList.add("is-loaded"); });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

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
    var start = target > 1000 ? target - 23 : 0;
    if (reduceMotion) { el.textContent = target; return; }
    var dur = 1800, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 4)));
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
    var count = document.getElementById("news-count");
    var total = cfg.news.length;
    function cardStep() {
      var c = newsGrid.querySelector(".card");
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(newsGrid).columnGap || 32) : 300;
    }
    function updateSlider() {
      var max = newsGrid.scrollWidth - newsGrid.clientWidth;
      var ratio = max > 0 ? newsGrid.scrollLeft / max : 0;
      var visible = newsGrid.scrollWidth ? Math.min(1, newsGrid.clientWidth / newsGrid.scrollWidth) : 1;
      if (bar) {
        bar.style.width = visible * 100 + "%";
        bar.style.transform = "translateX(" + ratio * (1 / visible - 1) * 100 + "%)";
      }
      if (prev) prev.disabled = newsGrid.scrollLeft <= 4;
      if (next) next.disabled = newsGrid.scrollLeft >= max - 4;
      if (count) count.textContent = pad(Math.min(total, Math.round(newsGrid.scrollLeft / cardStep()) + 1)) + " / " + pad(total);
    }
    if (prev) prev.addEventListener("click", function () { newsGrid.scrollBy({ left: -cardStep() }); });
    if (next) next.addEventListener("click", function () { newsGrid.scrollBy({ left: cardStep() }); });
    newsGrid.addEventListener("scroll", updateSlider, { passive: true });
    window.addEventListener("resize", updateSlider);
    updateSlider();

    // Arrastrar con el ratón (en táctil el desplazamiento es nativo)
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

  /* ---------- Vídeo de la salida al campo ---------- */
  var film = document.getElementById("film");
  var filmToggle = document.getElementById("film-toggle");
  var filmProgress = document.getElementById("film-progress");
  if (film) {
    var filmBox = film.closest(".film");
    var userPaused = false;
    function setPaused(p) {
      filmBox.classList.toggle("is-paused", p);
      filmToggle.setAttribute("aria-label", p ? "Reproducir vídeo" : "Pausar vídeo");
    }
    if (reduceMotion) { film.removeAttribute("autoplay"); film.pause(); setPaused(true); userPaused = true; }
    filmToggle.addEventListener("click", function () {
      if (film.paused) { userPaused = false; film.play(); setPaused(false); }
      else { userPaused = true; film.pause(); setPaused(true); }
    });
    // Solo se reproduce cuando está en pantalla
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (userPaused) return;
          if (e.isIntersecting) { var p = film.play(); if (p && p.catch) p.catch(function () { setPaused(true); }); }
          else film.pause();
        });
      }, { threshold: 0.25 }).observe(film);
    }
    (function tick() {
      if (filmProgress && film.duration) filmProgress.style.transform = "scaleX(" + film.currentTime / film.duration + ")";
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- Menú ---------- */
  var header = document.getElementById("header");
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

  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav__list a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });

  /* ---------- Apariciones, contadores y menú activo ---------- */
  var revealEls = document.querySelectorAll(".reveal, .ambition__motto");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".count").forEach(animateCount);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a, i) { a.classList.toggle("is-active", sections[i] === entry.target); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Efectos ligados al scroll ---------- */
  var progress = document.getElementById("progress");
  var hero = document.querySelector(".hero");
  var heroMedia = document.querySelector(".hero__media");
  var communityImg = document.getElementById("community-img");
  var rows = Array.prototype.slice.call(document.querySelectorAll("[data-marquee]")).map(function (row) {
    return { el: row, track: row.querySelector(".manifesto__track"), dir: Number(row.dataset.marquee), x: 0 };
  });
  var lastY = window.scrollY, velocity = 0, lastT = performance.now();

  function onScrollUI() {
    var y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    var goingDown = y > lastY;
    header.classList.toggle("is-hidden", goingDown && y > window.innerHeight * 0.9 && !document.body.classList.contains("nav-open"));
    var docH = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (docH > 0 ? y / docH : 0) + ")";
    velocity += (y - lastY);
    lastY = y;
  }
  window.addEventListener("scroll", onScrollUI, { passive: true });
  onScrollUI();

  // Bucle de animación: cinta de lemas (velocidad base + impulso del scroll) y parallax.
  function loop(now) {
    var dt = Math.min(64, now - lastT); lastT = now;
    var vh = window.innerHeight;
    var boost = velocity * 0.6; velocity *= 0.85;

    rows.forEach(function (r) {
      var half = r.track.scrollWidth / 3;
      if (!half) return;
      r.x -= r.dir * (0.035 * dt + Math.abs(boost) * 0.5);
      if (r.x <= -half) r.x += half;
      if (r.x > 0) r.x -= half;
      r.track.style.transform = "translate3d(" + r.x.toFixed(2) + "px,0,0)";
    });

    if (hero && heroMedia) {
      var y = window.scrollY, hh = hero.offsetHeight;
      if (y < hh) heroMedia.style.transform = "translate3d(0," + (y * 0.3).toFixed(1) + "px,0)";
    }
    if (communityImg) {
      var r = communityImg.parentElement.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var p = (vh - r.top) / (vh + r.height) - 0.5;
        communityImg.style.transform = "translate3d(0," + (p * -10).toFixed(2) + "%,0) scale(1.04)";
      }
    }
    requestAnimationFrame(loop);
  }
  if (!reduceMotion) requestAnimationFrame(loop);
})();
