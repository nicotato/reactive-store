export default {
    preset: 'ts-jest',  // Usamos el preset ts-jest para que Jest pueda entender TypeScript
    testEnvironment: 'node',  // El entorno de pruebas será Node.js (ideal para librerías)
    moduleFileExtensions: ['ts', 'js'],  // Permite archivos .ts y .js
    testMatch: ['**/tests/**/*.ts'],  // Ubicación de los archivos de prueba
  };