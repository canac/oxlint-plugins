import type { ESTree, Rule } from "@oxlint/plugins";

/**
 * Oxlint rule that disallows single-line control-flow statements.
 *
 * Applies to `if`/`else`, `while`, `do`-`while`, `for`, `for`-`in` and
 * `for`-`of`. Auto-fixable: the bare body is wrapped in a block. Nested bare
 * bodies take one fix pass each.
 *
 * ```ts
 * // Disallowed
 * if (cond) return;
 * while (cond) doThing();
 * for (const item of array) use(item);
 *
 * // Required
 * if (cond) {
 *   return;
 * }
 * ```
 */
const rule: Rule = {
  meta: {
    fixable: "code",
  },
  createOnce(context) {
    function check(node: ESTree.Statement, body: ESTree.Statement) {
      if (body.type === "BlockStatement") {
        return;
      }

      context.report({
        node,
        message: "Control flow bodies must be on their own line",
        fix(fixer) {
          const text = context.sourceCode.getText(body);
          return fixer.replaceText(body, `{ ${text} }`);
        },
      });
    }

    return {
      IfStatement(node) {
        check(node, node.consequent);
        if (node.alternate && node.alternate.type !== "IfStatement") {
          check(node, node.alternate);
        }
      },
      WhileStatement(node) {
        check(node, node.body);
      },
      DoWhileStatement(node) {
        check(node, node.body);
      },
      ForStatement(node) {
        check(node, node.body);
      },
      ForInStatement(node) {
        check(node, node.body);
      },
      ForOfStatement(node) {
        check(node, node.body);
      },
    };
  },
};

export default rule;
