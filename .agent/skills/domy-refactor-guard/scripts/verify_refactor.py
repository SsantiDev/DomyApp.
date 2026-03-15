#!/usr/bin/env python3
"""
verify_refactor.py

Valida de forma básica si un cambio o una unidad de código candidata a refactor
cumple con principios mínimos de refactor seguro dentro de Domy.

Este script no demuestra equivalencia funcional completa.
Su objetivo es revisar señales estructurales y alertar sobre riesgos obvios.

Uso:
    python3 scripts/verify_refactor.py
    python3 scripts/verify_refactor.py /ruta/al/proyecto

Salida:
- OK / WARNING / ERROR / INFO
- exit code 0 si no hay errores graves
- exit code 1 si hay errores graves
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import List


RED = "\033[0;31m"
GREEN = "\033[0;32m"
YELLOW = "\033[1;33m"
BLUE = "\033[0;34m"
NC = "\033[0m"


class Report:
    def __init__(self) -> None:
        self.ok_count = 0
        self.warn_count = 0
        self.error_count = 0
        self.info_count = 0

    def ok(self, msg: str) -> None:
        self.ok_count += 1
        print(f"{GREEN}[OK]{NC} {msg}")

    def warn(self, msg: str) -> None:
        self.warn_count += 1
        print(f"{YELLOW}[WARNING]{NC} {msg}")

    def error(self, msg: str) -> None:
        self.error_count += 1
        print(f"{RED}[ERROR]{NC} {msg}")

    def info(self, msg: str) -> None:
        self.info_count += 1
        print(f"{BLUE}[INFO]{NC} {msg}")


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""


def collect_files(root: Path, suffixes: List[str]) -> List[Path]:
    files: List[Path] = []
    for suffix in suffixes:
        files.extend(root.rglob(f"*{suffix}"))
    return files


def check_frontend(report: Report, root: Path) -> None:
    print(f"\n{BLUE}--- Frontend Refactor Signals ---{NC}")
    ts_files = collect_files(root, [".ts", ".tsx"])

    if not ts_files:
        report.info("No se encontraron archivos TypeScript para revisar.")
        return

    report.ok(f"Archivos TypeScript detectados: {len(ts_files)}")

    oversized = [f for f in ts_files if len(read_text(f).splitlines()) > 400]
    if oversized:
        report.warn(f"Se detectaron {len(oversized)} archivos TypeScript con más de 400 líneas.")
    else:
        report.ok("No se detectaron archivos TypeScript excesivamente largos.")

    any_usage = []
    for f in ts_files:
        text = read_text(f)
        if ": any" in text or "<any>" in text or " as any" in text:
            any_usage.append(f)

    if any_usage:
        report.warn(f"Se detectó uso potencial de 'any' en {len(any_usage)} archivos.")
    else:
        report.ok("No se detectó uso evidente de 'any'.")

    deep_nesting = []
    for f in ts_files[:200]:
        text = read_text(f)
        if text.count("if (") >= 6 and text.count("{") > 20:
            deep_nesting.append(f)

    if deep_nesting:
        report.warn(f"Se detectaron posibles señales de complejidad condicional en {len(deep_nesting)} archivos.")
    else:
        report.info("No se detectaron señales fuertes de nesting complejo en muestra revisada.")


def check_backend(report: Report, root: Path) -> None:
    print(f"\n{BLUE}--- Backend Refactor Signals ---{NC}")
    py_files = collect_files(root, [".py"])

    if not py_files:
        report.info("No se encontraron archivos Python para revisar.")
        return

    report.ok(f"Archivos Python detectados: {len(py_files)}")

    oversized = [f for f in py_files if len(read_text(f).splitlines()) > 400]
    if oversized:
        report.warn(f"Se detectaron {len(oversized)} archivos Python con más de 400 líneas.")
    else:
        report.ok("No se detectaron archivos Python excesivamente largos.")

    long_functions = 0
    for f in py_files[:200]:
        lines = read_text(f).splitlines()
        current_len = 0
        inside_def = False

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("def ") or stripped.startswith("async def "):
                if inside_def and current_len > 80:
                    long_functions += 1
                inside_def = True
                current_len = 1
            elif inside_def:
                if stripped == "":
                    current_len += 1
                elif not line.startswith(" ") and not line.startswith("\t"):
                    if current_len > 80:
                        long_functions += 1
                    inside_def = False
                    current_len = 0
                else:
                    current_len += 1

        if inside_def and current_len > 80:
            long_functions += 1

    if long_functions > 0:
        report.warn(f"Se detectaron al menos {long_functions} funciones largas en muestra revisada.")
    else:
        report.ok("No se detectaron funciones excesivamente largas en muestra revisada.")


def check_project_structure(report: Report, root: Path) -> None:
    print(f"\n{BLUE}--- Project Structure Signals ---{NC}")
    package_json = list(root.rglob("package.json"))
    requirements = list(root.rglob("requirements.txt"))
    pyproject = list(root.rglob("pyproject.toml"))

    if package_json:
        report.ok("Se detectó al menos un package.json.")
    else:
        report.info("No se detectó package.json.")

    if requirements or pyproject:
        report.ok("Se detectó configuración de dependencias Python.")
    else:
        report.info("No se detectó requirements.txt ni pyproject.toml.")

    duplicated_names = {}
    for path in root.rglob("*"):
        if path.is_file():
            duplicated_names[path.name] = duplicated_names.get(path.name, 0) + 1

    repeated = {k: v for k, v in duplicated_names.items() if v >= 4}
    if repeated:
        report.info("Se detectaron varios nombres de archivo repetidos. Revisar si la organización es suficientemente clara.")
    else:
        report.ok("No se detectó repetición llamativa de nombres de archivo.")


def check_refactor_risk_markers(report: Report, root: Path) -> None:
    print(f"\n{BLUE}--- Risk Markers ---{NC}")
    all_files = collect_files(root, [".py", ".ts", ".tsx"])

    public_contract_markers = 0
    for f in all_files[:300]:
        text = read_text(f)
        if "export default" in text or "APIView" in text or "ViewSet" in text or "Serializer" in text:
            public_contract_markers += 1

    if public_contract_markers > 0:
        report.info(
            "Se detectaron archivos que probablemente forman parte de contratos públicos o capas sensibles. "
            "Cualquier refactor allí debe tratarse con mayor cuidado."
        )
    else:
        report.info("No se detectaron marcadores claros de contratos públicos en la muestra revisada.")


def main() -> int:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()

    print(f"{BLUE}=== DOMY REFACTOR GUARD Verification ==={NC}")
    print(f"{BLUE}Ruta analizada:{NC} {root}")

    if not root.exists():
        print(f"{RED}[ERROR]{NC} La ruta indicada no existe.")
        return 1

    report = Report()

    check_project_structure(report, root)
    check_frontend(report, root)
    check_backend(report, root)
    check_refactor_risk_markers(report, root)

    print(f"\n{BLUE}--- Summary ---{NC}")
    print(f"{GREEN}OK:{NC} {report.ok_count}")
    print(f"{YELLOW}Warnings:{NC} {report.warn_count}")
    print(f"{RED}Errors:{NC} {report.error_count}")
    print(f"{BLUE}Info:{NC} {report.info_count}")

    if report.error_count > 0:
        print(f"\n{RED}Verificación completada con errores graves.{NC}")
        return 1

    print(f"\n{GREEN}Verificación completada sin errores graves.{NC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())