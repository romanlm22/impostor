// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DATOS ---
const data = {
    futbol: ["maradona", "pele", "Messi", "Cristiano Ronaldo", "Neymar", "Zidane", "Mbappé", "Ronaldinho"],
    deportes: ["Tenis", "Baloncesto", "Nado", "Maratón", "Boxeo", "Golf", "Rugby"],
    trabajos: ["Director de cine", "Cartero", "Chef", "Arquitecto", "Veterinario", "Programador", "Dentista"],
    comida: ["Sopa", "Sushi", "Taco Mexicano", "Pizza Napolitana", "Hamburguesa", "chipa", "empanada"],
    aleatorio: ["Arcoíris", "Montaña Rusa", "Telescopio", "Pirámide", "Canguro", "Robot", "Globo Aerostático", "Castillo de Arena", "asado", "bicicleta", "computadora", "guitarra", "helado", "jardín", "lago", "museo", "nube", "ópera", "parque", "queso", "robot", "safari", "tren", "universo", "volcán", "pizza", "hamburguesa", "yogurt", "camionjeta", "automóvil", "messi", "tenis", "chef", "sushi", "san martin", "delfin", "elefante", "belgrano", "duki", "paulo londra", "madonna"],
    vehiculos: ["Automóvil", "Motocicleta", "Bicicleta", "Camión", "Avión", "Barco", "Tren"],
    animales: ["Elefante", "Tigre", "Canguro", "Delfín", "Águila", "Serpiente", "Jirafa"],
    famosos: ["Albert Einstein", "Marilyn Monroe", "Leonardo da Vinci", "Cleopatra", "William Shakespeare", "Frida Kahlo", "Brat Pit"],
    GrupoRoman: ["FABRICIO ", "BRUNO", "ARMANDO", "JERE", "DANTE", "LOLO", "JOACO", "MARIO", "Francici", "MAURO", "Juani"],
    GrupoMaxi: ["Maxi", "Agustin", "ExE", "PINI", "GERMAN", "FABRI", "GUSTAVO", "JOEL"],
};

// --- ESTADO ---
let salaActual = null;
let nombreJugador = ''; 
let categoriaSeleccionada = '';
let esHost = false;
let supabaseSubscription = null;
let timerInterval = null;    // Timer del debate
let votingInterval = null;   // Timer de la votación

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
    mostrarPanel('crear');
}

function mostrarPanelUnirse() {
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador) return alert('Por favor, ingresa tu nombre primero.');
    mostrarPanel('unirse');
}

function cargarCategorias() {
    const contenedorCrear = document.getElementById('select-categorias');
    const contenedorEspera = document.getElementById('categorias-sala-espera');
    
    contenedorCrear.innerHTML = '';
    contenedorEspera.innerHTML = '';

    Object.keys(data).forEach(key => {
        const btn1 = document.createElement('button');
        btn1.textContent = key.toUpperCase();
        btn1.classList.add('categoria-btn');
        btn1.dataset.cat = key; 
        btn1.onclick = () => seleccionarCategoriaLocal(key, btn1);
        contenedorCrear.appendChild(btn1);

        const btn2 = document.createElement('button');
        btn2.textContent = key.toUpperCase();
        btn2.classList.add('categoria-btn');
        btn2.style.fontSize = '0.8em'; 
        btn2.style.padding = '5px';
        btn2.dataset.cat = key;
        btn2.onclick = () => cambiarCategoriaHost(key); 
        contenedorEspera.appendChild(btn2);
    });
}

function seleccionarCategoriaLocal(key, element) {
    categoriaSeleccionada = key;
    const panelCrear = document.getElementById('select-categorias');
    panelCrear.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
}

// =========================================================
// II. GESTIÓN DE SALAS
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
            jugadores: [{ id: jugadorId, nombre: nombreJugador, esHost: true, rol: 'PENDIENTE', estado: 'VIVO', voto: null }]
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

async function salirDeSala() {
    if (!salaActual) return;
    if (confirm("¿Seguro que quieres salir?")) {
        if (esHost) {
            await supabaseClient.from('salas').delete().eq('id', salaActual.id);
        } else {
            const nuevosJugadores = salaActual.jugadores.filter(j => j.nombre !== nombreJugador);
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
    salaActual = null;
    esHost = false;
    mostrarPanel('inicio');
    document.body.className = ''; 
    pantallas.victoria.className = 'panel hidden';
}

function mostrarSalaEspera(codigo, categoria) {
    mostrarPanel('sala');
    document.getElementById('codigo-sala-display').textContent = codigo;
    actualizarDisplayCategoria(categoria);
    document.getElementById('host-controls-categoria').style.display = esHost ? 'block' : 'none';
}

function actualizarDisplayCategoria(categoria) {
    document.getElementById('categoria-sala-display').textContent = `Categoría Actual: ${categoria.toUpperCase()}`;
    const container = document.getElementById('categorias-sala-espera');
    container.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.cat === categoria) btn.classList.add('selected');
    });
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
            (payload) => manejarCambioSala(payload.new)
        )
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` },
            () => { alert("El Host cerró la sala."); volverAlInicio(); }
        )
        .subscribe();
}

function manejarCambioSala(nuevaSala) {
    salaActual = nuevaSala;
    const yo = nuevaSala.jugadores.find(j => j.nombre === nombreJugador);
    if (!yo) { alert("Has sido expulsado."); volverAlInicio(); return; }

    actualizarListaJugadores(nuevaSala.jugadores);
    if (nuevaSala.categoria !== categoriaSeleccionada) actualizarDisplayCategoria(nuevaSala.categoria);

    switch (nuevaSala.estado) {
        case 'ESPERA':
            mostrarPanel('sala');
            document.body.className = ''; 
            break;
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
    const lista = document.getElementById('lista-jugadores');
    if (!lista) return;
    lista.innerHTML = '';
    
    jugadores.forEach(j => {
        const li = document.createElement('li');
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `<span>${j.nombre}</span> <span style="font-size:0.8em; color:#f1c40f;">${j.esHost ? '👑' : ''}</span>`;
        li.appendChild(infoDiv);

        if (esHost && !j.esHost) {
            const btnKick = document.createElement('button');
            btnKick.className = 'btn-kick';
            btnKick.innerHTML = '<i class="fas fa-times"></i>'; 
            btnKick.onclick = () => expulsarJugadorHost(j.id);
            li.appendChild(btnKick);
        }
        lista.appendChild(li);
    });

    document.getElementById('count-jugadores').textContent = jugadores.length;
    const btnIniciar = document.getElementById('iniciar-juego-btn');
    if (btnIniciar) btnIniciar.style.display = (esHost && jugadores.length >= 3) ? 'block' : 'none';
}

function actualizarListaOrdenJuego(jugadores) {
    const listaOrden = document.getElementById('lista-orden-habla');
    if (!listaOrden) return;
    listaOrden.innerHTML = '';
    const vivos = jugadores.filter(j => j.estado === 'VIVO');
    vivos.forEach((j, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}.</strong> ${j.nombre}`;
        if (j.nombre === nombreJugador) {
            li.style.color = "#3498db"; li.style.fontWeight = "bold"; li.innerHTML += " (Tú)";
        }
        listaOrden.appendChild(li);
    });
}

// =========================================================
// IV. LÓGICA DEL JUEGO
// =========================================================

async function cambiarCategoriaHost(nuevaCat) {
    if (!esHost) return;
    await supabaseClient.from('salas').update({ categoria: nuevaCat }).eq('id', salaActual.id);
}

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 1. INICIAR EL JUEGO ---
async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 3) return alert("Mínimo 3 jugadores.");
    
    const temas = data[salaActual.categoria]; 
    const tema = temas[Math.floor(Math.random() * temas.length)];
    
    const numJugadores = salaActual.jugadores.length;
    let numImpostores = 1;
    if (numJugadores > 5 && numJugadores <= 10) numImpostores = 2;
    else if (numJugadores >= 11) numImpostores = 3;

    let jugadoresMezclados = mezclarArray([...salaActual.jugadores]);
    const jugadoresAsignados = jugadoresMezclados.map(j => ({ ...j, rol: 'NORMAL', estado: 'VIVO', voto: null }));
    
    let asignados = 0;
    while (asignados < numImpostores) {
        const idx = Math.floor(Math.random() * jugadoresAsignados.length);
        if (jugadoresAsignados[idx].rol !== 'IMPOSTOR') {
            jugadoresAsignados[idx].rol = 'IMPOSTOR';
            asignados++;
        }
    }
    
    await supabaseClient
        .from('salas')
        .update({
            estado: 'EN_JUEGO',
            tema: tema,
            jugadores: jugadoresAsignados 
        })
        .eq('id', salaActual.id);
}

// --- 2. MOSTRAR PANTALLA JUEGO ---
function asignarRolLocal(temaGlobal, jugadores, yo) {
    if (!pantallas.juego.classList.contains('hidden') && !pantallas.rol.classList.contains('hidden')) return;

    if (yo.estado === 'ELIMINADO') {
        mostrarPanel('juego');
        document.getElementById('palabra-clave-visible').textContent = "HAS SIDO ELIMINADO 👻";
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
    cuentaReg.textContent = "El juego comienza...";

    const interval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(interval);
            mostrarPanel('juego');
            document.getElementById('display-categoria-juego').textContent = salaActual.categoria.toUpperCase();

            const palabraDisplay = document.getElementById('palabra-clave-visible');
            if (yo.rol === 'IMPOSTOR') {
                palabraDisplay.textContent = "ERES EL IMPOSTOR";
                palabraDisplay.style.color = "#e74c3c"; 
            } else {
                palabraDisplay.textContent = temaGlobal.toUpperCase();
                palabraDisplay.style.color = "#2ecc71"; 
            }

            actualizarListaOrdenJuego(jugadores);
            iniciarTimerVisual();
            document.getElementById('btn-activar-voto').style.display = esHost ? 'block' : 'none';
        }
    }, 1000);
}

function iniciarTimerVisual() {
    if (timerInterval) clearInterval(timerInterval);
    let tiempo = 60; 
    const display = document.getElementById('timer-display');
    
    timerInterval = setInterval(() => {
        tiempo--;
        let min = Math.floor(tiempo / 60);
        let sec = tiempo % 60;
        display.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
        
        if (tiempo <= 0) clearInterval(timerInterval);
    }, 1000);
}

// =========================================================
// V. VOTACIÓN
// =========================================================

async function activarFaseVotacionHost() {
    if (!esHost) return;
    const jugadoresLimpios = salaActual.jugadores.map(j => ({ ...j, voto: null }));
    await supabaseClient.from('salas').update({ 
        estado: 'VOTANDO',
        jugadores: jugadoresLimpios
    }).eq('id', salaActual.id);
}

// --- FUNCIÓN DE VOTACIÓN ACTUALIZADA CON TIMER ---
function mostrarPantallaVotacion(jugadores, yo) {
    mostrarPanel('votacion');
    if (timerInterval) clearInterval(timerInterval);
    
    // Timer de votación (30 segundos)
    if (votingInterval) clearInterval(votingInterval);
    let timeLeft = 30;
    const timerDisplay = document.getElementById('voting-timer-display');
    timerDisplay.textContent = timeLeft;

    votingInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(votingInterval);
            if (esHost) {
                // Si el tiempo se acaba, el host cierra automáticamente
                procesarVotacionHost();
            }
        }
    }, 1000);

    const container = document.getElementById('lista-votar-jugadores');
    container.innerHTML = '';
    const estadoVoto = document.getElementById('estado-votacion');
    const vivos = jugadores.filter(j => j.estado === 'VIVO');

    if (yo.voto) {
        const votado = jugadores.find(j => j.id === yo.voto);
        estadoVoto.textContent = `Has votado por: ${votado ? votado.nombre : 'Saltar'}`;
    } else {
        estadoVoto.textContent = "Selecciona a un jugador:";
    }

    vivos.forEach(j => {
        if (j.id === yo.id) return; 

        const btn = document.createElement('button');
        btn.className = 'btn-votar-jugador';
        if (yo.voto === j.id) btn.classList.add('seleccionado');

        btn.innerHTML = `<span>${j.nombre}</span> ${yo.voto === j.id ? '<i class="fas fa-check"></i>' : ''}`;
        
        if (yo.estado === 'VIVO') {
            btn.onclick = () => registrarVoto(j.id);
        } else {
            btn.disabled = true;
            btn.style.opacity = 0.6;
        }

        container.appendChild(btn);
    });

    const btnSkip = document.createElement('button');
    btnSkip.className = 'btn-votar-jugador';
    btnSkip.innerHTML = "<span>Saltar Voto (Skip)</span>";
    if (yo.voto === 'SKIP') btnSkip.classList.add('seleccionado');
    if (yo.estado === 'VIVO') btnSkip.onclick = () => registrarVoto('SKIP');
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

async function procesarVotacionHost() {
    if (!esHost) return;
    
    // Detener timer
    if (votingInterval) clearInterval(votingInterval);

    const { data: sala } = await supabaseClient.from('salas').select('*').eq('id', salaActual.id).single();
    const jugadores = sala.jugadores;
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

    await supabaseClient
        .from('salas')
        .update({
            estado: nuevoEstado,
            jugadores: nuevosJugadores
        })
        .eq('id', salaActual.id);
}

// --- 5. PANTALLA FINAL ---
function mostrarPantallaVictoria(sala) {
    mostrarPanel('victoria');
    
    const titulo = document.getElementById('titulo-victoria');
    const subtitulo = document.getElementById('subtitulo-victoria');
    const panelVictoria = document.getElementById('victoria-pantalla');
    const palabraFinal = document.getElementById('palabra-final');
    const listaImpostores = document.getElementById('lista-impostores-revelados');
    
    palabraFinal.textContent = sala.tema;

    const nombresImpostores = sala.jugadores
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
    const jugadoresReset = salaActual.jugadores.map(j => ({ ...j, rol: 'PENDIENTE', estado: 'VIVO', voto: null }));
    await supabaseClient
        .from('salas')
        .update({ estado: 'ESPERA', tema: '', jugadores: jugadoresReset })
        .eq('id', salaActual.id);
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    mostrarPanel('inicio');
});