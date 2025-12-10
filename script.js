// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DATOS ---
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

// --- ESTADO ---
let salaActual = null;
let nombreJugador = ''; 
let categoriaSeleccionada = '';
let esHost = false;
let supabaseSubscription = null;

// --- DOM ---
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

// --- NUEVA FUNCIÓN: SALIR DE SALA ---
async function salirDeSala() {
    if (!salaActual) return;

    if (confirm("¿Estás seguro de que quieres salir?")) {
        
        if (esHost) {
            // Si el HOST sale, eliminamos la sala completa
            await supabaseClient.from('salas').delete().eq('id', salaActual.id);
        } else {
            // Si un JUGADOR sale, actualizamos el array quitándolo
            const nuevosJugadores = salaActual.jugadores.filter(j => j.nombre !== nombreJugador);
            await supabaseClient.from('salas').update({ jugadores: nuevosJugadores }).eq('id', salaActual.id);
        }

        // Reseteo local
        volverAlInicio();
    }
}

// --- FUNCIÓN AUXILIAR: RESETEAR TODO ---
function volverAlInicio() {
    if (supabaseSubscription) supabaseClient.removeChannel(supabaseSubscription);
    salaActual = null;
    esHost = false;
    mostrarPanel('inicio');
}

function mostrarSalaEspera(codigo, categoria) {
    mostrarPanel('sala');
    document.getElementById('codigo-sala-display').textContent = codigo;
    actualizarDisplayCategoria(categoria);

    const controlesHost = document.getElementById('host-controls-categoria');
    controlesHost.style.display = esHost ? 'block' : 'none';
}

function actualizarDisplayCategoria(categoria) {
    document.getElementById('categoria-sala-display').textContent = `Categoría Actual: ${categoria.toUpperCase()}`;
    const container = document.getElementById('categorias-sala-espera');
    container.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.cat === categoria) {
            btn.classList.add('selected');
        }
    });
    categoriaSeleccionada = categoria;
}

// =========================================================
// III. REALTIME (ACTUALIZADO)
// =========================================================

function iniciarSuscripcionSala(codigo) {
    if (supabaseSubscription) supabaseClient.removeChannel(supabaseSubscription);

    supabaseSubscription = supabaseClient
        .channel(`sala-${codigo}`)
        // Escuchar UPDATES (Cambios en jugadores, estado, etc.)
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` }, 
            (payload) => {
                manejarCambioSala(payload.new);
            }
        )
        // Escuchar DELETES (Si el host cierra la sala)
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'salas', filter: `codigo=eq.${codigo}` },
            (payload) => {
                alert("El Host ha cerrado la sala.");
                volverAlInicio();
            }
        )
        .subscribe();
}

function manejarCambioSala(nuevaSala) {
    salaActual = nuevaSala;
    
    // Verificar si me eliminaron (kick) o si hubo un error de sincronización
    const sigoEnSala = nuevaSala.jugadores.some(j => j.nombre === nombreJugador);
    if (!sigoEnSala) {
        alert("Has salido de la sala.");
        volverAlInicio();
        return;
    }

    actualizarListaJugadores(nuevaSala.jugadores);

    if (nuevaSala.categoria !== categoriaSeleccionada) {
        actualizarDisplayCategoria(nuevaSala.categoria);
    }

    if (nuevaSala.estado === 'EN_JUEGO') {
        // Solo llamar a asignarRol si aún no estoy en la pantalla de juego/rol
        if (!pantallas.juego.classList.contains('hidden') || !pantallas.rol.classList.contains('hidden')) {
            // Ya estoy en juego, solo actualizo lista si alguien salió
             actualizarListaOrdenJuego(nuevaSala.jugadores);
        } else {
            asignarRolLocal(nuevaSala.tema, nuevaSala.jugadores);
        }
    } else if (nuevaSala.estado === 'ESPERA') {
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

// Nueva función para actualizar la lista DURANTE el juego (si alguien se va)
function actualizarListaOrdenJuego(jugadores) {
    const listaOrden = document.getElementById('lista-orden-habla');
    if (!listaOrden) return;
    listaOrden.innerHTML = '';
    jugadores.forEach((j, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}.</strong> ${j.nombre}`;
        if (j.nombre === nombreJugador) {
            li.style.color = "#3498db";
            li.style.fontWeight = "bold";
            li.innerHTML += " (Tú)";
        }
        listaOrden.appendChild(li);
    });
}

// =========================================================
// IV. LÓGICA DEL JUEGO
// =========================================================

async function cambiarCategoriaHost(nuevaCat) {
    if (!esHost) return;
    const { error } = await supabaseClient.from('salas').update({ categoria: nuevaCat }).eq('id', salaActual.id);
    if (error) console.error("Error al cambiar categoría", error);
}

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 3) return alert("Mínimo 3 jugadores.");
    
    const temas = data[salaActual.categoria]; 
    const tema = temas[Math.floor(Math.random() * temas.length)];
    
    let jugadoresMezclados = mezclarArray([...salaActual.jugadores]);
    const impostorIndex = Math.floor(Math.random() * jugadoresMezclados.length);
    
    const jugadoresAsignados = jugadoresMezclados.map((j, index) => ({
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
    const jugadoresReset = salaActual.jugadores.map(j => ({ ...j, rol: 'PENDIENTE' }));
    await supabaseClient
        .from('salas')
        .update({ estado: 'ESPERA', tema: '', jugadores: jugadoresReset })
        .eq('id', salaActual.id);
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

    let countdown = 2; 
    cuentaReg.textContent = "El juego comienza enseguida...";

    const interval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(interval);
            mostrarPanel('juego');

            const palabraDisplay = document.getElementById('palabra-clave-visible');
            if (miJugador.rol === 'IMPOSTOR') {
                palabraDisplay.textContent = "ERES EL IMPOSTOR";
                palabraDisplay.style.color = "#e74c3c"; 
            } else {
                palabraDisplay.textContent = temaGlobal.toUpperCase();
                palabraDisplay.style.color = "#2ecc71"; 
            }

            actualizarListaOrdenJuego(jugadores);
            
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

document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    mostrarPanel('inicio');
});