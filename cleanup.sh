#!/bin/bash
echo "Shutting down the Web Testing Sandbox..."
docker compose down
echo "Removing all local logs and browser data..."
rm -rf logs/
rm -rf browser-data/
echo "Sandbox environment is fully reset and clean."