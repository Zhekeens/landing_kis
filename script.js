/* eslint-disable no-restricted-globals */
(() => {
  /** Пароль для тестировщиков больше не нужен для публичного скачивания APK. */
  let openFeedbackModal = () => {};

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlowNetwork =
    conn && (conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
  const isLowEndDevice =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2);
  const isLiteMode = prefersReduced || isSlowNetwork || isLowEndDevice;

  if (isLiteMode) {
    document.body.classList.add("lite-mode");
  }

  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth in-page navigation without breaking default behavior
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a[href^='#']") : null;
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", href);
  });

  // Button shine follows pointer
  const trackShine = (e) => {
    const btn = e.target.closest(".btn--primary");
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    btn.style.setProperty("--mx", `${mx}%`);
    btn.style.setProperty("--my", `${my}%`);
  };
  document.addEventListener("pointermove", trackShine, { passive: true });

  // Reveal on scroll (with optional stagger in grid sections)
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const staggerContainers = document.querySelectorAll(
    ".platform-grid, .value-strip__inner, .community-grid, .tech-details",
  );
  staggerContainers.forEach((container) => {
    if (isLiteMode) return;
    const items = container.querySelectorAll(".reveal");
    items.forEach((el, i) => {
      el.setAttribute("data-stagger", "");
      el.style.setProperty("--stagger", `${Math.min(i * 60, 360)}ms`);
    });
  });

  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "80px 0px -10% 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Count up stats (skip animation on lite mode)
  const countEls = Array.from(document.querySelectorAll("[data-count-to]"));
  const animateCount = (el) => {
    const to = Number(el.getAttribute("data-count-to") || "0");
    if (isLiteMode) {
      el.textContent = String(to);
      return;
    }
    const duration = 950;
    const start = performance.now();

    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(to * eased);
      el.textContent = String(v);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!prefersReduced && !isLiteMode && "IntersectionObserver" in window) {
    const ioCounts = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            ioCounts.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 },
    );
    countEls.forEach((el) => ioCounts.observe(el));
  } else {
    countEls.forEach((el) => {
      el.textContent = String(el.getAttribute("data-count-to") || "0");
    });
  }

  const feedbackModal = document.getElementById("feedback-modal");
  if (feedbackModal) {
    const descInput = document.getElementById("feedback-description");
    const stepsInput = document.getElementById("feedback-steps");
    const contactInput = document.getElementById("feedback-contact");
    const screensInput = document.getElementById("feedback-screens");
    const submitBtn = document.getElementById("feedback-submit");
    const errorEl = document.getElementById("feedback-error");
    const okEl = document.getElementById("feedback-ok");

    const setError = (msg) => {
      if (!errorEl) return;
      errorEl.textContent = msg || "";
      errorEl.hidden = !msg;
    };

    const setOk = (msg) => {
      if (!okEl) return;
      okEl.textContent = msg || "";
      okEl.hidden = !msg;
    };

    function openFeedback() {
      setError("");
      setOk("");
      if (descInput) descInput.value = "";
      if (stepsInput) stepsInput.value = "";
      if (contactInput) contactInput.value = "";
      if (screensInput) screensInput.value = "";
      feedbackModal.classList.add("is-open");
      feedbackModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      requestAnimationFrame(() => descInput?.focus());
    }

    openFeedbackModal = openFeedback;

    const closeModal = () => {
      feedbackModal.classList.remove("is-open");
      feedbackModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      setError("");
    };

    document.querySelectorAll(".js-feedback-modal").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openFeedback();
      });
    });

    feedbackModal.querySelectorAll(".js-feedback-modal-close").forEach((el) => {
      el.addEventListener("click", () => closeModal());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && feedbackModal.classList.contains("is-open")) closeModal();
    });

    async function submitFeedback() {
      const description = (descInput?.value || "").trim();
      const steps = (stepsInput?.value || "").trim();
      const contact = (contactInput?.value || "").trim();
      if (!description) {
        setError("Опишите проблему.");
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setError("");
      setOk("");

      try {
        const fd = new FormData();
        fd.set("description", description);
        if (steps) fd.set("steps", steps);
        if (contact) fd.set("contact", contact);
        fd.set("page", window.location.href);

        const files = screensInput?.files ? Array.from(screensInput.files) : [];
        for (const f of files.slice(0, 6)) fd.append("screens", f, f.name);

        const res = await fetch("/api/feedback", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (res.status === 201 && data.ok) {
          setOk("Сообщение отправлено. Спасибо!");
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
        setError(data.error || "Не удалось отправить сообщение. Попробуйте позже.");
      } catch {
        setError("Сервер недоступен. Попробуйте позже.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    }

    submitBtn?.addEventListener("click", () => submitFeedback());
  }

  const downloadModal = document.getElementById("download-modal");
  if (downloadModal) {
    function openDownloadModal() {
      downloadModal.classList.add("is-open");
      downloadModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }

    function closeDownloadModal() {
      downloadModal.classList.remove("is-open");
      downloadModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    document.querySelectorAll(".js-download-modal").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openDownloadModal();
      });
    });

    downloadModal.querySelectorAll(".js-download-modal-close").forEach((el) => {
      el.addEventListener("click", () => closeDownloadModal());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && downloadModal.classList.contains("is-open")) closeDownloadModal();
    });
  }
})();
