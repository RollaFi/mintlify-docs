(function () {
  // SHA-256 hash of the password "RollaPay2026!!#"
  // To change the password, generate a new hash: echo -n 'yourpassword' | shasum -a 256
  var PASSWORD_HASH = "7056465b51abcd9e271e2d9dc912441f325c13acd6d6273ffeb4598dbb00196a";

  // If already authenticated, immediately mark body and skip
  if (sessionStorage.getItem("rolla_docs_auth") === "true") {
    // Add class as soon as body exists to prevent flash
    function markAuth() { document.body.classList.add("rolla-authenticated"); }
    if (document.body) { markAuth(); }
    else { document.addEventListener("DOMContentLoaded", markAuth); }
    return;
  }

  function sha256(message) {
    var msgBuffer = new TextEncoder().encode(message);
    return crypto.subtle.digest("SHA-256", msgBuffer).then(function (hashBuffer) {
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }

  function createOverlay() {
    var overlay = document.createElement("div");
    overlay.id = "rolla-auth-overlay";
    overlay.style.cssText = "position:fixed;inset:0;background:#fff;z-index:999999;display:flex;align-items:center;justify-content:center;font-family:Space Grotesk,system-ui,sans-serif;visibility:visible!important";
    overlay.innerHTML =
      '<div style="text-align:center;max-width:380px;padding:40px">' +
        '<div style="margin-bottom:24px">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#274601" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>' +
            '<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>' +
          '</svg>' +
        '</div>' +
        '<h1 style="font-size:24px;font-weight:700;color:#274601;margin:0 0 8px">Rolla Pay Documentation</h1>' +
        '<p style="font-size:14px;color:#666;margin:0 0 24px">Enter the access password to continue</p>' +
        '<form id="rolla-auth-form">' +
          '<input id="rolla-auth-input" type="password" placeholder="Enter password" autocomplete="off" ' +
            'style="width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:8px;font-size:16px;font-family:inherit;outline:none;box-sizing:border-box">' +
          '<p id="rolla-auth-error" style="color:#dc2626;font-size:13px;margin:8px 0 0;display:none">Incorrect password</p>' +
          '<button type="submit" style="width:100%;margin-top:16px;padding:12px;background:#274601;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:600;font-family:inherit;cursor:pointer">Access Documentation</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    var form = document.getElementById("rolla-auth-form");
    var input = document.getElementById("rolla-auth-input");
    var error = document.getElementById("rolla-auth-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      sha256(input.value).then(function (hash) {
        if (hash === PASSWORD_HASH) {
          sessionStorage.setItem("rolla_docs_auth", "true");
          overlay.remove();
          document.body.classList.add("rolla-authenticated");
        } else {
          error.style.display = "block";
          input.style.borderColor = "#dc2626";
          input.value = "";
          setTimeout(function () {
            input.style.borderColor = "#e2e8f0";
            error.style.display = "none";
          }, 2000);
        }
      });
    });

    input.focus();
  }

  if (document.body) {
    createOverlay();
  } else {
    document.addEventListener("DOMContentLoaded", createOverlay);
  }
})();
