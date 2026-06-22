import type { Metadata, Viewport } from 'next';
import Nav from '@/components/Nav';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { AppStateProvider } from '@/components/AppStateProvider';
import { AuthProvider } from '@/components/AuthProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { getFullState } from '@/lib/db';
import './globals.css';
import 'leaflet/dist/leaflet.css';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F2F2F7',
};

export const metadata: Metadata = {
  title: 'IronMarc · Journal de bord',
  description: 'Quête Ironman — journal de bord gamifié',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'IronMarc',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let initialState;
  try { initialState = getFullState(); }
  catch { initialState = { days: {}, quests: {}, affIdx: 0 }; }
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <BackgroundOrbs />
        <ThemeProvider />
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
