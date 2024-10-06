import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "@/fonts/fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Informatics Festival",
  description:
    "Informatics Festival (InFest) adalah acara tahunan yang diselenggarakan oleh Jurusan Informatika, Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Syiah Kuala (USK). Acara ini bertujuan untuk merayakan dan mempromosikan inovasi dan prestasi di bidang teknologi informasi dan komputer. InFest mencakup berbagai kegiatan menarik seperti kompetisi pemrograman, seminar teknologi, workshop, pameran proyek mahasiswa, serta diskusi panel dengan pakar industri.",
  verification: {
    google: "BdfghLWZfCIxNl4X6PcZi-S5sNLuhijwfQgY_Ui8agA",
  },
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${montserrat.className} bg-primary`}>{children}</body>
      <Toaster
        toastOptions={{
          position: "top-center",
          style: {
            background: "#151515",
            color: "#fff",
          },
        }}
      />
    </html>
  );
}
