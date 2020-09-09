# Capacitor Build Safety

Build and release with confidence.

<a href="https://github.com/fkirc/capacitor-build-safety/actions?query=branch%3Amaster"><img alt="CI status" src="https://github.com/fkirc/capacitor-build-safety/workflows/CI/badge.svg/?branch=master"></a>

[Capacitor](https://capacitorjs.com/) is a great tool for cross-platform app development (iOS/Android/Web).
However, Capacitor builds are prone to mistakes.
In particular, the following mistakes can happen when building and releasing Capacitor apps:

- Forgetting to build/sync a web-build for the most recent commit (leads to outdated or broken apps).
- Inconsistent or wrong Capacitor configs (can lead to broken apps, see this [issue](https://github.com/ionic-team/capacitor/discussions/1478) for details).

`capsafe` is a simple command line tool that prevents those mistakes.
For example, `capsafe` prevents broken Android releases with the following message, if a developer forgot to sync Capacitor for the most recent commit:

`error: Current commit 25a7a56bca71 is not equal to commit 8c8476eb77f6 in android/app/src/main/assets/public/commit-evidence.json. Did you forget to repeat a build/sync with Capacitor?`

Similarly, `capsafe` acts as a foolproof check for developers who did not copy any web-app at all:

`error: android/app/src/main/assets/public/commit-evidence.json does not exist. Did you forget to build/sync with Capacitor?`

Beside of native app-builds, `capsafe` is also usable for browser-based tests that run against the last web-build (to ensure that browser-based tests are always running against the latest commit).

### How it works

`capsafe` enforces the TODO

- `capsafe write-webbuild-commit` generates a file `commit-evidence.json` in your web-build folder. This file contains the current HEAD-commit.
- Naturally, Capacitor-commands like `cap sync` copy `commit-evidence.json` to native asset directories, along with all other web-assets.
- Later on, during native app builds, `capsafe verify-commit-evidence` verifies that the current HEAD-commit is still equal to the commit in `commit-evidence.json` in the respective native asset directory.
- `capsafe validate-config` is an independent command that looks for all `capacitor.config.json` files and checks for inconsistencies or common mistakes.

## Integration Manual

Instead of calling `capsafe` directly, you should integrate it into your existing build scripts.

## FAQ

### Continuous Integration

`capsafe validate-config` is a useful check that can be easily integrated into CI pipelines.
In contrast, `capsafe verify-commit-evidence` is not so useful for CI pipelines.

### What about uncommitted changes?

`capsafe` only looks at the current HEAD-commit and does not care about uncommitted changes. Although uncommitted changes can be a risk during releases, this behavior is a tradeoff between safety and usability.
For example, you might want to increment an Android version number without repeating a web-build.
`capsafe` allows you to do so with the following steps:
- Increment an Android version number without committing it.
- Do the Android release build.
- Commit the incremented version number once the Android release build is finished.

The point is to make "one last tweak" in native code without having to repeat a web-build. Nevertheless, the behavior with uncommitted changes is subject to change in future versions.
