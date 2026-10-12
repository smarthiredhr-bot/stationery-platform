import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stationery Express & Document Services',
  description: 'Automated printing, document digitisation, CV builder, and stationery platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-slate-900">
                Stationery Express
              </Link>
              <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Supplies Store
                </Link>
                <Link href="/print" className="hover:text-blue-600 transition-colors">
                  Printing & Pricing
                </Link>
                <Link href="/scan" className="hover:text-blue-600 transition-colors">
                  Doc Scanner
                </Link>
              </nav>
            </div>
            <div>
              <Link
                href="/print"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                Instant Print Order
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

