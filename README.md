# my-opencode-plugins

**v0.1.0** — Plugins para [opencode](https://opencode.ai).

## Plugins

| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `log-prefix` | `log-prefix.js` | Intercepta cada comando `bash` y le antepone el prefijo `[OPENCODE] Ejecutando:` para visualizar claramente qué se está ejecutando. |
| `console-logger` | `console-logger.ts` | Escucha la ejecución de comandos `bash` y guarda automáticamente cada comando junto con su salida en archivos de log individuales con timestamp. Los logs se almacenan en `~/opencode-logs/`. |

## Versiones

| Versión | Cambios |
|---------|---------|
| 0.1.0   | Versión inicial: log-prefix + console-logger |

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
