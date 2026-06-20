/* --- Navbar Scroll Effect --- */
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* --- Mobile Menu Toggle --- */
var toggleButton = document.getElementById('nav-toggle');
var navLinks = document.getElementById('nav-links');

// Toggle menu
toggleButton.addEventListener('click', function () {
  navLinks.classList.toggle('active');
});

// Close menu on link click
var links = navLinks.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function () {
    navLinks.classList.remove('active');
  });
}

/* --- Scroll Reveal --- */

var animatedElements = document.querySelectorAll(
  '.feature-card, .step, .about-content, .about-visual, .download-card, .team-member'
);

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

for (var i = 0; i < animatedElements.length; i++) {
  observer.observe(animatedElements[i]);
}

/* --- Smooth Scrolling --- */
var anchorLinks = document.querySelectorAll('a[href^="#"]');

for (var i = 0; i < anchorLinks.length; i++) {
  anchorLinks[i].addEventListener('click', function (event) {
    var targetId = this.getAttribute('href');

    // Skip if it's just "#" (let browser handle it)
    if (targetId === '#') return;

    // Skip if this link also has a full URL (external links)
    var fullHref = this.href;
    if (fullHref.indexOf('github.com') !== -1) return;

    var targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    // Prevent default jump
    event.preventDefault();

    var navbarHeight = document.getElementById('navbar').offsetHeight;
    var targetPosition = targetElement.offsetTop - navbarHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
}

/* --- Disable Right-Click --- */
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

/* --- Fetch Latest GitHub Release --- */
function fetchLatestRelease() {
  var repo = 'reikkikun-PH/BlueMesh';
  var apiUrl = 'https://api.github.com/repos/' + repo + '/releases/latest';

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('GitHub API response was not OK');
      }
      return response.json();
    })
    .then(function (data) {
      var tagName = data.tag_name;
      var downloadUrl = null;

      // Try to find the asset ending with .apk
      if (data.assets && data.assets.length > 0) {
        for (var i = 0; i < data.assets.length; i++) {
          var asset = data.assets[i];
          if (asset.name.indexOf('.apk') !== -1) {
            downloadUrl = asset.browser_download_url;
            break;
          }
        }
      }

      // Fallback construction if APK asset is not explicitly found
      if (!downloadUrl && tagName) {
        downloadUrl = 'https://github.com/' + repo + '/releases/download/' + tagName + '/BlueMesh-' + tagName + '.apk';
      }

      // Update download card href
      var downloadCard = document.getElementById('download-android');
      if (downloadCard && downloadUrl) {
        downloadCard.setAttribute('href', downloadUrl);
      }

      // Update download badge version tag
      var downloadMeta = document.querySelector('#download-android .download-meta');
      if (downloadMeta && tagName) {
        downloadMeta.textContent = 'APK • ' + tagName;
      }
    })
    .catch(function (error) {
      console.warn('Could not fetch latest release from GitHub API:', error);
      // Fallback values hardcoded in HTML will remain active
    });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchLatestRelease();
});


