import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenValidator } from './middlewares/token-validator-middleware';
import { OtpflowModule } from './otpflow/otpflow.module';

@Module({
  imports: [
    OtpflowModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const envType = configService.get('ENVTYPE');
        const localDb = configService.get('LOCAL_DB_URL');
        const devDb = configService.get('DEV_DB_URL');
        const prodDb = configService.get('PROD_DB_URL');

        if (envType === 'Local') {
          return { uri: localDb };
        }

        if (envType === 'Dev') {
          return { uri: devDb };
        }

        return { uri: prodDb };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidator).exclude('/otp').forRoutes('/api');
  }
}
