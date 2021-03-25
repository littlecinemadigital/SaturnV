/* eslint-disable import/no-extraneous-dependencies */
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import image from '@rollup/plugin-image';
import svgr from '@svgr/rollup';

const packageJson = require('./package.json');

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['styled-components'],
  plugins: [
    peerDepsExternal(),
    svgr(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    image()
  ]
};
