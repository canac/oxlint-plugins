import { ruleTester } from "../test-helpers.ts";
import rule from "./multiline-control-flow.ts";

const message = "Control flow bodies must be on their own line";

ruleTester.run("multiline-control-flow", rule, {
  valid: [
    { name: "allows block if", code: "if (cond) { return; }" },
    {
      name: "allows else-if chain",
      code: "if (a) { x(); } else if (b) { y(); } else { z(); }",
    },
    { name: "allows block while", code: "while (cond) { doThing(); }" },
    { name: "allows block for-of", code: "for (const v of arr) { use(v); }" },
  ],
  invalid: [
    {
      name: "fixes single-line if",
      code: "if (cond) return;",
      output: "if (cond) { return; }",
      errors: [{ message }],
    },
    {
      name: "fixes single-line else",
      code: "if (cond) { a(); } else b();",
      output: "if (cond) { a(); } else { b(); }",
      errors: 1,
    },
    {
      name: "fixes both branches when both are bare",
      code: "if (cond) a(); else b();",
      output: "if (cond) { a(); } else { b(); }",
      errors: 2,
    },
    {
      name: "fixes single-line while",
      code: "while (cond) doThing();",
      output: "while (cond) { doThing(); }",
      errors: 1,
    },
    {
      name: "fixes single-line do-while",
      code: "do tick(); while (cond);",
      output: "do { tick(); } while (cond);",
      errors: 1,
    },
    {
      name: "fixes single-line for",
      code: "for (let i = 0; i < 3; i++) use(i);",
      output: "for (let i = 0; i < 3; i++) { use(i); }",
      errors: 1,
    },
    {
      name: "fixes single-line for-in",
      code: "for (const k in obj) use(k);",
      output: "for (const k in obj) { use(k); }",
      errors: 1,
    },
    {
      name: "fixes single-line for-of",
      code: "for (const v of arr) use(v);",
      output: "for (const v of arr) { use(v); }",
      errors: 1,
    },
    {
      name: "fixes nested bare control flow",
      code: "for (const item of list) if (cond) use(item);",
      output: "for (const item of list) { if (cond) { use(item); } }",
      errors: 2,
    },
    {
      name: "fixes bare else nested in bare if",
      code: "if (a) b(); else if (c) d(); else e();",
      output: "if (a) { b(); } else if (c) { d(); } else { e(); }",
      errors: 3,
    },
  ],
});
