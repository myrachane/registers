// Pushes the DNS records from this repository to the skrime.eu DNS API.
//
// Runs from `.github/workflows/deploy.yml` after a merge to `main`.
//
// The skrime API replaces the WHOLE zone on every POST ("Alle Einträge müssen
// übermittelt werden"), so this repository is the single source of truth: for
// each domain we collect every record from every subdomain file and submit the
// complete set in one request.
//
// Configuration:
//   - secret  SKRIME_API_URL : the zone endpoint, e.g. https://skrime.eu/api/dns/zone
//   - secret  SKRIME_API_KEY : your API token (sent as `Authorization: Bearer <key>`)
//   - zones.json             : maps each domain -> its skrime productId

const fs = require("fs");
const path = require("path");

const API_URL = process.env.SKRIME_API_URL;
const API_KEY = process.env.SKRIME_API_KEY;

const root = process.cwd();
const domainsDir = path.join(root, "domains");

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

if (!API_URL) fail("SKRIME_API_URL secret is not set.");
if (!API_KEY) fail("SKRIME_API_KEY secret is not set.");

const zones = JSON.parse(fs.readFileSync(path.join(root, "zones.json"), "utf8"));

// Collect every record for one domain (zone) from its subdomain folders.
function collectRecords(domain) {
  const records = [];
  const domainDir = path.join(domainsDir, domain);
  if (!fs.existsSync(domainDir)) return records;

  for (const sub of fs.readdirSync(domainDir)) {
    const subDir = path.join(domainDir, sub);
    if (!fs.statSync(subDir).isDirectory()) continue; // skip .gitkeep etc.

    for (const file of fs.readdirSync(subDir)) {
      if (!file.endsWith(".json")) continue;
      const label = file.replace(/\.json$/, "");
      // name relative to the zone: "@" apex of the subdomain -> just <sub>.
      const name = label === "@" ? sub : `${label}.${sub}`;

      const data = JSON.parse(fs.readFileSync(path.join(subDir, file), "utf8"));
      const recs = data.records || {};
      for (const [type, value] of Object.entries(recs)) {
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) {
          records.push({ name, type, data: String(v) });
        }
      }
    }
  }
  return records;
}

async function deployZone(domain, productId) {
  const records = collectRecords(domain);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ productId, records }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${domain}: HTTP ${res.status} ${text}`);
  }
  console.log(`[ok]   ${domain}: pushed ${records.length} record(s) (HTTP ${res.status})`);
}

(async () => {
  let failed = false;
  for (const [domain, productId] of Object.entries(zones)) {
    if (!productId || String(productId).startsWith("XXXX")) {
      console.log(`[skip] ${domain}: no productId configured in zones.json`);
      continue;
    }
    try {
      await deployZone(domain, productId);
    } catch (e) {
      failed = true;
      console.error(`[fail] ${e.message}`);
    }
  }
  if (failed) process.exit(1);
})();
