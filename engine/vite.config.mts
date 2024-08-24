import { defineConfig } from "vite";
import * as path from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import fg from 'fast-glob'
import { fileURLToPath, URL } from 'url';

// import pkg from './package.json' assert { type: 'json' }

// const files = fg.sync(['./src/**'])
// const entities = files.map((file) => {
//     const [key] = file.match(/(?<=src\/).*$/) || []
//     const keyWithoutExt = key?.replace(/\.[^.]*$/, '')
//
//     return [keyWithoutExt, file]
// })
// console.log(entities)

export default defineConfig({
    resolve: {
        alias: [
            { find: 'src:', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ]
    },
    plugins: [
        dts({ pathsToAliases: true }),
    ],
    build: {
        target: 'esnext', // transpile as little as possible
        outDir: './dist',
        cssCodeSplit: true,
        emptyOutDir: true,
        minify: false,
        lib: {
            entry: fg.sync(['./src/**/*.ts']),
            name: 'engine',
            formats: ["es"]
        },
        rollupOptions: {
            output: {
                entryFileNames: entry => {
                    const { name, facadeModuleId } = entry;
                    const fileName = `${name}.js`;
                    if (!facadeModuleId) {
                        return fileName;
                    }
                    const relativeDir = path.relative(
                        path.resolve(__dirname, 'src'),
                        path.dirname(facadeModuleId),
                    );
                    return path.join(relativeDir, fileName);
                }
            }
        },
        // rollupOptions: {
        //     external: [
        //         ...Object.keys(pkg.dependencies), // don't bundle dependencies
        //         /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
        //     ],
        // },
    }
})

