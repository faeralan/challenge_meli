import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// 🎯 Global variable to store the temp directory
declare global {
  var testDataDir: string;
}

/**
 * Global e2e test setup
 * Creates unique temp directories for each test run
 */
beforeAll(async () => {
  // 🎯 Create unique temp directory for this test run
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'meli-api-test-')
  );
  
  // 🛠️ Set environment variable so repositories use this directory
  process.env.DATA_DIR = tempDir;
  process.env.NODE_ENV = 'test';
  
  // 📁 Store global reference for later cleanup
  global.testDataDir = tempDir;
  
  console.log(`📁 Test data directory: ${tempDir}`);
});

afterAll(async () => {
  // 🧹 Clean up temp directory after all tests
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