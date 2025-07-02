import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisConnectionService implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleDestroy() {
    try {
      console.log('🔄 Closing Redis connections...');
      
      // Cerrar la conexión de Redis
      const store = (this.cacheManager as any).store;
      if (store && store.client && typeof store.client.quit === 'function') {
        await store.client.quit();
        console.log('✅ Redis connection closed gracefully');
      } else if (store && store.client && typeof store.client.disconnect === 'function') {
        await store.client.disconnect();
        console.log('✅ Redis connection disconnected gracefully');
      }
    } catch (error) {
      console.error('❌ Error closing Redis connection:', error);
    }
  }


} 