let languages = {};
let currentLanguage = null;

async function loadLanguages() {
    const res = await fetch("localization/languages.json");
    languages = await res.json();
}

function setLanguage(language) {
    if (language === currentLanguage) return;
    currentLanguage = language;
    document.querySelectorAll("[data-localize]").forEach(e => {
        const key = e.getAttribute("data-localize");
        const children = e.children;
        if (children.length > 0) {
            for (let index = 0; index < children.length; index++) {
                const child = children[index];
                child.innerHTML = languages?.[language]?.[key]?.[index] ?? defaultText[key][index];
            }
        } else {
            e.innerHTML = languages?.[language]?.[key] ?? defaultText[key];
        }
    });
    localStorage.setItem("language", language);
}