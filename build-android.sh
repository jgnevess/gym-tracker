#!/bin/bash

set -e

APP_NAME="gym-tracker"
ROOT_DIR="$(pwd)"
ANDROID_DIR="$ROOT_DIR/android"
OUTPUT_DIR="$ROOT_DIR/builds/android"

echo "Limpando build antigo do React..."
rm -rf "$ROOT_DIR/dist"

echo "Gerando build do React/Vite..."
npm run build

echo "Sincronizando com Capacitor..."
npx cap sync android

echo "Gerando APK debug..."
cd "$ANDROID_DIR"
./gradlew assembleDebug

echo "Preparando pasta de saída..."
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
APK_SOURCE="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
APK_TARGET="$OUTPUT_DIR/${APP_NAME}-debug-${TIMESTAMP}.apk"

echo "Copiando APK..."
cp "$APK_SOURCE" "$APK_TARGET"

echo ""
echo "Build finalizado com sucesso."
echo "APK gerado em:"
echo "$APK_TARGET"
