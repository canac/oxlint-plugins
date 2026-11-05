import type { ESTree, Rule } from "@oxlint/plugins";

/**
 * Oxlint rule that prefers arrow functions over `function` declarations and
 * expressions. Auto-fixable; parameters, type parameters and return types are
 * sliced from the original source, so annotations and comments survive.
 *
 * Left alone: generators, class methods, object method shorthand, getters and
 * setters, and `export default function () {}` — rewriting those would produce
 * invalid syntax or change semantics.
 *
 * ```ts
 * // Disallowed
 * function add(a, b) { return a + b; }
 * const greet = function (name) { return `hi, ${name}`; };
 *
 * // Required
 * const add = (a, b) => { return a + b; };
 * const greet = (name) => { return `hi, ${name}`; };
 * ```
 */
const rule: Rule = {
  meta: {
    fixable: "code",
  },
  createOnce(context) {
    function buildArrow(fn: ESTree.Function, body: ESTree.FunctionBody): string | null {
      const source = context.sourceCode;
      const asyncPrefix = fn.async ? "async " : "";
      const generics = fn.typeParameters ? source.getText(fn.typeParameters) : "";
      // Tokens skip comments and parens inside the return type, which raw text scanning can't.
      const anchor = fn.typeParameters ?? fn.id;
      const paramsOpen = anchor
        ? source.getTokenAfter(anchor)
        : source.getFirstToken(fn, { filter: (token) => token.value === "(" });
      const paramsClose = source.getTokenBefore(fn.returnType ?? body);
      if (paramsOpen?.value !== "(" || paramsClose?.value !== ")") {
        return null;
      }
      const params = source.text.slice(paramsOpen.range[0], paramsClose.range[1]);
      const returnType = fn.returnType ? source.getText(fn.returnType) : "";
      const bodyText = source.getText(body);
      return `${asyncPrefix}${generics}${params}${returnType} => ${bodyText}`;
    }

    function reportDeclaration(node: ESTree.Function) {
      if (node.generator || !node.id || !node.body) {
        return;
      }
      if (node.parent.type === "ExportDefaultDeclaration") {
        return;
      }

      const arrow = buildArrow(node, node.body);
      const replacement = arrow === null ? null : `const ${node.id.name} = ${arrow};`;
      context.report({
        node,
        message: "Use an arrow function instead of `function`.",
        fix(fixer) {
          return replacement === null ? null : fixer.replaceText(node, replacement);
        },
      });
    }

    function reportExpression(node: ESTree.Function) {
      if (node.generator || !node.body) {
        return;
      }
      const parent = node.parent;
      if (parent.type === "MethodDefinition") {
        return;
      }
      if (
        parent.type === "Property" &&
        (parent.method || parent.kind === "get" || parent.kind === "set")
      ) {
        return;
      }

      const arrow = buildArrow(node, node.body);
      context.report({
        node,
        message: "Use an arrow function instead of `function`.",
        fix(fixer) {
          return arrow === null ? null : fixer.replaceText(node, arrow);
        },
      });
    }

    return {
      FunctionDeclaration: reportDeclaration,
      FunctionExpression: reportExpression,
    };
  },
};

export default rule;
