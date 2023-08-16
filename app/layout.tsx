import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import ClientLayout from './clientLayout';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fatran.sk',
  description: '37. zbor Fatran Martin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ClientLayout>
          <div className="absolute w-full h-full">{children}</div>
        </ClientLayout>
      </body>
    </html>
  );
}
