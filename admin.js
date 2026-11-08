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
  const logoutBtn = document.getElementById("admin-logout");

  const views = {
    menu: document.getElementById("admin-view-menu"),
    ban: document.getElementById("admin-view-ban"),
    banner: document.getElementById("admin-view-banner"),
    releases: document.getElementById("admin-view-releases"),
    beta: document.getElementById("admin-view-beta"),
    support: document.getElementById("admin-view-support"),
    accountdeletion: document.getElementById("admin-view-accountdeletion"),
    passwords: document.getElementById("admin-view-passwords"),
    push: document.getElementById("admin-view-push"),
    programs: document.getElementById("admin-view-programs"),
    events: document.getElementById("admin-view-events"),
    merch: document.getElementById("admin-view-merch"),
    xpshop: document.getElementById("admin-view-xpshop"),
    registration: document.getElementById("admin-view-registration"),
    homeads: document.getElementById("admin-view-homeads"),
    mapads: document.getElementById("admin-view-mapads"),
    usersstats: document.getElementById("admin-view-usersstats"),
    uniquechars: document.getElementById("admin-view-uniquechars"),
  };

  const statusEl = document.getElementById("admin-status");
  const tbody = document.getElementById("admin-tbody");
  const betaRefreshBtn = document.getElementById("admin-beta-refresh");

  const supportStatusEl = document.getElementById("admin-support-status");
  const supportTbody = document.getElementById("admin-support-tbody");
  const supportRefreshBtn = document.getElementById("admin-support-refresh");

  const accountDeletionStatusEl = document.getElementById("admin-accountdeletion-status");
  const accountDeletionTbody = document.getElementById("admin-accountdeletion-tbody");
  const accountDeletionRefreshBtn = document.getElementById("admin-accountdeletion-refresh");

  const releasesTbody = document.getElementById("admin-releases-tbody");
  const releasesStatus = document.getElementById("admin-releases-status");
  const releaseForm = document.getElementById("admin-release-form");
  const relTitle = document.getElementById("admin-rel-title");
  const relDesc = document.getElementById("admin-rel-desc");
  const relChangelog = document.getElementById("admin-rel-changelog");
  const relApk = document.getElementById("admin-rel-apk");
  const relCover = document.getElementById("admin-rel-cover");
  const relSubmit = document.getElementById("admin-release-submit");
  const releaseError = document.getElementById("admin-release-error");
  const releaseMsg = document.getElementById("admin-release-msg");
  const uploadProgressWrap = document.getElementById("admin-release-progress");
  const uploadProgressFill = document.getElementById("admin-release-progress__fill");
  const uploadStatusEl = document.getElementById("admin-release-upload-status");

  const bannerEnabled = document.getElementById("admin-banner-enabled");
  const bannerMinVersion = document.getElementById("admin-banner-min-version");
  const bannerMessage = document.getElementById("admin-banner-message");
  const bannerInstallUrl = document.getElementById("admin-banner-install-url");
  const bannerSaveBtn = document.getElementById("admin-banner-save");
  const bannerMsg = document.getElementById("admin-banner-msg");
  const bannerError = document.getElementById("admin-banner-error");

  const homeAdsList = document.getElementById("admin-homeads-list");
  const homeAdsEditId = document.getElementById("admin-homeads-edit-id");
  const homeAdsEnabled = document.getElementById("admin-homeads-enabled");
  const homeAdsName = document.getElementById("admin-homeads-name");
  const homeAdsPlacement = document.getElementById("admin-homeads-placement");
  const homeAdsUrl = document.getElementById("admin-homeads-url");
  const homeAdsImage = document.getElementById("admin-homeads-image");
  const homeAdsImageFilename = document.getElementById("admin-homeads-image-filename");
  const homeAdsImagePreview = document.getElementById("admin-homeads-image-preview");
  const homeAdsMsg = document.getElementById("admin-homeads-msg");
  const homeAdsError = document.getElementById("admin-homeads-error");
  const homeAdsSaveBtn = document.getElementById("admin-homeads-save");
  const homeAdsResetFormBtn = document.getElementById("admin-homeads-reset-form");

  let homeAdsDraft = [];

  const mapAdsList = document.getElementById("admin-mapads-list");
  const mapAdsEditId = document.getElementById("admin-mapads-edit-id");
  const mapAdsEnabled = document.getElementById("admin-mapads-enabled");
  const mapAdsName = document.getElementById("admin-mapads-name");
  const mapAdsDescription = document.getElementById("admin-mapads-description");
  const mapAdsPlaceTerritory = document.getElementById("admin-mapads-place-territory");
  const mapAdsPlaceCapture = document.getElementById("admin-mapads-place-capture");
  const mapAdsPlaceTraining = document.getElementById("admin-mapads-place-training");
  const mapAdsUrl = document.getElementById("admin-mapads-url");
  const mapAdsLat = document.getElementById("admin-mapads-lat");
  const mapAdsLng = document.getElementById("admin-mapads-lng");
  const mapAdsImage = document.getElementById("admin-mapads-image");
  const mapAdsImageFilename = document.getElementById("admin-mapads-image-filename");
  const mapAdsImagePreview = document.getElementById("admin-mapads-image-preview");
  const mapAdsMsg = document.getElementById("admin-mapads-msg");
  const mapAdsError = document.getElementById("admin-mapads-error");
  const mapAdsSaveBtn = document.getElementById("admin-mapads-save");
  const mapAdsResetFormBtn = document.getElementById("admin-mapads-reset-form");

  let mapAdsDraft = [];
  let mapAdsMap = null;
  let mapAdsMarker = null;
  let mapAdsLeafletLoading = null;
  let mapAdsLocalPreviewUrl = null;

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

  const usersStatsTotal = document.getElementById("admin-usersstats-total");
  const usersStatsParticipants = document.getElementById("admin-usersstats-participants");
  const usersStatsActivePeriod = document.getElementById("admin-usersstats-active-period");
  const usersStatsWeekly = document.getElementById("admin-usersstats-weekly");
  const usersStatsWeeklyPeriod = document.getElementById("admin-usersstats-weekly-period");
  const usersStatsToday = document.getElementById("admin-usersstats-today");
  const usersStatsTodayUsers = document.getElementById("admin-usersstats-today-users");
  const usersStatsDaysSelect = document.getElementById("admin-usersstats-days");
  const usersStatsDailyTbody = document.getElementById("admin-usersstats-daily-tbody");
  const usersStatsParticipantsTbody = document.getElementById("admin-usersstats-participants-tbody");
  const usersStatsLogTbody = document.getElementById("admin-usersstats-log-tbody");
  const usersStatsStatus = document.getElementById("admin-usersstats-status");
  const usersStatsError = document.getElementById("admin-usersstats-error");
  const usersStatsRefreshBtn = document.getElementById("admin-usersstats-refresh");
  const usersStatsExportFullBtn = document.getElementById("admin-usersstats-export-full");
  const usersStatsExportRosmolBtn = document.getElementById("admin-usersstats-export-rosmol");

  const pwdLabel = document.getElementById("admin-pwd-label");
  const pwdValue = document.getElementById("admin-pwd-value");
  const pwdAddBtn = document.getElementById("admin-pwd-add");
  const pwdList = document.getElementById("admin-pwd-list");
  const pwdMsg = document.getElementById("admin-pwd-msg");
  const pwdError = document.getElementById("admin-pwd-error");

  const pushTitle = document.getElementById("admin-push-title");
  const pushMessage = document.getElementById("admin-push-message");
  const pushSendAllBtn = document.getElementById("admin-push-send-all");
  const pushSendSegmentBtn = document.getElementById("admin-push-send-streak-not-extended");
  const pushMsg = document.getElementById("admin-push-msg");
  const pushError = document.getElementById("admin-push-error");

  const progList = document.getElementById("admin-prog-list");
  const progCurId = document.getElementById("admin-prog-cur-id");
  const progId = document.getElementById("admin-prog-id");
  const progStatus = document.getElementById("admin-prog-status");
  const progAthlete = document.getElementById("admin-prog-athlete");
  const progTitle = document.getElementById("admin-prog-title");
  const progDesc = document.getElementById("admin-prog-desc");
  const progWeeks = document.getElementById("admin-prog-weeks");
  const progParticipants = document.getElementById("admin-prog-participants");
  const progOldPrice = document.getElementById("admin-prog-old-price");
  const progXp = document.getElementById("admin-prog-xp");
  const progRating = document.getElementById("admin-prog-rating");
  const progSort = document.getElementById("admin-prog-sort");
  const progPurchasable = document.getElementById("admin-prog-purchasable");
  const progCover = document.getElementById("admin-prog-cover");
  const progCoverFile = document.getElementById("admin-prog-cover-file");
  const progPdf = document.getElementById("admin-prog-pdf");
  const progPdfFile = document.getElementById("admin-prog-pdf-file");
  const progMsg = document.getElementById("admin-prog-msg");
  const progError = document.getElementById("admin-prog-error");
  const progRefreshBtn = document.getElementById("admin-prog-refresh");
  const progNewBtn = document.getElementById("admin-prog-new");
  const progSaveBtn = document.getElementById("admin-prog-save");
  const progDeleteBtn = document.getElementById("admin-prog-delete");
  const progUploadCoverBtn = document.getElementById("admin-prog-upload-cover");
  const progUploadPdfBtn = document.getElementById("admin-prog-upload-pdf");

  const xpShopTbody = document.getElementById("admin-xpshop-tbody");
  const xpShopGlobalEnabled = document.getElementById("admin-xpshop-global-enabled");
  const xpShopProgramsEnabled = document.getElementById("admin-xpshop-programs-enabled");
  const xpShopRefreshBtn = document.getElementById("admin-xpshop-refresh");
  const xpShopSaveBtn = document.getElementById("admin-xpshop-save");
  const xpShopMsg = document.getElementById("admin-xpshop-msg");
  const xpShopError = document.getElementById("admin-xpshop-error");

  const registrationEmailRequired = document.getElementById("admin-registration-email-required");
  const registrationPostboxStatus = document.getElementById("admin-registration-postbox-status");
  const registrationRefreshBtn = document.getElementById("admin-registration-refresh");
  const registrationSaveBtn = document.getElementById("admin-registration-save");
  const registrationMsg = document.getElementById("admin-registration-msg");
  const registrationError = document.getElementById("admin-registration-error");

  let xpShopDraft = {
    global_purchases_enabled: false,
    programs_purchasable: false,
    items: [],
  };

  const ucList = document.getElementById("admin-uc-list");
  const ucCurId = document.getElementById("admin-uc-cur-id");
  const ucId = document.getElementById("admin-uc-id");
  const ucName = document.getElementById("admin-uc-name");
  const ucRarity = document.getElementById("admin-uc-rarity");
  const ucImage = document.getElementById("admin-uc-image");
  const ucImageFile = document.getElementById("admin-uc-image-file");
  const ucImagePreview = document.getElementById("admin-uc-image-preview");
  const ucMsg = document.getElementById("admin-uc-msg");
  const ucError = document.getElementById("admin-uc-error");
  const ucRefreshBtn = document.getElementById("admin-uc-refresh");
  const ucNewBtn = document.getElementById("admin-uc-new");
  const ucSaveBtn = document.getElementById("admin-uc-save");
  const ucUploadImageBtn = document.getElementById("admin-uc-upload-image");
  const ucGrantSearch = document.getElementById("admin-uc-grant-search");
  const ucGrantSearchBtn = document.getElementById("admin-uc-grant-search-btn");
  const ucGrantSearchStatus = document.getElementById("admin-uc-grant-search-status");
  const ucGrantUsers = document.getElementById("admin-uc-grant-users");
  const ucGrantTarget = document.getElementById("admin-uc-grant-target");
  const ucGrantTid = document.getElementById("admin-uc-grant-tid");
  const ucGrantCid = document.getElementById("admin-uc-grant-cid");
  const ucGrantBtn = document.getElementById("admin-uc-grant-btn");
  const ucGrantMsg = document.getElementById("admin-uc-grant-msg");
  const ucGrantError = document.getElementById("admin-uc-grant-error");

  const evtList = document.getElementById("admin-evt-list");
  const evtCurId = document.getElementById("admin-evt-cur-id");
  const evtId = document.getElementById("admin-evt-id");
  const evtStatus = document.getElementById("admin-evt-status");
  const evtTitle = document.getElementById("admin-evt-title");
  const evtSubtitle = document.getElementById("admin-evt-subtitle");
  const evtDesc = document.getElementById("admin-evt-desc");
  const evtAnn = document.getElementById("admin-evt-ann");
  const evtStart = document.getElementById("admin-evt-start");
  const evtEnd = document.getElementById("admin-evt-end");
  const evtBanner = document.getElementById("admin-evt-banner");
  const evtBannerFile = document.getElementById("admin-evt-banner-file");
  const evtDetailBanner = document.getElementById("admin-evt-detail-banner");
  const evtDetailBannerFile = document.getElementById("admin-evt-detail-banner-file");
  const evtBg = document.getElementById("admin-evt-bg");
  const evtLink = document.getElementById("admin-evt-link");
  const evtLbEn = document.getElementById("admin-evt-lb-en");
  const evtLbMetric = document.getElementById("admin-evt-lb-metric");
  const evtLbAgg = document.getElementById("admin-evt-lb-agg");
  const evtRules = document.getElementById("admin-evt-rules");
  const evtMsg = document.getElementById("admin-evt-msg");
  const evtError = document.getElementById("admin-evt-error");
  const evtRefreshBtn = document.getElementById("admin-evt-refresh");
  const evtNewBtn = document.getElementById("admin-evt-new");
  const evtSaveBtn = document.getElementById("admin-evt-save");
  const evtUploadBannerBtn = document.getElementById("admin-evt-upload-banner");
  const evtUploadDetailBannerBtn = document.getElementById("admin-evt-upload-detail-banner");
  const evtTasksList = document.getElementById("admin-evt-tasks-list");
  const evtTaskId = document.getElementById("admin-evt-task-id");
  const evtTaskTitle = document.getElementById("admin-evt-task-title");
  const evtTaskMetric = document.getElementById("admin-evt-task-metric");
  const evtTaskAgg = document.getElementById("admin-evt-task-agg");
  const evtTaskTarget = document.getElementById("admin-evt-task-target");
  const evtTaskSort = document.getElementById("admin-evt-task-sort");
  const evtTaskVisible = document.getElementById("admin-evt-task-visible");
  const evtTaskSaveBtn = document.getElementById("admin-evt-task-save");
  const evtTaskResetBtn = document.getElementById("admin-evt-task-reset");
  const evtRewardsList = document.getElementById("admin-evt-rewards-list");
  const evtRewardId = document.getElementById("admin-evt-reward-id");
  const evtRewardTitle = document.getElementById("admin-evt-reward-title");
  const evtRewardType = document.getElementById("admin-evt-reward-type");
  const evtRewardXp = document.getElementById("admin-evt-reward-xp");
  const evtRewardKey = document.getElementById("admin-evt-reward-key");
  const evtRewardPlaceFrom = document.getElementById("admin-evt-reward-place-from");
  const evtRewardPlaceTo = document.getElementById("admin-evt-reward-place-to");
  const evtRewardImage = document.getElementById("admin-evt-reward-image");
  const evtRewardImageFile = document.getElementById("admin-evt-reward-image-file");
  const evtRewardDesc = document.getElementById("admin-evt-reward-desc");
  const evtRewardBadge = document.getElementById("admin-evt-reward-badge");
  const evtRewardRarity = document.getElementById("admin-evt-reward-rarity");
  const evtRewardSaveBtn = document.getElementById("admin-evt-reward-save");
  const evtRewardResetBtn = document.getElementById("admin-evt-reward-reset");
  const evtUploadRewardBtn = document.getElementById("admin-evt-upload-reward");
  const evtResultsMeta = document.getElementById("admin-evt-results-meta");
  const evtResultsTbody = document.getElementById("admin-evt-results-tbody");
  const evtResultsRefreshBtn = document.getElementById("admin-evt-results-refresh");
  const evtParticipantsXlsxBtn = document.getElementById("admin-evt-participants-xlsx");
  const evtFinalizeBtn = document.getElementById("admin-evt-finalize");
  const evtFormat = document.getElementById("admin-evt-format");
  const evtAccess = document.getElementById("admin-evt-access");
  const evtAccessHint = document.getElementById("admin-evt-access-hint");
  const evtVisibility = document.getElementById("admin-evt-visibility");
  const evtCodesCard = document.getElementById("admin-evt-codes-card");
  const evtCodesMeta = document.getElementById("admin-evt-codes-meta");
  const evtCodesTbody = document.getElementById("admin-evt-codes-tbody");
  const evtCodesError = document.getElementById("admin-evt-codes-error");
  const evtCodesMsg = document.getElementById("admin-evt-codes-msg");
  const evtCodesCount = document.getElementById("admin-evt-codes-count");
  const evtCodesPrefix = document.getElementById("admin-evt-codes-prefix");
  const evtCodesManual = document.getElementById("admin-evt-codes-manual");
  const evtCodesUses = document.getElementById("admin-evt-codes-uses");
  const evtCodesUsesCustom = document.getElementById("admin-evt-codes-uses-custom");
  const evtCodesLabel = document.getElementById("admin-evt-codes-label");
  const evtCodesExpires = document.getElementById("admin-evt-codes-expires");
  const evtCodesSearch = document.getElementById("admin-evt-codes-search");
  const evtCodesFilter = document.getElementById("admin-evt-codes-filter");
  const evtCodeUsers = document.getElementById("admin-evt-code-users");
  const evtTeamWrap = document.getElementById("admin-evt-team-wrap");
  const evtTeamMax = document.getElementById("admin-evt-team-max");
  const evtTeamMin = document.getElementById("admin-evt-team-min");
  const evtTeamBy = document.getElementById("admin-evt-team-by");
  const evtTeamLock = document.getElementById("admin-evt-team-lock");
  const evtDistWrap = document.getElementById("admin-evt-dist-wrap");
  const evtDist = document.getElementById("admin-evt-dist");
  const evtTeamsCard = document.getElementById("admin-evt-teams-card");
  const evtTeamsMeta = document.getElementById("admin-evt-teams-meta");
  const evtTeamsTbody = document.getElementById("admin-evt-teams-tbody");
  const evtTeamsRefreshBtn = document.getElementById("admin-evt-teams-refresh");
  const evtTeamsError = document.getElementById("admin-evt-teams-error");
  const evtTeamName = document.getElementById("admin-evt-team-name");
  const evtTeamColor = document.getElementById("admin-evt-team-color");
  const evtTeamCreateBtn = document.getElementById("admin-evt-team-create");

  const merchTbody = document.getElementById("admin-merch-tbody");
  const merchStatus = document.getElementById("admin-merch-status");
  const merchFilter = document.getElementById("admin-merch-filter");
  const merchRefreshBtn = document.getElementById("admin-merch-refresh");
  const merchManualTgid = document.getElementById("admin-merch-manual-tgid");
  const merchManualItem = document.getElementById("admin-merch-manual-item");
  const merchManualPhone = document.getElementById("admin-merch-manual-phone");
  const merchManualAddress = document.getElementById("admin-merch-manual-address");
  const merchManualNote = document.getElementById("admin-merch-manual-note");
  const merchManualSubmit = document.getElementById("admin-merch-manual-submit");
  const merchMsg = document.getElementById("admin-merch-msg");
  const merchError = document.getElementById("admin-merch-error");
  const merchDetailModal = document.getElementById("admin-merch-detail-modal");
  const merchDetailBody = document.getElementById("admin-merch-detail-body");

  let merchCatalog = [];
  let selectedProgramId = null;
  let selectedUniqueCharId = null;
  let selectedEventId = null;
  let eventTasksCache = [];
  let eventRewardsCache = [];
  let lastRewardImageFilename = "";
  let releaseBusy = false;
  let currentView = "menu";
  const VALID_VIEWS = new Set(["menu", "ban", "banner", "homeads", "mapads", "releases", "beta", "support", "accountdeletion", "passwords", "registration", "push", "programs", "events", "uniquechars", "merch", "xpshop", "usersstats"]);
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
    showLoginError("Доступ запрещён. Проверьте токен и попробуйте снова.");
    if (tbody) tbody.innerHTML = "";
    if (statusEl) statusEl.textContent = "";
    if (releasesTbody) releasesTbody.innerHTML = "";
    if (releasesStatus) releasesStatus.textContent = "";
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
    if (res.status === 401) {
      logoutOn401();
      throw new Error("unauthorized");
    }
    return { res, data };
  }

  async function adminDownload(path, fallbackFilename) {
    const token = getToken();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(path, {
        signal: ctrl.signal,
        headers: { "X-Admin-Token": token },
      });
    } finally {
      clearTimeout(timer);
    }
    if (res.status === 401) {
      logoutOn401();
      throw new Error("unauthorized");
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || err.error || "Не удалось скачать файл");
    }
    const blob = await res.blob();
    const cd = res.headers.get("content-disposition") || "";
    const match = /filename=\"?([^\";]+)\"?/i.exec(cd);
    const filename = match?.[1] || fallbackFilename;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function getUsersStatsDays() {
    const raw = Number(usersStatsDaysSelect?.value || 90);
    if (!Number.isFinite(raw)) return 90;
    return Math.max(7, Math.min(365, raw));
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
    if (view !== "menu") setHashForView(view);
    else setHashForView("menu");

    if (view === "beta") loadList();
    if (view === "support") loadSupportList();
    if (view === "accountdeletion") loadAccountDeletionList();
    if (view === "releases") loadReleases();
    if (view === "banner") loadUpdateBanner();
    if (view === "homeads") loadHomeAdBanners();
    if (view === "mapads") {
      loadMapAdPins();
      ensureMapAdsMap();
    }
    if (view === "ban") {
      loadBans();
    }
    if (view === "passwords") loadTesterPasswords();
    if (view === "programs") loadAthletePrograms();
    if (view === "xpshop") loadXpShopConfig();
    if (view === "registration") loadRegistrationSettings();
    if (view === "events") loadEvents();
    if (view === "uniquechars") loadUniqueCharacters();
    if (view === "merch") loadMerchOrders();
    if (view === "usersstats") loadUserStats();
  }

  function formatUtcTs(ts) {
    if (!ts) return "—";
    try {
      return new Date(Number(ts) * 1000).toISOString().replace("T", " ").slice(0, 19);
    } catch {
      return String(ts);
    }
  }

  function showUsersStatsError(msg) {
    if (!usersStatsError) return;
    usersStatsError.textContent = msg || "";
    usersStatsError.style.display = msg ? "block" : "none";
  }

  async function loadUserStats() {
    if (!usersStatsDailyTbody) return;
    showUsersStatsError("");
    if (usersStatsStatus) usersStatsStatus.textContent = "Загрузка…";
    usersStatsDailyTbody.innerHTML = "";
    if (usersStatsParticipantsTbody) usersStatsParticipantsTbody.innerHTML = "";
    if (usersStatsLogTbody) usersStatsLogTbody.innerHTML = "";

    const days = getUsersStatsDays();

    try {
      const [
        { res: statsRes, data: stats },
        { res: reportRes, data: report },
        { res: logRes, data: logData },
      ] = await Promise.all([
        adminFetch(`/api/admin/users/stats?days=${days}`),
        adminFetch(`/api/admin/users/activity-report?days=${days}`),
        adminFetch("/api/admin/users/auth-log?limit=100"),
      ]);

      if (!statsRes.ok || !stats.ok) {
        throw new Error(stats.detail || stats.error || "Не удалось загрузить статистику");
      }
      if (!reportRes.ok || !report.ok) {
        throw new Error(report.detail || report.error || "Не удалось загрузить отчёт по участникам");
      }
      if (!logRes.ok || !logData.ok) {
        throw new Error(logData.detail || logData.error || "Не удалось загрузить журнал");
      }

      if (usersStatsTotal) usersStatsTotal.textContent = String(stats.total_registered ?? 0);
      if (usersStatsParticipants) usersStatsParticipants.textContent = String(report.total_participants ?? 0);
      if (usersStatsActivePeriod) {
        usersStatsActivePeriod.textContent = String(report.total_with_logins_in_period ?? 0);
      }
      if (usersStatsWeekly) usersStatsWeekly.textContent = String(stats.weekly_active_3days_count ?? 0);
      if (usersStatsWeeklyPeriod && stats.weekly_active_3days_period) {
        const p = stats.weekly_active_3days_period;
        usersStatsWeeklyPeriod.textContent = `Период: ${p.from} — ${p.to} (мин. ${p.min_days_per_week} дн.)`;
      }

      const daily = Array.isArray(stats.daily_logins) ? stats.daily_logins : [];
      const todayRow = daily[0] || {};
      if (usersStatsToday) usersStatsToday.textContent = String(todayRow.login_events ?? 0);
      if (usersStatsTodayUsers) {
        usersStatsTodayUsers.textContent = `Уникальных: ${todayRow.unique_users ?? 0}`;
      }

      usersStatsDailyTbody.innerHTML = daily
        .map(
          (row) => `<tr>
            <td>${row.date || "—"}</td>
            <td>${row.login_events ?? 0}</td>
            <td>${row.unique_users ?? 0}</td>
          </tr>`,
        )
        .join("");

      const participants = Array.isArray(report.users) ? report.users : [];
      if (usersStatsParticipantsTbody) {
        usersStatsParticipantsTbody.innerHTML = participants
          .map((user) => {
            const label = user.fio
              || [user.email, user.login_username, user.display_name].filter(Boolean).join(" · ")
              || `#${user.telegram_id}`;
            const loginDays = Array.isArray(user.login_days) ? user.login_days.join(", ") : "—";
            const social = user.social_link
              ? `<a class="link link--inline" href="${escapeHtml(user.social_link)}" target="_blank" rel="noopener">${escapeHtml(user.social_link)}</a>`
              : "—";
            return `<tr>
              <td>${escapeHtml(label)}</td>
              <td>${escapeHtml(user.region || "—")}</td>
              <td class="cell-muted">${escapeHtml(user.registered_at || "—")}</td>
              <td>${user.login_days_count ?? 0}</td>
              <td>${user.total_login_events ?? 0}</td>
              <td class="cell-muted">${escapeHtml(user.last_login_at || "—")}</td>
              <td class="cell-muted" style="max-width: 280px; white-space: normal">${escapeHtml(loginDays)}</td>
              <td style="max-width: 220px; white-space: normal">${social}</td>
            </tr>`;
          })
          .join("");
      }

      const items = Array.isArray(logData.items) ? logData.items : [];
      if (usersStatsLogTbody) {
        usersStatsLogTbody.innerHTML = items
          .map((item) => {
            const label = [item.email, item.login_username, item.display_name]
              .filter(Boolean)
              .join(" · ") || `#${item.telegram_id}`;
            const event = item.event_type === "logout" ? "Выход" : "Вход";
            return `<tr>
              <td class="cell-muted">${formatUtcTs(item.ts)}</td>
              <td>${event}</td>
              <td>${escapeHtml(label)}</td>
              <td class="cell-muted">${escapeHtml(item.source || "—")}</td>
              <td class="cell-muted">${escapeHtml(item.client_ip || "—")}</td>
            </tr>`;
          })
          .join("");
      }

      if (usersStatsStatus) {
        usersStatsStatus.textContent = `Период отчёта: ${days} дн. · участников: ${participants.length} · записей журнала: ${items.length}`;
      }
    } catch (e) {
      if (e.message !== "unauthorized") {
        showUsersStatsError(e.message || "Ошибка загрузки");
      }
      if (usersStatsStatus) usersStatsStatus.textContent = "";
    }
  }

  async function exportUsersStatsXlsx(format) {
    showUsersStatsError("");
    const days = getUsersStatsDays();
    const fmt = format === "ros_mol" ? "ros_mol" : "full";
    const fallback = fmt === "ros_mol" ? "kisfit_ros_molodezhi.xlsx" : "kisfit_participants.xlsx";
    try {
      if (usersStatsStatus) usersStatsStatus.textContent = "Формирование XLSX…";
      await adminDownload(`/api/admin/users/export.xlsx?format=${fmt}&days=${days}`, fallback);
      if (usersStatsStatus) usersStatsStatus.textContent = "Файл скачан.";
    } catch (e) {
      if (e.message !== "unauthorized") {
        showUsersStatsError(e.message || "Ошибка выгрузки");
      }
      if (usersStatsStatus) usersStatsStatus.textContent = "";
    }
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

  function showPushError(msg) {
    if (!pushError) return;
    pushError.textContent = msg || "";
    pushError.style.display = msg ? "block" : "none";
  }

  function showPushOk(msg) {
    if (!pushMsg) return;
    pushMsg.textContent = msg || "";
    pushMsg.hidden = !msg;
    if (msg) pushMsg.classList.remove("is-error");
  }

  function formatPushResult(data) {
    const targeted = Number(data?.targeted_users || 0);
    const withTokens = Number(data?.users_with_tokens || 0);
    const sentOk = Number(data?.sent_ok || 0);
    const sentFailed = Number(data?.sent_failed || 0);
    return `Цель: ${targeted} пользователей, с токеном: ${withTokens}, доставлено: ${sentOk}, ошибок: ${sentFailed}.`;
  }

  function readPushPayload() {
    const title = (pushTitle?.value || "").trim() || "КИСФИТ";
    const message = (pushMessage?.value || "").trim();
    if (!message) {
      showPushError("Введите текст push-сообщения.");
      return null;
    }
    return { title, message };
  }

  async function sendPushAll() {
    const payload = readPushPayload();
    if (!payload) return;
    if (!confirm("Отправить push всем пользователям?")) return;
    showPushError("");
    showPushOk("");
    if (pushSendAllBtn) pushSendAllBtn.disabled = true;
    if (pushSendSegmentBtn) pushSendSegmentBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/push/broadcast", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        showPushError(apiErrorMessage(data, "Не удалось отправить push."));
        return;
      }
      showPushOk(`Рассылка всем выполнена. ${formatPushResult(data)}`);
    } catch (e) {
      if (e.message !== "unauthorized") showPushError("Сервер недоступен.");
    } finally {
      if (pushSendAllBtn) pushSendAllBtn.disabled = false;
      if (pushSendSegmentBtn) pushSendSegmentBtn.disabled = false;
    }
  }

  async function sendPushStreakNotExtended() {
    const payload = readPushPayload();
    if (!payload) return;
    if (!confirm("Отправить push тем, кто не продлил стрик сегодня?")) return;
    showPushError("");
    showPushOk("");
    if (pushSendAllBtn) pushSendAllBtn.disabled = true;
    if (pushSendSegmentBtn) pushSendSegmentBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/push/segment", {
        method: "POST",
        body: JSON.stringify({ ...payload, segment: "streak_not_extended" }),
      });
      if (!res.ok) {
        showPushError(apiErrorMessage(data, "Не удалось отправить push."));
        return;
      }
      showPushOk(`Сегментная рассылка выполнена. ${formatPushResult(data)}`);
    } catch (e) {
      if (e.message !== "unauthorized") showPushError("Сервер недоступен.");
    } finally {
      if (pushSendAllBtn) pushSendAllBtn.disabled = false;
      if (pushSendSegmentBtn) pushSendSegmentBtn.disabled = false;
    }
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
          <div class="admin-user-item__main">
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

  // ——— Бета-заявки ———

  async function loadList() {
    const token = getToken();
    if (!token || !tbody || !statusEl) return;
    statusEl.textContent = "Загрузка…";
    tbody.innerHTML = "";

    let res;
    try {
      res = await fetch("/api/beta-applications", {
        headers: { "X-Admin-Token": token },
      });
    } catch {
      statusEl.textContent = "Нет соединения с сервером.";
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logoutOn401();
      return;
    }
    if (!res.ok) {
      statusEl.textContent = data.error || "Не удалось загрузить список.";
      return;
    }

    const apps = data.applications || [];
    statusEl.textContent = apps.length ? `Всего заявок: ${apps.length}` : "Пока нет заявок.";

    for (const row of apps) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="cell-muted">${escapeHtml(formatDate(row.createdAt))}</span></td>
        <td>${escapeHtml(row.name || "—")}</td>
        <td>${escapeHtml(row.email || "—")}</td>
        <td>${escapeHtml(row.telegram || "—")}</td>
        <td>${escapeHtml(row.platform || "—")}</td>
        <td class="cell-comment">${escapeHtml(row.comment || "—")}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  async function loadSupportList() {
    const token = getToken();
    if (!token || !supportTbody || !supportStatusEl) return;
    supportStatusEl.textContent = "Загрузка…";
    supportTbody.innerHTML = "";

    let res;
    try {
      res = await fetch("/api/support-requests", {
        headers: { "X-Admin-Token": token },
      });
    } catch {
      supportStatusEl.textContent = "Нет соединения с сервером.";
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logoutOn401();
      return;
    }
    if (!res.ok) {
      supportStatusEl.textContent = data.error || "Не удалось загрузить список.";
      return;
    }

    const requests = data.requests || [];
    supportStatusEl.textContent = requests.length
      ? `Всего обращений: ${requests.length}`
      : "Пока нет обращений.";

    for (const row of requests) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="cell-muted">${escapeHtml(formatDate(row.createdAt))}</span></td>
        <td>${escapeHtml(row.reason || "—")}</td>
        <td>${escapeHtml(row.appLogin || "—")}</td>
        <td>${escapeHtml(row.contact || "—")}</td>
        <td class="cell-comment">${escapeHtml(row.description || "—")}</td>
      `;
      supportTbody.appendChild(tr);
    }
  }

  async function loadAccountDeletionList() {
    const token = getToken();
    if (!token || !accountDeletionTbody || !accountDeletionStatusEl) return;
    accountDeletionStatusEl.textContent = "Загрузка…";
    accountDeletionTbody.innerHTML = "";

    let res;
    try {
      res = await fetch("/api/account-deletion-requests", {
        headers: { "X-Admin-Token": token },
      });
    } catch {
      accountDeletionStatusEl.textContent = "Нет соединения с сервером.";
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logoutOn401();
      return;
    }
    if (!res.ok) {
      accountDeletionStatusEl.textContent = data.error || "Не удалось загрузить список.";
      return;
    }

    const requests = data.requests || [];
    accountDeletionStatusEl.textContent = requests.length
      ? `Всего заявок на удаление: ${requests.length}`
      : "Пока нет заявок на удаление.";

    for (const row of requests) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="cell-muted">${escapeHtml(formatDate(row.createdAt))}</span></td>
        <td>${escapeHtml(row.appLogin || "—")}</td>
        <td>${escapeHtml(row.contactEmail || "—")}</td>
        <td class="cell-comment">${escapeHtml(row.comment || "—")}</td>
        <td>${escapeHtml(row.status || "new")}</td>
      `;
      accountDeletionTbody.appendChild(tr);
    }
  }

  // ——— Сборки ———

  function setUploadUi(phase, ratio) {
    if (!uploadProgressWrap || !uploadProgressFill || !uploadStatusEl) return;
    if (phase === "idle") {
      uploadProgressWrap.hidden = true;
      uploadProgressFill.style.width = "0%";
      uploadStatusEl.textContent = "";
      return;
    }
    uploadProgressWrap.hidden = false;
    if (ratio == null || Number.isNaN(ratio)) {
      uploadStatusEl.textContent =
        "Подготовка к отправке. Большие APK могут занимать несколько минут — не закрывайте вкладку.";
      uploadProgressFill.style.width = "10%";
    } else if (ratio < 1) {
      const pct = Math.max(0, Math.min(99, Math.round(ratio * 100)));
      uploadProgressFill.style.width = `${pct}%`;
      uploadStatusEl.textContent = `Загрузка: ${pct}%`;
    } else {
      uploadProgressFill.style.width = "100%";
      uploadStatusEl.textContent = "Ждём ответ сервера…";
    }
  }

  function postReleaseWithProgress(formData, token) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/releases");
      xhr.setRequestHeader("X-Admin-Token", token);
      xhr.timeout = 20 * 60 * 1000;
      xhr.upload.onloadstart = () => setUploadUi("busy", NaN);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && ev.total > 0) {
          setUploadUi("busy", ev.loaded / ev.total);
        }
      };
      xhr.upload.onload = () => setUploadUi("busy", 1);
      xhr.onload = () => {
        let data = {};
        try {
          data = JSON.parse(xhr.responseText || "{}");
        } catch {
          data = {};
        }
        resolve({ status: xhr.status, data, responseText: xhr.responseText || "" });
      };
      xhr.onerror = () => reject(new Error("network"));
      xhr.ontimeout = () => reject(new Error("timeout"));
      xhr.send(formData);
    });
  }

  function showReleaseFormError(msg) {
    if (!releaseError) return;
    releaseError.textContent = msg || "";
    releaseError.style.display = msg ? "block" : "none";
  }

  function showReleaseFormOk(msg) {
    if (!releaseMsg) return;
    releaseMsg.textContent = msg || "";
    releaseMsg.hidden = !msg;
    if (msg) releaseMsg.classList.remove("is-error");
  }

  async function loadReleases() {
    const token = getToken();
    if (!token || !releasesTbody || !releasesStatus) return;
    releasesStatus.textContent = "Загрузка сборок…";
    releasesTbody.innerHTML = "";

    let res;
    try {
      res = await fetch("/api/admin/releases", {
        headers: { "X-Admin-Token": token },
      });
    } catch {
      releasesStatus.textContent = "Нет соединения с сервером.";
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logoutOn401();
      return;
    }
    if (!res.ok) {
      releasesStatus.textContent = data.error || "Не удалось загрузить сборки.";
      return;
    }

    const list = data.releases || [];
    if (!list.length) {
      releasesStatus.textContent = "Сборок пока нет. Загрузите APK ниже.";
    } else {
      releasesStatus.textContent = `Сборок: ${list.length}. Первая — активная для скачивания.`;
    }

    for (let i = 0; i < list.length; i += 1) {
      const row = list[i];
      const tr = document.createElement("tr");
      const isCurrent = i === 0;
      tr.innerHTML = `
        <td><span class="cell-muted">${escapeHtml(formatDate(row.createdAt))}${isCurrent ? " · <strong>активная</strong>" : ""}</span></td>
        <td>${escapeHtml(row.title || "—")}</td>
        <td><span title="${escapeHtml(row.apkDownloadName || "")}" class="cell-comment">${escapeHtml(row.apkDownloadName || "—")}</span></td>
        <td>${row.imageStorageName ? "Да" : "—"}</td>
        <td><button type="button" class="btn btn--ghost btn--danger-outline admin-release-delete" data-release-delete="${escapeHtml(row.id)}">Удалить</button></td>
      `;
      releasesTbody.appendChild(tr);
    }
  }

  // ——— Баннер ———

  function showBannerError(msg) {
    if (!bannerError) return;
    bannerError.textContent = msg || "";
    bannerError.style.display = msg ? "block" : "none";
  }

  function showBannerOk(msg) {
    if (!bannerMsg) return;
    bannerMsg.textContent = msg || "";
    bannerMsg.hidden = !msg;
    if (msg) bannerMsg.classList.remove("is-error");
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

    let res;
    let data;
    try {
      ({ res, data } = await adminFetch("/api/admin/update-banner"));
    } catch (e) {
      if (e.message === "unauthorized") return;
      showBannerError("Нет соединения с сервером.");
      return;
    }

    if (!res.ok) {
      showBannerError(data.error || "Не удалось загрузить настройки.");
      return;
    }
    fillBannerForm(data.config);
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
      showBannerError("Укажите минимальную версию (например 1.3.0).");
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
      showBannerOk("Настройки сохранены.");
    } catch (e) {
      if (e.message !== "unauthorized") showBannerError("Сервер недоступен.");
    } finally {
      if (bannerSaveBtn) bannerSaveBtn.disabled = false;
    }
  }

  // ——— Рекламные баннеры на главном экране ———

  const HOME_ADS_PLACEMENT_LABELS = {
    after_territory: "Под «Захват территорий»",
    after_actions: "Под миссиями / лидербордом",
  };

  function showHomeAdsError(msg) {
    if (!homeAdsError) return;
    homeAdsError.textContent = msg || "";
    homeAdsError.style.display = msg ? "block" : "none";
  }

  function showHomeAdsOk(msg) {
    if (!homeAdsMsg) return;
    homeAdsMsg.textContent = msg || "";
    homeAdsMsg.hidden = !msg;
  }

  function resetHomeAdsForm() {
    if (homeAdsEditId) homeAdsEditId.value = "";
    if (homeAdsEnabled) homeAdsEnabled.checked = true;
    if (homeAdsName) homeAdsName.value = "";
    if (homeAdsPlacement) homeAdsPlacement.value = "after_territory";
    if (homeAdsUrl) homeAdsUrl.value = "";
    if (homeAdsImage) homeAdsImage.value = "";
    if (homeAdsImageFilename) homeAdsImageFilename.value = "";
    if (homeAdsImagePreview) homeAdsImagePreview.innerHTML = "";
  }

  function fillHomeAdsForm(b) {
    if (!b) {
      resetHomeAdsForm();
      return;
    }
    if (homeAdsEditId) homeAdsEditId.value = b.id || "";
    if (homeAdsEnabled) homeAdsEnabled.checked = Boolean(b.enabled);
    if (homeAdsName) homeAdsName.value = b.name || b.title || "";
    if (homeAdsPlacement) homeAdsPlacement.value = b.placement || "after_territory";
    if (homeAdsUrl) homeAdsUrl.value = b.targetUrl || "";
    if (homeAdsImageFilename) homeAdsImageFilename.value = b.imageFilename || "";
    if (homeAdsImage) homeAdsImage.value = "";
    renderHomeAdsImagePreview(b.imageFilename);
  }

  function renderHomeAdsImagePreview(filename) {
    if (!homeAdsImagePreview) return;
    if (!filename) {
      homeAdsImagePreview.innerHTML = "";
      return;
    }
    const url = `/api/app/home-ad-banners/images/${encodeURIComponent(filename)}`;
    homeAdsImagePreview.innerHTML = `<img src="${escapeHtml(url)}" alt="" style="max-width:100%;width:360px;height:auto;border-radius:12px;border:1px solid #ddd" />`;
  }

  function renderHomeAdsList() {
    if (!homeAdsList) return;
    if (!homeAdsDraft.length) {
      homeAdsList.innerHTML = '<p class="muted">Пока нет баннеров. Заполните форму ниже.</p>';
      return;
    }
    homeAdsList.innerHTML = homeAdsDraft
      .map((b) => {
        const placement = HOME_ADS_PLACEMENT_LABELS[b.placement] || b.placement;
        const status = b.enabled ? "включён" : "выключен";
        return `<div class="form-card" style="margin-bottom:12px;padding:14px">
          <div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap">
            <div>
              <strong>${escapeHtml(b.name || b.title || "Без названия")}</strong>
              <div class="muted" style="font-size:13px;margin-top:4px">${escapeHtml(placement)} · ${status}</div>
              <div class="muted" style="font-size:13px;margin-top:2px">${escapeHtml(b.targetUrl || "—")}</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="btn btn--ghost btn--sm" data-homeads-edit="${escapeHtml(b.id)}">Изменить</button>
              <button type="button" class="btn btn--ghost btn--sm btn--danger-outline" data-homeads-del="${escapeHtml(b.id)}">Удалить</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  async function loadHomeAdBanners() {
    if (!getToken()) return;
    showHomeAdsError("");
    showHomeAdsOk("");
    try {
      const { res, data } = await adminFetch("/api/admin/home-ad-banners");
      if (!res.ok) {
        showHomeAdsError(data.error || "Не удалось загрузить.");
        return;
      }
      homeAdsDraft = Array.isArray(data.banners) ? data.banners.slice() : [];
      renderHomeAdsList();
    } catch (e) {
      if (e.message !== "unauthorized") showHomeAdsError("Сервер недоступен.");
    }
  }

  async function uploadHomeAdImageIfNeeded() {
    const file = homeAdsImage?.files?.[0];
    if (!file) {
      const existing = (homeAdsImageFilename?.value || "").trim();
      if (!existing) throw new Error("Выберите картинку 1080×360.");
      return existing;
    }
    const fd = new FormData();
    fd.append("file", file, file.name);
    const { res, data } = await adminUpload("/api/admin/home-ad-banners/upload-image", fd);
    if (!res.ok) throw new Error(data.error || "Не удалось загрузить картинку.");
    const filename = data.filename || "";
    if (!filename) throw new Error("Сервер не вернул имя файла.");
    if (homeAdsImageFilename) homeAdsImageFilename.value = filename;
    renderHomeAdsImagePreview(filename);
    if (homeAdsImage) homeAdsImage.value = "";
    return filename;
  }

  async function persistHomeAdBanners(banners) {
    const { res, data } = await adminFetch("/api/admin/home-ad-banners", {
      method: "PUT",
      body: JSON.stringify({ banners }),
    });
    if (!res.ok) {
      throw new Error(data.error || data.detail || "Не удалось сохранить на сервере.");
    }
    homeAdsDraft = Array.isArray(data.banners) ? data.banners.slice() : [];
    renderHomeAdsList();
  }

  async function saveHomeAdBanner() {
    if (!getToken()) return;
    showHomeAdsError("");
    showHomeAdsOk("");

    const targetUrl = (homeAdsUrl?.value || "").trim();
    if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
      showHomeAdsError("Укажите корректную ссылку (https://…).");
      return;
    }
    const placement = homeAdsPlacement?.value || "after_territory";
    const name = (homeAdsName?.value || "").trim() || "Баннер";

    if (homeAdsSaveBtn) homeAdsSaveBtn.disabled = true;
    try {
      const imageFilename = await uploadHomeAdImageIfNeeded();
      const editId = (homeAdsEditId?.value || "").trim();
      const entry = {
        id: editId || crypto.randomUUID(),
        enabled: Boolean(homeAdsEnabled?.checked),
        name,
        placement,
        targetUrl,
        imageFilename,
      };
      const next = homeAdsDraft.filter((b) => b.id !== entry.id);
      next.push(entry);
      await persistHomeAdBanners(next);
      showHomeAdsOk("Сохранено. Приложение подхватит баннер при следующем обновлении главного экрана.");
      resetHomeAdsForm();
    } catch (e) {
      showHomeAdsError(e.message || "Ошибка.");
    } finally {
      if (homeAdsSaveBtn) homeAdsSaveBtn.disabled = false;
    }
  }

  async function deleteHomeAdBanner(id) {
    if (!getToken() || !id) return;
    showHomeAdsError("");
    showHomeAdsOk("");
    try {
      const next = homeAdsDraft.filter((b) => b.id !== id);
      await persistHomeAdBanners(next);
      showHomeAdsOk("Баннер удалён.");
      if ((homeAdsEditId?.value || "") === id) resetHomeAdsForm();
    } catch (e) {
      showHomeAdsError(e.message || "Не удалось удалить.");
    }
  }

  // ——— Рекламные пины на карте ———

  const MAP_ADS_PLACEMENT_LABELS = {
    territory: "территории",
    capture: "захват",
    training: "тренировка",
  };

  function showMapAdsError(msg) {
    if (!mapAdsError) return;
    mapAdsError.textContent = msg || "";
    mapAdsError.style.display = msg ? "block" : "none";
  }

  function showMapAdsOk(msg) {
    if (!mapAdsMsg) return;
    mapAdsMsg.textContent = msg || "";
    mapAdsMsg.hidden = !msg;
  }

  function selectedMapAdPlacements() {
    const out = [];
    if (mapAdsPlaceTerritory?.checked) out.push("territory");
    if (mapAdsPlaceCapture?.checked) out.push("capture");
    if (mapAdsPlaceTraining?.checked) out.push("training");
    return out;
  }

  function setMapAdPlacements(list) {
    const set = new Set(Array.isArray(list) ? list : []);
    if (mapAdsPlaceTerritory) mapAdsPlaceTerritory.checked = set.has("territory");
    if (mapAdsPlaceCapture) mapAdsPlaceCapture.checked = set.has("capture");
    if (mapAdsPlaceTraining) mapAdsPlaceTraining.checked = set.has("training");
  }

  function resetMapAdsForm() {
    if (mapAdsEditId) mapAdsEditId.value = "";
    if (mapAdsEnabled) mapAdsEnabled.checked = true;
    if (mapAdsName) mapAdsName.value = "";
    if (mapAdsDescription) mapAdsDescription.value = "";
    setMapAdPlacements(["territory", "capture", "training"]);
    if (mapAdsUrl) mapAdsUrl.value = "";
    if (mapAdsLat) mapAdsLat.value = "";
    if (mapAdsLng) mapAdsLng.value = "";
    if (mapAdsImage) mapAdsImage.value = "";
    if (mapAdsImageFilename) mapAdsImageFilename.value = "";
    revokeMapAdsLocalPreview();
    if (mapAdsImagePreview) mapAdsImagePreview.innerHTML = "";
    if (mapAdsMarker && mapAdsMap) {
      mapAdsMap.removeLayer(mapAdsMarker);
      mapAdsMarker = null;
    }
  }

  function setMapAdsPoint(lat, lng, { pan = true } = {}) {
    const la = Number(lat);
    const ln = Number(lng);
    if (!Number.isFinite(la) || !Number.isFinite(ln)) return;
    if (mapAdsLat) mapAdsLat.value = la.toFixed(6);
    if (mapAdsLng) mapAdsLng.value = ln.toFixed(6);
    if (!mapAdsMap || !window.L) return;
    const ll = window.L.latLng(la, ln);
    if (!mapAdsMarker) {
      mapAdsMarker = window.L.marker(ll, { draggable: true }).addTo(mapAdsMap);
      mapAdsMarker.on("dragend", () => {
        const p = mapAdsMarker.getLatLng();
        setMapAdsPoint(p.lat, p.lng, { pan: false });
      });
    } else {
      mapAdsMarker.setLatLng(ll);
    }
    if (pan) mapAdsMap.setView(ll, Math.max(mapAdsMap.getZoom(), 15));
  }

  function ensureMapAdsMap() {
    const mount = () => {
      const el = document.getElementById("admin-mapads-map");
      if (!el || !window.L) return;
      if (!mapAdsMap) {
        mapAdsMap = window.L.map(el).setView([55.7558, 37.6173], 12);
        window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(mapAdsMap);
        mapAdsMap.on("click", (e) => setMapAdsPoint(e.latlng.lat, e.latlng.lng));
      }
      const lat = Number(mapAdsLat?.value);
      const lng = Number(mapAdsLng?.value);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setMapAdsPoint(lat, lng, { pan: true });
      }
      setTimeout(() => mapAdsMap?.invalidateSize(), 60);
    };

    if (window.L) {
      mount();
      return;
    }
    if (mapAdsLeafletLoading) {
      mapAdsLeafletLoading.then(mount);
      return;
    }
    mapAdsLeafletLoading = new Promise((resolve, reject) => {
      if (!document.querySelector("link[data-mapads-leaflet]")) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        css.setAttribute("data-mapads-leaflet", "1");
        document.head.appendChild(css);
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("leaflet"));
      document.head.appendChild(script);
    }).catch(() => {
      mapAdsLeafletLoading = null;
      showMapAdsError("Не удалось загрузить карту. Проверьте сеть и обновите страницу.");
    });
    mapAdsLeafletLoading.then(() => {
      if (window.L) mount();
    });
  }

  function revokeMapAdsLocalPreview() {
    if (!mapAdsLocalPreviewUrl) return;
    URL.revokeObjectURL(mapAdsLocalPreviewUrl);
    mapAdsLocalPreviewUrl = null;
  }

  function renderMapAdsImagePreview(filename, localUrl, localName) {
    if (!mapAdsImagePreview) return;
    const src = localUrl || (filename ? `/api/app/map-ad-pins/images/${encodeURIComponent(filename)}` : "");
    if (!src) {
      mapAdsImagePreview.innerHTML = "";
      return;
    }
    const caption = localName
      ? `Выбрана картинка: ${localName}`
      : "Картинка прикреплена";
    mapAdsImagePreview.innerHTML = `
      <div>
        <img src="${escapeHtml(src)}" alt="" style="width:160px;height:110px;object-fit:contain;background:#f4f6f1;border-radius:12px;border:1px solid #ddd" />
        <div class="muted" style="font-size:13px;margin-top:6px">${escapeHtml(caption)}</div>
      </div>
      <img src="${escapeHtml(src)}" alt="" title="Так картинка выглядит на карте" style="width:56px;height:56px;object-fit:contain" />`;
  }

  function renderMapAdsList() {
    if (!mapAdsList) return;
    if (!mapAdsDraft.length) {
      mapAdsList.innerHTML = '<p class="muted">Пока нет пинов. Заполните форму ниже и кликните точку на карте.</p>';
      return;
    }
    mapAdsList.innerHTML = mapAdsDraft
      .map((p) => {
        const places = (Array.isArray(p.placements) ? p.placements : [])
          .map((key) => MAP_ADS_PLACEMENT_LABELS[key] || key)
          .join(", ");
        const status = p.enabled ? "включён" : "выключен";
        const coords =
          p.lat != null && p.lng != null ? `${Number(p.lat).toFixed(5)}, ${Number(p.lng).toFixed(5)}` : "точка не задана";
        const thumb = p.imageFilename
          ? `<img src="/api/app/map-ad-pins/images/${encodeURIComponent(p.imageFilename)}" alt="" style="width:72px;height:72px;object-fit:contain;background:#f4f6f1;border-radius:12px;border:1px solid #ddd" />`
          : "";
        return `<div class="form-card" style="margin-bottom:12px;padding:14px">
          <div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap">
            <div style="display:flex;gap:12px;align-items:flex-start">
              ${thumb}
              <div>
              <strong>${escapeHtml(p.name || "Без названия")}</strong>
              <div class="muted" style="font-size:13px;margin-top:4px">${escapeHtml(places || "—")} · ${status}</div>
              <div class="muted" style="font-size:13px;margin-top:2px">${escapeHtml(coords)}</div>
              ${p.description ? `<div class="muted" style="font-size:13px;margin-top:2px">${escapeHtml(p.description)}</div>` : ""}
              <div class="muted" style="font-size:13px;margin-top:2px">${escapeHtml(p.targetUrl || "—")}</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="btn btn--ghost btn--sm" data-mapads-edit="${escapeHtml(p.id)}">Изменить</button>
              <button type="button" class="btn btn--ghost btn--sm btn--danger-outline" data-mapads-del="${escapeHtml(p.id)}">Удалить</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  function fillMapAdsForm(pin) {
    if (!pin) {
      resetMapAdsForm();
      return;
    }
    if (mapAdsEditId) mapAdsEditId.value = pin.id || "";
    if (mapAdsEnabled) mapAdsEnabled.checked = Boolean(pin.enabled);
    if (mapAdsName) mapAdsName.value = pin.name || "";
    if (mapAdsDescription) mapAdsDescription.value = pin.description || "";
    setMapAdPlacements(pin.placements || []);
    if (mapAdsUrl) mapAdsUrl.value = pin.targetUrl || "";
    if (mapAdsImageFilename) mapAdsImageFilename.value = pin.imageFilename || "";
    if (mapAdsImage) mapAdsImage.value = "";
    renderMapAdsImagePreview(pin.imageFilename);
    if (pin.lat != null && pin.lng != null) setMapAdsPoint(pin.lat, pin.lng);
  }

  async function loadMapAdPins() {
    if (!getToken()) return;
    showMapAdsError("");
    showMapAdsOk("");
    try {
      const { res, data } = await adminFetch("/api/admin/map-ad-pins");
      if (!res.ok) {
        showMapAdsError(data.error || "Не удалось загрузить.");
        return;
      }
      mapAdsDraft = Array.isArray(data.pins) ? data.pins.slice() : [];
      renderMapAdsList();
    } catch (e) {
      if (e.message !== "unauthorized") showMapAdsError("Сервер недоступен.");
    }
  }

  async function uploadMapAdImageIfNeeded() {
    const file = mapAdsImage?.files?.[0];
    if (!file) {
      const existing = (mapAdsImageFilename?.value || "").trim();
      if (!existing) throw new Error("Выберите картинку.");
      return existing;
    }
    const fd = new FormData();
    fd.append("file", file, file.name);
    const { res, data } = await adminUpload("/api/admin/map-ad-pins/upload-image", fd);
    if (!res.ok) throw new Error(data.error || "Не удалось загрузить картинку.");
    const filename = data.filename || "";
    if (!filename) throw new Error("Сервер не вернул имя файла.");
    if (mapAdsImageFilename) mapAdsImageFilename.value = filename;
    const chosenName = file.name || filename;
    renderMapAdsImagePreview(filename, mapAdsLocalPreviewUrl, chosenName);
    if (mapAdsImage) mapAdsImage.value = "";
    return filename;
  }

  async function persistMapAdPins(pins) {
    const { res, data } = await adminFetch("/api/admin/map-ad-pins", {
      method: "PUT",
      body: JSON.stringify({ pins }),
    });
    if (!res.ok) {
      throw new Error(data.error || data.detail || "Не удалось сохранить на сервере.");
    }
    mapAdsDraft = Array.isArray(data.pins) ? data.pins.slice() : [];
    renderMapAdsList();
    return data;
  }

  async function saveMapAdPin() {
    if (!getToken()) return;
    showMapAdsError("");
    showMapAdsOk("");

    const targetUrl = (mapAdsUrl?.value || "").trim();
    if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
      showMapAdsError("Укажите корректную ссылку (https://…).");
      return;
    }
    const placements = selectedMapAdPlacements();
    if (!placements.length) {
      showMapAdsError("Выберите хотя бы одну карту.");
      return;
    }
    const lat = Number(mapAdsLat?.value);
    const lng = Number(mapAdsLng?.value);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      showMapAdsError("Поставьте точку на карте.");
      return;
    }
    const name = (mapAdsName?.value || "").trim();
    const description = (mapAdsDescription?.value || "").trim();

    if (mapAdsSaveBtn) mapAdsSaveBtn.disabled = true;
    try {
      const imageFilename = await uploadMapAdImageIfNeeded();
      const editId = (mapAdsEditId?.value || "").trim();
      const entry = {
        id: editId || crypto.randomUUID(),
        enabled: Boolean(mapAdsEnabled?.checked),
        name,
        description,
        placements,
        targetUrl,
        lat,
        lng,
        imageFilename,
      };
      const next = mapAdsDraft.filter((p) => p.id !== entry.id);
      next.push(entry);
      const saved = await persistMapAdPins(next);
      const stored = (saved.pins || []).find((p) => p.id === entry.id);
      if (!stored?.imageFilename) {
        throw new Error("Сервер не сохранил картинку. Пин не записан.");
      }
      showMapAdsOk("Сохранено. Картинка прикреплена, пин появится на карте в этой точке.");
      resetMapAdsForm();
    } catch (e) {
      showMapAdsError(e.message || "Ошибка.");
    } finally {
      if (mapAdsSaveBtn) mapAdsSaveBtn.disabled = false;
    }
  }

  async function deleteMapAdPin(id) {
    if (!getToken() || !id) return;
    showMapAdsError("");
    showMapAdsOk("");
    try {
      const next = mapAdsDraft.filter((p) => p.id !== id);
      await persistMapAdPins(next);
      showMapAdsOk("Пин удалён.");
      if ((mapAdsEditId?.value || "") === id) resetMapAdsForm();
    } catch (e) {
      showMapAdsError(e.message || "Не удалось удалить.");
    }
  }

  // ——— Бан ———

  function showBanError(msg) {
    if (!banError) return;
    banError.textContent = msg || "";
    banError.style.display = msg ? "block" : "none";
  }

  function showBanOk(msg) {
    if (!banMsg) return;
    banMsg.textContent = msg || "";
    banMsg.hidden = !msg;
    if (msg) banMsg.classList.remove("is-error");
  }

  async function adminUpload(path, formData) {
    const token = getToken();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 120_000);
    let res;
    try {
      res = await fetch(path, {
        method: "POST",
        headers: { "X-Admin-Token": token },
        body: formData,
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logoutOn401();
      throw new Error("unauthorized");
    }
    return { res, data };
  }

  function showProgError(msg) {
    if (!progError) return;
    progError.textContent = msg || "";
    progError.style.display = msg ? "block" : "none";
  }

  function showXpShopError(msg) {
    if (!xpShopError) return;
    xpShopError.textContent = msg || "";
    xpShopError.style.display = msg ? "block" : "none";
  }

  function showXpShopOk(msg) {
    if (!xpShopMsg) return;
    xpShopMsg.textContent = msg || "";
    xpShopMsg.hidden = !msg;
  }

  function xpShopCategoryLabel(category) {
    if (category === "merch") return "Мерч";
    if (category === "other") return "Другое";
    return category || "—";
  }

  function renderXpShopTable() {
    if (!xpShopTbody) return;
    xpShopTbody.innerHTML = "";
    const items = Array.isArray(xpShopDraft.items) ? xpShopDraft.items : [];
    if (!items.length) {
      xpShopTbody.innerHTML = "<tr><td colspan=\"5\" class=\"muted\">Товаров нет.</td></tr>";
      return;
    }
    for (const item of items) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td><strong>${escapeHtml(item.title || item.id)}</strong><div class="muted" style="font-size:12px">${escapeHtml(item.id || "")}</div></td>` +
        `<td>${escapeHtml(xpShopCategoryLabel(item.category))}</td>` +
        `<td><input class="form__input js-xpshop-price" data-id="${escapeHtml(item.id)}" type="number" min="0" step="1" value="${Number(item.xp_price || 0)}" style="max-width:100px" /></td>` +
        `<td style="text-align:center"><input class="js-xpshop-available" data-id="${escapeHtml(item.id)}" type="checkbox"${item.available !== false ? " checked" : ""} /></td>` +
        `<td style="text-align:center"><input class="js-xpshop-purchasable" data-id="${escapeHtml(item.id)}" type="checkbox"${item.purchasable ? " checked" : ""} /></td>`;
      xpShopTbody.appendChild(tr);
    }
  }

  function collectXpShopDraftFromUi() {
    const items = (Array.isArray(xpShopDraft.items) ? xpShopDraft.items : []).map((item) => {
      const id = item.id;
      const priceEl = xpShopTbody?.querySelector(`.js-xpshop-price[data-id="${CSS.escape(id)}"]`);
      const availableEl = xpShopTbody?.querySelector(`.js-xpshop-available[data-id="${CSS.escape(id)}"]`);
      const purchasableEl = xpShopTbody?.querySelector(`.js-xpshop-purchasable[data-id="${CSS.escape(id)}"]`);
      return {
        id,
        xp_price: Number(priceEl?.value || item.xp_price || 0),
        available: Boolean(availableEl?.checked),
        purchasable: Boolean(purchasableEl?.checked),
      };
    });
    return {
      global_purchases_enabled: Boolean(xpShopGlobalEnabled?.checked),
      programs_purchasable: Boolean(xpShopProgramsEnabled?.checked),
      items,
    };
  }

  function showRegistrationOk(text) {
    if (registrationMsg) {
      registrationMsg.textContent = text || "";
      registrationMsg.hidden = !text;
    }
  }

  function showRegistrationError(text) {
    if (registrationError) {
      registrationError.textContent = text || "";
      registrationError.style.display = text ? "block" : "none";
    }
  }

  function renderRegistrationPostboxStatus(configured) {
    if (!registrationPostboxStatus) return;
    registrationPostboxStatus.textContent = configured
      ? "Отправка писем (Postbox): настроена и доступна с точки зрения конфигурации сервера."
      : "Отправка писем (Postbox): не настроена или переменные окружения отсутствуют — коды не отправятся.";
  }

  async function loadRegistrationSettings() {
    showRegistrationError("");
    showRegistrationOk("");
    if (registrationEmailRequired) registrationEmailRequired.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/auth/registration-settings");
      if (!res.ok) {
        showRegistrationError(apiErrorMessage(data, "Не удалось загрузить настройки регистрации."));
        return;
      }
      if (registrationEmailRequired) {
        registrationEmailRequired.checked = data.registration_email_verification_required !== false;
        registrationEmailRequired.disabled = false;
      }
      renderRegistrationPostboxStatus(Boolean(data.email_delivery_configured));
    } catch (e) {
      if (e.message !== "unauthorized") showRegistrationError("Сервер недоступен.");
    }
  }

  async function saveRegistrationSettings() {
    showRegistrationError("");
    showRegistrationOk("");
    if (registrationSaveBtn) registrationSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/auth/registration-settings", {
        method: "PUT",
        body: JSON.stringify({
          registration_email_verification_required: Boolean(registrationEmailRequired?.checked),
        }),
      });
      if (!res.ok) {
        showRegistrationError(apiErrorMessage(data, "Не удалось сохранить настройки."));
        return;
      }
      if (registrationEmailRequired) {
        registrationEmailRequired.checked = data.registration_email_verification_required !== false;
      }
      renderRegistrationPostboxStatus(Boolean(data.email_delivery_configured));
      showRegistrationOk("Настройки регистрации сохранены.");
    } catch (e) {
      if (e.message !== "unauthorized") showRegistrationError("Сервер недоступен.");
    } finally {
      if (registrationSaveBtn) registrationSaveBtn.disabled = false;
    }
  }

  async function loadXpShopConfig() {
    showXpShopError("");
    showXpShopOk("");
    if (xpShopTbody) xpShopTbody.innerHTML = "<tr><td colspan=\"5\" class=\"muted\">Загрузка…</td></tr>";
    try {
      const { res, data } = await adminFetch("/api/admin/xp_shop/config");
      if (!res.ok) {
        showXpShopError(apiErrorMessage(data, "Не удалось загрузить настройки магазина."));
        return;
      }
      xpShopDraft = {
        global_purchases_enabled: Boolean(data.global_purchases_enabled),
        programs_purchasable: Boolean(data.programs_purchasable),
        items: Array.isArray(data.items) ? data.items : [],
      };
      if (xpShopGlobalEnabled) xpShopGlobalEnabled.checked = xpShopDraft.global_purchases_enabled;
      if (xpShopProgramsEnabled) xpShopProgramsEnabled.checked = xpShopDraft.programs_purchasable;
      renderXpShopTable();
    } catch (e) {
      if (e.message !== "unauthorized") showXpShopError("Сервер недоступен.");
    }
  }

  async function saveXpShopConfig() {
    showXpShopError("");
    showXpShopOk("");
    const payload = collectXpShopDraftFromUi();
    const itemsBody = {};
    for (const item of payload.items) {
      itemsBody[item.id] = {
        xp_price: Math.max(0, Number(item.xp_price || 0)),
        available: Boolean(item.available),
        purchasable: Boolean(item.purchasable),
      };
    }
    if (xpShopSaveBtn) xpShopSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/xp_shop/config", {
        method: "PUT",
        body: JSON.stringify({
          global_purchases_enabled: payload.global_purchases_enabled,
          programs_purchasable: payload.programs_purchasable,
          items: itemsBody,
        }),
      });
      if (!res.ok) {
        showXpShopError(apiErrorMessage(data, "Не удалось сохранить настройки."));
        return;
      }
      xpShopDraft = {
        global_purchases_enabled: Boolean(data.global_purchases_enabled),
        programs_purchasable: Boolean(data.programs_purchasable),
        items: Array.isArray(data.items) ? data.items : [],
      };
      if (xpShopGlobalEnabled) xpShopGlobalEnabled.checked = xpShopDraft.global_purchases_enabled;
      if (xpShopProgramsEnabled) xpShopProgramsEnabled.checked = xpShopDraft.programs_purchasable;
      renderXpShopTable();
      showXpShopOk("Настройки магазина сохранены.");
    } catch (e) {
      if (e.message !== "unauthorized") showXpShopError("Сервер недоступен.");
    } finally {
      if (xpShopSaveBtn) xpShopSaveBtn.disabled = false;
    }
  }

  function showProgOk(msg) {
    if (!progMsg) return;
    progMsg.textContent = msg || "";
    progMsg.hidden = !msg;
  }

  function clearProgramForm() {
    selectedProgramId = null;
    if (progCurId) progCurId.textContent = "—";
    if (progId) progId.value = "";
    if (progStatus) progStatus.value = "draft";
    if (progAthlete) progAthlete.value = "";
    if (progTitle) progTitle.value = "";
    if (progDesc) progDesc.value = "";
    if (progWeeks) progWeeks.value = "0";
    if (progParticipants) progParticipants.value = "0";
    if (progOldPrice) progOldPrice.value = "0";
    if (progXp) progXp.value = "0";
    if (progRating) progRating.value = "0";
    if (progSort) progSort.value = "0";
    if (progPurchasable) progPurchasable.checked = true;
    if (progCover) progCover.value = "";
    if (progPdf) progPdf.value = "";
    if (progCoverFile) progCoverFile.value = "";
    if (progPdfFile) progPdfFile.value = "";
    document.querySelectorAll(".admin-program-item.is-selected").forEach((el) => {
      el.classList.remove("is-selected");
    });
  }

  function fillProgramForm(p) {
    selectedProgramId = p.id;
    if (progCurId) progCurId.textContent = p.id || "—";
    if (progId) progId.value = p.id || "";
    if (progStatus) progStatus.value = p.status || "draft";
    if (progAthlete) progAthlete.value = p.athlete_name || "";
    if (progTitle) progTitle.value = p.program_title || "";
    if (progDesc) progDesc.value = p.description || "";
    if (progWeeks) progWeeks.value = String(p.weeks ?? 0);
    if (progParticipants) progParticipants.value = String(p.participants_hint ?? 0);
    if (progOldPrice) progOldPrice.value = String(p.old_price_rub ?? 0);
    if (progXp) progXp.value = String(p.xp_price ?? 0);
    if (progRating) progRating.value = String(p.rating ?? 0);
    if (progSort) progSort.value = String(p.sort_order ?? 0);
    if (progPurchasable) progPurchasable.checked = p.purchasable !== false;
    if (progCover) progCover.value = p.cover_image_url || "";
    if (progPdf) progPdf.value = p.pdf_filename || "";
    document.querySelectorAll(".admin-program-item").forEach((el) => {
      el.classList.toggle("is-selected", el.dataset.id === p.id);
    });
  }

  async function loadAthletePrograms() {
    if (!progList) return;
    progList.innerHTML = "";
    showProgError("");
    try {
      const { res, data } = await adminFetch("/api/admin/athlete_programs");
      if (!res.ok) {
        showProgError(apiErrorMessage(data, "Не удалось загрузить программы."));
        return;
      }
      const programs = data.programs || [];
      if (!programs.length) {
        progList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Программ ещё нет.</p>";
        return;
      }
      for (const p of programs) {
        const el = document.createElement("div");
        el.className = "admin-program-item";
        el.dataset.id = p.id;
        el.innerHTML =
          `<div class="admin-program-item__title">${escapeHtml(p.program_title || p.id)}</div>` +
          `<div class="admin-program-item__meta">${escapeHtml(p.athlete_name || "")} · ${escapeHtml(p.status || "")}</div>`;
        el.addEventListener("click", () => fillProgramForm(p));
        progList.appendChild(el);
      }
      if (selectedProgramId) {
        const found = programs.find((x) => x.id === selectedProgramId);
        if (found) fillProgramForm(found);
      }
    } catch (e) {
      if (e.message !== "unauthorized") showProgError("Сервер недоступен.");
    }
  }

  async function saveAthleteProgram() {
    showProgError("");
    showProgOk("");
    const body = {
      id: (progId?.value || "").trim() || null,
      athlete_name: (progAthlete?.value || "").trim(),
      program_title: (progTitle?.value || "").trim(),
      description: (progDesc?.value || "").trim() || null,
      weeks: Number(progWeeks?.value || 0),
      participants_hint: Number(progParticipants?.value || 0),
      old_price_rub: Number(progOldPrice?.value || 0),
      xp_price: Number(progXp?.value || 0),
      rating: Number(progRating?.value || 0),
      sort_order: Number(progSort?.value || 0),
      status: progStatus?.value || "draft",
      purchasable: Boolean(progPurchasable?.checked),
      cover_image_url: (progCover?.value || "").trim() || null,
      pdf_filename: (progPdf?.value || "").trim() || null,
    };
    if (!body.athlete_name || !body.program_title) {
      showProgError("Укажите спортсмена и название программы.");
      return;
    }
    if (progSaveBtn) progSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/athlete_programs/upsert", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        showProgError(apiErrorMessage(data, "Не удалось сохранить."));
        return;
      }
      showProgOk(`Сохранено: ${data.id || body.id || ""}`);
      selectedProgramId = data.id || body.id;
      await loadAthletePrograms();
    } catch (e) {
      if (e.message !== "unauthorized") showProgError("Сервер недоступен.");
    } finally {
      if (progSaveBtn) progSaveBtn.disabled = false;
    }
  }

  async function deleteAthleteProgram() {
    const id = (progId?.value || "").trim();
    if (!id) {
      showProgError("Выберите программу для удаления.");
      return;
    }
    if (!confirm(`Удалить программу «${id}»?`)) return;
    showProgError("");
    showProgOk("");
    if (progDeleteBtn) progDeleteBtn.disabled = true;
    try {
      const { res, data } = await adminFetch(`/api/admin/athlete_programs/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showProgError(apiErrorMessage(data, "Не удалось удалить."));
        return;
      }
      showProgOk("Программа удалена.");
      clearProgramForm();
      await loadAthletePrograms();
    } catch (e) {
      if (e.message !== "unauthorized") showProgError("Сервер недоступен.");
    } finally {
      if (progDeleteBtn) progDeleteBtn.disabled = false;
    }
  }

  async function uploadAthleteProgramMedia(kind) {
    const fileInput = kind === "cover" ? progCoverFile : progPdfFile;
    const targetField = kind === "cover" ? progCover : progPdf;
    const file = fileInput?.files?.[0];
    if (!file) {
      showProgError("Выберите файл для загрузки.");
      return;
    }
    showProgError("");
    const fd = new FormData();
    fd.append("kind", kind);
    fd.append("file", file, file.name);
    const btn = kind === "cover" ? progUploadCoverBtn : progUploadPdfBtn;
    if (btn) btn.disabled = true;
    try {
      const { res, data } = await adminUpload("/api/admin/upload/athlete_program_media", fd);
      if (!res.ok) {
        showProgError(apiErrorMessage(data, "Не удалось загрузить файл."));
        return;
      }
      if (targetField) targetField.value = data.filename || "";
      showProgOk(`Файл загружен: ${data.filename || ""}`);
      if (fileInput) fileInput.value = "";
    } catch (e) {
      if (e.message !== "unauthorized") showProgError("Сервер недоступен.");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function showUcError(msg) {
    if (!ucError) return;
    ucError.textContent = msg || "";
    ucError.style.display = msg ? "block" : "none";
  }

  function showUcOk(msg) {
    if (!ucMsg) return;
    ucMsg.textContent = msg || "";
    ucMsg.hidden = !msg;
  }

  function showUcGrantError(msg) {
    if (!ucGrantError) return;
    ucGrantError.textContent = msg || "";
    ucGrantError.style.display = msg ? "block" : "none";
  }

  function showUcGrantOk(msg) {
    if (!ucGrantMsg) return;
    ucGrantMsg.textContent = msg || "";
    ucGrantMsg.hidden = !msg;
  }

  function uniqueCharImagePreviewUrl(path) {
    const raw = (path || "").trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) return raw;
    const filename = raw.replace(/^.*\//, "");
    return `/static/uploads/unique_characters/${encodeURIComponent(filename)}`;
  }

  function renderUniqueCharImagePreview(path) {
    if (!ucImagePreview) return;
    const url = uniqueCharImagePreviewUrl(path);
    if (!url) {
      ucImagePreview.innerHTML = "";
      return;
    }
    ucImagePreview.innerHTML = `<img src="${escapeHtml(url)}" alt="" style="max-width:96px;max-height:96px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 50% / 12px 12px" />`;
  }

  function clearUniqueCharForm() {
    selectedUniqueCharId = null;
    if (ucCurId) ucCurId.textContent = "—";
    if (ucId) ucId.value = "";
    if (ucName) ucName.value = "";
    if (ucRarity) ucRarity.value = "common";
    if (ucImage) ucImage.value = "";
    if (ucImageFile) ucImageFile.value = "";
    renderUniqueCharImagePreview("");
    document.querySelectorAll(".admin-uc-item.is-selected").forEach((el) => {
      el.classList.remove("is-selected");
    });
  }

  function fillUniqueCharForm(c) {
    const cid = c.character_id || c.id || "";
    selectedUniqueCharId = cid;
    if (ucCurId) ucCurId.textContent = cid || "—";
    if (ucId) ucId.value = cid;
    if (ucName) ucName.value = c.name || c.title || "";
    if (ucRarity) ucRarity.value = c.rarity || "common";
    const imagePath = c.image_url || "";
    if (ucImage) ucImage.value = imagePath.replace(/^.*\//, "") || imagePath;
    renderUniqueCharImagePreview(ucImage?.value || "");
    if (ucGrantCid) ucGrantCid.value = cid;
    document.querySelectorAll(".admin-uc-item").forEach((el) => {
      el.classList.toggle("is-selected", el.dataset.id === cid);
    });
  }

  async function loadUniqueCharacters() {
    if (!ucList) return;
    ucList.innerHTML = "";
    showUcError("");
    try {
      const { res, data } = await adminFetch("/api/admin/unique_characters");
      if (!res.ok) {
        showUcError(apiErrorMessage(data, "Не удалось загрузить персонажей."));
        return;
      }
      const characters = data.characters || [];
      if (!characters.length) {
        ucList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Персонажей ещё нет.</p>";
        return;
      }
      for (const c of characters) {
        const cid = c.character_id || c.id || "";
        const el = document.createElement("div");
        el.className = "admin-program-item admin-uc-item";
        el.dataset.id = cid;
        const rarityLabel = REWARD_RARITY_LABELS[c.rarity] || c.rarity || "";
        el.innerHTML =
          `<div class="admin-program-item__title">${escapeHtml(c.name || c.title || cid)}</div>` +
          `<div class="admin-program-item__meta">${escapeHtml(cid)} · ${escapeHtml(rarityLabel)}</div>`;
        el.addEventListener("click", () => fillUniqueCharForm(c));
        ucList.appendChild(el);
      }
      if (selectedUniqueCharId) {
        const found = characters.find((x) => (x.character_id || x.id) === selectedUniqueCharId);
        if (found) fillUniqueCharForm(found);
      }
    } catch (e) {
      if (e.message !== "unauthorized") showUcError("Сервер недоступен.");
    }
  }

  async function saveUniqueCharacter() {
    showUcError("");
    showUcOk("");
    const body = {
      id: (ucId?.value || "").trim(),
      name: (ucName?.value || "").trim(),
      rarity: ucRarity?.value || "common",
      image_url: (ucImage?.value || "").trim() || null,
    };
    if (!body.id || !body.name) {
      showUcError("Укажите ID и название персонажа.");
      return;
    }
    if (ucSaveBtn) ucSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/unique_characters/upsert", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        showUcError(apiErrorMessage(data, "Не удалось сохранить."));
        return;
      }
      const saved = data.character || {};
      const cid = saved.character_id || saved.id || body.id;
      showUcOk(`Сохранено: ${cid}`);
      selectedUniqueCharId = cid;
      await loadUniqueCharacters();
    } catch (e) {
      if (e.message !== "unauthorized") showUcError("Сервер недоступен.");
    } finally {
      if (ucSaveBtn) ucSaveBtn.disabled = false;
    }
  }

  async function uploadUniqueCharacterImage() {
    const file = ucImageFile?.files?.[0];
    if (!file) {
      showUcError("Выберите изображение для загрузки.");
      return;
    }
    showUcError("");
    const fd = new FormData();
    fd.append("file", file, file.name);
    if (ucUploadImageBtn) ucUploadImageBtn.disabled = true;
    try {
      const { res, data } = await adminUpload("/api/admin/upload/unique_character_image", fd);
      if (!res.ok) {
        showUcError(apiErrorMessage(data, "Не удалось загрузить изображение."));
        return;
      }
      if (ucImage) ucImage.value = data.filename || "";
      renderUniqueCharImagePreview(ucImage.value);
      const ext = (data.filename || "").split(".").pop()?.toUpperCase() || "";
      let okMsg = `Изображение загружено: ${data.filename || ""}`;
      if (ext) okMsg += ` (${ext})`;
      if (data.recommended_format) okMsg += `. ${data.recommended_format}`;
      showUcOk(okMsg);
      if (ucImageFile) ucImageFile.value = "";
    } catch (e) {
      if (e.message !== "unauthorized") showUcError("Сервер недоступен.");
    } finally {
      if (ucUploadImageBtn) ucUploadImageBtn.disabled = false;
    }
  }

  function selectUniqueCharGrantUser(u) {
    const tid = String(u.telegram_id);
    if (ucGrantTid) ucGrantTid.value = tid;
    const parts = [
      u.username ? `@${u.username}` : null,
      u.login_username,
      u.email,
      u.display_name,
    ].filter(Boolean);
    const label = parts.length ? parts.join(" · ") : `tg:${tid}`;
    if (ucGrantTarget) ucGrantTarget.textContent = `Выбран: tg:${tid} — ${label}`;
    showUcGrantError("");
  }

  async function searchUniqueCharUsers() {
    const q = (ucGrantSearch?.value || "").trim();
    if (!ucGrantUsers || !ucGrantSearchStatus) return;
    ucGrantUsers.innerHTML = "";
    if (!q) {
      ucGrantSearchStatus.textContent = "Введите запрос для поиска.";
      return;
    }
    ucGrantSearchStatus.textContent = "Поиск…";
    showUcGrantError("");

    try {
      const { res, data } = await adminFetch(
        `/api/admin/users/search?q=${encodeURIComponent(q)}`,
        { timeoutMs: BAN_FETCH_TIMEOUT_MS },
      );
      if (!res.ok) {
        ucGrantSearchStatus.textContent = "";
        showUcGrantError(apiErrorMessage(data, "Ошибка поиска."));
        return;
      }
      const users = data.users || [];
      ucGrantSearchStatus.textContent = users.length
        ? `Найдено: ${users.length}`
        : "Никого не найдено.";

      for (const u of users) {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        const parts = [
          u.username ? `@${u.username}` : null,
          u.login_username,
          u.email,
        ].filter(Boolean);
        const meta = parts.join(" · ") || "—";
        el.innerHTML = `
          <div class="admin-user-item__main">
            <div class="admin-user-item__title">tg:${escapeHtml(String(u.telegram_id))}</div>
            <div class="admin-user-item__meta">${escapeHtml(meta)}${u.display_name ? " · " + escapeHtml(u.display_name) : ""}</div>
          </div>
        `;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--ghost";
        btn.textContent = "Выбрать";
        btn.addEventListener("click", () => selectUniqueCharGrantUser(u));
        el.appendChild(btn);
        ucGrantUsers.appendChild(el);
      }
    } catch (e) {
      if (e.message !== "unauthorized") {
        ucGrantSearchStatus.textContent = "";
        showUcGrantError("Сервер недоступен.");
      }
    }
  }

  async function grantUniqueCharacter() {
    showUcGrantError("");
    showUcGrantOk("");
    const telegramId = Number((ucGrantTid?.value || "").trim());
    const characterId = (ucGrantCid?.value || "").trim();
    if (!telegramId || !Number.isFinite(telegramId)) {
      showUcGrantError("Выберите пользователя из результатов поиска.");
      return;
    }
    if (!characterId) {
      showUcGrantError("Укажите ID персонажа.");
      return;
    }
    if (
      !confirm(
        `Выдать персонажа «${characterId}» пользователю tg:${telegramId}?`,
      )
    ) {
      return;
    }
    if (ucGrantBtn) ucGrantBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/unique_characters/grant", {
        method: "POST",
        body: JSON.stringify({ telegram_id: telegramId, character_id: characterId }),
      });
      if (!res.ok) {
        showUcGrantError(apiErrorMessage(data, "Не удалось выдать персонажа."));
        return;
      }
      showUcGrantOk(`Персонаж «${characterId}» выдан пользователю tg:${telegramId}.`);
    } catch (e) {
      if (e.message !== "unauthorized") showUcGrantError("Сервер недоступен.");
    } finally {
      if (ucGrantBtn) ucGrantBtn.disabled = false;
    }
  }

  const EVENT_STATUS_LABELS = {
    draft: "Черновик",
    scheduled: "Запланирован",
    active: "Идёт",
    ended: "Завершён",
    archived: "Архив",
  };

  const METRIC_LABELS = {
    xp_gained: "XP",
    steps: "Шаги",
    distance_meters: "Дистанция",
    pushups_reps_est: "Отжимания",
    territory_captured: "Территория (захвачено)",
    territory_held: "Территория (удерживается)",
  };

  // Ключи rules_json, которые редактируются отдельными полями формы.
  const PARTICIPATION_RULE_KEYS = [
    "team_size_max",
    "team_size_min",
    "teams_created_by",
    "team_switch_lock_hours",
    "distance_source",
  ];

  const ACCESS_HINTS = {
    auto: "Засчитываются все пользователи приложения. Командный турнир всегда требует вступления в команду.",
    opt_in: "Пользователь нажимает «Участвовать» — результат считается с этого момента.",
    code: "Турнир виден всем: баннер на главной и в списке. Чтобы участвовать, пользователь открывает турнир и вводит код. Коды — в карточке «Коды турнира» ниже.",
    private: "Скрытый турнир: его нет на главной и в списке. Попасть можно только по коду или по ссылке-приглашению в команду.",
  };

  /** Две понятные настройки в форме → одно поле access_mode на сервере. */
  function accessModeFromForm() {
    if ((evtVisibility?.value || "public") === "hidden") return "private";
    return evtAccess?.value || "auto";
  }

  function setAccessForm(mode) {
    const m = mode || "auto";
    if (evtVisibility) evtVisibility.value = m === "private" ? "hidden" : "public";
    if (evtAccess) evtAccess.value = m === "private" ? "code" : m;
  }

  function syncParticipationFields() {
    const fmt = evtFormat?.value || "solo";
    const hidden = (evtVisibility?.value || "public") === "hidden";
    if (evtAccess) {
      if (hidden) evtAccess.value = "code";
      for (const opt of evtAccess.options) opt.disabled = hidden && opt.value !== "code";
    }
    const access = accessModeFromForm();
    const usesCodes = access === "code" || access === "private";
    if (evtCodesCard) evtCodesCard.hidden = !usesCodes || !selectedEventId;
    if (evtTeamWrap) evtTeamWrap.hidden = fmt !== "team";
    const metric = evtLbMetric?.value || "";
    if (evtDistWrap) evtDistWrap.hidden = metric !== "distance_meters";
    if (evtAccessHint) {
      let hint = ACCESS_HINTS[access] || "";
      if (fmt === "team" && access === "auto") hint = "Командный турнир: участвуют только те, кто вступил в команду.";
      if (metric.startsWith("territory_")) {
        hint += " Территория: история изменений площади копится с момента обновления сервера захвата.";
      }
      if (usesCodes && !selectedEventId) hint += " Сохраните турнир — появится управление кодами (первый код создастся сам).";
      if (fmt === "team" && usesCodes) hint += " Приглашение в команду тоже работает как пропуск.";
      evtAccessHint.textContent = hint;
    }
  }

  function intOrNull(el) {
    const v = (el?.value || "").trim();
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  }

  function showEvtTeamsError(msg) {
    if (!evtTeamsError) return;
    evtTeamsError.textContent = msg || "";
    evtTeamsError.style.display = msg ? "block" : "none";
  }

  async function loadEventTeams() {
    const eid = currentEventIdOrForm();
    const isTeam = (evtFormat?.value || "solo") === "team";
    if (evtTeamsCard) evtTeamsCard.hidden = !eid || !isTeam;
    if (!eid || !isTeam || !evtTeamsTbody) return;
    showEvtTeamsError("");
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(eid)}/teams`);
      if (!res.ok) {
        showEvtTeamsError(apiErrorMessage(data, "Не удалось загрузить команды."));
        return;
      }
      const teams = data.teams || [];
      if (evtTeamsMeta) {
        evtTeamsMeta.textContent = `Команд: ${teams.length} · участников в турнире: ${data.participants ?? 0}`;
      }
      if (!teams.length) {
        evtTeamsTbody.innerHTML = "<tr><td colspan=\"6\" class=\"muted\">Команд пока нет.</td></tr>";
        return;
      }
      evtTeamsTbody.innerHTML = "";
      for (const t of teams) {
        const tr = document.createElement("tr");
        const members = (t.members || []).filter((m) => m.active);
        const membersTitle = members.map((m) => m.display_name).join(", ");
        tr.innerHTML =
          `<td>${t.rank != null ? `#${t.rank}` : "—"}</td>` +
          `<td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${/^#[0-9a-fA-F]{6}$/.test(t.color || "") ? t.color : "#999"};margin-right:6px"></span>` +
          `${escapeHtml(t.name)}${t.created_by === "admin" ? " <span class=\"muted\">(админ)</span>" : ""}</td>` +
          `<td title="${escapeHtml(membersTitle)}">${t.members_count}/${t.max_members}</td>` +
          `<td>${t.score ?? 0}</td>` +
          `<td><code>${escapeHtml(t.invite_code || "")}</code><br><span class="muted" style="font-size:12px">${escapeHtml(t.invite_url || "")}</span></td>` +
          `<td><button type="button" class="btn btn--ghost btn--sm btn--danger-outline" data-evt-team-del="${escapeHtml(t.id)}">Расформировать</button></td>`;
        evtTeamsTbody.appendChild(tr);
      }
    } catch (err) {
      if (err.message !== "unauthorized") showEvtTeamsError("Сервер недоступен.");
    }
  }

  async function createEventTeam() {
    const eid = currentEventIdOrForm();
    const name = (evtTeamName?.value || "").trim();
    if (!eid) return showEvtTeamsError("Сначала сохраните турнир.");
    if (name.length < 2) return showEvtTeamsError("Укажите название команды.");
    const color = (evtTeamColor?.value || "").trim() || null;
    if (evtTeamCreateBtn) evtTeamCreateBtn.disabled = true;
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(eid)}/teams`, {
        method: "POST",
        body: JSON.stringify({ name, color }),
      });
      if (!res.ok) {
        showEvtTeamsError(apiErrorMessage(data, "Не удалось создать команду."));
        return;
      }
      if (evtTeamName) evtTeamName.value = "";
      if (evtTeamColor) evtTeamColor.value = "";
      await loadEventTeams();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtTeamsError("Сервер недоступен.");
    } finally {
      if (evtTeamCreateBtn) evtTeamCreateBtn.disabled = false;
    }
  }

  async function disbandEventTeam(teamId) {
    if (!confirm("Расформировать команду? Участники останутся в турнире без команды, набранные очки команды сохранятся в истории.")) {
      return;
    }
    try {
      const { res, data } = await adminFetch(`/api/admin/teams/${encodeURIComponent(teamId)}`, { method: "DELETE" });
      if (!res.ok) {
        showEvtTeamsError(apiErrorMessage(data, "Не удалось расформировать команду."));
        return;
      }
      await loadEventTeams();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtTeamsError("Сервер недоступен.");
    }
  }

  // ---------- Коды турнира ----------
  let eventCodesCache = [];

  const CODE_STATUS_LABELS = {
    active: ["Активен", "#16a34a"],
    disabled: ["Отключён", "#6b7280"],
    expired: ["Истёк срок", "#b45309"],
    exhausted: ["Исчерпан", "#b91c1c"],
  };

  function showCodesError(msg) {
    if (!evtCodesError) return;
    evtCodesError.textContent = msg || "";
    evtCodesError.style.display = msg ? "block" : "none";
  }

  function showCodesOk(msg) {
    if (!evtCodesMsg) return;
    evtCodesMsg.textContent = msg || "";
    evtCodesMsg.hidden = !msg;
  }

  /** Общие параметры для новых кодов: лимит, метка, срок. null — ошибка уже показана. */
  function codesBatchOptions() {
    let maxUses = null;
    const usesMode = evtCodesUses?.value || "";
    if (usesMode === "1") maxUses = 1;
    if (usesMode === "custom") {
      maxUses = intOrNull(evtCodesUsesCustom);
      if (maxUses == null || maxUses < 1) {
        showCodesError("Укажите, сколько раз можно использовать каждый код.");
        return null;
      }
    }
    let expiresTs = null;
    const exp = (evtCodesExpires?.value || "").trim();
    if (exp) {
      const ms = new Date(exp).getTime();
      if (!Number.isFinite(ms)) {
        showCodesError("Неверная дата окончания действия.");
        return null;
      }
      expiresTs = Math.floor(ms / 1000);
    }
    return { max_uses: maxUses, label: (evtCodesLabel?.value || "").trim() || null, expires_ts: expiresTs };
  }

  function filteredCodes() {
    const q = (evtCodesSearch?.value || "").trim().toUpperCase();
    const f = evtCodesFilter?.value || "";
    return eventCodesCache.filter((c) => {
      if (q && !c.code.includes(q) && !(c.label || "").toUpperCase().includes(q)) return false;
      if (!f) return true;
      if (f === "used") return c.uses > 0;
      if (f === "unused") return c.uses === 0;
      return c.status === f;
    });
  }

  function renderEventCodes() {
    if (!evtCodesTbody) return;
    const list = filteredCodes();
    if (!eventCodesCache.length) {
      evtCodesTbody.innerHTML = "<tr><td colspan=\"6\" class=\"muted\">Кодов пока нет — сгенерируйте или добавьте вручную.</td></tr>";
      return;
    }
    if (!list.length) {
      evtCodesTbody.innerHTML = "<tr><td colspan=\"6\" class=\"muted\">Ничего не найдено.</td></tr>";
      return;
    }
    const shown = list.slice(0, 500);
    evtCodesTbody.innerHTML = shown
      .map((c) => {
        const [stLabel, stColor] = CODE_STATUS_LABELS[c.status] || [c.status, "#6b7280"];
        const limit = c.max_uses != null ? `${c.uses} / ${c.max_uses}` : `${c.uses} / ∞`;
        const expires = c.expires_ts ? `<br><span class="muted" style="font-size:11px">до ${escapeHtml(formatTs(c.expires_ts))}</span>` : "";
        const origin = c.created_by === "manual" ? "вручную" : "авто";
        const id = escapeHtml(c.id);
        return (
          `<tr>` +
          `<td><code style="font-size:14px;font-weight:700">${escapeHtml(c.code)}</code></td>` +
          `<td>${c.label ? escapeHtml(c.label) : "<span class=\"muted\">—</span>"}</td>` +
          `<td>${limit}</td>` +
          `<td><span style="color:${stColor};font-weight:600">${escapeHtml(stLabel)}</span>${expires}</td>` +
          `<td style="font-size:12px">${escapeHtml(formatTs(c.created_ts))}<br><span class="muted">${origin}</span></td>` +
          `<td style="white-space:nowrap">` +
          `<button type="button" class="btn btn--ghost btn--sm" data-code-copy="${escapeHtml(c.code)}">Копировать</button> ` +
          `<button type="button" class="btn btn--ghost btn--sm" data-code-users="${id}" ${c.uses ? "" : "disabled"}>Кто вошёл</button> ` +
          `<button type="button" class="btn btn--ghost btn--sm" data-code-toggle="${id}" data-disabled="${c.disabled_ts ? "1" : "0"}">${c.disabled_ts ? "Включить" : "Отключить"}</button> ` +
          (c.uses ? "" : `<button type="button" class="btn btn--ghost btn--sm btn--danger-outline" data-code-del="${id}">Удалить</button>`) +
          `</td></tr>`
        );
      })
      .join("");
    if (list.length > shown.length) {
      evtCodesTbody.insertAdjacentHTML(
        "beforeend",
        `<tr><td colspan="6" class="muted">Показаны первые ${shown.length} из ${list.length}. Уточните поиск или скачайте CSV.</td></tr>`,
      );
    }
  }

  async function loadEventCodes() {
    const usesCodes = ["code", "private"].includes(accessModeFromForm());
    if (evtCodesCard) evtCodesCard.hidden = !usesCodes || !selectedEventId;
    if (!usesCodes || !selectedEventId) return;
    showCodesError("");
    if (evtCodeUsers) evtCodeUsers.innerHTML = "";
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(selectedEventId)}/codes`);
      if (!res.ok) {
        showCodesError(apiErrorMessage(data, "Не удалось загрузить коды."));
        return;
      }
      eventCodesCache = data.codes || [];
      if (evtCodesMeta) {
        evtCodesMeta.textContent =
          `Всего кодов: ${data.total ?? eventCodesCache.length} · активных: ${data.active ?? 0} · вошли по кодам: ${data.redeemed_users ?? 0}`;
      }
      renderEventCodes();
    } catch (err) {
      if (err.message !== "unauthorized") showCodesError("Сервер недоступен.");
    }
  }

  async function generateEventCodes(btn) {
    if (!selectedEventId) return showCodesError("Сначала сохраните турнир.");
    showCodesError("");
    showCodesOk("");
    const count = intOrNull(evtCodesCount) || 0;
    if (count < 1 || count > 1000) return showCodesError("Количество кодов: от 1 до 1000.");
    const opts = codesBatchOptions();
    if (!opts) return;
    if (btn) btn.disabled = true;
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(selectedEventId)}/codes/generate`, {
        method: "POST",
        body: JSON.stringify({ ...opts, count, prefix: (evtCodesPrefix?.value || "").trim() || null }),
      });
      if (!res.ok) return showCodesError(apiErrorMessage(data, "Не удалось сгенерировать коды."));
      const codes = data.codes || [];
      showCodesOk(
        codes.length <= 5
          ? `Готово: ${codes.join(", ")}`
          : `Создано кодов: ${codes.length}. Скопируйте их кнопкой «Скопировать активные» или скачайте CSV.`,
      );
      await loadEventCodes();
    } catch (err) {
      if (err.message !== "unauthorized") showCodesError("Сервер недоступен.");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async function addManualEventCodes(btn) {
    if (!selectedEventId) return showCodesError("Сначала сохраните турнир.");
    showCodesError("");
    showCodesOk("");
    const codes = (evtCodesManual?.value || "")
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!codes.length) return showCodesError("Впишите хотя бы один код.");
    if (codes.length > 1000) return showCodesError("За раз можно добавить до 1000 кодов.");
    const opts = codesBatchOptions();
    if (!opts) return;
    if (btn) btn.disabled = true;
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(selectedEventId)}/codes/add`, {
        method: "POST",
        body: JSON.stringify({ ...opts, codes }),
      });
      if (!res.ok) return showCodesError(apiErrorMessage(data, "Не удалось добавить коды."));
      const added = data.added || [];
      const skipped = data.skipped || [];
      let msg = `Добавлено: ${added.length}.`;
      if (skipped.length) {
        msg += ` Пропущено: ${skipped.length} (${skipped.slice(0, 5).map((s) => `${s.code} — ${s.reason}`).join("; ")}${skipped.length > 5 ? "…" : ""}).`;
      }
      showCodesOk(msg);
      if (evtCodesManual && added.length) {
        const left = new Set(skipped.map((s) => s.code));
        evtCodesManual.value = codes.filter((c) => left.has(c.toUpperCase())).join("\n");
      }
      await loadEventCodes();
    } catch (err) {
      if (err.message !== "unauthorized") showCodesError("Сервер недоступен.");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async function toggleEventCode(codeId, disable) {
    try {
      const { res, data } = await adminFetch(`/api/admin/codes/${encodeURIComponent(codeId)}`, {
        method: "POST",
        body: JSON.stringify({ disabled: disable }),
      });
      if (!res.ok) return showCodesError(apiErrorMessage(data, "Не удалось изменить код."));
      await loadEventCodes();
    } catch (err) {
      if (err.message !== "unauthorized") showCodesError("Сервер недоступен.");
    }
  }

  async function deleteEventCode(codeId) {
    if (!confirm("Удалить код? Им ещё никто не пользовался.")) return;
    try {
      const { res, data } = await adminFetch(`/api/admin/codes/${encodeURIComponent(codeId)}`, { method: "DELETE" });
      if (!res.ok) return showCodesError(apiErrorMessage(data, "Не удалось удалить код."));
      await loadEventCodes();
    } catch (err) {
      if (err.message !== "unauthorized") showCodesError("Сервер недоступен.");
    }
  }

  async function showEventCodeUsers(codeId) {
    if (!evtCodeUsers) return;
    const c = eventCodesCache.find((x) => x.id === codeId);
    evtCodeUsers.textContent = "Загрузка…";
    try {
      const { res, data } = await adminFetch(`/api/admin/codes/${encodeURIComponent(codeId)}/redemptions`);
      if (!res.ok) {
        evtCodeUsers.textContent = apiErrorMessage(data, "Не удалось загрузить список.");
        return;
      }
      const users = data.users || [];
      evtCodeUsers.innerHTML =
        `<b>Кодом ${escapeHtml(c?.code || "")} воспользовались (${users.length}):</b> ` +
        (users.length
          ? users
              .map((u) => `${escapeHtml(u.display_name)} <span class="muted">(id ${u.telegram_id}, ${escapeHtml(formatTs(u.redeemed_ts))})</span>`)
              .join(" · ")
          : "пока никто.");
      evtCodeUsers.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (err) {
      if (err.message !== "unauthorized") evtCodeUsers.textContent = "Сервер недоступен.";
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  async function copyActiveCodes() {
    const list = filteredCodes().filter((c) => c.status === "active");
    if (!list.length) return showCodesError("Нет активных кодов для копирования.");
    showCodesError("");
    if (await copyText(list.map((c) => c.code).join("\n"))) showCodesOk(`Скопировано кодов: ${list.length}.`);
  }

  function downloadCodesCsv() {
    const list = filteredCodes();
    if (!list.length) return showCodesError("Нет кодов для выгрузки.");
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["code", "label", "uses", "max_uses", "status", "expires", "created", "created_by"]];
    for (const c of list) {
      rows.push([
        c.code,
        c.label || "",
        c.uses,
        c.max_uses ?? "",
        (CODE_STATUS_LABELS[c.status] || [c.status])[0],
        c.expires_ts ? formatTs(c.expires_ts) : "",
        formatTs(c.created_ts),
        c.created_by === "manual" ? "вручную" : "авто",
      ]);
    }
    const csv = "\ufeff" + rows.map((r) => r.map(esc).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `codes-${selectedEventId || "event"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Оформление страницы турнира ----------
  const LOOK_SECTIONS = ["notice", "description", "task", "participation", "progress", "sponsor", "tabs"];
  const LOOK_SECTION_LABELS = {
    notice: "Объявление",
    description: "Описание",
    task: "Задание",
    participation: "Участие и команда (нельзя скрыть)",
    progress: "Ваш прогресс",
    sponsor: "Партнёр турнира",
    tabs: "Награды и лидерборд",
  };
  const LOOK_DEFAULTS = {
    accent: "#8DC653",
    background: "#F1F3E8",
    background2: "#E7E9DB",
    progress_color: "#8DC653",
    progress_color2: "#7AB340",
    surface: "light",
    progress_style: "solid",
    hero_height: "normal",
    hero_overlay: 70,
    hero_show_title: true,
    title_align: "left",
    title_icon: "🏆",
    show_timer: true,
    default_tab: "rewards",
    podium: false,
    notice_text: "",
    notice_style: "accent",
  };
  const LOOK_PRESETS = {
    kisfit: { name: "KISFIT", accent: "#8DC653", background: "#F1F3E8", background2: "#E7E9DB", progress_color: "#8DC653", progress_color2: "#7AB340", surface: "light", progress_style: "gradient" },
    smelost: {
      name: "Смелость",
      layout: "smelost",
      accent: "#C6FF00",
      background: "#F3F4EA",
      background2: "#F3F4EA",
      progress_color: "#111111",
      progress_color2: "#1A1A1A",
      surface: "light",
      progress_style: "solid",
      hero_show_title: false,
      hero_overlay: 0,
      hero_height: "tall",
      show_timer: false,
      texts: { marquee: "СМЕЛОСТЬ — ЭТО ДВИЖЕНИЕ / ", partner_badge: "PARTNER EDITION" },
    },
    energy: { name: "Энергия", accent: "#F97316", background: "#FFF7ED", background2: "#FFEDD5", progress_color: "#F97316", progress_color2: "#EF4444", surface: "light", progress_style: "gradient" },
    forest: { name: "Природа", accent: "#65A30D", background: "#F1F3E8", background2: "#E7E9DB", progress_color: "#4D7C0F", progress_color2: "#8DC653", surface: "light", progress_style: "gradient" },
    winter: { name: "Зима", accent: "#0EA5E9", background: "#EFF6FF", background2: "#E0F2FE", progress_color: "#2563EB", progress_color2: "#0EA5E9", surface: "light", progress_style: "gradient" },
    neon: { name: "Неон", accent: "#22D3EE", background: "#0B1020", background2: "#1E1B4B", progress_color: "#7C3AED", progress_color2: "#22D3EE", surface: "dark", progress_style: "gradient" },
    gold: { name: "Золото", accent: "#EAB308", background: "#111111", background2: "#1C1917", progress_color: "#CA8A04", progress_color2: "#EAB308", surface: "dark", progress_style: "gradient" },
    classic: { name: "Оранжевый", accent: "#F97316", background: "#F5F5F5", background2: "#F5F5F5", progress_color: "#5D3FD3", progress_color2: "#7C3AED", surface: "light", progress_style: "solid" },
  };
  const LOOK_TEXT_FIELDS = {
    join_button: "admin-look-t-join",
    progress_title: "admin-look-t-progress",
    description_title: "admin-look-t-desc",
    task_title: "admin-look-t-task",
    rewards_tab: "admin-look-t-rewards",
    leaderboard_tab: "admin-look-t-lb",
  };
  const NOTICE_COLORS = {
    info: ["#DBEAFE", "#1E3A8A"],
    success: ["#DCFCE7", "#14532D"],
    warning: ["#FEF3C7", "#78350F"],
  };

  const lookEl = (id) => document.getElementById(id);
  let lookState = null;

  function freshLookState() {
    return {
      ...LOOK_DEFAULTS,
      preset: "kisfit",
      layout: "",
      bg_gradient: false,
      sections: LOOK_SECTIONS.map((key) => ({ key, visible: true })),
      texts: {},
      sponsor: { image: "", title: "", text: "", url: "", button_text: "" },
    };
  }

  function lookStateFromAppearance(a) {
    const s = freshLookState();
    if (!a || typeof a !== "object") return s;
    for (const k of Object.keys(LOOK_DEFAULTS)) if (a[k] != null) s[k] = a[k];
    s.preset = a.preset || "";
    s.layout = a.layout || (a.preset === "smelost" ? "smelost" : "");
    s.bg_gradient = !!a.background2 && a.background2 !== (a.background || s.background);
    if (!a.background2) s.background2 = s.background;
    if (Array.isArray(a.sections)) {
      const visible = a.sections.filter((k) => LOOK_SECTIONS.includes(k));
      s.sections = [
        ...visible.map((key) => ({ key, visible: true })),
        ...LOOK_SECTIONS.filter((k) => !visible.includes(k)).map((key) => ({ key, visible: false })),
      ];
    }
    s.texts = { ...(a.texts || {}) };
    const sp = a.sponsor || {};
    s.sponsor = { image: sp.image || "", title: sp.title || "", text: sp.text || "", url: sp.url || "", button_text: sp.button_text || "" };
    return s;
  }

  /** В базу уходит только то, что отличается от стандартного вида. */
  function appearanceFromLook() {
    const s = lookState || freshLookState();
    const out = {};
    for (const [k, def] of Object.entries(LOOK_DEFAULTS)) {
      if (k === "background2") continue;
      const v = typeof s[k] === "string" ? s[k].trim() : s[k];
      if (v !== def && !(typeof v === "string" && typeof def === "string" && v.toUpperCase() === def.toUpperCase())) out[k] = v;
    }
    if (s.bg_gradient) out.background2 = s.background2;
    else delete out.background2;
    if (!out.notice_text) delete out.notice_text;
    if (s.preset) out.preset = s.preset;
    if (s.layout) out.layout = s.layout;
    const order = s.sections.filter((x) => x.visible || x.key === "participation").map((x) => x.key);
    if (order.join(",") !== LOOK_SECTIONS.join(",")) out.sections = order;
    const texts = {};
    for (const [k, v] of Object.entries(s.texts || {})) if ((v || "").trim()) texts[k] = v.trim();
    if ((s.layout === "smelost" || s.preset === "smelost") && LOOK_PRESETS.smelost?.texts) {
      for (const [k, v] of Object.entries(LOOK_PRESETS.smelost.texts)) {
        if (!texts[k]) texts[k] = v;
      }
    }
    if (Object.keys(texts).length) out.texts = texts;
    const sp = {};
    for (const [k, v] of Object.entries(s.sponsor || {})) if ((v || "").trim()) sp[k] = v.trim();
    if (sp.image || sp.title || sp.text) out.sponsor = sp;
    return out;
  }

  function setVal(id, v) {
    const el = lookEl(id);
    if (!el) return;
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = v ?? "";
  }

  function writeLookForm() {
    const s = lookState;
    setVal("admin-look-accent", s.accent);
    setVal("admin-look-bg", s.background);
    setVal("admin-look-bg2", s.background2);
    setVal("admin-look-progress", s.progress_color);
    setVal("admin-look-progress2", s.progress_color2);
    setVal("admin-look-surface", s.surface);
    setVal("admin-look-progress-style", s.progress_style);
    setVal("admin-look-bg-gradient", s.bg_gradient);
    setVal("admin-look-hero-height", s.hero_height);
    setVal("admin-look-title-align", s.title_align);
    setVal("admin-look-overlay", s.hero_overlay);
    setVal("admin-look-icon", s.title_icon);
    setVal("admin-look-show-title", s.hero_show_title);
    setVal("admin-look-show-timer", s.show_timer);
    setVal("admin-look-default-tab", s.default_tab);
    setVal("admin-look-podium", s.podium);
    setVal("admin-look-notice", s.notice_text);
    setVal("admin-look-notice-style", s.notice_style);
    for (const [k, id] of Object.entries(LOOK_TEXT_FIELDS)) setVal(id, s.texts[k] || "");
    setVal("admin-look-sp-title", s.sponsor.title);
    setVal("admin-look-sp-url", s.sponsor.url);
    setVal("admin-look-sp-text", s.sponsor.text);
    setVal("admin-look-sp-btn", s.sponsor.button_text);
    setVal("admin-look-sp-image", s.sponsor.image);
    const nameEl = lookEl("admin-look-sp-image-name");
    if (nameEl) nameEl.textContent = s.sponsor.image ? ` ${s.sponsor.image}` : "";
    renderLookControls();
  }

  function readLookForm() {
    const s = lookState;
    const v = (id) => lookEl(id)?.value ?? "";
    const c = (id) => !!lookEl(id)?.checked;
    s.accent = v("admin-look-accent").toUpperCase();
    s.background = v("admin-look-bg").toUpperCase();
    s.background2 = v("admin-look-bg2").toUpperCase();
    s.progress_color = v("admin-look-progress").toUpperCase();
    s.progress_color2 = v("admin-look-progress2").toUpperCase();
    s.surface = v("admin-look-surface") || "light";
    s.progress_style = v("admin-look-progress-style") || "solid";
    s.bg_gradient = c("admin-look-bg-gradient");
    s.hero_height = v("admin-look-hero-height") || "normal";
    s.title_align = v("admin-look-title-align") || "left";
    s.hero_overlay = Number(v("admin-look-overlay") || 0);
    s.title_icon = v("admin-look-icon").trim();
    s.hero_show_title = c("admin-look-show-title");
    s.show_timer = c("admin-look-show-timer");
    s.default_tab = v("admin-look-default-tab") || "rewards";
    s.podium = c("admin-look-podium");
    s.notice_text = v("admin-look-notice");
    s.notice_style = v("admin-look-notice-style") || "accent";
    for (const [k, id] of Object.entries(LOOK_TEXT_FIELDS)) s.texts[k] = v(id);
    s.sponsor.title = v("admin-look-sp-title");
    s.sponsor.url = v("admin-look-sp-url");
    s.sponsor.text = v("admin-look-sp-text");
    s.sponsor.button_text = v("admin-look-sp-btn");
    s.sponsor.image = v("admin-look-sp-image");
  }

  function renderLookControls() {
    const presetsEl = lookEl("admin-look-presets");
    if (presetsEl) {
      presetsEl.innerHTML = Object.entries(LOOK_PRESETS)
        .map(
          ([key, p]) =>
            `<button type="button" class="look-preset${lookState.preset === key || (key === "smelost" && lookState.layout === "smelost") ? " is-active" : ""}" data-look-preset="${key}">` +
            `<i style="background:linear-gradient(135deg,${p.background},${p.background2})"></i>` +
            `<i style="background:${p.accent}"></i>${escapeHtml(p.name)}</button>`,
        )
        .join("");
    }
    const secEl = lookEl("admin-look-sections");
    if (secEl) {
      const n = lookState.sections.length;
      secEl.innerHTML = lookState.sections
        .map((x, i) => {
          const locked = x.key === "participation";
          return (
            `<div class="look-section" style="${x.visible || locked ? "" : "opacity:.5"}">` +
            `<input type="checkbox" data-look-sec-vis="${i}" ${x.visible || locked ? "checked" : ""} ${locked ? "disabled" : ""} />` +
            `<span>${escapeHtml(LOOK_SECTION_LABELS[x.key] || x.key)}</span>` +
            `<button type="button" data-look-sec-up="${i}" ${i === 0 ? "disabled" : ""} title="Выше">↑</button>` +
            `<button type="button" data-look-sec-down="${i}" ${i === n - 1 ? "disabled" : ""} title="Ниже">↓</button>` +
            `</div>`
          );
        })
        .join("");
    }
    const ov = lookEl("admin-look-overlay-val");
    if (ov) ov.textContent = String(lookState.hero_overlay);
    const bg2 = lookEl("admin-look-bg2");
    if (bg2) bg2.disabled = !lookState.bg_gradient;
    const pr2 = lookEl("admin-look-progress2");
    if (pr2) pr2.disabled = lookState.progress_style !== "gradient";
    renderLookPreview();
  }

  function eventBannerPreviewUrl(name) {
    const raw = (name || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//.test(raw) || raw.startsWith("/")) return raw;
    return `/static/uploads/event_banners/${encodeURIComponent(raw.replace(/^.*\//, ""))}`;
  }

  function hexToRgba(hex, a) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return `rgba(0,0,0,${a})`;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function splitSmelostHeading(text, fallbackTitle) {
    const t = (text || "").trim();
    if (!t) return { title: fallbackTitle || "", body: "" };
    const i = t.indexOf("\n");
    if (i > 0) return { title: t.slice(0, i).trim(), body: t.slice(i).trim() };
    if (fallbackTitle) return { title: fallbackTitle, body: t };
    return { title: t, body: "" };
  }

  function renderSmelostLookPreview(root, s, ctx) {
    const accent = s.accent || "#C6FF00";
    const ink = "#111111";
    const muted = "#8A9086";
    const page = s.background || "#F3F4EA";
    const t = (k, def) => escapeHtml((s.texts[k] || "").trim() || def);
    const desc = splitSmelostHeading(
      ctx.descRaw,
      (s.texts.description_title || "").trim() || "Выйди за рамки привычного",
    );
    const marquee = ((s.texts.marquee || "СМЕЛОСТЬ — ЭТО ДВИЖЕНИЕ / ").trim() + " ").repeat(6);
    const badge = t("partner_badge", "PARTNER EDITION");
    const heroBg = ctx.img
      ? `background-color:${ctx.heroBg};background-image:url('${ctx.img}');background-size:cover;background-position:center`
      : `background:${ctx.heroBg}`;
    const metric = evtLbMetric?.value || "";
    const territory = metric === "territory_captured" || metric === "territory_held";
    const unit = territory ? "м²" : metric === "distance_meters" ? "км" : "очков";
    const joinCard =
      ctx.access === "code" || ctx.access === "private"
        ? `<div class="lp-s-join"><div class="lp-s-join__mark">✓</div><div><div class="lp-s-kicker" style="color:${accent}">ВХОД ПО КОДУ</div><div class="lp-s-join__title">Введите код от организатора</div></div><div class="lp-s-join__idx">O1</div></div>`
        : `<div class="lp-s-join"><div class="lp-s-join__mark">✓</div><div><div class="lp-s-kicker" style="color:${accent}">ТЫ В ИГРЕ</div><div class="lp-s-join__title">Участник</div><div class="lp-s-join__sub">Результат считается с момента вступления</div></div><div class="lp-s-join__idx">O1</div></div>`;
    const mapBlock = territory
      ? `<div class="lp-s-sec"><div class="lp-s-kicker">ТЕРРИТОРИЯ</div><div class="lp-s-h"><span style="color:${accent}">O1</span> Карта турнира</div><div class="lp-s-sub">Только захваты участников с начала турнира.</div><div class="lp-s-map"><div class="lp-s-pin">📍</div></div><div class="lp-s-cap"><span class="lp-s-cap__ok">✓</span><b>Захват начат</b><span>→</span></div></div>`
      : "";
    root.style.background = page;
    root.innerHTML =
      `<div class="lp-s-nav"><span>‹ Назад</span><span class="lp-s-badge">${badge}</span></div>` +
      `<div class="lp-s-hero" style="${heroBg}"></div>` +
      `<div class="lp-s-marquee" style="background:${accent}"><div class="lp-s-marquee__track">${escapeHtml(marquee)}</div></div>` +
      `<div class="lp-s-info"><div class="lp-s-sq" style="background:${accent}">i</div><div><div class="lp-s-kicker">ОПИСАНИЕ</div><div class="lp-s-title">${escapeHtml(desc.title)}</div><div class="lp-s-sub">${escapeHtml((desc.body || "").slice(0, 160))}</div></div></div>` +
      `<div class="lp-s-info"><div class="lp-s-sq" style="background:${accent}">◎</div><div><div class="lp-s-kicker">ЗАДАНИЕ</div><div class="lp-s-title">${t("task_title", "Захвати больше всех")}</div><div class="lp-s-sub">Начни тренировку и собери максимальную площадь до завершения турнира.</div></div></div>` +
      joinCard +
      `<div class="lp-s-live" style="background:${s.progress_color || "#111"}"><div class="lp-s-live__top"><span class="lp-s-kicker" style="color:${accent}">LIVE RESULT</span><span class="lp-s-top1" style="background:${accent};color:${ink}">ТОП 1</span></div><div class="lp-s-live__h">↗ ${t("progress_title", "Твой прогресс")}</div><div class="lp-s-live__row"><div><b>0 ${unit}</b><span>площадь</span></div><div><b>#1</b><span>место</span></div><div><b>1</b><span>участник</span></div></div><div class="lp-s-bar"><i style="background:${accent}"></i></div></div>` +
      mapBlock +
      `<div class="lp-s-tabs"><div>${t("rewards_tab", "Награды")}</div><div class="is-on" style="background:${ink};color:${accent}">${t("leaderboard_tab", "Лидерборд")}</div></div>` +
      `<div class="lp-s-lb"><div><span style="color:${accent}">O1</span><b>Ты</b><em>0 ${unit}</em></div></div>`;
  }

  function renderLookPreview() {
    const root = lookEl("admin-look-preview");
    if (!root || !lookState) return;
    const s = lookState;
    const dark = s.surface === "dark";
    const card = dark ? "rgba(255,255,255,.08)" : "#FFFFFF";
    const ink = dark ? "#F9FAFB" : "#111827";
    const muted = dark ? "rgba(255,255,255,.65)" : "#6B7280";
    const border = dark ? "rgba(255,255,255,.12)" : "#E5E7EB";
    const bg = s.bg_gradient ? `linear-gradient(180deg,${s.background},${s.background2})` : s.background;
    const t = (k, def) => escapeHtml((s.texts[k] || "").trim() || def);
    const title = escapeHtml((evtTitle?.value || "").trim() || "Название турнира");
    const descRaw = (evtDesc?.value || "").trim() || "Описание турнира появится здесь.";
    const desc = escapeHtml(descRaw.slice(0, 140));
    const img = eventBannerPreviewUrl(evtDetailBanner?.value || evtBanner?.value || "");
    const heroBg = /^#[0-9a-f]{6}$/i.test(evtBg?.value || "") ? evtBg.value : "#1F2937";
    const heroH = { compact: 120, normal: 170, tall: 230 }[s.hero_height] || 170;
    const overlay = s.hero_overlay / 100;
    const align = s.title_align === "center" ? "center" : "left";
    const progressBg =
      s.progress_style === "gradient" ? `linear-gradient(135deg,${s.progress_color},${s.progress_color2})` : s.progress_color;
    const fmt = evtFormat?.value || "solo";
    const access = accessModeFromForm();
    const joinLabel =
      access === "code" || access === "private" ? "Ввести код" : fmt === "team" ? "Создать команду" : t("join_button", "Участвовать");
    root.classList.toggle("is-smelost", s.layout === "smelost" || s.preset === "smelost");
    if (s.layout === "smelost" || s.preset === "smelost") {
      renderSmelostLookPreview(root, s, { title, descRaw, img, heroBg, fmt, access, joinLabel });
      return;
    }

    const blocks = {
      notice: () => {
        const txt = (s.notice_text || "").trim();
        if (!txt) return "";
        const [nb, nf] = s.notice_style === "accent" ? [hexToRgba(s.accent, 0.15), dark ? "#FFF" : "#111827"] : NOTICE_COLORS[s.notice_style];
        return `<div class="lp-card" style="background:${nb};color:${nf};border:1px solid ${hexToRgba(s.accent, 0.35)}">📣 ${escapeHtml(txt)}</div>`;
      },
      description: () =>
        `<div class="lp-card" style="background:${card};color:${ink}"><p class="lp-h">${t("description_title", "Описание")}</p><div style="color:${muted}">${desc}</div></div>`,
      task: () =>
        `<div class="lp-card" style="background:${card};color:${ink}"><p class="lp-h">${t("task_title", "Задание")}</p><div style="color:${muted}">Пройти 50 км за время турнира</div></div>`,
      participation: () =>
        `<div class="lp-card" style="background:${card};color:${ink};border:1px solid ${border}"><p class="lp-h">${
          access === "code" || access === "private" ? "Вход по коду" : fmt === "team" ? "Командный турнир" : "Участие"
        }</p><div style="color:${muted}">${
          access === "code" || access === "private" ? "Введите код от организатора, чтобы участвовать." : "Присоединяйтесь и попадите в рейтинг."
        }</div><div class="lp-btn" style="background:${s.accent}">${escapeHtml(joinLabel)}</div></div>`,
      progress: () =>
        `<div class="lp-card" style="background:${progressBg};color:#fff"><p class="lp-h">${t("progress_title", "Ваш прогресс")}</p>` +
        `<div style="display:flex;justify-content:space-between;font:800 18px Inter,sans-serif"><span>#12</span><span>24,5 км</span></div>` +
        `<div style="height:6px;border-radius:9px;background:rgba(255,255,255,.25);margin-top:8px"><div style="width:48%;height:100%;border-radius:9px;background:#fff"></div></div></div>`,
      sponsor: () => {
        const sp = s.sponsor;
        if (!sp.image && !sp.title && !sp.text) return "";
        const spImg = sp.image ? eventBannerPreviewUrl(sp.image) : "";
        return (
          `<div class="lp-card" style="background:${card};color:${ink};border:1px solid ${border}">` +
          `<div style="font:700 10px Inter,sans-serif;color:${muted};text-transform:uppercase;letter-spacing:.06em">Партнёр турнира</div>` +
          (spImg ? `<div style="height:70px;margin:6px 0;border-radius:10px;background:#fff url('${spImg}') center/contain no-repeat"></div>` : "") +
          (sp.title ? `<p class="lp-h" style="margin-top:4px">${escapeHtml(sp.title)}</p>` : "") +
          (sp.text ? `<div style="color:${muted}">${escapeHtml(sp.text)}</div>` : "") +
          (sp.url ? `<div class="lp-btn" style="background:${s.accent}">${escapeHtml(sp.button_text || "Подробнее")}</div>` : "") +
          `</div>`
        );
      },
      tabs: () => {
        const lb = s.default_tab === "leaderboard";
        const tabBg = dark ? "rgba(255,255,255,.08)" : "#E5E7EB";
        const on = `background:${dark ? "rgba(255,255,255,.18)" : "#fff"};color:${ink}`;
        const off = `color:${muted}`;
        let body = "";
        if (lb) {
          if (s.podium) {
            body +=
              `<div class="lp-podium"><div style="height:56px;background:#9CA3AF">2</div>` +
              `<div style="height:76px;background:${s.accent}">1</div><div style="height:44px;background:#B45309">3</div></div>`;
          }
          const rows = s.podium ? [4, 5] : [1, 2, 3];
          body += rows
            .map((n) => `<div class="lp-row" style="background:${card};color:${ink};border:1px solid ${border}"><span>${n}. Игрок ${n}</span><span>${(60 - n * 7).toFixed(1)} км</span></div>`)
            .join("");
        } else {
          body = `<div class="lp-card" style="background:${card};color:${ink};border:1px solid ${border}"><p class="lp-h">🏅 Медаль финишера</p><div style="color:${muted}">За 1–10 место</div></div>`;
        }
        return (
          `<div class="lp-tabs" style="background:${tabBg}"><div style="${lb ? off : on}">${t("rewards_tab", "Награды")}</div>` +
          `<div style="${lb ? on : off}">${t("leaderboard_tab", "Лидерборд")}</div></div>${body}`
        );
      },
    };

    const heroTitle = s.hero_show_title
      ? `<div style="text-align:${align}"><div style="font:800 18px Inter,sans-serif;color:#fff;line-height:1.2">${
          s.title_icon ? `${escapeHtml(s.title_icon)} ` : ""
        }${title}</div>${s.show_timer ? `<div style="font:600 11px Inter,sans-serif;color:rgba(255,255,255,.85);margin-top:4px">⏱ До конца: 5 д 12 ч</div>` : ""}</div>`
      : s.show_timer
        ? `<div style="text-align:${align}"><span class="lp-pill">⏱ 5 д 12 ч</span></div>`
        : "<div></div>";
    const hero =
      `<div class="lp-hero" style="height:${heroH}px;background-color:${heroBg};${img ? `background-image:linear-gradient(rgba(0,0,0,${overlay * 0.15}),rgba(0,0,0,${overlay})),url('${img}')` : ""}">` +
      `<div><span class="lp-pill" style="background:#22C55E">Идёт</span></div>${heroTitle}</div>`;

    const order = s.sections.filter((x) => x.visible || x.key === "participation").map((x) => x.key);
    root.style.background = bg;
    root.innerHTML =
      `<div style="padding:10px 12px 0;color:${ink};font:600 12px Inter,sans-serif">‹ Назад</div>` +
      hero +
      order.map((k) => blocks[k]?.() || "").join("") +
      `<div style="height:20px"></div>`;
  }

  function initLookEditor() {
    if (!lookEl("admin-look-preview")) return;
    lookState = freshLookState();
    writeLookForm();
    const card = lookEl("admin-evt-look-card");
    const onChange = (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement) || target.id === "admin-look-sp-file") return;
      if (target.dataset.lookSecVis != null) {
        const i = Number(target.dataset.lookSecVis);
        lookState.sections[i].visible = /** @type {HTMLInputElement} */ (target).checked;
        renderLookControls();
        return;
      }
      if (!target.id?.startsWith("admin-look-")) return;
      readLookForm();
      if (["admin-look-accent", "admin-look-bg", "admin-look-bg2", "admin-look-progress", "admin-look-progress2", "admin-look-surface", "admin-look-progress-style"].includes(target.id)) {
        lookState.preset = "";
      }
      renderLookControls();
    };
    card?.addEventListener("input", onChange);
    card?.addEventListener("change", onChange);
    card?.addEventListener("click", (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest("button") : null;
      if (!btn) return;
      if (btn.dataset.lookPreset) {
        const p = LOOK_PRESETS[btn.dataset.lookPreset];
        if (!p) return;
        readLookForm();
        const { name: _n, texts, layout: presetLayout, ...colors } = p;
        Object.assign(lookState, colors, {
          preset: btn.dataset.lookPreset,
          layout: presetLayout || (btn.dataset.lookPreset === "smelost" ? "smelost" : ""),
          bg_gradient: p.background !== p.background2,
        });
        if (texts) lookState.texts = { ...lookState.texts, ...texts };
        writeLookForm();
        return;
      }
      const up = btn.dataset.lookSecUp;
      const down = btn.dataset.lookSecDown;
      if (up != null || down != null) {
        const i = Number(up ?? down);
        const j = up != null ? i - 1 : i + 1;
        const arr = lookState.sections;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        renderLookControls();
      }
    });
    lookEl("admin-look-reset")?.addEventListener("click", () => {
      if (!confirm("Вернуть стандартное оформление? Изменения применятся после «Сохранить турнир».")) return;
      lookState = freshLookState();
      writeLookForm();
    });
    lookEl("admin-look-sp-upload")?.addEventListener("click", () => uploadSponsorImage());
    for (const el of [evtTitle, evtDesc, evtBanner, evtDetailBanner, evtBg, evtFormat, evtAccess, evtVisibility]) {
      el?.addEventListener("input", () => renderLookPreview());
      el?.addEventListener("change", () => renderLookPreview());
    }
  }

  async function uploadSponsorImage() {
    const fileInput = lookEl("admin-look-sp-file");
    const btn = lookEl("admin-look-sp-upload");
    const file = fileInput?.files?.[0];
    if (!file) {
      showEvtError("Выберите картинку партнёра.");
      return;
    }
    showEvtError("");
    const fd = new FormData();
    fd.append("kind", "sponsor");
    fd.append("file", file, file.name);
    if (btn) btn.disabled = true;
    try {
      const { res, data } = await adminUpload("/api/admin/upload/event_media", fd);
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось загрузить картинку."));
        return;
      }
      readLookForm();
      lookState.sponsor.image = data.filename || "";
      writeLookForm();
      if (fileInput) fileInput.value = "";
      showEvtOk("Картинка партнёра загружена — не забудьте «Сохранить турнир».");
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  const REWARD_RARITY_LABELS = {
    common: "Обычная",
    rare: "Редкая",
    epic: "Эпическая",
    legendary: "Легендарная",
  };

  function tsToEventInput(ts) {
    if (!ts) return "";
    try {
      const d = new Date(Number(ts) * 1000);
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  }

  function showEvtError(msg) {
    if (!evtError) return;
    evtError.textContent = msg || "";
    evtError.style.display = msg ? "block" : "none";
  }

  function showEvtOk(msg) {
    if (!evtMsg) return;
    evtMsg.textContent = msg || "";
    evtMsg.hidden = !msg;
  }

  function clearEventForm() {
    selectedEventId = null;
    eventTasksCache = [];
    eventRewardsCache = [];
    if (evtCurId) evtCurId.textContent = "—";
    if (evtId) evtId.value = "";
    if (evtStatus) evtStatus.value = "draft";
    if (evtTitle) evtTitle.value = "";
    if (evtSubtitle) evtSubtitle.value = "";
    if (evtDesc) evtDesc.value = "";
    if (evtAnn) evtAnn.value = "";
    if (evtStart) evtStart.value = "";
    if (evtEnd) evtEnd.value = "";
    if (evtBanner) evtBanner.value = "";
    if (evtDetailBanner) evtDetailBanner.value = "";
    if (evtBg) evtBg.value = "";
    if (evtLink) evtLink.value = "";
    if (evtLbEn) evtLbEn.value = "1";
    if (evtLbMetric) evtLbMetric.value = "";
    if (evtLbAgg) evtLbAgg.value = "sum";
    if (evtRules) evtRules.value = "";
    if (evtFormat) evtFormat.value = "solo";
    setAccessForm("auto");
    eventCodesCache = [];
    if (evtCodesTbody) evtCodesTbody.innerHTML = "";
    if (evtCodeUsers) evtCodeUsers.innerHTML = "";
    showCodesOk("");
    showCodesError("");
    if (lookEl("admin-look-preview")) {
      lookState = freshLookState();
      writeLookForm();
    }
    if (evtTeamMax) evtTeamMax.value = "";
    if (evtTeamMin) evtTeamMin.value = "";
    if (evtTeamBy) evtTeamBy.value = "users";
    if (evtTeamLock) evtTeamLock.value = "";
    if (evtDist) evtDist.value = "workouts";
    if (evtTeamsCard) evtTeamsCard.hidden = true;
    syncParticipationFields();
    if (evtBannerFile) evtBannerFile.value = "";
    if (evtDetailBannerFile) evtDetailBannerFile.value = "";
    document.querySelectorAll(".admin-program-item.is-selected").forEach((el) => {
      el.classList.remove("is-selected");
    });
    renderEventTasks();
    renderEventRewards();
    if (evtResultsMeta) evtResultsMeta.textContent = "Выберите или сохраните турнир.";
    if (evtResultsTbody) {
      evtResultsTbody.innerHTML = "<tr><td colspan=\"5\" class=\"muted\">Выберите турнир и нажмите «Обновить итоги».</td></tr>";
    }
    resetEventTaskForm();
    resetEventRewardForm();
  }

  function fillEventForm(e) {
    selectedEventId = e.id;
    if (evtCurId) evtCurId.textContent = e.id || "—";
    if (evtId) evtId.value = e.id || "";
    if (evtStatus) evtStatus.value = e.status || "draft";
    if (evtTitle) evtTitle.value = e.title || "";
    if (evtSubtitle) evtSubtitle.value = e.subtitle || "";
    if (evtDesc) evtDesc.value = e.description || "";
    if (evtAnn) evtAnn.value = tsToEventInput(e.announcement_ts);
    if (evtStart) evtStart.value = tsToEventInput(e.start_ts);
    if (evtEnd) evtEnd.value = tsToEventInput(e.end_ts);
    if (evtBanner) evtBanner.value = e.banner_image_url || "";
    if (evtDetailBanner) evtDetailBanner.value = e.detail_banner_image_url || "";
    if (evtBg) evtBg.value = e.banner_bg_color || "";
    if (evtLink) evtLink.value = e.deep_link || "";
    if (evtLbEn) evtLbEn.value = e.leaderboard_enabled ? "1" : "0";
    if (evtLbMetric) evtLbMetric.value = e.leaderboard_metric || "";
    if (evtLbAgg) evtLbAgg.value = e.leaderboard_agg || "sum";
    const rulesObj = { ...(e.rules && typeof e.rules === "object" ? e.rules : {}) };
    if (evtFormat) evtFormat.value = e.event_format || "solo";
    setAccessForm(e.access_mode);
    if (lookEl("admin-look-preview")) {
      lookState = lookStateFromAppearance(e.appearance);
      writeLookForm();
    }
    if (evtTeamMax) evtTeamMax.value = rulesObj.team_size_max != null ? String(rulesObj.team_size_max) : "";
    if (evtTeamMin) evtTeamMin.value = rulesObj.team_size_min != null ? String(rulesObj.team_size_min) : "";
    if (evtTeamBy) evtTeamBy.value = rulesObj.teams_created_by || "users";
    if (evtTeamLock) {
      evtTeamLock.value = rulesObj.team_switch_lock_hours != null ? String(rulesObj.team_switch_lock_hours) : "";
    }
    if (evtDist) evtDist.value = rulesObj.distance_source || "workouts";
    for (const k of PARTICIPATION_RULE_KEYS) delete rulesObj[k];
    if (evtRules) {
      evtRules.value = Object.keys(rulesObj).length ? JSON.stringify(rulesObj, null, 2) : "";
    }
    syncParticipationFields();
    document.querySelectorAll(".admin-program-item").forEach((el) => {
      el.classList.toggle("is-selected", el.dataset.id === e.id);
    });
    loadEventTasks();
    loadEventRewards();
    loadEventResults();
    loadEventTeams();
    loadEventCodes();
  }

  async function loadEvents() {
    if (!evtList) return;
    evtList.innerHTML = "";
    showEvtError("");
    try {
      const { res, data } = await adminFetch("/api/admin/events");
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось загрузить турниры. Проверьте ADMIN_UI_TOKEN в server/.env."));
        return;
      }
      const events = data.events || [];
      if (!events.length) {
        evtList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Турниров ещё нет.</p>";
        return;
      }
      for (const e of events) {
        const el = document.createElement("div");
        el.className = "admin-program-item";
        el.dataset.id = e.id;
        const statusLabel = EVENT_STATUS_LABELS[e.status] || e.status || "";
        const dates = [e.start_ts ? `старт ${tsToEventInput(e.start_ts)}` : "", e.end_ts ? `конец ${tsToEventInput(e.end_ts)}` : ""]
          .filter(Boolean)
          .join(" · ");
        const accessLabel =
          { code: `по коду (${e.codes_count ?? 0})`, private: `скрытый, по коду (${e.codes_count ?? 0})`, opt_in: "по кнопке" }[e.access_mode] || "";
        el.innerHTML =
          `<div class="admin-program-item__title">${escapeHtml(e.title || e.id)}</div>` +
          `<div class="admin-program-item__meta">${escapeHtml(statusLabel)}${accessLabel ? ` · ${escapeHtml(accessLabel)}` : ""}${dates ? ` · ${escapeHtml(dates)}` : ""}</div>`;
        el.addEventListener("click", () => fillEventForm(e));
        evtList.appendChild(el);
      }
      if (selectedEventId) {
        const found = events.find((x) => x.id === selectedEventId);
        if (found) fillEventForm(found);
      }
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    }
  }

  async function saveEvent() {
    showEvtError("");
    showEvtOk("");
    let rules = {};
    const rulesRaw = (evtRules?.value || "").trim();
    if (rulesRaw) {
      try {
        rules = JSON.parse(rulesRaw);
      } catch (e) {
        showEvtError(`Ошибка JSON в правилах: ${e.message}`);
        return;
      }
    }
    for (const k of PARTICIPATION_RULE_KEYS) delete rules[k];
    const eventFormat = evtFormat?.value || "solo";
    const accessMode = accessModeFromForm();
    if (eventFormat === "team") {
      const max = intOrNull(evtTeamMax);
      const min = intOrNull(evtTeamMin);
      const lock = intOrNull(evtTeamLock);
      if (max != null) rules.team_size_max = max;
      if (min != null) rules.team_size_min = min;
      if (lock != null) rules.team_switch_lock_hours = lock;
      rules.teams_created_by = evtTeamBy?.value || "users";
      if (max != null && min != null && min > max) {
        showEvtError("Минимум участников команды больше максимума.");
        return;
      }
    }
    if ((evtLbMetric?.value || "") === "distance_meters") {
      rules.distance_source = evtDist?.value || "workouts";
    }
    const body = {
      id: (evtId?.value || "").trim() || null,
      kind: "tournament",
      title: (evtTitle?.value || "").trim(),
      subtitle: (evtSubtitle?.value || "").trim() || null,
      description: (evtDesc?.value || "").trim() || null,
      status: evtStatus?.value || "draft",
      announcement_at: (evtAnn?.value || "").trim() || null,
      start_at: (evtStart?.value || "").trim() || null,
      end_at: (evtEnd?.value || "").trim() || null,
      banner_image_url: (evtBanner?.value || "").trim() || null,
      detail_banner_image_url: (evtDetailBanner?.value || "").trim() || null,
      banner_bg_color: (evtBg?.value || "").trim() || null,
      deep_link: (evtLink?.value || "").trim() || null,
      leaderboard_enabled: evtLbEn?.value === "1",
      leaderboard_metric: (evtLbMetric?.value || "").trim() || null,
      leaderboard_agg: evtLbAgg?.value || "sum",
      rules,
      event_format: eventFormat,
      access_mode: accessMode,
    };
    if (lookState) {
      readLookForm();
      body.appearance = appearanceFromLook();
    }
    if (!body.title) {
      showEvtError("Укажите название турнира.");
      return;
    }
    if (evtSaveBtn) evtSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/events/upsert", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось сохранить турнир."));
        return;
      }
      showEvtOk(
        `Сохранено: ${data.id || body.id || ""}${data.access_code ? ` · код для входа: ${data.access_code} (все коды — в карточке «Коды турнира»)` : ""}`,
      );
      selectedEventId = data.id || body.id;
      await loadEvents();
      await loadEventTasks();
      await loadEventRewards();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    } finally {
      if (evtSaveBtn) evtSaveBtn.disabled = false;
    }
  }

  function currentEventIdOrForm() {
    return selectedEventId || (evtId?.value || "").trim();
  }

  function renderEventTasks() {
    if (!evtTasksList) return;
    if (!currentEventIdOrForm()) {
      evtTasksList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Выберите или сохраните турнир.</p>";
      return;
    }
    if (!eventTasksCache.length) {
      evtTasksList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Задач пока нет.</p>";
      return;
    }
    evtTasksList.innerHTML = "";
    for (const t of eventTasksCache) {
      const el = document.createElement("div");
      el.className = "admin-user-item";
      const metric = METRIC_LABELS[t.metric] || t.metric || "";
      el.innerHTML =
        `<div><div class="admin-user-item__title">${escapeHtml(t.title || t.id)}</div>` +
        `<div class="admin-user-item__meta">${escapeHtml(metric)} · ${escapeHtml(t.agg || "sum")}` +
        `${t.target_value != null ? ` · цель ${t.target_value}` : ""}</div></div>` +
        `<div style="display:flex;gap:8px;flex-wrap:wrap">` +
        `<button type="button" class="btn btn--ghost btn--sm" data-evt-task-edit="${escapeHtml(t.id)}">Изменить</button>` +
        `<button type="button" class="btn btn--ghost btn--sm btn--danger-outline" data-evt-task-del="${escapeHtml(t.id)}">Удалить</button>` +
        `</div>`;
      evtTasksList.appendChild(el);
    }
  }

  function resetEventTaskForm() {
    if (evtTaskId) evtTaskId.value = "";
    if (evtTaskTitle) evtTaskTitle.value = "";
    if (evtTaskMetric) evtTaskMetric.value = "xp_gained";
    if (evtTaskAgg) evtTaskAgg.value = "sum";
    if (evtTaskTarget) evtTaskTarget.value = "";
    if (evtTaskSort) evtTaskSort.value = String(eventTasksCache.length);
    if (evtTaskVisible) evtTaskVisible.checked = true;
    if (evtTaskSaveBtn) evtTaskSaveBtn.textContent = "Добавить задачу";
  }

  function fillEventTaskForm(t) {
    if (evtTaskId) evtTaskId.value = t.id || "";
    if (evtTaskTitle) evtTaskTitle.value = t.title || "";
    if (evtTaskMetric) evtTaskMetric.value = t.metric || "xp_gained";
    if (evtTaskAgg) evtTaskAgg.value = t.agg || "sum";
    if (evtTaskTarget) evtTaskTarget.value = t.target_value != null ? String(t.target_value) : "";
    if (evtTaskSort) evtTaskSort.value = String(t.sort_order ?? 0);
    if (evtTaskVisible) evtTaskVisible.checked = t.visible !== false;
    if (evtTaskSaveBtn) evtTaskSaveBtn.textContent = "Сохранить задачу";
  }

  async function loadEventTasks() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      eventTasksCache = [];
      renderEventTasks();
      return;
    }
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(eid)}/tasks`);
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось загрузить задачи."));
        return;
      }
      eventTasksCache = data.tasks || [];
      renderEventTasks();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    }
  }

  async function saveEventTask() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      showEvtError("Сначала сохраните турнир.");
      return;
    }
    const title = (evtTaskTitle?.value || "").trim();
    if (!title) {
      showEvtError("Укажите название задачи.");
      return;
    }
    const targetRaw = (evtTaskTarget?.value || "").trim();
    const body = {
      id: (evtTaskId?.value || "").trim() || null,
      event_id: eid,
      title,
      metric: evtTaskMetric?.value || "xp_gained",
      agg: evtTaskAgg?.value || "sum",
      target_value: targetRaw ? Number(targetRaw) : null,
      sort_order: Number(evtTaskSort?.value || 0),
      visible: evtTaskVisible?.checked !== false,
    };
    showEvtError("");
    if (evtTaskSaveBtn) evtTaskSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/events/tasks/upsert", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось сохранить задачу."));
        return;
      }
      showEvtOk("Задача сохранена.");
      resetEventTaskForm();
      await loadEventTasks();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    } finally {
      if (evtTaskSaveBtn) evtTaskSaveBtn.disabled = false;
    }
  }

  async function deleteEventTask(taskId) {
    if (!confirm(`Удалить задачу ${taskId}?`)) return;
    showEvtError("");
    try {
      const { res, data } = await adminFetch(`/api/admin/events/tasks/${encodeURIComponent(taskId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось удалить задачу."));
        return;
      }
      showEvtOk("Задача удалена.");
      resetEventTaskForm();
      await loadEventTasks();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    }
  }

  function renderEventRewards() {
    if (!evtRewardsList) return;
    if (!currentEventIdOrForm()) {
      evtRewardsList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Выберите или сохраните турнир.</p>";
      return;
    }
    if (!eventRewardsCache.length) {
      evtRewardsList.innerHTML = "<p class=\"muted\" style=\"font-size:13px\">Наград пока нет.</p>";
      return;
    }
    evtRewardsList.innerHTML = "";
    for (const r of eventRewardsCache) {
      let place = "любое место";
      if (r.place_from != null || r.place_to != null) {
        const a = r.place_from != null ? r.place_from : r.place_to;
        const b = r.place_to != null ? r.place_to : r.place_from;
        place = a === b ? `#${a}` : `#${a}–${b}`;
      }
      const extra =
        r.reward_type === "xp"
          ? `+${r.reward_amount || 0} XP`
          : `${r.reward_type || ""}${r.reward_key ? `: ${r.reward_key}` : ""}`;
      const rarity = REWARD_RARITY_LABELS[(r.rarity || "common").toLowerCase()] || (r.rarity || "Обычная");
      const el = document.createElement("div");
      el.className = "admin-user-item";
      el.innerHTML =
        `<div><div class="admin-user-item__title">${escapeHtml(r.title || r.id)}</div>` +
        `<div class="admin-user-item__meta">${escapeHtml(place)} · ${escapeHtml(extra)} · редкость: ${escapeHtml(rarity)}</div></div>` +
        `<div style="display:flex;gap:8px;flex-wrap:wrap">` +
        `<button type="button" class="btn btn--ghost btn--sm" data-evt-reward-edit="${escapeHtml(r.id)}">Изменить</button>` +
        `<button type="button" class="btn btn--ghost btn--sm btn--danger-outline" data-evt-reward-del="${escapeHtml(r.id)}">Удалить</button>` +
        `</div>`;
      evtRewardsList.appendChild(el);
    }
  }

  function resetEventRewardForm() {
    if (evtRewardId) evtRewardId.value = "";
    if (evtRewardTitle) evtRewardTitle.value = "";
    if (evtRewardType) evtRewardType.value = "character";
    if (evtRewardXp) evtRewardXp.value = "";
    if (evtRewardKey) evtRewardKey.value = "";
    if (evtRewardPlaceFrom) evtRewardPlaceFrom.value = "1";
    if (evtRewardPlaceTo) evtRewardPlaceTo.value = "1";
    if (evtRewardImage) evtRewardImage.value = lastRewardImageFilename || "";
    if (evtRewardDesc) evtRewardDesc.value = "";
    if (evtRewardBadge) evtRewardBadge.value = "virtual";
    if (evtRewardRarity) evtRewardRarity.value = "common";
    if (evtRewardImageFile) evtRewardImageFile.value = "";
    if (evtRewardSaveBtn) evtRewardSaveBtn.textContent = "Добавить награду";
  }

  function fillEventRewardForm(r) {
    if (evtRewardId) evtRewardId.value = r.id || "";
    if (evtRewardTitle) evtRewardTitle.value = r.title || "";
    if (evtRewardType) evtRewardType.value = r.reward_type || "character";
    if (evtRewardXp) evtRewardXp.value = r.reward_amount != null ? String(r.reward_amount) : "";
    if (evtRewardKey) evtRewardKey.value = r.reward_key || "";
    if (evtRewardPlaceFrom) evtRewardPlaceFrom.value = r.place_from != null ? String(r.place_from) : "";
    if (evtRewardPlaceTo) evtRewardPlaceTo.value = r.place_to != null ? String(r.place_to) : "";
    if (evtRewardImage) evtRewardImage.value = r.image_url || "";
    if (evtRewardDesc) evtRewardDesc.value = r.description || "";
    if (evtRewardBadge) evtRewardBadge.value = r.reward_badge || "virtual";
    if (evtRewardRarity) evtRewardRarity.value = r.rarity || "common";
    if (evtRewardSaveBtn) evtRewardSaveBtn.textContent = "Сохранить награду";
  }

  async function loadEventRewards() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      eventRewardsCache = [];
      renderEventRewards();
      return;
    }
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(eid)}/rewards`);
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось загрузить награды."));
        return;
      }
      eventRewardsCache = data.rewards || [];
      renderEventRewards();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    }
  }

  async function saveEventReward() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      showEvtError("Сначала сохраните турнир.");
      return;
    }
    const title = (evtRewardTitle?.value || "").trim();
    if (!title) {
      showEvtError("Укажите название награды.");
      return;
    }
    const rewardType = evtRewardType?.value || "character";
    const placeFromRaw = (evtRewardPlaceFrom?.value || "").trim();
    const placeToRaw = (evtRewardPlaceTo?.value || "").trim();
    const place_from = placeFromRaw ? Number(placeFromRaw) : null;
    const place_to = placeToRaw ? Number(placeToRaw) : place_from;
    let reward_amount = null;
    let reward_key = null;
    if (rewardType === "xp") {
      reward_amount = Number(evtRewardXp?.value || 0);
    } else {
      reward_key = (evtRewardKey?.value || "").trim() || null;
    }
    const body = {
      id: (evtRewardId?.value || "").trim() || null,
      event_id: eid,
      title,
      reward_type: rewardType,
      reward_key,
      reward_amount,
      place_from,
      place_to,
      image_url: (evtRewardImage?.value || "").trim() || null,
      description: (evtRewardDesc?.value || "").trim() || null,
      reward_badge: evtRewardBadge?.value || "virtual",
      rarity: evtRewardRarity?.value || "common",
    };
    showEvtError("");
    if (evtRewardSaveBtn) evtRewardSaveBtn.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/events/rewards/upsert", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось сохранить награду."));
        return;
      }
      showEvtOk("Награда сохранена.");
      resetEventRewardForm();
      await loadEventRewards();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    } finally {
      if (evtRewardSaveBtn) evtRewardSaveBtn.disabled = false;
    }
  }

  async function deleteEventReward(rewardId) {
    if (!confirm(`Удалить награду ${rewardId}?`)) return;
    showEvtError("");
    try {
      const { res, data } = await adminFetch(`/api/admin/events/rewards/${encodeURIComponent(rewardId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось удалить награду."));
        return;
      }
      showEvtOk("Награда удалена.");
      resetEventRewardForm();
      await loadEventRewards();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    }
  }

  function renderEventResultsRows(rows) {
    if (!evtResultsTbody) return;
    if (!rows?.length) {
      evtResultsTbody.innerHTML = "<tr><td colspan=\"5\" class=\"muted\">Участников пока нет.</td></tr>";
      return;
    }
    const lines = [];
    for (const r of rows) {
      const user = r.user || {};
      const profile = [
        user.first_name || "",
        user.last_name || "",
      ].join(" ").trim() || user.display_name || "—";
      const identity = [user.email, user.login_username, user.phone_number].filter(Boolean).join(" · ");
      const teamLine = r.team_name
        ? `<div class="cell-muted">команда: ${escapeHtml(String(r.team_name))}</div>`
        : "";
      const rewards = Array.isArray(r.rewards)
        ? r.rewards
            .map((w) => {
              const rarity = REWARD_RARITY_LABELS[(w.rarity || "common").toLowerCase()] || (w.rarity || "Обычная");
              const status = w.status ? ` (${w.status})` : "";
              return `${escapeHtml(w.title || w.reward_id || "Награда")} · ${escapeHtml(rarity)}${escapeHtml(status)}`;
            })
            .join("<br>")
        : "—";
      lines.push(
        `<tr>` +
          `<td>#${escapeHtml(String(r.rank ?? "—"))}</td>` +
          `<td>${escapeHtml(r.display_name || "—")}<div class="cell-muted">tg: ${escapeHtml(String(r.telegram_id || "—"))}</div>${teamLine}</td>` +
          `<td>${escapeHtml(String(r.score ?? 0))}</td>` +
          `<td>${rewards || "—"}</td>` +
          `<td>${escapeHtml(profile)}<div class="cell-muted">${escapeHtml(identity || "—")}</div></td>` +
        `</tr>`
      );
    }
    evtResultsTbody.innerHTML = lines.join("");
  }

  async function loadEventResults() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      if (evtResultsMeta) evtResultsMeta.textContent = "Сначала выберите или сохраните турнир.";
      renderEventResultsRows([]);
      return;
    }
    if (evtResultsMeta) evtResultsMeta.textContent = "Загрузка...";
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(eid)}/results`);
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось загрузить итоги турнира."));
        if (evtResultsMeta) evtResultsMeta.textContent = "Ошибка загрузки.";
        return;
      }
      const participants = data.participants ?? 0;
      const metric = data.event?.metric || "";
      const agg = data.event?.agg || "";
      const finalizedTs = data.event?.finalized_ts ? formatTs(data.event.finalized_ts) : "ещё не финализирован";
      if (evtResultsMeta) {
        evtResultsMeta.textContent = `Участников: ${participants} · Метрика: ${metric || "—"} (${agg || "sum"}) · Финализация: ${finalizedTs}`;
      }
      renderEventResultsRows(data.rows || []);
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
      if (evtResultsMeta) evtResultsMeta.textContent = "Сервер недоступен.";
    }
  }

  async function finalizeEventRewards() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      showEvtError("Сначала выберите или сохраните турнир.");
      return;
    }
    if (!confirm("Финализировать турнир и выдать награды победителям?")) return;
    showEvtError("");
    if (evtFinalizeBtn) evtFinalizeBtn.disabled = true;
    try {
      const { res, data } = await adminFetch(`/api/admin/events/${encodeURIComponent(eid)}/finalize`, {
        method: "POST",
      });
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось финализировать турнир."));
        return;
      }
      const participants = data.participants ?? 0;
      if (data.already_finalized) {
        showEvtOk(`Турнир уже финализирован. Участников: ${participants}`);
      } else {
        showEvtOk(`Турнир финализирован. Награды начислены. Участников: ${participants}`);
      }
      await loadEvents();
      await loadEventResults();
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    } finally {
      if (evtFinalizeBtn) evtFinalizeBtn.disabled = false;
    }
  }

  async function downloadEventParticipantsXlsx() {
    const eid = currentEventIdOrForm();
    if (!eid) {
      showEvtError("Сначала выберите или сохраните турнир.");
      return;
    }
    showEvtError("");
    if (evtParticipantsXlsxBtn) evtParticipantsXlsxBtn.disabled = true;
    try {
      await adminDownload(
        `/api/admin/events/${encodeURIComponent(eid)}/participants.xlsx`,
        "kisfit_event_participants.xlsx"
      );
      showEvtOk("Файл с участниками турнира скачан.");
    } catch (err) {
      if (err.message !== "unauthorized") {
        showEvtError(err.message || "Не удалось скачать участников турнира.");
      }
    } finally {
      if (evtParticipantsXlsxBtn) evtParticipantsXlsxBtn.disabled = false;
    }
  }

  async function uploadEventMedia(kind) {
    const uploadKind =
      kind === "banner" || kind === "home_banner"
        ? "home_banner"
        : kind === "detail_banner"
          ? "detail_banner"
          : kind;
    let fileInput = evtRewardImageFile;
    let targetField = evtRewardImage;
    let btn = evtUploadRewardBtn;
    if (uploadKind === "home_banner") {
      fileInput = evtBannerFile;
      targetField = evtBanner;
      btn = evtUploadBannerBtn;
    } else if (uploadKind === "detail_banner") {
      fileInput = evtDetailBannerFile;
      targetField = evtDetailBanner;
      btn = evtUploadDetailBannerBtn;
    }
    const file = fileInput?.files?.[0];
    if (!file) {
      showEvtError("Выберите файл для загрузки.");
      return;
    }
    showEvtError("");
    const fd = new FormData();
    fd.append("kind", uploadKind);
    fd.append("file", file, file.name);
    if (btn) btn.disabled = true;
    try {
      const { res, data } = await adminUpload("/api/admin/upload/event_media", fd);
      if (!res.ok) {
        showEvtError(apiErrorMessage(data, "Не удалось загрузить файл."));
        return;
      }
      const filename = data.filename || "";
      if (targetField) targetField.value = filename;
      if (uploadKind === "reward") lastRewardImageFilename = filename;
      const sizeHint = data.recommended_size ? ` (${data.recommended_size})` : "";
      showEvtOk(`Файл загружен: ${filename}${sizeHint}`);
      if (fileInput) fileInput.value = "";
    } catch (err) {
      if (err.message !== "unauthorized") showEvtError("Сервер недоступен.");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function showMerchError(msg) {
    if (!merchError) return;
    merchError.textContent = msg || "";
    merchError.style.display = msg ? "block" : "none";
  }

  function showMerchOk(msg) {
    if (!merchMsg) return;
    merchMsg.textContent = msg || "";
    merchMsg.hidden = !msg;
  }

  const MERCH_STATUS_LABELS = {
    new: "Новая",
    processing: "В работе",
    done: "Выполнена",
    cancelled: "Отменена",
  };

  function merchUserCell(o) {
    const u = o.user || {};
    const parts = [];
    const dn = o.user_display_name || u.display_name;
    const email = o.user_email || u.email;
    const login = o.user_login || u.login_username;
    if (dn) parts.push(escapeHtml(dn));
    if (email) parts.push(escapeHtml(email));
    if (login) parts.push(escapeHtml(login));
    const meta = parts.length ? parts.join("<br>") : "—";
    const tg = u.telegram_id ?? o.telegram_id;
    const xpLine =
      u.xp != null || u.level != null
        ? `XP: ${escapeHtml(String(u.xp ?? "—"))}, ур. ${escapeHtml(String(u.level ?? "—"))}`
        : "";
    return `${meta}<div class="cell-muted">tg: ${escapeHtml(String(tg || "—"))}${xpLine ? ` · ${xpLine}` : ""}</div>`;
  }

  function merchDetailRow(label, value) {
    const v = value == null || value === "" ? "—" : String(value);
    return `<div class="admin-detail-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(v)}</dd></div>`;
  }

  function buildMerchDetailHtml(o) {
    const u = o.user || {};
    const chunks = [];
    chunks.push("<h4 class=\"admin-detail-h\">Заявка</h4><dl class=\"admin-detail-grid\">");
    chunks.push(merchDetailRow("ID", o.id));
    chunks.push(merchDetailRow("Дата", formatTs(o.created_ts)));
    chunks.push(merchDetailRow("Обновлена", formatTs(o.updated_ts)));
    chunks.push(merchDetailRow("Статус", MERCH_STATUS_LABELS[o.status] || o.status));
    chunks.push(merchDetailRow("Товар", o.item_title || o.item_id));
    chunks.push(merchDetailRow("XP", o.xp_price));
    chunks.push(merchDetailRow("Источник", o.source === "manual" ? "Вручную" : "Приложение"));
    chunks.push(merchDetailRow("Device ID", o.device_id));
    chunks.push("</dl>");

    chunks.push("<h4 class=\"admin-detail-h\">Контакты заявки</h4><dl class=\"admin-detail-grid\">");
    chunks.push(merchDetailRow("Телефон", o.contact_phone));
    chunks.push(merchDetailRow("Адрес / доставка", o.contact_address));
    chunks.push(merchDetailRow("Заметка админа", o.admin_note));
    chunks.push("</dl>");

    chunks.push("<h4 class=\"admin-detail-h\">Снимок в заявке</h4><dl class=\"admin-detail-grid\">");
    chunks.push(merchDetailRow("Отображаемое имя", o.user_display_name));
    chunks.push(merchDetailRow("Email", o.user_email));
    chunks.push(merchDetailRow("Логин", o.user_login));
    chunks.push("</dl>");

    chunks.push("<h4 class=\"admin-detail-h\">Профиль пользователя</h4><dl class=\"admin-detail-grid\">");
    chunks.push(merchDetailRow("Telegram ID", u.telegram_id ?? o.telegram_id));
    chunks.push(merchDetailRow("Имя", u.first_name));
    chunks.push(merchDetailRow("Фамилия", u.last_name));
    chunks.push(merchDetailRow("Username", u.username));
    chunks.push(merchDetailRow("Display name", u.display_name));
    chunks.push(merchDetailRow("Email", u.email));
    chunks.push(merchDetailRow("Логин", u.login_username));
    chunks.push(merchDetailRow("XP", u.xp));
    chunks.push(merchDetailRow("Уровень", u.level));
    chunks.push(merchDetailRow("Регистрация", formatTs(u.created_ts)));
    chunks.push(merchDetailRow("Обновлён", formatTs(u.last_update_ts)));
    chunks.push("</dl>");

    return chunks.join("");
  }

  function openMerchDetailModal() {
    if (!merchDetailModal) return;
    merchDetailModal.classList.add("is-open");
    merchDetailModal.removeAttribute("hidden");
    merchDetailModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeMerchDetailModal() {
    if (!merchDetailModal) return;
    merchDetailModal.classList.remove("is-open");
    merchDetailModal.setAttribute("hidden", "");
    merchDetailModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  async function showMerchOrderDetail(orderId, cached) {
    openMerchDetailModal();
    if (merchDetailBody) merchDetailBody.innerHTML = "<p class=\"muted\">Загрузка…</p>";
    try {
      const { res, data } = await adminFetch(
        `/api/admin/merch_orders/${encodeURIComponent(orderId)}`,
      );
      if (!res.ok) {
        if (cached && merchDetailBody) merchDetailBody.innerHTML = buildMerchDetailHtml(cached);
        else if (merchDetailBody) merchDetailBody.innerHTML = "<p class=\"form__error\">Не удалось загрузить заявку.</p>";
        return;
      }
      const o = data.order || cached;
      if (merchDetailBody && o) merchDetailBody.innerHTML = buildMerchDetailHtml(o);
    } catch (e) {
      if (e.message !== "unauthorized" && cached && merchDetailBody) {
        merchDetailBody.innerHTML = buildMerchDetailHtml(cached);
      } else if (merchDetailBody) {
        merchDetailBody.innerHTML = "<p class=\"form__error\">Сервер недоступен.</p>";
      }
    }
  }

  function fillMerchCatalogSelect(catalog) {
    if (!merchManualItem) return;
    merchCatalog = catalog || [];
    merchManualItem.innerHTML = "";
    for (const c of merchCatalog) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.title} (${c.xp_price} XP)`;
      merchManualItem.appendChild(opt);
    }
  }

  async function loadMerchOrders() {
    if (!merchTbody) return;
    showMerchError("");
    if (merchStatus) merchStatus.textContent = "Загрузка…";
    merchTbody.innerHTML = "";
    const status = (merchFilter?.value || "").trim();
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    try {
      const { res, data } = await adminFetch(`/api/admin/merch_orders${qs}`);
      if (!res.ok) {
        if (merchStatus) merchStatus.textContent = "";
        showMerchError(apiErrorMessage(data, "Не удалось загрузить заявки."));
        return;
      }
      fillMerchCatalogSelect(data.catalog || []);
      const orders = data.orders || [];
      if (merchStatus) merchStatus.textContent = orders.length ? `Заявок: ${orders.length}` : "Заявок нет.";
      if (!orders.length) {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td colspan=\"7\" class=\"cell-muted\">Нет заявок</td>";
        merchTbody.appendChild(tr);
        return;
      }
      for (const o of orders) {
        const tr = document.createElement("tr");
        tr.className = "admin-merch-row";
        const statusVal = o.status || "new";
        tr.innerHTML = `
          <td class="cell-muted">${escapeHtml(formatTs(o.created_ts))}</td>
          <td>${merchUserCell(o)}</td>
          <td>${escapeHtml(o.item_title || o.item_id || "—")}</td>
          <td>${escapeHtml(String(o.xp_price ?? "—"))}</td>
          <td>
            <select class="form__input admin-merch-status-select" data-order-id="${escapeHtml(o.id)}" style="min-width:120px;padding:6px 8px">
              <option value="new"${statusVal === "new" ? " selected" : ""}>Новая</option>
              <option value="processing"${statusVal === "processing" ? " selected" : ""}>В работе</option>
              <option value="done"${statusVal === "done" ? " selected" : ""}>Выполнена</option>
              <option value="cancelled"${statusVal === "cancelled" ? " selected" : ""}>Отменена</option>
            </select>
          </td>
          <td class="cell-muted">${escapeHtml(o.source === "manual" ? "Вручную" : "Приложение")}</td>
          <td class="cell-comment cell-muted">${escapeHtml(o.admin_note || o.contact_phone || o.contact_address || "—")}</td>
        `;
        tr.addEventListener("click", (e) => {
          if (e.target.closest(".admin-merch-status-select")) return;
          showMerchOrderDetail(o.id, o);
        });
        merchTbody.appendChild(tr);
      }
      merchTbody.querySelectorAll(".admin-merch-status-select").forEach((sel) => {
        sel.addEventListener("change", () => {
          const id = sel.getAttribute("data-order-id");
          if (id) patchMerchOrderStatus(id, sel.value);
        });
      });
    } catch (e) {
      if (merchStatus) merchStatus.textContent = "";
      if (e.message !== "unauthorized") showMerchError("Сервер недоступен.");
    }
  }

  async function patchMerchOrderStatus(orderId, status) {
    try {
      const { res, data } = await adminFetch(`/api/admin/merch_orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        showMerchError(apiErrorMessage(data, "Не удалось обновить статус."));
        await loadMerchOrders();
        return;
      }
      showMerchOk(`Статус: ${MERCH_STATUS_LABELS[status] || status}`);
    } catch (e) {
      if (e.message !== "unauthorized") showMerchError("Сервер недоступен.");
    }
  }

  async function createManualMerchOrder() {
    showMerchError("");
    showMerchOk("");
    const tgidRaw = (merchManualTgid?.value || "").trim();
    const tid = Number(tgidRaw);
    if (!Number.isFinite(tid)) {
      showMerchError("Укажите корректный Telegram ID.");
      return;
    }
    const itemId = merchManualItem?.value || "";
    if (!itemId) {
      showMerchError("Выберите товар.");
      return;
    }
    const body = {
      telegram_id: tid,
      item_id: itemId,
      contact_phone: (merchManualPhone?.value || "").trim() || null,
      contact_address: (merchManualAddress?.value || "").trim() || null,
      admin_note: (merchManualNote?.value || "").trim() || null,
    };
    if (merchManualSubmit) merchManualSubmit.disabled = true;
    try {
      const { res, data } = await adminFetch("/api/admin/merch_orders/create", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        showMerchError(apiErrorMessage(data, "Не удалось создать заявку."));
        return;
      }
      showMerchOk(`Заявка создана: ${data.order_id || ""}`);
      if (merchManualPhone) merchManualPhone.value = "";
      if (merchManualAddress) merchManualAddress.value = "";
      if (merchManualNote) merchManualNote.value = "";
      await loadMerchOrders();
    } catch (e) {
      if (e.message !== "unauthorized") showMerchError("Сервер недоступен.");
    } finally {
      if (merchManualSubmit) merchManualSubmit.disabled = false;
    }
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
      banSearchStatus.textContent = "Введите запрос для поиска.";
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
      banSearchStatus.textContent = users.length
        ? `Найдено: ${users.length}`
        : "Никого не найдено.";

      for (const u of users) {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        const label = [u.email, u.login_username].filter(Boolean).join(" · ") || "—";
        el.innerHTML = `
          <div class="admin-user-item__main">
            <div class="admin-user-item__title">tg:${escapeHtml(String(u.telegram_id))}</div>
            <div class="admin-user-item__meta">${escapeHtml(label)}${u.display_name ? " · " + escapeHtml(u.display_name) : ""}</div>
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
      if (
        !confirm(
          `Забанить пользователя tg:${body.telegram_id}?\n\nВсе данные аккаунта будут удалены без восстановления.`,
        )
      ) {
        return;
      }
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
      showBanOk(data.message || "Пользователь забанен.");
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
        showBanError(apiErrorMessage(data, "Не удалось загрузить блок-лист."));
        return;
      }
      const bans = data.bans || [];
      if (!bans.length) {
        const p = document.createElement("p");
        p.className = "muted";
        p.style.fontSize = "13px";
        p.textContent = "Блок-лист пуст.";
        banListBox.appendChild(p);
        return;
      }
      for (const b of bans) {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        el.innerHTML = `
          <div class="admin-user-item__main">
            <div class="admin-user-item__title">
              ${escapeHtml(b.kind)}: ${escapeHtml(b.value)}
              <span class="admin-ban-pill">${escapeHtml(formatTs(b.banned_ts))}</span>
            </div>
            <div class="admin-user-item__meta">
              ${b.reason ? escapeHtml(b.reason) : "—"}
              ${b.source_telegram_id != null ? ` · tg:${escapeHtml(String(b.source_telegram_id))}` : ""}
            </div>
          </div>
        `;
        banListBox.appendChild(el);
      }
    } catch (e) {
      if (e.message !== "unauthorized") showBanError("Сервер недоступен.");
    }
  }

  // ——— События ———

  loginBtn?.addEventListener("click", async () => {
    const token = (tokenInput?.value || "").trim();
    showLoginError("");
    if (!token) {
      showLoginError("Заполните поле.");
      return;
    }
    setToken(token);
    loginBtn.disabled = true;
    loginBtn.textContent = "Проверка…";
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
      loginBtn.textContent = "Войти";
    }
  });

  logoutBtn?.addEventListener("click", () => {
    setToken("");
    if (tokenInput) tokenInput.value = "";
    panelSection.hidden = true;
    loginSection.hidden = false;
    if (tbody) tbody.innerHTML = "";
    if (statusEl) statusEl.textContent = "";
    if (releasesTbody) releasesTbody.innerHTML = "";
    if (releasesStatus) releasesStatus.textContent = "";
    showReleaseFormError("");
    showReleaseFormOk("");
    if (releaseMsg) releaseMsg.hidden = true;
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

  betaRefreshBtn?.addEventListener("click", () => loadList());
  supportRefreshBtn?.addEventListener("click", () => loadSupportList());
  accountDeletionRefreshBtn?.addEventListener("click", () => loadAccountDeletionList());
  banRefreshBtn?.addEventListener("click", () => {
    loadBans();
    if (banSearch?.value.trim()) searchBanUsers();
  });
  usersStatsRefreshBtn?.addEventListener("click", () => loadUserStats());
  usersStatsDaysSelect?.addEventListener("change", () => loadUserStats());
  usersStatsExportFullBtn?.addEventListener("click", () => exportUsersStatsXlsx("full"));
  usersStatsExportRosmolBtn?.addEventListener("click", () => exportUsersStatsXlsx("ros_mol"));
  banSearchBtn?.addEventListener("click", () => searchBanUsers());
  banSearch?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBanUsers();
  });
  banSubmitBtn?.addEventListener("click", () => submitBanFromFields());
  bannerSaveBtn?.addEventListener("click", () => saveUpdateBanner());
  pwdAddBtn?.addEventListener("click", () => addTesterPassword());
  pushSendAllBtn?.addEventListener("click", () => sendPushAll());
  pushSendSegmentBtn?.addEventListener("click", () => sendPushStreakNotExtended());

  progRefreshBtn?.addEventListener("click", () => loadAthletePrograms());
  progNewBtn?.addEventListener("click", () => {
    clearProgramForm();
    showProgOk("");
    showProgError("");
  });
  progSaveBtn?.addEventListener("click", () => saveAthleteProgram());
  progDeleteBtn?.addEventListener("click", () => deleteAthleteProgram());
  progUploadCoverBtn?.addEventListener("click", () => uploadAthleteProgramMedia("cover"));
  progUploadPdfBtn?.addEventListener("click", () => uploadAthleteProgramMedia("pdf"));

  xpShopRefreshBtn?.addEventListener("click", () => loadXpShopConfig());
  xpShopSaveBtn?.addEventListener("click", () => saveXpShopConfig());
  registrationRefreshBtn?.addEventListener("click", () => loadRegistrationSettings());
  registrationSaveBtn?.addEventListener("click", () => saveRegistrationSettings());

  ucRefreshBtn?.addEventListener("click", () => loadUniqueCharacters());
  ucNewBtn?.addEventListener("click", () => {
    clearUniqueCharForm();
    showUcOk("");
    showUcError("");
  });
  ucSaveBtn?.addEventListener("click", () => saveUniqueCharacter());
  ucUploadImageBtn?.addEventListener("click", () => uploadUniqueCharacterImage());
  ucGrantSearchBtn?.addEventListener("click", () => searchUniqueCharUsers());
  ucGrantSearch?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchUniqueCharUsers();
  });
  ucGrantBtn?.addEventListener("click", () => grantUniqueCharacter());

  evtRefreshBtn?.addEventListener("click", () => loadEvents());
  evtNewBtn?.addEventListener("click", () => {
    clearEventForm();
    showEvtOk("");
    showEvtError("");
  });
  evtSaveBtn?.addEventListener("click", () => saveEvent());
  evtUploadBannerBtn?.addEventListener("click", () => uploadEventMedia("home_banner"));
  evtUploadDetailBannerBtn?.addEventListener("click", () => uploadEventMedia("detail_banner"));
  evtUploadRewardBtn?.addEventListener("click", () => uploadEventMedia("reward"));
  evtResultsRefreshBtn?.addEventListener("click", () => loadEventResults());
  evtParticipantsXlsxBtn?.addEventListener("click", () => downloadEventParticipantsXlsx());
  evtFinalizeBtn?.addEventListener("click", () => finalizeEventRewards());
  evtFormat?.addEventListener("change", () => syncParticipationFields());
  evtAccess?.addEventListener("change", () => syncParticipationFields());
  evtVisibility?.addEventListener("change", () => syncParticipationFields());
  evtLbMetric?.addEventListener("change", () => syncParticipationFields());
  document.getElementById("admin-evt-codes-refresh")?.addEventListener("click", () => loadEventCodes());
  document.getElementById("admin-evt-codes-copy")?.addEventListener("click", () => copyActiveCodes());
  document.getElementById("admin-evt-codes-csv")?.addEventListener("click", () => downloadCodesCsv());
  document.getElementById("admin-evt-codes-generate")?.addEventListener("click", (e) => generateEventCodes(e.currentTarget));
  document.getElementById("admin-evt-codes-add")?.addEventListener("click", (e) => addManualEventCodes(e.currentTarget));
  evtCodesUses?.addEventListener("change", () => {
    if (evtCodesUsesCustom) evtCodesUsesCustom.hidden = evtCodesUses.value !== "custom";
  });
  evtCodesSearch?.addEventListener("input", () => renderEventCodes());
  evtCodesFilter?.addEventListener("change", () => renderEventCodes());
  evtCodesTbody?.addEventListener("click", async (e) => {
    const btn = e.target instanceof HTMLElement ? e.target.closest("button") : null;
    if (!btn) return;
    if (btn.dataset.codeCopy) {
      if (await copyText(btn.dataset.codeCopy)) showCodesOk(`Скопировано: ${btn.dataset.codeCopy}`);
    } else if (btn.dataset.codeUsers) {
      showEventCodeUsers(btn.dataset.codeUsers);
    } else if (btn.dataset.codeToggle) {
      toggleEventCode(btn.dataset.codeToggle, btn.dataset.disabled !== "1");
    } else if (btn.dataset.codeDel) {
      deleteEventCode(btn.dataset.codeDel);
    }
  });
  initLookEditor();
  evtTeamsRefreshBtn?.addEventListener("click", () => loadEventTeams());
  evtTeamCreateBtn?.addEventListener("click", () => createEventTeam());
  evtTeamsTbody?.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("[data-evt-team-del]");
    const id = btn?.getAttribute("data-evt-team-del");
    if (id) disbandEventTeam(id);
  });
  evtTaskSaveBtn?.addEventListener("click", () => saveEventTask());
  evtTaskResetBtn?.addEventListener("click", () => resetEventTaskForm());
  evtRewardSaveBtn?.addEventListener("click", () => saveEventReward());
  evtRewardResetBtn?.addEventListener("click", () => resetEventRewardForm());

  evtTasksList?.addEventListener("click", (e) => {
    const editBtn = e.target?.closest?.("[data-evt-task-edit]");
    const delBtn = e.target?.closest?.("[data-evt-task-del]");
    if (editBtn) {
      const id = editBtn.getAttribute("data-evt-task-edit");
      const task = eventTasksCache.find((x) => x.id === id);
      if (task) fillEventTaskForm(task);
      return;
    }
    if (delBtn) {
      const id = delBtn.getAttribute("data-evt-task-del");
      if (id) deleteEventTask(id);
    }
  });

  evtRewardsList?.addEventListener("click", (e) => {
    const editBtn = e.target?.closest?.("[data-evt-reward-edit]");
    const delBtn = e.target?.closest?.("[data-evt-reward-del]");
    if (editBtn) {
      const id = editBtn.getAttribute("data-evt-reward-edit");
      const reward = eventRewardsCache.find((x) => x.id === id);
      if (reward) fillEventRewardForm(reward);
      return;
    }
    if (delBtn) {
      const id = delBtn.getAttribute("data-evt-reward-del");
      if (id) deleteEventReward(id);
    }
  });

  merchRefreshBtn?.addEventListener("click", () => loadMerchOrders());
  merchFilter?.addEventListener("change", () => loadMerchOrders());
  merchManualSubmit?.addEventListener("click", () => createManualMerchOrder());
  document.querySelectorAll(".js-merch-detail-close").forEach((el) => {
    el.addEventListener("click", () => closeMerchDetailModal());
  });

  releasesTbody?.addEventListener("click", async (e) => {
    const btn = e.target?.closest?.("[data-release-delete]");
    if (!btn || btn.disabled) return;
    const id = btn.getAttribute("data-release-delete");
    if (!id) return;
    if (!confirm("Удалить эту сборку с сервера?")) return;

    btn.disabled = true;
    try {
      const res = await fetch(`/api/admin/releases/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": getToken() },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logoutOn401();
        return;
      }
      if (!res.ok) {
        alert(data.error || "Не удалось удалить.");
        return;
      }
      loadReleases();
    } catch {
      alert("Сервер недоступен.");
    } finally {
      btn.disabled = false;
    }
  });

  releaseForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (releaseBusy) return;
    showReleaseFormError("");
    showReleaseFormOk("");
    const token = getToken();
    if (!token) return;

    const title = (relTitle?.value || "").trim();
    const description = (relDesc?.value || "").trim();
    const changelog = (relChangelog?.value || "").trim();
    const apkFile = relApk?.files?.[0];
    const coverFile = relCover?.files?.[0];

    if (!apkFile) {
      showReleaseFormError("Выберите APK.");
      return;
    }
    if (!title || !changelog) {
      showReleaseFormError("Укажите название и список изменений.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("changelog", changelog);
    fd.append("apk", apkFile, apkFile.name);
    if (coverFile) fd.append("cover", coverFile, coverFile.name);

    const freezeInputs = [relTitle, relDesc, relChangelog, relApk, relCover].filter(Boolean);
    releaseBusy = true;
    releaseForm?.classList?.add("release-form-busy");
    freezeInputs.forEach((inp) => {
      inp.disabled = true;
    });
    if (relSubmit) relSubmit.disabled = true;
    setUploadUi("busy", null);

    try {
      const res = await postReleaseWithProgress(fd, token);
      if (res.status === 401) {
        logoutOn401();
        setUploadUi("idle");
        return;
      }
      if (res.status === 413) {
        showReleaseFormError("Файл слишком большой для nginx (client_max_body_size).");
        return;
      }
      if (res.status < 200 || res.status >= 300 || !res.data?.ok) {
        showReleaseFormError((res.data && res.data.error) || "Не удалось опубликовать.");
        return;
      }
      showReleaseFormOk("Сборка опубликована.");
      loadReleases();
    } catch (err) {
      if (err?.message === "timeout") {
        showReleaseFormError("Тайм-аут загрузки (20 мин).");
      } else {
        showReleaseFormError("Нет связи с сервером.");
      }
    } finally {
      releaseBusy = false;
      releaseForm?.classList.remove("release-form-busy");
      freezeInputs.forEach((inp) => {
        inp.disabled = false;
      });
      if (relSubmit) relSubmit.disabled = false;
      setUploadUi("idle");
    }
  });

  homeAdsSaveBtn?.addEventListener("click", () => saveHomeAdBanner());
  homeAdsResetFormBtn?.addEventListener("click", () => {
    resetHomeAdsForm();
    showHomeAdsError("");
    showHomeAdsOk("");
  });
  homeAdsList?.addEventListener("click", (e) => {
    const editBtn = e.target?.closest?.("[data-homeads-edit]");
    const delBtn = e.target?.closest?.("[data-homeads-del]");
    if (editBtn) {
      const id = editBtn.getAttribute("data-homeads-edit");
      const item = homeAdsDraft.find((b) => b.id === id);
      fillHomeAdsForm(item);
      return;
    }
    if (delBtn) {
      const id = delBtn.getAttribute("data-homeads-del");
      if (!id || !confirm("Удалить баннер?")) return;
      deleteHomeAdBanner(id);
    }
  });

  mapAdsSaveBtn?.addEventListener("click", () => saveMapAdPin());
  mapAdsResetFormBtn?.addEventListener("click", () => {
    resetMapAdsForm();
    showMapAdsError("");
    showMapAdsOk("");
  });
  mapAdsImage?.addEventListener("change", () => {
    const file = mapAdsImage.files?.[0];
    revokeMapAdsLocalPreview();
    if (!file) {
      renderMapAdsImagePreview(mapAdsImageFilename?.value || "");
      return;
    }
    mapAdsLocalPreviewUrl = URL.createObjectURL(file);
    renderMapAdsImagePreview("", mapAdsLocalPreviewUrl, file.name);
  });
  mapAdsLat?.addEventListener("change", () => setMapAdsPoint(mapAdsLat.value, mapAdsLng?.value));
  mapAdsLng?.addEventListener("change", () => setMapAdsPoint(mapAdsLat?.value, mapAdsLng.value));
  mapAdsList?.addEventListener("click", (e) => {
    const editBtn = e.target?.closest?.("[data-mapads-edit]");
    const delBtn = e.target?.closest?.("[data-mapads-del]");
    if (editBtn) {
      const id = editBtn.getAttribute("data-mapads-edit");
      const item = mapAdsDraft.find((p) => p.id === id);
      fillMapAdsForm(item);
      return;
    }
    if (delBtn) {
      const id = delBtn.getAttribute("data-mapads-del");
      if (!id || !confirm("Удалить пин?")) return;
      deleteMapAdPin(id);
    }
  });

  async function bootstrapSession() {
    if (!getToken()) return;
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = "Проверка…";
    }
    const ok = await verifySession();
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = "Войти";
    }
    if (ok) {
      if (tokenInput) tokenInput.value = "";
      showPanel();
    } else {
      setToken("");
      showLoginError("Сохранённый токен недействителен. Войдите снова.");
    }
  }

  bootstrapSession();
})();
