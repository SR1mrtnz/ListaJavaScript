
import "./style.css" // Importo il CSS per applicare lo stile alla pagina.


/* ================= 1. STATO ================= */

// Sono le chiavi con cui salvo i dati nel browser.
const CHIAVE = "todo-tasks"
const CHIAVE_NOME = "todo-nome"


function caricaStato() {
  // Recupero i task salvati nel browser.
  const testo = localStorage.getItem(CHIAVE)

  // Se non trovo nulla, parto con una lista vuota.
  if (testo === null) return []

  try {
    // Trasformo il testo JSON in un array JavaScript.
    const dati = JSON.parse(testo)

    // Controllo che il dato recuperato sia un array.
    if (!Array.isArray(dati)) return []

    // Tengo solo i task con i campi corretti.
    return dati.filter(t =>
      t &&
      Number.isFinite(t.id) &&
      typeof t.title === "string" &&
      typeof t.completed === "boolean"
    )

  } catch (errore) {
    // Se i dati non sono validi, evito che l'app si blocchi.
    return []
  }
}

// All'avvio recupero i task salvati.
let tasks = caricaStato()



/* ================= 2. RIFERIMENTI ================= */

// Collego JavaScript agli elementi presenti nell'HTML.
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")
const messaggio = document.querySelector("#messaggio")
const azioni = document.querySelector("#azioni")

const form = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")

const boxBenvenuto = document.querySelector("#benvenuto")



/* ================= 3. PERSISTENZA ================= */

function salvaStato() {
  // Converto l'array in JSON e lo salvo nel browser.
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}


// Questo è l'unico punto in cui salvo e aggiorno la pagina.
function aggiorna() {
  salvaStato()
  render()
}



/* ================= 4. VIEW ================= */

// Evito che caratteri speciali inseriti dall'utente
// vengano interpretati come codice HTML.
function escapeHTML(testo) {
  return String(testo).replace(/[&<>"']/g, carattere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[carattere])
}


function render() {

  // Creo una riga HTML per ogni task presente nell'array.
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${escapeHTML(t.title)}</span>
        <button class="elimina" type="button" data-id="${t.id}">×</button>
      </li>
    `)
    .join("") // Unisco tutte le righe in un'unica stringa HTML.


  // Conto quanti task sono completati.
  const completati = tasks.filter(t => t.completed).length

  // Calcolo il numero totale dei task.
  const totali = tasks.length

  // Calcolo quelli ancora da completare.
  const daFare = totali - completati

  // Mostro i tre numeri nella pagina.
  info.textContent =
    `Totali: ${totali} · Completati: ${completati} · Da fare: ${daFare}`


  // Preparo un messaggio diverso in base alla situazione.
  let frase

  if (totali === 0) {
    frase = "Non hai task. Buona giornata."
  } else if (daFare === 0) {
    frase = "Fatto tutto. Complimenti."
  } else {
    frase = `Ti restano ${daFare} task su ${totali}.`
  }

  // Inserisco il messaggio nella pagina.
  messaggio.textContent = frase


  // Mostro il pulsante solo se esistono task completati.
  azioni.innerHTML = completati > 0
    ? `<button id="pulisci" type="button">Elimina completati (${completati})</button>`
    : ""
}



/* ================= 5. AZIONI ================= */

// Aggiunge un nuovo task alla lista.
function addTask(title) {

  // Elimino gli spazi inutili all'inizio e alla fine.
  const pulito = title.trim()

  // Se il campo è vuoto, non aggiungo niente.
  if (pulito === "") return false

  // Creo un nuovo array con dentro anche il nuovo task.
  tasks = [
    ...tasks,
    {
      id: Date.now(), // Creo un identificativo.
      title: pulito,  // Salvo il testo scritto.
      completed: false // Il task nasce non completato.
    }
  ]

  aggiorna() // Salvo i dati e ridisegno la pagina.
  return true
}


// Cambia lo stato di un task: fatto oppure da fare.
function toggleTask(id) {

  // Creo un nuovo array modificando solo il task scelto.
  tasks = tasks.map(t =>
    t.id === id
      ? { ...t, completed: !t.completed }
      : t
  )

  aggiorna()
}


// Elimina un singolo task.
function deleteTask(id) {

  // Creo un array senza il task con quell'identificativo.
  tasks = tasks.filter(t => t.id !== id)

  aggiorna()
}


// Elimina tutti i task già completati.
function deleteCompletati() {

  // Chiedo conferma prima di cancellare.
  if (!confirm("Elimino tutti i task completati?")) return

  // Tengo soltanto i task non completati.
  tasks = tasks.filter(t => !t.completed)

  aggiorna()
}



/* ================= 6. EVENTI ================= */

// Intercetto l'invio del form per aggiungere un task.
form.addEventListener("submit", evento => {

  // Evito il ricaricamento automatico della pagina.
  evento.preventDefault()

  // Aggiungo il task e controllo che il campo non sia vuoto.
  if (addTask(campo.value)) {

    // Dopo l'aggiunta svuoto il campo.
    campo.value = ""

    // Riporto il cursore nel campo di testo.
    campo.focus()
  }
})


// Gestisco i click sulla lista con un solo listener.
lista.addEventListener("click", evento => {

  // Capisco su quale elemento è stato fatto click.
  const elemento = evento.target

  // Controllo se è stato premuto il pulsante elimina.
  const pulsante = elemento.closest(".elimina")

  if (pulsante) {
    deleteTask(Number(pulsante.dataset.id))
    return // Esco per non completare anche il task.
  }

  // Altrimenti cerco la riga del task cliccato.
  const riga = elemento.closest("li[data-id]")

  if (riga) {
    // Cambio il suo stato da fatto a da fare o viceversa.
    toggleTask(Number(riga.dataset.id))
  }
})


// Gestisco il pulsante per eliminare i completati.
azioni.addEventListener("click", evento => {

  // Controllo se è stato premuto il pulsante giusto.
  const pulsante = evento.target.closest("#pulisci")

  if (pulsante) {
    deleteCompletati()
  }
})



/* ================= 7. BENVENUTO ================= */

// Mostra il saluto oppure il campo per inserire il nome.
function renderBenvenuto() {

  // Controllo se il nome è già stato salvato.
  const nome = localStorage.getItem(CHIAVE_NOME)

  if (nome) {

    // Se esiste, mostro il messaggio di bentornato.
    boxBenvenuto.innerHTML =
      `<p>Bentornato, ${escapeHTML(nome)}</p>`

    return
  }

  // Se non esiste, mostro il campo per inserire il nome.
  boxBenvenuto.innerHTML = `
    <form id="form-nome">
      <input
        type="text"
        id="campo-nome"
        placeholder="Come ti chiami?"
        autocomplete="off"
        required
      >
      <button type="submit">Salva</button>
    </form>
  `
}


// Intercetto l'invio del form del nome.
boxBenvenuto.addEventListener("submit", evento => {

  // Mi assicuro che sia il form del nome.
  if (evento.target.id !== "form-nome") return

  evento.preventDefault()

  // Recupero il nome scritto dall'utente.
  const campoNome = boxBenvenuto.querySelector("#campo-nome")
  const nome = campoNome.value.trim()

  // Non permetto di salvare un nome vuoto.
  if (nome === "") {
    campoNome.focus()
    return
  }

  // Salvo il nome nel browser.
  localStorage.setItem(CHIAVE_NOME, nome)

  // Ridisegno il saluto senza mostrare di nuovo il form.
  renderBenvenuto()
})



/* ================= 8. AVVIO ================= */

// Mostro il benvenuto e poi disegno tutta la lista.
renderBenvenuto()
render()
