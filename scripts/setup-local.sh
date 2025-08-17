#!/usr/bin/env bash
set -e
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
else
  echo ".env.local already exists"
fi
echo "Remember to set OPENAI_API_KEY=sk-... in .env.local (server-side only)"
