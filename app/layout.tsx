import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { AppStateProvider } from '@/components/AppStateProvider';
import { getFullState } from '@/lib/db';
import './globals.css';

export const metadata: Metadata = {
  title: 'IronMarc · Journal de bord',
  description: 'Quête Ironman — journal de bord gamifié',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = getFullState();
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppStateProvider initial={initialState}>
          <div className="app-root">
            <Nav />
            <main className="page-main">
              <div className="page-inner">
                {children}
              </div>
            </main>
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
