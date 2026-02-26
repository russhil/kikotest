// Keep track of which pixels were initialized
const initializedPixels = new Set();

export function initializeFacebookPixel(pixelId, userData=null) {
  console.log(pixelId, "pixelId");

  // --- Load <noscript> ONLY once per pixelId ---
  if (!document.getElementById(`fb-noscript-${pixelId}`)) {
    const noscript = document.createElement("noscript");
    noscript.id = `fb-noscript-${pixelId}`;

    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;

    noscript.appendChild(img);
    document.body.appendChild(noscript);
  }

  // --- Load fbq script ONLY once ---
  if (!window.fbq) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];

      t = b.createElement(e);
      t.async = true;
      t.src = v;

      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    // Track PageView only ONCE globally
    window.fbq("track", "PageView");
  }

  // --- Initialize this pixelId ONLY once ---
  if (!initializedPixels.has(pixelId)) {
    window.fbq("set", "autoConfig", false, pixelId);
    if (userData) {
      window.fbq("init", pixelId, userData); // Advanced matching
    } else {
      window.fbq("init", pixelId);
    }

    initializedPixels.add(pixelId);
  }
}
