#!/usr/bin/env python3
"""
verify_git_flow.py

Verifica condiciones mínimas para ejecutar el flujo Git atómico:
- repo git disponible
- branch actual detectable
- estado general del repo
- cambios staged o unstaged visibles
- ausencia de archivos sensibles obvios
- coherencia básica antes de commit o merge

Uso:
    python3 scripts/verify_git_flow.py
"""

from __future__ import annotations

import subprocess
import sys


RED = "\033[0;31m"
GREEN = "\033[0;32m"
YELLOW = "\033[1;33m"
BLUE = "\033[0;34m"
NC = "\033[0m"


class Report:
    def __init__(self) -> None:
        self.errors = 0
        self.warnings = 0
        self.ok = 0
        self.info = 0

    def ok_print(self, msg: str) -> None:
        self.ok += 1
        print(f"{GREEN}[OK]{NC} {msg}")

    def warn_print(self, msg: str) -> None:
        self.warnings += 1
        print(f"{YELLOW}[WARNING]{NC} {msg}")

    def error_print(self, msg: str) -> None:
        self.errors += 1
        print(f"{RED}[ERROR]{NC} {msg}")

    def info_print(self, msg: str) -> None:
        self.info += 1
        print(f"{BLUE}[INFO]{NC} {msg}")


def run_git(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )


def main() -> int:
    report = Report()

    print(f"{BLUE}=== GIT PROTOCOL Verification ==={NC}")

    repo = run_git(["rev-parse", "--show-toplevel"])
    if repo.returncode != 0:
        report.error_print("No se detectó un repositorio Git válido.")
        return finish(report)

    report.ok_print(f"Repositorio Git detectado en: {repo.stdout.strip()}")

    branch = run_git(["rev-parse", "--abbrev-ref", "HEAD"])
    if branch.returncode != 0:
        report.error_print("No se pudo detectar la rama actual.")
        return finish(report)

    current_branch = branch.stdout.strip()
    report.ok_print(f"Rama actual: {current_branch}")

    status = run_git(["status", "--short"])
    if status.returncode != 0:
        report.error_print("No se pudo obtener git status.")
        return finish(report)

    status_lines = [line for line in status.stdout.splitlines() if line.strip()]
    if not status_lines:
        report.warn_print("No hay cambios pendientes en el repositorio.")
    else:
        report.ok_print(f"Se detectaron {len(status_lines)} cambios en el repositorio.")

    staged = run_git(["diff", "--cached", "--name-only"])
    if staged.returncode != 0:
        report.error_print("No se pudo obtener el listado de archivos staged.")
        return finish(report)

    staged_files = [line for line in staged.stdout.splitlines() if line.strip()]
    if staged_files:
        report.ok_print(f"Archivos staged detectados: {len(staged_files)}")
    else:
        report.warn_print("No hay archivos staged actualmente.")

    suspicious_patterns = [
        ".env",
        ".pem",
        ".key",
        "secret",
        "credential",
        ".log",
        "dump",
        "backup",
        ".sqlite",
        ".db",
    ]

    suspicious_found = []
    for line in status_lines:
        lower = line.lower()
        if any(pattern in lower for pattern in suspicious_patterns):
            suspicious_found.append(line)

    if suspicious_found:
        report.error_print("Se detectaron archivos potencialmente sensibles o ruidosos:")
        for item in suspicious_found:
            report.error_print(f"  - {item}")
    else:
        report.ok_print("No se detectaron archivos sensibles obvios en git status.")

    if current_branch == "develop":
        report.info_print("La rama actual es develop. Crea una rama atómica antes de hacer commit.")
    else:
        report.info_print("La rama actual no es develop. Verifica que corresponda al bloque actual.")

    diff_stat = run_git(["diff", "--cached", "--stat"])
    if diff_stat.returncode == 0 and diff_stat.stdout.strip():
        report.info_print("Resumen del diff staged:")
        for line in diff_stat.stdout.splitlines():
            print(f"  {line}")

    return finish(report)


def finish(report: Report) -> int:
    print(f"\n{BLUE}--- Summary ---{NC}")
    print(f"{GREEN}OK:{NC} {report.ok}")
    print(f"{YELLOW}Warnings:{NC} {report.warnings}")
    print(f"{RED}Errors:{NC} {report.errors}")
    print(f"{BLUE}Info:{NC} {report.info}")

    if report.errors > 0:
        print(f"\n{RED}Verificación completada con errores graves.{NC}")
        return 1

    print(f"\n{GREEN}Verificación completada sin errores graves.{NC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())