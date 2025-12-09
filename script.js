// CONFIGURACIÓN: Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Base de Datos de Temas (Igual que antes) ---
const data = { /* ... (Tus categorías de fútbol, deportes, trabajos, etc.) ... */ };

// --- Variables Globales ---
let salaActual = null;
let nombreJugador = '';
let temaAsignado = '';
let esHost = false;

// --- Elementos del DOM (Añadiremos los nuevos) ---
const inicioPantalla = document.getElementById('inicio-pantalla');
const juegoPantalla = document.getElementById('juego-pantalla');
const salaPantalla = document.getElementById('sala-pantalla'); // Nueva
const rolPantalla = document.getElementById('rol-pantalla');   // Nueva

// 1. Setup Inicial
document.addEventListener('DOMContentLoaded', () => {
    // 1.1 Iniciar categorías (como antes)
    cargarCategorias();
    
    // 1.2 Añadir nuevos campos de interfaz (ej. nombre de jugador)
    // Este código asume que has añadido inputs para 'nombre-jugador', 'codigo-sala', etc., en tu HTML.
    
    // 1.3 Mostrar la interfaz de login/salas
    mostrarPantalla('inicio');
});

// --- Funciones de Interfaz ---

/** Muestra la pantalla correcta y oculta las demás */
function mostrarPantalla(nombre) {
    inicioPantalla.style.display = 'none';
    juegoPantalla.style.display = 'none';
    if (salaPantalla) salaPantalla.style.display = 'none';
    if (rolPantalla) rolPantalla.style.display = 'none';

    switch(nombre) {
        case 'inicio': inicioPantalla.style.display = 'block'; break;
        case 'sala': salaPantalla.style.display = 'block'; break;
        case 'rol': rolPantalla.style.display = 'block'; break;
        case 'juego': juegoPantalla.style.display = 'block'; break;
    }
}

// --- Funciones de Lógica de Salas ---

/** * Genera un código de sala aleatorio de 6 caracteres.
 * @returns {string} Código alfanumérico.
 */
function generarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * El host crea una nueva sala en Supabase.
 */
async function crearSala() {
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador) return alert('Debes ingresar un nombre.');

    const categoria = categoriaSeleccionada;
    if (!categoria) return alert('Selecciona una categoría.');

    const codigo = generarCodigo();
    
    const { data: nuevaSala, error } = await supabase
        .from('salas')
        .insert({
            codigo: codigo,
            estado: 'ESPERA',
            tema: '', // Se asigna al iniciar
            jugadores: [{ id: Math.random(), nombre: nombreJugador, esHost: true }]
        })
        .select()
        .single();

    if (error) {
        console.error('Error al crear sala:', error);
        alert('Error al crear la sala. Inténtalo de nuevo.');
        return;
    }

    salaActual = nuevaSala;
    esHost = true;
    mostrarPantalla('sala');
    document.getElementById('codigo-sala-display').textContent = codigo;
    iniciarSuscripcionSala(codigo);
}

/**
 * Unirse a una sala existente mediante código.
 */
async function unirseSala() {
    const codigo = document.getElementById('codigo-sala-input').value.trim().toUpperCase();
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador || !codigo) return alert('Ingresa tu nombre y el código.');

    // 1. Obtener la sala
    const { data: sala, error } = await supabase
        .from('salas')
        .select('id, jugadores, estado')
        .eq('codigo', codigo)
        .single();

    if (error || !sala) {
        alert('Código de sala no válido o sala no encontrada.');
        return;
    }
    if (sala.estado !== 'ESPERA') {
        alert('La partida ya ha comenzado.');
        return;
    }

    // 2. Agregar el nuevo jugador
    const nuevoJugador = { id: Math.random(), nombre: nombreJugador, esHost: false };
    const jugadoresActualizados = [...sala.jugadores, nuevoJugador];

    const { error: updateError } = await supabase
        .from('salas')
        .update({ jugadores: jugadoresActualizados })
        .eq('id', sala.id);

    if (updateError) {
        console.error('Error al unirse:', updateError);
        return;
    }

    salaActual = sala;
    esHost = false;
    mostrarPantalla('sala');
    iniciarSuscripcionSala(codigo);
}

// --- Realtime y Sincronización ---

/**
 * Inicia la suscripción en tiempo real a los cambios en la sala.
 */
function iniciarSuscripcionSala(codigo) {
    supabase
        .channel(`sala-${codigo}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` }, (payload) => {
            manejarCambioSala(payload.new);
        })
        .subscribe();
}

/**
 * Maneja los cambios de estado y datos de la sala.
 */
function manejarCambioSala(nuevaSala) {
    salaActual = nuevaSala;
    actualizarListaJugadores(nuevaSala.jugadores);

    if (nuevaSala.estado === 'EN_JUEGO') {
        asignarRolLocal(nuevaSala.tema);
        mostrarPantalla('rol');
    }
    // Implementar lógica para FIN_DE_JUEGO
}

/**
 * Actualiza la lista de jugadores en la interfaz de la sala de espera.
 */
function actualizarListaJugadores(jugadores) {
    const lista = document.getElementById('lista-jugadores');
    if (!lista) return;

    lista.innerHTML = '';
    jugadores.forEach(j => {
        const li = document.createElement('li');
        li.textContent = `${j.nombre} ${j.esHost ? '(Host)' : ''}`;
        lista.appendChild(li);
    });

    // Mostrar/Ocultar botón de Inicio si eres el Host y hay suficientes jugadores
    const btnIniciar = document.getElementById('iniciar-juego-btn');
    if (btnIniciar) {
        btnIniciar.style.display = (esHost && jugadores.length >= 4) ? 'block' : 'none';
    }
}

// --- Lógica del Juego (Iniciada por el Host) ---

/**
 * El Host inicia la partida, selecciona el tema y asigna el impostor.
 */
async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 4) {
        alert("Necesitas al menos 4 jugadores para iniciar.");
        return;
    }

    // 1. Asignar Tema e Impostor
    const temas = data[categoriaSeleccionada]; 
    const tema = temas[Math.floor(Math.random() * temas.length)];
    const impostorIndex = Math.floor(Math.random() * salaActual.jugadores.length);
    
    // 2. Actualizar el estado de la sala y jugadores
    const jugadoresAsignados = salaActual.jugadores.map((j, index) => ({
        ...j,
        rol: (index === impostorIndex) ? 'IMPOSTOR' : 'NORMAL'
    }));
    
    const { error } = await supabase
        .from('salas')
        .update({
            estado: 'EN_JUEGO',
            tema: tema,
            jugadores: jugadoresAsignados // Guardamos el rol en la BD
        })
        .eq('id', salaActual.id);

    if (error) {
        console.error('Error al iniciar juego:', error);
    }
    // El cambio de estado activa 'manejarCambioSala' en todos los clientes.
}

/**
 * Asigna el rol al jugador localmente después de que el juego comienza.
 */
function asignarRolLocal(tema) {
    // Buscar mi propio jugador en la lista actualizada de la sala
    const miJugador = salaActual.jugadores.find(j => j.nombre === nombreJugador); 
    
    if (miJugador && miJugador.rol === 'IMPOSTOR') {
        temaAsignado = '¡IMPOSTOR!';
        // Actualizar la interfaz de rol para el Impostor (color rojo)
    } else {
        temaAsignado = tema.toUpperCase();
        // Actualizar la interfaz de rol para el Normal (color verde, tema)
    }

    // Aquí iría el código para mostrar la tarjeta de Rol individual
    // ... (Usar la lógica de la tarjeta del JS anterior)
    
    // Después de que el jugador ve su rol, pasar a la pantalla de Juego/Discusión
    setTimeout(() => {
        mostrarPantalla('juego');
        document.getElementById('tema-revelado-juego').textContent = `Categoría: ${categoriaSeleccionada.toUpperCase()}`;
    }, 5000); // Dar 5 segundos para que vean el rol
}

// *** IMPORTANTE: Necesitas adaptar la estructura HTML para incluir las pantallas:
// 1. Pantalla de Sala de Espera (`sala-pantalla`): Muestra el código, la lista de jugadores y el botón "Iniciar Juego" (solo para el host).
// 2. Pantalla de Rol Asignado (`rol-pantalla`): Muestra al jugador su rol/tema individual.
// 3. Pantalla de Juego/Discusión (`juego-pantalla`): Muestra el tiempo, la categoría y el botón para terminar la votación.

// Los botones "Crear Sala" y "Unirse a Sala" en tu HTML deben llamar a:
// <button onclick="crearSala()">Crear Sala</button>
// <button onclick="unirseSala()">Unirse a Sala</button>