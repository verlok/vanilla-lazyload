import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";

const terserOptions = {
    compress: {
        passes: 2
    }
};

module.exports = [
    {
        input: "src/lazyload.js",
        output: [
            {
                file: "dist/lazyload.amd.js",
                format: "amd"
            },
            {
                file: "dist/lazyload.amd.min.js",
                format: "amd",
                plugins: [terser(terserOptions)]
            },

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
                exclude: "node_modules/**"
            })
        ]
    },
    {
        input: "src/lazyload.js",
        output: [
            {
                file: "dist/lazyload.esm.js",
                format: "esm"
            },
            {
                file: "dist/lazyload.esm.min.js",
                format: "esm",
                plugins: [terser(terserOptions)]
            }
        ]
    }
];
