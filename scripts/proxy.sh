#!/usr/bin/env bash
set -euo pipefail

TASK_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="${TASK_ROOT}/infra"
DOMAIN="bdxio2026.demo"

case "${1:-}" in
  hosts)
    if awk '$1 == "127.0.0.1" { for (i = 2; i <= NF; i++) if ($i == "bdxio2026.demo") found = 1 } END { exit !found }' /etc/hosts; then
      echo "${DOMAIN} est déjà associé à 127.0.0.1."
    else
      printf '\n127.0.0.1 bdxio2026.demo\n' | sudo tee -a /etc/hosts >/dev/null
      echo "${DOMAIN} est maintenant associé à 127.0.0.1."
    fi
    ;;
  certs)
    command -v mkcert >/dev/null || { echo 'mkcert est nécessaire.' >&2; exit 1; }
    if [[ ! -f "$(mkcert -CAROOT)/rootCA.pem" ]]; then
      echo 'Initialisez votre autorité locale avec mkcert -install, puis relancez cette commande.' >&2
      exit 1
    fi
    mkdir -p "${INFRA_DIR}/certs"
    mkcert -cert-file "${INFRA_DIR}/certs/${DOMAIN}.pem" \
      -key-file "${INFRA_DIR}/certs/${DOMAIN}-key.pem" "$DOMAIN"
    ;;
  start)
    if [[ ! -f "${INFRA_DIR}/certs/${DOMAIN}.pem" || ! -f "${INFRA_DIR}/certs/${DOMAIN}-key.pem" ]]; then
      echo 'Générez les certificats avec bun run proxy:certs.' >&2
      exit 1
    fi
    podman compose -f "${INFRA_DIR}/compose.yml" up -d
    echo "Présentation : https://${DOMAIN} (Vite doit tourner sur le port 5173)."
    ;;
  stop)
    podman compose -f "${INFRA_DIR}/compose.yml" down
    ;;
  check)
    podman compose -f "${INFRA_DIR}/compose.yml" config --quiet
    podman compose -f "${INFRA_DIR}/compose.yml" run --rm --no-deps nginx nginx -t
    ;;
  *)
    echo 'Usage : bash scripts/proxy.sh <hosts|certs|start|stop|check>' >&2
    exit 1
    ;;
esac
