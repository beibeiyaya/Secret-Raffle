import type { Metadata } from 'next'
import Script from 'next/script'
import { ClientProviders } from '../components/ClientProviders'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secret Raffle - Confidential Lottery Platform',
  description: 'Web3 raffle platform powered by Fully Homomorphic Encryption (FHE), making every raffle fair, transparent, and privacy-preserving',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://cdn.zama.org/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs"
          strategy="beforeInteractive"
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
