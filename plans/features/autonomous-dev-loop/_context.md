# Autonomous Dev Loop

**Status:** planned
**Priority:** critical

## ¿Qué es esto?

El feature core que convierte Speedy de un "IDE sin editor" en un **equipo de desarrollo que trabaja mientras duermes**.

La idea es simple: Charizard (el agente de OpenClaw) corre en el VPS 24/7. Con un cron job activo, revisa periódicamente los proyectos registrados en Speedy, detecta tickets disponibles, despacha trabajo a Perro salchicha (Claude Code), y te manda un informe de lo que hizo. **Tú defines qué construir. El agente lo ejecuta.**

No es un agente que adivina — es un agente orquestado que sigue las reglas del sistema: tickets bien definidos, cola sin conflictos de archivos, revert ante errores, bloqueado si no entiende.

---

## ¿Cómo funciona?

### El loop completo (noche típica)

```
23:00 — Juan define tickets en Speedy y se va a dormir
         ↓
Cada N minutos — Cron dispara a Charizard
         ↓
Charizard consulta Convex → ¿hay tickets en `todo` con localPath configurado?
         ↓
      SÍ → Analiza dependencias de archivos entre tickets pendientes
           → Encola en orden (nada en paralelo que toque los mismos archivos)
           → Despacha Perro salchicha con el primer ticket
           → Perro trabaja: código → commit → push → PR → status: review
           ↓
      NO (todo blocked) → Charizard notifica a Juan en Slack:
           "Nada que hacer — estos tickets están bloqueados: [lista]. Necesito tu input."
         ↓
08:00 — Juan recibe informe en Slack:
         "Trabajé en [proyecto X]: completé [ticket A] y [ticket B].
          [Ticket C] quedó blocked: razón. [Ticket D] en review: link al PR."
```

---

## Reglas de operación

### Charizard (planning layer)
- Antes de despachar, analiza qué archivos toca cada ticket
- **Nada en paralelo que toque los mismos archivos** — cola estricta
- Si dos tickets tocan `ChatPanel.tsx`, van secuenciales, no simultáneos
- Si todos los tickets disponibles están bloqueados → notifica a Juan, no adivina

### Perro salchicha (execution layer)
- Si el ticket no está claro → marca `blocked` inmediatamente, no interpreta
- Si algo se rompe en ejecución → `git revert` + ticket a `blocked` con nota de por qué
- **Nunca pushea código roto** — revert es siempre la salida segura
- Siempre termina en `review`, nunca en `completed` (Juan revisa y aprueba)

### Tests como red de seguridad
- Una vez que el feature de Chat quede terminado, se agrega test coverage
- Los tests son la capa que permite a Perro salchicha saber si rompió algo
- Sin tests → el agente opera a ciegas. Con tests → puede validar antes de pushear

---

## Informe diario

**Cuándo:** configurado como cron en OpenClaw (ej: 8:00 AM Bogotá)  
**Dónde:** Slack — canal específico por proyecto (campo `slackChannel` en Convex)  
**Fallback:** canal default de Slack si el proyecto no tiene canal configurado

**Formato del informe:**
```
🤖 Autonomous Dev Loop — Reporte nocturno

📁 speedy-gonzales
  ✅ Completado → ticket-foo (PR: link)
  🔄 En review → ticket-bar (PR: link)
  🚫 Bloqueado → ticket-baz — razón: dependencia no declarada

📁 action-experience
  ✅ Completado → ticket-qux (PR: link)

⚠️ Necesito tu input:
  - ticket-baz en speedy-gonzales está bloqueado. ¿Desbloqueo?
```

---

## Configuración de proyectos activos

**Source of truth: Convex**

Cada proyecto en Speedy tiene:
- `localPath` → ruta en el VPS donde está clonado el repo (ej: `/home/juan/Projects/speedy-gonzales`)
- `slackChannel` → canal de Slack para notificaciones (ej: `#speedy-gonzales`)
- `autonomousLoop: boolean` → si está activado o no para este proyecto

Charizard solo trabaja en proyectos con `autonomousLoop: true` y `localPath` configurado.

**Configuración en OpenClaw:**  
Cron job en `openclaw.json` que dispara el loop. La selección de proyectos viene de la DB — no hay lista hardcodeada en el agente.

---

## ¿Speedy local vs Speedy cloud?

### TL;DR: **Speedy vive en la nube. Siempre.**

Speedy Gonzales es una app cloud-first. No está diseñada para correr local como flujo de trabajo normal.

**¿Por qué?**
- Convex es cloud — no hay modo local real
- El autonomous loop corre en el VPS de OpenClaw — requiere conexión
- Las notificaciones van a Slack — requiere internet
- Los PRs se abren en GitHub — requiere internet
- El informe llega a Slack — requiere internet

**¿Cuándo tiene sentido correrlo local?**

Un solo caso: **cuando Speedy mismo tiene un bug que necesitas reproducir con devtools abierto**.

Y eso incluye una aclaración importante:

> **Juan, que está constantemente desarrollando Speedy, nunca usa el entorno local.**
> Speedy se autodesarrolla en la nube. El flujo es:
> Juan describe el ticket en Speedy (cloud) → Perro salchicha implementa → Vercel preview → Juan revisa en la URL → merge.

Podrías en teoría correr `npm run dev` localmente, pero estarías conectándote a la misma Convex cloud de todas formas — así que lo "local" sería solo el frontend de Next.js. No vale la pena salvo que el bug sea específicamente en el frontend y no se reproduzca en la preview.

**Recomendación oficial:** Speedy local = debuggear Speedy. Nada más.

---

## Success rate esperado

| Tipo de ticket | % éxito autónomo |
|---|---|
| UI components (Tailwind + shadcn) | ~85% |
| Convex mutations / queries | ~75% |
| Features de integración (Convex + UI) | ~65% |
| Debugging bugs conocidos | ~50% |
| Debugging bugs vagos | ~25% |

**Promedio general: ~70% de tickets se completan solos overnight.**

El 30% restante termina en `blocked` con una nota clara de por qué — y Juan lo resuelve al día siguiente.

---

## Tickets de implementación

- [ ] Campo `autonomousLoop` y `slackChannel` en schema de Convex
- [ ] Campo `localPath` en proyectos (o config en OpenClaw)
- [ ] Cron job en OpenClaw que dispara Charizard cada N minutos
- [ ] Lógica de Charizard: leer proyectos activos → analizar dependencias → encolar tickets
- [ ] Integración Slack: informe diario por canal
- [ ] UI en Speedy: toggle "Autonomous Loop" por proyecto
- [ ] Notificación de bloqueo (cuando todos los tickets están bloqueados)
