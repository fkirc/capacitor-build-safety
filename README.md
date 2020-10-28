# capsafe - Make Builds Traceable And Safer

If a tester cannot immediately see from which commit and which branch a given build originates, then this lack of certainty can cause a huge waste of time.
Moreover, there are industries that require each deployment to be _end-to-end traceable_.
To be _end-to-end traceable_, we want a bombproof trace all the way from an app or web-server back to the specific Git-commit that was used to build it.

To do so, `capsafe` adds a file `commit-evidence.json` to all your builds.

<a href="https://github.com/fkirc/capacitor-build-safety/actions?query=branch%3Amaster"><img alt="CI status" src="https://github.com/fkirc/capacitor-build-safety/workflows/CI/badge.svg/?branch=master"></a>

`capsafe` was written with [Capacitor](https://capacitorjs.com/) in mind, although you do not need to use Capacitor.
Capacitor is a great tool for cross-platform app development (iOS/Android/Web).
However, Capacitor builds are prone to mistakes.
In particular, the following mistakes can lead to broken app releases or wasted developer time:

- Forgetting to build/sync a web-build for the most recent commit (leads to outdated or broken apps).
- Wrong Capacitor configs (leads to broken apps, see this [issue](https://github.com/ionic-team/capacitor/discussions/1478) for details).

`capsafe` helps to prevent those mistakes.
For example, `capsafe` prevents broken Android releases with the following message, if a developer forgot to sync Capacitor for the most recent commit:

`error: Current commit 25a7a56bca71 does not match with commit 8c8476eb77f6 in 'android/app/src/main/assets/public/commit-evidence.json': Run 'capsafe disable' to disable this check temporarily (if you know what you are doing)`

Similarly, `capsafe` prevents broken iOS-builds if a developer forgot to do a web-build:

`error: 'ios/App/public/commit-evidence.json' does not exist: Run 'capsafe disable' to disable this check temporarily (if you know what you are doing)`

Beside of native apps, `capsafe` is also usable for browser-based tests that run against web-builds.
`capsafe` ensures that browser-based tests are always running against the latest commit.

## How it works

`capsafe` provides three commands to prevent broken apps: `create-commit-evidence`, `verify-commit-evidence`, `validate-capacitor-config`.
Typically, those commands run in the following steps:

- After each web-build, `create-commit-evidence` creates a file `commit-evidence.json` in your web-build folder. `commit-evidence.json` contains information about the current HEAD-commit (the tree hash and the commit hash).
- Naturally, Capacitor-commands like `cap sync` copy `commit-evidence.json` to native asset directories, along with all other web-assets.
- Later on, during each native app build, `verify-commit-evidence` verifies that the current HEAD-commit still matches with `commit-evidence.json` in the respective native asset directory.
- `validate-capacitor-config` runs before each app release or in a continuous integration pipeline.

## Disable checks temporarily

For pure native development, the checks of `capsafe` might be annoying.
In this case, you can quickly disable `capsafe` by running:

`npx capsafe disable`

This will disable safety checks until you switch the current branch, or until you delete `capsafe.disable.json`.
To remain safe, you should add `capsafe.disable.json` to your `.gitignore`.

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
