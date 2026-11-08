(() => {
  const form = document.getElementById("support-form");
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

    const reason = form.querySelector('[name="reason"]').value;
    const appLogin = form.querySelector('[name="appLogin"]').value.trim();
    const contact = form.querySelector('[name="contact"]').value.trim();
    const description = form.querySelector('[name="description"]').value.trim();

    let hasError = false;
    if (!reason) {
      setInvalid("reason", true);
      hasError = true;
    }
    if (!appLogin) {
      setInvalid("appLogin", true);
      hasError = true;
    }
    if (!contact || contact.length < 3) {
      setInvalid("contact", true);
      hasError = true;
    }
    if (!description || description.length < 10) {
      setInvalid("description", true);
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
      const res = await fetch("/api/support-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, appLogin, contact, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201 && data.ok) {
        ok = true;
        message = "Заявка отправлена. Мы свяжемся с вами по указанным контактным данным.";
        form.reset();
      } else if (res.status === 429) {
        message = data.error || "Слишком много попыток. Попробуйте через минуту.";
      } else {
        message =
          data.error ||
          (res.status === 400 ? "Проверьте поля формы." : "Не удалось отправить заявку. Попробуйте позже.");
      }
    } catch {
      message = "Сервер недоступен. Попробуйте позже или напишите на kisfitnes@gmail.com.";
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
