# AGENTS.md — `citas-web`

## Estado verificado del repositorio

`citas-web` contiene el prototipo importado desde Google AI Studio: React 19, TypeScript, Vite y Tailwind CSS. La interfaz y sus estilos viven en `src/`; `src/data/mockData.ts` conserva datos sintéticos para las pantallas fuera del alcance actual. La configuración de la API se recibe por `VITE_API_URL` y el frontend consume Spring Boot de forma directa, sin Express ni BFF.

El incremento S2 abarca HU-001 y HU-002: registro `USER`, login y cierre de sesión contra el contrato REST v1 de `citas-api`. El resto del prototipo no constituye evidencia de funcionalidades posteriores hasta que sus HU, contratos y pruebas correspondientes se implementen.

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
