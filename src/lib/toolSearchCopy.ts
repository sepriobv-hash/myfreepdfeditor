import type { SupportedLocale } from "./i18n";
import type { PdfTool } from "./pdfTools";

// One source for rendered copy, metadata and FAQ structured data.
const copy: Record<SupportedLocale, Record<string, readonly [string, string, string, string]>> = {
  "en": {
    "redact-pdf": [
      "Redact PDF Online Free — Remove Sensitive Information",
      "Remove personal details from a PDF for free. Mark private areas, review each page and download a flattened copy without an account.",
      "How do I remove personal information from a PDF?",
      "Open your PDF, mark names, addresses or account numbers and review every mask. Create the redacted PDF, then inspect the downloaded copy. All pages become images; original text layers and attachments are excluded."
    ],
    "ocr-pdf": [
      "OCR PDF Online Free — Make Scans Searchable",
      "Make scanned PDFs searchable and download recognized text for free. Choose the document language and process pages on your device.",
      "How do I make a scanned PDF searchable?",
      "Choose your scanned PDF, select its language and the pages to recognize, then create the file. Download the searchable PDF or the recognized text. Check names and numbers against the scan."
    ],
    "extract-pdf-pages": [
      "Extract PDF Pages Online Free",
      "Save selected pages as one new PDF for free. Enter individual pages or ranges, keep your chosen order and download without a watermark.",
      "How do I extract one page or a range from a PDF?",
      "Enter 3 for page 3, 2-5 for a range, or 5,1-3 for a custom order. Extract creates one PDF with those pages; Split PDF creates separate files. Your original stays unchanged."
    ],
    "scanned-pdf-to-text": [
      "Convert Scanned PDF to Text Free",
      "Extract text from a scanned PDF and download a TXT file. Recognize printed text locally, without an account or watermark.",
      "How do I copy text from a scanned PDF?",
      "Choose your scan, select the document language and run recognition. Review the recognized text and download the TXT file. For a searchable PDF that keeps the page images, use OCR PDF."
    ]
  },
  "nl": {
    "edit-pdf-text": [
      "Tekst in een PDF bewerken – gratis online",
      "Pas bestaande tekst in je PDF visueel aan. Corrigeer een typefout, wijzig lettergrootte of kleur en download je PDF zonder watermerk.",
      "Hoe bewerk ik bestaande tekst in een PDF?",
      "Open je PDF, klik op de tekst die de editor herkent en typ de vervanging. Pas de vormgeving aan en controleer het resultaat vóór je downloadt. Voor het veilig verwijderen van persoonsgegevens gebruik je de anonimiseertool."
    ],
    "redact-pdf": [
      "PDF anonimiseren – gratis online zwartlakken",
      "Lak namen, adressen en rekeningnummers zwart in je PDF. Controleer de gemarkeerde gebieden en download gratis een nieuwe kopie zonder account.",
      "Hoe kan ik een PDF online anonimiseren?",
      "Open je PDF en trek een kader om elk gegeven dat je wilt zwartlakken. Controleer de gemarkeerde gebieden, kies Geanonimiseerde PDF maken en bekijk de download voordat je het bestand deelt. De tool maakt van alle pagina’s afbeeldingen waarin de zwarte vlakken zijn verwerkt."
    ],
    "ocr-pdf": [
      "OCR PDF gratis online – PDF-tekst herkennen",
      "Herken tekst in een gescande PDF met gratis OCR. Kies de documenttaal en download een doorzoekbare PDF of de herkende tekst als TXT.",
      "Hoe herken ik tekst in een gescande PDF?",
      "Open je scan, kies de taal van de tekst en selecteer de pagina’s. Start de herkenning en download een PDF waarin je kunt zoeken en tekst kunt selecteren, of sla de herkende tekst op als TXT. Controleer namen en getallen aan de hand van de scan."
    ],
    "extract-pdf-pages": [
      "PDF Pagina’s Extraheren Gratis",
      "Haal één of meer pagina’s uit je PDF en sla ze op als één nieuw bestand. Kies losse pagina’s of een bereik, zonder account of watermerk.",
      "Hoe haal ik één pagina of een reeks uit een PDF?",
      "Vul 3 in voor pagina 3, 2-5 voor een reeks of 5,1-3 voor een eigen volgorde. Extraheren maakt één PDF met die pagina’s; PDF splitsen maakt losse bestanden. Je origineel blijft ongewijzigd."
    ],
    "scanned-pdf-to-text": [
      "Gescande PDF naar Tekst Omzetten Gratis",
      "Haal tekst uit een gescande PDF en download een TXT-bestand. Herken gedrukte tekst op je eigen apparaat, zonder account of watermerk.",
      "Hoe kopieer ik tekst uit een gescande PDF?",
      "Kies je scan en de documenttaal en start de tekstherkenning. Controleer de herkende tekst en download het TXT-bestand. Wil je de pagina-afbeeldingen behouden in een doorzoekbare PDF? Gebruik dan OCR PDF."
    ]
  },
  "de": {
    "reorder-pdf-pages": [
      "PDF-Seiten sortieren – kostenlos online",
      "Sortiere deine PDF-Seiten kostenlos im Browser. Verschiebe einzelne Seiten, prüfe die Reihenfolge und lade die neu sortierte PDF herunter.",
      "Wie kann ich PDF-Seiten in eine andere Reihenfolge bringen?",
      "Öffne die PDF, verschiebe Seiten über die Seitenleiste und prüfe die Reihenfolge vor dem Export. Für eine Auswahl nutze PDF-Seiten extrahieren."
    ],
    "redact-pdf": [
      "PDF Schwärzen Kostenlos — Daten Entfernen",
      "Schwärze persönliche Daten in einer PDF kostenlos. Markiere private Bereiche, prüfe jede Seite und lade eine reduzierte Kopie ohne Konto herunter.",
      "Wie entferne ich persönliche Daten aus einer PDF?",
      "Öffne die PDF, markiere Namen, Adressen oder Kontonummern und prüfe alle Masken. Erstelle die geschwärzte PDF und kontrolliere den Download. Alle Seiten werden zu Bildern; ursprüngliche Textebenen und Anhänge werden nicht übernommen."
    ],
    "ocr-pdf": [
      "OCR PDF Kostenlos — Scans Durchsuchbar Machen",
      "Mache gescannte PDFs durchsuchbar und lade erkannten Text kostenlos herunter. Wähle die Dokumentsprache; die Verarbeitung erfolgt auf deinem Gerät.",
      "Wie mache ich eine gescannte PDF durchsuchbar?",
      "Wähle die gescannte PDF, ihre Sprache und die zu erkennenden Seiten. Starte die Erkennung und lade die durchsuchbare PDF oder den Text herunter. Prüfe Namen und Zahlen anhand des Scans."
    ],
    "extract-pdf-pages": [
      "PDF Seiten Extrahieren Kostenlos",
      "Speichere ausgewählte Seiten als eine neue PDF. Gib einzelne Seiten oder Bereiche ein und bestimme die Reihenfolge, ohne Wasserzeichen.",
      "Wie extrahiere ich eine Seite oder einen Bereich?",
      "Gib 3 für Seite 3, 2-5 für einen Bereich oder 5,1-3 für eine eigene Reihenfolge ein. Extrahieren erstellt eine PDF; PDF teilen erstellt einzelne Dateien. Das Original bleibt unverändert."
    ],
    "scanned-pdf-to-text": [
      "Gescannte PDF in Text Umwandeln Kostenlos",
      "Erkenne gedruckten Text aus einer gescannten PDF und lade eine TXT-Datei herunter. Lokal auf deinem Gerät, ohne Konto oder Wasserzeichen.",
      "Wie kopiere ich Text aus einer gescannten PDF?",
      "Wähle den Scan und die Dokumentsprache und starte die Erkennung. Prüfe den Text und lade die TXT-Datei herunter. Für eine durchsuchbare PDF mit den Seitenbildern nutze OCR PDF."
    ]
  },
  "fr": {
    "reorder-pdf-pages": [
      "Réorganiser les Pages d’un PDF Gratuitement",
      "Changez l’ordre des pages PDF en ligne, vérifiez les miniatures et téléchargez une nouvelle copie sans modifier l’original.",
      "Comment changer l’ordre des pages d’un PDF ?",
      "Ouvrez le document, déplacez les pages dans la barre latérale et vérifiez le résultat avant l’export. Pour ne garder que certaines pages, utilisez Extraire des pages PDF."
    ],
    "redact-pdf": [
      "Caviarder un PDF Gratuitement — Masquer des Données",
      "Supprimez des données personnelles de votre PDF. Marquez les zones privées, vérifiez chaque page et téléchargez une copie aplatie sans compte.",
      "Comment supprimer des données personnelles d’un PDF ?",
      "Ouvrez le PDF, marquez les noms, adresses ou numéros de compte et vérifiez tous les masques. Créez le PDF caviardé et contrôlez le téléchargement. Les pages deviennent des images ; les calques de texte et pièces jointes d’origine sont exclus."
    ],
    "ocr-pdf": [
      "OCR PDF Gratuit — Rendre un Scan Consultable",
      "Rendez un PDF scanné consultable et téléchargez le texte reconnu gratuitement. Choisissez la langue du document ; le traitement reste sur votre appareil.",
      "Comment rendre un PDF scanné consultable ?",
      "Choisissez le scan, sa langue et les pages à reconnaître. Lancez la reconnaissance et téléchargez le PDF consultable ou le texte. Vérifiez les noms et les chiffres à partir du scan."
    ],
    "extract-pdf-pages": [
      "Extraire des Pages PDF Gratuitement",
      "Enregistrez les pages choisies dans un nouveau PDF. Indiquez des pages ou des plages et conservez l’ordre souhaité, sans compte ni filigrane.",
      "Comment extraire une page ou une plage d’un PDF ?",
      "Saisissez 3 pour la page 3, 2-5 pour une plage ou 5,1-3 pour un ordre personnalisé. Extraire crée un seul PDF ; Diviser PDF crée des fichiers séparés. L’original reste inchangé."
    ],
    "scanned-pdf-to-text": [
      "Convertir un PDF Scanné en Texte Gratuitement",
      "Extrayez le texte imprimé d’un PDF scanné et téléchargez un fichier TXT. Reconnaissance locale, sans compte ni filigrane.",
      "Comment copier le texte d’un PDF scanné ?",
      "Choisissez le scan et sa langue, puis lancez la reconnaissance. Relisez le texte et téléchargez le fichier TXT. Pour un PDF consultable conservant les images des pages, utilisez OCR PDF."
    ]
  },
  "es": {
    "redact-pdf": [
      "Censurar PDF Gratis — Eliminar Datos Personales",
      "Elimina datos personales de tu PDF gratis. Marca las zonas privadas, revisa cada página y descarga una copia aplanada sin crear una cuenta.",
      "¿Cómo elimino datos personales de un PDF?",
      "Abre el PDF, marca nombres, direcciones o números de cuenta y revisa todas las máscaras. Crea el PDF censurado y comprueba la descarga. Las páginas se convierten en imágenes; se excluyen las capas de texto y los adjuntos originales."
    ],
    "ocr-pdf": [
      "OCR PDF Gratis — Hacer Buscable un Escaneo",
      "Haz que un PDF escaneado permita buscar texto y descarga el texto reconocido gratis. Elige el idioma del documento y procésalo en tu dispositivo.",
      "¿Cómo hago que un PDF escaneado permita buscar texto?",
      "Elige el PDF escaneado, su idioma y las páginas. Inicia el reconocimiento y descarga el PDF con búsqueda o el texto. Comprueba los nombres y los números con el escaneo."
    ],
    "extract-pdf-pages": [
      "Extraer Páginas de PDF Gratis",
      "Guarda las páginas elegidas en un nuevo PDF. Introduce páginas o intervalos y conserva el orden que quieras, sin cuenta ni marca de agua.",
      "¿Cómo extraigo una página o un intervalo de un PDF?",
      "Escribe 3 para la página 3, 2-5 para un intervalo o 5,1-3 para un orden personalizado. Extraer crea un PDF; Dividir PDF crea archivos separados. El original no cambia."
    ],
    "scanned-pdf-to-text": [
      "Convertir PDF Escaneado a Texto Gratis",
      "Extrae texto impreso de un PDF escaneado y descarga un archivo TXT. Reconocimiento en tu dispositivo, sin cuenta ni marca de agua.",
      "¿Cómo copio texto de un PDF escaneado?",
      "Elige el escaneo y su idioma e inicia el reconocimiento. Revisa el texto y descarga el TXT. Para obtener un PDF con búsqueda que conserve las imágenes de las páginas, usa OCR PDF."
    ]
  },
  "it": {
    "redact-pdf": [
      "Oscurare PDF Gratis — Rimuovere Dati Personali",
      "Rimuovi dati personali dal PDF gratis. Segna le aree private, controlla ogni pagina e scarica una copia appiattita senza account.",
      "Come rimuovo i dati personali da un PDF?",
      "Apri il PDF, segna nomi, indirizzi o numeri di conto e controlla tutte le maschere. Crea il PDF oscurato e verifica il download. Le pagine diventano immagini; i livelli di testo e gli allegati originali sono esclusi."
    ],
    "ocr-pdf": [
      "OCR PDF Gratis — Rendere Ricercabile una Scansione",
      "Rendi ricercabile un PDF scansionato e scarica il testo riconosciuto gratis. Scegli la lingua del documento ed elaboralo sul tuo dispositivo.",
      "Come rendo ricercabile un PDF scansionato?",
      "Scegli la scansione, la lingua e le pagine da riconoscere. Avvia il riconoscimento e scarica il PDF ricercabile o il testo. Controlla nomi e numeri confrontandoli con la scansione."
    ],
    "extract-pdf-pages": [
      "Estrarre Pagine PDF Gratis",
      "Salva le pagine scelte in un nuovo PDF. Indica pagine singole o intervalli nell’ordine desiderato, senza account né filigrana.",
      "Come estraggo una pagina o un intervallo da un PDF?",
      "Inserisci 3 per pagina 3, 2-5 per un intervallo o 5,1-3 per un ordine personalizzato. Estrai crea un PDF; Dividi PDF crea file separati. L’originale non cambia."
    ],
    "scanned-pdf-to-text": [
      "Convertire PDF Scansionato in Testo Gratis",
      "Estrai testo stampato da un PDF scansionato e scarica un file TXT. Riconoscimento sul tuo dispositivo, senza account né filigrana.",
      "Come copio il testo da un PDF scansionato?",
      "Scegli la scansione e la lingua e avvia il riconoscimento. Controlla il testo e scarica il TXT. Per un PDF ricercabile che conservi le immagini delle pagine, usa OCR PDF."
    ]
  },
  "pt-BR": {
    "reorder-pdf-pages": [
      "Organizar páginas de PDF online grátis",
      "Mude a ordem das páginas do PDF com as setas nas miniaturas. Confira a sequência e baixe uma nova cópia direto do navegador, sem cadastro.",
      "Como organizar as páginas de um PDF online?",
      "Abra o arquivo e use as setas abaixo das miniaturas para mover cada página para cima ou para baixo. Confira a sequência no painel Páginas e use Salvar / Exportar PDF para baixar o documento organizado."
    ],
    "redact-pdf": [
      "Tarjar PDF Grátis — Remover Dados Pessoais",
      "Remova dados pessoais do PDF grátis. Marque as áreas privadas, revise cada página e baixe uma cópia achatada sem criar conta.",
      "Como remover dados pessoais de um PDF?",
      "Abra o PDF, marque nomes, endereços ou números de conta e revise todas as máscaras. Crie o PDF tarjado e confira o arquivo baixado. As páginas viram imagens; camadas de texto e anexos originais são excluídos."
    ],
    "ocr-pdf": [
      "OCR PDF Grátis — Tornar Digitalizações Pesquisáveis",
      "Torne um PDF digitalizado pesquisável e baixe o texto reconhecido grátis. Selecione um idioma disponível e processe as páginas no seu dispositivo.",
      "Como tornar um PDF digitalizado pesquisável?",
      "Escolha o PDF, um dos idiomas disponíveis e as páginas. Execute o reconhecimento e baixe o PDF pesquisável ou o texto. Confira nomes e números na digitalização. O reconhecimento em português ainda não está disponível."
    ],
    "extract-pdf-pages": [
      "Extrair páginas de PDF grátis online",
      "Extraia uma página, várias páginas ou um intervalo de um PDF. Escolha a ordem e baixe um novo arquivo com apenas as páginas selecionadas, sem cadastro.",
      "Como extrair uma ou mais páginas de um PDF online?",
      "Selecione o arquivo e digite 3 para uma página, 2-5 para um intervalo ou 5,1-3 para mudar a ordem. A extração gera um PDF com a seleção; a ferramenta Dividir PDF cria arquivos separados. O original não muda. Limite: 100 páginas e 100 MB."
    ],
    "scanned-pdf-to-text": [
      "Extrair Texto de PDF Digitalizado Grátis — OCR",
      "Extraia texto de PDF digitalizado e salve em TXT com OCR no navegador. Funciona em seis idiomas disponíveis; o reconhecimento de texto em português ainda não é suportado.",
      "Como extrair texto de um PDF digitalizado?",
      "Envie a digitalização, escolha entre inglês, neerlandês, alemão, francês, espanhol e italiano e reconheça o texto. Revise nomes e números antes de baixar o TXT. Para manter as páginas em PDF pesquisável, use OCR PDF; o reconhecimento em português ainda não está disponível."
    ]
  },
  "id": {
    "redact-pdf": [
      "Sensor PDF Gratis — Hapus Data Pribadi",
      "Hapus data pribadi dari PDF gratis. Tandai bagian rahasia, periksa setiap halaman, lalu unduh salinan yang diratakan tanpa akun.",
      "Bagaimana cara menghapus data pribadi dari PDF?",
      "Buka PDF, tandai nama, alamat atau nomor rekening, lalu periksa semua penutup. Buat PDF yang disensor dan periksa hasil unduhan. Halaman menjadi gambar; lapisan teks dan lampiran asli tidak disertakan."
    ],
    "ocr-pdf": [
      "OCR PDF Gratis — Jadikan Pindaian Bisa Dicari",
      "Jadikan PDF hasil pindai dapat dicari dan unduh teks yang dikenali. Pilih bahasa yang tersedia; pemrosesan berlangsung di perangkat Anda.",
      "Bagaimana cara membuat PDF hasil pindai dapat dicari?",
      "Pilih PDF, salah satu bahasa yang tersedia dan halaman yang akan dikenali. Jalankan pengenalan lalu unduh PDF atau teks. Periksa nama dan angka pada pindaian. Pengenalan bahasa Indonesia belum tersedia."
    ],
    "extract-pdf-pages": [
      "Ekstrak Halaman PDF Gratis",
      "Simpan halaman pilihan sebagai satu PDF baru. Masukkan nomor atau rentang halaman dalam urutan yang diinginkan, tanpa akun atau tanda air.",
      "Bagaimana cara mengambil satu halaman atau rentang dari PDF?",
      "Masukkan 3 untuk halaman 3, 2-5 untuk rentang, atau 5,1-3 untuk urutan khusus. Ekstrak menghasilkan satu PDF; Pisahkan PDF menghasilkan file terpisah. File asli tidak berubah."
    ],
    "scanned-pdf-to-text": [
      "Ubah PDF Hasil Pindai ke Teks Gratis",
      "Kenali teks cetak dalam PDF hasil pindai dan unduh file TXT. Pemrosesan lokal dengan bahasa yang tersedia, tanpa akun.",
      "Bagaimana cara menyalin teks dari PDF hasil pindai?",
      "Pilih pindaian dan bahasa yang tersedia lalu jalankan pengenalan. Periksa teks dan unduh TXT. Untuk PDF yang dapat dicari dengan gambar halaman tetap utuh, gunakan OCR PDF. Pengenalan bahasa Indonesia belum tersedia."
    ]
  },
  "tr": {
    "redact-pdf": [
      "PDF Karartma Ücretsiz — Kişisel Verileri Kaldırın",
      "PDF dosyanızdaki kişisel verileri ücretsiz kaldırın. Özel alanları işaretleyin, sayfaları kontrol edin ve hesapsız birleştirilmiş kopyayı indirin.",
      "PDF dosyasından kişisel verileri nasıl kaldırırım?",
      "PDF dosyasını açın; ad, adres veya hesap numaralarını işaretleyip tüm maskeleri inceleyin. Karartılmış PDF dosyasını oluşturup indirmeyi kontrol edin. Sayfalar resme dönüşür; özgün metin katmanları ve ekler dahil edilmez."
    ],
    "ocr-pdf": [
      "Ücretsiz PDF OCR — Taranmış PDF’de Arama",
      "Taranmış PDF dosyasını aranabilir yapın ve tanınan metni indirin. Desteklenen bir dil seçin; işlem cihazınızda gerçekleşir.",
      "Taranmış PDF dosyasını nasıl aranabilir yaparım?",
      "PDF dosyasını, desteklenen bir dili ve sayfaları seçin. Tanımayı başlatıp PDF veya metni indirin. Adları ve sayıları taramayla karşılaştırın. Türkçe metin tanıma henüz desteklenmiyor."
    ],
    "extract-pdf-pages": [
      "Ücretsiz PDF Sayfa Ayıklama",
      "Seçtiğiniz sayfaları tek bir yeni PDF olarak kaydedin. Sayfa numaralarını veya aralıkları istediğiniz sırada girin; hesap ve filigran yok.",
      "PDF dosyasından tek sayfa veya aralık nasıl çıkarılır?",
      "Sayfa 3 için 3, aralık için 2-5 veya özel sıra için 5,1-3 girin. Ayıklama tek PDF oluşturur; PDF bölme ayrı dosyalar oluşturur. Özgün dosya değişmez."
    ],
    "scanned-pdf-to-text": [
      "Taranmış PDF’yi Metne Çevirme Ücretsiz",
      "Taranmış PDF içindeki basılı metni tanıyıp TXT dosyası indirin. Desteklenen dillerde, cihazınızda ve hesapsız çalışır.",
      "Taranmış PDF’den nasıl metin kopyalarım?",
      "Taramayı ve desteklenen bir dili seçip tanımayı başlatın. Metni kontrol edip TXT dosyasını indirin. Sayfa resimleriyle aranabilir PDF için OCR PDF kullanın. Türkçe metin tanıma henüz desteklenmiyor."
    ]
  },
  "pl": {
    "redact-pdf": [
      "Zaczernianie PDF Za Darmo — Usuń Dane Osobowe",
      "Usuń dane osobowe z PDF za darmo. Zaznacz prywatne obszary, sprawdź każdą stronę i pobierz spłaszczoną kopię bez konta.",
      "Jak usunąć dane osobowe z PDF?",
      "Otwórz PDF, zaznacz nazwiska, adresy lub numery kont i sprawdź wszystkie maski. Utwórz zaczerniony PDF i sprawdź pobrany plik. Strony stają się obrazami; oryginalne warstwy tekstowe i załączniki są pomijane."
    ],
    "ocr-pdf": [
      "OCR PDF Za Darmo — Przeszukiwalne Skany",
      "Utwórz przeszukiwalny PDF ze skanu i pobierz rozpoznany tekst. Wybierz obsługiwany język; przetwarzanie odbywa się na Twoim urządzeniu.",
      "Jak utworzyć przeszukiwalny PDF ze skanu?",
      "Wybierz PDF, jeden z obsługiwanych języków i strony. Uruchom rozpoznawanie i pobierz PDF lub tekst. Sprawdź nazwiska i liczby na skanie. Rozpoznawanie języka polskiego nie jest jeszcze dostępne."
    ],
    "extract-pdf-pages": [
      "Wyodrębnij Strony PDF Za Darmo",
      "Zapisz wybrane strony jako jeden nowy PDF. Wpisz numery lub zakresy stron w wybranej kolejności, bez konta i znaku wodnego.",
      "Jak wyodrębnić jedną stronę lub zakres z PDF?",
      "Wpisz 3 dla strony 3, 2-5 dla zakresu lub 5,1-3 dla własnej kolejności. Wyodrębnianie tworzy jeden PDF; podział PDF tworzy osobne pliki. Oryginał pozostaje bez zmian."
    ],
    "scanned-pdf-to-text": [
      "Zamień Skan PDF na Tekst Za Darmo",
      "Rozpoznaj drukowany tekst w skanie PDF i pobierz plik TXT. Lokalnie, w obsługiwanych językach, bez zakładania konta.",
      "Jak skopiować tekst ze skanu PDF?",
      "Wybierz skan i obsługiwany język, a potem uruchom rozpoznawanie. Sprawdź tekst i pobierz TXT. Aby zachować obrazy stron w przeszukiwalnym PDF, użyj OCR PDF. Rozpoznawanie języka polskiego nie jest jeszcze dostępne."
    ]
  },
  "hi": {
    "redact-pdf": [
      "PDF में निजी जानकारी हटाएँ — मुफ़्त",
      "PDF में निजी जानकारी मुफ़्त हटाएँ। गोपनीय हिस्से चिह्नित करें, हर पेज जाँचें और बिना खाते के फ़्लैट की गई कॉपी डाउनलोड करें।",
      "PDF से निजी जानकारी कैसे हटाऊँ?",
      "PDF खोलें, नाम, पते या खाता नंबर चिह्नित करें और सभी मास्क जाँचें। जानकारी हटाई गई PDF बनाएँ और डाउनलोड की जाँच करें। पेज चित्र बन जाते हैं; मूल टेक्स्ट लेयर और अटैचमेंट शामिल नहीं होते।"
    ],
    "ocr-pdf": [
      "मुफ़्त PDF OCR — स्कैन में टेक्स्ट खोजें",
      "स्कैन की गई PDF को खोजने योग्य बनाएँ और पहचाना गया टेक्स्ट डाउनलोड करें। उपलब्ध भाषा चुनें; प्रोसेसिंग आपके डिवाइस पर होती है।",
      "स्कैन की गई PDF को खोजने योग्य कैसे बनाएँ?",
      "PDF, उपलब्ध भाषा और पेज चुनें। पहचान शुरू करें और PDF या टेक्स्ट डाउनलोड करें। नाम और अंक स्कैन से मिलाकर जाँचें। हिंदी टेक्स्ट पहचान अभी उपलब्ध नहीं है।"
    ],
    "extract-pdf-pages": [
      "PDF पेज निकालें — मुफ़्त",
      "चुने हुए पेज एक नई PDF में सहेजें। पेज नंबर या रेंज अपनी पसंद के क्रम में दर्ज करें। खाते या वॉटरमार्क की ज़रूरत नहीं।",
      "PDF से एक पेज या पेज रेंज कैसे निकालें?",
      "पेज 3 के लिए 3, रेंज के लिए 2-5 या अपने क्रम के लिए 5,1-3 लिखें। पेज निकालने से एक PDF बनती है; PDF विभाजित करने से अलग फ़ाइलें बनती हैं। मूल फ़ाइल नहीं बदलती।"
    ],
    "scanned-pdf-to-text": [
      "स्कैन की गई PDF को टेक्स्ट में बदलें — मुफ़्त",
      "स्कैन की गई PDF में छपा टेक्स्ट पहचानें और TXT डाउनलोड करें। उपलब्ध भाषाओं में आपके डिवाइस पर, बिना खाते के काम करता है।",
      "स्कैन की गई PDF से टेक्स्ट कैसे कॉपी करें?",
      "स्कैन और उपलब्ध भाषा चुनकर पहचान शुरू करें। टेक्स्ट जाँचें और TXT डाउनलोड करें। पेज चित्रों वाली खोजने योग्य PDF के लिए OCR PDF इस्तेमाल करें। हिंदी टेक्स्ट पहचान अभी उपलब्ध नहीं है।"
    ]
  }
};

export function applySearchCopy(tool: PdfTool, locale: SupportedLocale): PdfTool {
 const entry = copy[locale][tool.slug];
 if (!entry) return tool;
 const [title, intro, question, answer] = entry;
 return { ...tool, title, h1: title, intro, description: intro,
  faqs: [{ question, answer }, ...tool.faqs],
 };
}
