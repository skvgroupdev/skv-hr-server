import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
        connectionFactory: (connection: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          on: (event: string, handler: (...args: any[]) => void) => void;
        }) => {
          connection.on('connected', () => {
            console.log('[MongoDB] Connected');
          });
          connection.on('disconnected', () => {
            console.warn('[MongoDB] Disconnected');
          });
          connection.on('error', (err: Error) => {
            console.error('[MongoDB] Connection error:', err.message);
          });
          return connection;
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
