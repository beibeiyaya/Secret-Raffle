import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secret Raffle - 机密抽奖平台',
  description: '基于全同态加密（FHE）技术的 Web3 抽奖平台，让抽奖过程公平透明且保护隐私',
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
        {children}
      </body>
    </html>
  )
}
