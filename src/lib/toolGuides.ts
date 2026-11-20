import type { SupportedLocale } from "./i18n";

/**
 * Human-written, task-specific guidance for pages that already appear in
 * Search Console. Avoid generic keyword-filled paragraphs: each guide must
 * describe the actual workflow, limits, and adjacent tools accurately.
 */
export type ToolGuide = {
  heading: string;
  paragraphs: string[];
  exampleHeading: string;
  example: string;
  tipsHeading: string;
  tips: string[];
  relatedHeading: string;
  links: { slug: string; label: string; description: string }[];
};

const guides: Partial<Record<SupportedLocale, Record<string, ToolGuide>>> = {
  "pt-BR": {
    "split-pdf": {
      heading: "Como dividir um PDF em arquivos de uma página",
      paragraphs: [
        "Abra o PDF no navegador. Em Páginas a processar, digite os números das páginas que você quer separar. Use vírgulas para páginas avulsas e hífen para um intervalo. Deixe o campo em branco para dividir o documento inteiro.",
        "Clique em Criar arquivo e depois em Baixar arquivo. Se você selecionar várias páginas, extraia o ZIP para abrir os PDFs individuais. Para reunir páginas selecionadas em um único PDF, use a ferramenta de extração."
      ],
      exampleHeading: "Exemplo prático com recibos digitalizados",
      example: "Você tem cinco recibos digitalizados em um único PDF, um por página. Digite 2-4 para baixar um ZIP com três PDFs, um para cada recibo selecionado.",
      tipsHeading: "Limites e seleção de páginas",
      tips: [
        "O arquivo de origem pode ter até 100 páginas e 100 MB.",
        "Para baixar somente a página 5 como PDF, digite 5 no campo de seleção."
      ],
      relatedHeading: "Outras formas de trabalhar com as páginas",
      links: [
        { slug: "extract-pdf-pages", label: "Extrair páginas de PDF", description: "Salvar as páginas escolhidas juntas em um novo PDF." },
        { slug: "reorder-pdf-pages", label: "Organizar páginas de PDF", description: "Alterar a sequência das páginas do documento." },
        { slug: "merge-pdf", label: "Juntar PDF", description: "Combinar vários arquivos PDF em um só." }
      ]
    },
    "reorder-pdf-pages": {
      heading: "Como mudar a ordem das páginas de um PDF",
      paragraphs: [
        "Abra o PDF e encontre a página que deseja mover pelas miniaturas do painel Páginas. Use Mover página para cima ou Mover página para baixo. Cada clique troca a página de posição com a vizinha.",
        "As miniaturas são numeradas de acordo com a nova ordem. Clique em cada uma para conferir o conteúdo, especialmente quando as páginas da digitalização são parecidas.",
        "Use Salvar / Exportar PDF para baixar uma nova cópia na sequência escolhida. Você pode fazer tudo no navegador, sem criar uma conta."
      ],
      exampleHeading: "Exemplo de uma digitalização fora de ordem",
      example: "As quatro páginas foram digitalizadas na ordem 1, 3, 2, 4. Encontre a página 2 do documento na terceira miniatura e mova essa miniatura uma posição para cima. Confira a sequência 1, 2, 3, 4 antes de baixar.",
      tipsHeading: "O que conferir antes de baixar",
      tips: [
        "Abra as miniaturas para conferir a capa, o início de cada seção e os anexos.",
        "Confira o total de páginas e a sequência no arquivo baixado."
      ],
      relatedHeading: "Outras ferramentas para organizar o PDF",
      links: [
        { slug: "extract-pdf-pages", label: "Extrair páginas de PDF", description: "Salvar apenas as páginas selecionadas em outro PDF." },
        { slug: "delete-pdf-pages", label: "Excluir páginas de PDF", description: "Retirar páginas repetidas ou em branco." },
        { slug: "rotate-pdf", label: "Girar PDF", description: "Corrigir páginas de lado ou de cabeça para baixo." }
      ]
    },
    "extract-pdf-pages": {
      heading: "Como extrair páginas específicas de um PDF",
      paragraphs: [
        "Use o extrator de PDF gratuito para salvar só as páginas que você precisa. Você pode extrair uma única página, escolher páginas fora de sequência ou salvar um intervalo inteiro. O navegador cria um novo PDF e mantém o arquivo original intacto.",
        "Selecione o PDF e digite os números das páginas no campo de seleção. Use vírgulas para páginas avulsas (1,3,7) e um hífen para um intervalo (2-5). Você também pode alterar a ordem, por exemplo 5,1-2. Confira o resultado antes de baixar o novo PDF.",
        "Extrair páginas não é o mesmo que dividir PDF: a extração reúne a seleção em um único arquivo; a divisão gera arquivos separados. O limite desta ferramenta é de 100 páginas e 100 MB."
      ],
      exampleHeading: "Exemplo prático: extrair páginas de um contrato",
      example: "Você tem um contrato de 12 páginas e só precisa enviar as páginas 2, 4 e 11. Selecione o documento, informe 2,4,11 e crie um novo PDF de três páginas. O contrato original continua intacto.",
      tipsHeading: "Antes de baixar",
      tips: [
        "Confira os números das páginas e a sequência desejada.",
        "Se precisar de vários PDFs separados, use Dividir PDF.",
        "Para mudar a sequência do documento inteiro, use Organizar páginas de PDF."
      ],
      relatedHeading: "Outras formas de organizar páginas",
      links: [
        { slug: "split-pdf", label: "Dividir PDF por página", description: "Baixar um PDF individual para cada página selecionada." },
        { slug: "reorder-pdf-pages", label: "Organizar páginas de PDF", description: "Alterar a sequência das páginas." },
        { slug: "merge-pdf", label: "Juntar PDF", description: "Combinar documentos em um só PDF." }
      ]
    },
    "scanned-pdf-to-text": {
      heading: "Como extrair texto de um PDF digitalizado",
      paragraphs: [
        "Um PDF digitalizado pode conter somente imagens das páginas. Por isso, copiar o texto normalmente não funciona. O reconhecimento óptico de caracteres (OCR) identifica letras e palavras nessas imagens e permite baixar o conteúdo como arquivo TXT.",
        "Escolha o PDF digitalizado, selecione o idioma do texto e as páginas e execute o reconhecimento. Revise especialmente nomes, números e tabelas: a qualidade do resultado depende da nitidez e da orientação do documento. O arquivo TXT não mantém a formatação original.",
        "Importante: o OCR desta ferramenta oferece inglês, neerlandês, alemão, francês, espanhol e italiano, mas ainda não reconhece português. O limite é de 20 páginas e 100 MB."
      ],
      exampleHeading: "Exemplo prático: copiar texto de uma digitalização",
      example: "Se você recebeu uma carta digitalizada em espanhol e precisa aproveitar um parágrafo, selecione espanhol, reconheça as páginas e confira o TXT antes de copiar o trecho. Para pesquisar dentro de um PDF com a aparência original, use OCR PDF.",
      tipsHeading: "Quando o reconhecimento falha",
      tips: [
        "Tente um documento mais nítido e corretamente orientado.",
        "Confira o idioma selecionado antes de iniciar.",
        "Use OCR PDF se precisar de um PDF pesquisável em vez de um arquivo TXT."
      ],
      relatedHeading: "Ferramentas para texto e digitalizações",
      links: [
        { slug: "ocr-pdf", label: "OCR PDF", description: "Criar um PDF pesquisável nos idiomas disponíveis." },
        { slug: "pdf-to-word", label: "PDF para Word", description: "Converter documentos em DOCX para edição." },
        { slug: "extract-pdf-pages", label: "Extrair páginas de PDF", description: "Selecionar somente as páginas necessárias." }
      ]
    }
  },
  "nl": {
    "ocr-pdf": {
      heading: "Een gescande PDF doorzoekbaar maken met OCR",
      paragraphs: [
        "Kun je in je PDF geen tekst selecteren of een woord vinden met Ctrl+F of Cmd+F? Dan bestaat de pagina mogelijk uit een scan. OCR herkent de letters en maakt een doorzoekbare PDF met behoud van de pagina-afbeeldingen. Kies TXT als je alleen de herkende tekst nodig hebt.",
        "Open je PDF, kies de documenttaal en de pagina's en start de herkenning. Nederlands, Engels, Duits, Frans, Spaans en Italiaans worden ondersteund. Controleer achteraf vooral namen en bedragen; scheve of onscherpe scans geven sneller fouten.",
        "De OCR-tool ondersteunt maximaal 20 pagina's en 100 MB. Wil je alleen de herkende tekst als TXT opslaan, kies dan de afzonderlijke scan-naar-tekstfunctie."
      ],
      exampleHeading: "Voorbeeld: tekst zoeken in een gescande brief",
      example: "Je hebt een gescande brief van zes pagina's en wilt een bepaalde naam vinden. Kies Nederlands, laat de pagina's herkennen en download de doorzoekbare PDF. Controleer of die naam correct is herkend.",
      tipsHeading: "Tips voor een beter resultaat",
      tips: [
        "Kun je de tekst al selecteren? Ga direct naar de tekstbewerker als je een woord wilt aanpassen.",
        "Zorg dat pagina's recht staan en de scan voldoende scherp is.",
        "Selecteer de taal die daadwerkelijk in het document voorkomt.",
        "Controleer de herkende tekst voordat je deze gebruikt."
      ],
      relatedHeading: "Verder werken met je PDF",
      links: [
        { slug: "scanned-pdf-to-text", label: "Gescande PDF naar tekst", description: "Herkende tekst exporteren als TXT." },
        { slug: "rotate-pdf", label: "PDF draaien", description: "Pagina's rechtzetten vóór OCR." },
        { slug: "edit-pdf-text", label: "Tekst in een PDF bewerken", description: "Een woord aanpassen in een PDF met selecteerbare tekst." }
      ]
    },
    "redact-pdf": {
      heading: "Gevoelige informatie veilig uit een PDF verwijderen",
      paragraphs: [
        "Je kunt zowel een PDF met selecteerbare tekst als een gescande PDF anonimiseren. Markeer persoonsgegevens zelf op elke pagina, bijvoorbeeld namen, adressen, handtekeningen of rekeningnummers. Controleer ook gegevens die zichtbaar zijn in afbeeldingen of stempels.",
        "De tool maakt op je apparaat een nieuwe PDF en verwerkt de zwarte vlakken in de pagina-afbeeldingen. De oorspronkelijke tekstlaag, documentgegevens, bijlagen, links en interactieve velden gaan niet mee. Ook zichtbare tekst buiten de zwarte vlakken kun je in de nieuwe PDF niet meer selecteren.",
        "De tool verwerkt bestanden tot 50 pagina’s en 100 MB. Controleer de gedownloade kopie op leesbare gegevens die je wilde afschermen voordat je het bestand deelt."
      ],
      exampleHeading: "Voorbeeld: een factuur anonimiseren",
      example: "Je wilt een factuur delen met behoud van de bedragen. Markeer het klantadres en rekeningnummer, ook als die in de voettekst of in een betaalstrook terugkomen. Open de nieuwe PDF en controleer visueel of de gemarkeerde gegevens volledig onleesbaar zijn en de bedragen leesbaar blijven.",
      tipsHeading: "Belangrijk bij anonimiseren",
      tips: [
        "Controleer ook kop- en voetteksten en eventuele herhalingen van gegevens.",
        "Gebruik geen gewone highlight of getekend zwart vlak als vervanging voor anonimiseren.",
        "Bewaar het oorspronkelijke document apart en deel alleen de gecontroleerde kopie."
      ],
      relatedHeading: "Gerelateerde PDF-bewerkingen",
      links: [
        { slug: "delete-pdf-pages", label: "PDF-pagina's verwijderen", description: "Een volledige pagina weglaten." },
        { slug: "extract-pdf-pages", label: "PDF-pagina's extraheren", description: "Alleen noodzakelijke pagina's delen." },
        { slug: "annotate-pdf", label: "PDF annoteren", description: "Visuele notities toevoegen, zonder anonimiseren." }
      ]
    }
  },
  "fr": {
    "reorder-pdf-pages": {
      heading: "Comment réorganiser les pages d'un PDF sans modifier leur contenu",
      paragraphs: [
        "Si les pages d'un document numérisé sont dans le mauvais ordre, l'outil de réorganisation permet de déplacer une page avant ou après une autre. Vous créez ensuite un nouveau PDF dans l'ordre choisi sans écraser l'original.",
        "Ouvrez le fichier, repérez chaque page dans les miniatures, déplacez-les dans le bon ordre et vérifiez le résultat avant le téléchargement. Pour ne conserver que certaines pages, utilisez plutôt l'outil d'extraction.",
        "La réorganisation ne supprime pas les pages et ne corrige pas le texte qu'elles contiennent. Si une page est à l'envers, utilisez l'outil de rotation."
      ],
      exampleHeading: "Exemple : remettre une couverture en première page",
      example: "Votre rapport commence par les annexes et la couverture est en page 4. Déplacez la couverture en première position, vérifiez la nouvelle séquence dans les miniatures et exportez le PDF.",
      tipsHeading: "À vérifier avant l'export",
      tips: [
        "Contrôlez l'ordre des pages dans les miniatures.",
        "Utilisez Extraire des pages pour conserver seulement une sélection.",
        "Utilisez Supprimer des pages pour retirer les pages inutiles."
      ],
      relatedHeading: "Outils complémentaires",
      links: [
        { slug: "extract-pdf-pages", label: "Extraire des pages PDF", description: "Créer un PDF avec les pages sélectionnées." },
        { slug: "delete-pdf-pages", label: "Supprimer des pages PDF", description: "Retirer les pages dont vous n'avez plus besoin." },
        { slug: "rotate-pdf", label: "Faire pivoter un PDF", description: "Corriger l'orientation des pages." }
      ]
    }
  },
  "de": {
    "reorder-pdf-pages": {
      heading: "PDF-Seiten neu sortieren: Reihenfolge ändern",
      paragraphs: [
        "Sind die Seiten eines gescannten Dokuments vertauscht, kannst du sie über die Seitenübersicht in die richtige Reihenfolge bringen. Anschließend lädst du eine neue PDF-Datei herunter; die Originaldatei bleibt unverändert.",
        "Öffne das Dokument, prüfe die Seitenminiaturen und verschiebe die Seiten nach oben oder unten. Kontrolliere die Reihenfolge vor dem Export. Wenn du nur einzelne Seiten benötigst, nutze stattdessen die Funktion zum Extrahieren.",
        "Das Sortieren verändert keine Seiteninhalte. Gedrehte Seiten lassen sich mit dem Werkzeug PDF drehen separat korrigieren."
      ],
      exampleHeading: "Beispiel: Deckblatt nach vorne verschieben",
      example: "In einem Bericht steht das Deckblatt erst auf Seite 4. Verschiebe es an die erste Stelle, prüfe die Vorschau und speichere die neue PDF-Datei.",
      tipsHeading: "Vor dem Speichern prüfen",
      tips: [
        "Reihenfolge und Seitenzahl in der Vorschau kontrollieren.",
        "Zum Entfernen einzelner Seiten PDF-Seiten löschen wählen.",
        "Zum Behalten einer Auswahl PDF-Seiten extrahieren verwenden."
      ],
      relatedHeading: "Passende PDF-Werkzeuge",
      links: [
        { slug: "extract-pdf-pages", label: "PDF-Seiten extrahieren", description: "Ausgewählte Seiten als neue PDF speichern." },
        { slug: "delete-pdf-pages", label: "PDF-Seiten löschen", description: "Nicht benötigte Seiten entfernen." },
        { slug: "rotate-pdf", label: "PDF drehen", description: "Die Ausrichtung einzelner Seiten korrigieren." }
      ]
    }
  }
};

export function getToolGuide(locale: SupportedLocale, slug: string): ToolGuide | undefined {
  return guides[locale]?.[slug];
}
