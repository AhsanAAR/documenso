import aws from 'aws-sdk';
import { createTransport } from 'nodemailer';

import { ResendTransport } from '@documenso/nodemailer-resend';

import { MailChannelsTransport } from './transports/mailchannels';

const getTransport = () => {
  const transport = process.env.NEXT_PRIVATE_SMTP_TRANSPORT ?? 'smtp-auth';

  if (transport === 'mailchannels') {
    return createTransport(
      MailChannelsTransport.makeTransport({
        apiKey: process.env.NEXT_PRIVATE_MAILCHANNELS_API_KEY,
        endpoint: process.env.NEXT_PRIVATE_MAILCHANNELS_ENDPOINT,
      }),
    );
  }

  if (transport === 'resend') {
    return createTransport(
      ResendTransport.makeTransport({
        apiKey: process.env.NEXT_PRIVATE_RESEND_API_KEY || '',
      }),
    );
  }

  if (transport === 'smtp-api') {
    if (!process.env.NEXT_PRIVATE_SMTP_HOST || !process.env.NEXT_PRIVATE_SMTP_APIKEY) {
      throw new Error(
        'SMTP API transport requires NEXT_PRIVATE_SMTP_HOST and NEXT_PRIVATE_SMTP_APIKEY',
      );
    }

    return createTransport({
      host: process.env.NEXT_PRIVATE_SMTP_HOST,
      port: Number(process.env.NEXT_PRIVATE_SMTP_PORT) || 587,
      secure: process.env.NEXT_PRIVATE_SMTP_SECURE === 'true',
      auth: {
        user: process.env.NEXT_PRIVATE_SMTP_APIKEY_USER ?? 'apikey',
        pass: process.env.NEXT_PRIVATE_SMTP_APIKEY ?? '',
      },
    });
  }

  if (transport === 'ses') {
    if (
      !process.env.NEXT_PRIVATE_AWS_ACCESS_KEY_ID ||
      !process.env.NEXT_PRIVATE_AWS_SECRET_ACCESS_KEY
    ) {
      throw new Error('SES transport requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    }

    const ses = new aws.SES({
      accessKeyId: process.env.NEXT_PRIVATE_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PRIVATE_AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1', // Set your preferred region
    });

    const transport = createTransport({
      SES: { ses, aws },
    });

    return transport;
  }

  return createTransport({
    host: process.env.NEXT_PRIVATE_SMTP_HOST ?? 'localhost:2500',
    port: Number(process.env.NEXT_PRIVATE_SMTP_PORT) || 587,
    secure: process.env.NEXT_PRIVATE_SMTP_SECURE === 'true',
    ignoreTLS: process.env.NEXT_PRIVATE_SMTP_UNSAFE_IGNORE_TLS === 'true',
    auth: process.env.NEXT_PRIVATE_SMTP_USERNAME
      ? {
          user: process.env.NEXT_PRIVATE_SMTP_USERNAME,
          pass: process.env.NEXT_PRIVATE_SMTP_PASSWORD ?? '',
        }
      : undefined,
  });
};

export const mailer = getTransport();
