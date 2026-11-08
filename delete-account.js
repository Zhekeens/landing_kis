(() => {
  const form = document.getElementById("delete-account-form");
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

    const appLogin = form.querySelector('[name="appLogin"]').value.trim();
    const contactEmail = form.querySelector('[name="contactEmail"]').value.trim();
    const confirmUnderstand = form.querySelector('[name="confirmUnderstand"]').checked;
    const comment = form.querySelector('[name="comment"]').value.trim();

    let hasError = false;
    if (!appLogin) {
      setInvalid("appLogin", true);
      hasError = true;
    }
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      setInvalid("contactEmail", true);
      hasError = true;
    }
    if (!confirmUnderstand) {
      setInvalid("confirmUnderstand", true);
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
      const res = await fetch("/api/account-deletion-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appLogin, contactEmail, comment, confirmUnderstand: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201 && data.ok) {
        ok = true;
        message =
          "Заявка принята. Мы свяжемся с вами по указанному email для подтверждения личности. Удаление выполняется в срок до 30 календарных дней.";
        form.reset();
      } else if (res.status === 429) {
        message = data.error || "Слишком много попыток. Попробуйте через минуту.";
      } else {
        message =
          data.error ||
          (res.status === 400 ? "Проверьте поля формы." : "Не удалось отправить заявку. Попробуйте позже.");
      }
    } catch {
      message = "Сервер недоступен. Попробуйте позже или напишите на zhekap26@gmail.com.";
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
