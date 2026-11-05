import type { ESTree, Rule } from "@oxlint/plugins";

/**
 * Oxlint rule that disallows single-letter variable names.
 *
 * Covers variable declarators, function parameters — including destructured,
 * rest, default and TypeScript parameter properties — and catch clause
 * parameters. Not auto-fixable: only the author knows the intended name.
 *
 * ```ts
 * // Disallowed
 * const n = Number(digits);
 * for (const m of text.matchAll(pattern)) {}
 *
 * // Required
 * const parsed = Number(digits);
 * for (const match of text.matchAll(pattern)) {}
 * ```
 */
const rule: Rule = {
  createOnce(context) {
    function check(name: string, node: ESTree.Node) {
      if (/^[a-zA-Z]$/.test(name)) {
        context.report({
          node,
          message: `\`${name}\` is too short; use a descriptive variable name.`,
        });
      }
    }

    function checkParam(param: ESTree.ParamPattern) {
      if (param.type === "TSParameterProperty") {
        checkParam(param.parameter);
      } else {
        checkPattern(param);
      }
    }

    function checkPattern(
      pattern: ESTree.BindingPattern | ESTree.BindingRestElement | ESTree.FormalParameterRest,
    ) {
      if (pattern.type === "Identifier") {
        check(pattern.name, pattern);
      } else if (pattern.type === "ArrayPattern") {
        for (const element of pattern.elements) {
          if (element) {
            checkPattern(element);
          }
        }
      } else if (pattern.type === "ObjectPattern") {
        for (const property of pattern.properties) {
          if (property.type === "Property") {
            checkPattern(property.value);
          } else {
            checkPattern(property.argument);
          }
        }
      } else if (pattern.type === "RestElement") {
        checkPattern(pattern.argument);
      } else {
        checkPattern(pattern.left);
      }
    }

    return {
      VariableDeclarator(node) {
        checkPattern(node.id);
      },
      FunctionDeclaration(node) {
        for (const param of node.params) {
          checkParam(param);
        }
      },
      FunctionExpression(node) {
        for (const param of node.params) {
          checkParam(param);
        }
      },
      ArrowFunctionExpression(node) {
        for (const param of node.params) {
          checkParam(param);
        }
      },
      CatchClause(node) {
        if (node.param) {
          checkPattern(node.param);
        }
      },
    };
  },
};

export default rule;
