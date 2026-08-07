// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // Code Deno (Supabase Edge Functions), en dehors du projet RN/Node —
    // a ses propres conventions (imports npm:, global Deno) et son propre
    // outillage de vérification côté Supabase CLI.
    ignores: ["dist/*", "supabase/functions/**"],
  }
]);
