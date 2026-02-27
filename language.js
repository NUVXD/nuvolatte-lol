const translations = {
    italian: {
        // TITLE
        title: "L'Angolo Di Nuvolatte",
        // NAVBAR
        navbarHome: "Casa",
        navbarAbout: "In Merito",
        navbarStuff: "Cose",
        navbarBlog: "Blog",
        navbarAAAH: "AAAH.wav",
        // WINDOW TITLES
        windowTitleRes: "Risorse.exe",
        windowTitleNotes: "Promemoria.exe",
        windowTitleDiscuss: "Discussioni.exe",
        windowTitleWelcome: "Accoglienza.exe",
        windowTitleChanges: "Cambiamenti.exe",
        windowTitleFunny: "FotoDivertenti.exe",
        windowTitleVP: "PianoVirtuale.exe",
        windowTitleSettings: "Impostazioni.exe",
        windowTitleMusic: "Musica.exe",
        // PANELS
        panelRes: "<h1>Naviga!</h1><p>test<br>test<br>test</p>",
        panelWelcome: "<h1>&star; Saluti! &star;</h1><p>test</p>",
        panelNotes: "<h1>DA FA':</h1><p>Rendere i contenuti laterali e centrali flex; rimuovere coordinate statiche</p><p>Tutto</p><p>Cena</p><p>Dormi</p>",
        change2602: "<p>Migliorata la struttura del layout</p><p>Aggiunto il changelog xD</p><p>Aggiunta la possibilità di scegliere il tipo d'onda per il piano virtuale</p><p>Aggiunti i banner laterali, realizzati con blender e paint.net :D</p>",
        change2702: "<p>Aggiunta localizzazione italiana e modificato i pulsanti linguaggio (traduzioni manuali per ora)</p><p>Aggiunto il banner principale, realizzato con SAI2!</p><p>Modificato il design della barra di navigazione, ci saranno comunque altre modifiche in futuro :P</p><p>Migliorate un po' delle icone</p>",
        // VIRTUALPIANO
        vpVolLow: "Basso",
        vpVolHigh: "Alto",
        vpTranspose: "Trasporre:",
        vpWavetype: "Tipo D'Onda:",
        vpWavetype1: "Triangolo",
        vpWavetype2: "Seno",
        // FOOT
        foot: "Scarabocchiato da Nuvola, <br>con odio &hearts;.<br><br><img src='assets/images/gifs/www.gif'></img>"
    }
};

function setLanguage(language) {
    document.querySelectorAll("[data-localize]").forEach(e => {
        const key = e.getAttribute("data-localize");

        if (language == "italian") {
            e.innerHTML = translations.italian[key] ?? defaultText[key];
        } else {
            e.innerHTML = defaultText[key];
        }
    });

    localStorage.setItem("language", language)
}