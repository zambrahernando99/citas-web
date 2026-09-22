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

Las pantallas, la navegación y los estilos del exportado están incorporados. El exportado conserva datos sintéticos en memoria (`src/data/mockData.ts`) para las capacidades posteriores a S2. Registro, login y logout consumen directamente el contrato REST v1 de `citas-api` mediante `VITE_API_URL`; no se incluye Express ni un BFF. Los tokens de S2 sólo se mantienen en memoria.
