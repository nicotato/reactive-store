import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/rxtor.js',
      format: 'umd',
      name: 'rxtor',
      globals: {
        'rxjs': 'rxjs',
        'rxjs/operators': 'rxjs.operators',
        'react': 'React',
        'lodash.isequal': 'isEqual'
      }
    },
    {
      file: 'dist/rxtor.esm.js',
      format: 'es'
    },
    {
      file: 'dist/rxtor.cjs.js',
      format: 'cjs'
    }
  ],
  external: ['rxjs', 'rxjs/operators', 'react', 'lodash.isequal'],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true
    })
  ]
};
