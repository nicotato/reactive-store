// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/reactive-store.js',
    format: 'umd',  // Sistema de módulos UMD para compatibilidad con CommonJS, AMD y global
    name: 'ReactiveStore',  // El nombre de la librería que se exportará globalmente
  },
  plugins: [
    typescript()  // Usamos el plugin de TypeScript
  ]
};
