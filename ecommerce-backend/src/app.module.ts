import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TasksModule } from './tasks/tasks.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        // host: configService.get<string>('DB_Host', 'localhost'),
        // port: configService.get<number>('DB_PORT', 5432),
        // username: configService.get<string>('DB_USERNAME', 'postgres'),
        // password: configService.get<string>('DB_PASSWORD', 'postgres'),
        // database: configService.get<string>('DB_NAME', 'ecommerce_db'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true, // Automatically registers entities loaded in feature modules
        synchronize: false, // STOPS accidental data drops in production; we use migrations instead!
      }),
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
