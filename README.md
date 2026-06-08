# my-opencode-plugins

**v0.9.0** — Plugins para [opencode](https://opencode.ai).

Colección de plugins para mejorar la experiencia de uso de opencode, con foco en seguridad, visibilidad y trazabilidad de los comandos ejecutados.

---

## Plugins

### log-prefix

Agrega un prefijo visible con timestamp a cada comando `bash` antes de ejecutarlo.

**Hook:** `tool.execute.before`  
**Export:** `LogPrefixPlugin`

```js
// Salida:
// [OPENCODE 14:30:01] Ejecutando:
// <resultado del comando>
```

**Evento:** Se dispara antes de cada ejecución de herramienta `bash`. Modifica `output.args.command` para anteponer un `echo` con la hora actual.

---

### console-logger

Guarda todos los comandos ejecutados durante una sesión en un único archivo de log, numerados por orden de ejecución, con timestamp ISO y salida completa.

**Hook:** `tool.execute.after`  
**Export:** `ConsoleLoggerPlugin`

**Ubicación de logs:** `~/opencode-logs/session_<session-id>.log`

**Formato del log:**
```
=== SESSION START: 2026-06-08T14:30:01.000Z ===
[1] 2026-06-08T14:30:01.000Z
> echo "hola"
hola
---
[2] 2026-06-08T14:30:05.000Z
> ls -la
total 0
drwxr-xr-x 1 user 1049089 0 Jun  8 14:30 .
---
```

**Evento:** Se dispara después de cada ejecución de herramienta `bash`. Lee el comando y su resultado, y los anexa al archivo de sesión.

---

### command-guard

Bloquea comandos potencialmente destructivos antes de que se ejecuten, lanzando un error con el patrón que coincidió.

**Hook:** `tool.execute.before`  
**Export:** `CommandGuardPlugin`

**Patrones bloqueados:**

| Patrón (regex) | Ejemplo de comando bloqueado |
|----------------|------------------------------|
| `rm -rf /` | `rm -rf /` |
| `rm -rf ~` | `rm -rf ~/Documents` |
| `rm -rf *$` | `rm -rf *` |
| `rmdir /s /q C:\` | `rmdir /s /q C:\Windows` |
| `rd /s /q C:\` | `rd /s /q C:\` |
| `del /f /s /q` | `del /f /s /q C:\*` |
| `^format ` | `format D: /fs:NTFS` |
| `^diskpart` | `diskpart` |
| `shutdown /r` | `shutdown /r /t 0` |
| `shutdown /s` | `shutdown /s /t 0` |
| `Remove-Item.*-Recurse.*-Force` | `Remove-Item C:\Windows -Recurse -Force` |
| `del ~?\\` | `del ~\*` |
| `reg delete` | `reg delete HKLM\Software` |

**Evento:** Se dispara antes de cada ejecución de herramienta `bash`. Si el comando coincide con algún patrón de la lista, lanza un `Error` que cancela la ejecución.

---

### token-saver

Reduce el consumo de tokens truncando automáticamente la salida de comandos `bash` que son muy largos.

**Hook:** `tool.execute.after`  
**Export:** `TokenSaverPlugin`

**Comportamiento:** Si la salida del comando supera las 100 líneas, conserva las primeras 40 y las últimas 40, y reemplaza el resto con un resumen indicando cuántas líneas se truncaron.

**Ejemplo:**
```
línea 1
línea 2
...
línea 40
... (250 líneas truncadas para ahorrar tokens)
línea 291
línea 292
```

**Útil para:** `dir` / `ls -la` en directorios grandes, logs extensos, salidas de compilación, etc.

---

### session-viewer

Genera una vista HTML con todos los archivos modificados durante la sesión y la abre automáticamente en el browser.

**Hook:** `tool.execute.after` (`write`, `edit`)  
**Tool:** `session-viewer` (herramienta personalizada)  
**Export:** `SessionViewerPlugin`

**Cómo se usa:**
1. Durante la sesión, editas archivos normalmente
2. Cuando querés revisar todo, ejecutás:
   ```
   session-viewer
   ```
3. Se abre una página en el browser con:
   - Resumen: cantidad de archivos modificados
   - Lista de archivos con código syntax-highlighted
   - Vista numerada por llamada

**Ejemplo del HTML generado:**
```
┌─────────────────────────────────────┐
│  Session Viewer                     │
│  Archivos: 3    Vista: #1           │
├─────────────────────────────────────┤
│  src/index.ts (con highlight.js)    │
│  src/utils.ts                       │
│  src/styles.css                     │
└─────────────────────────────────────┘
```

**Nota:** La vista es estática (código final, no diff). Si necesitás diffs, usá `git diff`.

---

### browser-kit

Herramienta unificada para interactuar con la web y el browser desde opencode.

**Tool:** `browser` (herramienta personalizada)  
**Export:** `BrowserKitPlugin`

**Acciones disponibles:**

| Acción | Descripción | Argumentos |
|--------|-------------|------------|
| `fetch` | Descarga el contenido de una URL y lo devuelve como texto | `url` |
| `source` | Obtiene el HTML fuente de una página | `url` |
| `search` | Busca en la web usando DuckDuckGo y devuelve los primeros resultados | `query` |
| `preview` | Abre un archivo HTML local en el browser predeterminado | `file` |

**Ejemplos de uso:**
```
browser action=fetch url="https://ejemplo.com"
browser action=search query="open code plugins"
browser action=preview file="src/index.html"
browser action=source url="https://github.com"
```

**Nota:** `fetch` y `source` son equivalentes (ambos devuelven el contenido). `fetch` es útil para obtener texto plano, `source` para ver el HTML crudo. La diferenciación es semántica para que el LLM entienda mejor el contexto.

---

### web-nav

Panel de navegación web con dashboard visual y control desde opencode.

**Tool:** `web-nav` (herramienta personalizada)  
**Export:** `WebNavPlugin`

**Acciones disponibles:**

| Acción | Descripción |
|--------|-------------|
| `goto` | Abre una URL en el browser predeterminado |
| `fetch` | Descarga el contenido de una URL y lo devuelve en el chat |
| `dashboard` | Abre un dashboard HTML en el browser con historial y navegación visual |
| `history` | Muestra el historial de URLs visitadas en la sesión |

**Ejemplos:**
```
web-nav action=goto url="https://github.com"
web-nav action=fetch url="https://ejemplo.com"
web-nav action=dashboard
web-nav action=history
```

**Dashboard:** Al ejecutar `web-nav action=dashboard` se genera una página interactiva con:
- Barra de URL para navegar
- Historial de URLs visitadas en la sesión
- Accesos directos a sitios comunes
- Referencia de comandos para usar desde opencode

---

## Instalación

### Local (recomendado)

Copiar los plugins a la carpeta global de opencode:

```bash
cp *.js *.ts ~/.config/opencode/plugins/
```

O en la carpeta del proyecto:

```bash
cp *.js *.ts .opencode/plugins/
```

Luego **reiniciar opencode** para que los cargue.

### Via npm (cuando esté publicado)

Agregar a `opencode.json`:

```json
{
  "plugin": ["my-opencode-plugins"]
}
```

---

## Desarrollo

### Requisitos

- [opencode](https://opencode.ai) v0.1.0+
- Plugin SDK: `@opencode-ai/plugin`

### Estructura de un plugin

```js
export const MiPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      // Lógica antes de ejecutar una herramienta
    },
    "tool.execute.after": async (input, output) => {
      // Lógica después de ejecutar una herramienta
    },
  }
}
```

### Hooks disponibles

| Hook | Momento |
|------|---------|
| `tool.execute.before` | Antes de ejecutar cualquier herramienta (read, write, bash, etc.) |
| `tool.execute.after` | Después de ejecutar cualquier herramienta |
| `shell.env` | Antes de iniciar un shell, permite inyectar variables de entorno |

---

## Versiones

| Versión | Cambios |
|---------|---------|
| 0.1.0   | Versión inicial: log-prefix + console-logger |
| 0.2.0   | log-prefix: agrega timestamp al prefijo |
| 0.3.0   | console-logger: logs agrupados por sesión |
| 0.4.0   | nuevo plugin: command-guard |
| 0.5.0   | documentación completa en README |
| 0.6.0   | nuevo plugin: token-saver |
| 0.7.0   | nuevo plugin: session-viewer |
| 0.8.0   | nuevo plugin: browser-kit |
| 0.9.0   | nuevo plugin: web-nav (dashboard visual de navegación) |

---

## Credits

Desarrollado por **Lucas M. Vicente**

---

## Licencia

MIT
