import type { SupportedLocale } from "@/lib/i18n";
import { extraLocalePacks, type AddedLocale } from "@/lib/extraLocalePacks";

type LandingFaq = { question: string; answer: string };

const localizedFaqs: Record<Exclude<SupportedLocale, AddedLocale>, LandingFaq[]> = {
  en: [
    {
      question: "Can I edit existing text in a PDF?",
      answer: "Yes. The editor detects text on the PDF page and lets you create a matching editable replacement layer. You can then change the text content, font size, boldness, spacing, color, and alignment in the properties panel.",
    },
    {
      question: "Can I sign a PDF online?",
      answer: "Yes. You can draw a signature in the browser or upload a signature image, place it on any page, resize it, and export it as part of the final PDF.",
    },
    {
      question: "Are my PDF files uploaded to a server?",
      answer: "The editor and PDF tools process the document on your device. When you open the editor from another page, a temporary copy in your browser moves the file to the editor.",
    },
    {
      question: "Can I merge or compress PDF files for free?",
      answer: "Yes. The Merge PDF tool combines multiple files in your chosen order, and the Compress PDF tool reduces file size with adjustable quality. Both run in your browser without signup or a watermark.",
    },
  ],
  nl: [
    {
      question: "Kan ik bestaande tekst in een PDF aanpassen?",
      answer: "Ja. De editor herkent tekst en voegt een visuele vervanging toe. Je kunt de tekst, lettergrootte, dikte, tekenafstand, kleur en uitlijning aanpassen. De oorspronkelijke tekst blijft in de onderliggende PDF aanwezig; gebruik dit niet om vertrouwelijke gegevens definitief te verwijderen.",
    },
    {
      question: "Worden mijn PDF-bestanden op een server opgeslagen?",
      answer: "De inhoud van je PDF wordt lokaal op je apparaat verwerkt. Tijdelijke browseropslag brengt het bestand naar de editor. Via de privacypagina kun je die tijdelijke gegevens zelf wissen.",
    },
    {
      question: "Kan ik PDF-bestanden gratis samenvoegen of verkleinen?",
      answer: "Ja. Met PDF samenvoegen combineer je maximaal 30 bestanden met een totale grootte onder 250 MB. Met PDF comprimeren verklein je een bestand van maximaal 100 MB en 100 pagina's. Beide tools werken lokaal in je browser, zonder account of watermerk.",
    },
    {
      question: "Kan ik een gescande PDF bewerken?",
      answer: "Je kunt tekstvakken, afbeeldingen, handtekeningen en markeringen toevoegen aan een scan. Om de oorspronkelijke tekst in een scan te herkennen, is OCR nodig. Gebruik hiervoor de tool PDF-tekst herkennen.",
    },
  ],
  de: [
    {
      question: "Ist MyFreePDFEditor ein kostenloser PDF-Editor?",
      answer: "Ja. MyFreePDFEditor ist ein kostenloser Online-PDF-Editor. Du kannst eine PDF hochladen, im Browser bearbeiten und die bearbeitete PDF herunterladen.",
    },
    {
      question: "Kann ich vorhandenen Text in einer PDF bearbeiten?",
      answer: "Ja. Der Editor erkennt Text auf der PDF-Seite und erstellt eine bearbeitbare Ersatzebene. Text, Schriftgröße, Stärke, Abstand, Farbe und Ausrichtung lassen sich anpassen.",
    },
    {
      question: "Kann ich eine PDF online unterschreiben?",
      answer: "Ja. Du kannst eine Unterschrift im Browser zeichnen oder als Bild hochladen, platzieren, skalieren und in die finale PDF exportieren.",
    },
    {
      question: "Werden meine PDF-Dateien auf einem Server gespeichert?",
      answer: "Der Editor ist auf die Verarbeitung im Browser ausgelegt. Dateien werden möglichst lokal verarbeitet und standardmäßig nicht dauerhaft gespeichert. Der Homepage-Upload nutzt temporären Browserspeicher auf deinem Gerät.",
    },
  ],
  fr: [
    {
      question: "MyFreePDFEditor est-il un éditeur PDF gratuit?",
      answer: "Oui. MyFreePDFEditor est un éditeur PDF en ligne gratuit. Vous pouvez importer, modifier dans le navigateur et télécharger le PDF modifié.",
    },
    {
      question: "Puis-je modifier le texte existant d'un PDF?",
      answer: "Oui. L'éditeur détecté le texte sur la page PDF et crée une couche de remplacement modifiable. Vous pouvez modifier le texte, la taille, l'épaisseur, l'espacement, la couleur et l'alignement.",
    },
    {
      question: "Puis-je signer un PDF en ligne?",
      answer: "Oui. Vous pouvez dessiner une signature dans le navigateur ou importer une image de signature, la placer, la redimensionner et l'exporter dans le PDF final.",
    },
    {
      question: "Mes fichiers PDF sont-ils stockés sur un serveur?",
      answer: "L'éditeur est browser-first. Les fichiers sont traités localement lorsque possible et ne sont pas stockés de façon permanente par défaut. L'import depuis la page d'accueil utilise un stockage temporaire du navigateur.",
    },
  ],
  es: [
    {
      question: "MyFreePDFEditor es un editor PDF gratis?",
      answer: "Sí. MyFreePDFEditor es un editor PDF online gratis. Puedes subir un PDF, editarlo en el navegador y descargar el PDF editado.",
    },
    {
      question: "Puedo editar texto existente en un PDF?",
      answer: "Sí. El editor detecta texto en la página PDF y crea una capa editable de reemplazo. Puedes cambiar texto, tamaño, grosor, espaciado, color y alineación.",
    },
    {
      question: "Puedo firmar un PDF online?",
      answer: "Sí. Puedes dibujar una firma en el navegador o subir una imagen de firma, colocarla, redimensionarla y exportarla dentro del PDF final.",
    },
    {
      question: "Mis archivos PDF se guardan en un servidor?",
      answer: "El editor es browser-first. Los archivos se procesan localmente cuando es posible y no se almacenan permanentemente por defecto. La subida desde la página inicial usa almacenamiento temporal del navegador.",
    },
  ],
  it: [
    {
      question: "MyFreePDFEditor è un editor PDF gratuito?",
      answer: "Sì. MyFreePDFEditor è un editor PDF online gratuito. Puoi caricare un PDF, modificarlo nel browser e scaricare il PDF modificato.",
    },
    {
      question: "Posso modificare il testo esistente in un PDF?",
      answer: "Sì. L'editor rileva il testo nella pagina PDF e crea un livello modificabile di sostituzione. Puoi cambiare testo, dimensione, spessore, spaziatura, colore e allineamento.",
    },
    {
      question: "Posso firmare un PDF online?",
      answer: "Sì. Puoi disegnare una firma nel browser o caricare un'immagine di firma, posizionarla, ridimensionarla ed esportarla nel PDF finale.",
    },
    {
      question: "I miei file PDF vengono salvati su un server?",
      answer: "L’editor elabora i file nel browser. I file vengono gestiti localmente quando possibile e non sono salvati permanentemente per impostazione predefinita. Il caricamento dalla homepage usa archiviazione temporanea del browser.",
    },
  ],
};

export function getLandingFaqs(locale: SupportedLocale = "en") {
  if (locale in extraLocalePacks) {
    return extraLocalePacks[locale as AddedLocale].faqs.map(([question, answer]) => ({ question, answer }));
  }
  return localizedFaqs[locale as keyof typeof localizedFaqs];
}
