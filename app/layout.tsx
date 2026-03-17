import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import '@/styles/globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex',
});

export const metadata: Metadata = {
  title: 'PlanMob CGDI — Plano de Mobilidade Urbana',
  description: 'Sistema para elaboração de minutas de Planos de Mobilidade Urbana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={ibmPlexSans.variable}>
      <body style={{ fontFamily: 'var(--font-ibm-plex), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
