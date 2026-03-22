# Context Window — Cómo funciona en Speedy Gonzales

## TL;DR

El **context window** es la memoria activa del modelo en una sola llamada al API. No es lo mismo que el historial del chat — son dos cosas distintas.

---

## Las dos capas de memoria

| Capa | Qué es | Límite | Persistencia |
|------|--------|--------|-------------|
| **Chat Memory** | `speedy-speedy-gonzales.md` — notas curadas del agente | Sin límite práctico | Permanente entre sesiones |
| **Context Window** | Lo que el modelo *ve activamente* en la llamada actual | 200,000 tokens (Claude) | Solo durante esa llamada |

### Chat Memory (permanente)
Charizard actualiza un archivo de memoria en cada sesión. La próxima vez que inicies el chat, ese contexto se inyecta en el system message. Esto garantiza que el agente **siempre recuerde** decisiones, arquitectura, preferencias y convenciones del proyecto.

### Context Window (por llamada)
Cada vez que mandas un mensaje, se construye un payload que incluye:
1. **System message** — proyecto, repo, tickets, plan, archivo activo
2. **Historial reciente** — últimos 12 mensajes (truncados a 600 chars cada uno)
3. **Tu mensaje nuevo**

Todo eso junto no puede superar los 200k tokens.

---

## El indicador de tokens en el header

```
🟢 4.2k / 200k tokens
```

El dot de color te indica qué porcentaje del context window está en uso:

| Color | Rango | Qué significa |
|-------|-------|---------------|
| 🟢 Verde | < 50% | Todo bien, contexto amplio disponible |
| 🟡 Amarillo | 50–80% | Contexto a la mitad — ojo si hay mensajes muy largos |
| 🔴 Rojo | > 80% | Contexto casi lleno — el modelo puede degradar |

> **Nota:** los tokens que se muestran son una suma acumulada del historial guardado en Convex. El modelo solo recibe los últimos 12 mensajes, así que el número real enviado al API es menor.

---

## ¿Qué pasa cuando el contexto se llena?

El modelo no tiene acceso a los mensajes más antiguos de esa llamada. Puede:
- Repetir información que ya estableciste
- Perder track de instrucciones del inicio de la conversación
- Respuestas menos coherentes con el hilo

**Solución:** la **Chat Memory** está exactamente para esto. Lo importante se guarda en el archivo de memoria y se re-inyecta en cada llamada nueva — así el agente no depende de tener todo el historial en el context window.

---

## Historial windowing

Por diseño, se envían solo los **últimos 12 mensajes** al API, truncados a 600 chars cada uno. Esto:
- Mantiene el payload pequeño y rápido
- Evita llenar el context window con conversaciones largas
- Prioriza el contexto reciente (que es lo más relevante)

Si necesitas que algo se recuerde más allá del historial inmediato → díselo al agente explícitamente para que lo guarde en memoria.

---

## Flujo completo de una llamada

```
Tu mensaje
    ↓
/api/chat (Next.js route)
    ↓
System message:
  - Proyecto, repo, branch
  - Lista de tickets con status
  - Plan content (truncado)
  - Archivo activo (si hay code view abierto)
  - Chat Memory (notas del agente)
    ↓
Historial: últimos 12 msgs (600 chars c/u)
    ↓
POST /v1/chat/completions → OpenClaw (Charizard)
    ↓
SSE streaming → token a token en UI
    ↓
Guardado en Convex con tokenCount
```

---

## Relacionado

- [Token Counter ticket](./token-counter.md)
- [Context Window Optimization ticket](./context-window-optimization.md)
- [Chat Memory ticket](./chat-memory.md)
- [Agent Context Injection ticket](./agent-context.md)
