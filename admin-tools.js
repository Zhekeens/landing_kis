(() => {
  const STORAGE_KEY = "kisfit_beta_admin_token";

  const loginSection = document.getElementById("admin-login");
  const panelSection = document.getElementById("admin-panel");
  const tokenInput = document.getElementById("admin-token");
  const loginBtn = document.getElementById("admin-login-btn");
  const loginError = document.getElementById("admin-login-error");
  const logoutBtn = document.getElementById("admin-logout");

  const views = {
    menu: document.getElementById("admin-view-menu"),
    ban: document.getElementById("admin-view-ban"),
    banner: document.getElementById("admin-view-banner"),
    passwords: document.getElementById("admin-view-passwords"),
  };

  const bannerEnabled = document.getElementById("admin-banner-enabled");
  const bannerMinVersion = document.getElementById("admin-banner-min-version");
  const bannerMessage = document.getElementById("admin-banner-message");
  const bannerInstallUrl = document.getElementById("admin-banner-install-url");
  const bannerSaveBtn = document.getElementById("admin-banner-save");
  const bannerMsg = document.getElementById("admin-banner-msg");
  const bannerError = document.getElementById("admin-banner-error");

  const banSearch = document.getElementById("admin-ban-search");
  const banSearchBtn = document.getElementById("admin-ban-search-btn");
  const banSearchStatus = document.getElementById("admin-ban-search-status");
  const banUsersBox = document.getElementById("admin-ban-users");
  const banReason = document.getElementById("admin-ban-reason");
  const banEmail = document.getElementById("admin-ban-email");
  const banLogin = document.getElementById("admin-ban-login");
  const banTgid = document.getElementById("admin-ban-tgid");
  const banSubmitBtn = document.getElementById("admin-ban-submit");
  const banMsg = document.getElementById("admin-ban-msg");
  const banError = document.getElementById("admin-ban-error");
  const banListBox = document.getElementById("admin-ban-list");
  const banRefreshBtn = document.getElementById("admin-ban-refresh");

  const pwdLabel = document.getElementById("admin-pwd-label");
  const pwdValue = document.getElementById("admin-pwd-value");
  const pwdAddBtn = document.getElementById("admin-pwd-add");
  const pwdList = document.getElementById("admin-pwd-list");
  const pwdMsg = document.getElementById("admin-pwd-msg");
  const pwdError = document.getElementById("admin-pwd-error");

  let currentView = "menu";
  const VALID_VIEWS = new Set(["menu", "ban", "banner", "passwords"]);
  const FETCH_TIMEOUT_MS = 15_000;
  const BAN_FETCH_TIMEOUT_MS = 12_000;

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

  function formatTs(ts) {
    if (ts == null) return "—";
    try {
      return new Date(Number(ts) * 1000).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(ts);
    }
  }

  function logoutOn401() {
    setToken("");
    panelSection.hidden = true;
    loginSection.hidden = false;
    showLoginError("Доступ запрещён. Проверьте токен.");
    location.hash = "";
  }

  async function adminFetch(path, opts = {}) {
    const token = getToken();
    const timeoutMs = opts.timeoutMs ?? FETCH_TIMEOUT_MS;
    const { timeoutMs: _drop, ...fetchOpts } = opts;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
      res = await fetch(path, {
        ...fetchOpts,
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
          ...(fetchOpts.headers || {}),
        },
      });
    } finally {
      clearTimeout(timer);
    }
    const data = await res.json().catch(() => ({}));
    // 401 только от нашей панели (BETA_ADMIN_TOKEN). 403 — от прокси FastAPI (ADMIN_UI_TOKEN).
    if (res.status === 401 && data?.error === "Доступ запрещён.") {
      logoutOn401();
      throw new Error("unauthorized");
    }
    return { res, data };
  }

  async function verifySession() {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch("/api/admin/session", {
        headers: { "X-Admin-Token": token },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 401) {
        setToken("");
        return false;
      }
      return res.ok;
    } catch {
      return false;
    }
  }

  function parseViewFromHash() {
    const raw = (location.hash || "").replace(/^#/, "").trim().toLowerCase();
    if (!raw || raw === "menu") return "menu";
    return VALID_VIEWS.has(raw) ? raw : "menu";
  }

  function setHashForView(view) {
    const next = view === "menu" ? "#menu" : `#${view}`;
    if (location.hash !== next) location.hash = next;
  }

  function showView(view) {
    if (!VALID_VIEWS.has(view)) view = "menu";
    currentView = view;
    for (const [key, el] of Object.entries(views)) {
      if (el) el.hidden = key !== view;
    }
    setHashForView(view);
    if (view === "banner") loadUpdateBanner();
    if (view === "ban") loadBans();
    if (view === "passwords") loadTesterPasswords();
  }

  function showPwdError(msg) {
    if (!pwdError) return;
    pwdError.textContent = msg || "";
    pwdError.style.display = msg ? "block" : "none";
  }

  function showPwdOk(msg) {
    if (!pwdMsg) return;
    pwdMsg.textContent = msg || "";
    pwdMsg.hidden = !msg;
  }

  async function loadTesterPasswords() {
    if (!pwdList) return;
    showPwdError("");
    showPwdOk("");
    pwdList.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "muted";
    loading.style.fontSize = "13px";
    loading.textContent = "Загрузка…";
    pwdList.appendChild(loading);

    try {
      const { res, data } = await adminFetch("/api/admin/tester-passwords");
      pwdList.innerHTML = "";
      if (!res.ok) {
        showPwdError(data.error || "Не удалось загрузить список.");
        return;
      }
      const list = data.passwords || [];
      if (!list.length) {
        const p = document.createElement("p");
        p.className = "muted";
        p.style.fontSize = "13px";
        p.textContent = "Паролей пока нет. Добавьте первый выше.";
        pwdList.appendChild(p);
        return;
      }
      for (const row of list) {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        el.innerHTML = `
          <div>
            <div class="admin-user-item__title">${escapeHtml(row.label || "Пароль")}</div>
            <div class="admin-user-item__meta">${escapeHtml(row.createdAt ? formatDate(row.createdAt) : "—")}</div>
          </div>
        `;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--ghost btn--danger-outline";
        btn.textContent = "Удалить";
        btn.addEventListener("click", () => deleteTesterPassword(row.id, row.label));
        el.appendChild(btn);
        pwdList.appendChild(el);
      }
    } catch (e) {
      pwdList.innerHTML = "";
      if (e.message !== "unauthorized") showPwdError("Сервер недоступен.");
    }
  }

  async function deleteTesterPassword(id, label) {
    if (!confirm(`Удалить пароль «${label || "без подписи"}»?`)) return;
    showPwdError("");
    try {
      const { res, data } = await adminFetch(`/api/admin/tester-passwords/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showPwdError(data.error || "Не удалось удалить.");
        return;
      }
      showPwdOk("Пароль удалён.");
      loadTesterPasswords();
    } catch (e) {
      if (e.message !== "unauthorized") showPwdError("Сервер недоступен.");
    }
  }

  async function addTesterPassword() {
    const password = (pwdValue?.value || "").trim();
    const label = (pwdLabel?.value || "").trim();
    if (!password) {
      showPwdError("Введите пароль.");
      return;
    }
    showPwdError("");
    showPwdOk("");
    if (pwdAddBtn) pwdAddBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/tester-passwords", {
        method: "POST",
        body: JSON.stringify({ label: label || null, password }),
      });
      if (!res.ok) {
        showPwdError(data.error || "Не удалось добавить.");
        return;
      }
      if (pwdValue) pwdValue.value = "";
      if (pwdLabel) pwdLabel.value = "";
      showPwdOk("Пароль добавлен.");
      loadTesterPasswords();
    } catch (e) {
      if (e.message !== "unauthorized") showPwdError("Сервер недоступен.");
    } finally {
      if (pwdAddBtn) pwdAddBtn.disabled = false;
    }
  }

  function showPanel() {
    loginSection.hidden = true;
    panelSection.hidden = false;
    showLoginError("");
    showView(parseViewFromHash());
  }

  function showBannerError(msg) {
    if (!bannerError) return;
    bannerError.textContent = msg || "";
    bannerError.style.display = msg ? "block" : "none";
  }

  function showBannerOk(msg) {
    if (!bannerMsg) return;
    bannerMsg.textContent = msg || "";
    bannerMsg.hidden = !msg;
  }

  function fillBannerForm(config) {
    const c = config || {};
    if (bannerEnabled) bannerEnabled.checked = Boolean(c.enabled);
    if (bannerMinVersion) bannerMinVersion.value = c.minVersion || "";
    if (bannerMessage) bannerMessage.value = c.message || "";
    if (bannerInstallUrl) bannerInstallUrl.value = c.installUrl || "";
  }

  async function loadUpdateBanner() {
    if (!getToken()) return;
    showBannerError("");
    showBannerOk("");
    try {
      const { res, data } = await adminFetch("/api/admin/update-banner");
      if (!res.ok) {
        showBannerError(data.error || "Не удалось загрузить.");
        return;
      }
      fillBannerForm(data.config);
    } catch (e) {
      if (e.message !== "unauthorized") showBannerError("Сервер недоступен.");
    }
  }

  async function saveUpdateBanner() {
    if (!getToken()) return;
    showBannerError("");
    showBannerOk("");
    const payload = {
      enabled: Boolean(bannerEnabled?.checked),
      minVersion: (bannerMinVersion?.value || "").trim(),
      message: (bannerMessage?.value || "").trim(),
      installUrl: (bannerInstallUrl?.value || "").trim(),
    };
    if (!payload.minVersion) {
      showBannerError("Укажите минимальную версию.");
      return;
    }
    if (bannerSaveBtn) bannerSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/update-banner", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        showBannerError(data.error || data.detail || "Не удалось сохранить.");
        return;
      }
      fillBannerForm(data.config);
      showBannerOk("Сохранено.");
    } catch (e) {
      if (e.message !== "unauthorized") showBannerError("Сервер недоступен.");
    } finally {
      if (bannerSaveBtn) bannerSaveBtn.disabled = false;
    }
  }

  function showBanError(msg) {
    if (!banError) return;
    banError.textContent = msg || "";
    banError.style.display = msg ? "block" : "none";
  }

  function showBanOk(msg) {
    if (!banMsg) return;
    banMsg.textContent = msg || "";
    banMsg.hidden = !msg;
  }

  function apiErrorMessage(data, fallback) {
    const d = data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && d[0]?.msg) return d[0].msg;
    return data?.error || fallback;
  }

  async function searchBanUsers() {
    const q = (banSearch?.value || "").trim();
    if (!banUsersBox || !banSearchStatus) return;
    banUsersBox.innerHTML = "";
    if (!q) {
      banSearchStatus.textContent = "Введите запрос.";
      return;
    }
    banSearchStatus.textContent = "Поиск…";
    showBanError("");
    try {
      const { res, data } = await adminFetch(
        `/api/admin/users/search?q=${encodeURIComponent(q)}`,
        { timeoutMs: BAN_FETCH_TIMEOUT_MS },
      );
      if (!res.ok) {
        banSearchStatus.textContent = "";
        showBanError(apiErrorMessage(data, "Ошибка поиска."));
        return;
      }
      const users = data.users || [];
      banSearchStatus.textContent = users.length ? `Найдено: ${users.length}` : "Никого не найдено.";
      for (const u of users) {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        const label = [u.email, u.login_username].filter(Boolean).join(" · ") || "—";
        el.innerHTML = `
          <div>
            <div><strong>tg:${escapeHtml(String(u.telegram_id))}</strong></div>
            <div class="admin-user-item__meta">${escapeHtml(label)}</div>
          </div>
        `;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--ghost btn--danger-outline";
        btn.textContent = "Забанить";
        btn.addEventListener("click", () => banUser({ telegram_id: u.telegram_id }));
        el.appendChild(btn);
        banUsersBox.appendChild(el);
      }
    } catch (e) {
      if (e.message !== "unauthorized") {
        banSearchStatus.textContent = "";
        showBanError("Сервер недоступен.");
      }
    }
  }

  async function banUser(payload) {
    const reason = (banReason?.value || "").trim() || null;
    const body = { ...payload, reason };
    if (body.telegram_id != null) {
      if (!confirm(`Забанить tg:${body.telegram_id}? Данные аккаунта будут удалены.`)) return;
    } else {
      const who = body.email || body.login || "";
      if (!confirm(`Забанить ${who}?`)) return;
    }
    showBanError("");
    showBanOk("");
    if (banSubmitBtn) banSubmitBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/users/ban", {
        method: "POST",
        body: JSON.stringify(body),
        timeoutMs: BAN_FETCH_TIMEOUT_MS,
      });
      if (!res.ok) {
        showBanError(apiErrorMessage(data, "Не удалось забанить."));
        return;
      }
      showBanOk(data.message || "Забанен.");
      if (banEmail) banEmail.value = "";
      if (banLogin) banLogin.value = "";
      if (banTgid) banTgid.value = "";
      if (banSearch?.value) searchBanUsers();
      loadBans();
    } catch (e) {
      if (e.message !== "unauthorized") showBanError("Сервер недоступен.");
    } finally {
      if (banSubmitBtn) banSubmitBtn.disabled = false;
    }
  }

  function submitBanFromFields() {
    const email = (banEmail?.value || "").trim().toLowerCase();
    const login = (banLogin?.value || "").trim().toLowerCase();
    const tgidRaw = (banTgid?.value || "").trim();
    let telegram_id = null;
    if (tgidRaw) {
      const n = Number(tgidRaw);
      if (!Number.isFinite(n)) {
        showBanError("Некорректный telegram_id.");
        return;
      }
      telegram_id = n;
    }
    if (!email && !login && telegram_id == null) {
      showBanError("Укажите email, login или telegram_id.");
      return;
    }
    const payload = {};
    if (telegram_id != null) payload.telegram_id = telegram_id;
    if (email) payload.email = email;
    if (login) payload.login = login;
    banUser(payload);
  }

  async function loadBans() {
    if (!banListBox) return;
    banListBox.innerHTML = "";
    try {
      const { res, data } = await adminFetch("/api/admin/bans?limit=200", {
        timeoutMs: BAN_FETCH_TIMEOUT_MS,
      });
      if (!res.ok) {
        showBanError(
          data.error ||
            apiErrorMessage(data, "Не удалось загрузить блок-лист. Проверьте ADMIN_UI_TOKEN в server/.env."),
        );
        return;
      }
      const bans = data.bans || [];
      if (!bans.length) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = "Блок-лист пуст.";
        banListBox.appendChild(p);
        return;
      }
      for (const b of bans) {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        el.innerHTML = `
          <div>
            <div><strong>${escapeHtml(b.kind)}: ${escapeHtml(b.value)}</strong>
              <span class="admin-ban-pill">${escapeHtml(formatTs(b.banned_ts))}</span></div>
            <div class="admin-user-item__meta">${b.reason ? escapeHtml(b.reason) : "—"}</div>
          </div>
        `;
        banListBox.appendChild(el);
      }
    } catch (e) {
      if (e.message !== "unauthorized") showBanError("Сервер недоступен.");
    }
  }

  loginBtn?.addEventListener("click", async () => {
    const token = (tokenInput?.value || "").trim();
    showLoginError("");
    if (!token) {
      showLoginError("Введите токен.");
      return;
    }
    setToken(token);
    loginBtn.disabled = true;
    try {
      const ok = await verifySession();
      if (!ok) {
        setToken("");
        showLoginError("Неверный токен или сервер недоступен.");
        return;
      }
      showPanel();
    } finally {
      loginBtn.disabled = false;
    }
  });

  logoutBtn?.addEventListener("click", () => {
    setToken("");
    panelSection.hidden = true;
    loginSection.hidden = false;
    location.hash = "";
  });

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      const view = el.getAttribute("data-nav");
      if (view) showView(view);
    });
  });

  window.addEventListener("hashchange", () => {
    if (panelSection.hidden) return;
    const v = parseViewFromHash();
    if (v !== currentView) showView(v);
  });

  banRefreshBtn?.addEventListener("click", () => {
    loadBans();
    if (banSearch?.value.trim()) searchBanUsers();
  });
  banSearchBtn?.addEventListener("click", () => searchBanUsers());
  banSearch?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBanUsers();
  });
  banSubmitBtn?.addEventListener("click", () => submitBanFromFields());
  bannerSaveBtn?.addEventListener("click", () => saveUpdateBanner());
  pwdAddBtn?.addEventListener("click", () => addTesterPassword());
  bannerEnabled?.addEventListener("change", () => {
    showBannerOk("");
    showBannerError("");
    if (bannerMsg) {
      bannerMsg.textContent = "Нажмите «Сохранить», чтобы применить.";
      bannerMsg.hidden = false;
      bannerMsg.classList.remove("is-error");
    }
  });

  (async function bootstrapSession() {
    if (!getToken()) return;
    const ok = await verifySession();
    if (ok) showPanel();
    else setToken("");
  })();
})();
