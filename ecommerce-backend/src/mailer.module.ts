import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Global()
@Module({
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: configService.get<string>('MAILTRAP_HOST'),
          port: configService.get<number>('MAILTRAP_PORT'),
          auth: {
            user: configService.get<string>('MAILTRAP_USERNAME'),
            pass: configService.get<string>('MAILTRAP_PASSWORD'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MAIL_TRANSPORTER'],
})
export class MailModule {}
