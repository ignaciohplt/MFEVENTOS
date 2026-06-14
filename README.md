# M.F Eventos - Reservas

App de reservas para clientes. El cliente completa la ficha y se crea un evento en Google Calendar.

## Ejecutar local

```bash
npm install
npm run dev
```

Abrir: http://localhost:3000

## Subir a GitHub

```bash
git init
git add .
git commit -m "App reservas M.F Eventos"
git branch -M main
git remote add origin https://github.com/ignaciohplt/MFEVENTOS.git
git push -u origin main
```

Si el remoto ya existe:

```bash
git remote set-url origin https://github.com/ignaciohplt/MFEVENTOS.git
git push -u origin main
```

## Variables para Vercel

En Vercel > Project > Settings > Environment Variables agregar:

```env
GOOGLE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=tu calendario o tu email
CALENDAR_TIMEZONE=America/Argentina/Buenos_Aires
```

## Importante Google Calendar

1. Crear un proyecto en Google Cloud.
2. Activar Google Calendar API.
3. Crear una Service Account.
4. Descargar la clave JSON.
5. Compartir tu Google Calendar con el email de la service account con permiso para modificar eventos.
6. Copiar `client_email` en `GOOGLE_CLIENT_EMAIL`.
7. Copiar `private_key` en `GOOGLE_PRIVATE_KEY`.



## Si te salió error de @googleapis/calendar
Ya está corregido en este ZIP: ahora usa el paquete correcto `googleapis`.

Para instalar de cero en Windows:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Si usás PowerShell y `rm -rf` no funciona:

```powershell
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```
