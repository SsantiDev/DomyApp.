#!/usr/bin/env python3
"""
merge_to_develop.py

Hace push de la rama actual, mergea a develop, valida el resultado y elimina
la rama local y remota si el merge fue exitoso.

Uso:
    python3 scripts/merge_to_develop.py
"""

from __future__ import annotations

import subprocess
import sys


def run_git(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )


def main() -> int:
    current_branch_proc = run_git(["rev-parse", "--abbrev-ref", "HEAD"])
    if current_branch_proc.returncode != 0:
        print("No se pudo detectar la rama actual.")
        return 1

    current_branch = current_branch_proc.stdout.strip()

    if current_branch == "develop":
        print("No se puede mergear desde develop hacia develop.")
        return 1

    push_branch = run_git(["push", "-u", "origin", current_branch])
    if push_branch.returncode != 0:
        print(push_branch.stderr.strip() or "No se pudo hacer push de la rama actual.")
        return 1

    checkout_develop = run_git(["checkout", "develop"])
    if checkout_develop.returncode != 0:
        print(checkout_develop.stderr.strip() or "No se pudo cambiar a develop.")
        return 1

    pull_develop = run_git(["pull", "origin", "develop"])
    if pull_develop.returncode != 0:
        print(pull_develop.stderr.strip() or "No se pudo actualizar develop.")
        return 1

    merge_branch = run_git(["merge", "--no-ff", current_branch])
    if merge_branch.returncode != 0:
        print(merge_branch.stderr.strip() or "El merge falló.")
        return 1

    push_develop = run_git(["push", "origin", "develop"])
    if push_develop.returncode != 0:
        print(push_develop.stderr.strip() or "No se pudo hacer push de develop.")
        return 1

    status = run_git(["status", "--short"])
    if status.returncode != 0:
        print("No se pudo verificar el estado posterior al merge.")
        return 1

    if status.stdout.strip():
        print("El repositorio no quedó limpio después del merge. No se eliminará la rama.")
        return 1

    delete_local = run_git(["branch", "-d", current_branch])
    if delete_local.returncode != 0:
        print(delete_local.stderr.strip() or "No se pudo eliminar la rama local.")
        return 1

    delete_remote = run_git(["push", "origin", "--delete", current_branch])
    if delete_remote.returncode != 0:
        print(delete_remote.stderr.strip() or "No se pudo eliminar la rama remota.")
        return 1

    print(f"Merge exitoso. Rama integrada y eliminada: {current_branch}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())