const initializedPixels = new Set();

export function initializeFacebookPixel(pixelId) {
  if (!window.fbq) {
    // Load FB base script ONLY once
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

    // Track PageView ONLY once
    window.fbq("track", "PageView");
  }

  // Initialize each pixel ONLY once
  if (!initializedPixels.has(pixelId)) {
    window.fbq("set", "autoConfig", false, pixelId);
    window.fbq("init", pixelId);
    initializedPixels.add(pixelId);
  }

if (!window._checkoutTracked) {
  console.log("InitiateCheckout fired ONCE");
  window.fbq("track", "InitiateCheckout");
  window._checkoutTracked = true;
}
}
