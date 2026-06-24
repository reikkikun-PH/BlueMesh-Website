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

/* --- Smooth Slow Scrolling --- */
function slowScrollTo(targetPosition, duration) {
  var startPosition = window.pageYOffset || document.documentElement.scrollTop;
  var distance = targetPosition - startPosition;
  var startTime = null;

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    var timeElapsed = currentTime - startTime;
    var run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }

  requestAnimationFrame(animation);
}

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

    // Scroll slowly over 1400ms
    slowScrollTo(targetPosition, 1400);
  });
}

/* --- Disable Right-Click --- */
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

/* --- Fetch Latest GitHub Release --- */
function fetchLatestRelease(repo, cardId, fileExtension, fallbackPrefix, badgePrefix) {
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

      // Try to find the asset with the specified extension
      if (data.assets && data.assets.length > 0) {
        for (var i = 0; i < data.assets.length; i++) {
          var asset = data.assets[i];
          if (asset.name.indexOf(fileExtension) !== -1) {
            downloadUrl = asset.browser_download_url;
            break;
          }
        }
      }

      // Fallback construction if asset is not explicitly found
      if (!downloadUrl && tagName) {
        downloadUrl = 'https://github.com/' + repo + '/releases/download/' + tagName + '/' + fallbackPrefix + '-' + tagName + fileExtension;
      }

      // Update download card href
      var downloadCard = document.getElementById(cardId);
      if (downloadCard && downloadUrl) {
        downloadCard.setAttribute('href', downloadUrl);
      }

      // Update download badge version tag
      var downloadMeta = document.querySelector('#' + cardId + ' .download-meta');
      if (downloadMeta && tagName) {
        downloadMeta.textContent = badgePrefix + ' • ' + tagName;
      }
    })
    .catch(function (error) {
      console.warn('Could not fetch latest release for ' + repo + ' from GitHub API:', error);
      // Fallback values hardcoded in HTML will remain active
    });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchLatestRelease('reikkikun-PH/BlueMesh', 'download-android', '.apk', 'BlueMesh', 'APK');
  fetchLatestRelease('reikkikun-PH/BlueMesh-API', 'download-api', '.zip', 'BlueMesh-API', 'ZIP');
});


