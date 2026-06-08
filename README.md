# my-opencode-plugins

Plugins para [opencode](https://opencode.ai).

## Plugins

| Plugin | Descripción |
|--------|-------------|
| `log-prefix` | Agrega el prefijo `[OPENCODE] Ejecutando:` a cada comando bash |
| `console-logger` | Guarda automáticamente cada comando bash ejecutado y su salida en logs |
| `console-logger.ts` | Versión TypeScript con logging detallado de cada comando ejecutado |

## Uso

Copiar a la carpeta de plugins de opencode:

```bash
cp *.js *.ts ~/.config/opencode/plugins/
```

O instalarlo desde npm (cuando esté publicado):

```json
{
  "plugin": ["my-opencode-plugins"]
}
```

## Credits

Desarrollado por **Lucas M. Vicente**
