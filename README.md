# Capacitor Build Safety

Build and release with confidence.

<p><img alt="CI status" src="https://github.com/fkirc/capacitor-build-safety/workflows/CI/badge.svg/?branch=master"></p>

[Capacitor](https://capacitorjs.com/) is a great tool for cross-platform app development (iOS/Android/Web).
However, Capacitor builds are prone to mistakes.
In particular, the following mistakes can happen when building and releasing Capacitor apps:

- Forgetting to build/sync a web-build for the most recent commit (leads to outdated or broken apps).
- Inconsistent or wrong Capacitor configs (can lead to broken apps, see this [issue](https://github.com/ionic-team/capacitor/discussions/1478) for details).

`capsafe` is a simple command line tool that helps to prevent those mistakes.
For example, an Android release build can fail with the following message if a developer forgot to sync Capacitor for the most recent commit:

`Error: Current commit 25a7a56bca717226c048368925c19fad0bc13e69 is not equal to commit 8c8476eb77f67c52040eba0f09f0bb11f947d7f2 in android/app/src/main/assets/public/webbuild_commit.json. Did you forget to repeat a build/sync with Capacitor?`

Similarly, `capsafe` acts as an idiot-proof check for native developers who did not build any web-app at all:

`Error: android/app/src/main/assets/public/webbuild_commit.json does not exist. Did you forget to build/sync with Capacitor?`

## Integration Manual

Instead of calling `capsafe` directly, you should integrate it into your existing build scripts.

## FAQ

### How does it work?

- `capsafe write-webbuild-commit` generates a file `webbuild_commit.json` in your web-build folder. This file contains the current HEAD-commit.
- Naturally, Capacitor-commands like `cap sync` copy `webbuild_commit.json` to native asset directories, along with all other web-assets.
- Later on, during native app builds, `capsafe validate-webbuild-commit` verifies that the current HEAD-commit is still equal to the commit in `webbuild_commit.json` in the respective native asset directory.
- `capsafe validate-config` is an independent command that looks for all `capacitor.config.json` files and checks for inconsistencies or common mistakes.

### Continuous Integration

`capsafe validate-config` is a useful check that can be easily integrated into CI pipelines.
In contrast, `capsafe validate-webbuild-commit` is not so useful for CI pipelines.

### What about uncommitted changes?

`capsafe` only looks at the current HEAD-commit and does not care about uncommitted changes. Although uncommitted changes can be a risk during releases, this behavior is a tradeoff between safety and usability.
For example, you might want to increment an Android version number without repeating a web-build.
`capsafe` allows you to do so with the following steps:
- Increment an Android version number without committing it.
- Do the Android release build.
- Commit the incremented version number once the Android release build is finished.

The point is to make "one last tweak" in native code without having to repeat a web-build. Nevertheless, the behavior with uncommitted changes is subject to change in future versions.
