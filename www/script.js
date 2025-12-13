// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DATOS (PALABRAS CON IMÁGENES REALES) ---
// NOTA: Si una URL no funciona, se verá un placeholder (vía.placeholder) o nada.
// Debes buscar URLs de imágenes reales para todas si quieres que se vean bien.
const data = {
    futbol: [
        { word: "Maradona", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Diego_Maradona_in_1986.jpg/245px-Diego_Maradona_in_1986.jpg" },
        { word: "Pelé", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pele_by_John_Mathew_Smith.jpg/220px-Pel%C3%A9_by_John_Mathew_Smith.jpg" },
        { word: "Messi", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/245px-Lionel_Messi_20180626.jpg" },
        { word: "Cristiano Ronaldo", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/245px-Cristiano_Ronaldo_2018.jpg" },
        { word: "Zidane", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg/245px-Zinedine_Zidane_by_Tasnim_03.jpg" },
        { word: "Mbappé", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg/245px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg" },
        { word: "Ronaldinho", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ronaldinho_07_2007.jpg/245px-Ronaldinho_07_2007.jpg" }
    ],
    deportes: [
        { word: "Tenis", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Tennis_racket_and_ball_closeup.jpg/320px-Tennis_racket_and_ball_closeup.jpg" },
        { word: "Baloncesto", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Basketball_1.jpg/320px-Basketball_1.jpg" },
        { word: "Natación", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Swimming_pool_with_lane_ropes.jpg/320px-Swimming_pool_with_lane_ropes.jpg" },
        { word: "Maratón", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/London_Marathon_2019.jpg/320px-London_Marathon_2019.jpg" },
        { word: "Boxeo", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Boxing_gloves.jpg/320px-Boxing_gloves.jpg" },
        { word: "Golf", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Golf_ball_and_tee.jpg/320px-Golf_ball_and_tee.jpg" }
    ],
    trabajos: [
        { word: "Director de cine", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/A_filmmaker_directing_a_scene.jpg/320px-A_filmmaker_directing_a_scene.jpg" },
        { word: "Cartero", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/US_Mail_Carrier_2011.jpg/320px-US_Mail_Carrier_2011.jpg" },
        { word: "Chef", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Female_Chef_Cooking.jpg/320px-Female_Chef_Cooking.jpg" },
        { word: "Arquitecto", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Architectural_drafting.jpg/320px-Architectural_drafting.jpg" },
        { word: "Veterinario", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Veterinarian_Examining_Dog_2015.jpg/320px-Veterinarian_Examining_Dog_2015.jpg" },
        { word: "Programador", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Programming_tools_icon.png/320px-Programming_tools_icon.png" }
    ],
    comida: [
        { word: "Sopa", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Chicken_noodle_soup_in_a_bowl.jpg/320px-Chicken_noodle_soup_in_a_bowl.jpg" },
        { word: "Sushi", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sushi_with_ginger_and_wasabi.jpg/320px-Sushi_with_ginger_and_wasabi.jpg" },
        { word: "Taco Mexicano", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Taco_carne_asada.jpg/320px-Taco_carne_asada.jpg" },
        { word: "Pizza Napolitana", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Neapolitan_pizza.jpg/320px-Neapolitan_pizza.jpg" },
        { word: "Hamburguesa", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Red_Robin_Burger_%2830849887756%29.jpg/320px-Red_Robin_Burger_%2830849887756%29.jpg" },
        { word: "Empanada", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Empanada_Argentine.jpg/320px-Empanada_Argentine.jpg" }
    ],
    animales: [
        { word: "Elefante", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/African_Bush_Elephant.jpg/320px-African_Bush_Elephant.jpg" },
        { word: "Tigre", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Tiger_in_the_Sundarbans.jpg/320px-Tiger_in_the_Sundarbans.jpg" },
        { word: "Canguro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kangaroo_in_park.jpg/320px-Kangaroo_in_park.jpg" },
        { word: "Delfín", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bottlenose_Dolphin.jpg/320px-Bottlenose_Dolphin.jpg" },
        { word: "Águila", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Bald_Eagle_in_flight_cropped.jpg/320px-Bald_Eagle_in_flight_cropped.jpg" },
        { word: "Jirafa", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Masai_Giraffe_%28Giraffa_camelopardalis_tippelskirchi%29_in_Tanzania.jpg/320px-Masai_Giraffe_%28Giraffa_camelopardalis_tippelskirchi%29_in_Tanzania.jpg" }
    ],
    famosos: [
        { word: "Albert Einstein", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Einstein_1921.jpg/245px-Einstein_1921.jpg" },
        { word: "Marilyn Monroe", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Marilyn_Monroe_in_1952.jpg/245px-Marilyn_Monroe_in_1952.jpg" },
        { word: "Leonardo da Vinci", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Leonardo_da_Vinci_self-portrait.jpg/245px-Leonardo_da_Vinci_self-portrait.jpg" },
        { word: "Cleopatra", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cleopatra.jpg/245px-Cleopatra.jpg" },
        { word: "William Shakespeare", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/245px-Shakespeare.jpg" },
        { word: "Frida Kahlo", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Frida_Kahlo%2C_c._1939.jpg/245px-Frida_Kahlo%2C_c._1939.jpg" }
    ],
    // --- GRUPOS SIN IMÁGENES ---
    GrupoRoman: ["FABRICIO", "BRUNO", "ARMANDO", "JERE", "DANTE", "LOLO", "JOACO", "MARIO", "Francici", "MAURO", "Juani"],
    GrupoMaxi: ["Maxi", "Agustin", "ExE", "PINI", "GERMAN", "FABRI", "GUSTAVO", "JOEL"],
};

// --- ESTADO GLOBAL ---
let salaActual = null;
let nombreJugador = ''; 
let categoriaSeleccionada = ''; 
let esHost = false;
let supabaseSubscription = null;
let timerInterval = null;    
let votingInterval = null;
let rolTimeout = null; // Nuevo para el modo En Persona
let activeLobbyTab = 'aleatorio'; 
let modoJuego = 'ONLINE'; // Por defecto

// --- ESTADO EN PERSONA ---
let jugadoresEnPersona = [];
let jugadorActualIndex = 0;
let turnoEnCurso = false;

// --- DOM ---
const pantallas = {
    inicio: document.getElementById('inicio-pantalla'),
    crear: document.getElementById('panel-crear'),
    unirse: document.getElementById('panel-unirse'),
    sala: document.getElementById('sala-pantalla'),
    rol: document.getElementById('rol-pantalla'),
    juego: document.getElementById('juego-pantalla'),
    votacion: document.getElementById('votacion-pantalla'),
    victoria: document.getElementById('victoria-pantalla')
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
    
    // Rellenar el nombre del host en el panel de creación
    document.getElementById('nombre-host-crear').value = nombreJugador;

    cargarCategoriasManuales();
    mostrarPanel('crear');
    
    // Listener para cambiar el modo
    document.getElementById('modo-juego-selector').addEventListener('change', actualizarInterfazCrear);
    actualizarInterfazCrear(); // Ejecutar al inicio
}

function actualizarInterfazCrear() {
    modoJuego = document.getElementById('modo-juego-selector').value;
    const playerNamesInput = document.getElementById('player-names-input');

    if (modoJuego === 'EN_PERSONA') {
        // En modo EN_PERSONA, el host agrega nombres manuales
        playerNamesInput.classList.remove('hidden');
    } else {
        // En modo ONLINE, los jugadores se unen por código
        playerNamesInput.classList.add('hidden');
    }
}


function mostrarPanelUnirse() {
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador) return alert('Por favor, ingresa tu nombre primero.');
    mostrarPanel('unirse');
}

function cambiarTabLobby(modo) {
    activeLobbyTab = modo; 
    document.getElementById('lobby-tab-aleatorio').classList.add('hidden');
    document.getElementById('lobby-tab-manual').classList.add('hidden');
    document.getElementById('lobby-tab-custom').classList.add('hidden');
    
    document.getElementById('btn-tab-aleatorio').classList.remove('active');
    document.getElementById('btn-tab-manual').classList.remove('active');
    document.getElementById('btn-tab-custom').classList.remove('active');

    document.getElementById(`lobby-tab-${modo}`).classList.remove('hidden');
    document.getElementById(`btn-tab-${modo}`).classList.add('active');
}

function cargarCategoriasManuales() {
    const contenedor = document.getElementById('lista-cats-manual');
    contenedor.innerHTML = '';
    
    Object.keys(data).forEach(key => {
        const btn = document.createElement('button');
        btn.classList.add('categoria-btn'); 
        const span = document.createElement('span');
        span.textContent = key.toUpperCase().replace(/_/g, ' '); 
        btn.appendChild(span);
        btn.onclick = () => {
            contenedor.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            categoriaSeleccionada = key;
        };
        contenedor.appendChild(btn);
    });
}

function obtenerCategoriaAleatoria() {
    const keys = Object.keys(data).filter(key => !key.startsWith('Grupo')); // Excluir grupos
    return keys[Math.floor(Math.random() * keys.length)];
}

// =========================================================
// II. GESTIÓN DE SALAS
// =========================================================

function generarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function crearSala() {
    // 1. Validar el modo de juego
    modoJuego = document.getElementById('modo-juego-selector').value;

    let jugadoresIniciales = [];
    if (modoJuego === 'EN_PERSONA') {
        const nombresRaw = document.getElementById('input-nombres-jugadores').value.trim();
        const nombresArray = nombresRaw.split('\n').map(n => n.trim()).filter(n => n.length > 0);
        
        if (nombresArray.length < 3) return alert('Modo En Persona: Necesitas al menos 3 nombres de jugadores.');
        
        // Crear jugadores temporales (solo para el host local)
        jugadoresEnPersona = nombresArray.map((nombre, index) => ({
            id: index.toString(),
            nombre: nombre,
            esHost: (index === 0), // El host del juego es el primero en la lista
            rol: 'PENDIENTE', 
            estado: 'VIVO', 
            voto: null
        }));
        // El host real de Supabase es el que creó la sala
        jugadoresIniciales = [{ id: Date.now().toString(36), nombre: nombreJugador, esHost: true, rol: 'HOST', estado: 'VIVO', voto: null }];

    } else { 
        // Modo Online estándar
        jugadoresIniciales = [{ id: Date.now().toString(36), nombre: nombreJugador, esHost: true, rol: 'PENDIENTE', estado: 'VIVO', voto: null }];
    }


    const codigo = generarCodigo();

    const { data: nuevaSala, error } = await supabaseClient
        .from('salas')
        .insert({
            codigo: codigo,
            estado: 'ESPERA',
            modo_juego: modoJuego, // Guardar el modo
            categoria: 'ALEATORIO', 
            lista_palabras: [], 
            tema: '', 
            tema_imagen: null, 
            jugadores: jugadoresIniciales
        })
        .select()
        .single();

    if (error) {
        console.error('Error:', error);
        return alert('Error al crear sala.');
    }

    salaActual = nuevaSala;
    esHost = true;
    
    mostrarSalaEspera(codigo, "ALEATORIO");
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
    if (sala.modo_juego === 'EN_PERSONA') return alert('Esta sala está configurada para jugar en persona (misma PC).');
    if (sala.estado !== 'ESPERA') return alert('La partida ya empezó.');
    if (sala.jugadores.length >= 12) return alert('Sala llena (máx 12).');

    const yaExiste = sala.jugadores.some(j => j.nombre === nombreJugador);
    if(yaExiste) return alert('Nombre ya usado en esta sala.');

    const nuevoJugador = { id: jugadorId, nombre: nombreJugador, esHost: false, rol: 'PENDIENTE', estado: 'VIVO', voto: null };
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

// --- SALIR DE SALA (Con migración de Host) ---
async function salirDeSala() {
    if (!salaActual) return;
    if (confirm("¿Seguro que quieres salir?")) {
        
        let nuevosJugadores = salaActual.jugadores.filter(j => j.nombre !== nombreJugador);
        
        // LÓGICA: Si yo era Host, pasamos el liderazgo al siguiente
        if (esHost && salaActual.modo_juego === 'ONLINE' && nuevosJugadores.length > 0) {
            // Asegurarse de que el jugador que queda como host no sea el HOST dummy del modo EN_PERSONA
            const proximoHostIndex = nuevosJugadores.findIndex(j => j.rol !== 'HOST');
            if (proximoHostIndex !== -1) {
                nuevosJugadores[proximoHostIndex].esHost = true; 
            }
        }
        
        if (nuevosJugadores.length === 0 || (salaActual.modo_juego === 'EN_PERSONA' && esHost)) {
            // Si no queda nadie O si es modo EN_PERSONA y el host real sale, borrar sala.
            await supabaseClient.from('salas').delete().eq('id', salaActual.id);
        } else {
            // Actualizar lista
            await supabaseClient.from('salas').update({ jugadores: nuevosJugadores }).eq('id', salaActual.id);
        }
        
        volverAlInicio();
    }
}

async function expulsarJugadorHost(idJugadorAExpulsar) {
    if (!esHost) return;
    if (!confirm("¿Quieres expulsar a este jugador de la sala?")) return;
    const nuevosJugadores = salaActual.jugadores.filter(j => j.id !== idJugadorAExpulsar);
    await supabaseClient.from('salas').update({ jugadores: nuevosJugadores }).eq('id', salaActual.id);
}

function volverAlInicio() {
    if (supabaseSubscription) supabaseClient.removeChannel(supabaseSubscription);
    if (timerInterval) clearInterval(timerInterval);
    if (votingInterval) clearInterval(votingInterval);
    if (rolTimeout) clearTimeout(rolTimeout);
    salaActual = null;
    esHost = false;
    jugadoresEnPersona = [];
    jugadorActualIndex = 0;
    turnoEnCurso = false;
    mostrarPanel('inicio');
    document.body.className = ''; 
}

function mostrarSalaEspera(codigo, categoria) {
    mostrarPanel('sala');
    document.getElementById('codigo-sala-display').textContent = `SALA: ${codigo}`;
    document.getElementById('categoria-sala-display').textContent = `Categoría: ${categoria.toUpperCase()}`;
    document.getElementById('modo-juego-display').textContent = `MODO: ${salaActual.modo_juego.replace('_', ' ')}`;
    
    const hostControls = document.getElementById('host-controls-area');
    const playerView = document.getElementById('player-view-area');
    
    if (esHost) {
        hostControls.style.display = 'block';
        playerView.style.display = 'none';
        // En modo EN_PERSONA, la lista de jugadores es la temporal
        if (salaActual.modo_juego === 'EN_PERSONA') {
             actualizarListaJugadores(jugadoresEnPersona); 
        }
    } else {
        hostControls.style.display = 'none';
        playerView.style.display = 'block';
    }
}

// =========================================================
// III. REALTIME Y ACTUALIZACIÓN DE ESTADO
// =========================================================

function iniciarSuscripcionSala(codigo) {
    if (supabaseSubscription) supabaseClient.removeChannel(supabaseSubscription);

    supabaseSubscription = supabaseClient
        .channel(`sala-${codigo}`)
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` }, 
            (payload) => manejarCambioSala(payload.new)
        )
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` },
            () => { alert("La sala ha sido cerrada."); volverAlInicio(); }
        )
        .subscribe();
}

function manejarCambioSala(nuevaSala) {
    salaActual = nuevaSala;
    const yo = nuevaSala.jugadores.find(j => j.nombre === nombreJugador);
    if (!yo && salaActual.modo_juego === 'ONLINE') { alert("Has sido expulsado o el host salió."); volverAlInicio(); return; }

    // El host de la sala es el único que importa si está en modo ONLINE
    esHost = yo ? yo.esHost : false;
    
    // Si estoy en sala de espera ONLINE, actualizo la lista.
    if (salaActual.estado === 'ESPERA' && salaActual.modo_juego === 'ONLINE') {
        actualizarListaJugadores(nuevaSala.jugadores);
        mostrarSalaEspera(nuevaSala.codigo, nuevaSala.categoria);
    }
    
    // Si estoy en modo EN_PERSONA, actualizo el juego sin la lista de jugadores de Supabase
    if (salaActual.modo_juego === 'EN_PERSONA' && esHost) {
        // En este modo, el Host maneja el estado localmente, solo usa Supabase para coordinar la partida
        if (salaActual.estado === 'EN_JUEGO') {
            mostrarPantallaJuegoEnPersona(nuevaSala);
        }
        if (nuevaSala.estado === 'VICTORIA_IMPOSTOR' || nuevaSala.estado === 'VICTORIA_INOCENTE') {
            mostrarPantallaVictoria(nuevaSala);
        }
        return;
    }


    // Lógica de juego ONLINE estándar
    switch (nuevaSala.estado) {
        case 'EN_JUEGO':
            if (!pantallas.juego.classList.contains('hidden')) {
                actualizarListaOrdenJuego(nuevaSala.jugadores);
            } else {
                asignarRolLocal(nuevaSala.tema, nuevaSala.jugadores, yo);
            }
            break;
        case 'VOTANDO':
            mostrarPantallaVotacion(nuevaSala.jugadores, yo);
            break;
        case 'VICTORIA_IMPOSTOR':
        case 'VICTORIA_INOCENTE':
            mostrarPantallaVictoria(nuevaSala);
            break;
    }
}

function actualizarListaJugadores(jugadores) {
    const listaHost = document.getElementById('lista-jugadores');
    const listaPlayer = document.getElementById('lista-jugadores-player');
    
    if (listaHost) listaHost.innerHTML = '';
    if (listaPlayer) listaPlayer.innerHTML = '';
    
    jugadores.forEach(j => {
        const li = document.createElement('li');
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `<span>${j.nombre}</span> <span style="font-size:0.8em; color:#f1c40f;">${j.esHost ? '👑' : ''}</span>`;
        li.appendChild(infoDiv);

        if (esHost && salaActual.modo_juego === 'ONLINE' && !j.esHost) {
            const btnKick = document.createElement('button');
            btnKick.className = 'btn-kick';
            btnKick.innerHTML = '<i class="fas fa-times"></i>'; 
            btnKick.onclick = () => expulsarJugadorHost(j.id);
            li.appendChild(btnKick);
        }

        if (listaHost) listaHost.appendChild(li.cloneNode(true));
        if (listaPlayer) listaPlayer.appendChild(li);
    });

    const jugadoresVisibles = salaActual.modo_juego === 'EN_PERSONA' ? jugadoresEnPersona.length : jugadores.length;
    document.getElementById('count-jugadores').textContent = jugadoresVisibles;
    
    const btnIniciar = document.getElementById('iniciar-juego-btn');
    if (btnIniciar) btnIniciar.style.display = (esHost && jugadoresVisibles >= 3) ? 'block' : 'none';
}

function actualizarListaOrdenJuego(jugadores, jugadorEnTurnoId = null) {
    const listaOrden = document.getElementById('lista-orden-habla');
    if (!listaOrden) return;
    listaOrden.innerHTML = '';
    const vivos = jugadores.filter(j => j.estado === 'VIVO');
    
    vivos.forEach((j, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}.</strong> ${j.nombre}`;
        
        if (j.id === jugadorEnTurnoId || j.nombre === nombreJugador) {
            li.style.color = "#3498db"; 
            li.style.fontWeight = "bold"; 
            if (j.nombre === nombreJugador && salaActual.modo_juego === 'ONLINE') li.innerHTML += " (Tú)";
            if (j.id === jugadorEnTurnoId) li.style.borderLeft = "4px solid #f1c40f"; // Resaltar turno
        }
        listaOrden.appendChild(li);
    });

    if (salaActual.modo_juego === 'EN_PERSONA') {
        const jugadorTurnoNombre = vivos.find(j => j.id === jugadorEnTurnoId)?.nombre || 'Nadie';
        document.getElementById('jugador-en-turno-display').textContent = `Turno de: ${jugadorTurnoNombre.toUpperCase()}`;
    }
}

// =========================================================
// IV. LÓGICA DEL JUEGO
// =========================================================

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 1. INICIAR EL JUEGO (HOST) ---
async function iniciarJuegoHost() {
    let jugadoresParaAsignacion = salaActual.jugadores;

    if (salaActual.modo_juego === 'EN_PERSONA') {
        if (jugadoresEnPersona.length < 3) return alert("Modo En Persona: Error al cargar jugadores.");
        jugadoresParaAsignacion = jugadoresEnPersona;
    }
    
    if (jugadoresParaAsignacion.length < 3) return alert("Mínimo 3 jugadores.");
    
    // --- 1. Determinar Categoría y Palabra ---
    let catFinal = '';
    let listaPalabrasFinal = [];

    if (activeLobbyTab === 'aleatorio') {
        const nuevaCat = obtenerCategoriaAleatoria();
        catFinal = nuevaCat;
        listaPalabrasFinal = data[nuevaCat];
    } else if (activeLobbyTab === 'manual') {
        if (!categoriaSeleccionada) return alert("Selecciona una categoría de la lista.");
        catFinal = categoriaSeleccionada;
        listaPalabrasFinal = data[catFinal];
    } else if (activeLobbyTab === 'custom') {
        const nombre = document.getElementById('input-custom-titulo').value.trim();
        const palabrasRaw = document.getElementById('input-custom-palabras').value.trim();
        if (!nombre || !palabrasRaw) return alert("Completa los campos de categoría custom.");
        const palabrasArray = palabrasRaw.split(',').map(p => p.trim()).filter(p => p.length > 0);
        if (palabrasArray.length < 2) return alert("Necesitas al menos 2 palabras.");
        catFinal = nombre;
        listaPalabrasFinal = palabrasArray;
    }
    
    const itemElegido = listaPalabrasFinal[Math.floor(Math.random() * listaPalabrasFinal.length)];
    let temaTexto = '';
    let temaImagen = null;

    if (typeof itemElegido === 'object' && itemElegido !== null) {
        temaTexto = itemElegido.word;
        temaImagen = itemElegido.img;
    } else {
        temaTexto = itemElegido;
        temaImagen = null;
    }
    
    // --- 2. Asignar Roles ---
    const numJugadores = jugadoresParaAsignacion.length;
    let numImpostores = (numJugadores > 5 && numJugadores <= 10) ? 2 : (numJugadores >= 11) ? 3 : 1;
    
    let jugadoresMezclados = mezclarArray([...jugadoresParaAsignacion]);
    const jugadoresAsignados = jugadoresMezclados.map(j => ({ ...j, rol: 'NORMAL', estado: 'VIVO', voto: null }));
    
    let asignados = 0;
    while (asignados < numImpostores) {
        const idx = Math.floor(Math.random() * jugadoresAsignados.length);
        // Asegurarse de que el HOST de Supabase (modo EN_PERSONA) no sea impostor
        if (salaActual.modo_juego === 'EN_PERSONA' && jugadoresAsignados[idx].rol === 'HOST') continue;

        if (jugadoresAsignados[idx].rol !== 'IMPOSTOR') {
            jugadoresAsignados[idx].rol = 'IMPOSTOR';
            asignados++;
        }
    }
    
    // --- 3. Guardar en Supabase ---
    const jugadoresFinal = salaActual.modo_juego === 'EN_PERSONA' ? salaActual.jugadores : jugadoresAsignados;

    // Si es EN_PERSONA, guardamos la lista de jugadores de la partida en una variable TEMPORAL
    if (salaActual.modo_juego === 'EN_PERSONA') {
        jugadoresEnPersona = jugadoresAsignados; 
        jugadorActualIndex = 0; // Reiniciar el turno
    }

    await supabaseClient
        .from('salas')
        .update({
            estado: 'EN_JUEGO',
            categoria: catFinal,
            // Solo guardamos las palabras si es necesario para el juego online
            lista_palabras: salaActual.modo_juego === 'ONLINE' ? listaPalabrasFinal : [], 
            tema: temaTexto,
            tema_imagen: temaImagen, 
            jugadores: jugadoresFinal // Solo se actualiza la lista de la sala ONLINE
        })
        .eq('id', salaActual.id);
    
    if (salaActual.modo_juego === 'EN_PERSONA') {
        mostrarPantallaJuegoEnPersona(salaActual);
    }
}

// --- 2. MOSTRAR PANTALLA JUEGO ONLINE ---
function asignarRolLocal(temaGlobal, jugadores, yo) {
    if (!pantallas.juego.classList.contains('hidden') && !pantallas.rol.classList.contains('hidden')) return;

    if (yo.estado === 'ELIMINADO') {
        mostrarPanel('juego');
        document.getElementById('palabra-clave-visible').textContent = "HAS SIDO ELIMINADO 👻";
        document.getElementById('img-pista-juego').classList.add('hidden');
        document.getElementById('timer-display').textContent = "--:--";
        return;
    }

    mostrarPanel('rol');
    document.getElementById('display-categoria-rol').textContent = salaActual.categoria.toUpperCase();

    const rolNombre = document.getElementById('rol-nombre');
    const rolInstr = document.getElementById('rol-instruccion');
    const cuentaReg = document.getElementById('cuenta-regresiva-rol');
    const rolCard = document.getElementById('rol-asignado');

    if (yo.rol === 'IMPOSTOR') {
        rolNombre.textContent = "¡IMPOSTOR!";
        rolInstr.textContent = "🤫 Shhh... No conoces la palabra.";
        rolCard.className = 'card impostor-rol';
    } else {
        rolNombre.textContent = temaGlobal.toUpperCase();
        rolInstr.textContent = "Conoces la palabra secreta.";
        rolCard.className = 'card normal-rol';
    }

    let countdown = 2; 
    cuentaReg.textContent = "Memoriza tu rol...";

    const interval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(interval);
            mostrarPanel('juego');
            document.getElementById('online-game-controls').classList.remove('hidden');
            document.getElementById('en-persona-game-controls').classList.add('hidden');
            
            document.getElementById('palabra-clave-visible').textContent = yo.rol === 'IMPOSTOR' ? "ERES EL IMPOSTOR" : temaGlobal.toUpperCase();
            document.getElementById('palabra-clave-visible').style.color = yo.rol === 'IMPOSTOR' ? "#e74c3c" : "#2ecc71";
            
            const imgPista = document.getElementById('img-pista-juego');
            if (yo.rol !== 'IMPOSTOR' && salaActual.tema_imagen) {
                imgPista.src = salaActual.tema_imagen;
                imgPista.classList.remove('hidden');
            } else {
                imgPista.classList.add('hidden');
            }

            actualizarListaOrdenJuego(jugadores);
            iniciarTimerVisual();
            document.getElementById('btn-activar-voto').style.display = esHost ? 'block' : 'none';
        }
    }, 1000);
}

// =========================================================
// V. MODO JUEGO EN PERSONA (Local)
// =========================================================

function mostrarPantallaJuegoEnPersona(sala) {
    if (!esHost) return; // Solo el host puede ver y controlar esto

    mostrarPanel('juego');
    document.getElementById('online-game-controls').classList.add('hidden');
    document.getElementById('en-persona-game-controls').classList.remove('hidden');

    document.getElementById('palabra-clave-visible').textContent = "¡Comienza el juego!";
    document.getElementById('palabra-clave-visible').style.color = "#3498db";
    document.getElementById('img-pista-juego').classList.add('hidden');
    document.getElementById('display-rol-en-persona').classList.add('hidden');
    document.getElementById('btn-siguiente-jugador').classList.add('hidden');
    
    // Ocultar el rol si está visible al inicio
    document.getElementById('display-rol-en-persona').classList.add('hidden');

    actualizarListaOrdenJuego(jugadoresEnPersona, jugadoresEnPersona[jugadorActualIndex].id);
}

function desbloquearRolEnPersona() {
    if (turnoEnCurso) return;
    
    turnoEnCurso = true;
    const jugadorEnTurno = jugadoresEnPersona[jugadorActualIndex];
    const rolDisplay = document.getElementById('display-rol-en-persona');
    const rolNombre = document.getElementById('rol-nombre-en-persona');
    const rolInstr = document.getElementById('rol-instruccion-en-persona');
    const imgPista = document.getElementById('img-pista-en-persona');

    // 1. Mostrar el rol
    rolDisplay.classList.remove('hidden');
    rolDisplay.style.borderLeftColor = jugadorEnTurno.rol === 'IMPOSTOR' ? '#e74c3c' : '#2ecc71';
    rolDisplay.className = `card ${jugadorEnTurno.rol === 'IMPOSTOR' ? 'impostor-rol' : 'normal-rol'}`;


    if (jugadorEnTurno.rol === 'IMPOSTOR') {
        rolNombre.textContent = "¡ERES EL IMPOSTOR!";
        rolInstr.textContent = "🤫 Disimula y adivina la palabra secreta. ¡NO LA CONOCES!";
        imgPista.classList.add('hidden');
    } else {
        rolNombre.textContent = salaActual.tema.toUpperCase();
        rolInstr.textContent = "Memoriza la palabra. ¡ERES CIUDADANO!";
        
        if (salaActual.tema_imagen) {
            imgPista.src = salaActual.tema_imagen;
            imgPista.classList.remove('hidden');
        } else {
            imgPista.classList.add('hidden');
        }
    }
    
    document.getElementById('btn-desbloquear-rol').textContent = "⚠️ MEMORIZA RÁPIDO (12s)";
    document.getElementById('btn-desbloquear-rol').disabled = true;

    // 2. Ocultar el rol después de 12 segundos
    rolTimeout = setTimeout(() => {
        rolDisplay.classList.add('hidden');
        document.getElementById('btn-siguiente-jugador').classList.remove('hidden');
        document.getElementById('btn-desbloquear-rol').textContent = "Rol Oculto";
        document.getElementById('btn-desbloquear-rol').disabled = true;
    }, 12000); // 12 segundos
}

function siguienteJugadorEnPersona() {
    if (rolTimeout) clearTimeout(rolTimeout);
    
    jugadorActualIndex++;
    const vivos = jugadoresEnPersona.filter(j => j.estado === 'VIVO');
    
    if (jugadorActualIndex >= vivos.length) {
        // Todos los vivos vieron su rol, ahora comienza la fase de debate
        mostrarPantallaDebateEnPersona();
        return;
    }

    // Resetear para el siguiente jugador
    turnoEnCurso = false;
    document.getElementById('display-rol-en-persona').classList.add('hidden');
    document.getElementById('btn-siguiente-jugador').classList.add('hidden');
    document.getElementById('btn-desbloquear-rol').disabled = false;
    document.getElementById('btn-desbloquear-rol').textContent = "👁️ Desbloquear Mi Rol";
    
    // Actualizar el turno visible
    actualizarListaOrdenJuego(jugadoresEnPersona, vivos[jugadorActualIndex].id);
}

function mostrarPantallaDebateEnPersona() {
    mostrarPanel('juego');
    document.getElementById('online-game-controls').classList.remove('hidden'); // Usamos el timer online
    document.getElementById('en-persona-game-controls').classList.add('hidden');
    
    // Mostrar la palabra (para referencia del Host)
    document.getElementById('palabra-clave-visible').textContent = salaActual.tema.toUpperCase();
    document.getElementById('palabra-clave-visible').style.color = "#2ecc71";
    
    const imgPista = document.getElementById('img-pista-juego');
    if (salaActual.tema_imagen) {
        imgPista.src = salaActual.tema_imagen;
        imgPista.classList.remove('hidden');
    } else {
        imgPista.classList.add('hidden');
    }

    // Mostrar el botón de votación
    document.getElementById('btn-activar-voto').style.display = esHost ? 'block' : 'none';
    
    iniciarTimerVisual(true); // Iniciar el timer de debate (150s)
}

// =========================================================
// VI. TIMER Y VOTACIÓN
// =========================================================

function iniciarTimerVisual(esModoPersona = false) {
    if (timerInterval) clearInterval(timerInterval);
    let tiempo = 150; // TIEMPO DE DEBATE 150s (2:30)
    const display = document.getElementById('timer-display');
    
    timerInterval = setInterval(() => {
        tiempo--;
        let min = Math.floor(tiempo / 60);
        let sec = tiempo % 60;
        display.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        
        if (tiempo <= 0) {
            clearInterval(timerInterval);
            // PASO AUTOMÁTICO A VOTACIÓN SI SOY HOST
            if (esHost) {
                if (esModoPersona) {
                    // En modo persona, solo cambiamos la pantalla localmente, ya que Supabase no tiene el estado
                    mostrarPantallaVotacion(jugadoresEnPersona, null, true);
                } else {
                    activarFaseVotacionHost();
                }
            }
        }
    }, 1000);
}


async function activarFaseVotacionHost() {
    if (!esHost) return;
    const jugadoresLimpios = salaActual.jugadores.map(j => ({ ...j, voto: null }));
    await supabaseClient.from('salas').update({ 
        estado: 'VOTANDO',
        jugadores: jugadoresLimpios
    }).eq('id', salaActual.id);
}

function mostrarPantallaVotacion(jugadores, yo, esModoPersona = false) {
    mostrarPanel('votacion');
    if (timerInterval) clearInterval(timerInterval);
    
    if (votingInterval) clearInterval(votingInterval);
    let timeLeft = 150; 
    const timerDisplay = document.getElementById('voting-timer-display');
    timerDisplay.textContent = timeLeft;

    votingInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(votingInterval);
            if (esHost) procesarVotacionHost(esModoPersona);
        }
    }, 1000);

    const container = document.getElementById('lista-votar-jugadores');
    container.innerHTML = '';
    const estadoVoto = document.getElementById('estado-votacion');
    const vivos = jugadores.filter(j => j.estado === 'VIVO');

    // --- LÓGICA DE VOTACIÓN ---
    
    if (esModoPersona) {
        estadoVoto.textContent = "Host: Recoge los votos manualmente.";
        if (!jugadoresEnPersona.every(j => j.voto !== null)) {
            // El host puede simular el voto para ir recolectando
            estadoVoto.textContent = `Votos registrados: ${jugadoresEnPersona.filter(j => j.voto !== null).length}/${vivos.length}`;
        }
    } else {
        estadoVoto.textContent = yo && yo.voto ? `Has votado por: ${jugadores.find(j => j.id === yo.voto)?.nombre || 'Saltar'}` : "Selecciona a un jugador:";
    }


    vivos.forEach(j => {
        const btn = document.createElement('button');
        btn.className = 'btn-votar-jugador';

        if (!esModoPersona && yo && j.id === yo.id) return; // En online, no votas por ti.
        
        // Simulación de voto para el host en modo persona
        if (esModoPersona) {
            btn.innerHTML = `<span>${j.nombre}</span> ${j.voto ? '✅' : ' '}`;
            btn.onclick = () => {
                const jugadorVotante = prompt(`¿Quién vota por ${j.nombre}? (Escribe el nombre exacto de quien vota)`);
                if (jugadorVotante) {
                    const votanteIndex = jugadoresEnPersona.findIndex(p => p.nombre.toUpperCase() === jugadorVotante.toUpperCase());
                    if (votanteIndex !== -1 && jugadoresEnPersona[votanteIndex].estado === 'VIVO' && jugadoresEnPersona[votanteIndex].voto === null) {
                         // Asigna el ID del votado (j.id) al votante (jugadoresEnPersona[votanteIndex].voto)
                        jugadoresEnPersona[votanteIndex].voto = j.id; 
                        mostrarPantallaVotacion(jugadoresEnPersona, null, true); // Redibuja
                    } else if (votanteIndex !== -1 && jugadoresEnPersona[votanteIndex].voto !== null) {
                        alert(`${jugadorVotante} ya votó.`);
                    } else {
                         alert(`Jugador '${jugadorVotante}' no encontrado o no puede votar.`);
                    }
                }
            };
        } else {
            // Lógica Online
            if (yo && yo.voto === j.id) btn.classList.add('seleccionado');
            btn.innerHTML = `<span>${j.nombre}</span> ${yo && yo.voto === j.id ? '<i class="fas fa-check"></i>' : ''}`;
            if (yo && yo.estado === 'VIVO') {
                btn.onclick = () => registrarVoto(j.id);
            } else {
                btn.disabled = true;
            }
        }
        container.appendChild(btn);
    });

    const btnSkip = document.createElement('button');
    btnSkip.className = 'btn-votar-jugador';
    btnSkip.innerHTML = "<span>Saltar Voto (Skip)</span>";
    if (!esModoPersona && yo && yo.voto === 'SKIP') btnSkip.classList.add('seleccionado');
    if (esModoPersona) {
        btnSkip.onclick = () => {
             const jugadorVotante = prompt("¿Quién salta el voto? (Escribe el nombre exacto)");
             if (jugadorVotante) {
                const votanteIndex = jugadoresEnPersona.findIndex(p => p.nombre.toUpperCase() === jugadorVotante.toUpperCase());
                if (votanteIndex !== -1 && jugadoresEnPersona[votanteIndex].estado === 'VIVO' && jugadoresEnPersona[votanteIndex].voto === null) {
                    jugadoresEnPersona[votanteIndex].voto = 'SKIP';
                    mostrarPantallaVotacion(jugadoresEnPersona, null, true);
                } else {
                     alert(`Jugador '${jugadorVotante}' no encontrado o ya votó.`);
                }
            }
        };
    } else {
        if (yo && yo.estado === 'VIVO') btnSkip.onclick = () => registrarVoto('SKIP');
    }
    container.appendChild(btnSkip);

    const btnCerrar = document.getElementById('btn-cerrar-votacion');
    if (esHost) {
        const totalVotos = vivos.filter(j => j.voto !== null).length;
        const totalVivos = vivos.length;
        btnCerrar.style.display = 'block';
        btnCerrar.textContent = `🛑 Cerrar Votación (${totalVotos}/${totalVivos})`;
    } else {
        btnCerrar.style.display = 'none';
    }
}

async function registrarVoto(idDestino) {
    if (salaActual.estado !== 'VOTANDO') return;
    
    const { data: salaFresca } = await supabaseClient.from('salas').select('jugadores').eq('id', salaActual.id).single();
    if (salaFresca) {
        const jugadoresActualizados = salaFresca.jugadores.map(j => {
            if (j.nombre === nombreJugador) return { ...j, voto: idDestino };
            return j;
        });
        await supabaseClient.from('salas').update({ jugadores: jugadoresActualizados }).eq('id', salaActual.id);
    }
}

async function procesarVotacionHost(esModoPersona = false) {
    if (!esHost) return;
    if (votingInterval) clearInterval(votingInterval);

    let jugadores = esModoPersona ? jugadoresEnPersona : (await supabaseClient.from('salas').select('jugadores').eq('id', salaActual.id).single()).data.jugadores;
    
    const vivos = jugadores.filter(j => j.estado === 'VIVO');

    const conteo = {};
    vivos.forEach(j => {
        if (j.voto && j.voto !== 'SKIP') {
            conteo[j.voto] = (conteo[j.voto] || 0) + 1;
        }
    });

    let maxVotos = 0;
    let expulsadoId = null;
    let empate = false;

    for (const [id, votos] of Object.entries(conteo)) {
        if (votos > maxVotos) {
            maxVotos = votos;
            expulsadoId = id;
            empate = false;
        } else if (votos === maxVotos) {
            empate = true;
        }
    }

    let nuevosJugadores = [...jugadores];
    if (expulsadoId && !empate) {
        nuevosJugadores = jugadores.map(j => {
            if (j.id === expulsadoId) return { ...j, estado: 'ELIMINADO' };
            return j;
        });
    } 

    const vivosFinal = nuevosJugadores.filter(j => j.estado === 'VIVO');
    const impostoresVivos = vivosFinal.filter(j => j.rol === 'IMPOSTOR').length;
    const inocentesVivos = vivosFinal.filter(j => j.rol === 'NORMAL').length;

    let nuevoEstado = 'EN_JUEGO'; 
    if (impostoresVivos === 0) {
        nuevoEstado = 'VICTORIA_INOCENTE';
    } else if (impostoresVivos >= inocentesVivos) {
        nuevoEstado = 'VICTORIA_IMPOSTOR';
    }

    nuevosJugadores = nuevosJugadores.map(j => ({ ...j, voto: null }));
    
    // Actualizar estado local (En Persona) o Supabase (Online)
    if (esModoPersona) {
        jugadoresEnPersona = nuevosJugadores;
        salaActual.estado = nuevoEstado; // Actualizar localmente el estado de la sala
        mostrarPantallaVictoria(salaActual);
    } else {
        await supabaseClient
            .from('salas')
            .update({
                estado: nuevoEstado,
                jugadores: nuevosJugadores
            })
            .eq('id', salaActual.id);
    }
}

// --- 5. PANTALLA FINAL ---
function mostrarPantallaVictoria(sala) {
    mostrarPanel('victoria');
    
    const jugadoresFinal = sala.modo_juego === 'EN_PERSONA' ? jugadoresEnPersona : sala.jugadores;

    const titulo = document.getElementById('titulo-victoria');
    const subtitulo = document.getElementById('subtitulo-victoria');
    const panelVictoria = document.getElementById('victoria-pantalla');
    const palabraFinal = document.getElementById('palabra-final');
    const imagenFinal = document.getElementById('imagen-palabra-final');
    const listaImpostores = document.getElementById('lista-impostores-revelados');
    
    palabraFinal.textContent = sala.tema;

    if (sala.tema_imagen) {
        imagenFinal.src = sala.tema_imagen;
        imagenFinal.classList.remove('hidden');
    } else {
        imagenFinal.src = '';
        imagenFinal.classList.add('hidden');
    }

    const nombresImpostores = jugadoresFinal
        .filter(j => j.rol === 'IMPOSTOR')
        .map(j => j.nombre)
        .join(', ');

    listaImpostores.textContent = `Los Impostores eran: ${nombresImpostores}`;

    if (sala.estado === 'VICTORIA_INOCENTE') {
        titulo.textContent = "🏆 ¡GANAN LOS CIUDADANOS!";
        subtitulo.textContent = "Todos los impostores fueron eliminados.";
        panelVictoria.className = 'panel victoria-inocente';
        document.body.className = 'victoria-inocente';
    } else {
        titulo.textContent = "🔪 ¡GANAN LOS IMPOSTORES!";
        subtitulo.textContent = "Superaron en número a los ciudadanos.";
        panelVictoria.className = 'panel victoria-impostor';
        document.body.className = 'victoria-impostor';
    }

    const btn = document.getElementById('btn-volver-sala');
    btn.style.display = esHost ? 'block' : 'none';
}

async function reiniciarRondaHost() {
    let jugadoresReset = salaActual.jugadores.map(j => ({ ...j, rol: 'PENDIENTE', estado: 'VIVO', voto: null }));

    if (salaActual.modo_juego === 'EN_PERSONA') {
        // Resetear jugadores locales
        jugadoresEnPersona = jugadoresEnPersona.map(j => ({ ...j, rol: 'PENDIENTE', estado: 'VIVO', voto: null }));
    }

    await supabaseClient
        .from('salas')
        .update({ estado: 'ESPERA', tema: '', tema_imagen: null, jugadores: jugadoresReset })
        .eq('id', salaActual.id);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarPanel('inicio');
});
