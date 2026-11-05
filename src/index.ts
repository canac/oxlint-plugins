import type { Plugin } from "@oxlint/plugins";
import descriptiveNames from "./rules/descriptive-names.ts";
import preferArrowFunctions from "./rules/prefer-arrow-functions.ts";

const plugin: Plugin = {
  meta: { name: "canac" },
  rules: {
    "descriptive-names": descriptiveNames,
    "prefer-arrow-functions": preferArrowFunctions,
  },
};

export default plugin;
