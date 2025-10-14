import type { Metadata } from 'next'
import '../styles/App.css'

export const metadata: Metadata = {
  title: 'ZodiaCore',
  description: 'Comprehensive Astrology Services Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}