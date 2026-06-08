# my-opencode-plugins

**v0.4.0** — Plugins para [opencode](https://opencode.ai).

## Plugins

| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `log-prefix` | `log-prefix.js` | Intercepta cada comando `bash` y le antepone el prefijo `[OPENCODE HH:MM:SS] Ejecutando:` con timestamp para visualizar claramente qué se ejecuta y cuándo. |
| `console-logger` | `console-logger.ts` | Escucha la ejecución de comandos `bash` y guarda todos los comandos de una misma sesión en un único archivo de log, numerados por orden de ejecución, con timestamp y salida. Los logs se almacenan en `~/opencode-logs/session_*.log`. |
| `command-guard` | `command-guard.js` | Bloquea comandos peligrosos (`rm -rf /`, `format`, `diskpart`, `Remove-Item -Recurse -Force` sobre rutas del sistema, etc.) lanzando un error antes de que se ejecuten. |

## Versiones

| Versión | Cambios |
|---------|---------|
| 0.1.0   | Versión inicial: log-prefix + console-logger |
| 0.2.0   | log-prefix: agrega timestamp al prefijo |
| 0.3.0   | console-logger: logs agrupados por sesión |
| 0.4.0   | nuevo plugin: command-guard |

## Uso

Copiar a la carpeta de plugins de opencode:

```bash
cp *.js *.ts ~/.config/opencode/plugins/
```

O desde npm (cuando esté publicado):

```json
{
  "plugin": ["my-opencode-plugins"]
}
```

## Credits

Desarrollado por **Lucas M. Vicente**
