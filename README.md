# Ali-Razeghi.github.io

Personal portfolio of **Ali Razeghi**: Python developer focused on scientific computing, astronomical data analysis, automation, and data-driven reporting.

**Live site:** https://ali-razeghi.github.io

## What the site shows

- Profile, skills, experience, education, and publications
- **Selected Projects:** public GitHub repositories, listed automatically (10 per page, newest update first)
- Visitor counter powered by GoatCounter
- Dark, responsive layout (desktop, tablet, mobile)

## Tech stack

Plain **HTML, CSS, and vanilla JavaScript**. There is no build step and no framework, so the repository is served as-is by GitHub Pages.

External services:

- GitHub REST API (project list)
- GoatCounter (visit statistics and counter)
- Google Fonts (Inter)

## Repository structure

```
index.html              Page structure and text content
css/style.css           All styling (colors are CSS variables in :root)
js/main.js              Project listing, pagination, mobile menu, visitor counter
images/                 Profile photo, project card images, contact image
Ali_Razeghi_Resume.pdf  Resume linked from the "Download Resume" buttons
README.md               This file
```

## How it works

**Project listing.** On page load, `js/main.js` requests the public repositories of `GITHUB_USERNAME` from the GitHub API. It skips forks, archived repositories, and anything listed in `EXCLUDED_REPOS` (this site's own repository), sorts by last push date, and renders 10 cards per page. A new public repository appears on the site automatically, with no change to the code.

**Project card images.** Each card gets an image from `images/`. The mapping from repository name to image is the `REPO_VISUALS` object in `js/main.js`. Repositories that are not listed there fall back to keyword rules (`VISUAL_RULES`) and then to a generic image. To give a new repository a specific image, add one line to `REPO_VISUALS`.

**Visitor counter.** GoatCounter records visits through the script tag in `index.html`. The footer number is read from the GoatCounter counter endpoint in `js/main.js`.

## Editing guide

| To change | Edit |
|---|---|
| Text, links, sections | `index.html` |
| Colors and theme | CSS variables at the top of `css/style.css` (`--bg`, `--surface`, `--primary`, ...) |
| Layout and spacing | `css/style.css` |
| Projects per page, GitHub username, excluded repositories | Constants at the top of `js/main.js` |
| Image for a specific repository | `REPO_VISUALS` in `js/main.js` |
| Resume | Replace `Ali_Razeghi_Resume.pdf` and keep the same file name |
| Profile photo | Replace `images/profile.jpg` |

After editing `css/style.css` or `js/main.js`, increase the `?v=` number in the matching tag in `index.html` so browsers do not serve a cached copy.

## Deployment

The site is deployed with **GitHub Pages** from the `main` branch. Commit changes to `main`; the update usually goes live within a few minutes. Use a hard refresh (Ctrl+F5) to bypass the browser cache.

## Notes

- The GitHub API allows a limited number of unauthenticated requests per hour per IP address. If the limit is reached, the Projects section shows a short message instead of the cards. It recovers on its own.
- The images in `images/` (project cards and contact section) are **illustrative graphics** (simulated data and layouts), not output from the listed repositories.
- The visitor counter requires public counters to be enabled in the GoatCounter site settings.

## Contact

- GitHub: https://github.com/Ali-Razeghi
- LinkedIn: https://www.linkedin.com/in/ali-razeghi-astronomy/
