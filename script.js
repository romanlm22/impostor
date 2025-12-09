// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE (REQUERIDO) ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';
// ASEGÚRATE DE REEMPLAZAR ESTAS CONSTANTES CON TUS CREDENCIALES
// =========================================================

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- BASE DE DATOS DE TEMAS ---
const data = {
    futbol: ["Delantero Centro", "Fuera de Juego", "El Var", "Tarjetas Amarillas", "El Clásico"],
    deportes: ["Cancha de Tenis", "Pelota de Baloncesto", "Nado Sincronizado", "Maratón"],
    trabajos: ["Bombero", "Cartero", "Chef de Cocina", "Arquitecto", "Veterinario"],
    comida: ["Sopa de Tomate", "Sushi Roll", "Taco Mexicano", "Pizza Napolitana"],
};

// --- VARIABLES DE ESTADO ---
let salaActual = null;
let nombreJugador = '';
let categoriaSeleccionada = '';
let esHost = false;
let supabaseSubscription = null; // Para guardar la referencia de la suscripción Realtime

// --- REFERENCIAS DEL DOM ---
const pantallas = {
    inicio: document.getElementById('inicio-pantalla'),
    crear: document.getElementById('panel-crear'),
    unirse: document.getElementById('panel-unirse'),
    sala: document.getElementById('sala-pantalla'),
    rol: document.getElementById('rol-pantalla'),
    juego: document.getElementById('juego-pantalla')
};
const selectCategorias = document.getElementById('select-categorias');


// =========================================================
// I. GESTIÓN DE PANTALLAS (UX)
// =========================================================

/**
 * Muestra solo el panel solicitado, ocultando todos los demás.
 * @param {string} nombrePanel - Clave del panel a mostrar ('inicio', 'crear', 'sala', etc.)
 */
function mostrarPanel(nombrePanel) {
    Object.values(pantallas).forEach(panel => {
        if (panel) panel.classList.add('hidden');
    });
    if (pantallas[nombrePanel]) {
        pantallas[nombrePanel].classList.remove('hidden');
    }
}

function mostrarPanelInicio() {
    mostrarPanel('inicio');
}
function mostrarPanelCrear() {
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador) return alert('Por favor, ingresa tu nombre primero.');
    mostrarPanel('crear');
}
function mostrarPanelUnirse() {
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador) return alert('Por favor, ingresa tu nombre primero.');
    mostrarPanel('unirse');
}

/**
 * Carga los botones de categoría al iniciar la página.
 */
function cargarCategorias() {
    Object.keys(data).forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = key.toUpperCase();
        btn.classList.add('categoria-btn');
        btn.onclick = () => seleccionarCategoria(key, btn);
        selectCategorias.appendChild(btn);
    });
}

/**
 * Maneja la selección de una categoría.
 */
function seleccionarCategoria(key, element) {
    categoriaSeleccionada = key;
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    element.classList.add('selected');
}

// =========================================================
// II. GESTIÓN DE SALAS (SUPABASE REALTIME)
// =========================================================

/** Genera un código de sala de 6 letras. */
function generarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Host: Crea la sala en Supabase.
 */
async function crearSala() {
    if (!categoriaSeleccionada) return alert('Selecciona una categoría.');
    
    const codigo = generarCodigo();
    const jugadorId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    const { data: nuevaSala, error } = await supabase
        .from('salas')
        .insert({
            codigo: codigo,
            estado: 'ESPERA',
            categoria: categoriaSeleccionada, // Guarda la categoría
            tema: '', 
            jugadores: [{ id: jugadorId, nombre: nombreJugador, esHost: true, rol: 'PENDIENTE' }]
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
    mostrarSalaEspera(codigo, categoriaSeleccionada);
    iniciarSuscripcionSala(codigo);
}

/**
 * Jugador: Se une a una sala existente.
 */
async function unirseSala() {
    const codigo = document.getElementById('codigo-sala-input').value.trim().toUpperCase();
    if (!codigo) return alert('Ingresa el código de la sala.');
    
    const jugadorId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // 1. Obtener la sala
    let { data: sala, error } = await supabase
        .from('salas')
        .select('id, jugadores, estado, categoria')
        .eq('codigo', codigo)
        .single();

    if (error || !sala) return alert('Código de sala no válido o sala no encontrada.');
    if (sala.estado !== 'ESPERA') return alert('La partida ya ha comenzado.');
    if (sala.jugadores.length >= 10) return alert('La sala está llena (máx. 10 jugadores).');

    // 2. Agregar el nuevo jugador
    const nuevoJugador = { id: jugadorId, nombre: nombreJugador, esHost: false, rol: 'PENDIENTE' };
    const jugadoresActualizados = [...sala.jugadores, nuevoJugador];

    const { error: updateError } = await supabase
        .from('salas')
        .update({ jugadores: jugadoresActualizados })
        .eq('id', sala.id);

    if (updateError) {
        console.error('Error al unirse:', updateError);
        return alert('Error al unirse a la sala.');
    }

    salaActual = sala; // Se actualizará completamente vía Realtime
    esHost = false;
    mostrarSalaEspera(codigo, sala.categoria);
    iniciarSuscripcionSala(codigo);
}

/**
 * Muestra la interfaz de sala de espera y actualiza displays.
 */
function mostrarSalaEspera(codigo, categoria) {
    mostrarPanel('sala');
    document.getElementById('codigo-sala-display').textContent = codigo;
    document.getElementById('categoria-sala-display').textContent = `Categoría elegida: ${categoria.toUpperCase()}`;
}

// =========================================================
// III. REALTIME: SUSCRIPCIÓN Y ACTUALIZACIÓN
// =========================================================

/**
 * Inicia la escucha en tiempo real de los cambios en la sala.
 */
function iniciarSuscripcionSala(codigo) {
    if (supabaseSubscription) {
        supabase.removeChannel(supabaseSubscription); // Limpiar suscripción anterior
    }

    supabaseSubscription = supabase
        .channel(`sala-${codigo}`)
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` }, 
            (payload) => {
                manejarCambioSala(payload.new);
            }
        )
        .subscribe();
}

/**
 * Maneja los cambios de estado y datos de la sala recibidos en tiempo real.
 */
function manejarCambioSala(nuevaSala) {
    salaActual = nuevaSala;
    
    actualizarListaJugadores(nuevaSala.jugadores);

    if (nuevaSala.estado === 'EN_JUEGO') {
        asignarRolLocal(nuevaSala.tema, nuevaSala.jugadores);
        // La función de asignar rol maneja el cambio a la pantalla 'rol'
    } else if (nuevaSala.estado === 'ESPERA') {
        mostrarPanel('sala');
        document.getElementById('categoria-sala-display').textContent = `Categoría elegida: ${nuevaSala.categoria.toUpperCase()}`;
    }
    // ... Lógica para manejar 'VOTACION' y 'FINALIZADO' ...
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
        li.innerHTML = `
            <span>${j.nombre}</span>
            <span style="font-size: 0.8em; color: ${j.esHost ? 'var(--color-principal)' : '#888'};">
                ${j.esHost ? 'HOST' : ''}
            </span>
        `;
        lista.appendChild(li);
    });

    document.getElementById('count-jugadores').textContent = jugadores.length;
    
    // Mostrar/Ocultar botón de Inicio
    const btnIniciar = document.getElementById('iniciar-juego-btn');
    if (btnIniciar) {
        btnIniciar.style.display = (esHost && jugadores.length >= 4) ? 'block' : 'none';
    }
}

// =========================================================
// IV. LÓGICA DEL JUEGO
// =========================================================

/**
 * Host: Inicia la partida, selecciona tema y asigna el impostor.
 */
async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 4) return alert("Necesitas al menos 4 jugadores para iniciar.");
    
    // 1. Asignar Tema e Impostor
    const temas = data[salaActual.categoria]; 
    const tema = temas[Math.floor(Math.random() * temas.length)];
    const impostorIndex = Math.floor(Math.random() * salaActual.jugadores.length);
    
    // 2. Asignar roles a los jugadores
    const jugadoresAsignados = salaActual.jugadores.map((j, index) => ({
        ...j,
        rol: (index === impostorIndex) ? 'IMPOSTOR' : 'NORMAL'
    }));
    
    // 3. Actualizar el estado en Supabase (Dispara el Realtime a todos)
    const { error } = await supabase
        .from('salas')
        .update({
            estado: 'EN_JUEGO',
            tema: tema,
            jugadores: jugadoresAsignados
        })
        .eq('id', salaActual.id);

    if (error) console.error('Error al iniciar juego:', error);
}

/**
 * Asigna el rol al jugador localmente (activado por el evento Realtime).
 */
function asignarRolLocal(temaGlobal, jugadores) {
    const miJugador = jugadores.find(j => j.nombre === nombreJugador); 
    
    if (!miJugador) return;

    mostrarPanel('rol');
    
    const rolCard = document.getElementById('rol-asignado');
    const rolNombreDisplay = document.getElementById('rol-nombre');
    const rolInstruccionDisplay = document.getElementById('rol-instruccion');

    if (miJugador.rol === 'IMPOSTOR') {
        rolNombreDisplay.textContent = "¡IMPOSTOR!";
        rolInstruccionDisplay.textContent = "¡No conoces la palabra! Disimula y adivina el tema para ganar.";
        rolCard.className = 'card impostor-rol'; // Clase para color rojo
    } else {
        rolNombreDisplay.textContent = temaGlobal.toUpperCase();
        rolInstruccionDisplay.textContent = "¡Conoces la palabra secreta! Descubre quién de los demás está mintiendo.";
        rolCard.className = 'card normal-rol'; // Clase para color verde
    }

    // Transicionar automáticamente a la pantalla de juego después de unos segundos
    let countdown = 5;
    const interval = setInterval(() => {
        document.getElementById('cuenta-regresiva-rol').textContent = `El juego comienza en ${countdown}...`;
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            mostrarPanel('juego');
            document.getElementById('juego-categoria-display').textContent = salaActual.categoria.toUpperCase();
            // Mostrar botón de votar solo al host (ejemplo)
            if (esHost) document.getElementById('btn-activar-voto').style.display = 'block';
        }
    }, 1000);
}


// =========================================================
// V. INICIALIZACIÓN
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    mostrarPanel('inicio');
});

// Nota: La lógica de Votación, Temporizador y Final de Partida debe ser añadida
// siguiendo el mismo patrón de actualización de estado en la tabla 'salas' de Supabase.

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