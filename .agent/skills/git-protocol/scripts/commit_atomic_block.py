#!/usr/bin/env python3
"""
commit_atomic_block.py

Crea un commit usando Conventional Commits.

Uso:
    python3 scripts/commit_atomic_block.py <type> <scope-opcional-o-dash> <message>

Ejemplos:
    python3 scripts/commit_atomic_block.py feat calendar "add scheduling summary"
    python3 scripts/commit_atomic_block.py fix - "prevent invalid token refresh loop"
"""

from __future__ import annotations

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


def main() -> int:
    if len(sys.argv) < 4:
        print("Uso: python3 scripts/commit_atomic_block.py <type> <scope-opcional-o-dash> <message>")
        return 1

    change_type = sys.argv[1].strip().lower()
    scope = sys.argv[2].strip()
    message = " ".join(sys.argv[3:]).strip()

    if change_type not in VALID_TYPES:
        print(f"Tipo inválido: {change_type}")
        return 1

    if not message:
        print("El mensaje no puede estar vacío.")
        return 1

    staged = run_git(["diff", "--cached", "--name-only"])
    if staged.returncode != 0:
        print("No se pudo verificar el stage actual.")
        return 1

    if not staged.stdout.strip():
        print("No hay archivos staged para commitear.")
        return 1

    if scope == "-" or scope == "":
        commit_message = f"{change_type}: {message}"
    else:
        commit_message = f"{change_type}({scope}): {message}"

    commit = run_git(["commit", "-m", commit_message])
    if commit.returncode != 0:
        print(commit.stderr.strip() or "No se pudo crear el commit.")
        return 1

    print(commit_message)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())