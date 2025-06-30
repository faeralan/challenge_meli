import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// 🎯 Variable global para almacenar el directorio temporal
declare global {
  var testDataDir: string;
}

/**
 * Configuración global de tests e2e
 * Crea directorios temporales únicos para cada ejecución de test
 */
beforeAll(async () => {
  // 🎯 Crear directorio temporal único para esta ejecución de tests
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'meli-api-test-')
  );
  
  // 🔧 Configurar variable de entorno para que los repositorios usen este directorio
  process.env.DATA_DIR = tempDir;
  process.env.NODE_ENV = 'test';
  
  // 📁 Almacenar referencia global para limpieza posterior
  global.testDataDir = tempDir;
  
  console.log(`📁 Test data directory: ${tempDir}`);
});

afterAll(async () => {
  // 🧹 Limpiar directorio temporal después de todos los tests
  if (global.testDataDir && fs.existsSync(global.testDataDir)) {
    try {
      await fs.promises.rm(global.testDataDir, { 
        recursive: true, 
        force: true 
      });
      console.log(`🧹 Cleaned up test directory: ${global.testDataDir}`);
    } catch (error) {
      console.warn(`⚠️  Warning: Could not clean up test directory: ${error.message}`);
    }
  }
}); 