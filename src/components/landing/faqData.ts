import type { SupportedLocale } from "@/lib/i18n";
import { extraLocalePacks, type AddedLocale } from "@/lib/extraLocalePacks";

export type LandingFaq = {
  question: string;
  answer: string;
};

export const landingFaqs: LandingFaq[] = [
  {
    question: "Is MyFreePDFEditor a free PDF editor?",
    answer:
      "Yes. MyFreePDFEditor is a free online PDF editor. You can upload a PDF, edit it in your browser, and download the edited PDF without paying for the core editing workflow.",
  },
  {
    question: "How do I edit a PDF online for free?",
    answer:
      "Upload your PDF, select a page, add or replace text, insert images, sign, draw, highlight, organize pages, and export the finished document. The editor is designed to work directly in your browser.",
  },
  {
    question: "Can I edit existing text in a PDF?",
    answer:
      "Yes. The editor detects text on the PDF page and lets you create a matching editable replacement layer. You can then change the text content, font size, boldness, spacing, color, and alignment in the properties panel.",
  },
  {
    question: "Can I add text to a PDF?",
    answer:
      "Yes. Choose the text tool and click anywhere on the PDF page to add a new text box. The text box can be moved, resized, styled, duplicated, deleted, and included in the exported PDF.",
  },
  {
    question: "Can I sign a PDF online?",
    answer:
      "Yes. You can draw a signature in the browser or upload a signature image, place it on any page, resize it, and export it as part of the final PDF.",
  },
  {
    question: "Can I highlight or annotate a PDF?",
    answer:
      "Yes. MyFreePDFEditor includes highlights, rectangles, circles, lines, and freehand drawing tools for review notes, markups, and annotations.",
  },
  {
    question: "Can I add images or logos to a PDF?",
    answer:
      "Yes. You can upload PNG, JPG, or WebP images and place them on the PDF. Images can be moved, resized, rotated, layered, and exported with the document.",
  },
  {
    question: "Does the edited file download as a real PDF?",
    answer:
      "Yes. Download a PDF with your text, images, drawings, highlights and signatures included. Open the downloaded copy to review it before sharing.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "The editor is browser-first. Files are handled in local browser memory where possible and are not permanently stored by default. The homepage-to-editor upload handoff uses temporary browser storage on your own device.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required for the current free editor workflow.",
  },
  {
    question: "Can I delete or reorder PDF pages?",
    answer:
      "Yes. The editor includes page thumbnails and page controls for selecting, duplicating, deleting, and reordering pages before export.",
  },
  {
    question: "Does MyFreePDFEditor work on mobile?",
    answer:
      "The landing page is responsive, and the editor has basic tablet compatibility. For precise PDF editing, a desktop or laptop screen is recommended.",
  },
  {
    question: "What makes this different from many PDF editors?",
    answer:
      "The core editor focuses on fast, free, browser-based editing without forcing an account before you can start. Many online PDF tools reserve common export or editing features for paid flows.",
  },
  {
    question: "Can I merge or compress PDF files for free?",
    answer:
      "Yes. The Merge PDF tool combines multiple files in your chosen order, and the Compress PDF tool reduces file size with adjustable quality. Both run in your browser without signup or a watermark.",
  },
];

const localizedFaqs: Partial<Record<SupportedLocale, LandingFaq[]>> = {
  nl: [
    {
      question: "Is MyFreePDFEditor een gratis PDF-editor?",
      answer:
        "Ja. MyFreePDFEditor is een gratis online PDF-editor. Je kunt een PDF uploaden, in je browser bewerken en de bewerkte PDF downloaden zonder te betalen voor de basisworkflow.",
    },
    {
      question: "Hoe kan ik gratis een PDF online bewerken?",
      answer:
        "Upload je PDF, kies een pagina, voeg tekst toe of vervang tekst, plaats afbeeldingen, onderteken, teken, markeer, beheer pagina's en exporteer daarna het document.",
    },
    {
      question: "Kan ik bestaande tekst in een PDF aanpassen?",
      answer:
        "Ja. De editor herkent tekst en voegt een visuele vervanging toe. Je kunt de tekst, lettergrootte, dikte, tekenafstand, kleur en uitlijning aanpassen. De oorspronkelijke tekst blijft in de onderliggende PDF aanwezig; gebruik dit niet om vertrouwelijke gegevens definitief te verwijderen.",
    },
    {
      question: "Kan ik online een PDF ondertekenen?",
      answer:
        "Ja. Je kunt een handtekening tekenen in de browser of een handtekeningafbeelding uploaden, plaatsen, schalen en exporteren in de uiteindelijke PDF.",
    },
    {
      question: "Worden mijn PDF-bestanden op een server opgeslagen?",
      answer:
        "De inhoud van je PDF wordt lokaal op je apparaat verwerkt. Tijdelijke browseropslag brengt het bestand naar de editor. Via de privacypagina kun je die tijdelijke gegevens zelf wissen.",
    },
    {
      question: "Moet ik een account maken?",
      answer:
        "Nee. Voor de huidige gratis editorworkflow is geen account nodig.",
    },
    {
      question: "Kan ik PDF-bestanden gratis samenvoegen of verkleinen?",
      answer:
        "Ja. Met PDF samenvoegen combineer je maximaal 30 bestanden met een totale grootte onder 250 MB. Met PDF comprimeren verklein je een bestand van maximaal 100 MB en 100 pagina's. Beide tools werken lokaal in je browser, zonder account of watermerk.",
    },
    {
      question: "Kan ik een gescande PDF bewerken?",
      answer:
        "Je kunt tekstvakken, afbeeldingen, handtekeningen en markeringen toevoegen aan een scan. Om de oorspronkelijke tekst in een scan te herkennen, is OCR nodig. Gebruik hiervoor de tool PDF-tekst herkennen.",
    },
  ],
  de: [
    {
      question: "Ist MyFreePDFEditor ein kostenloser PDF-Editor?",
      answer:
        "Ja. MyFreePDFEditor ist ein kostenloser Online-PDF-Editor. Du kannst eine PDF hochladen, im Browser bearbeiten und die bearbeitete PDF herunterladen.",
    },
    {
      question: "Wie kann ich eine PDF online kostenlos bearbeiten?",
      answer:
        "Lade deine PDF hoch, wähle eine Seite, bearbeite oder ersetze Text, füge Bilder ein, unterschreibe, markiere, ordne Seiten und exportiere das fertige Dokument.",
    },
    {
      question: "Kann ich vorhandenen Text in einer PDF bearbeiten?",
      answer:
        "Ja. Der Editor erkennt Text auf der PDF-Seite und erstellt eine bearbeitbare Ersatzebene. Text, Schriftgröße, Stärke, Abstand, Farbe und Ausrichtung lassen sich anpassen.",
    },
    {
      question: "Kann ich eine PDF online unterschreiben?",
      answer:
        "Ja. Du kannst eine Unterschrift im Browser zeichnen oder als Bild hochladen, platzieren, skalieren und in die finale PDF exportieren.",
    },
    {
      question: "Werden meine PDF-Dateien auf einem Server gespeichert?",
      answer:
        "Der Editor ist auf die Verarbeitung im Browser ausgelegt. Dateien werden möglichst lokal verarbeitet und standardmäßig nicht dauerhaft gespeichert. Der Homepage-Upload nutzt temporären Browserspeicher auf deinem Gerät.",
    },
    {
      question: "Brauche ich ein Konto?",
      answer:
        "Nein. Für den aktuellen kostenlosen Editor-Workflow ist kein Konto erforderlich.",
    },
  ],
  fr: [
    {
      question: "MyFreePDFEditor est-il un éditeur PDF gratuit?",
      answer:
        "Oui. MyFreePDFEditor est un éditeur PDF en ligne gratuit. Vous pouvez importer, modifier dans le navigateur et télécharger le PDF modifié.",
    },
    {
      question: "Comment modifier un PDF en ligne gratuitement?",
      answer:
        "Importez le PDF, choisissez une page, ajoutez ou remplacez du texte, ajoutez des images, signez, annotez, organisez les pages et exportez le document final.",
    },
    {
      question: "Puis-je modifier le texte existant d'un PDF?",
      answer:
        "Oui. L'éditeur détecté le texte sur la page PDF et crée une couche de remplacement modifiable. Vous pouvez modifier le texte, la taille, l'épaisseur, l'espacement, la couleur et l'alignement.",
    },
    {
      question: "Puis-je signer un PDF en ligne?",
      answer:
        "Oui. Vous pouvez dessiner une signature dans le navigateur ou importer une image de signature, la placer, la redimensionner et l'exporter dans le PDF final.",
    },
    {
      question: "Mes fichiers PDF sont-ils stockés sur un serveur?",
      answer:
        "L'éditeur est browser-first. Les fichiers sont traités localement lorsque possible et ne sont pas stockés de façon permanente par défaut. L'import depuis la page d'accueil utilise un stockage temporaire du navigateur.",
    },
    {
      question: "Dois-je créer un compte?",
      answer:
        "Non. Aucun compte n'est nécessaire pour le flux gratuit actuel.",
    },
  ],
  es: [
    {
      question: "MyFreePDFEditor es un editor PDF gratis?",
      answer:
        "Sí. MyFreePDFEditor es un editor PDF online gratis. Puedes subir un PDF, editarlo en el navegador y descargar el PDF editado.",
    },
    {
      question: "Cómo puedo editar un PDF online gratis?",
      answer:
        "Sube tu PDF, elige una página, agrega o reemplaza texto, inserta imágenes, firma, dibuja, resalta, organiza páginas y exporta el documento final.",
    },
    {
      question: "Puedo editar texto existente en un PDF?",
      answer:
        "Sí. El editor detecta texto en la página PDF y crea una capa editable de reemplazo. Puedes cambiar texto, tamaño, grosor, espaciado, color y alineación.",
    },
    {
      question: "Puedo firmar un PDF online?",
      answer:
        "Sí. Puedes dibujar una firma en el navegador o subir una imagen de firma, colocarla, redimensionarla y exportarla dentro del PDF final.",
    },
    {
      question: "Mis archivos PDF se guardan en un servidor?",
      answer:
        "El editor es browser-first. Los archivos se procesan localmente cuando es posible y no se almacenan permanentemente por defecto. La subida desde la página inicial usa almacenamiento temporal del navegador.",
    },
    {
      question: "Necesito crear una cuenta?",
      answer:
        "No. El flujo gratuito actual no requiere cuenta.",
    },
  ],
  it: [
    {
      question: "MyFreePDFEditor è un editor PDF gratuito?",
      answer:
        "Sì. MyFreePDFEditor è un editor PDF online gratuito. Puoi caricare un PDF, modificarlo nel browser e scaricare il PDF modificato.",
    },
    {
      question: "Come posso modificare un PDF online gratis?",
      answer:
        "Carica il PDF, scegli una pagina, aggiungi o sostituisci testo, inserisci immagini, firma, disegna, evidenzia, organizza le pagine ed esporta il documento finale.",
    },
    {
      question: "Posso modificare il testo esistente in un PDF?",
      answer:
        "Sì. L'editor rileva il testo nella pagina PDF e crea un livello modificabile di sostituzione. Puoi cambiare testo, dimensione, spessore, spaziatura, colore e allineamento.",
    },
    {
      question: "Posso firmare un PDF online?",
      answer:
        "Sì. Puoi disegnare una firma nel browser o caricare un'immagine di firma, posizionarla, ridimensionarla ed esportarla nel PDF finale.",
    },
    {
      question: "I miei file PDF vengono salvati su un server?",
      answer:
        "L’editor elabora i file nel browser. I file vengono gestiti localmente quando possibile e non sono salvati permanentemente per impostazione predefinita. Il caricamento dalla homepage usa archiviazione temporanea del browser.",
    },
    {
      question: "Devo creare un account?",
      answer:
        "No. Il flusso gratuito attuale non richiede un account.",
    },
  ],
};

export function getLandingFaqs(locale: SupportedLocale = "en") {
  if (locale in extraLocalePacks)
    return extraLocalePacks[locale as AddedLocale].faqs.map(([question, answer]) => ({ question, answer }));
  return localizedFaqs[locale] ?? landingFaqs;
}
