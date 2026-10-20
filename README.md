# CodeLab Fidélitas

Taller web responsive de estilo arcade moderno: seis misiones, originales descargables, bloques seleccionables, consola, casos sorpresa, progreso de pruebas y animaciones con respeto a reducción de movimiento. Proyecto académico independiente, sin afiliación institucional declarada.

- Web: https://jordyretana.github.io/codelab-fidelitas/
- Repositorio: https://github.com/JordyRetana/codelab-fidelitas

## Contenido y autoría

| Ejercicio | Archivo original | Estado |
|---|---|---|
| 1 · Compra | `Calculo de compra.py` | Python real con Pyodide |
| 2 · Frases | `Program (1).cs` | C# compilado, .NET WebAssembly |
| 3 · Calificaciones | No adjuntado | Pendiente |
| 4 · Inventario | `Inventario.py` | Python real con Pyodide |
| 5 · Reservas | `Program.cs` | C# compilado, .NET WebAssembly |
| 6 · Reporte CSV | No adjuntado | Pendiente |

Los cinco adjuntos se preservan byte por byte en `originales/`. No se inventan integrantes ni se atribuye código a personas sin evidencia. El documento identifica al docente Manuel Sanabria; no identifica a los autores de los programas. Los campos de curso, grupo, integrantes y fecha están vacíos.

| Contribución | Responsable | Revisión |
|---|---|---|
| Cuatro programas adjuntos | Autoría no identificada | Pendiente de completar por el equipo |
| Interfaz, adaptador, documentación, explicaciones y pruebas | Generados con asistencia de OpenAI Codex a solicitud del usuario | Ver `VALIDACION.md` |
| Ejercicios 3 y 6 | Pendientes | Sin implementación atribuida |

## Abrir y ejecutar

En GitHub Pages, abrir la URL del proyecto y seleccionar un ejercicio. Python descarga Pyodide 0.27.7 desde jsDelivr; C# descarga los archivos .NET del propio sitio. La primera carga necesita conexión y puede tardar. Las fuentes tipográficas vienen de Google Fonts, con alternativas locales.

Introducir una respuesta por línea y pulsar **Ejecutar programa**. Los menús deben terminar con 6 (inventario) o 4 (reservas). Cada ejecución reinicia el estado; no hay persistencia ni backend. El adaptador entrega entradas por lotes, no una terminal interactiva de preguntas sucesivas. No permite editar ni compilar nuevos programas en el navegador. **Cargar** restaura un caso; **Ejecutar pruebas del ejercicio** ejecuta cada caso y compara fragmentos esperados con salida real. Los resultados comienzan como «Sin ejecutar».

Python ejecuta el texto original en un Web Worker. El worker se termina a los 20 segundos (incluida descarga); si la conexión es lenta, reintentar. C# ejecuta los ensamblados por reflexión con cultura invariante para resultados reproducibles. Como el navegador no admite `System.Console.ReadLine`, los proyectos definen un alias de compilación `Console = CodeLab.ConsoleAdapter`: solo sustituye la entrada/salida por lectores y escritores de texto. La lógica y los archivos originales no cambian. Las referencias incluyen usings implícitos del SDK, sin agregar líneas a los originales. Se desactiva trimming para conservar los puntos de entrada privados. No se simula C# en JavaScript. Al agotar respuestas, el adaptador interrumpe el menú con un aviso; C# limita la lectura a 1000 respuestas. El botón Detener termina el worker Python; C# se ejecuta en el hilo del navegador y queda sujeto al límite de entradas.

## Construir localmente

Requisitos: SDK .NET 10, Node.js 22 o superior, acceso a NuGet para la primera restauración. La dependencia `Microsoft.AspNetCore.Components.WebAssembly` está fijada a 10.0.8. No requiere servidor ASP.NET ni base de datos.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Abrir `http://localhost:4173`. No abrir `index.html` con `file://`.

Para ejecutar los C# en consola con su runtime original:

```sh
dotnet run --project src/Frases
dotnet run --project src/Reservas
```

Para Python local, usar Python 3:

```sh
python "originales/Calculo de compra.py"
python originales/Inventario.py
```

## Pruebas y discrepancias

`web/catalog.js` contiene 22 casos ejecutables (5 compra, 5 frases, 5 inventario, 7 reservas), con entradas y fragmentos esperados. Las salidas obtenidas se pueden desplegar en la mesa de pruebas. Los ejercicios pendientes solo muestran criterios de aceptación, sin fingir pruebas aprobadas. El estado completo se documenta en `VALIDACION.md`.

En el documento, «Anita lava la tina» indica 2 dígitos. Son 0; el programa devuelve correctamente 0. Se conserva el documento original sin corregirlo.

Comportamientos del código adjunto: compra termina tras entrada inválida y admite `inf` como precio; inventario permite nombre vacío y no elimina espacios extremos del nombre. Las soluciones están organizadas principalmente como flujo de consola, sin separación completa en funciones. El análisis de frases normaliza espacios literales, no todas las clases Unicode de espacios. Son observaciones del original; no se hicieron correcciones silenciosas. Los ejercicios 3 y 6, sus CSV y sus pruebas siguen pendientes. Esta web no presenta la entrega académica como completa.

## Publicar

`.github/workflows/pages.yml` construye y despliega `dist/` en GitHub Pages al actualizar `main`. En Settings → Pages, seleccionar GitHub Actions como fuente. La ruta usa recursos relativos para funcionar bajo `/codelab-fidelitas/`. `.nojekyll` conserva `_framework`.

## Referencias y permisos

- [Pyodide: flujos de entrada/salida](https://pyodide.org/en/stable/usage/streams.html).
- [Microsoft: despliegue de Blazor WebAssembly](https://learn.microsoft.com/aspnet/core/blazor/host-and-deploy/webassembly).

No se añade licencia sobre las obras originales sin conocer a sus titulares. La publicación no declara derechos ni autoría adicionales. El nombre identifica este proyecto académico.
