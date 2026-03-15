#!/usr/bin/env python3
"""
verify_product_alignment.py

Valida de forma básica si un texto, propuesta o documento parece alineado con
el contexto estratégico y funcional de Domy App.

Este script no reemplaza el análisis de producto.
Sirve como checklist automatizado de señales de alineación y riesgo.

Uso:
    python3 scripts/verify_product_alignment.py
    python3 scripts/verify_product_alignment.py propuesta.md
    python3 scripts/verify_product_alignment.py "Agregar perfiles verificados con historial y soporte"

Salida:
- imprime hallazgos con niveles OK / WARNING / ERROR / INFO
- retorna exit code 0 si no hay errores graves
- retorna exit code 1 si faltan demasiados elementos clave
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import List, Tuple


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


def read_input() -> Tuple[str, str]:
    if len(sys.argv) < 2:
        return "", "Sin entrada explícita"

    raw = sys.argv[1]
    path = Path(raw)

    if path.exists() and path.is_file():
        try:
            return path.read_text(encoding="utf-8"), f"Archivo: {path}"
        except Exception:
            return "", f"No se pudo leer el archivo: {path}"

    return raw, "Texto inline"


def contains_any(text: str, keywords: List[str]) -> bool:
    lowered = text.lower()
    return any(keyword.lower() in lowered for keyword in keywords)


def count_matches(text: str, keywords: List[str]) -> int:
    lowered = text.lower()
    return sum(1 for keyword in keywords if keyword.lower() in lowered)


def main() -> int:
    report = Report()
    text, source_label = read_input()

    print(f"{BLUE}=== DOMY PRODUCT ALIGNMENT Verification ==={NC}")
    print(f"{BLUE}Fuente analizada:{NC} {source_label}")

    if not text.strip():
        report.error("No se recibió texto o propuesta para analizar.")
        print_summary(report)
        return 1

    core_mission_terms = [
        "formalización",
        "formalizar",
        "profesionalización",
        "profesionalizar",
        "trazabilidad",
        "trazable",
        "confianza",
        "seguridad",
    ]

    mvp_terms = [
        "calendario",
        "horario",
        "fecha",
        "perfil verificado",
        "verificación",
        "trayectoria",
        "calificaciones",
        "pagos",
        "transparencia",
        "tarifas",
        "impuestos",
    ]

    user_terms = [
        "hogar",
        "hogares",
        "operaria",
        "trabajadora",
        "usuario",
        "clientes",
        "contratante",
    ]

    business_terms = [
        "colombia",
        "hiperlocal",
        "densidad local",
        "mvp",
        "soporte",
        "conectividad",
        "confianza",
        "reputación",
    ]

    risk_terms = [
        "riesgo",
        "riesgos",
        "complejidad",
        "operación",
        "fricción",
        "postergar",
        "alineación",
        "desalineación",
    ]

    print(f"\n{BLUE}--- Core Mission Alignment ---{NC}")
    core_score = count_matches(text, core_mission_terms)
    if core_score >= 3:
        report.ok("La propuesta menciona varias señales alineadas con misión, confianza o trazabilidad.")
    elif core_score >= 1:
        report.warn("La propuesta toca parcialmente misión o confianza, pero podría explicitar mejor su alineación.")
    else:
        report.error("La propuesta no muestra alineación clara con formalización, confianza o trazabilidad.")

    print(f"\n{BLUE}--- MVP Alignment ---{NC}")
    mvp_score = count_matches(text, mvp_terms)
    if mvp_score >= 2:
        report.ok("La propuesta parece conectarse con capacidades centrales del MVP.")
    elif mvp_score >= 1:
        report.info("La propuesta toca de forma parcial alguna capacidad del MVP.")
    else:
        report.warn("No se detecta conexión evidente con calendario, perfiles verificados o transparencia en pagos.")

    print(f"\n{BLUE}--- User Value ---{NC}")
    user_score = count_matches(text, user_terms)
    if user_score >= 2:
        report.ok("La propuesta reconoce explícitamente a los actores principales del producto.")
    elif user_score >= 1:
        report.info("La propuesta menciona al menos uno de los actores principales.")
    else:
        report.warn("La propuesta no explicita impacto sobre hogar, operaria o contratante.")

    print(f"\n{BLUE}--- Business and Operational Context ---{NC}")
    business_score = count_matches(text, business_terms)
    if business_score >= 2:
        report.ok("La propuesta considera contexto operativo, de mercado o de crecimiento.")
    elif business_score >= 1:
        report.info("La propuesta menciona alguna restricción de negocio o contexto.")
    else:
        report.warn("No se detecta contexto claro de negocio, conectividad, MVP o crecimiento hiperlocal.")

    print(f"\n{BLUE}--- Risk Awareness ---{NC}")
    risk_score = count_matches(text, risk_terms)
    if risk_score >= 2:
        report.ok("La propuesta reconoce riesgos, fricción o impacto operativo.")
    elif risk_score >= 1:
        report.info("La propuesta menciona al menos un elemento de riesgo o complejidad.")
    else:
        report.warn("La propuesta no explicita riesgos, complejidad ni posibles límites.")

    print(f"\n{BLUE}--- Anti-pattern Checks ---{NC}")
    if contains_any(text, ["marketplace genérico", "super app", "todo en uno"]):
        report.warn("Se detecta lenguaje que podría sugerir expansión o enfoque demasiado genérico.")
    else:
        report.ok("No se detecta lenguaje claro de expansión genérica o enfoque difuso.")

    if contains_any(text, ["viral", "gamificación", "red social"]) and not contains_any(
        text, ["confianza", "trazabilidad", "formalización"]
    ):
        report.warn("La propuesta parece priorizar mecánicas periféricas sin conectar con el núcleo del producto.")
    else:
        report.info("No se detectan señales fuertes de desalineación periférica.")

    print_summary(report)

    if report.error_count > 0:
        return 1
    return 0


def print_summary(report: Report) -> None:
    print(f"\n{BLUE}--- Summary ---{NC}")
    print(f"{GREEN}OK:{NC} {report.ok_count}")
    print(f"{YELLOW}Warnings:{NC} {report.warn_count}")
    print(f"{RED}Errors:{NC} {report.error_count}")
    print(f"{BLUE}Info:{NC} {report.info_count}")

    if report.error_count > 0:
        print(f"\n{RED}Verificación completada con señales fuertes de desalineación.{NC}")
    else:
        print(f"\n{GREEN}Verificación completada sin errores graves de alineación.{NC}")


if __name__ == "__main__":
    raise SystemExit(main())