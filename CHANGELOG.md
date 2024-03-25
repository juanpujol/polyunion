<!-- markdownlint-disable MD024 -->

# PolyUnion Changelog

## v0.1.3 (2024-03-25)

### Fixes 🐞

- Fixes bug were turf intersect will throw an error that should't break the function response. #10 - Thanks ♥️ @AbraaoAlves and @lamartinecabral

## v0.1.2 (2024-03-12)

### Fixes 🐞

- Remove default export to fix import issues with cjs. Thank you https://github.com/AbraaoAlves

## v0.1.1 (2024-03-04)

### Fixes 🐞

- Fix .npmignore to include only necessary files

## v0.1.0 (2024-03-03)

The code is stable enough for use and I'm proud to release it as v0.1.0 🤣. Will improve along with more tests as needed.

### Refactors & Improvements ✨

- Removed some unnecessary dependencies
- Added eslint
- Implemented minification on build
- Simplified function by removing unnecessary parameters

## v0.0.2 (2024-03-03)

### Refactors & Improvements ✨

- Add github action to publish to npm when a new release is published
- Add github action to run unit tests #3
- Reduce package size by importing turf modules individually #1

<img width="1051" alt="SCR-20240303-liaw" src="https://github.com/juanpujol/polyunion/assets/30832/9652d8c1-e6f4-41cc-95f9-d79ed31c0318">
<img width="712" alt="SCR-20240303-limr" src="https://github.com/juanpujol/polyunion/assets/30832/2a901b7b-279e-4fb3-92f8-bb8daee3d8c9">

## v0.0.1 (2024-03-03)

### First release 🚀

Hey!

Just a heads-up: this is more of a test run than a ready-for-prime-time release. I'm looking to you to help me iron out the kinks and make this thing better 🙏

## Notes

Gotta admit, Turf.js is a bit hefty as a dependency. Next time around, I'll be switching to individual module imports to slim things down.

Thanks.
