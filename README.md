# 🕵️‍♂️ Impostor Online

Micro juego de navegador estilo "Impostor": todos los jugadores reciben una palabra secreta de una categoría, excepto uno (el impostor), que solo conoce la categoría. Hay que descubrir quién es el impostor hablando por turnos y votando.

Desarrollado con HTML, CSS y JavaScript puro, usando [Supabase](https://supabase.com) como base de datos y para la sincronización en tiempo real.

## ✨ Características

- **Dos modos de juego**
  - 🎮 **Online**: cada jugador se une desde su dispositivo con un código de sala.
  - 🧍‍♂️ **En Persona**: un solo dispositivo; se pasa el teléfono y cada jugador mira su rol por turnos (12 segundos para memorizarlo).
- **Tres formas de elegir palabra**
  - 🎲 Aleatorio (categoría y palabra al azar)
  - 📚 Manual (elegís la categoría)
  - ✏️ Crear (tu propia categoría y lista de palabras separadas por comas)
- Palabras con imagen de pista opcional.
- Salas con código de 6 caracteres.
- Sincronización en tiempo real entre jugadores (Supabase Realtime).
- Fase de debate con timer y fase de votación.

## 🗂️ Estructura

```
├── index.html   # Pantallas e interfaz
├── style.css    # Estilos
└── script.js    # Lógica del juego y conexión con Supabase
```

## 🚀 Puesta en marcha

### 1. Crear el proyecto en Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor** ejecutá:

```sql
create table if not exists public.salas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  estado text default 'ESPERA',
  modo_juego text,
  categoria text,
  tema text,
  tema_imagen text,
  jugadores jsonb default '[]'::jsonb
);

alter table public.salas enable row level security;

create policy "salas select" on public.salas
  for select to anon, authenticated using (true);

create policy "salas insert" on public.salas
  for insert to anon, authenticated with check (true);

create policy "salas update" on public.salas
  for update to anon, authenticated using (true) with check (true);

create policy "salas delete" on public.salas
  for delete to anon, authenticated using (true);

alter publication supabase_realtime add table public.salas;
```

### 2. Configurar las credenciales

En `script.js`, reemplazá los valores con los de **Settings → API** de tu proyecto:

```js
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_CLAVE_ANON_O_PUBLISHABLE';
```

### 3. Ejecutar

Abrí `index.html` en el navegador, o servilo con cualquier servidor estático (por ejemplo, la extensión Live Server de VS Code, o GitHub Pages).

## 🎯 Cómo se juega

1. Ingresá tu nombre.
2. **Crear sala**: elegí el modo y la categoría, y compartí el código con los demás. **Unirse**: ingresá el código.
3. El host inicia la partida. Cada jugador ve la palabra, excepto el impostor, que solo ve que lo es.
4. Hablen por turnos dando pistas sobre la palabra sin nombrarla.
5. Al terminar el debate, se vota. Si descubren al impostor, ganan los jugadores; si no, gana el impostor.

## ⚠️ Notas

- Los proyectos gratuitos de Supabase se **pausan tras ~7 días sin actividad**. Si el juego deja de funcionar, entrá al panel y usá **Restore project**.
- Las políticas de ejemplo permiten leer y escribir salas a cualquiera que tenga la clave pública. Es adecuado para un juego casual; para algo más serio conviene agregar autenticación.
- Evitá incrustar imágenes en base64 dentro de `script.js`; es mejor guardarlas en una carpeta `img/` y referenciarlas por ruta.

## 📄 Licencia

Proyecto personal de uso libre. Añadí la licencia que prefieras (por ejemplo MIT).
