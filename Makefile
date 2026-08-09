SHELL := /bin/bash

# Dev tooling — linters/formatters + Vercel CLI.
# The site itself ships with zero Node deps; these targets are optional.
# Run `make check` first to see what's installed.

PRETTIER  := $(shell command -v prettier 2>/dev/null)
ESLINT    := $(shell command -v eslint 2>/dev/null)
STYLELINT := $(shell command -v stylelint 2>/dev/null)
VERCEL    := $(shell command -v vercel 2>/dev/null)

.PHONY: check tools install install-prettier install-eslint install-stylelint install-vercel format format-check lint lint-js lint-css verify login dev preview deploy

## tools — report which tools are installed
tools:
	@command -v prettier  >/dev/null 2>&1 && echo "OK   prettier  ($$(prettier --version))"  || echo "FALTAN  prettier  — make install-prettier"
	@command -v eslint    >/dev/null 2>&1 && echo "OK   eslint    ($$(eslint --version))"    || echo "FALTAN  eslint    — make install-eslint"
	@command -v stylelint >/dev/null 2>&1 && echo "OK   stylelint ($$(stylelint --version))" || echo "FALTAN  stylelint — make install-stylelint"
	@command -v vercel    >/dev/null 2>&1 && echo "OK   vercel    ($$(vercel --version))"    || echo "FALTAN  vercel    — make install-vercel"

## check — alias for tools
check: tools

## install — install all four globally
install: install-prettier install-eslint install-stylelint install-vercel

install-prettier:
	npm install -g prettier

install-eslint:
	npm install -g eslint

install-stylelint:
	npm install -g stylelint

install-vercel:
	npm install -g vercel

## format — rewrite files applying .prettierrc
format:
	@test -n "$(PRETTIER)" || { echo "prettier no instalado: make install-prettier"; exit 1; }
	$(PRETTIER) --write .

## format-check — verify formatting only, no writes
format-check:
	@test -n "$(PRETTIER)" || { echo "prettier no instalado: make install-prettier"; exit 1; }
	$(PRETTIER) --check .

## lint-js — ESLint on js/
lint-js:
	@test -n "$(ESLINT)" || { echo "eslint no instalado: make install-eslint"; exit 1; }
	$(ESLINT) js/

## lint-css — Stylelint on css/
lint-css:
	@test -n "$(STYLELINT)" || { echo "stylelint no instalado: make install-stylelint"; exit 1; }
	$(STYLELINT) "css/**/*.css"

## lint — JS + CSS
lint: lint-js lint-css

## verify — full read-only check
verify: format-check lint

## login — authenticate Vercel CLI
login:
	@test -n "$(VERCEL)" || { echo "vercel no instalado: make install-vercel"; exit 1; }
	$(VERCEL) login

## dev — serve locally with the real vercel.json routes (http://localhost:3000)
dev:
	@test -n "$(VERCEL)" || { echo "vercel no instalado: make install-vercel"; exit 1; }
	$(VERCEL) dev

## preview — deploy a preview build (*.vercel.app)
preview:
	@test -n "$(VERCEL)" || { echo "vercel no instalado: make install-vercel"; exit 1; }
	$(VERCEL)

## deploy — production deployment
deploy:
	@test -n "$(VERCEL)" || { echo "vercel no instalado: make install-vercel"; exit 1; }
	$(VERCEL) --prod
