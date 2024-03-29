import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const terserOptions = {
  compress: {
    passes: 2
  }
};

export default [
  {
    input: "src/lazyload.js",
    output: [
      {
        file: "dist/lazyload.iife.js",
        name: "LazyLoad",
        format: "iife"
      },
      {
        file: "dist/lazyload.iife.min.js",
        name: "LazyLoad",
        format: "iife",
        plugins: [terser(terserOptions)]
      },
      {
        file: "dist/lazyload.js",
        name: "LazyLoad",
        format: "umd"
      },
      {
        file: "dist/lazyload.min.js",
        name: "LazyLoad",
        format: "umd",
        plugins: [terser(terserOptions)]
      }
    ],
    plugins: [
      resolve(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**"
      })
    ]
  },
  {
    input: "src/lazyload.js",
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        preserveModules: true,
        plugins: [terser(terserOptions)]
      }
    ]
  }
];
