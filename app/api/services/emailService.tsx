import VerifyEmail from '@/emails/VerifyEmail';
import { render } from '@react-email/render';
import { Resend } from 'resend';

export default class emailService {
  private static _transporter: Resend;

  public static init(): emailService {
    if (this._transporter) return this;

    this._transporter = new Resend(process.env.RESEND_API as string);

    return this;
  }

  public static async send(email: string, displayName: string, code: string) {
    if (!this._transporter) this.init();

    try {
      await this._transporter.emails.send({
        // TODO fatran.sk
        from: 'noreply <noreply@sexydomena123.shop>',
        to: email,
        subject: 'paradabanakasaba',
        text: 'a tak',
        html: render(<VerifyEmail code={code} displayName={displayName} />),
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}

/* export default class emailService {
  private static _transporter: Transporter;

  public static init(): emailService {
    if (this._transporter) return this;

    this._transporter = nodemailer.createTransport(
      JSON.parse(process.env.NODEMAILER_PROD_OPTIONS as string)
    );

    return this;
  }

  public static async send(email: string, displayName: string, code: string) {
    if (!this._transporter) this.init();

    const info = await this._transporter
      .sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: email,
        subject: 'Hello ✔',
        text: `Hello world? ${code}`,
        html: render(<VerifyEmail code={code} displayName={displayName} />),
      })
      .catch((error) => {
        return {
          isError: true,
          error,
        };
      });

    return JSON.stringify(info);
  }
}
 */
