'use client'

import dxaTheme from '@/utils/themes/dxa-theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import localFont from 'next/font/local'

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <ThemeProvider theme={dxaTheme}>
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh',
                        }}
                    >
                        <Header />
                        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                            {children}
                        </Box>
                        <Footer />
                    </Box>
                </ThemeProvider>
            </body>
        </html>
    )
}
