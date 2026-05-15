import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Poppy the Dachshund',
  description: 'Walk through five life stages with Poppy the Dachshund!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black overflow-hidden">{children}</body>
    </html>
  );
}
