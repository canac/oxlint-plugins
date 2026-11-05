# oxlint-plugins

A small collection of [oxlint](https://oxc.rs/docs/guide/usage/linter/js-plugins) plugins.

## Plugins

### `canac/descriptive-names`

Disallows single-letter identifiers in variable declarations, function parameters, destructuring patterns, and `catch` clauses.

```ts
// Bad
const x = 1;
items.map((i) => i.name);

// Good
const count = 1;
items.map((item) => item.name);
```

### `canac/prefer-arrow-functions`

Disallows `function` declarations and expressions in favor of arrow functions. Auto-fixable. Skips generators, class/object methods, and getters/setters.

```ts
// Bad
function add(a, b) {
  return a + b;
}
const greet = function (name) {
  return `hi, ${name}`;
};

// Good
const add = (a, b) => {
  return a + b;
};
const greet = (name) => {
  return `hi, ${name}`;
};
```

## Usage

```sh
pnpm add -D @canac/oxlint-plugins oxlint
```

Reference the plugin from your `.oxlintrc.json` and turn on the rules you want:

```json
{
  "jsPlugins": ["@canac/oxlint-plugins"],
  "rules": {
    "canac/descriptive-names": "error",
    "canac/prefer-arrow-functions": "error"
  }
}
```

Then run:

```sh
pnpm oxlint
```

## Development

```sh
pnpm test
```
