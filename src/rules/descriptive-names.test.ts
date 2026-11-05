import { ruleTester } from "../test-helpers.ts";
import rule from "./descriptive-names.ts";

const message = (name: string) => `\`${name}\` is too short; use a descriptive variable name.`;

ruleTester.run("descriptive-names", rule, {
  valid: [
    { name: "allows multi-letter names", code: "const foo = 1; let bar = 2; var baz = 3;" },
    { name: "ignores two-letter names", code: "const ab = 1;" },
    { name: "allows catch without param", code: "try { f(); } catch { }" },
    { name: "ignores underscore", code: "const _ = 1;" },
    { name: "ignores dollar sign", code: "const $ = 1;" },
  ],
  invalid: [
    {
      name: "flags single-letter const",
      code: "const x = 1;",
      errors: [{ message: message("x") }],
    },
    { name: "flags single-letter let", code: "let a = 1;", errors: 1 },
    { name: "flags single-letter var", code: "var z = 1;", errors: 1 },
    {
      name: "flags function declaration param",
      code: "function fn(x) { return x; }",
      errors: [{ message: message("x") }],
    },
    { name: "flags arrow function param", code: "const fn = (n) => n + 1;", errors: 1 },
    {
      name: "flags function expression param",
      code: "const fn = function (q) { return q; };",
      errors: 1,
    },
    {
      name: "flags destructured array pattern",
      code: "const [a, bb] = [1, 2];",
      errors: [{ message: message("a") }],
    },
    {
      name: "flags destructured object pattern shorthand",
      code: "const { a } = { a: 1};",
      errors: 1,
    },
    { name: "flags rest element", code: "function fn(...r) { return r; }", errors: 1 },
    {
      name: "flags assignment pattern default",
      code: "function fn(x = 1) { return x; }",
      errors: 1,
    },
    {
      name: "flags TSParameterProperty",
      code: "class C { constructor(public x: number) {} }",
      errors: 1,
    },
    {
      name: "flags catch clause param",
      code: "try { f(); } catch (e) { throw e; }",
      errors: [{ message: message("e") }],
    },
    {
      name: "flags destructured catch param",
      code: "try { f(); } catch ({ a }) { throw a; }",
      errors: 1,
    },
    { name: "flags class method param", code: "class C { fn(x) { return x; } }", errors: 1 },
    { name: "flags class arrow field param", code: "class C { fn = (x) => x; }", errors: 1 },
    {
      name: "flags object method shorthand param",
      code: "const obj = { fn(x) { return x; } };",
      errors: 1,
    },
    { name: "flags setter param", code: "class C { set foo(v) { this._v = v; } }", errors: 1 },
  ],
});
