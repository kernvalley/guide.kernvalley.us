---
title: CHANGELOG
permalink: /changelog/
description: List of recent versions and modifications
layout: page
---
<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.2.1] - 2021-01-20

### Changed
- Re-write to use `jekyll-common` components in `_includes/common/`
- Misc. other updates for consistency

## [v1.2.0] - 2021-01-14

### Added
- `env` (`"production"` or `"development"`) and `dev` (`true` or `false`) constants
- New components for creating `<leaflet-marker>`s
- Listing of apps in stores via `<app-stores>` element (uses `manifest.json`)
- Add `"webapp"` as platform for web app manifest

### Changed
- Load `polyfill.io` and custom elements shim as `<script nomodule>`
- Standardize script template properties based on `HTMLScriptElement` properties
- Numerous component updates
- Manage links in single data file (`links.yml`)
- Manage social links via data file (`social.yml`)
- Use CDN version of service worker
- Update web app manifest template to handle `shortcuts`, `related_applications`, etc.

### Removed
- Do not use `animate.css`

## [v1.1.1] - 2020-12-13

### Added

- Add apps icon
- Use `<button is="app-list">` component
- Add `cookieStore` handling for theme
- Add UTM params to share buttons
- Ability to disable ads
- Handling for page-level ads

### Changed

- Allow `apps.kernvalley.us` in CSP
- Update style of nav links & buttons
- Use weather component via `_includes/` in sidebar

## [v1.1.0] - 2020-10-08

### Added
- `/reset` page for clearing all site data
- Enable submodules with Dependabot
- Initial set of submodules with SVG icons
- SVG icon config file
- Add support for `<ad-block>` ads from KernValley.US Ads

### Changed
- Use `_headers` for HTTP headers instead of `netlify.toml`

## [v1.0.16] 2020-09-06

### Added
- `Notification` instead of `alert` on contact from submission
- PWA shortcut (and icons) to changelog
- Contact form template in `_includes/`
- Support for Google Analytics via `consts.js` & `importGA()`
- Track clicks for external links and `tel:` URIs

### Changed
- Update preloading to have `crossOrigin` and `referrerPolicy` consistent
- Use `"no-referrer"` as default referrer policy
- Set `start_url` as `absolute_url` in production
- Update various default colors
- Add `theme-color` support on per-page level
- Update share button for compatibility with CDN CSS changes
- Put contact from in  a `<toast-message>`
- Set RegEx pattern to validate entered phone numbers

### Fixed
- Add missing essentail options (like method) to contact form template

# [v1.0.15] - 202500-07-23

### Added
- Contact page (as demo)
- `share_target`, sharing data from other apps to contact page

### Updated
- Import changes to various `_includes/*`
- Fix sidebar-in-sidebar duplication
- Misc style changes

### Removed
- Unused / outdated styles

## [v1.0.14] - 2020-07-19

### Added
- Minimal set of icons
- `"apple-touch-icon"`
- Test of PWA shortcuts (to Bacon Ipsum demo post)
- Use dns-prefetch to `https://unpkg.com`
- Description and tags/keywords for home page

### Changed
- Update CSP srcs
- Add missing SVG icon sprites
- Mark icons as `"maskable"`
- Add missing values to PWA manifest
- Update screenshots
- Use `features` in manifest to list advantages of projects built using this template repo
- List these features in README

## [v1.0.13] - 2020-07-17

### Updated
- eslint now indents on each `case` for a `switch`
- Set indent style & width in editor config file

## [v1.0.12] - 2020-07-13

### Added
- Shortcuts / jumplist for PWAs

### Changed
- Update CSP to to allow every request in `connect-src`
- Move `<button is="pwa-install">` to footer

## [v1.0.11] - 2020-07-09

### Added
- 404 page [#65](https://github.com/shgysk8zer0/jekyll-template/issues/65)
- "base" layout which all others (currently) extend
- Generic "page" layout
- ~~GitHub Pages workflow~~

### Changed
- Update Node version in workflows

## [v1.0.10] - 2020-07-07

### Changed
- Dependency updates
- Add frontmatter plugin for eslint
- Update service worker to use `event.request` instead of `event.request.url`
- Update linting config
- Use correct environment & globals in eslint

## [v1.0.9] - 2020-07-02

### Added
- `.nvmrc` file for fixed NodeJS version

## [v1.0.8] - 2020-06-29

### Changed
- Update Super linter to Docker image @ version 3
- Update `eslint` rules

## [v1.0.7] - 2020-06-28

### Fixed
- Set `og:image` correctly [#66](https://github.com/shgysk8zer0/jekyll-template/issue/66)

## [v1.0.6] - 2020-06-27

### Fixed
- Fix invalid script src for `<button is="pwa-install">` [#63](https://github.com/shgysk8zer0/jekyll-template/issues/63)
- Update Node CI status badge in README [#62](https://github.com/shgysk8zer0/jekyll-template/issues/62)
- Allow GitHub avatars & BaconIpsum API in CSP

### Removed
- Dependabot status badge, since not supported by v2

## [v1.0.5] - 2020-06-26

### Changed
- Merge more Dependabot pull requests
- Update Ruby version to 2.7.1

## [v1.0.4] - 2020-06-26

### Added
- Dependabot badge

### Changed
- Update all dependencies (merges serveral pull requests)
- Misc. other updates using `npm audit fix`
- Switch to new V2 of Dependanbot syntax
- Use full `document.title` in share button by default

### Fixed
- `build:icons` script by unquoting `${npm_package_config_icons}`
- Use unminified version of stylesheet for development environment
- Do not use `absolute_url` for URL in share button

### Removed
- Disable Git submodules for dependabot (template has no submodules)

## [1.0.3] - 2020-06-25

### Added
- Dependabot config

## [v1.0.2] - 2020-06-19

### Changed
- Disabled markdown linting of releases section in `CHANGELOG.md`

## [v1.0.1] - 2020-06-19
### Added
- Include Changelog
- Implement GitHub's Super Linter
- Add `<pwa-install>` and `<pwa-prompt>`
- Add missing fields (event if empty) for app data / config file

### Changed
- Use `<pwa-install>` instead of `data-service-worker` attribute
- Move most data from `_config.yml` to `/_data/*`
- Update Pull Request Template

### Fixed
- Accessibility of `<button is="share-button">`
- Set correct thumbnails in page's `<head>`

## [v1.0.0] - 2020-05-12
Initial Version Release
<!-- markdownlint-restore -->
