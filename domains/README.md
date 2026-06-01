# `domains/`

Every folder in here is a **domain you can get a free subdomain on**. The folder
name *is* the domain.

```
domains/
├── addictedto.beer/        ← available domain
│   └── myname/             ← subdomain folder
│       ├── @.json          ← myname.addictedto.beer
│       └── blog.json       ← blog.myname.addictedto.beer (nested, optional)
└── skillissue.gg/          ← available domain
    └── ...
```

Folders named `@` or `*` are rejected by the validation workflow (apex and
wildcards are reserved).

## For maintainers: adding a new domain

1. Create a new folder named exactly after the domain, e.g. `domains/new.tld/`.
2. Add a `.gitkeep` (or a first entry) so the empty folder is committed.
3. At your DNS provider, delegate / point the domain at wherever you apply the
   merged records (e.g. Cloudflare). See the deploy note in the root `README.md`.

That's it — the validation workflow automatically treats every folder under
`domains/` as an allowed domain.
