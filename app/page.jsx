'use client';

import { useMemo, useState } from 'react';

const initialForm = {
  nombre: '',
  fecha: '',
  direccion: '',
  hora: '',
  duracion: '3',
  detalle: '',
  total: '',
  envio: '',
  sena: '',
};

function money(value) {
  const number = Number(String(value).replace(/[^0-9.-]/g, '')) || 0;
  return number.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
}

export default function HomePage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [calendarLink, setCalendarLink] = useState('');
  const saldo = useMemo(() => {
    const total = Number(form.total || 0);
    const envio = Number(form.envio || 0);
    const sena = Number(form.sena || 0);
    return Math.max(total + envio - sena, 0);
  }, [form.total, form.envio, form.sena]);

  const eventEnd = useMemo(() => {
    if (!form.hora) return '';
    const [h, m] = form.hora.split(':').map(Number);
    const end = new Date(2025, 0, 1, h || 0, m || 0);
    end.setHours(end.getHours() + Number(form.duracion || 3));
    return end.toTimeString().slice(0, 5);
  }, [form.hora, form.duracion]);

  function update(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setCalendarLink('');
    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, saldo }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus('error');
      alert(data.error || 'No se pudo enviar la reserva');
      return;
    }
    setStatus('success');
    setCalendarLink(data.htmlLink || '');
  }

  return (
    <>
      <header>
        <div>
          <div className="logo"><span>M.F</span> <span>E</span><span>V</span><span>E</span><span>NTOS</span></div>
          <div className="sub">Mobiliario, inflables infantiles y decoraciones</div>
        </div>
        <nav>
          <a href="#reserva">Reservar</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#preview">Calendario</a>
          <a className="btn" href="#reserva">Reservar</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="reserva">
          <form className="card" onSubmit={handleSubmit}>
            <h1>FICHA DE RESERVA</h1>
            <p className="intro">Completá los datos para reservar tu evento.</p>

            <label>Nombre y Apellido <b>*</b></label>
            <input name="nombre" required value={form.nombre} onChange={update} placeholder="Ej: Juan Pérez" />

            <label>Fecha del Cumple <b>*</b></label>
            <input name="fecha" type="date" required value={form.fecha} onChange={update} />

            <label>Dirección del Cumple <b>*</b></label>
            <input name="direccion" required value={form.direccion} onChange={update} placeholder="Ej: Av. Siempre Viva 123" />

            <div className="grid">
              <div>
                <label>Hora del Evento <b>*</b></label>
                <input name="hora" type="time" required value={form.hora} onChange={update} />
              </div>
              <div>
                <label>Duración estimada</label>
                <select name="duracion" value={form.duracion} onChange={update}>
                  <option value="2">2 horas</option>
                  <option value="3">3 horas</option>
                  <option value="4">4 horas</option>
                  <option value="5">5 horas</option>
                </select>
              </div>
            </div>

            <label>Detalle del Pedido <b>*</b></label>
            <textarea name="detalle" required value={form.detalle} onChange={update} placeholder="Inflable, mesas, sillas, decoración..." />

            <div className="grid">
              <div><label>Total del Pedido <b>*</b></label><input name="total" type="number" required value={form.total} onChange={update} placeholder="25000" /></div>
              <div><label>Envío</label><input name="envio" type="number" value={form.envio} onChange={update} placeholder="2000" /></div>
              <div><label>Seña <b>*</b></label><input name="sena" type="number" required value={form.sena} onChange={update} placeholder="10000" /></div>
              <div><label>Saldo Restante</label><input value={money(saldo)} readOnly /></div>
            </div>

            <button className="send" disabled={status === 'loading'}>{status === 'loading' ? 'ENVIANDO...' : 'ENVIAR RESERVA'}</button>
            <div className="safe">🔒 Tus datos están seguros y solo se usarán para tu reserva.</div>
            <button
              type="button"
              className="printButton"
              onClick={() => window.print()}
            >
              🖨️ IMPRIMIR FICHA
            </button>
          </form>

          <div>
            <div className="banner">
              <div className="balloon b1"></div><div className="balloon b2"></div><div className="balloon b3"></div>
              <div><h2>M.F EVENTOS</h2><p>Inflables · Mobiliario · Decoraciones</p></div>
            </div>
            <div className="card steps" id="como-funciona">
              <h2>¿Cómo funciona?</h2>
              <div className="step"><div className="ico">1</div><div><b>Completá la ficha</b><br /><span>Ingresá todos los datos del evento.</span></div></div>
              <div className="step"><div className="ico">2</div><div><b>Enviá tu reserva</b><br /><span>Se carga directo en el calendario.</span></div></div>
              <div className="step"><div className="ico">3</div><div><b>Confirmación</b><br /><span>Para confirmar la fecha se abona la seña.</span></div></div>
              <div className="step"><div className="ico">4</div><div><b>Disfrutá tu evento</b><br /><span>Nos encargamos de que todo salga perfecto.</span></div></div>
            </div>
          </div>
        </section>

        <section className={`confirm ${status === 'success' ? 'show' : ''}`}>
          <div className="check">✓</div>
          <h2>¡Reserva enviada con éxito!</h2>
          <p>Tu reserva fue registrada correctamente y se creó el evento en Google Calendar.</p>
          {calendarLink && <a className="outline" href={calendarLink} target="_blank">VER EN CALENDARIO</a>}
        </section>

        <section className="preview" id="preview">
          <div className="details">
            <h2>Cumpleaños - {form.nombre || 'Nombre del cliente'}</h2>
            <p>📅 {form.fecha || 'Fecha del evento'}</p>
            <p>🕒 {form.hora || 'Hora'} {eventEnd && `– ${eventEnd}`}</p>
            <p>📍 {form.direccion || 'Dirección del evento'}</p>
            <p>📋 {form.detalle || 'Detalle del pedido'}</p>
            <p>💵 Total: {money(form.total)}</p>
            <p>🚚 Envío: {money(form.envio)}</p>
            <p>💰 Seña: {money(form.sena)}</p>
            <p>🧾 Saldo restante: {money(saldo)}</p>
          </div>
          <div className="cal">
            <h3>PREVISUALIZACIÓN</h3>
            <div className="calendarBox">
              <div className="hour">14:00</div><div></div>
              <div className="hour">15:00</div><div className="event">Cumpleaños - {form.nombre || 'Cliente'}<br />{form.hora || '15:00'} {eventEnd && `– ${eventEnd}`}</div>
              <div className="hour">16:00</div><div></div>
              <div className="hour">17:00</div><div></div>
              <div className="hour">18:00</div><div></div>
            </div>
          </div>
        </section>


        <section className="printFicha" aria-label="Ficha de reserva para imprimir">
          <div className="pfValue pfNombre">{form.nombre}</div>
          <div className="pfValue pfFecha">{form.fecha}</div>
          <div className="pfValue pfDireccion">{form.direccion}</div>
          <div className="pfValue pfHora">{form.hora} {eventEnd && `a ${eventEnd}`}</div>
          <div className="pfValue pfDetalle">{form.detalle}</div>
          <div className="pfValue pfTotal">{money(form.total)}</div>
          <div className="pfValue pfEnvio">{money(form.envio)}</div>
          <div className="pfValue pfSena">{money(form.sena)}</div>
          <div className="pfValue pfSaldo">{money(saldo)}</div>
        </section>
      </main>

      <footer><b>© 2025 M.F EVENTOS</b><span>Instagram · Facebook</span><span>WhatsApp</span></footer>
    </>
  );
}
