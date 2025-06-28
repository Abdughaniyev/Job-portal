import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/users/jwt/jwt-modul';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    // Load .env file based on environment
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),

    // Cache: Redis if REDIS_URL is provided, otherwise fallback to in-memory
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (process.env.REDIS_URL) {
          return {
            store: redisStore,
            url: process.env.REDIS_URL,
            ttl: 300, // cache duration in seconds
          };
        }

        return {
          ttl: 300,
        };
      },
    }),

    // PostgreSQL connection using DATABASE_URL
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // Turn off in production for safety
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),

    // Application modules
    UsersModule,
    JobsModule,
    ApplicationsModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
