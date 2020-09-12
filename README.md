# Capacitor Build Safety

Build and release with confidence.

<a href="https://github.com/fkirc/capacitor-build-safety/actions?query=branch%3Amaster"><img alt="CI status" src="https://github.com/fkirc/capacitor-build-safety/workflows/CI/badge.svg/?branch=master"></a>

[Capacitor](https://capacitorjs.com/) is a great tool for cross-platform app development (iOS/Android/Web).
However, Capacitor builds are prone to mistakes.
In particular, the following mistakes can lead to broken app releases or wasted developer time:

- Forgetting to build/sync a web-build for the most recent commit (leads to outdated or broken apps).
- Wrong Capacitor configs (leads to broken apps, see this [issue](https://github.com/ionic-team/capacitor/discussions/1478) for details).

`capsafe` is a simple tool that prevents those mistakes.
For example, `capsafe` prevents broken Android releases with the following message, if a developer forgot to sync Capacitor for the most recent commit:

`error: Current commit 25a7a56bca71 is not equal to commit 8c8476eb77f6 in 'android/app/src/main/assets/public/commit-evidence.json'. Did you forget to build/sync with Capacitor?`

Similarly, `capsafe` prevents broken iOS-builds if a developer forgot to do a web-build:

`error: 'ios/App/public/commit-evidence.json' does not exist.`

Beside of native apps, `capsafe` is also usable for browser-based tests that run against web-builds.
`capsafe` ensures that browser-based tests are always running against the latest commit.

## How it works

`capsafe` provides three commands to prevent broken apps: `create-commit-evidence`, `verify-commit-evidence`, `validate-capacitor-config`.
Typically, those commands run in the following steps:

- After each web-build, `create-commit-evidence` creates a file `commit-evidence.json` in your web-build folder. `commit-evidence.json` contains the current HEAD-commit hash.
- Naturally, Capacitor-commands like `cap sync` copy `commit-evidence.json` to native asset directories, along with all other web-assets.
- Later on, during each native app build, `verify-commit-evidence` verifies that the current HEAD-commit is still equal to the commit in `commit-evidence.json` in the respective native asset directory.
- `validate-capacitor-config` runs before each app release or in a continuous integration pipeline.

## Integration Manual

Firstly, install `capsafe` via npm:

`npm install --save-dev capacitor-build-safety`

Next, extend your build scripts for Web/Android/iOS, depending on your setup.

### Extend Web build scripts

Ensure that `create-commit-evidence` is invoked after each web build.
For example, your `package.json` might contain a build script like this:

```
"scripts": {
  "build: "node scripts/build.js"
}
```

In this case, you can extend the build script with a simple `&&`-chaining:

```
"scripts": {
  "build: "node scripts/build.js && npx capsafe create-commit-evidence build"
}
```

### Extend Android build scripts

To enforce that `verify-commit-evidence` succeeds before every Android build, add the following to your app-module's `build.gradle`:

```Groovy
afterEvaluate {
    preBuild.dependsOn(verifyCommitEvidence)  // Each build must use the most recent commit.
    preProductionReleaseBuild.dependsOn(verifyCommitEvidence, validateCapacitorConfig) // Capacitor config must be only validated for production builds.
}
task verifyCommitEvidence(type: Exec) {
    commandLine 'npx', 'capsafe', 'verify-commit-evidence', 'src/main/assets/public'
}
task validateCapacitorConfig(type: Exec) {
    commandLine 'npx', 'capsafe', 'validate-capacitor-config', 'src/main/assets/capacitor.config.json'
}
```

### Extend iOS build scripts

You can use Xcode to enforce that `verify-commit-evidence` succeeds before every iOS build.
To do so, navigate to your app target's `Build Phases` and add a new `Run Script Phase`.
Paste the following snippet into the `Run Script Phase`:

`npx capsafe verify-commit-evidence public/`

To run as fast as possible, place the `Run Script Phase` before all other `Build Phases`.
Once this is done, Xcode should generate something like this in your app's `project.pbxproj`:

```
B8DF42F32508BDBC00B0603F /* Run Script */ = {
    isa = PBXShellScriptBuildPhase;
    buildActionMask = 2147483647;
    files = (
    );
    inputFileListPaths = (
    );
    inputPaths = (
    );
    name = "Run Script";
    outputFileListPaths = (
    );
    outputPaths = (
    );
    runOnlyForDeploymentPostprocessing = 0;
    shellPath = /bin/sh;
    shellScript = "npx capsafe verify-commit-evidence public/";
    showEnvVarsInLog = 0;
};
```

### Extend Web tests

If you have tests that run against a web-build (without live reload), then you might extend your web tests like so:

```
npx capsafe verify-commit-evidence build && my_web_testing_tool
```

## Disable checks temporarily

For pure native development, the checks of `capsafe` might be annoying.
In this case, you can quickly disable `capsafe` by running:

`npx capsafe disable`

This will disable safety checks until you switch the current branch, or until you delete `capsafe.disable.json`.
To remain safe, you should add `capsafe.disable.json` to your `.gitignore`.

## FAQ

### Continuous Integration

`capsafe` can be easily integrated into CI pipelines.

- `validate-capacitor-config` is a critical check for most Capacitor apps.
- `create-commit-evidence` might be useful for improving the traceability of CI-generated builds.
- In contrast, `verify-commit-evidence` is not so useful for CI pipelines, because computers never "forget" to run a step in a fixed procedure.

### What about uncommitted changes?

`capsafe` only looks at the current commit/branch and ignores uncommitted changes. Although uncommitted changes can be a risk, this behavior is a tradeoff between safety and usability.
For example, you might want to increment an Android version number without repeating a web-build.
`capsafe` allows you to do so with the following steps:
- Increment an Android version number without committing it.
- Do the Android release build.
- Commit the incremented version number once the Android release build is finished.

The point is to make "one last tweak" in native code without having to repeat a web-build.
Nevertheless, `capsafe`'s behavior with uncommitted changes is subject to change in future versions.
