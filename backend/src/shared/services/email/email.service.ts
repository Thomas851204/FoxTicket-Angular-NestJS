import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send email to confirm account creation
   * @param recipient         - email(s)
   * @param username          - display name of the user
   * @param confirmationCode  - foxticket.com/confirm/{code}  <---
   * @param sender            - 'no-reply@foxticket.com'
   */
  public confirmationEmail(
    recipient: string | string[],
    username: string,
    confirmationCode: string,
    sender = 'no-reply@foxticket.com',
  ) {
    this.mailerService.sendMail({
      to: `${typeof recipient === 'string' ? recipient : recipient.join(', ')}`,
      from: sender,
      subject: 'Email Confirmation',
      template: './email-confirmation',
      context: {
        username: username,
        confirmation: `http://localhost:4200/confirmation/${confirmationCode}`,
      },
    });
  }
}
