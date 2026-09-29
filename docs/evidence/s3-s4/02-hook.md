# S3 — Hook local: FAIL / FAIL (secreto) / PASS — `citas-web`

Hook: `core.hooksPath=.githooks` → `.githooks/pre-commit` → `scripts/verify-s3.ps1`, en este orden:
1. escaneo de secretos sobre el contenido **staged** (PowerShell nativo; antes dependía de `rg`, que no estaba instalado en el host);
2. `npm run lint` (tsc);
3. `npm test` (Vitest);
4. `npm run build`.

## FAIL 1 — prueba rota a propósito (`src/test/hook-demo.test.ts`)
```text
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/test/hook-demo.test.ts > hook demo: debe fallar
AssertionError: expected 2 to be 3 // Object.is equality
 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 13 passed (14)
exit=1 — commit rechazado (HEAD = cb8ba06); la prueba demo se retiró
```

## FAIL 2 — secreto ficticio (`src/fake-secret-demo.ts` asignaba a la clave api_key un valor ficticio de 24 caracteres)
```text
Potential secret pattern detected in staged content:
  src/fake-secret-demo.ts:2
Potential secret pattern detected.
exit=1 — commit rechazado (HEAD = cb8ba06); archivo retirado con git rm --cached y borrado; nunca entró al historial
```

## PASS
Commit `feat(s4): complete appointment lifecycle with autonomous verification loops` en este repositorio: escaneo limpio, `tsc` sin errores, Vitest 13/13 y build OK. El hash queda en `EVIDENCIAS_Y_TRAZABILIDAD.md` del workspace.
