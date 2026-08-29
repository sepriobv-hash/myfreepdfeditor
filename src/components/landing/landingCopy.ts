import type { SupportedLocale } from "@/lib/i18n";

type TextBlock = {
  title: string;
  text: string;
};

export type LandingCopy = {
  nav: {
    tools: string;
    allTools: string;
    about: string;
    security: string;
    faq: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    badges: string[];
  };
  upload: {
    title: string;
    description: string;
    button: string;
    privacy: string;
    socialProof: {
      rating: string;
      text: string;
    };
  };
  trustItems: string[];
  tools: {
    eyebrow: string;
    title: string;
    description: string;
    cards: TextBlock[];
  };
  workflow: {
    eyebrow: string;
    title: string;
    description: string;
    features: string[];
    previewLabel: string;
  };
  steps: TextBlock[];
  security: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    cards: TextBlock[];
  };
  faq: {
    eyebrow: string;
    title: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
  footer: {
    language: string;
    tagline: string;
    editor: string;
    allTools: string;
    about: string;
    security: string;
    privacy: string;
    faq: string;
  };
};

export const landingCopyByLocale: Record<SupportedLocale, LandingCopy> = {
  en: {
    nav: {
      tools: "Tools",
      allTools: "All Tools",
      about: "About",
      security: "Security",
      faq: "FAQ",
      cta: "Edit PDF Free",
    },
    hero: {
      badge: "Free online PDF editor with browser-first file handling",
      title: "Free PDF Editor Online",
      description:
        "Upload a PDF for free, edit existing text visually, add images, signatures, highlights, drawings, and page changes, then download the edited PDF with no signup and no watermark.",
      badges: ["No signup needed", "No watermark", "Files stay on your device"],
    },
    upload: {
      title: "Drop your PDF here",
      description:
        "Upload a PDF to edit text, images, highlights, signatures, drawings, and pages in your browser.",
      button: "Choose PDF",
      privacy: "Files stay in browser memory by default",
      socialProof: {
        rating: "Free",
        text: "No signup, no watermark, browser-first editing",
      },
    },
    trustItems: [
      "Works in modern browsers",
      "Best with text-based PDFs",
      "Scanned PDFs need OCR",
      "Password-protected PDFs may not open",
    ],
    tools: {
      eyebrow: "Free PDF tools",
      title: "Everything you need for everyday PDF editing",
      description:
        "Built for common document workflows: quick corrections, signatures, review notes, branded pages, and secure browser-based export.",
      cards: [
        {
          title: "Edit PDF text",
          text: "Click detected text, replace it visually, tune font size, color, spacing, and export cleanly for free.",
        },
        {
          title: "Add images",
          text: "Insert PNG, JPG, and WebP images, then move, resize, rotate, and layer them on any page.",
        },
        {
          title: "Sign documents",
          text: "Draw a signature or upload one, place it precisely, and keep it editable until export.",
        },
        {
          title: "Highlight and annotate",
          text: "Add highlights, shapes, lines, and freehand notes for review workflows.",
        },
        {
          title: "Manage pages",
          text: "Preview pages, reorder, duplicate, and delete pages before downloading the final file.",
        },
        {
          title: "Export securely",
          text: "Download a real edited PDF while preserving the original page content.",
        },
      ],
    },
    workflow: {
      eyebrow: "Free editor workflow",
      title: "A complete editor, not just an upload box",
      description:
        "The editor opens with page thumbnails, a precision canvas, a tool toolbar, properties, zoom controls, keyboard shortcuts, undo and redo, and a real download flow.",
      features: [
        "Replace existing text visually",
        "Add fillable-looking text boxes",
        "Draw and annotate freehand",
        "Insert signatures and stamps",
        "Add images and logos",
        "Highlight important passages",
        "Duplicate and delete pages",
        "Undo and redo changes",
        "Export edited PDFs",
        "Compress PDF files in your browser",
        "Merge multiple PDFs locally",
        "Work without cloud storage by default",
      ],
      previewLabel: "MyFreePDFEditor editor",
    },
    steps: [
      {
        title: "Upload your PDF",
        text: "Drag a file into the wide upload area or choose one from your computer.",
      },
      {
        title: "Edit visually",
        text: "Use the editor toolbar to change text, sign, draw, highlight, add images, and organize pages.",
      },
      {
        title: "Download the result",
        text: "Export a new PDF file with your edits embedded into the document.",
      },
    ],
    security: {
      eyebrow: "Privacy that makes sense",
      title: "Edit the file without handing over your whole document workflow",
      paragraphs: [
        "Most people just need to fix a typo, sign a form, add an image, or highlight a page. You should not need to create an account, upload a sensitive document to permanent cloud storage, or enter payment details before doing that.",
        "MyFreePDFEditor keeps the free editor workflow browser-first. The homepage upload uses temporary storage on your own device only to move the file safely into the editor after navigation. Future cloud saving should be opt-in, visible, and easy to understand.",
      ],
      cards: [
        { title: "Start without an account", text: "Open the editor and work on a PDF immediately." },
        { title: "Temporary local handoff", text: "The upload handoff is stored in your browser, not as a public file." },
        { title: "Download when finished", text: "Export the edited PDF and keep control of where it goes." },
        { title: "Cloud later, by choice", text: "Future accounts should be optional for users who want saved workspaces." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions about editing PDFs online",
    },
    cta: {
      title: "Ready to edit your PDF?",
      description: "Start with a local upload, edit visually, and download a clean PDF without a complex setup.",
      button: "Open Free Editor",
    },
    footer: {
      language: "Language",
      tagline: "Modern browser-based PDF editing",
      editor: "Editor",
      allTools: "All Tools",
      about: "About",
      security: "Security",
      privacy: "Privacy",
      faq: "FAQ",
    },
  },
  nl: {
    nav: {
      tools: "Tools",
      allTools: "Alle tools",
      about: "Over ons",
      security: "Privacy",
      faq: "FAQ",
      cta: "PDF gratis bewerken",
    },
    hero: {
      badge: "Gratis online PDF-editor met browsergerichte bestandsverwerking",
      title: "Gratis PDF Editor Online",
      description:
        "Upload gratis een PDF, bewerk bestaande tekst visueel, voeg afbeeldingen, handtekeningen, markeringen, tekeningen en paginawijzigingen toe en download daarna je bewerkte PDF zonder account en zonder watermerk.",
      badges: ["Geen account nodig", "Geen watermerk", "Bestanden blijven op je apparaat"],
    },
    upload: {
      title: "Sleep je PDF hierheen",
      description:
        "Upload een PDF om tekst, afbeeldingen, markeringen, handtekeningen, tekeningen en pagina's in je browser te bewerken.",
      button: "Kies PDF",
      privacy: "Bestanden blijven standaard in het browsergeheugen",
      socialProof: {
        rating: "Gratis",
        text: "Geen account, geen watermerk, browsergericht bewerken",
      },
    },
    trustItems: [
      "Werkt in moderne browsers",
      "Werkt het best met tekst-PDF's",
      "Gescande PDF's hebben OCR nodig",
      "Beveiligde PDF's openen mogelijk niet",
    ],
    tools: {
      eyebrow: "Gratis PDF-tools",
      title: "Alles voor dagelijkse PDF-bewerkingen",
      description:
        "Gemaakt voor veelgebruikte documenttaken: snelle correcties, handtekeningen, review-notities, merkpagina's en veilige export vanuit de browser.",
      cards: [
        { title: "PDF-tekst bewerken", text: "Klik op gevonden tekst, vervang die visueel en pas lettergrootte, kleur en spacing aan." },
        { title: "Afbeeldingen toevoegen", text: "Voeg PNG-, JPG- en WebP-afbeeldingen toe en verplaats, schaal en roteer ze op elke pagina." },
        { title: "Documenten ondertekenen", text: "Teken of upload een handtekening en plaats die precies waar je wilt." },
        { title: "Markeren en annoteren", text: "Gebruik markeringen, vormen, lijnen en vrije tekeningen voor opmerkingen en review." },
        { title: "Pagina's beheren", text: "Bekijk, herschik, dupliceer en verwijder pagina's voordat je downloadt." },
        { title: "Veilig exporteren", text: "Download een echte bewerkte PDF terwijl de oorspronkelijke pagina-inhoud behouden blijft." },
      ],
    },
    workflow: {
      eyebrow: "Gratis editor workflow",
      title: "Een complete editor, niet alleen een uploadvak",
      description:
        "De editor opent met paginavoorbeelden, een nauwkeurig canvas, toolbar, eigenschappen, zoom, sneltoetsen, undo, redo en een echte downloadflow.",
      features: [
        "Bestaande tekst visueel vervangen",
        "Tekstvakken toevoegen",
        "Vrij tekenen en annoteren",
        "Handtekeningen en stempels invoegen",
        "Afbeeldingen en logo's toevoegen",
        "Belangrijke tekst markeren",
        "Pagina's dupliceren en verwijderen",
        "Undo en redo",
        "Bewerkte PDF's exporteren",
        "PDF-bestanden comprimeren in je browser",
        "Meerdere PDF's lokaal samenvoegen",
        "Werk standaard zonder cloudopslag",
      ],
      previewLabel: "MyFreePDFEditor editor",
    },
    steps: [
      { title: "Upload je PDF", text: "Sleep een bestand naar het brede uploadvlak of kies er een op je computer." },
      { title: "Bewerk visueel", text: "Verander tekst, onderteken, teken, markeer, voeg afbeeldingen toe en beheer pagina's." },
      { title: "Download het resultaat", text: "Exporteer een nieuwe PDF met je bewerkingen erin verwerkt." },
    ],
    security: {
      eyebrow: "Privacy die logisch voelt",
      title: "Bewerk je bestand zonder je hele documentproces weg te geven",
      paragraphs: [
        "Meestal wil je gewoon een typefout herstellen, een formulier ondertekenen, een afbeelding toevoegen of iets markeren. Daarvoor zou je geen account, permanente cloudopslag of betaalgegevens nodig moeten hebben.",
        "MyFreePDFEditor houdt de gratis editor browser-first. De upload vanaf de homepage gebruikt tijdelijke opslag op je eigen apparaat om het bestand veilig naar de editor te brengen.",
      ],
      cards: [
        { title: "Start zonder account", text: "Open de editor en werk direct aan je PDF." },
        { title: "Tijdelijke lokale overdracht", text: "De uploadoverdracht staat in je browser, niet als publiek bestand." },
        { title: "Download wanneer je klaar bent", text: "Exporteer je PDF en bepaal zelf waar die wordt opgeslagen." },
        { title: "Cloud later, op keuze", text: "Toekomstige accounts horen optioneel te zijn voor opgeslagen werkruimtes." },
      ],
    },
    faq: { eyebrow: "FAQ", title: "Vragen over PDF's online bewerken" },
    cta: { title: "Klaar om je PDF te bewerken?", description: "Upload lokaal, bewerk visueel en download een nette PDF.", button: "Open gratis editor" },
    footer: { language: "Taal", tagline: "Moderne PDF-bewerking in je browser", editor: "Editor", allTools: "Alle tools", about: "Over ons", security: "Beveiliging", privacy: "Privacy", faq: "FAQ" },
  },
  de: {
    nav: {
      tools: "Werkzeuge",
      allTools: "Alle Werkzeuge",
      about: "Ueber uns",
      security: "Datenschutz",
      faq: "FAQ",
      cta: "PDF kostenlos bearbeiten",
    },
    hero: {
      badge: "Kostenloser Online-PDF-Editor mit browserbasierter Dateiverarbeitung",
      title: "Kostenloser PDF Editor Online",
      description:
        "Lade eine PDF kostenlos hoch, bearbeite vorhandenen Text visuell, fuege Bilder, Unterschriften, Markierungen, Zeichnungen und Seitenanpassungen hinzu und lade die bearbeitete PDF ohne Konto und ohne Wasserzeichen herunter.",
      badges: ["Kein Konto erforderlich", "Kein Wasserzeichen", "Dateien bleiben auf deinem Geraet"],
    },
    upload: {
      title: "PDF hier ablegen",
      description:
        "Lade eine PDF hoch, um Text, Bilder, Markierungen, Unterschriften, Zeichnungen und Seiten im Browser zu bearbeiten.",
      button: "PDF auswaehlen",
      privacy: "Dateien bleiben standardmaessig im Browserspeicher",
      socialProof: {
        rating: "Kostenlos",
        text: "Kein Konto, kein Wasserzeichen, Bearbeitung im Browser",
      },
    },
    trustItems: [
      "Funktioniert in modernen Browsern",
      "Am besten mit textbasierten PDFs",
      "Gescannte PDFs benoetigen OCR",
      "Passwortgeschuetzte PDFs lassen sich eventuell nicht oeffnen",
    ],
    tools: {
      eyebrow: "Kostenlose PDF-Werkzeuge",
      title: "Alles fuer taegliche PDF-Bearbeitung",
      description:
        "Gebaut fuer typische Dokumentaufgaben: schnelle Korrekturen, Unterschriften, Review-Notizen, Markenseiten und sicherer Export im Browser.",
      cards: [
        { title: "PDF-Text bearbeiten", text: "Klicke erkannten Text an, ersetze ihn visuell und passe Groesse, Farbe und Abstand an." },
        { title: "Bilder hinzufuegen", text: "Fuege PNG-, JPG- und WebP-Bilder ein und verschiebe, skaliere oder drehe sie auf jeder Seite." },
        { title: "Dokumente unterschreiben", text: "Zeichne oder lade eine Unterschrift hoch und platziere sie exakt." },
        { title: "Markieren und kommentieren", text: "Nutze Markierungen, Formen, Linien und freie Zeichnungen fuer Reviews." },
        { title: "Seiten verwalten", text: "Vorschau, Sortieren, Duplizieren und Loeschen von Seiten vor dem Download." },
        { title: "Sicher exportieren", text: "Lade eine echte bearbeitete PDF herunter, waehrend der Originalinhalt erhalten bleibt." },
      ],
    },
    workflow: {
      eyebrow: "Kostenloser Editor-Workflow",
      title: "Ein kompletter Editor, nicht nur ein Upload-Feld",
      description:
        "Der Editor bietet Seitenvorschauen, eine praezise Arbeitsflaeche, Toolbar, Eigenschaften, Zoom, Shortcuts, Undo, Redo und einen echten Downloadablauf.",
      features: [
        "Vorhandenen Text visuell ersetzen",
        "Textfelder hinzufuegen",
        "Frei zeichnen und kommentieren",
        "Unterschriften und Stempel einfuegen",
        "Bilder und Logos hinzufuegen",
        "Wichtige Stellen markieren",
        "Seiten duplizieren und loeschen",
        "Undo und Redo",
        "Bearbeitete PDFs exportieren",
        "PDF-Dateien im Browser komprimieren",
        "Mehrere PDFs lokal zusammenfuegen",
        "Standardmaessig ohne Cloud-Speicherung arbeiten",
      ],
      previewLabel: "MyFreePDFEditor Editor",
    },
    steps: [
      { title: "PDF hochladen", text: "Ziehe eine Datei in den grossen Uploadbereich oder waehle sie auf deinem Computer aus." },
      { title: "Visuell bearbeiten", text: "Aendere Text, unterschreibe, zeichne, markiere, fuege Bilder hinzu und organisiere Seiten." },
      { title: "Ergebnis herunterladen", text: "Exportiere eine neue PDF mit deinen eingebetteten Bearbeitungen." },
    ],
    security: {
      eyebrow: "Datenschutz, der Sinn ergibt",
      title: "Bearbeite die Datei, ohne deinen ganzen Dokumentenprozess abzugeben",
      paragraphs: [
        "Meist moechtest du nur einen Tippfehler korrigieren, ein Formular unterschreiben, ein Bild einfuegen oder etwas markieren. Dafuer sollte kein Konto und keine Zahlung noetig sein.",
        "MyFreePDFEditor haelt den kostenlosen Workflow browser-first. Der Upload von der Startseite nutzt temporaeren Speicher auf deinem eigenen Geraet.",
      ],
      cards: [
        { title: "Ohne Konto starten", text: "Editor oeffnen und sofort an der PDF arbeiten." },
        { title: "Temporaere lokale Uebergabe", text: "Die Upload-Uebergabe liegt im Browser, nicht als oeffentliche Datei." },
        { title: "Download nach Abschluss", text: "Exportiere die PDF und behalte die Kontrolle ueber den Speicherort." },
        { title: "Cloud spaeter, nach Wahl", text: "Zukuenftige Konten sollten optional fuer gespeicherte Arbeitsbereiche sein." },
      ],
    },
    faq: { eyebrow: "FAQ", title: "Fragen zum Online-Bearbeiten von PDFs" },
    cta: { title: "Bereit, deine PDF zu bearbeiten?", description: "Lade lokal hoch, bearbeite visuell und lade eine saubere PDF herunter.", button: "Kostenlosen Editor oeffnen" },
    footer: { language: "Sprache", tagline: "Moderne PDF-Bearbeitung im Browser", editor: "Editor", allTools: "Alle Werkzeuge", about: "Ueber uns", security: "Sicherheit", privacy: "Datenschutz", faq: "FAQ" },
  },
  fr: {
    nav: { tools: "Outils", allTools: "Tous les outils", about: "A propos", security: "Confidentialite", faq: "FAQ", cta: "Modifier PDF gratuit" },
    hero: {
      badge: "Editeur PDF en ligne gratuit avec traitement des fichiers dans le navigateur",
      title: "Editeur PDF Gratuit en Ligne",
      description:
        "Importez un PDF gratuitement, modifiez le texte existant visuellement, ajoutez images, signatures, surlignages, dessins et changements de pages, puis telechargez le PDF modifie sans compte et sans filigrane.",
      badges: ["Sans compte", "Sans filigrane", "Fichiers sur votre appareil"],
    },
    upload: {
      title: "Deposez votre PDF ici",
      description:
        "Importez un PDF pour modifier texte, images, surlignages, signatures, dessins et pages dans votre navigateur.",
      button: "Choisir un PDF",
      privacy: "Les fichiers restent par defaut en memoire dans le navigateur",
      socialProof: {
        rating: "Gratuit",
        text: "Sans compte, sans filigrane, edition dans le navigateur",
      },
    },
    trustItems: [
      "Fonctionne dans les navigateurs modernes",
      "Ideal avec les PDF contenant du texte",
      "Les PDF numerises necessitent l'OCR",
      "Les PDF proteges peuvent ne pas s'ouvrir",
    ],
    tools: {
      eyebrow: "Outils PDF gratuits",
      title: "Tout pour modifier des PDF au quotidien",
      description:
        "Concu pour les taches courantes: corrections rapides, signatures, notes de revue, pages de marque et export securise depuis le navigateur.",
      cards: [
        { title: "Modifier le texte PDF", text: "Cliquez sur le texte detecte, remplacez-le visuellement et ajustez taille, couleur et espacement." },
        { title: "Ajouter des images", text: "Inserez PNG, JPG et WebP, puis deplacez, redimensionnez et faites pivoter sur chaque page." },
        { title: "Signer des documents", text: "Dessinez ou importez une signature et placez-la precisement." },
        { title: "Surligner et annoter", text: "Ajoutez surlignages, formes, lignes et dessins libres pour vos revues." },
        { title: "Gerer les pages", text: "Previsualisez, reorganisez, dupliquez et supprimez des pages avant le telechargement." },
        { title: "Exporter en securite", text: "Telechargez un vrai PDF modifie tout en conservant le contenu original." },
      ],
    },
    workflow: {
      eyebrow: "Flux d'edition gratuit",
      title: "Un editeur complet, pas seulement une zone d'import",
      description:
        "L'editeur propose miniatures de pages, canevas precis, barre d'outils, proprietes, zoom, raccourcis, annuler, retablir et vrai flux de telechargement.",
      features: [
        "Remplacer visuellement le texte existant",
        "Ajouter des zones de texte",
        "Dessiner et annoter librement",
        "Inserer signatures et tampons",
        "Ajouter images et logos",
        "Surligner les passages importants",
        "Dupliquer et supprimer des pages",
        "Annuler et retablir",
        "Exporter des PDF modifies",
        "Compresser des PDF dans le navigateur",
        "Fusionner plusieurs PDF localement",
        "Travailler sans stockage cloud par defaut",
      ],
      previewLabel: "Editeur MyFreePDFEditor",
    },
    steps: [
      { title: "Importer votre PDF", text: "Deposez un fichier dans la grande zone d'import ou choisissez-le sur votre ordinateur." },
      { title: "Modifier visuellement", text: "Changez le texte, signez, dessinez, surlignez, ajoutez des images et organisez les pages." },
      { title: "Telecharger le resultat", text: "Exportez un nouveau PDF avec vos modifications integrees." },
    ],
    security: {
      eyebrow: "Une confidentialite claire",
      title: "Modifiez votre fichier sans abandonner tout votre flux documentaire",
      paragraphs: [
        "La plupart du temps, il suffit de corriger une faute, signer un formulaire, ajouter une image ou surligner une page. Cela ne devrait pas demander un compte ou un paiement.",
        "MyFreePDFEditor garde le flux gratuit centre sur le navigateur. L'import depuis la page d'accueil utilise un stockage temporaire sur votre appareil.",
      ],
      cards: [
        { title: "Commencer sans compte", text: "Ouvrez l'editeur et travaillez immediatement sur un PDF." },
        { title: "Transfert local temporaire", text: "Le transfert d'import reste dans votre navigateur, pas comme fichier public." },
        { title: "Telecharger a la fin", text: "Exportez le PDF et gardez le controle de son emplacement." },
        { title: "Cloud plus tard, par choix", text: "Les futurs comptes doivent rester optionnels pour les espaces sauvegardes." },
      ],
    },
    faq: { eyebrow: "FAQ", title: "Questions sur la modification de PDF en ligne" },
    cta: { title: "Pret a modifier votre PDF?", description: "Importez localement, modifiez visuellement et telechargez un PDF propre.", button: "Ouvrir l'editeur gratuit" },
    footer: { language: "Langue", tagline: "Edition PDF moderne dans le navigateur", editor: "Editeur", allTools: "Tous les outils", about: "A propos", security: "Securite", privacy: "Confidentialite", faq: "FAQ" },
  },
  es: {
    nav: { tools: "Herramientas", allTools: "Todas las herramientas", about: "Acerca de", security: "Privacidad", faq: "FAQ", cta: "Editar PDF gratis" },
    hero: {
      badge: "Editor PDF online gratis con manejo de archivos desde el navegador",
      title: "Editor PDF Gratis Online",
      description:
        "Sube un PDF gratis, edita texto existente de forma visual, agrega imagenes, firmas, resaltados, dibujos y cambios de paginas, y descarga el PDF editado sin registro y sin marca de agua.",
      badges: ["Sin registro", "Sin marca de agua", "Archivos en tu dispositivo"],
    },
    upload: {
      title: "Suelta tu PDF aqui",
      description:
        "Sube un PDF para editar texto, imagenes, resaltados, firmas, dibujos y paginas en tu navegador.",
      button: "Elegir PDF",
      privacy: "Los archivos permanecen por defecto en la memoria del navegador",
      socialProof: {
        rating: "Gratis",
        text: "Sin registro, sin marca de agua, edicion en el navegador",
      },
    },
    trustItems: [
      "Funciona en navegadores modernos",
      "Ideal con PDF basados en texto",
      "Los PDF escaneados necesitan OCR",
      "Los PDF protegidos pueden no abrirse",
    ],
    tools: {
      eyebrow: "Herramientas PDF gratis",
      title: "Todo para editar PDF en el dia a dia",
      description:
        "Creado para flujos comunes: correcciones rapidas, firmas, notas de revision, paginas de marca y exportacion segura desde el navegador.",
      cards: [
        { title: "Editar texto PDF", text: "Haz clic en texto detectado, reemplazalo visualmente y ajusta tamano, color y espaciado." },
        { title: "Agregar imagenes", text: "Inserta PNG, JPG y WebP, y muevelas, redimensionalas o rotalas en cualquier pagina." },
        { title: "Firmar documentos", text: "Dibuja o sube una firma y colocala con precision." },
        { title: "Resaltar y anotar", text: "Agrega resaltados, formas, lineas y dibujos libres para revisar documentos." },
        { title: "Gestionar paginas", text: "Previsualiza, reordena, duplica y elimina paginas antes de descargar." },
        { title: "Exportar de forma segura", text: "Descarga un PDF editado real conservando el contenido original." },
      ],
    },
    workflow: {
      eyebrow: "Flujo de editor gratis",
      title: "Un editor completo, no solo una caja de subida",
      description:
        "El editor abre con miniaturas, lienzo preciso, barra de herramientas, propiedades, zoom, atajos, deshacer, rehacer y descarga real.",
      features: [
        "Reemplazar texto existente visualmente",
        "Agregar cuadros de texto",
        "Dibujar y anotar libremente",
        "Insertar firmas y sellos",
        "Agregar imagenes y logos",
        "Resaltar partes importantes",
        "Duplicar y eliminar paginas",
        "Deshacer y rehacer",
        "Exportar PDF editados",
        "Comprimir PDF en el navegador",
        "Unir varios PDF localmente",
        "Trabajar sin almacenamiento cloud por defecto",
      ],
      previewLabel: "Editor MyFreePDFEditor",
    },
    steps: [
      { title: "Sube tu PDF", text: "Arrastra un archivo al area de subida amplia o elige uno desde tu ordenador." },
      { title: "Edita visualmente", text: "Cambia texto, firma, dibuja, resalta, agrega imagenes y organiza paginas." },
      { title: "Descarga el resultado", text: "Exporta un nuevo PDF con tus cambios integrados." },
    ],
    security: {
      eyebrow: "Privacidad que tiene sentido",
      title: "Edita el archivo sin entregar todo tu flujo documental",
      paragraphs: [
        "La mayoria solo necesita corregir un error, firmar un formulario, agregar una imagen o resaltar una pagina. No deberia exigir cuenta ni pago.",
        "MyFreePDFEditor mantiene el flujo gratis centrado en el navegador. La subida desde la pagina inicial usa almacenamiento temporal en tu propio dispositivo.",
      ],
      cards: [
        { title: "Empieza sin cuenta", text: "Abre el editor y trabaja en un PDF de inmediato." },
        { title: "Transferencia local temporal", text: "La transferencia de subida queda en tu navegador, no como archivo publico." },
        { title: "Descarga al terminar", text: "Exporta el PDF y controla donde se guarda." },
        { title: "Nube despues, por eleccion", text: "Las cuentas futuras deberian ser opcionales para espacios guardados." },
      ],
    },
    faq: { eyebrow: "FAQ", title: "Preguntas sobre editar PDF online" },
    cta: { title: "Listo para editar tu PDF?", description: "Sube el archivo localmente, edita visualmente y descarga un PDF limpio.", button: "Abrir editor gratis" },
    footer: { language: "Idioma", tagline: "Edicion PDF moderna en el navegador", editor: "Editor", allTools: "Todas las herramientas", about: "Acerca de", security: "Seguridad", privacy: "Privacidad", faq: "FAQ" },
  },
  it: {
    nav: { tools: "Strumenti", allTools: "Tutti gli strumenti", about: "Chi siamo", security: "Privacy", faq: "FAQ", cta: "Modifica PDF gratis" },
    hero: {
      badge: "Editor PDF online gratuito con gestione dei file nel browser",
      title: "Editor PDF Gratis Online",
      description:
        "Carica un PDF gratis, modifica visivamente il testo esistente, aggiungi immagini, firme, evidenziazioni, disegni e modifiche alle pagine, poi scarica il PDF modificato senza account e senza filigrana.",
      badges: ["Nessun account", "Nessuna filigrana", "File sul tuo dispositivo"],
    },
    upload: {
      title: "Trascina qui il PDF",
      description:
        "Carica un PDF per modificare testo, immagini, evidenziazioni, firme, disegni e pagine nel browser.",
      button: "Scegli PDF",
      privacy: "I file restano per default nella memoria del browser",
      socialProof: {
        rating: "Gratis",
        text: "Nessun account, nessuna filigrana, modifica nel browser",
      },
    },
    trustItems: [
      "Funziona nei browser moderni",
      "Ideale con PDF basati su testo",
      "I PDF scansionati richiedono OCR",
      "I PDF protetti potrebbero non aprirsi",
    ],
    tools: {
      eyebrow: "Strumenti PDF gratuiti",
      title: "Tutto per modificare PDF ogni giorno",
      description:
        "Pensato per flussi comuni: correzioni rapide, firme, note di revisione, pagine brandizzate ed export sicuro dal browser.",
      cards: [
        { title: "Modifica testo PDF", text: "Clicca sul testo rilevato, sostituiscilo visivamente e regola dimensione, colore e spaziatura." },
        { title: "Aggiungi immagini", text: "Inserisci PNG, JPG e WebP, poi spostale, ridimensionale e ruotale su ogni pagina." },
        { title: "Firma documenti", text: "Disegna o carica una firma e posizionala con precisione." },
        { title: "Evidenzia e annota", text: "Aggiungi evidenziazioni, forme, linee e disegni liberi per la revisione." },
        { title: "Gestisci pagine", text: "Anteprima, riordina, duplica ed elimina pagine prima del download." },
        { title: "Esporta in sicurezza", text: "Scarica un vero PDF modificato mantenendo il contenuto originale." },
      ],
    },
    workflow: {
      eyebrow: "Flusso editor gratuito",
      title: "Un editor completo, non solo un box di upload",
      description:
        "L'editor include miniature, area precisa, toolbar, proprieta, zoom, scorciatoie, annulla, ripristina e download reale.",
      features: [
        "Sostituire visivamente testo esistente",
        "Aggiungere caselle di testo",
        "Disegnare e annotare liberamente",
        "Inserire firme e timbri",
        "Aggiungere immagini e loghi",
        "Evidenziare passaggi importanti",
        "Duplicare ed eliminare pagine",
        "Annulla e ripristina",
        "Esportare PDF modificati",
        "Comprimere PDF nel browser",
        "Unire piu PDF localmente",
        "Lavorare senza cloud per impostazione predefinita",
      ],
      previewLabel: "Editor MyFreePDFEditor",
    },
    steps: [
      { title: "Carica il PDF", text: "Trascina un file nell'area ampia di upload o sceglilo dal computer." },
      { title: "Modifica visivamente", text: "Cambia testo, firma, disegna, evidenzia, aggiungi immagini e organizza pagine." },
      { title: "Scarica il risultato", text: "Esporta un nuovo PDF con le modifiche integrate." },
    ],
    security: {
      eyebrow: "Privacy comprensibile",
      title: "Modifica il file senza consegnare tutto il flusso documentale",
      paragraphs: [
        "Di solito serve solo correggere un errore, firmare un modulo, aggiungere un'immagine o evidenziare una pagina. Non dovrebbe servire un account o un pagamento.",
        "MyFreePDFEditor mantiene il flusso gratuito nel browser. L'upload dalla homepage usa archiviazione temporanea sul tuo dispositivo.",
      ],
      cards: [
        { title: "Inizia senza account", text: "Apri l'editor e lavora subito sul PDF." },
        { title: "Passaggio locale temporaneo", text: "Il passaggio upload resta nel browser, non come file pubblico." },
        { title: "Scarica quando hai finito", text: "Esporta il PDF e controlla dove salvarlo." },
        { title: "Cloud dopo, per scelta", text: "Gli account futuri dovrebbero essere opzionali per workspace salvati." },
      ],
    },
    faq: { eyebrow: "FAQ", title: "Domande sulla modifica dei PDF online" },
    cta: { title: "Pronto a modificare il tuo PDF?", description: "Carica localmente, modifica visivamente e scarica un PDF pulito.", button: "Apri editor gratis" },
    footer: { language: "Lingua", tagline: "Modifica PDF moderna nel browser", editor: "Editor", allTools: "Tutti gli strumenti", about: "Chi siamo", security: "Sicurezza", privacy: "Privacy", faq: "FAQ" },
  },
};
