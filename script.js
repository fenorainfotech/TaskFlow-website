(function () {
  "use strict";

  /* ---------- 0. PRELOADER ANIMATION ---------- */
  var preloader = document.getElementById("preloader");
  var preloaderFill = document.getElementById("preloaderFill");
  var preloaderText = document.getElementById("preloaderText");

  var progress = 0;
  var progressInterval = setInterval(function () {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      if (preloaderFill) preloaderFill.style.width = "100%";
      if (preloaderText) preloaderText.textContent = "Loading TaskFlow 100%";
      
      setTimeout(function () {
        if (preloader) preloader.classList.add("fade-out");
        document.body.classList.remove("loading");
      }, 350);
    } else {
      if (preloaderFill) preloaderFill.style.width = progress + "%";
      if (preloaderText) preloaderText.textContent = "Loading TaskFlow " + progress + "%";
    }
  }, 40);

  /* ---------- 1. HEADER SCROLL SHADOW & MOBILE NAV ---------- */
  var headerEl = document.querySelector(".site-header");
  if (headerEl) {
    var onScroll = function () {
      headerEl.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var navToggle = document.getElementById("navToggle");
  if (navToggle && headerEl) {
    navToggle.addEventListener("click", function () {
      var isOpen = headerEl.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* ---------- 2. HERO PARTICLE CANVAS ---------- */
  var canvas = document.getElementById("particleCanvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = 35;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 197, 94, " + p.alpha + ")";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  /* ---------- 3. MOUSE 3D TILT EFFECT ON HERO MOCKUP & FEATURE CARDS ---------- */
  var tiltTargets = document.querySelectorAll(".tilt-target, .tilt-card");
  tiltTargets.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -8;
      var rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
      card.style.setProperty("--mouse-x", x + "px");
      card.style.setProperty("--mouse-y", y + "px");
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });

  /* ---------- 4. MAGNETIC BUTTONS EFFECT ---------- */
  var magneticBtns = document.querySelectorAll(".btn-magnetic");
  /* ---------- 4. BUTTON HOVER ELEVATION (STABLE X-AXIS, NO SIDEWAYS MOVE) ---------- */
  var magneticBtns = document.querySelectorAll(".btn-magnetic");
  magneticBtns.forEach(function (btn) {
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  /* ---------- 5. SCROLL REVEAL & ANIMATED COUNTERS ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    document.body.classList.add("js-reveal-active");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            
            // Check if card contains a counter
            var counterEl = entry.target.querySelector(".count-num");
            if (counterEl && !counterEl.classList.contains("counted")) {
              counterEl.classList.add("counted");
              animateCounter(counterEl);
            }
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 100;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var current = 0;
    var step = Math.ceil(target / 40);
    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + current + suffix;
    }, 25);
  }

  /* ---------- 6. REAL APP TAB SWITCHER ---------- */
  var appTabs = document.querySelectorAll("[data-app-tab]");
  appTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetKey = tab.getAttribute("data-app-tab");
      
      appTabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");

      document.querySelectorAll(".app-view-tab").forEach(function (v) {
        v.classList.remove("active");
      });

      var targetView = document.getElementById("view-" + targetKey);
      if (targetView) targetView.classList.add("active");
    });
  });

  /* ---------- BENTO CHECKBOX INTERACTION ---------- */
  var bentoChks = document.querySelectorAll(".bento-chk");
  bentoChks.forEach(function (chk) {
    chk.addEventListener("change", function (e) {
      e.stopPropagation(); // prevent opening modal when clicking checkbox
      var parent = chk.closest(".bento-task-item");
      if (parent) {
        parent.classList.toggle("done", chk.checked);
      }
    });
  });

  /* ---------- TABLE CHECKBOX INTERACTION ---------- */
  var tblChks = document.querySelectorAll(".tbl-chk");
  tblChks.forEach(function (chk) {
    chk.addEventListener("change", function () {
      var row = chk.closest(".t-row");
      if (row) {
        row.classList.toggle("done-row", chk.checked);
        var stBadge = row.querySelector(".st-badge");
        var progTxt = row.querySelector(".prog-txt");
        if (chk.checked) {
          if (stBadge) { stBadge.className = "st-badge st-done"; stBadge.textContent = "Done"; }
          if (progTxt) { progTxt.className = "prog-txt green-txt"; progTxt.textContent = "100%"; }
        } else {
          if (stBadge) { stBadge.className = "st-badge st-prog"; stBadge.textContent = "In Progress"; }
          if (progTxt) { progTxt.className = "prog-txt"; progTxt.textContent = "80%"; }
        }
      }
    });
  });

  /* ---------- 7. FAQ ACCORDION ---------- */
  var faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("active");
        var q = i.querySelector(".faq-question");
        if (q) q.setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- 8. FEATURE DETAILS MODAL ---------- */
  var featureModalBackdrop = document.getElementById("featureModalBackdrop");
  var featureModalTitle = document.getElementById("featureModalTitle");
  var featureModalBody = document.getElementById("featureModalBody");
  var featureModalClose = document.getElementById("featureModalClose");

  var FEATURE_MAP = {
    tasks: {
      title: "Task Management & Sub-Task Hierarchy",
      html: "<p>Create, organize, and prioritize daily tasks with a clean, drag-and-drop workflow.</p><ul><li><strong>Priority Rules:</strong> Assign High, Medium, or Low priority badges.</li><li><strong>Sub-tasks:</strong> Break major deliverables into actionable steps.</li><li><strong>Custom Tags:</strong> Categorize tasks with vibrant color codes.</li></ul>"
    },
    notes: {
      title: "Markdown Notes & Idea Board",
      html: "<p>Capture notes, research, and documentation with rich Markdown formatting.</p><ul><li><strong>Instant Search:</strong> Filter notes instantly using full-text keywords.</li><li><strong>Color Cards:</strong> Group notes by project or personal focus.</li></ul>"
    },
    calendar: {
      title: "Visual Calendar & Time Grids",
      html: "<p>Plan your days and schedule work blocks with zero network latencies.</p><ul><li><strong>Time Views:</strong> Toggle between Month, Week, and Focus Day grids.</li></ul>"
    },
    reminders: {
      title: "Smart Reminders & Audio Alarms",
      html: "<p>Desktop notifications and Web Audio API alarms that alert you even when minimized.</p>"
    },
    analytics: {
      title: "Productivity Analytics & Completion Velocity",
      html: "<p>Automatic client-side charts that track completion rates and build positive habits.</p>"
    },
    command: {
      title: "Fast Search & Command Palette (Ctrl+K)",
      html: "<p>Sub-millisecond query responses across all tasks, notes, and modules.</p>"
    },
    security: {
      title: "100% Offline & AES-256 Encrypted Storage",
      html: "<p>All workspace data is saved in an embedded SQLite database on your computer.</p>"
    },
    time: {
      title: "Focus Mode & Integrated Timer",
      html: "<p>Track stopwatch session hours directly linked to active tasks.</p>"
    }
  };

  document.querySelectorAll("[data-feature]").forEach(function (card) {
    card.addEventListener("click", function () {
      var key = card.getAttribute("data-feature");
      var data = FEATURE_MAP[key];
      if (data && featureModalBackdrop) {
        featureModalTitle.textContent = data.title;
        featureModalBody.innerHTML = data.html;
        featureModalBackdrop.hidden = false;
      }
    });
  });

  if (featureModalClose) {
    featureModalClose.addEventListener("click", function () {
      featureModalBackdrop.hidden = true;
    });
  }

  /* ---------- 7.5 FAQ INSTANT SEARCH FILTER ---------- */
  var faqInput = document.getElementById("faqSearchInput");
  if (faqInput) {
    faqInput.addEventListener("input", function () {
      var query = faqInput.value.toLowerCase().trim();
      var faqItems = document.querySelectorAll(".glass-faq-card");
      
      faqItems.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        if (!query || text.indexOf(query) !== -1) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  /* ---------- 8.5 VIDEO MODAL HANDLER ---------- */
  var watchDemoBtns = document.querySelectorAll("#watchDemoBtn, .demo-trigger-btn, .watch-demo-btn");
  var videoModalBackdrop = document.getElementById("videoModalBackdrop");
  var videoModalClose = document.getElementById("videoModalClose");
  var modalVideoPlayer = document.getElementById("modalVideoPlayer");

  watchDemoBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (videoModalBackdrop && modalVideoPlayer) {
        videoModalBackdrop.hidden = false;
        modalVideoPlayer.play();
      }
    });
  });

  if (videoModalClose && videoModalBackdrop && modalVideoPlayer) {
    videoModalClose.addEventListener("click", function () {
      videoModalBackdrop.hidden = true;
      modalVideoPlayer.pause();
    });

    videoModalBackdrop.addEventListener("click", function (e) {
      if (e.target === videoModalBackdrop) {
        videoModalBackdrop.hidden = true;
        modalVideoPlayer.pause();
      }
    });
  }

})();
