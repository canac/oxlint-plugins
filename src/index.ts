import type { Plugin } from "@oxlint/plugins";
import descriptiveNames from "./rules/descriptive-names.ts";
import multilineControlFlow from "./rules/multiline-control-flow.ts";
import preferArrowFunctions from "./rules/prefer-arrow-functions.ts";

const plugin: Plugin = {
  meta: { name: "canac" },
  rules: {
    "descriptive-names": descriptiveNames,
    "multiline-control-flow": multilineControlFlow,
    "prefer-arrow-functions": preferArrowFunctions,
  },
};

export default plugin;
