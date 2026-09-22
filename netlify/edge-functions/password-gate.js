// CATS Insights — temporary review gate
// -------------------------------------------------------------------------
// Server-side HTTP Basic authentication. Nothing on the site (pages, PDFs,
// images, video) is sent to a browser until the correct password is given.
// Fails closed: any missing, malformed or wrong credential gets a 401.
//
// The password is not stored here in plain text, only its SHA-256 hash.
// Any username is accepted; only the password is checked.
//
// TO REMOVE THE GATE: delete this file, commit, push. Nothing else changes.
// -------------------------------------------------------------------------

const PASSWORD_SHA256 = "10655f7f01f682712980c47f6b9dbb083e888876c887a2c88973fedf93a37144";
const REALM = "CATS Insights (in review)";

const LOCKED_PAGE = `<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>CATS Insights — in review</title></head>
<body style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:15vh auto;padding:0 24px;color:#1A1A1A;line-height:1.6">
<h1 style="color:#25344F;font-weight:normal">CATS Insights</h1>
<p>Edition 1 is currently in final review. This site is temporarily restricted to reviewers.</p>
<p style="color:#575756;font-size:14px">Published by The Worthgate School, 68 New Dover Road, Canterbury, Kent, CT1 3LQ, United Kingdom.</p>
</body></html>`;

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function challenge() {
  return new Response(LOCKED_PAGE, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default async (request, context) => {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return challenge();

  let decoded;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return challenge();
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return challenge();

  const password = decoded.slice(sep + 1);
  if ((await sha256Hex(password)) !== PASSWORD_SHA256) return challenge();

  const upstream = await context.next();
  const response = new Response(upstream.body, upstream);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
};

export const config = { path: "/*" };
