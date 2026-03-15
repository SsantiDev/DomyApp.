#!/usr/bin/env python3
"""
verify_arch.py

Valida de forma básica si un repositorio o propuesta técnica está alineado con
la arquitectura oficial de Domy en Mobil.

Qué revisa:
- Backend Django / DRF
- Configuración de base de datos (SQLite o PostgreSQL)
- Uso esperado de SimpleJWT
- Frontend React Native / Expo / TypeScript
- Estructura mínima sugerida

Uso:
    python3 scripts/verify_arch.py
    python3 scripts/verify_arch.py /ruta/al/proyecto

Salida:
- imprime hallazgos con niveles OK / WARNING / ERROR / INFO
- retorna exit code 0 si no hay errores graves
- retorna exit code 1 si hay errores graves
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import List, Tuple


RED = "\033[0;31m"
GREEN = "\033[0;32m"
YELLOW = "\033[1;33m"
BLUE = "\033[0;34m"
NC = "\033[0m"


class VerificationReport:
    def __init__(self) -> None:
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.infos: List[str] = []
        self.successes: List[str] = []

    def ok(self, msg: str) -> None:
        self.successes.append(msg)
        print(f"{GREEN}[OK]{NC} {msg}")

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)
        print(f"{YELLOW}[WARNING]{NC} {msg}")

    def error(self, msg: str) -> None:
        self.errors.append(msg)
        print(f"{RED}[ERROR]{NC} {msg}")

    def info(self, msg: str) -> None:
        self.infos.append(msg)
        print(f"{BLUE}[INFO]{NC} {msg}")

    def has_errors(self) -> bool:
        return len(self.errors) > 0


def read_text_if_exists(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""
    except Exception:
        return ""


def find_first_existing(base: Path, candidates: List[str]) -> Tuple[Path | None, str | None]:
    for candidate in candidates:
        path = base / candidate
        if path.exists():
            return path, candidate
    return None, None


def check_backend(project_root: Path, report: VerificationReport) -> None:
    print(f"\n{BLUE}--- Backend Architecture (Django) ---{NC}")

    backend_candidates = [
        "backend",
        "Backend",
        "server",
        "api",
    ]
    backend_path, backend_name = find_first_existing(project_root, backend_candidates)

    if not backend_path:
        report.error("No se encontró carpeta backend candidata: backend, Backend, server o api.")
        return

    report.ok(f"Backend detectado en '{backend_name}'.")

    apps_candidates = [
        backend_path / "apps",
        backend_path / "modules",
    ]
    if any(path.exists() for path in apps_candidates):
        report.ok("Estructura modular de backend detectada (apps/modules).")
    else:
        report.warn("No se detectó carpeta modular tipo 'apps' o 'modules'.")

    settings_candidates = [
        backend_path / "core" / "settings.py",
        backend_path / "config" / "settings.py",
        backend_path / "settings.py",
    ]
    settings_path = next((p for p in settings_candidates if p.exists()), None)

    if not settings_path:
        report.error("No se encontró archivo settings.py en ubicaciones comunes.")
        return

    report.ok(f"Archivo de settings detectado en '{settings_path.relative_to(project_root)}'.")
    content = read_text_if_exists(settings_path)

    if "django.db.backends.sqlite3" in content:
        report.ok("Base de datos SQLite detectada.")
    elif "django.db.backends.postgresql" in content or "django.db.backends.postgresql_psycopg2" in content:
        report.ok("Base de datos PostgreSQL detectada.")
    else:
        report.warn("No se detectó explícitamente SQLite ni PostgreSQL en settings.")

    if "rest_framework" in content:
        report.ok("Django REST Framework detectado en settings.")
    else:
        report.warn("No se detectó 'rest_framework' en settings.")

    if "rest_framework_simplejwt" in content or "JWTAuthentication" in content or "SIMPLE_JWT" in content:
        report.ok("Configuración relacionada con SimpleJWT detectada.")
    else:
        report.warn("No se detectó configuración evidente de SimpleJWT en settings.")

    requirements_candidates = [
        backend_path / "requirements.txt",
        project_root / "requirements.txt",
        backend_path / "pyproject.toml",
        project_root / "pyproject.toml",
    ]

    req_path = next((p for p in requirements_candidates if p.exists()), None)
    if req_path:
        req_content = read_text_if_exists(req_path)
        if "djangorestframework" in req_content.lower():
            report.ok("Dependencia de DRF detectada.")
        if "simplejwt" in req_content.lower():
            report.ok("Dependencia de SimpleJWT detectada.")
    else:
        report.info("No se encontró requirements.txt o pyproject.toml para validar dependencias backend.")


def check_frontend(project_root: Path, report: VerificationReport) -> None:
    print(f"\n{BLUE}--- Frontend Architecture (React Native) ---{NC}")

    frontend_candidates = [
        "frontend",
        "Frontend",
        "app",
        "mobile",
        "Fronted",  # compatibilidad con typo existente
    ]
    frontend_path, frontend_name = find_first_existing(project_root, frontend_candidates)

    if not frontend_path:
        report.error("No se encontró carpeta frontend candidata: frontend, Frontend, app, mobile o Fronted.")
        return

    report.ok(f"Frontend detectado en '{frontend_name}'.")

    if frontend_name == "Fronted":
        report.warn("Se detectó carpeta 'Fronted'. Se recomienda renombrarla a 'frontend' o 'Frontend'.")

    expected_dirs = ["components", "hooks", "src"]
    found_any = False
    for folder in expected_dirs:
        if (frontend_path / folder).exists():
            report.ok(f"Directorio '{folder}' detectado en frontend.")
            found_any = True

    if not found_any:
        report.warn("No se detectaron directorios comunes como components, hooks o src.")

    package_json = frontend_path / "package.json"
    if not package_json.exists():
        report.error("No se encontró package.json en frontend.")
        return

    report.ok("package.json detectado en frontend.")

    try:
        data = json.loads(package_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        report.error("package.json no es un JSON válido.")
        return

    dependencies = data.get("dependencies", {})
    dev_dependencies = data.get("devDependencies", {})
    all_deps = {**dependencies, **dev_dependencies}

    if "expo" in all_deps:
        report.ok("Expo detectado.")
    elif "react-native" in all_deps:
        report.ok("React Native detectado.")
    else:
        report.warn("No se detectó ni Expo ni React Native en dependencias.")

    if "typescript" in all_deps:
        report.ok("TypeScript detectado.")
    else:
        report.warn("No se detectó TypeScript en dependencias.")

    if "@react-navigation/native" in all_deps:
        report.ok("React Navigation detectado.")
    else:
        report.info("No se detectó React Navigation. No es obligatorio, pero es común en apps móviles.")

    local_storage_candidates = [
        "@react-native-async-storage/async-storage",
        "expo-sqlite",
    ]
    found_storage = [dep for dep in local_storage_candidates if dep in all_deps]
    if found_storage:
        report.ok(f"Persistencia local detectada: {', '.join(found_storage)}.")
    else:
        report.warn("No se detectó AsyncStorage ni Expo SQLite en dependencias frontend.")


def check_skill_alignment(report: VerificationReport) -> None:
    print(f"\n{BLUE}--- Skill Alignment Rules ---{NC}")
    report.info("Criterios esperados por la skill:")
    report.info("- frontend con React Native/Expo + TypeScript")
    report.info("- backend con Django + DRF")
    report.info("- base de datos SQLite o PostgreSQL")
    report.info("- autenticación JWT con SimpleJWT")
    report.info("- persistencia local móvil usando AsyncStorage o Expo SQLite cuando aplique")


def main() -> int:
    project_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()

    print(f"{BLUE}=== ARQUITECTURA Verification ==={NC}")
    print(f"{BLUE}Proyecto analizado:{NC} {project_root}")

    report = VerificationReport()

    if not project_root.exists():
        print(f"{RED}[ERROR]{NC} La ruta indicada no existe: {project_root}")
        return 1

    check_backend(project_root, report)
    check_frontend(project_root, report)
    check_skill_alignment(report)

    print(f"\n{BLUE}--- Summary ---{NC}")
    print(f"{GREEN}OK:{NC} {len(report.successes)}")
    print(f"{YELLOW}Warnings:{NC} {len(report.warnings)}")
    print(f"{RED}Errors:{NC} {len(report.errors)}")
    print(f"{BLUE}Info:{NC} {len(report.infos)}")

    if report.has_errors():
        print(f"\n{RED}Verificación completada con errores graves.{NC}")
        return 1

    print(f"\n{GREEN}Verificación completada sin errores graves.{NC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())