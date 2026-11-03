
import "./style.css"

/* ================= 1. STATO ================= */

const CHIAVE = "todo-tasks"
const CHIAVE_NOME = "todo-nome"

function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)

  if (testo === null) return []

  try {
    const dati = JSON.parse(testo)

    if (!Array.isArray(dati)) return []

    return dati.filter(t =>
      t &&
      Number.isFinite(t.id) &&
      typeof t.title === "string" &&
      typeof t.completed === "boolean"
    )

  } catch (errore) {
    return []
  }
}

let tasks = caricaStato()


/* ================= 2. RIFERIMENTI ================= */

const lista = document.querySelector("#lista")
const info = document.querySelector("#info")
const messaggio = document.querySelector("#messaggio")
const azioni = document.querySelector("#azioni")

const form = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")

const boxBenvenuto = document.querySelector("#benvenuto")


/* ================= 3. PERSISTENZA ================= */

function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

// Unico punto in cui salviamo e aggiorniamo la pagina
function aggiorna() {
  salvaStato()
  render()
}


/* ================= 4. VIEW ================= */

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

  // Generazione della lista
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${escapeHTML(t.title)}</span>
        <button class="elimina" type="button" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")


  // Calcolo dei contatori
  const completati = tasks.filter(t => t.completed).length
  const totali = tasks.length
  const daFare = totali - completati

  info.textContent =
    `Totali: ${totali} · Completati: ${completati} · Da fare: ${daFare}`


  // Messaggio reattivo
  let frase

  if (totali === 0) {
    frase = "Non hai task. Buona giornata."
  } else if (daFare === 0) {
    frase = "Fatto tutto. Complimenti."
  } else {
    frase = `Ti restano ${daFare} task su ${totali}.`
  }

  messaggio.textContent = frase


  // Pulsante per eliminare tutti i completati
  azioni.innerHTML = completati > 0
    ? `<button id="pulisci" type="button">Elimina completati (${completati})</button>`
    : ""
}


/* ================= 5. AZIONI ================= */

function addTask(title) {
  const pulito = title.trim()

  if (pulito === "") return false

  tasks = [
    ...tasks,
    {
      id: Date.now(),
      title: pulito,
      completed: false
    }
  ]

  aggiorna()
  return true
}


function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id
      ? { ...t, completed: !t.completed }
      : t
  )

  aggiorna()
}


function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)

  aggiorna()
}


function deleteCompletati() {
  if (!confirm("Elimino tutti i task completati?")) return

  tasks = tasks.filter(t => !t.completed)

  aggiorna()
}


/* ================= 6. EVENTI ================= */

// Aggiunta di un task
form.addEventListener("submit", evento => {
  evento.preventDefault()

  if (addTask(campo.value)) {
    campo.value = ""
    campo.focus()
  }
})


// Click sulla lista: completamento o eliminazione
lista.addEventListener("click", evento => {
  const elemento = evento.target

  const pulsante = elemento.closest(".elimina")

  if (pulsante) {
    deleteTask(Number(pulsante.dataset.id))
    return
  }

  const riga = elemento.closest("li[data-id]")

  if (riga) {
    toggleTask(Number(riga.dataset.id))
  }
})


// Delega degli eventi per il pulsante dei completati
azioni.addEventListener("click", evento => {
  const pulsante = evento.target.closest("#pulisci")

  if (pulsante) {
    deleteCompletati()
  }
})


/* ================= 7. BENVENUTO ================= */

function renderBenvenuto() {
  const nome = localStorage.getItem(CHIAVE_NOME)

  if (nome) {
    boxBenvenuto.innerHTML =
      `<p>Bentornato, ${escapeHTML(nome)}</p>`

    return
  }

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


// Salvataggio del nome
boxBenvenuto.addEventListener("submit", evento => {
  if (evento.target.id !== "form-nome") return

  evento.preventDefault()

  const campoNome = boxBenvenuto.querySelector("#campo-nome")
  const nome = campoNome.value.trim()

  if (nome === "") {
    campoNome.focus()
    return
  }

  localStorage.setItem(CHIAVE_NOME, nome)

  renderBenvenuto()
})


/* ================= 8. AVVIO ================= */

renderBenvenuto()
render()
