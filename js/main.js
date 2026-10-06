/* Portfolio scripts: GitHub project listing + visitor counter */

const GITHUB_USERNAME = 'Ali-Razeghi';
const PROJECT_CONTAINER_ID = 'github-projects';
const PAGINATION_CONTAINER_ID = 'project-pagination';
const PROJECTS_PER_PAGE = 10;
const EXCLUDED_REPOS = ['Ali-Razeghi.github.io'];

let allProjects = [];
let currentPage = 1;

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

function formatRepoName(name) {
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
}

// Exact repo -> image mapping (project images are 800x450 = 16:9, matching the card's aspect-ratio).
const REPO_VISUALS = {
  'astrotarget': 'astrotarget',
  'exoplanet-radial-velocity-simulator': 'rv',
  'exoplanet-transit-lab': 'transit',
  'exoplanet-transit-trapezoid': 'trapezoid',
  'exoplanet-radius-explorer': 'radius',
  'exoplanet-aitoff-map': 'aitoff',
  'exoplanets-hz-plot': 'hz',
  'sdss-sql-analysis': 'sdss',
  'globular-cluster-populations': 'cluster',
  'galaxy-ml-case-study': 'galaxy',
  'lightcurve-analyzer': 'variable',
  'astropulse-analytics-api': 'api',
  'marketpulse-analytics-api': 'market',
  'daily-sales-briefing': 'dashboard',
  'astronomy-articles': 'sky',
  'flowpilot-landing': 'web',
  'restaurant-website': 'web',
  'real-estate': 'web'
};

// Keyword fallback for repositories added later.
const VISUAL_RULES = [
  ['astrotarget', /astrotarget|\btess\b|\bmast\b/],
  ['trapezoid',   /trapezoid/],
  ['transit',     /transit/],
  ['rv',          /\brv\b|radial|velocity|kepler|orbit|emcee/],
  ['variable',    /variable|cepheid|pulsat|aavso|ogle|asas|fourier|light ?curve|photometr/],
  ['cluster',     /globular|cluster|hubble/],
  ['galaxy',      /galax|morpholog|classif|machine learning|deep learning|\bcnn\b/],
  ['lunar',       /lunar|\bmoon\b|crater|selen/],
  ['aitoff',      /aitoff|sky map/],
  ['hz',          /habitable/],
  ['radius',      /radius|valley/],
  ['sdss',        /sdss|quasar/],
  ['api',         /\bapi\b|fastapi|backend|jwt/],
  ['pipeline',    /telegram|\bnews\b|\bbot\b|n8n|workflow|automat|smtp|e-?mail|pipeline|scrap/],
  ['dashboard',   /report|kpi|dashboard|analytic|\bbi\b|\bpdf\b|pandas|visuali/],
  ['web',         /website|landing|\bhtml\b|\bcss\b|ui\/ux/],
  ['sky',         /star|sky|astro|gaia|nasa|space|planet|telescope|observ/]
];
const FALLBACK_VISUALS = ['sky', 'dashboard', 'pipeline'];

function pickVisual(repo) {
  const exact = REPO_VISUALS[repo.name.toLowerCase()];
  if (exact) return exact;
  const text = [repo.name, repo.description, ...(repo.topics || [])].join(' ').toLowerCase().replace(/[-_]+/g, ' ');
  for (const [kind, rx] of VISUAL_RULES) if (rx.test(text)) return kind;
  let h = 0;
  for (const ch of repo.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACK_VISUALS[h % FALLBACK_VISUALS.length];
}

function createProjectCard(repo) {
  const article = document.createElement('article');
  article.className = 'card';

  const visual = document.createElement('div');
  const kind = pickVisual(repo);
  article.dataset.kind = kind;
  visual.className = 'project-visual pv-' + kind;
  visual.setAttribute('aria-hidden', 'true');

  const title = document.createElement('h3');
  title.textContent = formatRepoName(repo.name);

  const meta = document.createElement('div');
  meta.className = 'repo-meta';
  meta.textContent = `Updated ${formatDate(repo.pushed_at)}${repo.language ? ' · ' + repo.language : ''}`;

  const description = document.createElement('p');
  description.textContent = repo.description ||
    'Public GitHub repository with source code, documentation, and technical portfolio material.';

  const tags = document.createElement('div');
  tags.className = 'tags';
  (repo.topics && repo.topics.length ? repo.topics : [repo.language || 'GitHub']).slice(0, 5).forEach(topic => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = topic;
    tags.appendChild(tag);
  });

  const link = document.createElement('a');
  link.className = 'repo-link';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'View Repository →';

  article.append(visual, title, meta, description, tags, link);
  return article;
}

function renderProjects(page) {
  const container = document.getElementById(PROJECT_CONTAINER_ID);
  const totalPages = Math.ceil(allProjects.length / PROJECTS_PER_PAGE);
  currentPage = Math.min(Math.max(page, 1), totalPages || 1);
  const start = (currentPage - 1) * PROJECTS_PER_PAGE;
  container.innerHTML = '';
  allProjects.slice(start, start + PROJECTS_PER_PAGE).forEach((repo, i) => container.appendChild(createProjectCard(repo)));
  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById(PAGINATION_CONTAINER_ID);
  const totalPages = Math.ceil(allProjects.length / PROJECTS_PER_PAGE);
  pagination.innerHTML = '';
  if (totalPages <= 1) return;

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = page === currentPage ? 'page-button active' : 'page-button';
    button.textContent = page;
    button.setAttribute('aria-label', `Show project page ${page}`);
    if (page === currentPage) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      renderProjects(page);
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    pagination.appendChild(button);
  }
}

async function loadGitHubProjects() {
  const container = document.getElementById(PROJECT_CONTAINER_ID);
  const pagination = document.getElementById(PAGINATION_CONTAINER_ID);
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const repos = await response.json();

    allProjects = repos
      .filter(r => !r.fork && !r.archived && !EXCLUDED_REPOS.includes(r.name))
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (!allProjects.length) {
      container.innerHTML = '<p class="loading">No public repositories were found.</p>';
      pagination.innerHTML = '';
      return;
    }
    renderProjects(1);
  } catch (error) {
    container.innerHTML = '<p class="loading">Projects could not be loaded from GitHub right now. Please visit the GitHub profile link above.</p>';
    pagination.innerHTML = '';
    console.error('GitHub projects:', error);
  }
}

loadGitHubProjects();

(async function () {
  const output = document.getElementById('visitor-count');
  try {
    const response = await fetch('https://alirazeghi.goatcounter.com/counter/TOTAL.json');
    if (!response.ok) throw new Error('Counter request failed: ' + response.status);
    const data = await response.json();
    const value = data.count ?? data.count_unique ?? data.visits ?? data.value ?? data.total;
    if (value === undefined || value === null) throw new Error('No counter value found in response');
    output.textContent = String(value);
  } catch (error) {
    output.textContent = '—';
    console.error('GoatCounter visitor count:', error);
  }
})();
