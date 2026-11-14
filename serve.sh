#!/usr/bin/env bash
# Quick launcher for local & mobile dev server with QR code scanner
cd "$(dirname "$0")"
exec node serve.js "$@"

