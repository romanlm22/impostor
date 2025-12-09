// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

// 1. CREACIÓN DEL CLIENTE
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- BASE DE DATOS DE TEMAS ---
const data = {
    futbol: ["maradona, pele", "Messi", "Cristiano Ronaldo", "Neymar", "Zidane", "Mbappé", "Ronaldinho"],
    deportes: ["Tenis", "Baloncesto", "Nado", "Maratón", "Boxeo", "Golf", "Rugby"],
    trabajos: ["Director", "Cartero", "Chef", "Arquitecto", "Veterinario", "Programador", "Dentista"],
    comida: ["Sopa", "Sushi", "Taco Mexicano", "Pizza Napolitana", "Hamburguesa", "chipa", "empanada"],
    aleatorio: ["Arcoíris", "Montaña Rusa", "Telescopio", "Pirámide", "Canguro", "Robot", "Globo Aerostático", "Castillo de Arena", "asado", "bicicleta", "computadora", "guitarra", "helado", "jardín", "lago", "museo", "nube", "ópera", "parque", "queso", "robot", "safari", "tren", "universo", "volcán", "pizza", "hamburguesa", "yogurt", "camionjeta", "automóvil", "messi", "tenis", "chef", "sushi", "san martin", "delfin", "elefante", "belgrano", "duki", "paulo londra", "madonna"],
    vehiculos: ["Automóvil", "Motocicleta", "Bicicleta", "Camión", "Avión", "Barco", "Tren"],
    animales: ["Elefante", "Tigre", "Canguro", "Delfín", "Águila", "Serpiente", "Jirafa"],
    famosos: ["Albert Einstein", "Marilyn Monroe", "Leonardo da Vinci", "Cleopatra", "William Shakespeare", "Frida Kahlo", "Brat Pit"],
    //delGrupo: ["FABRICIO O JOA", "BRUNO O TOBI", "ARMANDO O MARCOS", "JERE", "DANTE", "LOLO O JUAN", "JOACO O LISA", "MARIO O Lauty", "Francici o Fer", "MAURO"],
};

// ====================================================
// 2. VARIABLES DE ESTADO
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

/**
 * Carga las categorías tanto en el panel de crear como en la sala de espera.
 */
function cargarCategorias() {
    const contenedorCrear = document.getElementById('select-categorias');
    const contenedorEspera = document.getElementById('categorias-sala-espera');
    
    // Limpiamos
    contenedorCrear.innerHTML = '';
    contenedorEspera.innerHTML = '';

    Object.keys(data).forEach(key => {
        // Botón para pantalla "Crear Sala"
        const btn1 = document.createElement('button');
        btn1.textContent = key.toUpperCase();
        btn1.classList.add('categoria-btn');
        btn1.dataset.cat = key; // Marcador para estilos
        btn1.onclick = () => seleccionarCategoriaLocal(key, btn1);
        contenedorCrear.appendChild(btn1);

        // Botón para pantalla "Sala de Espera" (Solo Host lo usará)
        const btn2 = document.createElement('button');
        btn2.textContent = key.toUpperCase();
        btn2.classList.add('categoria-btn');
        btn2.style.fontSize = '0.8em'; // Un poco más chicos en la sala
        btn2.style.padding = '5px';
        btn2.dataset.cat = key;
        btn2.onclick = () => cambiarCategoriaHost(key); // Esta función actualiza la BD
        contenedorEspera.appendChild(btn2);
    });
}

function seleccionarCategoriaLocal(key, element) {
    categoriaSeleccionada = key;
    // Quitamos 'selected' de todos los botones en el panel de crear
    const panelCrear = document.getElementById('select-categorias');
    panelCrear.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('selected'));
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
        return alert('Error al crear sala.');
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
    actualizarDisplayCategoria(categoria);

    // Mostrar controles de cambio de categoría SOLO al Host
    const controlesHost = document.getElementById('host-controls-categoria');
    if (esHost) {
        controlesHost.style.display = 'block';
    } else {
        controlesHost.style.display = 'none';
    }
}

// Nueva función auxiliar para actualizar texto y botones visualmente
function actualizarDisplayCategoria(categoria) {
    // 1. Texto
    document.getElementById('categoria-sala-display').textContent = `Categoría Actual: ${categoria.toUpperCase()}`;
    
    // 2. Resaltar botón en la sala de espera (para el host)
    const container = document.getElementById('categorias-sala-espera');
    container.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.cat === categoria) {
            btn.classList.add('selected');
        }
    });
    
    // Guardamos localmente
    categoriaSeleccionada = categoria;
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
    
    // Actualizar lista de jugadores
    actualizarListaJugadores(nuevaSala.jugadores);

    // Detectar CAMBIO DE CATEGORÍA en tiempo real (si el host la cambia)
    if (nuevaSala.categoria !== categoriaSeleccionada) {
        actualizarDisplayCategoria(nuevaSala.categoria);
    }

    if (nuevaSala.estado === 'EN_JUEGO') {
        asignarRolLocal(nuevaSala.tema, nuevaSala.jugadores);
    } else if (nuevaSala.estado === 'ESPERA') {
        // Si volvemos a la sala
        mostrarPanel('sala');
        actualizarDisplayCategoria(nuevaSala.categoria);
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
    
    const btnIniciar = document.getElementById('iniciar-juego-btn');
    if (btnIniciar) btnIniciar.style.display = (esHost && jugadores.length >= 3) ? 'block' : 'none';
}

// =========================================================
// IV. LÓGICA DEL JUEGO
// =========================================================

// --- NUEVA FUNCIÓN: HOST CAMBIA CATEGORÍA EN TIEMPO REAL ---
async function cambiarCategoriaHost(nuevaCat) {
    if (!esHost) return;
    
    // Enviamos el update a Supabase
    // Esto disparará 'manejarCambioSala' en todos los clientes
    const { error } = await supabaseClient
        .from('salas')
        .update({ categoria: nuevaCat })
        .eq('id', salaActual.id);
        
    if (error) console.error("Error al cambiar categoría", error);
}

async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 3) return alert("Mínimo 3 jugadores.");
    
    // Usamos la categoría que esté guardada actualmente en salaActual (que viene de la BD)
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

async function reiniciarRondaHost() {
    const jugadoresReset = salaActual.jugadores.map(j => ({
        ...j,
        rol: 'PENDIENTE'
    }));

    const { error } = await supabaseClient
        .from('salas')
        .update({
            estado: 'ESPERA',
            tema: '', 
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
        rolInstr.textContent = "🤫 Shhh... No conoces la palabra.";
        rolCard.className = 'card impostor-rol';
    } else {
        rolNombre.textContent = temaGlobal.toUpperCase();
        rolInstr.textContent = "Conoces la palabra secreta.";
        rolCard.className = 'card normal-rol';
    }

    let countdown = 35; // Transición rápida de 2 segundos
    cuentaReg.textContent = "El juego comienza enseguida...";

    const interval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(interval);
            mostrarPanel('juego');
            document.getElementById('juego-categoria-display').textContent = salaActual.categoria.toUpperCase();
            
            if (esHost) {
                const btnReiniciar = document.getElementById('btn-reiniciar');
                if (btnReiniciar) btnReiniciar.style.display = 'block';
                
                const btnVoto = document.getElementById('btn-activar-voto');
                if (btnVoto) btnVoto.style.display = 'block';
            } else {
                const btnReiniciar = document.getElementById('btn-reiniciar');
                if (btnReiniciar) btnReiniciar.style.display = 'none';
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