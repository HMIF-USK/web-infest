import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import { montserrat } from "@/fonts/fonts";

export const metadata: Metadata = {
  title: "Informatics Festival",
  description: "Informatics Festival (InFest) adalah acara tahunan yang diselenggarakan oleh Jurusan Informatika, Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Syiah Kuala (USK). Acara ini bertujuan untuk merayakan dan mempromosikan inovasi dan prestasi di bidang teknologi informasi dan komputer. InFest mencakup berbagai kegiatan menarik seperti kompetisi pemrograman, seminar teknologi, workshop, pameran proyek mahasiswa, serta diskusi panel dengan pakar industri.",
  verification: {
    google: "BdfghLWZfCIxNl4X6PcZi-S5sNLuhijwfQgY_Ui8agA"
  },
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['apple-touch-icon.png']
  }
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <Head>
        <title>{String(metadata.title) || ''}</title>
        <meta name="description" content={metadata.description ?? ''} />
        <meta name="google-site-verification" content={String(metadata.verification?.google) ?? ''} />        
      </Head>
      <body className={`${montserrat.className} bg-primary`}>{children}</body>
    </html>
  );
}