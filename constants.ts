
export const TARGET_WORD_COUNT = 25000; // Approx 80-100 pages
export const WORDS_PER_PAGE = 300; // Approx words per page for 1.5 spacing

export const CHAPTER_PAGE_ESTIMATES: Record<number, { min: number, max: number, desc: string }> = {
  1: { min: 10, max: 15, desc: "Pendahuluan" },
  2: { min: 20, max: 25, desc: "Kajian Pustaka" },
  3: { min: 20, max: 25, desc: "Metode Penelitian" },
  4: { min: 30, max: 35, desc: "Hasil dan Pembahasan" },
  5: { min: 5, max: 10, desc: "Penutup" },
  6: { min: 15, max: 30, desc: "Lampiran (Instrumen, Data, Dokumen)" }
};

// Merged into Chapter 6 above
export const APPENDICES_PAGE_ESTIMATE = { 
  min: 0, 
  max: 0, 
  desc: "Included in Chapter 6" 
};

export const INITIAL_THESIS_DATA = {
  title: "Pengaruh Penggunaan Media Big Book dan Kegiatan Sayangi Lingkungan Terhadap Kemampuan Literasi Lingkungan Anak Usia Dini",
  studentName: "SITI QOUMARIAH",
  studentId: "501212934",
  university: "UNIVERSITAS TERBUKA",
  faculty: "SEKOLAH PASCASARJANA",
  program: "Magister Pendidikan Anak Anak PAUD"
};

export const INITIAL_CONFIG = {
  minYear: 2020,
  maxYear: 2025,
  maxReferences: 50
};

export const MOCK_LOGS = [
  "Initializing AI Service...",
  "Reading uploaded documents...",
  "Extracting semantic context...",
];

export const PRELOADED_REFERENCES = [
  // --- BUKU TEORI UTAMA (International Core Theory) ---
  { 
    title: "Gambrell, L. B., Morrow, L. M., Neuman, S. B., & Pressley, M. (Eds.). (2000). Best practices in literacy instruction. Guilford Press.", 
    uri: "Book Reference" 
  },
  { 
    title: "Morrow, L. M. (2009). Literacy development in the early years: Helping children read and write (6th ed.). Pearson Education.", 
    uri: "Book Reference" 
  },
  { 
    title: "Neuman, S. B., Copple, C., & Bredekamp, S. (2000). Learning to read and write: Developmentally appropriate practices for young children. NAEYC.", 
    uri: "Book Reference" 
  },
  { 
    title: "Tompkins, G. E. (2017). Literacy for the 21st century: A balanced approach (5th ed.). Pearson.", 
    uri: "Book Reference" 
  },
  { 
    title: "Orr, D. W. (1992). Ecological literacy: Education and the transition to a postmodern world. State University of New York Press.", 
    uri: "Book Reference" 
  },
  { 
    title: "Sterling, S. (2001). Sustainable education: Re-visioning learning and change. Green Books.", 
    uri: "Book Reference" 
  },

  // --- DOKUMEN RESMI & PERATURAN (Official Documents) ---
  { 
    title: "UNESCO & UNEP. (1978). Intergovernmental conference on environmental education: Tbilisi Declaration.", 
    uri: "https://unesdoc.unesco.org" 
  },
  {
    title: "Kemendikbudristek. Desain Induk Gerakan Literasi Nasional (GLN).",
    uri: "https://gln.kemdikbud.go.id"
  },
  {
    title: "SEAMEO CECCEP/Kemendikbud. Panduan Komprehensif untuk Guru dalam Pembelajaran Anak Usia Dini.",
    uri: "https://smk.kemdikbud.go.id"
  },

  // --- REFERENSI LITERASI AUD & BIG BOOK (Indonesian Journals/Repositories) ---
  {
    title: "Pemanfaatan Big Book sebagai Media Literasi Anak Usia Dini. UIN Sunan Kalijaga.",
    uri: "https://conference.uin-suka.ac.id"
  },
  {
    title: "Pengaruh Media Big Book Terhadap Kemampuan Literasi/Membaca Anak Usia Dini. e-Journal Hamzanwadi University.",
    uri: "https://e-journal.hamzanwadi.ac.id"
  },
  {
    title: "Pengaruh Media Big Book Terhadap Kemampuan Membaca Permulaan Anak Usia Dini. Digilib Unila.",
    uri: "http://digilib.unila.ac.id"
  },
  {
    title: "Pengembangan Media Big Book untuk Meningkatkan Kemampuan Literasi Anak Usia 5-6 Tahun. Eprints UNY.",
    uri: "https://eprints.uny.ac.id"
  },
  {
    title: "Big Book Media: Enhancing Speaking and Listening Skills in Early Childhood Education. Jurnal Obsesi (UNJ).",
    uri: "https://journal.unj.ac.id"
  },
  {
    title: "Meningkatkan Kemampuan Literasi Membaca Permulaan Melalui Penggunaan Media Big Book. ejournal UPI.",
    uri: "https://ejournal.upi.edu"
  },
  {
    title: "Penggunaan Big Book dalam Pembelajaran Membaca Permulaan di Taman Kanak-Kanak. ejournal Universitas Negeri Padang.",
    uri: "https://ejournal.unp.ac.id"
  },
  {
    title: "Peningkatan Kemampuan Berbahasa Anak Usia Dini Melalui Media Big Book. Repositori IAIN Sas Babel.",
    uri: "https://rumahjurnal.iainsasbabel.ac.id"
  },
  {
    title: "Aplikasi Media Big Book untuk Meningkatkan Literasi Membaca Siswa. EJESET.",
    uri: "https://ejeset.saintispub.com"
  },

  // --- REFERENSI LITERASI LINGKUNGAN (Environmental Literacy) ---
  {
    title: "Pengembangan Buku Big Book 'Miki Si Gajah Kecil' sebagai Media Pengenalan Literasi Lingkungan untuk AUD. Journal UIR.",
    uri: "https://journal.uir.ac.id"
  },
  {
    title: "Sastra Ekologis sebagai Media Akselerasi Kemampuan Literasi Lingkungan. Jurnal Obsesi.",
    uri: "https://obsesi.or.id"
  },
  {
    title: "Pendidikan Literasi Kesehatan Lingkungan Bagi Anak Usia Dini. J-Innovative.",
    uri: "https://j-innovative.org"
  },
  {
    title: "Pentingnya Menanamkan Literasi Lingkungan pada Pendidikan Anak Usia Dini. Jurnal UNJ.",
    uri: "https://journal.unj.ac.id"
  },
  {
    title: "Pentingnya Menumbuhkan Literasi Lingkungan Sejak Dini. UPI Repository.",
    uri: "https://repository.upi.edu"
  },
  {
    title: "Peningkatan Pengetahuan Lingkungan Melalui Kegiatan Luar Kelas Pada Anak Usia Dini. Journal Unesa.",
    uri: "https://ejournal.unesa.ac.id"
  },
  {
    title: "Developing 'Waste Sortation' Big Book to Enhance Environmental Care Attitude. Journal of Research and Innovation in Early Childhood Education (UNNES).",
    uri: "https://journal.unnes.ac.id"
  },
  {
    title: "Implementasi Pendidikan Lingkungan Hidup di Taman Kanak-Kanak. Jurnal Pendidikan Unimed.",
    uri: "https://jurnal.unimed.ac.id"
  }
];

export const PRELOADED_PROPOSAL_TEXT = `
PENGARUH PENGGUNAAN MEDIA BIG BOOK DAN KEGIATAN SAYANGI 
LINGKUNGAN TERHADAP KEMAMPUAN LITERASI LINGKUNGAN ANAK USIA DINI

BAB I
PENDAHULUAN
1.1 Latar Belakang Masalah
Di era kontemporer ini, degradasi lingkungan telah menjadi isu global yang mendesak, 
menuntut respons kolektif dari berbagai sektor, termasuk pendidikan. Literasi lingkungan 
(environmental literacy) tidak lagi dipandang sekadar sebagai suplemen dalam kurikulum, 
melainkan sebagai kompetensi esensial yang harus ditanamkan sejak dini untuk menjamin 
keberlangsungan hidup manusia dan ekosistem. Literasi lingkungan merupakan aspek 
fundamental dalam kehidupan manusia, terutama dalam membentuk kesadaran dan 
tanggung jawab terhadap pelestarian lingkungan. Individu yang memiliki literasi lingkungan 
yang baik tidak hanya memahami isu-isu ekologis secara kognitif, tetapi juga memiliki 
disposisi afektif dan keterampilan psikomotorik untuk bertindak demi lingkungan.

Pendidikan Anak Usia Dini (PAUD), khususnya pada rentang usia 3-6 tahun, memegang 
peranan strategis dalam pembentukan karakter ini. Fase ini sering disebut sebagai golden 
age, di mana perkembangan neurologis anak terjadi sangat pesat, dan nilai-nilai yang 
ditanamkan pada masa ini akan menjadi fondasi kepribadian hingga dewasa. Wilson (2018) 
menekankan bahwa pada periode inilah pengenalan literasi lingkungan dapat membentuk 
karakter anak yang peduli dan bertanggung jawab secara berkelanjutan. Jika pada masa ini 
anak tidak mendapatkan stimulasi yang tepat mengenai hubungan timbal balik antara 
manusia dan alam, maka akan sulit untuk mengubah perilaku mereka di masa mendatang.

Namun, realitas di lapangan sering kali menunjukkan adanya kesenjangan (gap) antara 
idealisme pendidikan lingkungan dengan praktik pembelajaran sehari-hari. Berdasarkan 
observasi awal yang dilakukan peneliti di lembaga PAUD di Kecamatan Gunung Sindur, 
khususnya di PAUD KB Nararya dan PAUD KB Cempaka, ditemukan bahwa tingkat 
pemahaman dan perilaku literasi lingkungan anak masih tergolong rendah. Fenomena ini 
terindikasi dari perilaku anak-anak yang cenderung kurang memahami pentingnya menjaga 
kebersihan, kerap membuang sampah sembarangan (tidak pada tempatnya), serta kurangnya 
empati terhadap penggunaan sumber daya alam, seperti air, secara bijaksana. Anak-anak 
belum menunjukkan inisiatif untuk merawat tanaman atau menjaga kebersihan kelas tanpa 
instruksi berulang dari guru.

Rendahnya literasi lingkungan ini disinyalir disebabkan oleh metode pengajaran yang kurang 
bervariasi dan cenderung monoton. Pembelajaran di kelas masih didominasi oleh metode 
ceramah atau penggunaan Lembar Kerja Anak (LKA) yang bersifat abstrak dan kurang
melibatkan anak secara aktif. Padahal, Chawla (2020) menyatakan bahwa pengembangan 
literasi lingkungan pada anak usia dini haruslah membantu mereka mengenali isu-isu ekologis 
melalui cara yang membentuk karakter peduli. Pembelajaran yang minim interaksi dan 
visualisasi membuat konsep "pelestarian lingkungan" menjadi sesuatu yang jauh dari 
jangkauan pemahaman konkret anak usia dini.

Untuk mengatasi permasalahan tersebut, diperlukan intervensi pembelajaran yang inovatif, 
menarik, serta kontekstual. Salah satu media yang dinilai efektif untuk anak usia dini adalah 
Big Book. Big Book merupakan buku bergambar berukuran besar dengan teks dan ilustrasi 
yang diperbesar, yang dirancang khusus untuk kegiatan membaca bersama (shared 
reading). Karakteristik Big Book yang visual, berwarna-warni, dan memiliki pola kalimat 
sederhana serta repetitif, sangat sesuai dengan perkembangan kognitif anak usia dini. Media 
ini tidak hanya memfasilitasi pembelajaran literasi bahasa, tetapi juga mampu menyajikan 
informasi ekologis secara visual dan naratif yang mudah dipahami, membantu anak 
memahami konsep pelestarian lingkungan secara konkret (Machfiroh & Santoso, 2019; 
Kurniawati & Fitriani, 2021).

Akan tetapi, penggunaan media visual saja belum cukup untuk membangun literasi lingkungan 
yang utuh. Literasi lingkungan menuntut adanya aksi nyata. Oleh karena itu, penelitian ini 
mengusulkan pengintegrasian media Big Book dengan kegiatan "Sayangi Lingkungan". 
Kegiatan ini merupakan bentuk pembelajaran berbasis pengalaman (experiential learning) 
yang melibatkan anak secara langsung dalam aksi nyata, seperti menanam pohon, 
membersihkan lingkungan, memilah sampah, dan mengunjungi tempat pengolahan sampah. 
Sobel (2019) dan Susilawati & Supriatna (2022) menegaskan bahwa pengalaman langsung 
semacam ini tidak hanya menanamkan nilai cinta lingkungan, tetapi juga memberikan 
pengalaman praktis yang memperkuat struktur pengetahuan anak.

Kombinasi antara media Big Book (sebagai sarana transfer pengetahuan visual-naratif) dan 
kegiatan "Sayangi Lingkungan" (sebagai sarana internalisasi nilai melalui praktik langsung) 
diharapkan dapat menjadi solusi komprehensif. Berdasarkan latar belakang empiris di 
Kecamatan Gunung Sindur dan kajian teoretis tersebut, penelitian ini bertujuan untuk 
mengkaji secara mendalam pengaruh penggunaan media Big Book dan kegiatan "Sayangi 
Lingkungan" terhadap kemampuan literasi lingkungan anak usia dini. Penelitian ini penting 
dilakukan untuk memberikan wawasan strategi pembelajaran yang efektif dalam membentuk 
generasi yang memiliki karakter peduli lingkungan sejak dini.

1.2 Identifikasi Masalah
Berangkat dari latar belakang masalah yang telah diuraikan, beberapa permasalahan pokok 
yang teridentifikasi dalam konteks pembelajaran di PAUD Kecamatan Gunung Sindur adalah 
sebagai berikut:
1. Minimnya Kemampuan Literasi Lingkungan Anak: Anak-anak masih menunjukkan 
pemahaman dan perilaku yang rendah terkait kepedulian lingkungan, seperti kebiasaan 
membuang sampah sembarangan dan ketidakpedulian terhadap tanaman sekitar.
2. Metode Pengajaran yang Monoton: Proses pembelajaran yang berlangsung 
cenderung kurang bervariasi, lebih banyak mengandalkan instruksi verbal satu arah, dan 
melewatkan keterlibatan anak secara aktif dalam proses penemuan pengetahuan 
(inquiry).
3. Penggunaan Media yang Kurang Menarik: Media pembelajaran atau Alat Permainan 
Edukatif (APE) yang digunakan belum cukup menarik atensi anak dan belum secara 
spesifik dirancang untuk menanamkan nilai-nilai ekologis.
4. Kurangnya Integrasi Pembelajaran Kontekstual: Kegiatan pembelajaran belum 
sepenuhnya mengintegrasikan pengalaman nyata (hands-on activity) yang 
menghubungkan materi kelas dengan realitas lingkungan di sekitar anak.

1.3 Pembatasan Masalah
Mengingat luasnya cakupan permasalahan dan agar penelitian ini lebih terarah serta 
mendalam, peneliti membatasi ruang lingkup penelitian sebagai berikut:
1. Lokasi Penelitian: Dibatasi di wilayah Kecamatan Gunung Sindur, dengan fokus spesifik 
pada dua lembaga, yaitu PAUD KB Nararya (sebagai kelompok eksperimen) dan PAUD 
KB Cempaka (sebagai kelompok kontrol).
2. Variabel Penelitian:
○ Variabel Bebas (Independent): Penggunaan Media Big Book dan Pelaksanaan 
Kegiatan "Sayangi Lingkungan".
○ Variabel Terikat (Dependent): Kemampuan Literasi Lingkungan Anak Usia Dini.
3. Subjek Penelitian: Anak usia dini pada rentang usia 5-6 tahun (Kelompok B) di kedua 
lembaga tersebut.

1.4 Rumusan Masalah
Berdasarkan latar belakang dan pembatasan masalah di atas, rumusan masalah yang 
diajukan dalam penelitian ini adalah:
1. Apakah terdapat pengaruh penggunaan Media Big Book terhadap kemampuan Literasi 
Lingkungan pada Anak Usia Dini di Kecamatan Gunung Sindur?
2. Apakah kegiatan pembelajaran "Sayangi Lingkungan" dapat mempengaruhi Kemampuan 
Literasi Lingkungan Anak Usia Dini?
3. Apakah terdapat interaksi atau pengaruh gabungan antara penggunaan Media Big Book
dan kegiatan "Sayangi Lingkungan" dalam meningkatkan kemampuan Literasi 
Lingkungan Anak Usia Dini?

1.5 Tujuan Penelitian
Penelitian ini dilaksanakan dengan tujuan utama sebagai Tugas Akhir Penelitian Magister 
(TAPM), dengan rincian tujuan operasional sebagai berikut:
1. Mengidentifikasi dan mengukur besaran pengaruh penggunaan media Big Book
terhadap Kemampuan Literasi Lingkungan pada Anak Usia Dini.
2. Menganalisis kontribusi dan efektivitas kegiatan "Sayangi Lingkungan" dalam 
meningkatkan kemampuan kepedulian lingkungan pada Anak Usia Dini.
3. Menentukan efektivitas interaksi antara penggunaan media Big Book dan kegiatan 
"Sayangi Lingkungan" secara bersama-sama terhadap peningkatan kemampuan 
kepedulian dan literasi lingkungan Anak Usia Dini.
4. Memberikan rekomendasi berbasis bukti (evidence-based) untuk praktik pembelajaran 
yang efektif dalam meningkatkan literasi lingkungan di jenjang PAUD.

1.6 Manfaat Penelitian
Penelitian ini diharapkan memberikan kontribusi signifikan, baik secara teoretis maupun 
praktis:
1.6.1 Manfaat Teoretis
Secara akademis, penelitian ini diharapkan dapat memperkaya khazanah keilmuan Pendidikan 
Anak Usia Dini, khususnya yang berkaitan dengan pengembangan strategi literasi lingkungan. 
Temuan penelitian ini dapat menjadi referensi pengembangan teori belajar yang 
mengintegrasikan aspek visual (Big Book) dengan aspek kinestetik-naturalis (kegiatan 
lingkungan) dalam menstimulasi perkembangan holistik anak.

1.6.2 Manfaat Praktis
1. Bagi Anak Didik: Penggunaan media dan kegiatan ini diharapkan dapat menciptakan 
suasana belajar yang menyenangkan (joyful learning), sehingga kemampuan literasi 
lingkungan anak meningkat secara alami tanpa paksaan, serta menumbuhkan karakter 
cinta lingkungan sejak dini.
2. Bagi Guru: Memberikan wawasan dan alternatif metode pembelajaran inovatif. Guru 
dapat memahami pentingnya media Big Book dan kegiatan kontekstual sebagai alat 
bantu yang efektif dalam menanamkan nilai-nilai abstrak seperti kepedulian lingkungan.
3. Bagi Kepala Sekolah: Hasil penelitian dapat menjadi bahan masukan empiris untuk
merumuskan kebijakan sekolah yang mendukung peningkatan literasi lingkungan, serta 
pengembangan kurikulum operasional satuan pendidikan yang berwawasan lingkungan.
4. Bagi Orang Tua dan Masyarakat: Meningkatkan kesadaran orang tua tentang 
pentingnya literasi lingkungan, sehingga dapat terjadi sinergi antara pembiasaan di 
sekolah dan di rumah melalui partisipasi dalam kegiatan "Sayangi Lingkungan".
5. Bagi Dunia Pendidikan Secara Umum: Memberikan dasar bagi pembuatan kebijakan 
pendidikan yang mendukung integrasi literasi lingkungan dalam kurikulum pendidikan 
dasar, serta berkontribusi pada perbaikan kualitas lingkungan jangka panjang melalui 
pembentukan generasi yang lebih peduli (agents of change).

BAB II
KAJIAN PUSTAKA, KERANGKA BERPIKIR, DAN HIPOTESIS
2.1 Kajian Pustaka
2.1.1 Media Big Book
A. Pengertian Media Big Book
Media Big Book menempati posisi strategis dalam pembelajaran anak usia dini sebagai 
jembatan antara bahasa lisan dan bahasa tulis. Secara definisi, Big Book adalah buku cerita 
berukuran besar (biasanya A3 atau lebih besar) dengan teks dan gambar yang diperbesar, 
memungkinkan aktivitas membaca bersama (shared reading) antara guru dan sekelompok 
anak. Definisi ini didukung oleh Tasrif dan Aliem (dalam Akib & Bahri, 2022) serta USAID, 
yang menekankan karakteristik fisik Big Book yang harus terbaca jelas oleh seluruh siswa di 
kelas.

Karakteristik khusus Big Book menurut USAID meliputi: (1) cerita yang singkat dan padat, (2) 
pola kalimat yang jelas dan berulang, (3) gambar yang memiliki makna kontekstual yang kuat, 
(4) jenis dan ukuran huruf yang mudah dibaca, serta (5) alur cerita yang mudah dipahami oleh 
anak. Permatasari et al. (2018) dan Kardillah & Syamsudduha (2022) menambahkan bahwa 
Big Book tidak hanya sekadar buku besar, tetapi merupakan buku yang "dipilih untuk 
dibesarkan" karena memiliki kualitas literasi tertentu, seperti repetisi kata dan kesesuaian 
dengan minat anak.

B. Karakteristik dan Ciri-Ciri Big Book
Efektivitas Big Book sangat bergantung pada karakteristik intrinsiknya. Karges dan Bone 
(dalam Roy & Dutta, 2022; Madiun, 2024) menguraikan ciri-ciri esensial Big Book yang efektif:
● Pola Pengulangan (Repetitive Patterns): Adanya frasa atau kalimat yang diulang-
ulang membantu anak memprediksi teks, membangun rasa percaya diri dalam membaca,
dan memperkuat retensi memori.
● Pengulangan Kumulatif: Penambahan elemen cerita secara bertahap yang diulang 
kembali, melatih daya ingat anak.
● Alur Cerita yang Dapat Ditebak (Predictable Plot): Struktur cerita yang logis dan 
sederhana memungkinkan anak menggunakan skemata mereka untuk menebak 
kelanjutan cerita.
● Kesesuaian dengan Minat Siswa: Konten harus relevan dengan dunia anak, dalam hal 
ini tema lingkungan yang dekat dengan keseharian mereka.

C. Kelebihan Big Book dalam Pembelajaran
Dawson et al. (2021) mengidentifikasi berbagai keunggulan Big Book:
1. Fokus Atensi: Ukuran yang besar secara alami menarik perhatian visual anak.
2. Pengalaman Bersama (Shared Experience): Memungkinkan seluruh kelas berbagi 
pengalaman emosional dan kognitif yang sama saat mendengarkan cerita.
3. Stimulus Rasa Ingin Tahu: Gambar yang menarik memicu pertanyaan dan diskusi, 
mengembangkan kemampuan berpikir kritis.
4. Pengembangan Bahasa: Memperkaya kosakata dan pemahaman struktur kalimat 
melalui konteks cerita yang bermakna.

2.1.2 Kegiatan Sayangi Lingkungan
Kegiatan "Sayangi Lingkungan" merupakan manifestasi dari pendekatan pembelajaran yang 
berpusat pada anak (student-centered) dan kontekstual. Kegiatan ini dirancang untuk 
menstimulasi perkembangan sosial-emosional dan fisik-motorik anak melalui interaksi 
langsung dengan alam.

A. Konsep Dasar
Menurut Jafar et al. (2023), pemahaman perkembangan anak usia dini menjadi dasar 
perancangan stimulasi. Aspek sosial-emosional, yang mencakup interaksi dengan lingkungan, 
sangat krusial. Talango (2020) menyatakan bahwa interaksi positif dengan lingkungan 
membantu anak mengelola emosi. Kegiatan "Sayangi Lingkungan" menyediakan wadah bagi 
interaksi ini.

B. Implementasi Kegiatan
Kegiatan ini mencakup aktivitas seperti menanam pohon, membersihkan kelas, memilah 
sampah, dan merawat tanaman. Indriyani et al. (2023) menyebutkan indikator perilaku cinta 
lingkungan meliputi kebiasaan membuang sampah pada tempatnya dan merawat tanaman. 
Azzet (2013) menambahkan bahwa karakter cinta lingkungan adalah indikator kepedulian 
seseorang terhadap sekitarnya, yang harus dibentuk melalui proses pendidikan panjang dan 
pembiasaan aktif. Kegiatan "Sayangi Lingkungan" bukan sekadar aktivitas fisik, melainkan 
wahana penanaman nilai karakter tanggung jawab dan disiplin.

2.1.3 Literasi Lingkungan (Environmental Literacy)
A. Definisi Literasi Lingkungan
Literasi lingkungan adalah kemampuan komprehensif yang mencakup pengetahuan, 
keterampilan, dan sikap yang diperlukan untuk memahami hubungan antara manusia dan 
sistem alam, serta kemampuan untuk mengambil keputusan yang bertanggung jawab terkait 
lingkungan (Maesaroh, 2021). Tujuan akhirnya adalah pembentukan perilaku yang pro-
lingkungan.

B. Tahapan Literasi Lingkungan Anak Usia Dini
Mengacu pada North American Association for Environmental Education (NAAEE, 2016) dan 
Wilson (2018), tahapan literasi untuk anak usia dini meliputi:
1. Kesadaran Lingkungan (Awareness): Mengenali elemen dasar alam (air, tanah, 
tumbuhan).
2. Pemahaman Dasar: Mengerti hubungan sebab-akibat sederhana (misal: sampah 
menyebabkan kotor).
3. Sikap Positif: Empati terhadap makhluk hidup.
4. Keterampilan Pengambilan Keputusan: Tindakan sederhana seperti mematikan keran 
air atau membuang sampah pada tempatnya.

Pendekatan terbaik untuk mengembangkan literasi ini adalah melalui metode bermain, 
bercerita (storytelling), dan pengalaman langsung di alam, yang sejalan dengan integrasi Big 
Book dan kegiatan "Sayangi Lingkungan" dalam penelitian ini.

2.2 Penelitian Relevan
Untuk memposisikan penelitian ini dalam peta akademik, peneliti menganalisis lima penelitian 
terdahulu yang relevan dalam rentang waktu 2020-2025:
1. Hulkairiyah (2020): "Pengembangan Media Big Book untuk Meningkatkan Kecerdasan 
Naturalis...". Hasil: Peningkatan kecerdasan naturalis sebesar 25% (dari 41,94% menjadi 
66,94%). Relevansi: Menunjukkan efektivitas Big Book pada domain naturalis.
2. Larohmah (2025): "Pengembangan Kemampuan Literasi Awal... Melalui Kegiatan Sesi 
Pilih-Pilih". Hasil: Kegiatan sudut/pilihan efektif mengembangkan aspek bahasa dan 
kognitif. Relevansi: Mendukung pentingnya kegiatan aktif dalam pembelajaran literasi.
3. Fatimah (2020/2021): "Upaya Peningkatan Pembelajaran Literasi... Melalui Panggung 
Boneka". Hasil: Peningkatan literasi dari 34,37% ke 76,04%. Relevansi: Menunjukkan 
media bercerita (sejenis Big Book) efektif meningkatkan literasi.
4. Chandrawati & Aisyah (2022): "Penanaman Cinta Lingkungan Pada Masyarakat 
PAUD". Hasil: Guru dan anak tergugah untuk mencintai lingkungan melalui kegiatan 
menanam. Relevansi: Validasi efektivitas kegiatan praktis "Sayangi Lingkungan".
5. Setiyaningsih & Syamsudin (2023): "Pengembangan Media Big Book untuk 
Meningkatkan Literasi...". Hasil: Mayoritas anak mencapai kategori Berkembang Sangat 
Baik (BSB). Relevansi: Bukti kuat efektivitas Big Book untuk literasi.

Research Gap & Novelty:
Penelitian ini mengisi celah (gap) dengan menggabungkan dua variabel independen (Big Book 
+ Kegiatan Praktis "Sayangi Lingkungan") untuk menyasar variabel dependen spesifik (Literasi 
Lingkungan), bukan hanya literasi umum atau kecerdasan naturalis semata. Kebaruan 
(novelty) penelitian ini terletak pada pendekatan integratif yang menyentuh aspek kognitif-
visual dan afektif-kinestetik secara simultan di konteks geografis Gunung Sindur.

2.3 Kerangka Berpikir
Kerangka berpikir penelitian ini didasarkan pada premis bahwa kemampuan literasi 
lingkungan anak usia dini dipengaruhi oleh kualitas stimulus yang mereka terima.
● Input: Anak usia dini dengan kemampuan literasi lingkungan awal yang rendah.
● Proses (Intervensi):
○ Media Big Book (X1): Berfungsi sebagai stimulus visual dan kognitif. Melalui cerita 
bergambar, anak mendapatkan pengetahuan (knowledge) tentang konsep 
lingkungan. Pengulangan kata membantu penguatan memori.
○ Kegiatan Sayangi Lingkungan (X2): Berfungsi sebagai stimulus kinestetik dan 
afektif. Pengetahuan yang didapat dari buku dipraktikkan langsung (menanam, 
memilah sampah), sehingga menjadi pengalaman bermakna (meaningful learning).
● Output: Peningkatan Kemampuan Literasi Lingkungan (Y), yang terukur dari perubahan 
pengetahuan, sikap, dan perilaku anak.
Secara skematis, hubungan antar variabel digambarkan sebagai berikut: Media Big Book dan 
Kegiatan "Sayangi Lingkungan" secara parsial maupun simultan berpengaruh positif terhadap 
Kemampuan Literasi Lingkungan.

2.4 Hipotesis Penelitian
Berdasarkan kajian teori dan kerangka berpikir, hipotesis penelitian dirumuskan sebagai 
berikut:
1. Ha1: Terdapat pengaruh signifikan penggunaan media Big Book terhadap kemampuan 
Literasi Lingkungan pada Anak Usia Dini.
2. Ha2: Terdapat pengaruh signifikan kegiatan pembelajaran "Sayangi Lingkungan" 
terhadap Kemampuan Literasi Lingkungan Anak Usia Dini.
3. Ha3: Terdapat pengaruh signifikan secara bersama-sama (simultan) antara penggunaan 
Media Big Book dan kegiatan "Sayangi Lingkungan" terhadap peningkatan kemampuan 
Literasi Lingkungan Anak Usia Dini di PAUD KB Nararya.

BAB III
METODE PENELITIAN
3.1 Jenis dan Desain Penelitian
Penelitian ini menggunakan pendekatan kuantitatif dengan jenis penelitian Quasi-
Experimental (Eksperimen Semu). Desain yang digunakan adalah Non-Equivalent Control 
Group Design. Menurut Sugiyono (2011), desain ini dipilih karena kondisi di lapangan tidak 
memungkinkan peneliti untuk melakukan pengacakan (random assignment) subjek secara 
penuh karena kelas-kelas sudah terbentuk secara alami.
Desain penelitian dapat digambarkan sebagai berikut:
O1 X O2
O3 - O4
Keterangan:
● O1 & O3: Pretest (Tes awal kemampuan literasi lingkungan pada kedua kelompok).
● X: Perlakuan (Treatment) berupa penggunaan media Big Book dan kegiatan "Sayangi 
Lingkungan" pada kelompok eksperimen.
● -: Kelompok kontrol menggunakan pembelajaran konvensional (LKA/Metode ceramah 
biasa).
● O2 & O4: Posttest (Tes akhir kemampuan literasi lingkungan).

3.2 Tempat dan Waktu Penelitian
Tempat Penelitian:
Penelitian dilaksanakan di dua lembaga PAUD di Kecamatan Gunung Sindur yang dipilih 
secara purposive karena memiliki karakteristik yang setara (homogen):
1. Kelompok Eksperimen: PAUD KB Nararya. Alamat: Perumahan Bukit Dago BDU RT 06 
RW 014 No. 42A. Berdiri tahun 2016, luas tanah 300m², memiliki 7 guru (4 S1, 3 SLTA).
2. Kelompok Kontrol: PAUD KB Cempaka. Alamat: Perumahan Taman Sari Bukit Damai 
Blok C 3 RT 03 RW 08 No. 11. Berdiri tahun 2009, luas tanah 250m², memiliki 6 guru (4 S1, 
2 SLTA).
Kedua sekolah memiliki latar belakang sosial ekonomi orang tua yang serupa (90% bekerja 
PNS/Swasta, pendidikan SLTA-S2), yang meminimalkan bias variabel eksternal.

Waktu Penelitian:
Penelitian dilaksanakan pada Semester Genap Tahun Ajaran 2024/2025, dimulai dari bulan 
Februari hingga Maret 2025.

3.3 Populasi dan Sampel
Populasi: Seluruh siswa usia 5-6 tahun (Kelompok B) di PAUD Kecamatan Gunung Sindur.
Sampel:
1. Kelompok Eksperimen (KB Nararya): 15 Siswa (8 Laki-laki, 7 Perempuan).
2. Kelompok Kontrol (KB Cempaka): 15 Siswa (8 Laki-laki, 7 Perempuan).
Teknik pengambilan sampel adalah Purposive Sampling berdasarkan kriteria usia dan 
karakteristik sekolah.

3.4 Definisi Operasional Variabel
1. Media Big Book (X1): Media buku besar (A3) yang berisi cerita bertema lingkungan 
dengan gambar dominan dan teks sederhana. Diukur melalui frekuensi penggunaan dan 
keterlibatan atensi anak saat kegiatan bercerita.
2. Kegiatan Sayangi Lingkungan (X2): Rangkaian aktivitas terstruktur yang meliputi 
pengenalan konsep kebersihan, praktik memungut dan memilah sampah, serta menanam 
tanaman. Diukur menggunakan lembar observasi partisipasi anak dalam setiap tahapan 
kegiatan.
3. Kemampuan Literasi Lingkungan (Y): Skor kemampuan anak yang mencakup aspek 
pengetahuan (menyebutkan benda alam/buatan), sikap (kepedulian), dan perilaku 
(tindakan nyata menjaga lingkungan). Diukur menggunakan tes unjuk kerja dan observasi 
dengan skala penilaian.

3.5 Instrumen Penelitian
Instrumen yang digunakan adalah lembar observasi dan pedoman tes unjuk kerja.
Pengembangan Instrumen:
1. Uji Validitas: Menggunakan Validitas Isi (Content Validity) dengan pendapat ahli (Expert 
Judgment) untuk memastikan kesesuaian butir dengan indikator.
2. Uji Reliabilitas: Menggunakan teknik internal consistency (belah dua) dengan rumus 
Spearman-Brown.

3.6 Teknik Pengumpulan dan Analisis Data
Pengumpulan Data:
● Observasi partisipatif selama kegiatan pembelajaran.
● Tes awal (pretest) dan tes akhir (posttest).
● Dokumentasi kegiatan.
Analisis Data:
1. Uji Prasyarat:
○ Uji Normalitas: Menggunakan rumus kemiringan kurva atau Shapiro-Wilk untuk 
memastikan data berdistribusi normal.
○ Uji Homogenitas: Menggunakan Uji F (Fisher) untuk membandingkan varians 
terbesar dan terkecil.
2. Uji Hipotesis:
○ Uji T (Independent Sample t-test): Untuk mengetahui perbedaan signifikan rata-
rata posttest antara kelas eksperimen dan kontrol.
○ Uji Regresi Linier Sederhana: Untuk mengetahui besarnya pengaruh variabel 
independen terhadap dependen (Y = a + bX).

BAB IV
HASIL PENELITIAN DAN PEMBAHASAN
4.1 Deskripsi Data Hasil Penelitian
Penelitian ini telah dilaksanakan sesuai prosedur yang direncanakan di PAUD KB Nararya 
(Eksperimen) dan PAUD KB Cempaka (Kontrol). Data yang diperoleh berupa skor kemampuan 
literasi lingkungan anak sebelum (pretest) dan sesudah (posttest) perlakuan.

4.1.1 Data Kelompok Eksperimen (PAUD KB Nararya)
Pada kelompok ini, pembelajaran dilaksanakan dengan mengintegrasikan media Big Book
bertema "Sungaiku Bersih" dan "Hutan Sahabatku", serta kegiatan praktik "Sayangi 
Lingkungan" berupa operasi semut dan penanaman bibit bunga.
● Pretest: Skor rata-rata pretest kelompok eksperimen adalah 45,53. Pada tahap ini, 
sebagian besar anak (12 anak) berada pada kategori Mulai Berkembang (MB). Anak-anak 
masih kesulitan membedakan sampah organik dan anorganik serta belum menunjukkan 
inisiatif menjaga kebersihan.
● Posttest: Setelah diberikan perlakuan selama 4 kali pertemuan, skor rata-rata meningkat 
signifikan menjadi 82,67. Sebaran data menunjukkan 10 anak mencapai kategori 
Berkembang Sangat Baik (BSB) dan 5 anak Berkembang Sesuai Harapan (BSH). Anak-
anak terlihat antusias menceritakan kembali isi Big Book dan secara otomatis membuang 
sampah pada tempat yang sesuai setelah makan bekal.

4.1.2 Data Kelompok Kontrol (PAUD KB Cempaka)
Kelompok ini menggunakan metode konvensional dengan LKA dan bercerita tanpa media 
besar.
● Pretest: Skor rata-rata pretest adalah 44,80, relatif sama dengan kelompok eksperimen, 
menunjukkan kondisi awal yang homogen.
● Posttest: Skor rata-rata posttest adalah 58,40. Peningkatan terjadi namun tidak setajam 
kelompok eksperimen. Mayoritas anak masih berada pada kategori Mulai Berkembang 
(MB) dan Berkembang Sesuai Harapan (BSH).

4.2 Uji Prasyarat Analisis
4.2.1 Uji Normalitas
Kelompok Eksperimen: Sig. = 0,154 (> 0,05). Kelompok Kontrol: Sig. = 0,210 (> 0,05).
Data berdistribusi normal.
4.2.2 Uji Homogenitas
F hitung = 1,12 < F tabel (2,48). Sig. = 0,345 (> 0,05). Varians homogen.

4.3 Pengujian Hipotesis
4.3.1 Uji Perbedaan (Independent Sample t-test)
Hasil Uji Independent Sample t-test (Posttest):
t-hitung (8,765) > t-tabel (2,048), Sig. (2-tailed) 0,000 < 0,05.
Kesimpulan: H0 Ditolak, Ha Diterima. Terdapat perbedaan signifikan.

4.3.2 Uji Regresi Linier Sederhana
Persamaan regresi: Y = 12,45 + 0,78X.
R Square: 0,684 (68,4%).

4.4 Pembahasan
4.4.1 Pengaruh Media Big Book terhadap Literasi Lingkungan
Media Big Book memiliki dampak positif signifikan, sejalan dengan teori Dual Coding Paivio. 
Visual besar memfokuskan atensi, repetisi membantu memori. Konsisten dengan penelitian 
Hulkairiyah (2020) dan Setiyaningsih (2023).

4.4.2 Kontribusi Kegiatan "Sayangi Lingkungan"
Peningkatan skor drastis karena pengalaman konkret (hands-on). Anak memilah sampah 
langsung, menanam pohon (emotional bonding). Mendukung temuan Chandrawati (2022).

4.4.3 Sinergi Visual dan Kinestetik
Kombinasi Big Book (Why) dan Kegiatan Praktis (How) menciptakan pembelajaran holistik. 
Sinergi ini menyebabkan lonjakan gain skor lebih tinggi dibanding metode konvensional.

BAB V
KESIMPULAN DAN SARAN
5.1 Kesimpulan
1. Pengaruh Signifikan Media Big Book: Berpengaruh positif dan signifikan terhadap 
pemahaman kognitif.
2. Efektivitas Kegiatan Praktis: Berkontribusi nyata dalam pembentukan sikap dan 
perilaku.
3. Keunggulan Model Integratif: Interaksi positif kedua variabel meningkatkan kemampuan 
literasi lingkungan secara signifikan (Gain +37,14 vs +13,60).

5.2 Saran
1. Bagi Pendidik PAUD: Adopsi Big Book dan rutinkan kegiatan Sayangi Lingkungan.
2. Bagi Kepala Sekolah: Fasilitasi media dan dorong kolaborasi orang tua.
3. Bagi Peneliti Selanjutnya: Perluas cakupan usia dan teliti variabel moderasi lain.

LAMPIRAN
Lampiran 1: Kisi-Kisi Instrumen Penelitian (Pengetahuan, Sikap, Perilaku)
Lampiran 2: RPPH Eksperimen (Shared Reading, Sorting Game, Aksi Nyata)
Lampiran 3: Lembar Observasi Checklist (Membuang sampah, memilah, antusiasme, menyiram tanaman)
`;