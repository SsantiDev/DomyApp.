#!/usr/bin/env python3
import os
import sys
import json
import re

# ARQUITECTURA Verification Script for Domy App
# This script ensures the project structure and configuration align with the ARQUITECTURA skill.

RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'

def print_result(msg, status):
    if status == "OK":
        print(f"{GREEN}[OK]{NC} {msg}")
    elif status == "WARNING":
        print(f"{YELLOW}[WARNING]{NC} {msg}")
    elif status == "ERROR":
        print(f"{RED}[ERROR]{NC} {msg}")
    elif status == "INFO":
        print(f"{BLUE}[INFO]{NC} {msg}")

def check_backend():
    print(f"\n{BLUE}--- Backend Architecture (Django) ---{NC}")
    backend_path = "Backend"
    if not os.path.exists(backend_path):
        print_result("No se encontró la carpeta 'Backend'", "ERROR")
        return False

    # Check for apps structure
    apps_path = os.path.join(backend_path, "apps")
    if os.path.exists(apps_path):
        print_result("Carpeta 'apps' detectada para modularidad.", "OK")
    else:
        print_result("Falta carpeta 'apps'. La arquitectura sugiere agrupar aplicaciones.", "WARNING")

    # Check settings for Database and JWT
    settings_path = os.path.join(backend_path, "core", "settings.py")
    if os.path.exists(settings_path):
        with open(settings_path, 'r') as f:
            content = f.read()
            # Database check
            if "'ENGINE': 'django.db.backends.sqlite3'" in content:
                print_result("Base de datos: SQLite detectado (Configuración actual correcta).", "OK")
            elif "'ENGINE': 'django.db.backends.postgresql'" in content:
                print_result("Base de datos: PostgreSQL detectado (Configuración target detectada).", "OK")
            else:
                print_result("Motor de base de datos no estándar o desconocido.", "WARNING")

            # SimpleJWT check
            if "rest_framework_simplejwt" in content and "JWTAuthentication" in content:
                print_result("Autenticación: SimpleJWT configurado correctamente.", "OK")
            else:
                print_result("Autenticación: SimpleJWT no detectado en settings.", "WARNING")
    else:
        print_result("No se encontró core/settings.py", "ERROR")

    return True

def check_frontend():
    print(f"\n{BLUE}--- Frontend Architecture (React Native) ---{NC}")
    frontend_path = "Fronted" # Assuming correct name from list_dir
    if not os.path.exists(frontend_path):
        print_result("No se encontró la carpeta 'Fronted'", "ERROR")
        return False

    # Check for core directories
    folders = ["components", "hooks", "src"]
    for folder in folders:
        if os.path.exists(os.path.join(frontend_path, folder)):
            print_result(f"Directorio '{folder}' detectado.", "OK")
        else:
            print_result(f"Falta directorio '{folder}'.", "WARNING")

    # Check package.json for Expo/React Native
    package_json = os.path.join(frontend_path, "package.json")
    if os.path.exists(package_json):
        with open(package_json, 'r') as f:
            data = json.load(f)
            deps = data.get("dependencies", {})
            if "expo" in deps:
                print_result("Framework: Expo detectado.", "OK")
            elif "react-native" in deps:
                print_result("Framework: React Native CLI detectado.", "OK")
            
            if "typescript" in data.get("devDependencies", {}) or "typescript" in deps:
                print_result("Lenguaje: TypeScript detectado.", "OK")
            else:
                print_result("Lenguaje: TypeScript no detectado en dependencias.", "WARNING")
    
    return True

def main():
    print(f"{BLUE}=== ARQUITECTURA Verification ==={NC}")
    
    b_ok = check_backend()
    f_ok = check_frontend()

    if b_ok and f_ok:
        print(f"\n{GREEN}Verificación de arquitectura completada con éxito.{NC}")
    else:
        print(f"\n{YELLOW}Verificación completada con algunas alertas.{NC}")

if __name__ == "__main__":
    main()
