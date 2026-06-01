# `domains/`

Every folder in here is a **domain you can get a free subdomain on**. The folder
name *is* the domain.

```
domains/
├── addictedto.beer/    ← available domain
│   └── myname.json     ← myname.addictedto.beer
├── skillissue.gg/      ← available domain
│   └── ...
└── hasno.fitness/      ← available domain
    └── ...
```

## For maintainers: adding a new domain

1. Create a new folder named exactly after the domain, e.g. `domains/new.tld/`.
2. Add a `.gitkeep` (or a first entry) so the empty folder is committed.
3. At your DNS provider, delegate / point the domain at wherever you apply the
   merged records (e.g. Cloudflare). See the deploy note in the root `README.md`.

That's it — the validation workflow automatically treats every folder under
`domains/` as an allowed domain.
