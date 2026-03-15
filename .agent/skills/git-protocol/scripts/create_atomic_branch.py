#!/usr/bin/env python3
"""
create_atomic_branch.py

Crea una rama atómica desde develop usando:
    python3 scripts/create_atomic_branch.py <type> <short-description>

Ejemplo:
    python3 scripts/create_atomic_branch.py feat add-payment-breakdown
"""

from __future__ import annotations

import re
import subprocess
import sys


VALID_TYPES = {
    "feat",
    "fix",
    "refactor",
    "docs",
    "test",
    "style",
    "chore",
    "build",
    "ci",
    "perf",
}


def run_git(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value


def main() -> int:
    if len(sys.argv) < 3:
        print("Uso: python3 scripts/create_atomic_branch.py <type> <short-description>")
        return 1

    change_type = sys.argv[1].strip().lower()
    description = " ".join(sys.argv[2:]).strip()

    if change_type not in VALID_TYPES:
        print(f"Tipo inválido: {change_type}")
        return 1

    slug = slugify(description)
    if not slug:
        print("La descripción de la rama no puede quedar vacía.")
        return 1

    branch_name = f"{change_type}/{slug}"

    current = run_git(["rev-parse", "--abbrev-ref", "HEAD"])
    if current.returncode != 0:
        print("No se pudo detectar la rama actual.")
        return 1

    status = run_git(["status", "--short"])
    if status.returncode != 0:
        print("No se pudo obtener git status.")
        return 1

    if status.stdout.strip():
        print("Hay cambios sin limpiar en el working tree. Segmenta y stagea con cuidado antes de cambiar de rama.")
        return 1

    checkout_develop = run_git(["checkout", "develop"])
    if checkout_develop.returncode != 0:
        print(checkout_develop.stderr.strip() or "No se pudo cambiar a develop.")
        return 1

    pull_develop = run_git(["pull", "origin", "develop"])
    if pull_develop.returncode != 0:
        print(pull_develop.stderr.strip() or "No se pudo actualizar develop.")
        return 1

    create_branch = run_git(["checkout", "-b", branch_name])
    if create_branch.returncode != 0:
        print(create_branch.stderr.strip() or "No se pudo crear la rama.")
        return 1

    print(branch_name)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())