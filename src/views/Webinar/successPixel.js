// Track which pixels are initialized
const initializedPixels = new Set();

export function initializeFacebookPixel(pixelId, amount) {
  console.log(pixelId, "pixelId");

  // --- Load <noscript> ONLY once ---
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

  // --- Load FB Script ONLY once ---
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

    // Fire PageView ONLY once
    window.fbq("track", "PageView");
  }

  // --- Init Pixel ONLY once per pixelId ---
  if (!initializedPixels.has(pixelId)) {
    window.fbq("set", "autoConfig", false, pixelId);
    window.fbq("init", pixelId);
    initializedPixels.add(pixelId);
  }

  // --- Avoid duplicate purchase event ---
  if (!window._purchaseTracked) {
    window.fbq("track", "Purchase", {
      value: amount?.toFixed(2) ?? "0.00",
      currency: "INR",
    });
    window._purchaseTracked = true;
  }
}
