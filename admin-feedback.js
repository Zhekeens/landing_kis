(() => {
  const STORAGE_KEY = "kisfit_beta_admin_token";

  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");
  if (tokenFromUrl !== null) {
    const t = tokenFromUrl.trim();
    if (t) sessionStorage.setItem(STORAGE_KEY, t);
    else sessionStorage.removeItem(STORAGE_KEY);
    history.replaceState(null, "", window.location.pathname + window.location.hash);
  }

  const loginSection = document.getElementById("admin-login");
  const panelSection = document.getElementById("admin-panel");
  const tokenInput = document.getElementById("admin-token");
  const loginBtn = document.getElementById("admin-login-btn");
  const loginError = document.getElementById("admin-login-error");
  const refreshBtn = document.getElementById("admin-refresh");
  const logoutBtn = document.getElementById("admin-logout");
  const statusEl = document.getElementById("admin-status");
  const listEl = document.getElementById("feedback-list");

  function getToken() {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  }

  function setToken(t) {
    if (t) sessionStorage.setItem(STORAGE_KEY, t);
    else sessionStorage.removeItem(STORAGE_KEY);
  }

  function showLoginError(msg) {
    if (!loginError) return;
    loginError.textContent = msg;
    loginError.style.display = msg ? "block" : "none";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  async function downloadAttachment(id, filename) {
    const token = getToken();
    const res = await fetch(`/api/feedback/${encodeURIComponent(id)}/attachments/${encodeURIComponent(filename)}`, {
      headers: { "X-Admin-Token": token },
    });
    if (!res.ok) throw new Error("download_failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function render(items) {
    listEl.innerHTML = "";
    if (!items.length) {
      listEl.innerHTML = "<p class=\"muted\">Пока нет сообщений.</p>";
      return;
    }

    for (const fb of items) {
      const card = document.createElement("div");
      card.className = "feedback-card";

      const attachments = Array.isArray(fb.attachments) ? fb.attachments : [];
      const page = fb.page ? String(fb.page) : "";
      const contact = fb.contact ? String(fb.contact) : "";
      const ua = fb.ua ? String(fb.ua) : "";

      card.innerHTML = `
        <div class="feedback-head">
          <div><strong>${escapeHtml(formatDate(fb.createdAt || ""))}</strong></div>
          <div class="feedback-meta">${escapeHtml(fb.id || "")}</div>
        </div>
        <div class="feedback-body">
          ${page ? `<div class="feedback-meta">Страница: ${escapeHtml(page)}</div>` : ""}
          ${contact ? `<div class="feedback-meta">Контакт: ${escapeHtml(contact)}</div>` : ""}
          ${ua ? `<div class="feedback-meta">UA: ${escapeHtml(ua)}</div>` : ""}
          <div>
            <div class="feedback-meta" style="margin-bottom:6px">Описание</div>
            <pre class="feedback-pre">${escapeHtml(fb.description || "")}</pre>
          </div>
          ${
            fb.steps
              ? `<div><div class="feedback-meta" style="margin-bottom:6px">Шаги</div><pre class="feedback-pre">${escapeHtml(
                  fb.steps,
                )}</pre></div>`
              : ""
          }
        </div>
      `;

      const actions = document.createElement("div");
      actions.className = "feedback-actions";
      if (attachments.length) {
        for (const a of attachments) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn--ghost";
          btn.textContent = `Скрин (${Math.round((a.size || 0) / 1024)} KB)`;
          btn.addEventListener("click", async () => {
            btn.disabled = true;
            try {
              await downloadAttachment(fb.id, a.filename);
            } catch {
              // noop
            } finally {
              btn.disabled = false;
            }
          });
          actions.appendChild(btn);
        }
      } else {
        const muted = document.createElement("div");
        muted.className = "muted";
        muted.style.marginTop = "10px";
        muted.textContent = "Вложений нет.";
        actions.appendChild(muted);
      }
      card.appendChild(actions);
      listEl.appendChild(card);
    }
  }

  async function loadList() {
    const token = getToken();
    if (!token) return;
    statusEl.textContent = "Загрузка…";
    listEl.innerHTML = "";

    let res;
    try {
      res = await fetch("/api/feedback", {
        headers: { "X-Admin-Token": token },
      });
    } catch {
      statusEl.textContent = "Нет соединения с сервером.";
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setToken("");
      panelSection.hidden = true;
      loginSection.hidden = false;
      showLoginError("Доступ запрещён. Проверьте значение и попробуйте снова.");
      statusEl.textContent = "";
      return;
    }
    if (!res.ok) {
      statusEl.textContent = data.error || "Не удалось загрузить список.";
      return;
    }

    const items = data.feedback || [];
    statusEl.textContent = items.length ? `Всего сообщений: ${items.length}` : "Пока нет сообщений.";
    render(items);
  }

  function showPanel() {
    loginSection.hidden = true;
    panelSection.hidden = false;
    showLoginError("");
    loadList();
  }

  loginBtn?.addEventListener("click", async () => {
    const token = (tokenInput?.value || "").trim();
    showLoginError("");
    if (!token) {
      showLoginError("Заполните поле.");
      return;
    }
    setToken(token);
    loginBtn.disabled = true;
    try {
      const res = await fetch("/api/feedback", { headers: { "X-Admin-Token": token } });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setToken("");
        showLoginError(data.error || "Неверные данные для входа.");
        return;
      }
      if (!res.ok) {
        showLoginError(data.error || "Ошибка сервера.");
        return;
      }
      showPanel();
    } catch {
      setToken("");
      showLoginError("Сервер недоступен.");
    } finally {
      loginBtn.disabled = false;
    }
  });

  refreshBtn?.addEventListener("click", () => loadList());

  logoutBtn?.addEventListener("click", () => {
    setToken("");
    if (tokenInput) tokenInput.value = "";
    panelSection.hidden = true;
    loginSection.hidden = false;
    listEl.innerHTML = "";
    statusEl.textContent = "";
  });

  if (getToken()) {
    tokenInput.value = "";
    showPanel();
  }
})();

