# BDX I/O 2026

Sources de la présentation et de ses démos.

## Lancer en local

Prérequis : Bun, Podman avec Compose et `mkcert`, ainsi qu’un navigateur récent.

À la première utilisation :

```sh
bun install
cp -n .env.example .env
mkcert -install
bun run proxy:certs
bun run proxy:hosts # demande sudo pour configurer le domaine local
```

Démarrer Podman, puis lancer dans deux terminaux :

```sh
# Terminal 1
bun run dev

# Terminal 2
bun run proxy:start
```

Ouvrir [la présentation](https://bdxio2026.demo/presentation/).
Pour arrêter le proxy : `bun run proxy:stop`.
