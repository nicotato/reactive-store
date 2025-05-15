import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


const external = ['rxjs', 'rxjs/operators', 'react'];


export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/rxtor.js',
        format: 'umd',
        name: 'rxtor',
        globals: {
          'rxjs': 'rxjs',
          'rxjs/operators': 'rxjs.operators',
          'react': 'react',
          'fast-deep-equal': 'deepEqual',
        },
      },
      {
        file: 'dist/rxtor.esm.js',
        format: 'es',
        name: 'rxtor',
      },
      {
        file: 'dist/rxtor.cjs.js',
        format: 'cjs',
        name: 'rxtor',
      },
    ],
    external,
    plugins: [
      typescript({
        exclude: ['**/*.d.ts'],
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
      resolve({
        extensions: ['.js', '.ts', '.tsx', '.jsx'],
      }),
      terser({
        output: {
          comments: false,
        },
      }),
      commonjs({
        esmExternals: true
      }),
      visualizer({
        filename: 'stats.html',
        title: 'Bundle Visualizer',
      }),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/rxtor.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

// export default [
//   // ESM build
//   {
//     input: 'src/index.ts',
//     output: {
//       dir: 'dist/esm',
//       format: 'es',
//       preserveModules: true,
//       preserveModulesRoot: 'src',
//       sourcemap: true,
//     },
//     external,
//     plugins: [
//       typescript({
//         useTsconfigDeclarationDir: true,
//         tsconfigOverride: {
//           compilerOptions: {
//             declaration: true,
//             declarationDir: 'dist/types',
//             outDir: 'dist/esm',
//           },
//         },
//         clean: true,
//       }),
//       resolve({ extensions: ['.js', '.ts', '.tsx'] }),
//       commonjs(),
//     ],
//   },

//   // CJS build
//   {
//     input: 'src/index.ts',
//     output: {
//       dir: 'dist/cjs',
//       format: 'cjs',
//       preserveModules: true,
//       preserveModulesRoot: 'src',
//       sourcemap: true,
//     },
//     external,
//     plugins: [
//       typescript({
//         useTsconfigDeclarationDir: true,
//         tsconfigOverride: {
//           declaration: false,
//           outDir: 'dist/cjs',
//         },
//         clean: true,
//       }),
//       resolve({ extensions: ['.js', '.ts', '.tsx'] }),
//       commonjs(),
//     ],
//   },

//   // UMD bundle (opcional)
//   {
//     input: 'src/index.ts',
//     output: {
//       file: 'dist/rxtor.js',
//       format: 'umd',
//       name: 'rxtor',
//       globals: {
//         rxjs: 'rxjs',
//         'rxjs/operators': 'rxjs.operators',
//         react: 'react',
//         'fast-deep-equal': 'deepEqual',
//       },
//     },
//     external,
//     plugins: [
//       typescript({ clean: true }),
//       resolve({ extensions: ['.js', '.ts', '.tsx'] }),
//       commonjs(),
//       terser(),
//       visualizer({ filename: 'stats.html' }),
//     ],
//   },

//   // DTS (tipos)
//   {
//     input: './dist/types/index.d.ts',
//     output: [{ file: 'dist/rxtor.d.ts', format: 'es' }],
//     plugins: [dts()],
//   },
// ];