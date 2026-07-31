# Results summary component

![](./screenshot.jpg)

## Table of contents

- [Overview](#overview)
  - [The job](#the-job)
  - [Links](#links)
- [Features](#features)
- [Run locally](#run-locally)
- [Project documentation](#project-documentation)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The job

Users should be able to:

- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- **Bonus**: Use the local JSON data to dynamically populate the content

### Links

- Repo URL: [https://github.com/ferfalcon/results-summary-component](https://github.com/ferfalcon/results-summary-component)
- Live URL: [https://results-summary-component-ferfalcon.vercel.app/](https://results-summary-component-ferfalcon.vercel.app/)

## Features

- Mobile-first layout with a two-column card from `700px`
- Local Hanken Grotesk font, category icons, and favicon
- Content loaded from one local JSON file and checked by a runtime validator
- Complete fallback UI when the data does not match the closed schema
- Semantic headings, description-list score rows, coherent assistive text, and
  a native keyboard-accessible button
- Accessible colors, visible focus, forced-colors support, and resilient
  content growth
- Validator coverage with Node's built-in test runner

## Run locally

Node `22.18.0` or newer is required.

```bash
cd frontend
pnpm install
pnpm dev
```

Quality and production commands:

```bash
pnpm test
pnpm build
pnpm preview
```

## Project documentation

- [Specification](SPEC.md)
- [Design decisions](DESIGN.md)
- [Implementation plan](PLAN.md)
- [Review notes](REVIEW.md)
- [Implementation and acceptance evidence](IMPLEMENTATION.md)

The supplied Figma and `docs/design/` files are design references only; the
production application does not load from them. Continue intentionally has no
destination or success state in this first-release component.

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [Vite](https://vite.dev/) - Frontend build tool
- [Figma](https://www.figma.com/) - Edit design files

### Useful resources

- [Google | Build with Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) - Modern Web Guidance is a set of skills that embed web platform expertise, best practices, and browser compatibility data directly into your coding agents.
```bash
pnpm dlx skills add GoogleChrome/modern-web-guidance
```
- [Impeccable](https://impeccable.style/) - The missing design vocabulary for agents.
- [](https://www.youtube.com/watch?v=r2P1v64pM28)




## Author

* Website - [ferfalcon.com](http://ferfalcon.com/)
* LinkedIn - [Fernando Falcon](https://www.linkedin.com/in/fernandofalcon/)
