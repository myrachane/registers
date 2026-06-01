# `domains/`

Every folder in here is a **domain you can get a free subdomain on**. The folder
name *is* the domain.

```
domains/
├── example.com/        ← available domain
│   ├── demo.json       ← demo.example.com
│   └── myname.json     ← myname.example.com
└── another-domain.dev/ ← available domain
    └── ...
```

## For maintainers: adding a new domain

1. Create a new folder named exactly after the domain, e.g. `domains/cool.dev/`.
2. Add a `.gitkeep` (or a first entry) so the empty folder is committed.
3. At your DNS provider, delegate / point the domain at wherever you apply the
   merged records (e.g. Cloudflare). See the deploy note in the root `README.md`.

That's it — the validation workflow automatically treats every folder under
`domains/` as an allowed domain.
