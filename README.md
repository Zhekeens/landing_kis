# КИСФИТ — лендинг

Статический сайт в папке `landing/` (отдельно от Flutter `web/`).

## Партнёрский лендинг

- URL на проде: **`https://kisfit.ru/partners/`** (каталог `landing/partners/`).
- Исходники: `landing-wireframe/`. Пересборка после правок:

```bash
cd landing-wireframe
npm run build:landing   # sync картинок + сборка в landing/partners/
git add ../landing/partners ../landing/assets
```

Скрины **`/partners/`** — в **`landing-wireframe/public/assets/`** (`screen-01…04` для партнёров и при необходимости `screen-11…` и др.). На главной **`landing/assets/screen-01…04`** — **другие файлы** с теми же именами; sync их не трогает. После правок скринов partners: `npm run build:landing` → commit **`landing/partners/`** и **`landing-wireframe/public/assets/`**.

В nginx нужен `try_files` для SPA — см. блок `location /partners/` в `nginx_set.txt`.

## Локальный просмотр

### Только статика (без приёма заявок)

```bash
cd landing
python3 -m http.server 5173
```

Форма на `beta.html` при этом **не** сможет сохранить заявку (нет API).

### Сервер: заявки + админка

Заявки с бета-формы пишутся в файл `server/data/applications.json`. Для этого нужен Node-сервер из папки `server/`.

```bash
cd landing/server
npm install
cp .env.example .env
# В .env задайте BETA_ADMIN_TOKEN
npm start
```

Файл `server/.env` подхватывается при старте (не коммитьте его в git). При необходимости переменные по-прежнему можно задать в оболочке — они имеют приоритет над значениями из `.env`.

Откройте `http://localhost:5173/` — тот же порт по умолчанию, что и у `python3 -m http.server`.

- Форма: `http://localhost:5173/beta.html`
- Панель заявок и APK (нужен токен): `http://localhost:5173/kisfit-panel.html` — введите тот же `BETA_ADMIN_TOKEN`, что в `.env`.

В `.env` можно задать `PORT`, если нужен другой порт.

## Почему нельзя только открыть `index.html`

Файл по протоколу `file://` и простой просмотр папки без сервера не дают работающего адреса `/api/beta-applications`. Форма и админка делают запросы на тот же хост, с которого открыт сайт, поэтому на проде нужны **статика с nginx** (как раньше) **плюс** процесс Node для API.

## Продакшен: nginx + Node (как на kisfit.ru)

1. **Статика** по-прежнему из каталога лендинга (у вас это `C:/sites/landing`): `index.html`, `beta.html`, `kisfit-panel.html`, `tester.html`, `*.js`, `*.css`, `assets/` и т.д. — без изменений в URL.
2. **Папка `server/`** должна лежать на машине там же или в другом известном пути, например `C:/sites/landing/server/`.
3. Один раз: `cd server && npm install`, создать `server/.env` из `.env.example`. Нужен `BETA_ADMIN_TOKEN` (админка заявок и обратной связи). При необходимости задайте `PORT`.
4. Запуск Node **постоянно** (перезагрузка сервера): удобнее через [PM2](https://pm2.keymetrics.io/) или планировщик/службу Windows, из каталога `server/`:

   `pm2 start server.mjs --name kisfit-landing`

5. **Важно для nginx:** у вас уже есть `location /api/` → порт `8000`. Всё, что должен обрабатывать **Node-лендинг** (`/api/beta-applications`, `/api/feedback`, **`/api/tester…`**, **`/api/admin/releases…`**), нужно описать **отдельными `location` выше** общего `location /api/`, иначе запросы уйдут на 8000 и скачивание APK / админка сборок перестанут работать. Добавьте блоки **перед** общим `location /api/` и проксируйте **без** завершающего слэша в `proxy_pass` там, где путь должен сохраниться как есть:

```nginx
        # Заявки бета-лендинга (Node, см. landing/server)
        location /api/beta-applications {
            limit_req zone=api_limit burst=10 nodelay;

            proxy_pass http://127.0.0.1:5173;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Обратная связь (текст + скриншоты)
        location /api/feedback {
            limit_req zone=api_limit burst=10 nodelay;
            client_max_body_size 32m;

            proxy_pass http://127.0.0.1:5173;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Скачивание скринов админом (защищено токеном, проксируем на тот же Node)
        location /api/feedback/ {
            limit_req zone=api_limit burst=10 nodelay;
            client_max_body_size 32m;

            proxy_pass http://127.0.0.1:5173;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

```

Дополнительно до общего `location /api/` добавьте прокси на Node для **`/api/tester`** (логин и скачивание APK) и **`/api/admin/releases`** (загрузка сборок) — готовый фрагмент с таймаутами и лимитами тела запроса в **`nginx_set.txt`**. Порт `5173` замените на тот, что в `server/.env` в `PORT`.

Панель лендинга (заявки + APK): **`https://kisfit.ru/kisfit-panel.html`**. Путь **`/admin/`** в nginx у вас зарезервирован под **другой** бэкенд (порт 8000) — с файлом `kisfit-panel.html` он не конфликтует.

## Файлы изображений (`assets/`)

| Файл | Назначение |
| --- | --- |
| `kisfit-logo-wordmark-dark.png` | Логотип в шапке и подвале (тёмная тема сайта) |
| `kisfit-logo-wordmark-light.png` | Вариант для светлого фона (партнёрский лендинг) |
| `partners/` | Сборка партнёрского сайта (`landing-wireframe`: `npm run build:landing`) |
| `kisfit-mascot.png` | Персонаж на первом экране |
| `hero-app-screen.png` | Скрин интерфейса в рамке телефона |
| `placeholder-territory.jpg` | Блок «Территории» (вертикальный скрин, 720×1280) |
| `screen-01.jpg` … `screen-04.jpg` | Секция «Интерфейс» (вертикальные скрины, 720×1280) |
| (опционально) `KISFIT.apk` в `assets/` | Старый вариант статической раздачи; сейчас APK публикуются через панель и `/api/tester/download` |

При необходимости замените файлы **с тем же именем**, чтобы не править HTML.

## Скачивание приложения

Сборки выкладываются через **`kisfit-panel.html`** → API **`/api/admin/releases`** (Node). Тестировщики заходят через **`tester.html`** / модальное «Скачать»: пароль **`SITE_DOWNLOAD_PASSWORD`** в `server/.env`, скачивание идёт через **`/api/tester/download`** (тоже Node). В nginx для этих путей нужен прокси на тот же порт, что и у заявок — см. актуальный пример в `nginx_set.txt`.

## Юридические страницы

- `privacy.html` — политика конфиденциальности
- `delete-account.html` — удаление аккаунта и заявки на удаление данных (Google Play)  
- `terms.html` — условия использования  

В документах указаны контакты: `privacy@kisfit.team`, `support@kisfit.team`.
# landing_kis
