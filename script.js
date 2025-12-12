// =========================================================
// !!! ⚠️ CONFIGURACIÓN DE SUPABASE ⚠️ !!!
// =========================================================
const SUPABASE_URL = 'https://hopszyankqfxxrkicmwk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcHN6eWFua3FmeHhya2ljbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDkwMTMsImV4cCI6MjA4MDgyNTAxM30.kU8e-aPLNj9kNuZewbpl4REsAN8VenNWBJpuLuAXw6s';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- IMÁGENES DE CATEGORÍAS (Para el menú) ---
const categoryImages = {
    futbol: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Soccerball.svg/120px-Soccerball.svg.png",
    deportes: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Basketball_Clipart.svg/120px-Basketball_Clipart.svg.png",
    trabajos: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Briefcase_icon.svg/120px-Briefcase_icon.svg.png",
    comida: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/120px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    aleatorio: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Random_dice.svg/120px-Random_dice.svg.png",
    vehiculos: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Car_icon.svg/120px-Car_icon.svg.png",
    animales: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Cartoon_elephant_02.svg/120px-Cartoon_elephant_02.svg.png",
    famosos: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/120px-Albert_Einstein_Head.jpg",
    GrupoRoman: null,
    GrupoMaxi: null,
    Grupo: "https://images.pexels.com/photos/10034072/pexels-photo-10034072.jpeg",
};

// --- DATOS (PALABRAS CON IMÁGENES INDIVIDUALES) ---
// ⚠️ REEMPLAZA LAS URLs DE EJEMPLO CON LAS TUYAS ⚠️
const data = {
    futbol: [
        { word: "Maradona", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Diego_Maradona_in_1986.jpg/245px-Diego_Maradona_in_1986.jpg" },
        { word: "Pelé", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pele_by_John_Mathew_Smith.jpg/220px-Pele_by_John_Mathew_Smith.jpg" },
        { word: "Messi", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/245px-Lionel_Messi_20180626.jpg" },
        { word: "Cristiano Ronaldo", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/245px-Cristiano_Ronaldo_2018.jpg" },
        { word: "Neymar", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Neymar_Jr._with_Brazil_national_team_in_2018.jpg/245px-Neymar_Jr._with_Brazil_national_team_in_2018.jpg" },
        { word: "Zidane", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg/245px-Zinedine_Zidane_by_Tasnim_03.jpg" },
        { word: "Mbappé", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg/245px-2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank%E2%80%93129_%28cropped%29.jpg" },
        { word: "Ronaldinho", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ronaldinho_07_2007.jpg/245px-Ronaldinho_07_2007.jpg" }
    ],
    deportes: [
        { word: "Tenis", img: "https://via.placeholder.com/300x200?text=Tenis" },
        { word: "Baloncesto", img: "https://via.placeholder.com/300x200?text=Baloncesto" },
        { word: "Nado", img: "https://via.placeholder.com/300x200?text=Nado" },
        { word: "Maratón", img: "https://via.placeholder.com/300x200?text=Maraton" },
        { word: "Boxeo", img: "https://via.placeholder.com/300x200?text=Boxeo" },
        { word: "Golf", img: "https://via.placeholder.com/300x200?text=Golf" },
        { word: "Rugby", img: "https://via.placeholder.com/300x200?text=Rugby" }
    ],
    trabajos: [
        { word: "Director de cine", img: "https://via.placeholder.com/300x200?text=Director" },
        { word: "Cartero", img: "https://via.placeholder.com/300x200?text=Cartero" },
        { word: "Chef", img: "https://via.placeholder.com/300x200?text=Chef" },
        { word: "Arquitecto", img: "https://via.placeholder.com/300x200?text=Arquitecto" },
        { word: "Veterinario", img: "https://via.placeholder.com/300x200?text=Veterinario" },
        { word: "Programador", img: "https://via.placeholder.com/300x200?text=Programador" },
        { word: "Dentista", img: "https://via.placeholder.com/300x200?text=Dentista" }
    ],
    comida: [
        { word: "Sopa", img: "https://via.placeholder.com/300x200?text=Sopa" },
        { word: "Sushi", img: "https://via.placeholder.com/300x200?text=Sushi" },
        { word: "Taco Mexicano", img: "https://via.placeholder.com/300x200?text=Taco" },
        { word: "Pizza Napolitana", img: "https://via.placeholder.com/300x200?text=Pizza" },
        { word: "Hamburguesa", img: "https://via.placeholder.com/300x200?text=Hamburguesa" },
        { word: "Chipa", img: "https://via.placeholder.com/300x200?text=Chipa" },
        { word: "Empanada", img: "https://via.placeholder.com/300x200?text=Empanada" }
    ],
    // Para aleatorio, uso placeholders rápidos. Deberías poner imágenes reales.
    aleatorio: [
        { word: "Arcoíris", img: "https://via.placeholder.com/300x200?text=Arcoiris" },
        { word: "Montaña Rusa", img: "https://via.placeholder.com/300x200?text=MontanaRusa" },
        { word: "Telescopio", img: "https://via.placeholder.com/300x200?text=Telescopio" },
        // ... (Añade el resto de tus palabras aleatorias con este formato {word: "", img: ""})
        { word: "Asado", img: "https://via.placeholder.com/300x200?text=Asado" },
        { word: "Guitarra", img: "https://via.placeholder.com/300x200?text=Guitarra" }
    ],
    vehiculos: [
        { word: "Automóvil", img: "https://via.placeholder.com/300x200?text=Auto" },
        { word: "Motocicleta", img: "https://via.placeholder.com/300x200?text=Moto" },
        { word: "Bicicleta", img: "https://via.placeholder.com/300x200?text=Bici" },
        { word: "Camión", img: "https://via.placeholder.com/300x200?text=Camion" },
        { word: "Avión", img: "https://via.placeholder.com/300x200?text=Avion" },
        { word: "Barco", img: "https://via.placeholder.com/300x200?text=Barco" },
        { word: "Tren", img: "https://via.placeholder.com/300x200?text=Tren" }
    ],
    animales: [
        { word: "Elefante", img: "https://via.placeholder.com/300x200?text=Elefante" },
        { word: "Tigre", img: "https://via.placeholder.com/300x200?text=Tigre" },
        { word: "Canguro", img: "https://via.placeholder.com/300x200?text=Canguro" },
        { word: "Delfín", img: "https://via.placeholder.com/300x200?text=Delfin" },
        { word: "Águila", img: "https://via.placeholder.com/300x200?text=Aguila" },
        { word: "Serpiente", img: "https://via.placeholder.com/300x200?text=Serpiente" },
        { word: "Jirafa", img: "https://via.placeholder.com/300x200?text=Jirafa" }
    ],
    famosos: [
        { word: "Albert Einstein", img: "https://via.placeholder.com/300x200?text=Einstein" },
        { word: "Marilyn Monroe", img: "https://via.placeholder.com/300x200?text=Marilyn" },
        { word: "Leonardo da Vinci", img: "https://via.placeholder.com/300x200?text=DaVinci" },
        { word: "Cleopatra", img: "https://via.placeholder.com/300x200?text=Cleopatra" },
        { word: "William Shakespeare", img: "https://via.placeholder.com/300x200?text=Shakespeare" },
        { word: "Frida Kahlo", img: "https://via.placeholder.com/300x200?text=Frida" },
        { word: "Brad Pitt", img: "https://via.placeholder.com/300x200?text=BradPitt" }
    ],
    // Los grupos no tienen imágenes por palabra, solo texto.
    GrupoRoman: ["FABRICIO ", "BRUNO", "ARMANDO", "JERE", "DANTE", "LOLO", "JOACO", "MARIO", "Francici", "MAURO", "Juani"],
    GrupoMaxi: ["Maxi", "Agustin", "ExE", "PINI", "GERMAN", "FABRI", "GUSTAVO", "JOEL"],
    Grupo: [{word: "Roman", img: "https://images.pexels.com/photos/10034072/pexels-photo-10034072.jpeg"}]
};

// --- ESTADO ---
let salaActual = null;
let nombreJugador = ''; 
let categoriaSeleccionada = ''; 
let esHost = false;
let supabaseSubscription = null;
let timerInterval = null;    
let votingInterval = null;

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
// I. GESTIÓN DE PANTALLAS Y TABS
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
    cargarCategoriasManuales(); 
}

function mostrarPanelUnirse() {
    nombreJugador = document.getElementById('nombre-jugador').value.trim();
    if (!nombreJugador) return alert('Por favor, ingresa tu nombre primero.');
    mostrarPanel('unirse');
}

// --- LÓGICA DE TABS EN CREAR SALA ---
function cambiarTab(modo) {
    document.getElementById('tab-aleatorio').classList.add('hidden');
    document.getElementById('tab-manual').classList.add('hidden');
    document.getElementById('tab-custom').classList.add('hidden');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`tab-${modo}`).classList.remove('hidden');
    const btns = document.querySelectorAll('.tab-btn');
    if (modo === 'aleatorio') btns[0].classList.add('active');
    if (modo === 'manual') btns[1].classList.add('active');
    if (modo === 'custom') btns[2].classList.add('active');
}

// --- CARGAR CATEGORÍAS CON IMÁGENES EN EL MENÚ ---
function cargarCategoriasManuales() {
    const contenedor = document.getElementById('lista-cats-manual');
    contenedor.innerHTML = '';
    
    Object.keys(data).forEach(key => {
        const btn = document.createElement('button');
        btn.classList.add('categoria-btn', 'categoria-con-imagen'); 

        const imgUrl = categoryImages[key];
        if (imgUrl) {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = key;
            btn.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'categoria-placeholder';
            btn.appendChild(placeholder);
        }

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
    const keys = Object.keys(data);
    return keys[Math.floor(Math.random() * keys.length)];
}

// =========================================================
// II. GESTIÓN DE SALAS
// =========================================================

function generarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// --- FUNCIÓN PRINCIPAL DE CREAR SALA ---
async function crearSala(modo) {
    let catFinal = '';
    let listaPalabrasFinal = [];
    let modoJuego = 'ALEATORIO';

    if (modo === 'aleatorio') {
        catFinal = obtenerCategoriaAleatoria();
        listaPalabrasFinal = data[catFinal];
        modoJuego = 'ALEATORIO';
    } 
    else if (modo === 'manual') {
        if (!categoriaSeleccionada) return alert("Selecciona una categoría de la lista.");
        catFinal = categoriaSeleccionada;
        listaPalabrasFinal = data[catFinal];
        modoJuego = 'FIJO';
    } 
    else if (modo === 'custom') {
        const nombre = document.getElementById('input-custom-titulo').value.trim();
        const palabrasRaw = document.getElementById('input-custom-palabras').value.trim();
        
        if (!nombre) return alert("Ponle nombre a tu categoría.");
        if (!palabrasRaw) return alert("Escribe algunas palabras.");
        
        // Custom categories solo tienen texto por ahora
        const palabrasArray = palabrasRaw.split(',').map(p => p.trim()).filter(p => p.length > 0);
        if (palabrasArray.length < 2) return alert("Necesitas al menos 2 palabras.");
        
        catFinal = nombre;
        listaPalabrasFinal = palabrasArray;
        modoJuego = 'FIJO';
    }

    const codigo = generarCodigo();
    const jugadorId = Date.now().toString(36);

    const { data: nuevaSala, error } = await supabaseClient
        .from('salas')
        .insert({
            codigo: codigo,
            estado: 'ESPERA',
            categoria: catFinal,
            modo_juego: modoJuego,
            lista_palabras: listaPalabrasFinal, 
            tema: '', 
            tema_imagen: null, // Iniciamos sin imagen
            jugadores: [{ id: jugadorId, nombre: nombreJugador, esHost: true, rol: 'PENDIENTE', estado: 'VIVO', voto: null }]
        })
        .select()
        .single();

    if (error) {
        console.error('Error:', error);
        return alert('Error al crear sala. Asegúrate de haber ejecutado el SQL nuevo en Supabase.');
    }

    salaActual = nuevaSala;
    esHost = true;
    
    mostrarSalaEspera(codigo, catFinal);
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
    
    if (nuevaSala.estado === 'ESPERA') {
        document.getElementById('categoria-sala-display').textContent = `Categoría: ${nuevaSala.categoria.toUpperCase()}`;
    }

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

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 1. INICIAR EL JUEGO (CON SELECCIÓN DE IMAGEN) ---
async function iniciarJuegoHost() {
    if (salaActual.jugadores.length < 3) return alert("Mínimo 3 jugadores.");
    
    let categoriaFinal = salaActual.categoria;
    let palabrasFinales = salaActual.lista_palabras; 

    if (salaActual.modo_juego === 'ALEATORIO') {
        const nuevaCat = obtenerCategoriaAleatoria();
        categoriaFinal = nuevaCat;
        palabrasFinales = data[nuevaCat];
    }
    
    // --- LÓGICA DE SELECCIÓN DE TEMA E IMAGEN ---
    const itemElegido = palabrasFinales[Math.floor(Math.random() * palabrasFinales.length)];
    let temaTexto = '';
    let temaImagen = null;

    // Verificamos si el ítem es un objeto (tiene imagen) o un string (solo texto, como los grupos)
    if (typeof itemElegido === 'object' && itemElegido !== null) {
        temaTexto = itemElegido.word;
        temaImagen = itemElegido.img;
    } else {
        temaTexto = itemElegido; // Es un string directo
        temaImagen = null;
    }
    
    // Configurar Impostores
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
    
    // GUARDAR TODO EN SUPABASE (Incluyendo la imagen)
    await supabaseClient
        .from('salas')
        .update({
            estado: 'EN_JUEGO',
            categoria: categoriaFinal,
            lista_palabras: palabrasFinales,
            tema: temaTexto,
            tema_imagen: temaImagen, // Guardamos la URL de la imagen
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

function mostrarPantallaVotacion(jugadores, yo) {
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
            if (esHost) procesarVotacionHost();
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

// --- 5. PANTALLA FINAL (CON IMAGEN REVELADA) ---
function mostrarPantallaVictoria(sala) {
    mostrarPanel('victoria');
    
    const titulo = document.getElementById('titulo-victoria');
    const subtitulo = document.getElementById('subtitulo-victoria');
    const panelVictoria = document.getElementById('victoria-pantalla');
    const palabraFinal = document.getElementById('palabra-final');
    // NUEVO: Referencia a la imagen
    const imagenFinal = document.getElementById('imagen-palabra-final');
    const listaImpostores = document.getElementById('lista-impostores-revelados');
    
    palabraFinal.textContent = sala.tema;

    // NUEVO: Lógica para mostrar/ocultar la imagen
    if (sala.tema_imagen) {
        imagenFinal.src = sala.tema_imagen;
        imagenFinal.classList.remove('hidden');
    } else {
        imagenFinal.src = '';
        imagenFinal.classList.add('hidden');
    }

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
        .update({ estado: 'ESPERA', tema: '', tema_imagen: null, jugadores: jugadoresReset })
        .eq('id', salaActual.id);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarPanel('inicio');
});