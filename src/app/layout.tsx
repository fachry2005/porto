import "./globals.css";
import RefreshRedirect from '@/components/RefreshRedirect'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata = {
  title: "Fachry Fariska Ilham",
  description: "Portfolio...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <RefreshRedirect />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
