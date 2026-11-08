(() => {
  const form = document.getElementById("beta-form");
  if (!form) return;

  const successEl = document.getElementById("form-success");
  const submitBtn = form.querySelector('button[type="submit"]');

  function setInvalid(fieldName, invalid) {
    const wrap = form.querySelector(`[data-field="${fieldName}"]`);
    if (wrap) wrap.classList.toggle("is-invalid", invalid);
  }

  function clearInvalid() {
    form.querySelectorAll("[data-field]").forEach((el) => el.classList.remove("is-invalid"));
  }

  function setSubmitting(loading) {
    if (submitBtn) submitBtn.disabled = loading;
    form.classList.toggle("is-submitting", loading);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInvalid();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const telegram = form.querySelector('[name="telegram"]').value.trim();
    const platform = form.querySelector('[name="platform"]').value;
    const comment = form.querySelector('[name="comment"]').value.trim();
    const agree = form.querySelector('[name="agree"]').checked;

    let hasError = false;
    if (!name) {
      setInvalid("name", true);
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalid("email", true);
      hasError = true;
    }
    if (!platform) {
      setInvalid("platform", true);
      hasError = true;
    }
    if (!agree) {
      setInvalid("agree", true);
      hasError = true;
    }
    if (hasError) return;

    if (successEl) {
      successEl.classList.remove("is-visible", "is-error");
      successEl.textContent = "";
    }

    setSubmitting(true);
    let ok = false;
    let message = "";

    try {
      const res = await fetch("/api/beta-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, telegram, platform, comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201 && data.ok) {
        ok = true;
        message = "Заявка отправлена. Мы свяжемся с вами, если подойдёте под текущий этап отбора.";
        form.reset();
      } else if (res.status === 429) {
        message = data.error || "Слишком много попыток. Попробуйте через минуту.";
      } else {
        message =
          data.error ||
          (res.status === 400 ? "Проверьте поля формы." : "Не удалось отправить заявку. Попробуйте позже.");
      }
    } catch {
      message =
        "Сервер заявок недоступен. Запустите сайт через команду из README (папка server/), либо обратитесь к команде КИСФИТ по почте.";
    } finally {
      setSubmitting(false);
    }

    if (successEl) {
      successEl.textContent = message;
      successEl.classList.add("is-visible");
      if (!ok) successEl.classList.add("is-error");
    }
  });
})();
