# my-opencode-plugins

**v0.6.0** — Plugins para [opencode](https://opencode.ai).

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

---

## Credits

Desarrollado por **Lucas M. Vicente**

---

## Licencia

MIT
