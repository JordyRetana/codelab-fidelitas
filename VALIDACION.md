# Validación

Fecha: 20 de octubre de 2026.

## Ejecución real en navegador

Se ejecutaron los casos desde los controles de la web, con los runtimes reales en WebAssembly. Ninguna salida se precargó como aprobada.

| Ejercicio | Runtime | Aprobadas / ejecutadas |
|---|---|---|
| 1 · Compra | Pyodide 0.27.7 | 5 / 5 |
| 2 · Frases | .NET 10 WebAssembly | 5 / 5 |
| 3 · Calificaciones (nuevo) | Pyodide 0.27.7 | 5 / 5 |
| 4 · Inventario | Pyodide 0.27.7 | 5 / 5 |
| 5 · Reservas | .NET 10 WebAssembly | 7 / 7 |
| 6 · Reporte CSV (nuevo) | Pyodide 0.27.7 | 7 / 7 |

La matriz contiene **34 casos** de seis programas: cuatro originales y dos implementaciones nuevas. La evidencia con esperados y salidas obtenidas está en `pruebas-obtenidas.json`. Las entradas reproducibles están en `web/catalog.js`. La comparación usa fragmentos esperados y rechaza errores del adaptador; no pretende demostrar todos los casos posibles del programa. En CSV, además compara el archivo exacto, incluidos los reportes previos que deben permanecer intactos tras un error.

Se verificaron navegación por seis estaciones, identificación de implementaciones nuevas, resaltado y avance de bloques, estados iniciales «Sin ejecutar», progreso real de pruebas, descarga del reporte CSV y presentación adaptable en la vista del navegador. Las animaciones respetan `prefers-reduced-motion`. Las barras de desplazamiento tienen colores del taller; se mantiene el desplazamiento nativo por teclado, rueda y tacto.

## Construcción y preservación

- Compilación Release de Blazor WebAssembly con .NET 10 completada.
- Comprobación de sintaxis de JavaScript completada.
- Los cinco adjuntos originales tienen huellas SHA-256 en `originales/SHA256SUMS.txt`; `.gitattributes` impide convertir sus saltos de línea al versionarlos.
- `Console.ReadLine` requiere un adaptador explícito de E/S en navegador. El alias de compilación conserva el texto original y ejecuta su lógica C#, sin traducción a JavaScript.

## Publicación

Repositorio: https://github.com/JordyRetana/codelab-fidelitas

Web: https://jordyretana.github.io/codelab-fidelitas/

El flujo de GitHub Actions reconstruye los ensamblados y publica archivos estáticos en Pages. La verificación del despliegue final se realiza después de subir estos cambios.
