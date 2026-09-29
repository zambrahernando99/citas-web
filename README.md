# citas-web

Frontend del sistema de citas, importado desde el diseño generado en Google AI Studio.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS

## Ejecutar localmente

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` a `.env` y ajusta `VITE_API_URL` si el backend no se ejecuta en `http://localhost:8080`.
3. Ejecuta `npm run dev`.

## Estado de integración

La aplicación consume directamente la API REST v1 de `citas-api` mediante `VITE_API_URL`; no hay Express ni BFF y no se incluyen fixtures ni datos de negocio simulados. Las pantallas cargan su información del servicio: perfil, afiliación, catálogos, disponibilidad, reservas, citas, solicitudes, agenda y directorios. Si la API no está disponible, se muestra el error del servicio en vez de sustituir la información por datos locales. Los tokens se mantienen en memoria.

Los flujos implementados dependen de migraciones Flyway vigentes en el backend. El workflow S5 y la integración MCP requieren una instancia n8n configurada por el entorno, además de sus credenciales externas; no se simulan en la interfaz.
