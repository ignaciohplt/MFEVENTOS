import './globals.css';

export const metadata = {
  title: 'M.F Eventos - Reservas',
  description: 'Sistema de reservas para M.F Eventos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
