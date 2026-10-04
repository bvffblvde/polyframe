<div align="center">

<a href="https://polyframe.vercel.app">
  <img src="./.github/assets/logo.svg" alt="Polyframe" width="96" height="96" />
</a>

# Polyframe

### Накидай один раз. Вдягни будь-який UI-кіт. Забери код.

Прототипування інтерфейсів перетягуванням просто в браузері. Зберіть макет як вайрфрейм і одним кліком перетворіть його на<br/>
**shadcn/ui · MUI · Mantine · Ant Design · Bootstrap**, а потім експортуйте в PNG або React-код.

**Без реєстрації. Без бекенду. Ваші макети не залишають браузер.**

[**Відкрити редактор →**](https://polyframe.vercel.app) &nbsp;·&nbsp;
[Посібник](https://polyframe.vercel.app/uk/guide) &nbsp;·&nbsp;
[Документація](https://polyframe.vercel.app/uk/docs) &nbsp;·&nbsp;
[Специфікація](./docs/SPEC.md) &nbsp;·&nbsp;
[Дорожня карта](#-дорожня-карта) &nbsp;·&nbsp;
[Долучитися](#-як-долучитися)

[![License: MIT](https://img.shields.io/badge/license-MIT-black?style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/bvffblvde/polyframe/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/bvffblvde/polyframe/actions)
[![Stars](https://img.shields.io/github/stars/bvffblvde/polyframe?style=flat-square&color=yellow)](https://github.com/bvffblvde/polyframe/stargazers)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](./CONTRIBUTING.md)
[![Made in Ukraine](https://img.shields.io/badge/made_in-Ukraine-ffd700?style=flat-square&labelColor=0057b7)](https://u24.gov.ua)

[English](./README.md) · Українська

<br/>

<img src="./.github/assets/hero.gif" alt="Один макет перемикається між вайрфреймом, shadcn/ui, MUI, Mantine, Ant Design і Bootstrap" width="900" />

</div>

---

## ✨ Навіщо Polyframe?

Більшість інструментів для вайрфреймів дають сірі прямокутники. Більшість конструкторів UI прив'язують до однієї дизайн-системи.
Polyframe тримає **один макет** і показує його **різними візуальними мовами**: спершу думайте про структуру, а вигляд оберіть потім.

- 🧠 **Спочатку вайрфрейм.** Сірий, ескізний, без зайвого. Фокус на структурі, а не на пікселях.
- 🎭 **Один клік, шість образів.** Той самий екран у shadcn/ui, MUI, Mantine, Ant Design і Bootstrap. Дані не змінюються, змінюється лише скін.
- 🧾 **Справжній код.** React-компонент для **shadcn/ui + Tailwind**, **MUI**, **Mantine**, **Ant Design**, **React Bootstrap** або **Chakra UI** як відправна точка, а не скриншот.
- 🔒 **Усе локально.** Проєкти зберігаються в IndexedDB. Ділитися можна посиланням, у якому весь макет зберігається просто в URL, без сервера.
- ⌨️ **Зручно з клавіатури.** Скасування, зсув, вирівнювання, групи, дублювання і ⌘K для всього.
- 🚀 **Готові шаблони.** Вхід, дашборд, лендинг, налаштування, тарифи та мобільний профіль.
- 🌍 **Англійська й українська** з коробки.

## 🎬 Як це виглядає

| Вайрфрейм → стилі | Перетягування, сітка й напрямні | Експорт у код |
|:---:|:---:|:---:|
| <img src="./.github/assets/demo-skins.gif" width="280" alt="Перемикання скінів" /> | <img src="./.github/assets/demo-canvas.gif" width="280" alt="Робота з полотном" /> | <img src="./.github/assets/demo-export.gif" width="280" alt="Експорт коду" /> |

## 🧩 Можливості

**Полотно**
- Нескінченне полотно з панорамуванням і масштабом, **артборди** (Desktop, Laptop, Tablet, Mobile, власний розмір)
- Вільне перетягування або **прилипання до сітки** (4 / 8 / 16 px), **розумні напрямні** з відстанями
- Множинне виділення, рамка виділення, зміна розміру, вирівнювання й розподіл, порядок шарів, групи
- Скасування й повтор для кожного жесту

**Компоненти (24, і їх стане більше)**
`Box` `Card` `Divider` `Navbar` `Sidebar` · `Button` `Input` `Textarea` `Select` `Checkbox` `Radio` `Switch` `Slider` · `Heading` `Text` `Link` `Badge` · `Image` `Avatar` `Icon` · `Table` `Tabs` `Alert` `Progress`

**Інспектор і шари**
- Панель властивостей генерується зі схеми кожного компонента
- Дерево шарів: перейменування, блокування, приховування, перетягування
- Палітра команд (`⌘K`): додати компонент, змінити скін, експортувати тощо

**Експорт і поширення**
- PNG у 1× / 2× / 3×, один артборд або всі одразу в ZIP
- JSON-файли проєктів із валідацією схеми та міграціями
- React-код: абсолютна розкладка (точно як на полотні) або рядами (flex)
- Посилання тільки для перегляду та переглядач для телефонів і планшетів

## 🚀 Швидкий старт

Просто відкрийте: **[polyframe.vercel.app](https://polyframe.vercel.app)**

Або запустіть локально:

```bash
git clone https://github.com/bvffblvde/polyframe.git
cd polyframe
pnpm install
pnpm dev
```

Відкрийте http://localhost:3000. Потрібні Node 22+ і pnpm (виконайте `corepack enable`, щоб отримати закріплену версію).

<details>
<summary><b>Скрипти</b></summary>

```bash
pnpm dev            # dev-сервер
pnpm build          # продакшн-збірка
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test           # юніт- і компонентні тести Vitest
pnpm test:coverage  # з порогами покриття для ops і geometry
pnpm test:e2e       # Playwright
```

Згенерований код перевіряється компілятором в окремому пакеті, див. [exporter-check](./exporter-check/README.md).

</details>

## ⌨️ Гарячі клавіші

| Дія | Mac | Windows / Linux |
|---|---|---|
| Скасувати / Повторити | `⌘Z` / `⌘⇧Z` | `Ctrl+Z` / `Ctrl+Shift+Z` |
| Дублювати | `⌘D` | `Ctrl+D` |
| Згрупувати / Розгрупувати | `⌘G` / `⌘⇧G` | `Ctrl+G` / `Ctrl+Shift+G` |
| Прилипання до сітки | `G` | `G` |
| Вайрфрейм / стилізований | `M` | `M` |
| Вмістити все | `⌘0` | `Ctrl+0` |
| Палітра команд | `⌘K` | `Ctrl+K` |
| Усі гарячі клавіші | `?` | `?` |

## 🏗️ Як це працює

```
            ┌──────────────┐
  drag  ──▶ │  JSON-макет  │ ──▶ токени скіна (CSS-змінні) ──▶ Wireframe · shadcn · MUI · Mantine · Ant · Bootstrap
            │ одне джерело │
            └──────┬───────┘
                   └──────▶ експортери ──▶ React-код для shadcn/ui · MUI · …
```

Polyframe **не тягне в застосунок справжні UI-бібліотеки**. Кожен компонент рендериться один раз зі схеми JSON і стилізується **дизайн-токенами**, що імітують відповідний кіт. Тому застосунок швидкий, скіни перемикаються миттєво, а експортери видають код для справжніх бібліотек.

<details>
<summary><b>Технології</b></summary>

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Zustand + zundo · dnd-kit · Zod · next-intl · idb-keyval · lz-string · html-to-image · fflate · Prettier · Shiki · cmdk · Vitest · Testing Library · Playwright

</details>

## 🗺️ Дорожня карта

- [x] Специфікація й архітектура
- [x] **v0.1 MVP**: полотно, 24 компоненти, 5 скінів + вайрфрейм, інспектор, шари, скасування, експорт PNG/JSON
- [x] **v0.2**: експорт коду (shadcn/ui, MUI), посилання, ⌘K, розумні напрямні, групи, шаблони
- [x] **v0.3**: експортери Mantine / Ant / Bootstrap / Chakra, екскурсія й посібник, лендинг, документація, SEO й OG-зображення, PWA (офлайн-редактор)
- [ ] **Згодом**: Storybook, контейнери з автолейаутом, редактор скінів, імпорт токенів, експорт у SVG

Є ідея? [Відкрийте обговорення](https://github.com/bvffblvde/polyframe/discussions).

## 🤝 Як долучитися

Внески дуже вітаються, і кодова база під це спроєктована. Кожен **компонент**, **скін** і **ціль експорту** це одна папка за задокументованим контрактом.

- 🟢 Почніть із [`good first issue`](https://github.com/bvffblvde/polyframe/labels/good%20first%20issue)
- 📦 [Додати компонент](./docs/contributing/add-component.md) приблизно за 30 хвилин
- 🎨 [Додати скін](./docs/contributing/add-skin.md)
- 🧾 [Додати ціль експорту](./docs/contributing/add-exporter.md)

Спершу прочитайте [CONTRIBUTING.md](./CONTRIBUTING.md). Ми використовуємо Conventional Commits.

## ⭐ Підтримка

Якщо Polyframe заощаджує вам час, **поставте зірочку**. Це справді допомагає проєкту знайти людей.

<a href="https://star-history.com/#bvffblvde/polyframe&Date">
  <img src="https://api.star-history.com/svg?repos=bvffblvde/polyframe&type=Date" alt="Історія зірок" width="600" />
</a>

## 📄 Ліцензія

[MIT](./LICENSE) © [Vladyslav Horba](https://vladyslav-horba-portfolio.vercel.app)

<sub>Polyframe не пов'язаний із shadcn/ui, MUI, Mantine, Ant Design чи Bootstrap. Скіни є візуальним наближенням; усі торговельні марки належать їхнім власникам.</sub>

<div align="center">
<sub>Зроблено з ☕ у Харкові 🇺🇦</sub>
</div>
