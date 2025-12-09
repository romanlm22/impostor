// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE (REQUERIDO) ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

// 1. CREACIÓN DEL CLIENTE
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- BASE DE DATOS DE TEMAS ---
const data = {
    futbol: ["Delantero Centro", "Fuera de Juego", "El Var", "Tarjetas Amarillas", "El Clásico", "Penal", "Mano de Dios", "Gol de Oro"],
    deportes: ["Cancha de Tenis", "Pelota de Baloncesto", "Nado Sincronizado", "Maratón", "Boxeo", "Golf", "Rugby"],
    trabajos: ["Bombero", "Cartero", "Chef de Cocina", "Arquitecto", "Veterinario", "Programador", "Dentista"],
    comida: ["Sopa de Tomate", "Sushi Roll", "Taco Mexicano", "Pizza Napolitana", "Hamburguesa", "Paella", "Ceviche"],
};

// ====================================================
// 2. DECLARACIÓN DE VARIABLES DE ESTADO
// ====================================================
let salaActual = null;
let nombreJugador = ''; 
let categoriaSeleccionada = '';
let esHost = false;
let supabaseSubscription = null;

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
// I. GESTIÓN DE PANTALLAS
// =========================================================

function mostrarPanel(nombrePanel) {
    Object.values(pantallas).forEach(panel => {
        if (panel) panel.classList.add('hidden');
    });
    if (pantallas[nombrePanel]) {
        pantallas[nombrePanel].classList.remove('hidden');
    }
}

function mostrarPanelInicio() { mostrarPanel('inicio'); }

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

function cargarCategorias() {
    selectCategorias.innerHTML = ''; // Limpiar por si acaso
    Object.keys(data).forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = key.toUpperCase();
        btn.classList.add('categoria-btn');
        btn.onclick = () => seleccionarCategoria(key, btn);
        selectCategorias.appendChild(btn);
    });
}

function seleccionarCategoria(key, element) {
    categoriaSeleccionada = key;
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    element.classList.add('selected');
}

// =========================================================
// II. GESTIÓN DE SALAS (SUPABASE)
// =========================================================

function generarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function crearSala() {
    if (!categoriaSeleccionada) return alert('Selecciona una categoría.');
    
    const codigo = generarCodigo();
    const jugadorId = Date.now().toString(36);

    const { data: nuevaSala, error } = await supabaseClient
        .from('salas')
        .insert({
            codigo: codigo,
            estado: 'ESPERA',
            categoria: categoriaSeleccionada,
            tema: '', 
            jugadores: [{ id: jugadorId, nombre: nombreJugador, esHost: true, rol: 'PENDIENTE' }]
        })
        .select()
        .single();

    if (error) {
        console.error('Error:', error);
        return alert('Error al crear sala. Intenta de nuevo.');
    }

    salaActual = nuevaSala;
    esHost = true;
    mostrarSalaEspera(codigo, categoriaSeleccionada);
    iniciarSuscripcionSala(codigo);
}

async function unirseSala() {
    const codigo = document.getElementById('codigo-sala-input').value.trim().toUpperCase();
    if (!codigo) return alert('Ingresa el código.');
    
    const jugadorId = Date.now().toString(36);

    let { data: sala, error } = await supabaseClient
        .from('salas')
        .select('*')
        .eq('codigo', codigo)
        .single();

    if (error || !sala) return alert('Sala no encontrada.');
    if (sala.estado !== 'ESPERA') return alert('La partida ya empezó.');
    if (sala.jugadores.length >= 10) return alert('Sala llena.');

    const yaExiste = sala.jugadores.some(j => j.nombre === nombreJugador);
    if(yaExiste) return alert('Nombre ya usado en esta sala.');

    const nuevoJugador = { id: jugadorId, nombre: nombreJugador, esHost: false, rol: 'PENDIENTE' };
    const jugadoresActualizados = [...sala.jugadores, nuevoJugador];

    const { error: updateError } = await supabaseClient
        .from('salas')
        .update({ jugadores: jugadoresActualizados })
        .eq('id', sala.id);

    if (updateError) return alert('Error al unirse.');

    salaActual = sala;
    esHost = false;
    mostrarSalaEspera(codigo, sala.categoria);
    iniciarSuscripcionSala(codigo);
}

function mostrarSalaEspera(codigo, categoria) {
    mostrarPanel('sala');
    document.getElementById('codigo-sala-display').textContent = codigo;
    document.getElementById('categoria-sala-display').textContent = `Categoría: ${categoria.toUpperCase()}`;
}

// =========================================================
// III. REALTIME
// =========================================================

function iniciarSuscripcionSala(codigo) {
    if (supabaseSubscription) supabaseClient.removeChannel(supabaseSubscription);

    supabaseSubscription = supabaseClient
        .channel(`sala-${codigo}`)
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` }, 
            (payload) => {
                manejarCambioSala(payload.new);
            }
        )
        .subscribe();
}

function manejarCambioSala(nuevaSala) {
    salaActual = nuevaSala;
    actualizarListaJugadores(nuevaSala.jugadores);

    if (nuevaSala.estado === 'EN_JUEGO') {
        // Si el juego empieza
        asignarRolLocal(nuevaSala.tema, nuevaSala.jugadores);
    } else if (nuevaSala.estado === 'ESPERA') {
        // Si el juego se reinicia, volvemos a la sala
        mostrarPanel('sala');
        document.getElementById('categoria-sala-display').textContent = `Categoría: ${nuevaSala.categoria.toUpperCase()}`;
    }
}

function actualizarListaJugadores(jugadores) {
    const lista = document.getElementById('lista-jugadores');
    if (!lista) return;

    lista.innerHTML = '';
    jugadores.forEach(j => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${j.nombre}</span> <span style="font-size:0.8em; color:#aaa;">${j.esHost ? '👑' : ''}</span>`;
        lista.appendChild(li);
    });

    document.getElementById('count-jugadores').textContent = jugadores.length;
    
    // Botón Iniciar solo para Host
    const btnIniciar = document.getElementById('iniciar-juego-btn');
    if (btnIniciar) btnIniciar.style.display = (esHost && jugadores.length >= 4) ? 'block' : 'none';
}

// =========================================================
// IV. LÓGICA DEL JUEGO
// =========================================================

async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 4) return alert("Mínimo 4 jugadores.");
    
    const temas = data[salaActual.categoria]; 
    const tema = temas[Math.floor(Math.random() * temas.length)];
    const impostorIndex = Math.floor(Math.random() * salaActual.jugadores.length);
    
    const jugadoresAsignados = salaActual.jugadores.map((j, index) => ({
        ...j,
        rol: (index === impostorIndex) ? 'IMPOSTOR' : 'NORMAL'
    }));
    
    await supabaseClient
        .from('salas')
        .update({
            estado: 'EN_JUEGO',
            tema: tema,
            jugadores: jugadoresAsignados
        })
        .eq('id', salaActual.id);
}

// --- NUEVA FUNCIÓN: REINICIAR RONDA (Solo Host) ---
async function reiniciarRondaHost() {
    // 1. Limpiamos los roles de los jugadores
    const jugadoresReset = salaActual.jugadores.map(j => ({
        ...j,
        rol: 'PENDIENTE'
    }));

    // 2. Enviamos el update a Supabase para volver al estado 'ESPERA'
    const { error } = await supabaseClient
        .from('salas')
        .update({
            estado: 'ESPERA',
            tema: '', // Borramos el tema anterior
            jugadores: jugadoresReset
        })
        .eq('id', salaActual.id);

    if (error) alert("Error al reiniciar ronda");
}

function asignarRolLocal(temaGlobal, jugadores) {
    const miJugador = jugadores.find(j => j.nombre === nombreJugador); 
    if (!miJugador) return;

    mostrarPanel('rol');
    
    const rolCard = document.getElementById('rol-asignado');
    const rolNombre = document.getElementById('rol-nombre');
    const rolInstr = document.getElementById('rol-instruccion');
    const cuentaReg = document.getElementById('cuenta-regresiva-rol');

    if (miJugador.rol === 'IMPOSTOR') {
        rolNombre.textContent = "¡IMPOSTOR!";
        rolInstr.textContent = "¡Disimula! No conoces la palabra.";
        rolCard.className = 'card impostor-rol';
    } else {
        rolNombre.textContent = temaGlobal.toUpperCase();
        rolInstr.textContent = "¡Conoces la palabra! Descubre al mentiroso.";
        rolCard.className = 'card normal-rol';
    }

    let countdown = 5;
    const interval = setInterval(() => {
        cuentaReg.textContent = `El juego comienza en ${countdown}...`;
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            mostrarPanel('juego');
            document.getElementById('juego-categoria-display').textContent = salaActual.categoria.toUpperCase();
            
            // Mostrar controles SOLO si es Host
            if (esHost) {
                document.getElementById('btn-reiniciar').style.display = 'block';
                // document.getElementById('btn-activar-voto').style.display = 'block';
            } else {
                document.getElementById('btn-reiniciar').style.display = 'none';
            }
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