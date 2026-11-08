/* eslint-disable no-restricted-globals */
(() => {
  const TOKEN_KEY = "kisfit_tester_token";
  const LS_LAST_ID = "kisfit_last_dl_release_id";
  const LS_LAST_TITLE = "kisfit_last_dl_title";
  const LS_LAST_AT = "kisfit_last_dl_at";

  const gate = document.getElementById("tester-gate");
  const dash = document.getElementById("tester-dashboard");
  const gateErr = document.getElementById("tester-gate-error");
  const gateBtn = document.getElementById("tester-gate-submit");

  const dashLead = document.getElementById("tester-dash-lead");
  const statusBar = document.getElementById("tester-status-bar");

  const latestTitle = document.getElementById("tester-latest-title");
  const latestMeta = document.getElementById("tester-latest-meta");
  const latestDesc = document.getElementById("tester-latest-desc");
  const latestChangelog = document.getElementById("tester-latest-changelog-body");
  const latestDl = document.getElementById("tester-dl-latest");
  const dlHint = document.getElementById("tester-dl-hint");
  const dlStatus = document.getElementById("tester-dl-status");
  const dlStatusText = document.getElementById("tester-dl-status-text");
  const dlStatusFill = document.getElementById("tester-dl-status-fill");
  const coverWrap = document.getElementById("tester-latest-cover-wrap");
  const coverImg = document.getElementById("tester-latest-cover");

  const myPick = document.getElementById("tester-my-pick");
  const myText = document.getElementById("tester-my-text");
  const cmpBtn = document.getElementById("tester-compare-apply");
  const cmpResult = document.getElementById("tester-compare-result");

  const historyList = document.getElementById("tester-history-list");

  /** @type {{ releases: Array<Record<string, unknown>>, latestId: string | null }} */
  let state = { releases: [], latestId: null };
  let latestCoverBlobUrl = null;
  let gateLoginBusy = false;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  }

  function showGateError(msg) {
    if (!gateErr) return;
    gateErr.textContent = msg || "";
    gateErr.style.display = msg ? "block" : "none";
  }

  function revokeLatestCover() {
    if (latestCoverBlobUrl) {
      URL.revokeObjectURL(latestCoverBlobUrl);
      latestCoverBlobUrl = null;
    }
    if (coverImg) coverImg.removeAttribute("src");
    if (coverWrap) coverWrap.hidden = true;
  }

  function formatBytes(n) {
    const x = Number(n);
    if (!Number.isFinite(x) || x < 0) return "0 МБ";
    if (x < 1024) return `${Math.round(x)} Б`;
    if (x < 1024 * 1024) return `${(x / 1024).toFixed(1)} КБ`;
    return `${(x / (1024 * 1024)).toFixed(2)} МБ`;
  }

  function showDlStatus({ indeterminate = false, text = "", pct = 0 } = {}) {
    if (!dlStatus || !dlStatusText || !dlStatusFill) return;
    dlStatus.hidden = false;
    dlStatusText.textContent = text;
    dlStatus.classList.toggle("is-indeterminate", indeterminate);
    if (!indeterminate) dlStatusFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  function hideDlStatus() {
    if (!dlStatus || !dlStatusFill) return;
    dlStatus.hidden = true;
    dlStatus.classList.remove("is-indeterminate");
    dlStatusFill.style.width = "0%";
  }

  function formatSavedAt(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso || "";
      return d.toLocaleString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso || "";
    }
  }

  function refreshStatusBar() {
    if (!statusBar) return;
    const latest = state.releases[0];
    const lastId = localStorage.getItem(LS_LAST_ID) || "";
    const lastTitle = localStorage.getItem(LS_LAST_TITLE) || "";
    const lastAt = localStorage.getItem(LS_LAST_AT) || "";

    const chips = [];
    if (latest) {
      const upToDate = lastId && lastId === latest.id;
      chips.push(
        `<span class="tester-chip ${upToDate ? "tester-chip--ok" : "tester-chip--soft"}">Сайт: «${escapeHtml(latest.title)}» · ${escapeHtml(latest.versionDate || "")}</span>`,
      );
    }

    if (lastId && lastTitle) {
      const sameAsSite = latest && lastId === latest.id;
      chips.push(
        `<span class="tester-chip ${sameAsSite ? "tester-chip--ok" : "tester-chip--muted"}">Скачано с браузера: «${escapeHtml(lastTitle)}»${lastAt ? ` · ${escapeHtml(formatSavedAt(lastAt))}` : ""}</span>`,
      );
    }

    if (!chips.length) {
      statusBar.innerHTML =
        '<span class="tester-chip tester-chip--soft">Скачайте сборку — сайт запомнит последний файл в этом браузере для подсказок.</span>';
      return;
    }

    statusBar.innerHTML = chips.join("");
  }

  function releaseIndex(id) {
    return state.releases.findIndex((r) => r.id === id);
  }

  function releasesFetchRetryable(status) {
    return status === 0 || status === 408 || status === 502 || status === 503 || status === 504;
  }

  async function fetchReleases() {
    const maxAttempts = 3;
    let last = /** @type {{ ok: boolean, data: Record<string, unknown>, status: number }} */ ({
      ok: false,
      data: {},
      status: 0,
    });
    const headers = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const res = await fetch("/api/tester/releases", { headers });
        const data = await res.json().catch(() => ({}));
        const ok = res.ok && data.ok === true && Array.isArray(data.releases);
        last = { ok, data, status: res.status };
        if (ok || res.status === 401 || !releasesFetchRetryable(res.status)) {
          return last;
        }
      } catch {
        last = { ok: false, data: {}, status: 0 };
      }

      if (last.ok || !releasesFetchRetryable(last.status)) return last;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 320 * attempt));
      }
    }
    return last;
  }

  /**
   * Скачивание через XHR: браузерный индикатор загрузок часто не двигается, пока
   * fetch не собрал весь blob — здесь сразу показываем статус и onprogress по байтам.
   * @param {string} url
   * @param {(ev: { phase: string, loaded?: number, total?: number, pct?: number }) => void} [onProgress]
   */
  function xhrBlobDownload(url, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      const token = getToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.responseType = "blob";

      xhr.onloadstart = () => {
        onProgress?.({ phase: "start" });
      };

      xhr.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) {
          onProgress?.({
            phase: "progress",
            loaded: e.loaded,
            total: e.total,
            pct: (e.loaded / e.total) * 100,
          });
        } else {
          onProgress?.({ phase: "indeterminate", loaded: e.loaded });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 401) {
          reject({ type: "auth" });
          return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
          reject({ type: "http", blob: xhr.response });
          return;
        }
        resolve(xhr.response);
      };

      xhr.onerror = () => reject({ type: "network" });
      xhr.send();
    });
  }

  async function parseErrorBlob(blob) {
    try {
      const t = await blob.text();
      const j = JSON.parse(t);
      return (j && j.error) || t.slice(0, 200);
    } catch {
      return "Не удалось скачать файл.";
    }
  }

  async function downloadRelease(releaseId, apkDownloadName) {
    const q =
      releaseId && typeof releaseId === "string"
        ? `?releaseId=${encodeURIComponent(releaseId)}`
        : "";
    const url = `/api/tester/download${q}`;

    const setBusy = (v) => {
      if (latestDl) latestDl.disabled = v;
      document.querySelectorAll(".tester-dl-old").forEach((btn) => {
        btn.disabled = v;
      });
    };

    setBusy(true);
    if (dlHint) dlHint.textContent = "";

    showDlStatus({
      indeterminate: true,
      text: "Скачивание началось: получаем файл с сервера…",
    });

    const onProgress = (ev) => {
      if (ev.phase === "progress" && typeof ev.pct === "number" && ev.total != null) {
        showDlStatus({
          indeterminate: false,
          text: `Скачивание… ${Math.round(ev.pct)}% (${formatBytes(ev.loaded)} из ${formatBytes(ev.total)})`,
          pct: ev.pct,
        });
      } else if (ev.phase === "indeterminate") {
        showDlStatus({
          indeterminate: true,
          text:
            ev.loaded && ev.loaded > 0
              ? `Скачивание… ${formatBytes(ev.loaded)} (размер неизвестен)`
              : "Скачивание началось: получаем файл с сервера…",
        });
      }
    };

    try {
      const blob = await xhrBlobDownload(url, onProgress);

      showDlStatus({
        indeterminate: false,
        text: "Файл получен — браузер сохраняет APK…",
        pct: 100,
      });

      const objectUrl = URL.createObjectURL(blob);
      const nm = apkDownloadName || state.releases[0]?.apkDownloadName || "КИСФИТ.apk";
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = nm;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      requestAnimationFrame(() => URL.revokeObjectURL(objectUrl));

      const resolvedId =
        (releaseId && String(releaseId)) || (state.releases[0] && state.releases[0].id) || "";
      const row =
        resolvedId &&
        typeof resolvedId === "string" &&
        state.releases.find((r) => r.id === resolvedId);

      localStorage.setItem(LS_LAST_ID, resolvedId);
      localStorage.setItem(LS_LAST_TITLE, row && row.title ? String(row.title) : nm);
      localStorage.setItem(LS_LAST_AT, new Date().toISOString());
      refreshStatusBar();

      if (dlHint && !releaseId)
        dlHint.textContent =
          "Если браузер не предложил открыть файл, проверьте папку «Загрузки» или панель уведомлений.";

      showDlStatus({
        indeterminate: false,
        text: "Готово. Проверьте панель загрузок или папку «Загрузки».",
        pct: 100,
      });
      window.setTimeout(() => hideDlStatus(), 4500);
    } catch (err) {
      hideDlStatus();
      if (err && err.type === "auth") {
        alert("Не удалось скачать файл. Обновите страницу и попробуйте ещё раз.");
        return;
      }
      if (err && err.type === "http" && err.blob) {
        alert(await parseErrorBlob(err.blob));
        return;
      }
      if (err && err.type === "network") {
        alert("Ошибка сети при скачивании.");
        return;
      }
      alert("Ошибка при скачивании.");
    } finally {
      setBusy(false);
    }
  }

  async function loadLatestCover(latest) {
    revokeLatestCover();
    if (!latest || !latest.hasCover || !coverImg) return;

    try {
      const headers = {};
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`/api/tester/cover?releaseId=${encodeURIComponent(latest.id)}`, {
        headers,
      });
      if (!res.ok) return;
      const blob = await res.blob();
      latestCoverBlobUrl = URL.createObjectURL(blob);
      coverImg.alt = latest.title ? `Обложка: ${latest.title}` : "Обложка версии";
      coverImg.src = latestCoverBlobUrl;
      if (coverWrap) coverWrap.hidden = false;
    } catch {
      /* ignore */
    }
  }

  function fillMyPickSelect() {
    if (!myPick) return;
    myPick.innerHTML = '<option value="">Выберите…</option>';
    for (const r of state.releases) {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = `${r.title} · ${r.versionDate}`;
      myPick.appendChild(opt);
    }
    const ghost = document.createElement("option");
    ghost.value = "__custom";
    ghost.textContent = "Только свой текст версии ниже…";
    myPick.appendChild(ghost);
  }

  function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "";
    const older = state.releases.slice(1);
    if (!older.length) {
      historyList.innerHTML =
        '<p class="muted" style="margin:0">На сервере пока только одна опубликованная сборка.</p>';
      return;
    }

    for (const r of older) {
      const art = document.createElement("article");
      art.className = "tester-history-card";

      const main = document.createElement("div");
      main.className = "tester-history-card__main";

      const left = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.className = "h3 tester-history-card__title";
      h3.textContent = r.title || "Сборка";
      const p = document.createElement("p");
      p.className = "muted tester-history-card__sub";
      p.textContent = `${r.versionDate || ""} · ${r.apkDownloadName || "КИСФИТ.apk"}`;
      left.appendChild(h3);
      left.appendChild(p);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--ghost tester-dl-old";
      btn.dataset.id = r.id;
      btn.dataset.name = r.apkDownloadName || "КИСФИТ.apk";
      btn.textContent = "Скачать";

      main.appendChild(left);
      main.appendChild(btn);

      const details = document.createElement("details");
      details.className = "tester-history-details";

      const sum = document.createElement("summary");
      sum.textContent = "Что изменилось";
      const pre = document.createElement("pre");
      pre.className = "tester-history-details__changelog";
      pre.textContent = r.changelog || "—";

      details.appendChild(sum);
      details.appendChild(pre);

      art.appendChild(main);
      art.appendChild(details);
      historyList.appendChild(art);
    }
  }

  function bindHistoryDownloads() {
    historyList?.addEventListener("click", (e) => {
      const b = e.target && e.target.closest ? e.target.closest(".tester-dl-old") : null;
      if (!b || b.disabled) return;
      const id = b.dataset.id;
      const name = b.dataset.name;
      downloadRelease(id, name);
    });
  }

  function applyCompare() {
    if (!cmpResult) return;

    const latest = state.releases[0];
    if (!latest) {
      cmpResult.textContent = "Нет данных о сборках.";
      return;
    }

    let msg = "";

    const pick = (myPick && myPick.value) || "";
    const textRaw = ((myText && myText.value) || "").trim();

    if (pick && pick !== "__custom") {
      const idx = releaseIndex(pick);
      const latestIdx = 0;

      if (idx === latestIdx)
        msg =
          "Вы выбрали ту же сборку, что считается последней на этом сайте. Если она уже установлена на телефоне как текущее приложение — у вас актуальная ветка. Убедитесь в названии версии в «О приложении».";
      else if (idx > 0)
        msg =
          "По вашему выбору у вас более старая публикация, чем последняя на сайте — доступно обновление: скачайте сборку сверху.";
      else msg = "Не удалось сопоставить выбранную запись.";
    } else if (textRaw) {
      const nt = normalize(textRaw);
      let hit = null;
      for (const r of state.releases) {
        const t = normalize(r.title);
        const f = normalize(r.apkDownloadName || "");
        if (
          nt &&
          (t.includes(nt) || nt.includes(t) || (f && (f.includes(nt) || nt.includes(f))))
        ) {
          hit = r;
          break;
        }
      }

      if (hit) {
        if (hit.id === latest.id)
          msg = "Текст похож на последнюю публикацию на сайте — сравните с тем, что в приложении в «О приложении».";
        else {
          const ord = releaseIndex(hit.id);
          msg =
            ord > 0
              ? "Текст похож на более старую публикацию, чем сверху — возможно стоит поставить новую сборку."
              : "Найдено совпадение с новой сборкой на сайте.";
        }
      } else {
        msg =
          "Не удалось надёжно сопоставить введённый текст с нашими публикациями. Выберите вариант из списка или проверьте написание — сайт всё равно не знает установленную на устройстве версию автоматически.";
      }
    } else {
      msg =
        "Выберите сборку из списка или введите свой текст версии, затем снова нажмите «Обновить статус».";
    }

    cmpResult.textContent = msg;
  }

  async function loadDashboard() {
    revokeLatestCover();
    const fr = await fetchReleases();
    function retreat(msg) {
      if (gate) gate.hidden = false;
      if (dash) dash.hidden = true;
      if (typeof msg === "string" && msg) showGateError(msg);
      return false;
    }

    if (!fr.ok) {
      const fallback =
        fr.status === 0
          ? "Нет связи с сервером. Убедитесь, что страница открыта через сайт, а не как файл с диска."
          : (fr.data && fr.data.error) || "Не удалось загрузить сборки.";
      return retreat(fallback);
    }

    state = {
      releases: fr.data.releases || [],
      latestId:
        fr.data.latestId ||
        (fr.data.releases && fr.data.releases[0] ? fr.data.releases[0].id : null),
    };

    if (!state.releases.length) {
      return retreat("На сервере пока нет доступных сборок.");
    }

    showGateError("");

    if (gate) gate.hidden = true;
    if (dash) dash.hidden = false;

    const latest = state.releases[0];
    const n = state.releases.length;

    if (dashLead)
      dashLead.textContent =
        "Пароль не нужен. Последняя публикация — первая в списке. Всего доступно сборок: " + String(n);

    if (latestTitle) latestTitle.textContent = latest.title || "Сборка";
    if (latestMeta)
      latestMeta.textContent = [latest.versionDate, latest.apkDownloadName].filter(Boolean).join(" · ");
    const d = typeof latest.description === "string" ? latest.description.trim() : "";
    if (latestDesc) {
      latestDesc.textContent = d;
      latestDesc.hidden = !d;
    }
    if (latestChangelog) latestChangelog.textContent = latest.changelog || "—";

    refreshStatusBar();
    fillMyPickSelect();
    renderHistory();

    if (cmpResult) cmpResult.textContent = "";

    loadLatestCover(latest);
    return true;
  }

  async function tryBootstrap() {
    showGateError("");
    const ok = await loadDashboard();
    if (ok) return;
    if (gate) gate.hidden = false;
    if (dash) dash.hidden = true;
    revokeLatestCover();
  }

  gateBtn?.addEventListener("click", async () => {
    if (gateLoginBusy) return;
    gateLoginBusy = true;
    gateBtn.disabled = true;
    try {
      await tryBootstrap();
    } finally {
      gateBtn.disabled = false;
      gateLoginBusy = false;
    }
  });

  latestDl?.addEventListener("click", () => downloadRelease(null, state.releases[0]?.apkDownloadName));

  cmpBtn?.addEventListener("click", applyCompare);

  bindHistoryDownloads();
  tryBootstrap();

  window.addEventListener("pageshow", (ev) => {
    if (ev.persisted) void tryBootstrap();
  });
})();
