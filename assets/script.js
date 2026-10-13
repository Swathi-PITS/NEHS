(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector("header.site");
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector("#nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function onScroll() {
    if (header) header.classList.toggle("shrink", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("show"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var carousel = document.querySelector(".carousel");
  if (carousel) {
    var track = carousel.querySelector(".slides");
    var slides = track.children;
    var n = slides.length;
    var i = 0;
    var timer;
    var dots = carousel.querySelector(".dots");
    for (var k = 0; k < n; k++) {
      (function (k) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to slide " + (k + 1));
        b.onclick = function () { go(k); };
        dots.appendChild(b);
      })(k);
    }
    function go(x) {
      i = (x + n) % n;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      Array.prototype.forEach.call(slides, function (s, j) { s.classList.toggle("on", j === i); });
      Array.prototype.forEach.call(dots.children, function (d, j) { d.className = j === i ? "on" : ""; });
      reset();
    }
    function reset() {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { go(i + 1); }, 6500);
    }
    carousel.querySelector(".prev").onclick = function () { go(i - 1); };
    carousel.querySelector(".next").onclick = function () { go(i + 1); };
    carousel.addEventListener("mouseenter", function () { clearInterval(timer); });
    carousel.addEventListener("mouseleave", reset);
    go(0);
  }

  var player = document.querySelector("#player");
  document.querySelectorAll(".vcard").forEach(function (card) {
    card.addEventListener("click", function () {
      if (!player) return;
      player.src = "https://www.youtube.com/embed/" + card.dataset.id + "?autoplay=1";
      document.querySelectorAll(".vcard").forEach(function (c) { c.classList.remove("on"); });
      card.classList.add("on");
    });
  });

  var box = document.querySelector(".lightbox");
  if (box) {
    var shot = box.querySelector("img");
    document.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        shot.src = btn.getAttribute("data-full");
        shot.alt = btn.getAttribute("data-alt") || "";
        box.classList.add("open");
      });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.closest("button")) box.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") box.classList.remove("open");
    });
  }
})();
