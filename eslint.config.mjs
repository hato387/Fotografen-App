// ESLint 9 Flat Config — nutzt die nativen Flat-Exports von eslint-config-next 16.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      // Vendor-Code (shadcn/ui-Template) — nicht von uns gepflegt.
      "src/components/ui/**",
      "src/hooks/use-toast.ts",
      "src/hooks/use-mobile.tsx",
    ],
  },
  ...coreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
