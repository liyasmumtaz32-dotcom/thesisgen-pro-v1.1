
export const TARGET_WORD_COUNT = 25000; 
export const WORDS_PER_PAGE = 250; // Adjusted for Double Spacing (Times New Roman 12)

export const CHAPTER_PAGE_ESTIMATES: Record<number, { min: number, max: number, desc: string }> = {
  1: { min: 10, max: 15, desc: "Pendahuluan (Latar Belakang, Identifikasi, Tujuan)" },
  2: { min: 25, max: 35, desc: "Kajian Pustaka, Kerangka Pikir, Hipotesis" },
  3: { min: 15, max: 20, desc: "Metode Penelitian (Desain, Populasi, Instrumen)" },
  4: { min: 30, max: 40, desc: "Hasil dan Pembahasan (Tabel, Diagram, Analisis)" },
  5: { min: 5, max: 10, desc: "Kesimpulan dan Saran" },
  6: { min: 20, max: 50, desc: "Lampiran (Instrumen, Data Mentah, Output Statistik)" }
};

export const APPENDICES_PAGE_ESTIMATE = { 
  min: 0, 
  max: 0, 
  desc: "Included in Chapter 6" 
};

export const INITIAL_THESIS_DATA = {
  title: "PENGARUH PENGGUNAAN MEDIA BIG BOOK DAN KEGIATAN SAYANGI LINGKUNGAN TERHADAP KEMAMPUAN LITERASI LINGKUNGAN ANAK USIA DINI",
  studentName: "SITI QOUMARIAH",
  studentId: "501212934",
  university: "UNIVERSITAS TERBUKA",
  faculty: "PROGRAM PASCASARJANA",
  program: "MAGISTER PENDIDIKAN DASAR" // Adjusted to match generic UT style or user input
};

export const INITIAL_CONFIG = {
  minYear: 2019,
  maxYear: 2024,
  maxReferences: 60
};

export const MOCK_LOGS = [
  "Membaca Panduan PTAP5406 UT...",
  "Menginisialisasi standar format Times New Roman...",
  "Menyiapkan struktur Bab I-V dan Lampiran...",
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
  // --- DOKUMEN RESMI ---
  {
    title: "Universitas Terbuka. (2017). Panduan Penulisan Proposal dan Tugas Akhir Program Magister (PTAP5406). Penerbit Universitas Terbuka.",
    uri: "http://www.ut.ac.id"
  },
  { 
    title: "UNESCO & UNEP. (1978). Intergovernmental conference on environmental education: Tbilisi Declaration.", 
    uri: "https://unesdoc.unesco.org" 
  },
  // --- JURNAL TERKAIT ---
  {
    title: "Machfiroh, R., & Santoso, A. (2019). Pemanfaatan Big Book sebagai Media Literasi Anak Usia Dini. Jurnal Pendidikan Anak Usia Dini.",
    uri: "Journal Reference"
  },
  {
    title: "Wilson, R. A. (2018). Nature and young children: Encouraging creative play and learning in natural environments. Routledge.",
    uri: "Book Reference"
  }
];

export const PRELOADED_PROPOSAL_TEXT = `
PENGARUH PENGGUNAAN MEDIA BIG BOOK DAN KEGIATAN SAYANGI 
LINGKUNGAN TERHADAP KEMAMPUAN LITERASI LINGKUNGAN ANAK USIA DINI

BAB I
PENDAHULUAN
1.1 Latar Belakang Masalah
... (Content from previous context) ...
`;
