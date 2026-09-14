/**
 * Local AI Engine — Q&A tentang Zian Wahidi
 *
 * Basis pengetahuan: `cv-data.ts` (CV resmi), `Experience.tsx`, `Certifications.tsx`,
 * dan `Projects.tsx` — jadi semua angka & nama yang disebut di sini bisa dilacak.
 *
 * Prinsip desain:
 *
 * 1. KOTAK-KOTAK — jawaban dipecah menjadi beberapa box kecil, bukan satu blok
 *    paragraf panjang. UI merendernya sebagai kartu terpisah.
 *
 * 2. SCOPED — hanya menjawab apa yang ditanya. Pertanyaan sempit menghasilkan
 *    jawaban sempit (mis. "apa hobi Zian?" hanya membalas kotak hobi).
 *
 * 3. ANTI-DUMP — topik luas tidak membuang semua data sekaligus. Ia menampilkan
 *    ringkasan + `chips` supaya user memilih sendiri bagian yang ingin digali.
 *
 * 4. MENGAJAK — setiap jawaban berisi bukti konkret (angka, nama brand, tahun)
 *    dan ditutup chip yang memancing rasa ingin tahu untuk menggali lebih dalam.
 *
 * Pemilihan topik memakai skor spesifisitas: keyword terpanjang (paling spesifik)
 * yang menang, sehingga "apa hobi zian" → topik hobi, bukan topik personal.
 */
import { CV_DATA } from "./cv-data";

// ─────────────────────────────────────────────────────────────
// Tipe jawaban terstruktur
// ─────────────────────────────────────────────────────────────

export interface AIBox {
  /** Judul kotak, mis. "☁️ Cloud & AI" */
  title: string;
  /** Isi kotak — setiap baris dirender sebagai satu poin */
  items: string[];
}

export interface AIAnswer {
  /** Kalimat pembuka singkat (maks. 1–2 baris) */
  lead?: string;
  /** Kotak-kotak isi jawaban */
  boxes?: AIBox[];
  /** Pertanyaan lanjutan yang bisa diklik user */
  chips?: string[];
}

// ─────────────────────────────────────────────────────────────
// Struktur Data CV Internal
// ─────────────────────────────────────────────────────────────

interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  location: string;
  highlights: string[];
}

interface Certification {
  name: string;
  org: string;
  date: string;
}

interface Project {
  title: string;
  year: number;
  category: string;
  desc: string;
}

interface SkillGroup {
  title: string;
  items: string[];
}

interface CVParsed {
  name: string;
  email: string;
  location: string;
  education: string;
  summary: string;
  experiences: Experience[];
  certifications: Certification[];
  skills: SkillGroup[];
  projects: Project[];
  roles: string[];
  languages: { name: string; level: string }[];
}

// ─────────────────────────────────────────────────────────────
// Parser CV Otomatis
// ─────────────────────────────────────────────────────────────

function parseCV(): CVParsed {
  const data = CV_DATA;
  const lines = data.split("\n").map((l) => l.trim());

  const getSection = (start: string, end?: string): string[] => {
    const startIdx = lines.findIndex((l) => l.startsWith(start));
    if (startIdx === -1) return [];
    const endIdx = end
      ? lines.findIndex((l, i) => i > startIdx && l.startsWith(end))
      : lines.length;
    const sectionLines = lines.slice(
      startIdx + 1,
      endIdx > startIdx ? endIdx : lines.length,
    );
    return sectionLines.filter((l) => l.length > 0 && !l.startsWith("---"));
  };

  const name =
    lines
      .find((l) => l.startsWith("NAMA LENGKAP:"))
      ?.replace("NAMA LENGKAP:", "")
      .trim() || "Zian Wahidi";
  const email =
    lines
      .find((l) => l.startsWith("EMAIL:"))
      ?.replace("EMAIL:", "")
      .trim() || "zianwhd@gmail.com";
  const location =
    lines
      .find((l) => l.startsWith("LOKASI:"))
      ?.replace("LOKASI:", "")
      .trim() || "Jakarta Timur, DKI Jakarta";
  const educationLine =
    lines
      .find((l) => l.startsWith("PENDIDIKAN:"))
      ?.replace("PENDIDIKAN:", "")
      .trim() || "Universitas Paramadina — Teknik Informatika";

  const summaryLines = getSection("RINGKASAN PROFESIONAL:");
  const summary = summaryLines.join(" ");

  const expLines = getSection("PENGALAMAN KERJA:", "CERTIFICATIONS");
  const experiences: Experience[] = [];
  let currentExp: Partial<Experience> = {};
  for (const line of expLines) {
    if (line.match(/^\d+\.\s/)) {
      if (currentExp.company) {
        experiences.push(currentExp as Experience);
      }
      const [companyPart, ...rest] = line.replace(/^\d+\.\s/, "").split("—");
      const company = companyPart.trim();
      const restStr = rest.join("—").trim();
      const roleMatch = restStr.match(/^(.+?)\s\((.+?),\s(.+?),\s(.+?)\)$/);
      currentExp = {
        company,
        role: roleMatch?.[1]?.trim() || restStr,
        period: roleMatch?.[2]?.trim() || "",
        type: roleMatch?.[3]?.trim() || "",
        location: roleMatch?.[4]?.trim() || "",
        highlights: [],
      };
    } else if (line.startsWith("-")) {
      const highlight = line.replace(/^-\s*/, "").trim();
      if (highlight && currentExp.highlights) {
        currentExp.highlights.push(highlight);
      }
    }
  }
  if (currentExp.company) {
    experiences.push(currentExp as Experience);
  }

  const certLines = getSection("CERTIFICATIONS", "SKILLS TEKNIS");
  const certifications: Certification[] = [];
  for (const line of certLines) {
    const match = line.match(/^(.+?)\s—\s(.+?)\s\((.+?)\)$/);
    if (match) {
      certifications.push({
        name: match[1].trim(),
        org: match[2].trim(),
        date: match[3].trim(),
      });
    }
  }

  const skillLines = getSection("SKILLS TEKNIS:", "PROJECTS");
  const skills: SkillGroup[] = [];
  for (const line of skillLines) {
    if (line.startsWith("-")) {
      const lineContent = line.replace(/^-\s*/, "").trim();
      const colonIdx = lineContent.indexOf(":");
      if (colonIdx > -1) {
        const title = lineContent.substring(0, colonIdx).trim();
        const items = lineContent
          .substring(colonIdx + 1)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        skills.push({ title, items });
      }
    }
  }

  const projLines = getSection("PROJECTS TERPILIH:", "ROLES");
  const projects: Project[] = [];
  for (const line of projLines) {
    const cleanLine = line.replace(/^-\s*/, "").trim();
    const sepIdx = cleanLine.indexOf(" — ");
    if (sepIdx === -1) continue;

    const titlePart = cleanLine.substring(0, sepIdx).trim();
    const descPart = cleanLine.substring(sepIdx + 3).trim();

    let year = 2025;
    const yearInDesc = descPart.match(/\((\d{4})\)$/);
    if (yearInDesc) {
      year = parseInt(yearInDesc[1]);
    } else {
      const yearInTitle = titlePart.match(/(\d{4})\)?$/);
      if (yearInTitle) {
        year = parseInt(yearInTitle[1]);
      }
    }

    const lowerDesc = descPart.toLowerCase();
    const category = lowerDesc.includes("dashboard")
      ? "Dashboard"
      : lowerDesc.includes("videographer") ||
          lowerDesc.includes("drone") ||
          lowerDesc.includes("multimedia")
        ? "Videographer"
        : "Web";

    projects.push({ title: titlePart, year, category, desc: descPart });
  }

  const roleLines = getSection("ROLES:", "BAHASA");
  const roles = roleLines
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").trim());

  const langLines = getSection("BAHASA:");
  const languages: { name: string; level: string }[] = [];
  for (const line of langLines) {
    if (line.startsWith("-")) {
      const parts = line.replace(/^-\s*/, "").split("(");
      languages.push({
        name: parts[0].trim(),
        level: parts[1]?.replace(")", "").trim() || "",
      });
    }
  }

  return {
    name,
    email,
    location,
    education: educationLine,
    summary,
    experiences,
    certifications,
    skills,
    projects,
    roles,
    languages,
  };
}

const cv = parseCV();

// ─────────────────────────────────────────────────────────────
// Bank Data — pecahan kecil, bukan blok raksasa
// ─────────────────────────────────────────────────────────────

const SKILL_GROUPS = {
  web: [
    "HTML, CSS, JavaScript",
    "**React JS** + Framer Motion + Three.js",
    "**PHP & Laravel**",
    "MySQL",
    "Bootstrap & Tailwind CSS",
  ],
  devops: [
    "Git & GitHub",
    "Vercel",
    "**Amazon EC2**",
    "cPanel (Hostinger / Niagahoster)",
    "Docker",
    "Google Cloud & Google Workspace",
    "PuTTY & Filezilla",
  ],
  network: [
    "PC Assembly (rakit PC)",
    "Instalasi & troubleshooting OS Windows",
    "Konfigurasi Access Point",
    "Setup printer",
    "System backup & recovery",
    "**Drone videographer / photographer**",
  ],
  multimedia: [
    "**OBS Studio & vMix** (live event)",
    "CapCut & Adobe Premiere Pro",
    "Canva",
    "SAP Build Apps",
    "Microsoft Office",
  ],
};

/** 10 sertifikasi resmi — dikelompokkan agar tidak dibuang sekaligus. */
const CERT_GROUPS = {
  cloudAi: [
    "**Prompt Design in Vertex AI** — Google Cloud (Jan 2025)",
    "**Code Generation & Optimization Using IBM Granite** — IBM SkillsBuild (Jul 2025)",
    "**Training Data Science Explore** (SAP Analytics & Build Apps) — ASEAN Foundation (Mei 2024)",
  ],
  webDev: [
    "**Training Fullstack Web Developer** — Harisenin.com (Jan 2024)",
    "**JavaScript Algorithms and Data Structures** — FreeCodeCamp (Des 2023)",
    "**Fundamental Front-End & Laravel** — Coding Studio (Sep 2023)",
  ],
  itAndLanguage: [
    "**Kompetensi Level II Jaringan dan Komputer** — Lembaga Sertifikasi Profesi (Des 2024)",
    "**TOEFL Institutional Testing** (Skor 447) — Brighten English (Feb 2023)",
  ],
  safety: [
    "**Safety Leadership** — WSO Indonesia (Des 2023)",
    "**Holistic Safety Coaching Introduction** — Prosyd Academy (Feb 2023)",
  ],
};

/** Bukti terukur — menjawab dengan angka, bukan klaim. */
const METRICS = [
  "🎪 **50+ corporate live event** ditangani sebagai FOH & operator multimedia",
  "🖧 **35+ aset IT internal** dikelola dengan **uptime jaringan 99%**",
  "🛡️ **Zero data loss** selama 2 tahun backup mingguan",
  "🌐 **10+ website** korporat, event page, dan dashboard dirilis",
  "📘 Dokumentasi teknis berbasis **PDCA** dipakai **15+ staff internal** untuk onboarding",
  "🎓 **10 sertifikasi** lintas bidang dalam ~3 tahun",
];

const EXPERIENCE_BOXES = {
  jovenindo: {
    title: "🏢 PT. Jovenindo Inti Solusi — Web Developer & IT Support",
    items: [
      "**Jun 2024 – Sekarang** · Full-time · Jakarta",
      "Membangun responsive landing page untuk event **AWS, Metrodata, Anaplan, SAP, dan Netpoleon**",
      "Deploy & konfigurasi web app di **Amazon EC2**, **cPanel** (Hostinger/Niagahoster), dan GitHub",
      "Maintenance jaringan internal dengan **99% uptime** & **zero data loss** selama 2 tahun",
      "Menjalankan multimedia (**OBS Studio / vMix**) sebagai FOH operator untuk **50+ live event**",
      "Menyusun technical documentation berbasis **PDCA** yang dipakai **15+ staff internal**",
    ],
  },
  hiperkes: {
    title: "🏥 Pusat Hiperkes & Kesehatan Kerja DKI Jakarta — Web Developer",
    items: [
      "**Feb 2025** · Project · Jakarta",
      "Mendesain & membangun official site **pusatk3-hiperkesdkijakarta.id** untuk layanan publik",
      "Integrasi **3rd-party API** untuk penjadwalan pelatihan & seminar real-time",
      "Mengelola hosting, performance, dan security situs",
      "Memberikan **user training untuk 5 staff internal**",
    ],
  },
  dutaraya: {
    title: "🏗️ PT. Dutaraya Dinametro — IT Support (Internship)",
    items: [
      "**Jun 2023 – Mei 2024** · Internship · Jakarta",
      "Membangun company profile & sistem **E-Legalitas** untuk subsidiary PT Selvi Bahagia Utama",
      "Menangani administrasi tender **LPSE** & **E-Catalogue** end-to-end",
      "Merakit & maintenance **3 high-spec PC** untuk tim Drafter",
      "Mendesain **CAD floor plans**",
    ],
  },
};

const PROJECT_BOXES = {
sowatrace: {
    title: "📊 SOWATRACE — ESG Logistics & Warehouse Management System (2026)",
    items: [
      "Platform **monitoring logistik digital** dan kearsipan pergudangan terpadu",
      "Fokus pada **transparansi ESG** (Environmental, Social, Governance) serta pelacakan operasional **real-time**",
      "Implementasi manajemen inventaris berbasis logika **FEFO (First Expired, First Out)**",
      "Kategori: Web Dashboard & WMS",
      "Dikembangkan sekaligus sebagai **riset skripsi/thesis kelulusan** 🎓",
    ],
  },
  hiperkes: {
    title: "🏥 Pusat Hiperkes K3 DKI Jakarta (2026)",
    items: [
      "Official site **pusatk3-hiperkesdkijakarta.id** — live dan dipakai publik",
      "Layanan publik bidang **occupational health & safety (K3)**",
      "Integrasi **3rd-party API** untuk jadwal pelatihan & seminar real-time",
      "Termasuk hosting, security, hingga training 5 staff internal",
    ],
  },
  event: {
    title: "🎪 Event Landing Pages — PT. Jovenindo Inti Solusi",
    items: [
      "Landing page **responsif skala besar** untuk event korporat",
      "Brand yang ditangani: **AWS, Metrodata, Anaplan, SAP, Netpoleon, MSD**",
      "Juga **Braze Connections Jakarta** & **Oracle AI Applications Forum Indonesia**",
      "Dikerjakan paralel dengan jadwal event yang padat",
    ],
  },
  dutaraya: {
    title: "🏗️ Company Profile, E-Legalitas & E-Arsip",
    items: [
      "**PT. Selvi Bahagia Utama** — company profile & progress proyek properti",
      "**PT. Srikandi Katiga** — company profile layanan K3, sertifikasi & jadwal pelatihan",
      "**Firma Hukum STB & Partners** — company profile advokasi hukum & kredensial partner",
      "**E-Legalitas** — manajemen dokumen legal korporat PT. Dutaraya Dinametro",
      "**E-Arsip** — sistem korespondensi surat masuk & keluar",
    ],
  },
  education: {
    title: "🎓 Sintetis Academy (2025)",
    items: [
      "Platform edukasi **interaktif & bilingual**",
      "Mendukung learning ecosystem yang kolaboratif",
      "Fokus pada pengembangan skill penggunanya",
    ],
  },
  portfolio: {
    title: "👤 Portfolio Zian Wahidi 2025",
    items: [
      "Website portfolio pribadi yang merangkum skill full-stack, sertifikasi, dan project",
      "Live di **ziianw.github.io/portofolio-zianwahidi**",
      "Dibangun sebagai ruang eksperimen animasi & interaksi web",
    ],
  },
  drone: {
    title: "🎥 Drone Video — Graha Karangsari Karawang (2024)",
    items: [
      "Pengambilan gambar **aerial drone** untuk marketing properti",
      "Editing video komersial profesional",
      "Kategori: Videographer",
    ],
  },
  multimedia: {
    title: "🎬 Live Event Multimedia Operations",
    items: [
      "Bertindak sebagai **FOH Engineer** & operator multimedia (**OBS Studio / vMix**)",
      "**50+ corporate live event** ditangani",
      "Mengelola tata kelola **35+ aset IT internal**, uptime jaringan **99%**",
    ],
  },
};

/**
 * Timeline perjalanan — dipakai untuk bercerita, bukan sekadar daftar.
 */
const JOURNEY_STEPS = [
  "**2023** — Mulai dari **IT Support internship** di PT. Dutaraya Dinametro: rakit PC, CAD floor plan, administrasi tender LPSE & E-Catalogue",
  "**2023** — Ambil jalur sertifikasi web: **Coding Studio** (Sep) lalu **FreeCodeCamp** JavaScript Algorithms (Des)",
  "**2024 (Jun)** — Naik jadi **Web Developer & IT Support full-time** di PT. Jovenindo Inti Solusi",
  "**2025 (Feb)** — Pegang project publik: official site **Pusat Hiperkes K3 DKI Jakarta**",
  "**2025** — Tambah sertifikasi **cloud & AI**: Google Cloud (Vertex AI) dan IBM SkillsBuild (Granite)",
  "**2026** — Fokus membangun **sistem dashboard**: Sowatrace, Document Management System, Event RSVP Management",
];

const WOW_FACTS = [
  "🎯 Bisa **ngoding, ngurus server, sekaligus ngoperasiin live event** — kombinasi yang jarang ada di satu orang",
  "📦 Sistem kearsipan gudang yang ia bangun (**Sowatrace**) berjalan di atas algoritma **FEFO**, dan itu sekaligus jadi **thesis kelulusannya**",
  "⏰ Di sela kerja **full-time**, ia masih aktif kuliah **Teknik Informatika** di Paramadina",
  "📘 Dokumentasi teknis buatannya dipakai **15+ staff internal** untuk onboarding",
  "🌱 Dulu internship jadi IT Support — sekarang megang **3 dashboard sistem** dan **10+ website** korporat",
];

const DAY_TO_DAY = [
  "Membangun & merawat **landing page event korporat**",
  "Deploy web app ke **Amazon EC2** / cPanel dan jaga performanya",
  "Maintain **jaringan internal** + backup mingguan",
  "Jadi **FOH operator multimedia** saat ada live event (OBS Studio / vMix)",
  "Menulis **dokumentasi teknis** agar tim lain bisa ikut merawat sistemnya",
];

// ─────────────────────────────────────────────────────────────
// Chip — dipakai untuk memancing rasa ingin tahu
// ─────────────────────────────────────────────────────────────

const CHIP = {
  tech: "Apa keahlian teknis Zian?",
  project: "Project apa saja yang pernah dikerjakan?",
  character: "Bagaimana karakter kerja Zian?",
  cert: "Sertifikasi apa saja yang dimiliki Zian?",
  hobby: "Apa hobi Zian?",
  music: "Apa lagu favoritnya?",
  personal: "Bagaimana keseharian Zian di luar kerja?",
  hr: "Kenapa Zian cocok direkrut?",
  contact: "Bagaimana cara menghubungi Zian?",
  metrics: "Apa pencapaian terukur Zian?",
  journey: "Bagaimana perjalanan karir Zian?",
  wow: "Hal menarik apa yang belum saya tahu tentang Zian?",
  hybrid: "Kenapa profil Zian berbeda dari yang lain?",
  daily: "Apa pekerjaan sehari-hari Zian?",
  experience: "Di mana saja Zian pernah bekerja?",
  strength: "Apa kelebihan Zian?",
  weakness: "Apa kekurangan Zian?",
  teamwork: "Bagaimana Zian bekerja dalam tim?",
  sowatrace: "Apa itu Sowatrace?",
  eventPages: "Apa saja event landing page yang dibuat?",
  multimedia: "Apa pengalaman live event Zian?",
  time: "Bagaimana Zian mengatur waktu?",
  freelance: "Jasa freelance apa yang ditawarkan?",
};

// ─────────────────────────────────────────────────────────────
// Definisi Topik — setiap topik = satu kotak jawaban kecil
// ─────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  keywords: string[];
  build: () => AIAnswer;
}

const TOPICS: Topic[] = [
  // ══════════════ PROFIL & LATAR BELAKANG ══════════════
  {
    id: "overview",
    keywords: [
      "siapa zian",
      "siapa dia",
      "siapa sih",
      "tentang zian",
      "profil zian",
      "profile zian",
      "deskripsikan zian",
      "deskripsikan",
      "jelaskan tentang zian",
      "jelasin tentang zian",
      "kenalan",
      "perkenalan",
      "perkenalkan",
      "ringkasan",
    ],
    build: () => ({
      lead: "Zian itu tipe orang yang susah ditaruh di satu kotak. Ini peta singkatnya — pilih kotak mana yang mau kamu bongkar dulu 👇",
      boxes: [
        {
          title: "🧑‍💻 Peran Sekarang",
          items: [
            "**Web Developer & IT Support** di PT. Jovenindo Inti Solusi (Jun 2024 – sekarang)",
            "Sekaligus **mahasiswa aktif** Teknik Informatika, Universitas Paramadina",
          ],
        },
        {
          title: "🎓 Pendidikan",
          items: [
            "S1 **Teknik Informatika** — Universitas Paramadina",
            "**SMKN 26 Jakarta** — Sistem Informatika Jaringan & Aplikasi",
          ],
        },
        {
          title: "🎯 Fokus Bidang",
          items: [
            "Web development: **React JS & Laravel**",
            "Infrastruktur IT: cloud (EC2), server, jaringan",
            "Multimedia live event: **OBS Studio / vMix**",
          ],
        },
      ],
      chips: [CHIP.wow, CHIP.tech, CHIP.hybrid],
    }),
  },
  {
    id: "edu-campus",
    keywords: [
      "kuliah",
      "kampus",
      "paramadina",
      "universitas",
      "mahasiswa",
      "jurusan kuliah",
      "sarjana",
      "s1",
      "gelar",
    ],
    build: () => ({
      lead: "Sambil kerja full-time, Zian masih menempuh kuliah:",
      boxes: [
        {
          title: "🎓 Universitas Paramadina",
          items: [
            "Program studi **Teknik Informatika** (S1)",
            "Status: **mahasiswa aktif**",
            "Dijalani paralel dengan pekerjaan **full-time** sebagai Web Developer & IT Support",
          ],
        },
      ],
      chips: [CHIP.time, CHIP.journey],
    }),
  },
  {
    id: "edu-smk",
    keywords: ["smk", "smkn 26", "smkn26", "sekolah", "vokasi", "jurusan smk"],
    build: () => ({
      lead: "Fondasi teknisnya mulai terbentuk dari sini:",
      boxes: [
        {
          title: "🏫 SMKN 26 Jakarta",
          items: [
            "Jurusan **Sistem Informatika Jaringan dan Aplikasi**",
            "Di sinilah dasar **jaringan & hardware**-nya terbentuk",
            "Berlanjut jadi internship IT Support sebelum akhirnya jadi developer",
          ],
        },
      ],
      chips: [CHIP.journey, CHIP.tech],
    }),
  },
  {
    id: "work-current",
    keywords: [
      "jovenindo",
      "kerja di mana",
      "bekerja di mana",
      "kerja dimana",
      "pekerjaan sekarang",
      "perusahaan",
      "kantor",
      "posisi sekarang",
      "jabatan",
    ],
    build: () => ({
      lead: "Ini pekerjaan utamanya sekarang — dan cakupannya lumayan lebar:",
      boxes: [EXPERIENCE_BOXES.jovenindo],
      chips: [CHIP.daily, CHIP.metrics],
    }),
  },
  {
    id: "work-hiperkes",
    keywords: ["hiperkes", "pusatk3", "k3", "keselamatan kerja", "dki jakarta"],
    build: () => ({
      lead: "Salah satu project paling publik yang ia pegang:",
      boxes: [EXPERIENCE_BOXES.hiperkes],
      chips: [CHIP.project, CHIP.contact],
    }),
  },
  {
    id: "work-dutaraya",
    keywords: [
      "dutaraya",
      "dinametro",
      "internship",
      "magang",
      "pkl",
      "pengalaman pertama",
      "awal karir",
    ],
    build: () => ({
      lead: "Di sinilah semuanya dimulai — sebagai intern:",
      boxes: [EXPERIENCE_BOXES.dutaraya],
      chips: [CHIP.journey, CHIP.project],
    }),
  },
  {
    id: "career-overview",
    keywords: [
      "pengalaman kerja",
      "pengalaman",
      "karir",
      "karier",
      "riwayat kerja",
      "riwayat",
      "pernah bekerja",
      "di mana saja",
    ],
    build: () => ({
      lead: "Zian sudah melewati **3 tempat kerja** dengan peran yang makin naik:",
      boxes: [
        {
          title: "📋 Rekam Jejak",
          items: [
            "**2023–2024** · PT. Dutaraya Dinametro — IT Support *(Internship)*",
            "**2024–sekarang** · PT. Jovenindo Inti Solusi — Web Developer & IT Support *(Full-time)*",
            "**2025** · Pusat Hiperkes K3 DKI Jakarta — Web Developer *(Project)*",
          ],
        },
        {
          title: "📈 Garis Besarnya",
          items: [
            "Mulai dari **hardware & administrasi** → berkembang ke **web development** → sekarang pegang **dashboard sistem**",
            "Tidak pernah lepas dari sisi **infrastruktur & operasional**",
          ],
        },
      ],
      chips: [CHIP.journey, CHIP.metrics, CHIP.hr],
    }),
  },
  {
    id: "journey",
    keywords: [
      "perjalanan karir",
      "perjalanan",
      "ceritakan",
      "cerita",
      "gimana awalnya",
      "bagaimana memulai",
      "awal mula",
      "timeline",
      "berkembang",
    ],
    build: () => ({
      lead: "Kalau ditarik satu garis, perjalanannya konsisten naik dari 2023:",
      boxes: [{ title: "🧭 Timeline Karir", items: JOURNEY_STEPS }],
      chips: [CHIP.metrics, CHIP.wow, CHIP.hr],
    }),
  },

  // ══════════════ BUKTI & ANGKA ══════════════
  {
    id: "metrics",
    keywords: [
      "pencapaian",
      "pencapaian terukur",
      "angka",
      "metrik",
      "metrics",
      "hasil",
      "impact",
      "dampak",
      "kontribusi",
      "berapa banyak",
      "seberapa",
    ],
    build: () => ({
      lead: "Daripada sekadar klaim, ini angka yang bisa ia pertanggungjawabkan:",
      boxes: [{ title: "📊 Bukti Terukur", items: METRICS }],
      chips: [CHIP.hr, CHIP.project, CHIP.experience],
    }),
  },
  {
    id: "wow-facts",
    keywords: [
      "hal menarik tentang zian",
      "menarik tentang zian",
      "fakta tentang zian",
      "hal menarik tentang",
      "fakta menarik tentang",
      "hal menarik",
      "fakta menarik",
      "fakta unik",
      "belum tahu",
      "yang belum saya tahu",
      "kejutan",
      "menarik",
      "unik",
      "spesial",
      "hebat",
      "keren",
    ],
    build: () => ({
      lead: "Ini beberapa hal yang biasanya bikin orang berhenti dan baca ulang 👀",
      boxes: [{ title: "✨ Yang Mungkin Belum Kamu Tahu", items: WOW_FACTS }],
      chips: [CHIP.metrics, CHIP.sowatrace, CHIP.personal],
    }),
  },
  {
    id: "why-hybrid",
    keywords: [
      "profil zian berbeda",
      "kenapa profil zian berbeda",
      "bedanya zian",
      "berbeda dari yang lain",
      "beda dari yang lain",
      "kenapa berbeda",
      "kenapa unik",
      "hybrid",
      "kombinasi",
      "jarang",
      "nilai plus",
      "pembeda",
      "keunikan",
    ],
    build: () => ({
      lead: "Alasan profil Zian susah dicari padanannya:",
      boxes: [
        {
          title: "🧩 Tiga Peran dalam Satu Orang",
          items: [
            "**Developer** yang paham infrastruktur — bukan cuma nulis kode, tapi juga tahu cara deploy & jaga servernya",
            "**IT Support** yang bisa ngoding — jago hardware/jaringan sekaligus bisa bangun aplikasinya sendiri",
            "**Operator multimedia** yang mengerti sistem — menangani 50+ live event dengan pendekatan teknis",
          ],
        },
        {
          title: "🎯 Kenapa Ini Penting",
          items: [
            "Tidak perlu tiga orang berbeda untuk satu alur kerja",
            "Cepat berpindah konteks: dari bug database ke troubleshoot jaringan ke setup live event",
          ],
        },
      ],
      chips: [CHIP.hr, CHIP.tech, CHIP.metrics],
    }),
  },
  {
    id: "day-to-day",
    keywords: [
      "sehari-hari",
      "kerjaan sehari-hari",
      "rutinitas kerja",
      "tugasnya apa",
      "jobdesk",
      "job desk",
      "tanggung jawab",
      "aktivitas kerja",
      "ngapain aja",
    ],
    build: () => ({
      lead: "Hari-hari Zian di kantor isinya campur — dan itu memang disengaja:",
      boxes: [{ title: "🗓️ Rutinitas Kerja", items: DAY_TO_DAY }],
      chips: [CHIP.experience, CHIP.tech, CHIP.multimedia],
    }),
  },

  // ══════════════ KARAKTER & CARA KERJA ══════════════
  {
    id: "char-core",
    keywords: [
      "karakter",
      "sifat",
      "kepribadian",
      "orangnya",
      "pribadi",
      "ramah",
      "humble",
      "rendah hati",
      "sopan",
    ],
    build: () => ({
      lead: "Ada pola yang konsisten muncul di semua pekerjaannya:",
      boxes: [
        {
          title: "🧠 Karakter Inti",
          items: [
            "**Detail-oriented** — teliti pada detail visual & logika sistem",
            "**Solutif** — mencari jalan keluar, bukan menunggu instruksi",
            "**Humble & komunikatif** — mudah diajak koordinasi dalam tim",
            "**Disiplin** — menjalani kerja full-time sambil tetap kuliah",
          ],
        },
        {
          title: "🔍 Buktinya",
          items: [
            "Dokumentasi teknisnya dipakai **15+ staff internal** untuk onboarding",
            "Network internal yang ia pegang stabil di **99% uptime**",
            "Menangani **50+ live event** tanpa kendala teknis berarti",
          ],
        },
      ],
      chips: [CHIP.strength, CHIP.weakness, CHIP.teamwork],
    }),
  },
  {
    id: "char-fastlearner",
    keywords: [
      "fast learner",
      "cepat belajar",
      "adaptif",
      "belajar cepat",
      "mudah belajar",
      "kemampuan belajar",
    ],
    build: () => ({
      lead: "Kalau soal kecepatan belajar, ini bukti yang bisa dilihat:",
      boxes: [
        {
          title: "⚡ Fast Learner",
          items: [
            "**10 sertifikasi** lintas bidang dalam ~3 tahun (cloud, web, jaringan, safety)",
            "Pindah konteks kerja: hardware → web dev → dashboard sistem → multimedia event",
            "Terbiasa mempelajari tools baru secara mandiri, tanpa menunggu pelatihan internal",
          ],
        },
      ],
      chips: [CHIP.cert, CHIP.wow, CHIP.character],
    }),
  },
  {
    id: "char-workflow",
    keywords: [
      "cara kerja",
      "etos kerja",
      "etos",
      "alur kerja",
      "metodologi",
      "pdca",
      "terstruktur",
      "dokumentasi",
      "manajemen kerja",
    ],
    build: () => ({
      lead: "Gaya kerjanya berpusat pada satu hal: **keteraturan**.",
      boxes: [
        {
          title: "🔄 Metode Kerja",
          items: [
            "Memakai siklus **PDCA** (Plan → Do → Check → Act)",
            "Menulis **dokumentasi sistem** agar tim lain bisa ikut merawat",
            "Berorientasi pada **efisiensi alur kerja & otomatisasi**",
            "Backup mingguan yang konsisten — **zero data loss** selama 2 tahun",
          ],
        },
      ],
      chips: [CHIP.teamwork, CHIP.strength, CHIP.daily],
    }),
  },
  {
    id: "char-strength",
    keywords: [
      "kelebihan",
      "kekuatan",
      "keunggulan",
      "strength",
      "nilai jual",
      "poin plus",
    ],
    build: () => ({
      lead: "Tiga hal yang paling sering menonjol dari Zian:",
      boxes: [
        {
          title: "💪 Kelebihan Utama",
          items: [
            "**Kombinasi jarang** — bisa coding (React/Laravel) sekaligus pegang infra (EC2, jaringan)",
            "**Fast learner** — 10 sertifikasi lintas bidang dalam ~3 tahun",
            "**Tahan tekanan** — 50+ live event korporat ditangani tanpa kendala teknis berarti",
            "**Rapi** — dokumentasi teknisnya jadi rujukan 15+ staff internal",
          ],
        },
      ],
      chips: [CHIP.weakness, CHIP.hr, CHIP.metrics],
    }),
  },
  {
    id: "char-weakness",
    keywords: ["kekurangan", "kelemahan", "weakness", "minus", "kekurangannya"],
    build: () => ({
      lead: "Soal kekurangan — ini yang paling jujur bisa disampaikan:",
      boxes: [
        {
          title: "📉 Area Perbaikan",
          items: [
            "Cenderung **over-detail** — kadang terlalu lama menyempurnakan hal kecil",
            "Sulit menolak permintaan tambahan karena ingin semuanya beres",
            "Jadwalnya padat karena menyeimbangkan **kerja full-time + kuliah**, jadi perlu perencanaan ekstra untuk hal di luar rutinitas",
          ],
        },
      ],
      chips: [CHIP.strength, CHIP.time, CHIP.teamwork],
    }),
  },
  {
    id: "char-teamwork",
    keywords: [
      "kerja dalam tim",
      "bekerja dalam tim",
      "kerja sama tim",
      "dalam tim",
      "tim",
      "teamwork",
      "kerja sama",
      "kerjasama",
      "kolaborasi",
      "berkolaborasi",
      "project manager",
      "kerja tim",
    ],
    build: () => ({
      lead: "Cara Zian bekerja dalam tim:",
      boxes: [
        {
          title: "🤝 Kolaborasi",
          items: [
            "**Komunikatif** — aktif mengabari progres, tidak menunggu ditanya",
            "**Fleksibel** terhadap arahan Project Manager",
            "**Proaktif mitigasi** — mencari kendala teknis sebelum berdampak ke tim",
            "Terbiasa jadi jembatan antara tim non-teknis dan teknis",
          ],
        },
      ],
      chips: [CHIP.character, CHIP.hr, CHIP.weakness],
    }),
  },

  // ══════════════ HR / REKRUTMEN ══════════════
  {
    id: "hr-hire",
    keywords: [
      "kenapa harus merekrut",
      "mengapa harus merekrut",
      "kenapa zian",
      "mengapa zian",
      "alasan merekrut",
      "alasan memilih",
      "harus hire",
      "why hire",
      "rekrut zian",
      "hire zian",
      "kenapa cocok",
    ],
    build: () => ({
      lead: "Kalau harus diringkas jadi satu kalimat: **satu orang, tiga peran**.",
      boxes: [
        {
          title: "✅ Alasan Merekrut Zian",
          items: [
            "Profil **hybrid**: developer + IT support + operator multimedia",
            "Mandiri & adaptif — bisa jalan dengan sedikit supervisi",
            "Bekerja **terukur** dengan dokumentasi yang rapi",
            "Sudah teruji di lingkungan bertekanan tinggi (50+ live event, 99% uptime)",
            "**Fast learner** — 10 sertifikasi dibuktikan dalam ~3 tahun",
          ],
        },
        {
          title: "📌 Posisi yang Cocok",
          items: [
            "Frontend / Fullstack Web Developer",
            "IT Support / IT Specialist",
            "Technical Event Operator",
          ],
        },
      ],
      chips: [CHIP.metrics, CHIP.hybrid, CHIP.contact],
    }),
  },
  {
    id: "hr-fit",
    keywords: [
      "cocok",
      "fit",
      "posisi apa",
      "role apa",
      "layak",
      "kualifikasi",
      "requirement",
      "siap direkrut",
      "open to work",
    ],
    build: () => ({
      lead: "Posisi yang paling pas dengan kombinasi skill-nya:",
      boxes: [
        {
          title: "🎯 Kecocokan Posisi",
          items: [
            "**Frontend / Fullstack Web Developer** — React, Laravel, Tailwind, MySQL",
            "**IT Support / IT Specialist** — jaringan, server, backup, hardware",
            "**Technical Event Operator** — multimedia live event (OBS/vMix)",
            "**Hybrid role** — perusahaan kecil/menengah yang butuh satu orang serba bisa",
          ],
        },
      ],
      chips: [CHIP.hr, CHIP.tech, CHIP.contact],
    }),
  },

  // ══════════════ KEAHLIAN TEKNIS ══════════════
  {
    id: "skill-web",
    keywords: [
      "html",
      "css",
      "javascript",
      "react",
      "php",
      "laravel",
      "mysql",
      "tailwind",
      "bootstrap",
      "framer motion",
      "three js",
      "threejs",
      "frontend",
      "backend",
      "fullstack",
      "programming",
      "koding",
      "coding",
      "ngoding",
      "pemrograman",
      "web development",
    ],
    build: () => ({
      lead: "Ini stack yang paling sering ia pakai untuk membangun web:",
      boxes: [{ title: "💻 Programming & Web", items: SKILL_GROUPS.web }],
      chips: [CHIP.project, "Bagaimana kemampuan server & cloud-nya?"],
    }),
  },
  {
    id: "skill-devops",
    keywords: [
      "devops",
      "cloud",
      "server",
      "hosting",
      "git",
      "vercel",
      "ec2",
      "aws",
      "cpanel",
      "putty",
      "filezilla",
      "docker",
      "deployment",
      "deploy",
      "google workspace",
    ],
    build: () => ({
      lead: "Zian bukan cuma bisa nulis kode — ia juga yang menaikkannya ke server:",
      boxes: [{ title: "☁️ DevOps, Cloud & Server", items: SKILL_GROUPS.devops }],
      chips: ["Bagaimana kemampuan jaringannya?", "Bagaimana kemampuan programming-nya?"],
    }),
  },
  {
    id: "skill-network",
    keywords: [
      "jaringan",
      "networking",
      "hardware",
      "rakit pc",
      "instal os",
      "troubleshooting",
      "printer",
      "access point",
      "backup",
      "pc assembly",
      "recovery",
    ],
    build: () => ({
      lead: "Sisi hardware & jaringan — ini yang bikin ia jarang panik saat ada masalah fisik:",
      boxes: [{ title: "🖧 Networking & Hardware", items: SKILL_GROUPS.network }],
      chips: ["Bagaimana kemampuan multimedia-nya?", "Bagaimana kemampuan server & cloud-nya?"],
    }),
  },
  {
    id: "skill-multimedia",
    keywords: [
      "multimedia",
      "obs",
      "vmix",
      "capcut",
      "premiere",
      "canva",
      "autocad",
      "sap build",
      "editing",
      "video",
      "desain",
      "microsoft office",
      "foh",
    ],
    build: () => ({
      lead: "Kemampuan multimedia-nya datang dari lapangan, bukan cuma teori:",
      boxes: [{ title: "🎬 Multimedia & Software", items: SKILL_GROUPS.multimedia }],
      chips: [CHIP.multimedia, "Bagaimana kemampuan jaringannya?"],
    }),
  },
  {
    id: "skill-overview",
    keywords: [
      "skill",
      "keahlian",
      "tech stack",
      "techstack",
      "teknologi",
      "kemampuan teknis",
      "tools",
      "stack",
      "bisa apa",
      "menguasai apa",
      "kompetensi teknis",
    ],
    build: () => ({
      lead: "Keahlian Zian terbagi ke **4 area**. Pilih salah satu untuk detailnya 👇",
      boxes: [
        {
          title: "🗂️ Peta Keahlian",
          items: [
            "💻 **Programming & Web** — React, Laravel, Tailwind, MySQL",
            "☁️ **DevOps, Cloud & Server** — EC2, Docker, Vercel, cPanel",
            "🖧 **Networking & Hardware** — troubleshooting, backup, drone",
            "🎬 **Multimedia & Software** — OBS Studio, vMix, Premiere",
          ],
        },
      ],
      chips: [
        "Bagaimana kemampuan programming-nya?",
        "Bagaimana kemampuan server & cloud-nya?",
        "Bagaimana kemampuan multimedia-nya?",
      ],
    }),
  },

  // ══════════════ PROJECT ══════════════
  {
    id: "project-sowatrace",
    keywords: [
      "sowatrace",
      "sowa trace",
      "fefo",
      "warehouse",
      "gudang",
      "skripsi",
      "thesis",
      "kearsipan",
      "esg",
    ],
    build: () => ({
      lead: "Ini project andalannya — sekaligus jadi riset skripsi:",
      boxes: [PROJECT_BOXES.sowatrace],
      chips: [CHIP.wow, CHIP.project],
    }),
  },
  {
    id: "project-hiperkes",
    keywords: ["hiperkes", "pusatk3", "k3", "keselamatan kerja"],
    build: () => ({
      lead: "Project yang websitenya bisa kamu buka langsung sekarang:",
      boxes: [PROJECT_BOXES.hiperkes],
      chips: [CHIP.eventPages, CHIP.contact],
    }),
  },
  {
    id: "project-event",
    keywords: [
      "landing page",
      "event page",
      "event",
      "metrodata",
      "anaplan",
      "netpoleon",
      "braze",
      "oracle",
      "msd",
      "acara",
      "sap",
    ],
    build: () => ({
      lead: "Ini porsi terbesar pekerjaannya di Jovenindo:",
      boxes: [PROJECT_BOXES.event],
      chips: [CHIP.multimedia, CHIP.project],
    }),
  },
  {
    id: "project-dutaraya",
    keywords: [
      "project dutaraya",
      "proyek dutaraya",
      "selvi bahagia",
      "legalitas",
      "e-legalitas",
      "e-arsip",
      "earsip",
      "dutaraya",
      "srikandi katiga",
      "srikandi",
      "stb",
      "firma hukum",
      "seduluran",
      "company profile",
      "arsip",
      "korespondensi",
    ],
    build: () => ({
      lead: "Deretan project internal & company profile yang ia bangun:",
      boxes: [PROJECT_BOXES.dutaraya],
      chips: [CHIP.project, CHIP.tech],
    }),
  },
  {
    id: "project-portfolio",
    keywords: [
      "portfolio pribadi",
      "portofolio pribadi",
      "portfolio sendiri",
      "portofolio sendiri",
      "portfolio zian",
      "portofolio zian",
      "portofolio 2025",
      "website pribadi zian",
    ],
    build: () => ({
      lead: "Project personal yang jadi ruang eksperimennya:",
      boxes: [PROJECT_BOXES.portfolio],
      chips: [CHIP.project, CHIP.contact],
    }),
  },
  {
    id: "project-sintetis",
    keywords: ["sintetis", "sintetis academy", "edukasi", "educational", "bilingual"],
    build: () => ({
      lead: "Project di ranah edukasi:",
      boxes: [PROJECT_BOXES.education],
      chips: [CHIP.project, CHIP.tech],
    }),
  },
  {
    id: "project-drone",
    keywords: [
      "video drone",
      "drone graha",
      "aerial drone",
      "drone",
      "aerial",
      "videographer",
      "graha karangsari",
      "karawang",
      "video properti",
    ],
    build: () => ({
      lead: "Ini sisi yang mungkin tidak semua orang tahu — Zian juga shooting video:",
      boxes: [PROJECT_BOXES.drone],
      chips: [CHIP.multimedia, CHIP.project],
    }),
  },
  {
    id: "project-multimedia",
    keywords: [
      "live event",
      "operator",
      "50+",
      "multimedia event",
      "streaming",
      "siaran",
      "pengalaman event",
      "pengalaman live",
    ],
    build: () => ({
      lead: "Sisi operasional lapangan Zian:",
      boxes: [PROJECT_BOXES.multimedia],
      chips: [CHIP.eventPages, CHIP.metrics],
    }),
  },
  {
    id: "project-overview",
    keywords: [
      "project",
      "proyek",
      "portofolio",
      "portfolio",
      "sistem yang dibuat",
      "aplikasi",
      "dashboard",
      "yang pernah dibuat",
      "karya",
    ],
    build: () => ({
      lead: "Total ada **10+ website & sistem** yang sudah dirilis. Ini kelompok besarnya — pilih yang mau kamu bongkar 👇",
      boxes: [
        {
          title: "🚀 Kelompok Project",
          items: [
            "📊 **Sowatrace** — ESG Logistics & Warehouse Management System dengan algoritma FEFO (2026)",
            "🏥 **Pusat Hiperkes K3 DKI Jakarta** — official site layanan publik",
            "🎪 **Event Landing Pages** — AWS, Metrodata, Anaplan, SAP, Netpoleon, MSD…",
            "🏗️ **Company Profile, E-Legalitas & E-Arsip** — grup Dutaraya",
            "🎓 **Sintetis Academy** — platform edukasi bilingual",
            "🎥 **Drone Video & Live Event Multimedia Ops** — 50+ event korporat",
          ],
        },
      ],
      chips: [CHIP.sowatrace, CHIP.eventPages, CHIP.metrics],
    }),
  },

  // ══════════════ SERTIFIKASI ══════════════
  {
    id: "cert-cloud-ai",
    keywords: [
      "sertifikasi cloud ai",
      "sertifikasi cloud",
      "sertifikat cloud",
      "sertifikasi ai",
      "sertifikat ai",
      "vertex",
      "google cloud",
      "ibm",
      "granite",
      "artificial intelligence",
      "prompt design",
      "sap analytics",
      "data science",
    ],
    build: () => ({
      lead: "Sertifikasi di area cloud & AI — ini yang paling baru:",
      boxes: [{ title: "☁️ Cloud & AI", items: CERT_GROUPS.cloudAi }],
      chips: [CHIP.cert, "Ada sertifikasi web development?"],
    }),
  },
  {
    id: "cert-web",
    keywords: [
      "sertifikasi web development",
      "sertifikasi web",
      "sertifikat web",
      "freecodecamp",
      "free code camp",
      "algorithms",
      "harisenin",
      "coding studio",
      "sertifikat laravel",
      "sertifikat react",
    ],
    build: () => ({
      lead: "Sertifikasi di area web development:",
      boxes: [{ title: "💻 Web Development", items: CERT_GROUPS.webDev }],
      chips: [CHIP.cert, "Ada sertifikasi cloud & AI?"],
    }),
  },
  {
    id: "cert-it-ops",
    keywords: [
      "sertifikasi jaringan",
      "sertifikat jaringan",
      "sertifikasi it",
      "toefl",
      "lsp",
      "lembaga sertifikasi profesi",
      "jaringan dan komputer",
      "brighten",
      "bahasa inggris",
      "skor toefl",
    ],
    build: () => ({
      lead: "Sertifikasi kompetensi IT & kemampuan bahasa:",
      boxes: [{ title: "🖧 IT Competency & Bahasa", items: CERT_GROUPS.itAndLanguage }],
      chips: [CHIP.cert, "Ada sertifikasi safety & soft skill?"],
    }),
  },
  {
    id: "cert-safety",
    keywords: [
      "sertifikasi safety",
      "sertifikat safety",
      "safety leadership",
      "wso",
      "prosyd",
      "coaching",
      "soft skill",
      "keselamatan",
    ],
    build: () => ({
      lead: "Sertifikasi di area safety & soft skill:",
      boxes: [{ title: "🧩 Safety & Soft Skill", items: CERT_GROUPS.safety }],
      chips: [CHIP.cert, CHIP.character],
    }),
  },
  {
    id: "cert-overview",
    keywords: [
      "sertifikat",
      "sertifikasi",
      "piagam",
      "pelatihan",
      "training",
      "lisensi",
      "kredensial",
      "kursus",
      "course",
    ],
    build: () => ({
      lead: "Zian punya **10 sertifikasi** yang tersebar di 4 kelompok. Pilih untuk lihat detailnya 👇",
      boxes: [
        {
          title: "🎓 Ringkasan Sertifikasi",
          items: [
            "☁️ **Cloud & AI** — 3 sertifikat (Google Cloud, IBM SkillsBuild, ASEAN Foundation)",
            "💻 **Web Development** — 3 sertifikat (Harisenin.com, FreeCodeCamp, Coding Studio)",
            "🖧 **IT Competency & Bahasa** — 2 sertifikat (LSP Level II, TOEFL 447)",
            "🧩 **Safety & Soft Skill** — 2 sertifikat (WSO Indonesia, Prosyd Academy)",
          ],
        },
      ],
      chips: [
        "Ada sertifikasi cloud & AI?",
        "Ada sertifikasi web development?",
        "Ada sertifikasi safety & soft skill?",
      ],
    }),
  },

  // ══════════════ PERSONAL ══════════════
  {
    id: "personal-hobby",
    keywords: [
      "hobi",
      "buku",
      "baca",
      "membaca",
      "atomic habits",
      "bacaan",
      "minat",
      "kesukaan",
    ],
    build: () => ({
      lead: "Di luar koding, Zian punya sisi yang cukup kontras:",
      boxes: [
        {
          title: "📚 Hobi & Bacaan",
          items: [
            "Hobi utama: **membaca buku**",
            "Buku favorit: ***Atomic Habits*** — kebetulan sejalan dengan gaya kerjanya yang berbasis kebiasaan kecil & konsisten",
            "Juga seorang **automotive enthusiast**",
          ],
        },
      ],
      chips: [CHIP.music, CHIP.time, CHIP.freelance],
    }),
  },
  {
    id: "personal-music",
    keywords: ["lagu", "musik", "perunggu", "gemilang", "playlist", "penyanyi", "band"],
    build: () => ({
      lead: "Kalau soal selera musik, jawabannya cukup spesifik:",
      boxes: [
        {
          title: "🎵 Musik Favorit",
          items: [
            "Lagu favorit: ***Gemilang* — Perunggu** 🎶",
            "Penikmat musik di waktu senggang",
          ],
        },
      ],
      chips: [CHIP.hobby, CHIP.personal],
    }),
  },
  {
    id: "personal-automotive",
    keywords: ["motor", "mobil", "otomotif", "automotive", "kendaraan"],
    build: () => ({
      lead: "Sisi otomotif Zian:",
      boxes: [
        {
          title: "🏍️ Automotive Enthusiast",
          items: [
            "Menyukai dunia otomotif",
            "Jadi ruang rehat dari rutinitas koding & kuliah",
          ],
        },
      ],
      chips: [CHIP.hobby, CHIP.personal],
    }),
  },
  {
    id: "personal-freelance",
    keywords: [
      "freelance",
      "jasa",
      "layanan",
      "bikin web",
      "buat website",
      "buat situs",
      "bikin website",
      "harga",
      "biaya",
      "tarif",
      "order",
      "pesan website",
      "jasa pembuatan",
    ],
    build: () => ({
      lead: "Selain kerja full-time, Zian juga menerima jasa pembuatan website:",
      boxes: [
        {
          title: "🛠️ Layanan Freelance",
          items: [
            "**Landing page**, **company profile**, hingga **dashboard sistem**",
            "Termasuk setup server & hosting (**cPanel** / **AWS EC2**)",
            "Dibekali **dokumentasi penggunaan** yang mudah dipahami orang awam",
            "Bisa juga bantu **domain, email bisnis, dan Google Workspace**",
          ],
        },
      ],
      chips: [CHIP.contact, CHIP.project, CHIP.tech],
    }),
  },
  {
    id: "personal-time",
    keywords: [
      "bagi waktu",
      "mengatur waktu",
      "jadwal",
      "manajemen waktu",
      "sibuk",
      "waktu luang",
      "produktif",
    ],
    build: () => ({
      lead: "Ini bagian yang paling sering bikin orang bertanya-tanya:",
      boxes: [
        {
          title: "⏰ Manajemen Waktu",
          items: [
            "Menjalani peran **Web Developer & IT Support full-time** di Jovenindo, sekaligus **mahasiswa aktif** Teknik Informatika Paramadina",
            "Kuncinya: **disiplin tinggi** dan jadwal yang terstruktur",
            "Sisi bacaan favoritnya — *Atomic Habits* — sejalan dengan gaya kerjanya",
          ],
        },
      ],
      chips: [CHIP.personal, CHIP.character, CHIP.metrics],
    }),
  },
  {
    id: "personal-overview",
    keywords: [
      "keseharian",
      "santai",
      "aktivitas",
      "di luar kerja",
      "personal",
      "kehidupan",
      "di luar koding",
    ],
    build: () => ({
      lead: "Sisi personal Zian — pilih kotak yang menarik buat kamu 👇",
      boxes: [
        {
          title: "🌱 Di Luar Pekerjaan",
          items: [
            "📚 Suka membaca buku — favorit ***Atomic Habits***",
            "🏍️ Automotive enthusiast",
            "🎵 Penikmat musik — favorit ***Gemilang* — Perunggu**",
            "🛠️ Menerima jasa freelance pembuatan website",
          ],
        },
      ],
      chips: [CHIP.music, CHIP.time, CHIP.freelance],
    }),
  },

  // ══════════════ KONTAK ══════════════
  {
    id: "social-linkedin",
    keywords: ["linkedin", "linked in"],
    build: () => ({
      lead: "LinkedIn Zian:",
      boxes: [
        { title: "💼 LinkedIn", items: ["**www.linkedin.com/in/zianwhd**"] },
      ],
      chips: ["Apa Instagram-nya?", "Bagaimana cara mengirim email ke Zian?"],
    }),
  },
  {
    id: "social-instagram",
    keywords: ["instagram", "ig", "insta"],
    build: () => ({
      lead: "Instagram Zian:",
      boxes: [{ title: "📸 Instagram", items: ["**@zianwhd**"] }],
      chips: ["Apa LinkedIn-nya?", "Bagaimana cara mengirim email ke Zian?"],
    }),
  },
  {
    id: "social-email",
    keywords: ["email", "gmail", "surel", "mengirim pesan", "kirim pesan"],
    build: () => ({
      lead: "Email Zian:",
      boxes: [{ title: "✉️ Email", items: ["**zianwhd@gmail.com**"] }],
      chips: ["Apa LinkedIn-nya?", "Apa Instagram-nya?"],
    }),
  },
  {
    id: "social-overview",
    keywords: [
      "kontak",
      "hubungi",
      "menghubungi",
      "sosmed",
      "media sosial",
      "social media",
      "koneksi",
      "cv",
      "resume",
      "recruiter",
    ],
    build: () => ({
      lead: "Zian terbuka untuk peluang kerja sama, freelance, maupun rekrutmen. Ini kanal tercepatnya:",
      boxes: [
        {
          title: "📬 Kanal Kontak",
          items: [
            "✉️ Email — **zianwhd@gmail.com**",
            "💼 LinkedIn — **www.linkedin.com/in/zianwhd**",
            "📸 Instagram — **@zianwhd**",
            "📍 Berbasis di **Jakarta Timur, DKI Jakarta**",
          ],
        },
      ],
      chips: [CHIP.hr, CHIP.freelance, CHIP.metrics],
    }),
  },
];

// ─────────────────────────────────────────────────────────────
// Pencocokan Keyword
// ─────────────────────────────────────────────────────────────

/** Normalisasi: huruf kecil, buang tanda baca, rapikan spasi. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Skor kecocokan sebuah keyword terhadap pertanyaan.
 * - Keyword pendek (≤3 huruf) wajib cocok sebagai kata utuh, supaya "ig"
 *   tidak nyangkut di "digital" atau "ai" di "kapan".
 * - Keyword panjang boleh cocok sebagian (menangkap variasi imbuhan).
 * - Semakin panjang keyword, semakin tinggi skornya → semakin spesifik.
 */
function matchScore(haystack: string, keyword: string): number {
  const k = normalize(keyword);
  if (!k) return 0;

  if (k.length <= 3) {
    const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(k)}(?:[^a-z0-9]|$)`);
    return re.test(haystack) ? k.length : 0;
  }

  return haystack.includes(k) ? k.length : 0;
}

/** Pilih topik dengan skor tertinggi. Seri → topik yang lebih dulu didaftarkan. */
function pickTopic(q: string): Topic | null {
  let best: Topic | null = null;
  let bestScore = 0;

  for (const topic of TOPICS) {
    for (const keyword of topic.keywords) {
      const score = matchScore(q, keyword);
      if (score > bestScore) {
        bestScore = score;
        best = topic;
      }
    }
  }

  return best;
}

// ─────────────────────────────────────────────────────────────
// Sapaan
// ─────────────────────────────────────────────────────────────

const GREETINGS = [
  "selamat pagi",
  "selamat siang",
  "selamat sore",
  "selamat malam",
  "halo",
  "hallo",
  "hello",
  "helo",
  "hai",
  "hey",
  "hi",
  "pagi",
  "siang",
  "sore",
  "malam",
];

/**
 * Deteksi sapaan. Kalau user menulis "halo, apa hobi zian?" maka sapaan
 * dibuang dan sisa pertanyaannya tetap diproses — bukan cuma dibalas sapaan.
 */
function stripGreeting(q: string): { isGreeting: boolean; rest: string } {
  for (const greeting of GREETINGS) {
    if (q === greeting) return { isGreeting: true, rest: "" };
    if (q.startsWith(greeting + " ")) {
      const rest = q.slice(greeting.length).replace(/^[\s,!.]+/, "").trim();
      if (!rest) return { isGreeting: true, rest: "" };
      return { isGreeting: false, rest };
    }
  }
  return { isGreeting: false, rest: q };
}

function greetingAnswer(): AIAnswer {
  return {
    lead: "Halo! 👋 Saya asisten virtual Zian. Saya menjawab per topik biar ringkas — mau mulai dari mana?",
    chips: [CHIP.wow, CHIP.tech, CHIP.journey, CHIP.hr],
  };
}

// ─────────────────────────────────────────────────────────────
// Fallback
// ─────────────────────────────────────────────────────────────

function fallbackAnswer(): AIAnswer {
  return {
    lead: "Hmm, untuk itu saya belum punya datanya. Tapi ada beberapa hal menarik yang bisa kamu gali 👇",
    chips: [CHIP.wow, CHIP.metrics, CHIP.project, CHIP.journey, CHIP.contact],
  };
}

/** Deep search ke hasil parsing CV bila tidak ada topik yang cocok. */
function deepSearch(q: string): AIAnswer | null {
  for (const exp of cv.experiences) {
    const company = normalize(exp.company);
    const role = normalize(exp.role);
    if ((company && q.includes(company)) || (role && q.includes(role))) {
      return {
        lead: "Dari riwayat kerja Zian:",
        boxes: [
          {
            title: `🏢 ${exp.company}`,
            items: [
              `**${exp.role}** — ${exp.period}${exp.location ? `, ${exp.location}` : ""}`,
              ...exp.highlights,
            ],
          },
        ],
        chips: [CHIP.metrics, CHIP.project],
      };
    }
  }

  for (const p of cv.projects) {
    const title = normalize(p.title);
    if (title && q.includes(title)) {
      return {
        lead: "Dari daftar project Zian:",
        boxes: [
          {
            title: `🚀 ${p.title}`,
            items: [`Kategori: ${p.category} · Tahun ${p.year}`, p.desc],
          },
        ],
        chips: [CHIP.project, CHIP.contact],
      };
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────
// Main Function Engine
// ─────────────────────────────────────────────────────────────

/**
 * Jawab pertanyaan tentang Zian dalam bentuk terstruktur (kotak-kotak).
 * Hanya menjawab bagian yang ditanya — tidak pernah membuang seluruh data.
 */
export function askLocalAI(question: string): AIAnswer {
  const raw = normalize(question);
  if (!raw) {
    return {
      lead: "Silakan ketik pertanyaan seputar portofolio Zian 🙂",
      chips: [CHIP.wow, CHIP.tech, CHIP.project],
    };
  }

  const { isGreeting, rest } = stripGreeting(raw);
  if (isGreeting) return greetingAnswer();

  const q = rest || raw;

  const topic = pickTopic(q);
  if (topic) return topic.build();

  return deepSearch(q) ?? fallbackAnswer();
}

/**
 * Versi teks polos dari jawaban — untuk kebutuhan non-UI (mis. logging)
 * atau komponen yang belum memakai render kotak.
 */
export function answerToPlainText(answer: AIAnswer): string {
  const parts: string[] = [];
  if (answer.lead) parts.push(answer.lead);
  for (const box of answer.boxes ?? []) {
    parts.push(box.title, ...box.items.map((item) => `• ${item}`));
  }
  return parts.join("\n");
}
