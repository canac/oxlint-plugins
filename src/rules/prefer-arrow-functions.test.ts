import { ruleTester } from "../test-helpers.ts";
import rule from "./prefer-arrow-functions.ts";

const message = "Use an arrow function instead of `function`.";

ruleTester.run("prefer-arrow-functions", rule, {
  valid: [
    { name: "skips generator function", code: "function* gen() { yield 1; }" },
    { name: "skips object method shorthand", code: "const obj = { m() { return 1; } };" },
    { name: "skips object getter", code: "const obj = { get v() { return 1; } };" },
    { name: "skips object setter", code: "const obj = { set v(x) { void x; } };" },
    { name: "skips class method", code: "class C { m() { return 1; } }" },
    { name: "skips export default function", code: "export default function () { return 1; }" },
    {
      name: "skips export default named function",
      code: "export default function foo() { return 1; }",
    },
    { name: "allows arrow function", code: "const f = (a) => a + 1;" },
  ],
  invalid: [
    {
      name: "fixes function declaration",
      code: "function add(a, b) { return a + b; }",
      output: "const add = (a, b) => { return a + b; };",
      errors: [{ message }],
    },
    {
      name: "fixes async function declaration",
      code: "async function load() { return 1; }",
      output: "const load = async () => { return 1; };",
      errors: 1,
    },
    {
      name: "fixes typed function declaration",
      code: "function id<T>(value: T): T { return value; }",
      output: "const id = <T>(value: T): T => { return value; };",
      errors: 1,
    },
    {
      name: "fixes function expression assigned to variable",
      code: "const f = function (a) { return a; };",
      output: "const f = (a) => { return a; };",
      errors: 1,
    },
    {
      name: "fixes named function expression",
      code: "const f = function named(a) { return a; };",
      output: "const f = (a) => { return a; };",
      errors: 1,
    },
    {
      name: "fixes IIFE",
      code: "(function (x) { return x; })(1);",
      output: "((x) => { return x; })(1);",
      errors: 1,
    },
    {
      name: "fixes non-method object property function",
      code: "const obj = { run: function (x) { return x; } };",
      output: "const obj = { run: (x) => { return x; } };",
      errors: 1,
    },
    {
      name: "flags exported named function declaration",
      code: "export function foo() { return 1; }",
      output: "export const foo = () => { return 1; };",
      errors: 1,
    },
    {
      name: "flags function passing through callback",
      code: "arr.map(function (x) { return x + 1; });",
      output: "arr.map((x) => { return x + 1; });",
      errors: 1,
    },
    {
      name: "fixes function with rest and default params",
      code: "function f(a = 1, ...rest: number[]) { return a; }",
      output: "const f = (a = 1, ...rest: number[]) => { return a; };",
      errors: 1,
    },
    {
      name: "flags nested function expression",
      code: "function outer() { return function () { return 1; }; }",
      output: "const outer = () => { return () => { return 1; }; };",
      errors: 2,
    },
  ],
});
