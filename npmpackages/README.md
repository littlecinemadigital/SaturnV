Steps for creating a private npm package:

### Setup

I've included a lot of the files that are being used in the `lst-library` for setting up the overall repo: `eslintrc`, `gitignore`, `prettierrc`, and `tsconfig`. Those were generally copied over from the `little-cinema` repo, but copy/paste/change them as desired.

### Build

Builds are happening with [`rollup`](https://rollupjs.org/). I've included the `rollup.config.js` that's being used for the `lst-library`. It feels like a pretty basic version. Hopefully, you can just copy and paste it! But the library's got a ton of plugins if you need something else.

To run a build:

```
npm run build // calls rollup -c
```

The config uses a `main` and `module` that exist on your `package.json`, so be sure those two properties are provided.

### Test

Tests are being run with `jest` and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/). The library aims to make markup more accessible (preferred queries rely on roles/labels/placeholders/titles/alt text or visible text on the screen), which _hopefully_ makes your tests more closely resemble how users will interact with the pages.

To run a test once:

```
npm run test
```

To run tests in watch mode:

```
npm run test:watch
```

### Storybook

I've included storybook `main` and `preview` files that should make setting up storybook pretty quick. More info on [their docs](https://storybook.js.org/docs/react/get-started/introduction):

### CI

An example circle ci config has been included here. One thing to notice is the `release-version` job in the config, which will handle publishing the package to npm with `semantic-release`.

### Release

The repo uses [`semantic-release`](https://semantic-release.gitbook.io/semantic-release/) to automate package publishing.

#### Permissions for CircleCI

To get it working in CircleCI with proper publish permissions, the project on Circle will need an `NPM_TOKEN` and `GH_TOKEN` in the environment (a bit more information on [their docs](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration#authentication-for-plugins)).

If need to obtain both of those tokens, run

```
npx semantic release-cli setup
```

This will prompt you to log in to github and npm. If you specify `other` as your CI environment, it will print the tokens that you need to add to CircleCI's environment.

#### package.json requirements

For `semantic-release` to work properly, the `package.json` needs to contain

```
"name": "@lcdigital/lst-player-ui", // needs the org namespace
// placeholder version that's handled by semantic-release during publish
"version": "0.0.0-semantic-release",
"publishConfig": {
  "access": "restricted" // to mark as private
},
"release": {
  "branches": [
    "main" // and other branches that should be released
  ]
}
```

Also, I had to remove `private: true` from the `package.json` to get the library to actually publlish.

#### Commit message requirements

`semantic-release` automates the semver releases for the package. It's only able to do so by analyzing commit messages. As such, commit messages need to follow a certain pattern, as outlined in their docs: [commit message format](https://semantic-release.gitbook.io/semantic-release/#commit-message-format).

`fix` in a commit message will release a patch.
`feat` in a commit message will release a minor/feature version.
`BREAKING CHANGE` in the commit description will release a major/breaking release.


