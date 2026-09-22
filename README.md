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

Las pantallas, la navegación y los estilos del exportado están incorporados. El exportado usa datos sintéticos en memoria (`src/data/mockData.ts`); la conexión REST directa con `citas-api` queda pendiente de implementar contra el contrato aprobado. No se incluye Express ni un BFF.
