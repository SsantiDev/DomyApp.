#!/usr/bin/env python3
import subprocess
import os
import re
import sys

# GIT-PROTOCOL Verification Script (Python version)
# This script ensures that the repository state adheres to the Domy GIT-PROTOCOL.

# Colors for terminal output
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

print(f"{BLUE}=== GIT-PROTOCOL Verification (Python) ==={NC}\n")

# 1. Check if Git is initialized
_, returncode = run_command("git rev-parse --is-inside-work-tree")
if returncode != 0:
    print(f"{RED}[ERROR]{NC} No se detectó un repositorio Git activo.")
    sys.exit(1)

# 2. Check for feature.yaml workflow
if not os.path.exists(".agent/workflows/feature.yaml"):
    print(f"{YELLOW}[WARNING]{NC} No se encontró .agent/workflows/feature.yaml. La integración con el flujo /feature podría fallar.")
else:
    print(f"{GREEN}[OK]{NC} Workflow feature.yaml detectado.")

# 3. Analyze staged changes
staged_files, _ = run_command("git diff --cached --name-only")
if not staged_files:
    print(f"{YELLOW}[INFO]{NC} No hay cambios en el stage (staging area vacía).")
else:
    files_list = staged_files.split('\n')
    print(f"{BLUE}[INFO]{NC} Archivos en stage:")
    for f in files_list:
        print(f"  - {f}")
    
    # Check for potential atomic commit violations
    # heuristic: files in different top-level directories
    components = set(f.split('/')[0] for f in files_list if '/' in f)
    if len(components) > 2:
        print(f"{YELLOW}[WARNING]{NC} Se detectaron cambios en {len(components)} áreas diferentes ({', '.join(components)}). ¿Es este commit realmente atómico?")

    # 4. Scan for secrets in staged changes
    diff_content, _ = run_command("git diff --cached")
    secret_patterns = ["password", "secret", "key", "token", "api_key", "auth_token"]
    found_secrets = []
    for line in diff_content.split('\n'):
        if any(pattern in line.lower() for pattern in secret_patterns) and not "test" in line.lower():
            found_secrets.append(line.strip())
    
    if found_secrets:
        print(f"{RED}[CRITICAL]{NC} Posibles secretos detectados en los cambios de stage!")
        print(f"{RED}Revise el diff cuidadosamente antes de proceder.{NC}")
    else:
        print(f"{GREEN}[OK]{NC} No se detectaron patrones de secretos evidentes.")

# 5. Validate current branch name
current_branch, _ = run_command("git branch --show-current")
branch_regex = r"^(feat|fix|docs|style|refactor|test|chore)/[a-z0-9-]+$"
if not re.match(branch_regex, current_branch) and current_branch not in ["main", "develop"]:
    print(f"{YELLOW}[WARNING]{NC} El nombre de la rama '{current_branch}' no sigue el formato standard: tipo/nombre-corto.")
else:
    print(f"{GREEN}[OK]{NC} Nombre de rama válido ({current_branch}).")

# 6. Check for undesirable files
undesirable_patterns = [r".env$", r"package-lock\.json$", r"poetry\.lock$", r"dev\.log$"]
undesirable_files = [f for f in staged_files.split('\n') if any(re.search(p, f) for p in undesirable_patterns)]
if undesirable_files:
    print(f"{YELLOW}[WARNING]{NC} Se detectaron archivos que usualmente no deberían estar en un commit atómico:")
    for f in undesirable_files:
        print(f"  - {f}")

print(f"\n{BLUE}=== Verificación completada ==={NC}")
