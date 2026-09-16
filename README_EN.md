# Nanjing Tech University Portal Website (Pure Static Demo)

A **zero-dependency, zero-build** demo project for a university portal website. It is written entirely in vanilla HTML + CSS + JavaScript,
stores its data in the browser's `localStorage`, and runs simply by double-clicking `index.html` — no environment setup required.

> ⚠️ **Disclaimer**: This project is a static demo for learning purposes and is **not the official website of Nanjing Tech University**.
> Campus information (university profile, statistics, leadership roster, college and department structure, etc.) is compiled from publicly available material on the university's official website,
> and the news articles are sample text for demonstration. Page content may be outdated or inaccurate; please refer to the [official website](https://www.njtech.edu.cn) as the authoritative source.

---

## Quick Start

### Option 1: Open directly (simplest)

Double-click `index.html`, or right-click it and choose "Open with browser".

### Option 2: Local server (recommended)

Because browsers impose certain restrictions on the `file://` protocol, opening the site through a local server gives a more complete experience:

- **VS Code**: Install the Live Server extension → right-click `index.html` → `Open with Live Server`
- **Python**: In the `webpage` directory, run `python -m http.server 8080`, then visit `http://localhost:8080`
- **Node.js**: In the `webpage` directory, run `npx serve .`

Both approaches provide identical functionality, and images and data display correctly either way (the images have been copied into the project and do not rely on absolute local paths).

---

## Demo Accounts

| Role | Username | Password | Notes |
| --- | --- | --- | --- |
| Administrator | `admin` | `admin123` | System administrator, can access the admin console |
| Teacher | `teacher` | `teacher123` | Wang Jianhua, professor at the College of Chemical Engineering; can view their teaching schedule and the grades for the courses they teach |
| Student | `student` | `student123` | Li Xiaoming, Class 2401, Computer Science; can view their class schedule and personal grades |

Additional accounts such as `teacher2` (Zhou Min), `zhangwei`, `wangfang`, `liuyang`, `chenjing`, and `zhaolei` are also available,
with the same passwords `teacher123` / `student123`; they can be used for the "User Management" demo in the admin console. The login page also offers one-click filling of demo accounts.

> Passwords are stored in **plain text** in the browser and are intended for feature demonstration only — **never use them in any real scenario**.

---

## Features at a Glance

### Public pages
- **Home** `index.html` — hero image, university statistics overview, educational highlights, NJTech headlines, notices and announcements, academic events, quick service links
- **About** `about.html` — university profile, basic facts, motto and ethos, history, current leadership, three campuses
- **Colleges** `colleges.html` — 11 academic divisions that expand and collapse to list their constituent colleges
- **News and Notices** `news.html` — category filters (NJTech Headlines / Notices and Announcements / Academic Events) + keyword search + pagination
- **News Detail** `news-detail.html?id=N` — article body, view-count increment, related reading

### Role pages (login required)
- **Timetable** `courses.html` — students see their class schedule; teachers see their own teaching assignments; administrators can switch between any class
- **Grades** `grades.html` — students see a transcript grouped by semester, a weighted average score, and a 4.0-scale GPA; teachers see the full-class grades for the courses they teach (read-only)
- **Admin Console** `admin.html` (administrators only) — data overview, news create/read/update/delete, user create/read/update/delete, reset demo data

### Shared capabilities
- **Chinese/English bilingual**: switch using the `中文 / EN` toggle at the top right of the navigation bar, with no page reload; business data such as news, courses, and colleges all have bilingual fields
- **Responsive layout**: adapts to desktop, tablet, and phone; on narrow screens the navigation collapses into a hamburger menu
- **Accessibility**: skip-to-main-content link, `aria-*` annotations, keyboard-operable modals (Esc to close), focus management

---

## Directory Structure

```
webpage/
├── index.html                 Home page
├── about.html                 About the university
├── colleges.html              Colleges and departments
├── news.html                  News and notices list
├── news-detail.html           News detail
├── login.html                 User login
├── courses.html               Timetable
├── grades.html                Grades lookup
├── admin.html                 Admin console
├── README.md                  This file
├── css/
│   ├── style.css              Site-wide styles (design tokens, layout, components, responsive)
│   └── admin.css              Supplementary styles for the admin console
├── js/
│   ├── store.js               Data layer: localStorage read/write + seed data + CRUD API
│   ├── i18n.js                Chinese/English dictionaries, language switching, date formatting
│   ├── ui.js                  Navigation bar / footer injection, modals, Toast, icons, pagination
│   ├── auth.js                Login state, role permission guards, cross-page prompts
│   └── pages/                 Per-page logic (home / about / colleges / news /
│                              news-detail / login / courses / grades / admin)
└── assets/
    └── images/
        ├── njtech-emblem.jpg    Browser tab icon (favicon, university emblem)
        ├── njtech-logo.jpg      Header brand mark (emblem + Chinese and English name lockup)
        └── nanjing-skyline.jpg  Home page hero image
```

---

## About the Image Assets

### Header brand mark

- File: `assets/images/njtech-logo.jpg` (original 378 × 124)
- Content: Nanjing Tech University **emblem + Chinese and English name** lockup
- Source: local file provided by the user
- Usage: rendered by `brandLogoImg()` in `js/ui.js` into the top-left corner of the header; CSS constrains it to 46px in height (34px on mobile) with automatic width
- Note: this mark is the university's official identity and is used here only for a non-official learning demo site; if you need to use it formally, please follow the university's identity usage guidelines

### Browser tab icon (favicon)

- File: `assets/images/njtech-emblem.jpg` (original 103 × 124)
- Content: Nanjing Tech University **emblem** (a shield-shaped badge containing "1902" and the university name)
- Source: local file provided by the user
- Usage: included in the `<head>` of all 9 pages via `<link rel="icon" type="image/jpeg" href="assets/images/njtech-emblem.jpg">`
- Note: the earlier stylized SVG icon (`assets/logo.svg`) has been deleted, and the official emblem is now used consistently

### Home page hero image

- File: `assets/images/nanjing-skyline.jpg`
- Content: **Nanjing cityscape** (overlooking the urban area of Nanjing from the Yuejiang Tower viewpoint)
- Source: local image provided by the user; the original file comes from piqsels (a public-domain CC0 image library) and can be used safely
- Note: this image is **not an actual view of the campus**, as truthfully noted in the bottom-right corner of the page

### Footer

The footer displays only the university name and motto text and **includes no logo graphic** (the official university name mark is a white-background JPEG, which would appear as a white block on the dark blue footer).
The browser tab icon (favicon) is `assets/images/njtech-emblem.jpg` (the official emblem).
`logoSvg()` in `js/ui.js` is a stylized SVG mark that currently has no call site and is kept as a spare utility.

> The original images above are kept in `C:\Users\TheGrau\Desktop\photo\`, and the project contains copies.
> The project uses copies rather than absolute paths so that the images remain visible when opened over `http://`.

### Replacing images

1. Put the new image into `assets/images/`
2. For the header mark, change the `src` in `brandLogoImg()` in `js/ui.js`
3. For the home page hero image, change the `background-image` of `.hero` in `css/style.css`
4. For the browser tab icon, change `<link rel="icon">` in the `<head>` of the 9 HTML pages

---

## Data Notes

### Storage location

All data is stored in the browser's `localStorage`, with keys prefixed by `njtech_`:

| Key | Content |
| --- | --- |
| `njtech_users` | User accounts (including role, college, class, student ID, etc.) |
| `njtech_news` | News and notices (bilingual Chinese/English title, summary, body) |
| `njtech_courses` | Timetable data |
| `njtech_grades` | Grade data |
| `njtech_session` | Current login session |
| `njtech_lang` | Language preference (`zh` / `en`) |
| `njtech_seed_version` | Seed data version number |

The data is valid only in the **current browser** and is not shared between different browsers or devices.

### Resetting data

- **Via the admin console**: Log in as an administrator → Admin Console → "Reset demo data" on the left
- **Manually**: Browser developer tools → `Application` → `Local Storage` → delete the keys prefixed with `njtech_`, then refresh the page

### Modifying seed data

To correct or extend the initial data, edit `seedUsers()`, `seedNews()`,
`seedCourses()`, and `seedGrades()` in `js/store.js`, as well as the `SCHOOL` constant at the top, then change `SEED_VERSION`
to a new value (for example `1.0.1`). The data is rebuilt automatically the next time the page loads.

### University information fields

The `SCHOOL` object at the top of `js/store.js` centralizes bilingual Chinese/English content such as the university profile, basic facts, educational highlights, statistics,
campuses, current leadership, history, academic divisions and colleges, and quick links. To update university information, you only need to change this one place.

---

## Permission Design

| Role | Accessible pages |
| --- | --- |
| Guest | Home, About, Colleges, News list, News detail, Login page |
| Student (student) | The pages above + Timetable (their class), Grades (their own) |
| Teacher (teacher) | The pages above + Timetable (their own teaching), Grades (the courses they teach, read-only) |
| Administrator (admin) | The pages above + Admin Console (news and user CRUD); can view the timetable of any class and all grades |

The guard logic lives in `js/auth.js`. Pages call `Auth.guard([...])` at the top of their scripts:
- Not logged in while accessing a restricted page → redirect to `login.html?redirect=<original URL>`, with a prompt shown on the login page
- Logged in but with a mismatched role → a "no permission" message is shown and the user is returned to the home page

---

## Known Limitations

1. **Pure front-end approach**: there is no back-end service; data validation and permission control are all handled in the browser, can be bypassed, and provide no security whatsoever
2. **Plain-text passwords**: passwords in `njtech_users` are stored in plain text, purely for demo convenience
3. **Data is not shared**: after switching browsers or devices, or clearing browser data, the data returns to its initial state
4. **Teaching sample data**: timetables, grades, and classes are fictional samples arranged according to the structure of degree programs, not real teaching arrangements
5. **GPA conversion**: uses a common percentage-band conversion (90 and above is 4.0); institutions use different algorithms, so this serves only as a demonstration convention
6. **College list**: compiled from the publicly available "Colleges and Departments" content on the university's official website and may differ from the latest adjustments
7. **No tests or build**: the project contains no unit tests or bundling pipeline; the code is written to be read and debugged directly

---

## Technical Highlights

- **Data layer**: `js/store.js` is the single data entry point, encapsulating localStorage read/write, seed initialization,
  CRUD and query statistics for each entity; if localStorage is unavailable (such as in private mode), it automatically falls back to in-memory storage and shows a notice on the page
- **Internationalization**: HTML annotates text using attributes such as `data-i18n` / `data-i18n-placeholder` / `data-i18n-html`,
  and everything is re-rendered consistently when the language is switched; business data uses `I18N.pick(obj, 'title')` to select `titleZh` / `titleEn` according to the current language
- **Shared UI**: `js/ui.js` dynamically injects the header and footer, avoiding duplicated maintenance across 9 pages; it also provides components such as modals, Toast, and pagination
- **Zero dependencies**: no third-party libraries, fonts, or CDN resources are introduced, and everything works fully offline (external links in the footer require an internet connection)
