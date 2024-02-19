import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './core/authentication/password/password.service';
import * as dotenv from 'dotenv';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { dataSourceOptions } from './database/typeorm-cli.config';
import { UserModule } from './modules/user/user.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './shared/services/email/email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    TicketModule,
    PurchaseModule,
    MailerModule.forRoot({
      transport: {
        host: 'mail.smtpbucket.com' /*testing only*/,
        port: 8025,
      },
      defaults: {
        from: '"Fox Ticket" <no-reply@foxticket.com>',
      },
      template: {
        dir: __dirname + '/shared/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [PasswordService, EmailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
