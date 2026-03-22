import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'NextUp — Drop in anything messy. Get what matters.',
  description:
    'AI-powered life admin. Paste emails, PDFs, meeting notes, or bills and instantly get a summary, deadlines, next steps, and reply drafts.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className={GeistSans.className}>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#161616',
              border: '1px solid #2a2a2a',
              color: '#f5f0e8',
              fontFamily: 'var(--font-geist-sans)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
