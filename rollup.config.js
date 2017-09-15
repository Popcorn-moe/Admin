import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve-with-alias'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'
import vue from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify';
import { join } from 'path'

const DIST_FOLDER = 'dist2'

process.env.BABEL_ENV = 'rollup'

export default {
    input: 'src/main.js',
    output: {
        file: `${DIST_FOLDER}/app.js`,
        format: 'iife'
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': "'development'",
            'process.env.API_URL': process.env.API_URL ? `'${process.env.API_URL}'` : "'http://localhost:3030'"
        }),
        alias({
            '@': join(__dirname, 'src')
        }),
        nodeResolve({
            jsnext: true,
            browser: true,
            extensions: [ '.js', '.json', '.vue' ]
        }),
        commonjs(),
        vue({
            compileTemplate: true,
            css: `${DIST_FOLDER}/.tmp/app.css`
        }),
        babel({
            babelrc: false,
            presets: [
                ["env", {
                    modules: false,
                    targets: {
                        browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
                    }
                }],
                "stage-2"
            ],
            plugins: ['external-helpers']
        }),
        uglify()
    ],
    watch: {
      chokidar: true
    },
    context: 'window'
}
