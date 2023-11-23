import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { TokenValidator } from './middlewares/token-validator-middleware';
import { OtpflowModule } from './modules/otpflow/otpflow.module';
import { UserModule } from './modules/user/user.module';
import { SlotsModule } from './modules/slots/slots.module';

@Module({
  imports: [
    OtpflowModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
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

        if (envType === 'Development') {
          return { uri: devDb };
        }

        return { uri: prodDb };
      },
      inject: [ConfigService],
    }),
    UserModule,
    MasterDataModule,
    SlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidator).exclude('/otp/**').forRoutes('/api/**');
  }
}
