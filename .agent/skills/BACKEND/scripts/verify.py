#!/usr/bin/env python3
import subprocess
import os
import re
import sys

# BACKEND Skill Verification Script
# Focus: Django, DRF, Python Best Practices

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'

def run_command(command):
    try:
        result = subprocess.run(command, capture_output=True, text=True, shell=True)
        return result.stdout.strip(), result.returncode
    except Exception as e:
        return str(e), 1

print(f"{BLUE}=== BACKEND Expert Verification ==={NC}\n")

# 1. Get staged backend files
staged_files, _ = run_command("git diff --cached --name-only")
backend_files = [f for f in staged_files.split('\n') if f.startswith('Backend/') and f.endswith('.py')]

if not backend_files:
    print(f"{YELLOW}[INFO]{NC} No hay archivos de Python en el backend para verificar.")
    sys.exit(0)

print(f"{BLUE}[INFO]{NC} Verificando {len(backend_files)} archivos de Backend...")

errors = 0
warnings = 0

for f in backend_files:
    print(f"  - {f}")
    with open(f, 'r') as file:
        content = file.read()
        lines = content.split('\n')

        # Check for ViewSets without permission_classes
        if "view" in f.lower() and "class" in content and "ViewSet" in content:
            if "permission_classes" not in content:
                print(f"    {RED}[CRITICAL]{NC} ViewSet detectado sin 'permission_classes' explícito.")
                errors += 1

        # Check for hardcoded secrets (overlap with git-protocol but specific to python)
        if re.search(r"password\s*=\s*['\"].+['\"]", content, re.I) or re.search(r"secret\s*=\s*['\"].+['\"]", content, re.I):
            print(f"    {RED}[CRITICAL]{NC} Posible secreto hardcodeado detectado.")
            errors += 1

        # Check for missing docstrings in classes/methods
        for i, line in enumerate(lines):
            if (line.strip().startswith("def ") or line.strip().startswith("class ")) and ":" in line:
                if i + 1 < len(lines) and '"""' not in lines[i+1] and "'''" not in lines[i+1]:
                    # Only warning if it seems to be a main definition
                    if not line.strip().startswith("def __"):
                        print(f"    {YELLOW}[WARNING]{NC} Falta docstring en: {line.strip()}")
                        warnings += 1

        # Check for print() leftover
        if "print(" in content and "test" not in f.lower():
            print(f"    {YELLOW}[WARNING]{NC} Detectado uso de 'print()'. Considera usar logging.")
            warnings += 1

        # Check for select_related/prefetch_related usage in complex queries (simple heuristic)
        if ".objects.all()" in content or ".objects.filter(" in content:
            if "select_related" not in content and "prefetch_related" not in content:
                print(f"    {YELLOW}[WARNING]{NC} Consulta detectada sin optimización aparente (select_related/prefetch_related).")
                warnings += 1

print(f"\n{BLUE}Resumen:{NC}")
if errors > 0:
    print(f"  {RED}Errores críticos: {errors}{NC}")
if warnings > 0:
    print(f"  {YELLOW}Advertencias: {warnings}{NC}")

if errors > 0:
    print(f"\n{RED}[FALLO]{NC} Se encontraron problemas críticos que deben resolverse.")
    sys.exit(1)
elif warnings > 0:
    print(f"\n{YELLOW}[COMPLETADO CON ADVERTENCIAS]{NC} Revisa las sugerencias antes de continuar.")
    sys.exit(0)
else:
    print(f"\n{GREEN}[ÉXITO]{NC} Los archivos de Backend cumplen con el estándar.")
    sys.exit(0)
