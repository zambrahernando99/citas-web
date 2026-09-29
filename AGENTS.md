# AGENTS.md — `citas-web`

## Estado verificado del repositorio

`citas-web` parte del prototipo importado desde Google AI Studio: React 19, TypeScript, Vite y Tailwind CSS. La interfaz y sus estilos viven en `src/`; no existen datos mock en código de producción. La configuración de la API se recibe por `VITE_API_URL` y el frontend consume Spring Boot de forma directa (cliente único `src/services/http.ts`), sin Express ni BFF.

Alcance actual: HU-001..HU-028 consumidas desde el contrato REST v1 de `citas-api` (sesión con refresh proactivo, perfil y afiliación, catálogos —regímenes como catálogo fijo de solo lectura—, profesionales, disponibilidad, reservas, bandeja administrativa `/api/v1/admin/inbox`, cierre de atención e historial de estados). Las pantallas permitidas por rol se definen en `src/navigation.ts` (`screensByRole`, fuente única para menú y navegación).

Verificación (desde la raíz del workspace, contenedor `citas-web-dev`): `npm run lint`, `npm test` y `npm run build`. El hook `.githooks/pre-commit` ejecuta `scripts/verify-s3.ps1` en el host (escaneo de secretos sobre lo staged, lint, test y build).

Docker: el contenedor usa su propio volumen `web_node_modules` (binarios Linux), separado del `node_modules` del host Windows; tras cambiar dependencias, ejecutar `npm install` en ambos. Vite dentro del contenedor no recibe eventos de cambio del bind mount de Windows: después de editar, reiniciar `npm run dev` para ver el código actual.

Pruebas: Vitest + Testing Library (`vitest.config.ts`, `src/test/setup.ts`). Los mocks de `fetch` (vía `vi.stubGlobal`) y los datos sintéticos viven solo en archivos `*.test.*`.

## Inspección obligatoria

Antes de proponer cambios, leer `package.json`, estructura, rutas, estilos/tokens y la evidencia de diseño aprobada disponible. No cambiar React, Vite o Tailwind por preferencia propia ni rediseñar el prototipo importado.

## Responsabilidad

- Implementar exclusivamente el frontend.
- Usar TypeScript y el stack realmente exportado por Google AI Studio.
- Consumir `citas-api` directamente por REST.
- Mantener alta fidelidad al diseño aprobado de Stitch/AI Studio.
- Implementar formularios, estados de UI, autorización de rutas, manejo de errores, accesibilidad y pruebas/build disponibles.

## Reglas

- No añadir Express ni BFF.
- No implementar reglas de negocio solo en cliente: el backend es la autoridad.
- Configurar la URL de API por environment.
- No hardcodear tokens, secretos ni credenciales.
- Preservar componentes y estilos correctos al reconciliar el resultado de AI Studio.
- No editar `citas-api` desde este agente. Si el contrato no alcanza, reportar el cambio cross-repo al orquestador.
- No mantener una LLM Wiki propia; la wiki global la mantiene el orquestador.

## Modo de trabajo

1. Leer la HU, criterios de aceptación y DoD relevantes. Si aún no existen, solicitar su aprobación antes de implementar.
2. Identificar pantallas, componentes y servicios afectados.
3. Mapear estados `loading`, `empty`, `error`, `success` y `disabled`.
4. Antes de editar, proponer un plan con archivos frontend y verificaciones previstas. Implementar sin rediseñar lo aprobado.
5. Ejecutar build, typecheck y pruebas realmente disponibles en el stack detectado.
6. Verificar comportamiento frente a criterios de aceptación, accesibilidad y contrato REST.
7. Resumir evidencia ejecutada y dejar explícito lo no verificado.

## Integración REST

La aplicación consume Spring Boot directamente. Las respuestas y errores del backend se representan en la UI; el cliente no sustituye autorización, validaciones ni transiciones de negocio del servidor. Cualquier endpoint nuevo o cambio incompatible se escala al orquestador para coordinación con `citas-api`.
