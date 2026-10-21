# CodeLab Fidélitas

Proyecto de práctica con seis ejercicios de Python y C#. Permite consultar el código, leer la explicación de cada bloque y ejecutar programas y pruebas en el navegador.

- Web: https://jordyretana.github.io/codelab-fidelitas/
- Repositorio: https://github.com/JordyRetana/codelab-fidelitas

## Contenido y autoría

| Ejercicio | Archivo original | Estado |
|---|---|---|
| 1 · Compra | `Calculo de compra.py` | Python con Pyodide |
| 2 · Frases | `Program (1).cs` | C# compilado, .NET WebAssembly |
| 3 · Calificaciones | `nuevos/Calificaciones.py` | Implementación nueva · Python / Pyodide |
| 4 · Inventario | `Inventario.py` | Python con Pyodide |
| 5 · Reservas | `Program.cs` | C# compilado, .NET WebAssembly |
| 6 · Reporte CSV | `nuevos/Reporte_ventas.py` | Implementación nueva · Python / Pyodide |

Los cinco archivos recibidos se conservan en `originales/`. El documento indica al docente Manuel Sanabria y deja pendientes los datos de curso, grupo, integrantes y fecha.

| Contribución | Responsable | Revisión |
|---|---|---|
| Cuatro programas adjuntos | Autoría no identificada | Pendiente de completar por el equipo |
| Interfaz, adaptador, documentación, explicaciones y pruebas | Asistencia de OpenAI Codex | Ver `VALIDACION.md` |
| Ejercicios 3 y 6 | Asistencia de OpenAI Codex | Ver `VALIDACION.md` |

## Abrir y ejecutar

En GitHub Pages, abrir la URL del proyecto y seleccionar un ejercicio. Python descarga Pyodide 0.27.7 desde jsDelivr; C# descarga los archivos .NET del propio sitio. La primera carga necesita conexión y puede tardar. Las fuentes tipográficas vienen de Google Fonts, con alternativas locales.

Introducir una respuesta por línea y pulsar **Ejecutar programa**. Los menús deben terminar con 6 (inventario) o 4 (reservas). Cada ejecución reinicia el estado; no hay persistencia ni backend. El adaptador entrega entradas por lotes, no una terminal interactiva de preguntas sucesivas. No permite editar ni compilar nuevos programas en el navegador. **Cargar** restaura un caso; **Ejecutar pruebas del ejercicio** ejecuta cada caso y compara fragmentos esperados con salida real. Los resultados comienzan como «Sin ejecutar».

Python ejecuta el texto original en un Web Worker. El worker se termina a los 20 segundos (incluida descarga); si la conexión es lenta, reintentar. C# ejecuta los ensamblados por reflexión con cultura invariante para resultados reproducibles. Como el navegador no admite `System.Console.ReadLine`, los proyectos definen un alias de compilación `Console = CodeLab.ConsoleAdapter`: solo sustituye la entrada/salida por lectores y escritores de texto. La lógica y los archivos originales no cambian. Las referencias incluyen usings implícitos del SDK, sin agregar líneas a los originales. Se desactiva trimming para conservar los puntos de entrada privados. No se simula C# en JavaScript. Al agotar respuestas, el adaptador interrumpe el menú con un aviso; C# limita la lectura a 1000 respuestas. El botón Detener termina el worker Python; C# se ejecuta en el hilo del navegador y queda sujeto al límite de entradas.

## Archivos CSV y nuevos programas

El ejercicio 6 acepta un CSV UTF-8 de hasta 1 MB. El archivo seleccionado se coloca como `ventas.csv` en el sistema de archivos de Pyodide; el programa Python lo lee y genera `reporte_ventas.csv`. El enlace de descarga entrega los bytes producidos por Python. Todo ocurre en el navegador, sin subir el CSV a un servidor. **Restaurar ejemplo** vuelve al CSV del enunciado. Los casos de prueba usan sus propios archivos y verifican que los errores de encabezado o archivo ausente conserven un reporte previo. Los fixtures están en `ejemplos/`.

El ejercicio 3 vuelve a pedir cantidades y notas inválidas; una respuesta por línea incluye las correcciones. Se rechazan notas no finitas. Los dos programas nuevos separan lectura, cálculo y presentación en funciones. Para ejecutarlos localmente: `python nuevos/Calificaciones.py` y `python nuevos/Reporte_ventas.py`. En el segundo, introducir la ruta `ejemplos/ventas.csv` cuando se solicite.

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

`web/catalog.js` contiene 34 casos ejecutables: 5 compra, 5 frases, 5 calificaciones, 5 inventario, 7 reservas y 7 CSV. Incluye entradas, archivos de prueba y resultados esperados. Las salidas obtenidas se despliegan en la mesa de pruebas. CSV compara además el contenido exacto del archivo producido o preservado. El estado de la verificación se documenta en `VALIDACION.md`.

En el documento, «Anita lava la tina» indica 2 dígitos. Son 0; el programa devuelve correctamente 0. Se conserva el documento original sin corregirlo.

Comportamientos del código adjunto: compra termina tras entrada inválida y admite `inf` como precio; inventario permite nombre vacío y no elimina espacios extremos del nombre. Las soluciones están organizadas principalmente como flujo de consola, sin separación completa en funciones. El análisis de frases normaliza espacios literales, no todas las clases Unicode de espacios. Los ejercicios 3 y 6 se añadieron por separado. Quedan pendientes los datos de integrantes y la revisión del equipo.

## Publicar

`.github/workflows/pages.yml` construye y despliega `dist/` en GitHub Pages al actualizar `main`. En Settings → Pages, seleccionar GitHub Actions como fuente. La ruta usa recursos relativos para funcionar bajo `/codelab-fidelitas/`. `.nojekyll` conserva `_framework`.

Las hojas de estilo, los módulos, el worker y los datos fuente se publican con nombres derivados de su contenido para evitar mezclar archivos de distintas versiones. Al abrir el taller se comprueba `version.json` sin caché; una copia HTML anterior se actualiza una sola vez por versión. Los avisos aparecen dentro de la consola, únicamente cuando tienen texto, y se retiran al terminar su tiempo.

## Referencias y permisos

- [Pyodide: flujos de entrada/salida](https://pyodide.org/en/stable/usage/streams.html).
- [Microsoft: despliegue de Blazor WebAssembly](https://learn.microsoft.com/aspnet/core/blazor/host-and-deploy/webassembly).

No se añade licencia sobre las obras originales sin conocer a sus titulares. La publicación no declara derechos ni autoría adicionales. El nombre identifica este proyecto académico.
