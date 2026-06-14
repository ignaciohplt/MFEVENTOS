import { google } from 'googleapis';

export async function POST(req) {
  try {
    const data = await req.json();
    const required = ['nombre', 'fecha', 'direccion', 'hora', 'detalle', 'total', 'sena'];
    for (const field of required) {
      if (!data[field]) return Response.json({ error: `Falta completar: ${field}` }, { status: 400 });
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
      return Response.json({ error: 'Faltan variables de Google Calendar en Vercel.' }, { status: 500 });
    }

    const start = new Date(`${data.fecha}T${data.hora}:00`);
    const end = new Date(start);
    end.setHours(end.getHours() + Number(data.duracion || 3));

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const description = [
      `Cliente: ${data.nombre}`,
      `Detalle del pedido: ${data.detalle}`,
      `Total: $${data.total}`,
      `Envío: $${data.envio || 0}`,
      `Seña: $${data.sena}`,
      `Saldo restante: $${data.saldo || 0}`,
    ].join('\n');

    const created = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Cumpleaños - ${data.nombre}`,
        location: data.direccion,
        description,
        start: { dateTime: start.toISOString(), timeZone: process.env.CALENDAR_TIMEZONE || 'America/Argentina/Buenos_Aires' },
        end: { dateTime: end.toISOString(), timeZone: process.env.CALENDAR_TIMEZONE || 'America/Argentina/Buenos_Aires' },
      },
    });

    return Response.json({ ok: true, htmlLink: created.data.htmlLink });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Error creando la reserva.' }, { status: 500 });
  }
}
