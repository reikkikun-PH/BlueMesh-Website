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

/* --- Interactive App Guide --- */
function initAppGuide() {
  // --- PIN Pad Logic ---
  var pinEntry = [];
  var pinDots = document.querySelectorAll('#pin-indicator .pin-dot');
  var pinStatus = document.getElementById('pin-status');
  var pinPad = document.querySelector('.pin-pad');
  var pinLocked = false;

  if (pinPad) {
    var keys = pinPad.querySelectorAll('span');
    keys.forEach(function (key) {
      key.addEventListener('click', function () {
        if (pinLocked) return;
        var val = key.textContent;

        // Press feedback
        key.classList.add('pressed');
        setTimeout(function () { key.classList.remove('pressed'); }, 150);

        if (val === 'C') {
          // Clear
          pinEntry = [];
          updatePinDots();
          if (pinStatus) {
            pinStatus.textContent = '';
            pinStatus.className = 'pin-status';
          }
        } else if (val === '✓') {
          if (pinEntry.length === 4) { handlePinSuccess(); }
          else if (pinStatus) {
            pinStatus.textContent = 'Enter 4 digits';
            pinStatus.className = 'pin-status error';
          }
        } else {
          if (pinEntry.length < 4) {
            pinEntry.push(val);
            updatePinDots();
            if (pinEntry.length === 4) {
              handlePinSuccess();
            }
          }
        }
      });
    });
  }

  function updatePinDots() {
    pinDots.forEach(function (dot, i) {
      dot.classList.remove('active', 'success');
      if (i < pinEntry.length) { dot.classList.add('active'); }
    });
  }

  function handlePinSuccess() {
    pinLocked = true;
    pinDots.forEach(function (dot) {
      dot.classList.remove('active');
      dot.classList.add('success');
    });
    if (pinStatus) {
      pinStatus.textContent = '✓ Unlocked';
      pinStatus.className = 'pin-status success';
    }
    // Pause, then reset so user can interact with it again
    setTimeout(function () {
      pinEntry = [];
      pinLocked = false;
      updatePinDots();
      if (pinStatus) {
        pinStatus.textContent = '';
        pinStatus.className = 'pin-status';
      }
    }, 1500);
  }

  // --- Discovery Scan Simulation ---
  var discoveryOverlay = document.getElementById('discovery-overlay');
  var peerList = document.getElementById('peer-list');
  var scanTriggerBtn = document.getElementById('scan-trigger-btn');

  function triggerDiscoveryScan() {
    if (!discoveryOverlay || !peerList) return;

    // Show overlay and hide peers
    discoveryOverlay.classList.add('active');
    peerList.classList.add('loading');

    setTimeout(function () {
      discoveryOverlay.classList.remove('active');
      // Small delay for peers to transition in
      setTimeout(function () {
        peerList.classList.remove('loading');
      }, 50);
    }, 1400);
  }

  if (scanTriggerBtn) {
    scanTriggerBtn.addEventListener('click', triggerDiscoveryScan);
  }

  // --- Chat Input Logic ---
  var chatInput = document.getElementById('chat-input');
  var chatSendBtn = document.getElementById('chat-send-btn');
  var chatContent = document.querySelector('.chat-screen-content');

  var replyMessages = [
    'Received through the relay mesh! Thanks.',
    'Message received via Jemar\u2019s node. Signal strong.',
    'Copy that. Multi-hop confirmed.',
    'Got it! Relay path verified.',
    'Roger. Bluetooth mesh link stable.'
  ];
  var replyIndex = 0;

  function sendChatMessage() {
    if (!chatInput || !chatContent) return;
    var text = chatInput.value.trim();
    if (text === '') return;

    // Create sent bubble
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble right fade-in';
    var now = new Date();
    var timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    bubble.innerHTML = text +
      '<span class="bubble-time">' + timeStr +
      ' <span class="bubble-check">✓✓</span></span>';
    chatContent.appendChild(bubble);
    chatInput.value = '';
    chatContent.scrollTop = chatContent.scrollHeight;

    // Auto-reply after delay
    setTimeout(function () {
      var reply = document.createElement('div');
      reply.className = 'chat-bubble left relay-msg fade-in';
      var replyText = replyMessages[replyIndex % replyMessages.length];
      replyIndex++;
      reply.innerHTML =
        '<small style="font-size: 0.55rem; color: var(--cyan); display: block; margin-bottom: 2px;">[Relay Node Boost]</small>' +
        replyText +
        '<span class="bubble-time">' + timeStr + '</span>';
      chatContent.appendChild(reply);
      chatContent.scrollTop = chatContent.scrollHeight;
    }, 1500);
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendChatMessage);
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // --- SOS Overlay ---
  var sosBtn = document.getElementById('sos-btn');
  var sosOverlay = document.getElementById('sos-overlay');
  var sosDismiss = document.getElementById('sos-dismiss');

  if (sosBtn && sosOverlay) {
    sosBtn.addEventListener('click', function () {
      sosOverlay.classList.add('active');
    });
  }
  if (sosDismiss && sosOverlay) {
    sosDismiss.addEventListener('click', function () {
      sosOverlay.classList.remove('active');
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fetchLatestRelease();
  initAppGuide();
});


