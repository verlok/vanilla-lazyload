import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";

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
                plugins: [terser()]
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
                plugins: [terser()]
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
                plugins: [terser()]
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
                plugins: [terser()]
            }
        ]
    }
];
