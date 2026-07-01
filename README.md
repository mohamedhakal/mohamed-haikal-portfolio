# Mohamed Haikal - Portfolio

A premium, minimal portfolio landing page with a contact form. Built with vanilla HTML, CSS, and JavaScript — no frameworks or build step required.

**Live repo:** [github.com/mohamedhakal/mohamed-haikal-portfolio](https://github.com/mohamedhakal/mohamed-haikal-portfolio)

## Features

- **Landing page** — Full-screen hero with fade-in animations and a clean black-and-white aesthetic
- **Animated background** — Glowing dot grid with parallax, ambient drift, and soft color accents
- **Custom cursor** — Smooth lerped dot-and-ring cursor with hover effects
- **Contact page** — Full Name, Email, and Message form that sends to `he1is1mohamed@gmail.com`
- **Responsive** — Works across desktop and mobile (custom cursor disabled on touch devices)

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Portfolio under construction landing |
| Contact | `contact.html` | Get in touch form |

## Project Structure

```
├── index.html          # Landing page
├── contact.html        # Contact form page
├── css/
│   └── style.css       # All styles
├── js/
│   ├── main.js         # Dot grid, custom cursor
│   └── contact.js      # Form submission handling
└── assets/
    ├── favicon.png     # Circular site icon
    └── favicon.jpg     # Original profile photo
```

## Getting Started

This is a static site. Serve it through a web server — do not open the HTML files directly (`file://`), or the contact form will not work.

### Option 1: Local server (Node)

```bash
npx serve .
```

Then open `http://localhost:3000`.

### Option 2: Python

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

### Option 3: GitHub Pages

Deploy the repo via GitHub Pages to host the site online.

## Contact Form Setup

The contact form uses [FormSubmit](https://formsubmit.co). On first submission:

1. Open the site through a web server (not as a local file)
2. Submit the contact form once
3. Check `he1is1mohamed@gmail.com` (including spam) for the FormSubmit activation email
4. Click **Activate Form**
5. Future submissions will arrive in your inbox

## Tech Stack

- HTML5
- CSS3 (custom properties, animations, flexbox)
- Vanilla JavaScript (Canvas API, Fetch API)
- [FormSubmit](https://formsubmit.co) — contact form delivery
- [Inter](https://fonts.google.com/specimen/Inter) — typography

## Author

**Mohamed Haikal**

- Email: [he1is1mohamed@gmail.com](mailto:he1is1mohamed@gmail.com)
- GitHub: [@mohamedhakal](https://github.com/mohamedhakal)

## License

This project is open source and available for personal use.
