Ho realizzato una Todo List con HTML, CSS e JavaScript, senza framework. Per avviare il progetto uso Vite.

L'idea è semplice: Scrivere un'attività nel campo e premi Aggiungi (o Invio). Cliccando sul nome della task, essa si segna come completata e appare barrata, mentre con la × la elimini. 

In basso c'è sempre il riepilogo: quante task ci sono in totale, quante sono completate e quante restano da fare, con una frase che cambia in base alla situazione della lista.

Le attività non si perdono chiudendo il browser, perché vengono salvate nel localStorage. Alla prima apertura l'app chiede anche il nome, e nelle visite dopo ti saluta.

Il codice è diviso in tre file: index.html per la struttura della pagina, style.css per la grafica e src/main.js per la logica. Nel JavaScript ho separato i dati (l'array dei task) da quello che si vede sullo schermo: quando succede qualcosa, la funzione render() ridisegna tutto partendo dai dati, così la pagina resta sempre allineata con ciò che è salvato.

## Come si avvia
Bisogna inizializzare il local_proxy perchè npm richiede l'autorizzazione dalla rete, quindi definendo i comandi con l aiuto di gemini sono riuscito a risalire alla proxy che visualizzava la scuola e  l'ho sostituita con la local_proxy (127.0.0.1) con porta 8888.
cosi da poter inizializzare il progetto.

Dalla cartella del progetto:

```bash
npm install
npm run dev
```

Poi apro l'indirizzo che compare nel terminale, come ad esempio: http://localhost:5174/ e posso visualizzare la mia pagina in html.
