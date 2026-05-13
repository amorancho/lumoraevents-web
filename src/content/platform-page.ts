import type { Locale } from "../utils/site";

type Meta = {
  title: string;
  description: string;
};

type ModuleLink = {
  id: string;
  number: string;
  title: string;
  description: string;
  status?: string;
};

type SummaryCard = {
  title: string;
  tag: string;
  description: string;
};

type SignalCard = {
  label: string;
  value: string;
};

type StripItem = {
  title: string;
  description: string;
};

type Group = {
  title: string;
  description: string;
  items: string[];
};

type HighlightCard = {
  title: string;
  description: string;
};

type RoleBlock = {
  label: string;
  title: string;
  description: string;
  groups: Group[];
};

type Panel = {
  title: string;
  description: string;
  items: string[];
  badge?: string;
};

type FlowCard = {
  label: string;
  title: string;
  description: string;
  steps: string[];
  note: string;
};

type LanguageBlock = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  note: string;
};

type ClosingBlock = {
  title: string;
  description: string;
  tags: string[];
};

type ComingSoonBlock = {
  eyebrow: string;
  title: string;
  description: string;
  panels: Panel[];
};

type Hero = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  overviewLabel: string;
  overviewTitle: string;
  overviewBody: string;
  summaryCards: SummaryCard[];
  signalCards: SignalCard[];
};

type EventManagementModule = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: HighlightCard[];
  organizers: RoleBlock;
  judges: {
    label: string;
    title: string;
    description: string;
    panels: Panel[];
    flow: FlowCard;
  };
  publicLayer: {
    label: string;
    title: string;
    description: string;
    panels: Panel[];
  };
  languages: LanguageBlock;
  closing: ClosingBlock;
};

type RegistrationsModule = {
  eyebrow: string;
  title: string;
  description: string;
  roles: RoleBlock[];
  comingSoon: ComingSoonBlock;
};

type WorkshopsModule = {
  eyebrow: string;
  badge: string;
  title: string;
  description: string;
  clusters: Panel[];
  closingTitle: string;
  closingDescription: string;
};

type Cta = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  note: string;
};

export type PlatformPageContent = {
  meta: Meta;
  hero: Hero;
  moduleLinks: ModuleLink[];
  operatingStrip: StripItem[];
  eventManagement: EventManagementModule;
  registrations: RegistrationsModule;
  workshops: WorkshopsModule;
  cta: Cta;
};

const platformPageContent = {
  en: {
    meta: {
      title: "Platform | LumoraEvents",
      description:
        "Event operations, registrations, judging, live public visibility, and upcoming workshop logistics in one platform built for real competitions.",
    },
    hero: {
      eyebrow: "Platform",
      title:
        "Every moving part of your competition, connected in one operational layer.",
      description:
        "LumoraEvents brings together organizer control, judge flow, live tracking, public visibility, and registrations in a platform built to stay clear and stable on real event days.",
      primaryLabel: "Explore the modules",
      secondaryLabel: "Request a demo",
      overviewLabel: "Operational view",
      overviewTitle:
        "One source for setup, live control, and public visibility.",
      overviewBody:
        "Move beyond spreadsheets, email chains, and disconnected tools with a single system for preparing, running, and publishing the event.",
      summaryCards: [
        {
          title: "Event Management",
          tag: "Core module",
          description:
            "Programming, judges, live control, results, public menus, exports, and fallback tools in one place.",
        },
        {
          title: "Registrations",
          tag: "Synchronized",
          description:
            "Entry review, validations, statuses, and category logic connected directly to the competition layer.",
        },
        {
          title: "Workshops & Masterclasses",
          tag: "Coming soon",
          description:
            "The next operational layer for sessions, capacities, extras, logistics, and extended event planning.",
        },
      ],
      signalCards: [
        {
          label: "Imports",
          value: "Excel + WOP",
        },
        {
          label: "Fallback",
          value: "Plan B PDF",
        },
        {
          label: "Public live",
          value: "Live tracking",
        },
        {
          label: "Languages",
          value: "ES EN FR IT PT",
        },
      ],
    },
    moduleLinks: [
      {
        id: "event-management",
        number: "01",
        title: "Event Management",
        description: "The operational core of competition day.",
      },
      {
        id: "registrations",
        number: "02",
        title: "Registrations",
        description:
          "Review, validate, and sync entries without duplicate work.",
      },
      {
        id: "workshops-masterclasses",
        number: "03",
        title: "Workshops & Masterclasses",
        description: "The next ecosystem layer around the event.",
        status: "Coming soon",
      },
    ],
    operatingStrip: [
      {
        title: "Prepared before doors open",
        description:
          "Categories, criteria, judges, schedules, and imports are shaped from the same operating surface.",
      },
      {
        title: "Stable while the event moves",
        description:
          "Live tracking, penalties, tie-breaks, notices, and decision points stay inside one control flow.",
      },
      {
        title: "Clear for everyone following",
        description:
          "Participants and public see live progress, detailed results, and personal statistics from a modern public layer.",
      },
    ],
    eventManagement: {
      eyebrow: "01 Event Management",
      title: "The core operating module for the full competition day.",
      description:
        "Built for teams that need structure before the event starts, live control while it is running, and clean outputs once each round closes.",
      highlights: [
        {
          title: "Structure the event",
          description:
            "Configure categories, styles, criteria, judges, and program logic before the first performance begins.",
        },
        {
          title: "Run live with control",
          description:
            "Track what is happening, manage decisions, publish updates, and keep the day operational under pressure.",
        },
        {
          title: "Publish with clarity",
          description:
            "Results, statistics, exports, QR access, and public information stay connected to the same source of truth.",
        },
      ],
      organizers: {
        label: "For organizers",
        title:
          "An operational dashboard designed for the people carrying the event.",
        description:
          "The organizer layer keeps setup, command, public communication, and outputs connected instead of scattered across different tools.",
        groups: [
          {
            title: "Setup and configuration",
            description:
              "Build the event structure with the same level of detail that real competitions require.",
            items: [
              "Operational dashboard",
              "Categories, styles, and criteria",
              "Judge management",
              "Flexible Excel/WOP imports",
              "Competition setup",
              "Scheduling configurator",
            ],
          },
          {
            title: "Live command center",
            description:
              "Keep visibility over the running event and respond quickly when the day changes shape.",
            items: [
              "Live tracking",
              "Vote control",
              "Penalty control",
              "Tie-break handling",
              "Public menus",
              "Announcements",
              "QR and poster generator",
            ],
          },
          {
            title: "Reporting and resilience",
            description:
              "Stay operational when conditions shift and close the event with clean outputs.",
            items: [
              "Plan B PDF",
              "Statistics sending",
              "PDF exports",
              "Excel exports",
              "Detailed competition outputs",
            ],
          },
        ],
      },
      judges: {
        label: "For judges",
        title: "Fast input, clear criteria, and no unnecessary friction.",
        description:
          "The judging flow is designed to stay focused in the moment: clear scoring, penalties, feedback, and quick submission on tablet or phone.",
        panels: [
          {
            title: "Fast scoring",
            description:
              "Judges move through each performance with a clean interface that keeps attention on the decision, not on the tool.",
            items: [
              "Criteria input",
              "Penalty capture",
              "Feedback notes",
              "Quick submission",
            ],
          },
          {
            title: "Focused experience",
            description:
              "Everything is arranged to reduce noise and keep the next action obvious during live pressure.",
            items: [
              "Tablet and mobile ready",
              "Visible running order",
              "Low-friction transitions",
              "Clear confirmation states",
            ],
          },
        ],
        flow: {
          label: "Judging flow",
          title: "A compact path from performance to decision.",
          description:
            "The experience stays short, legible, and reliable from the queue to the final score submission.",
          steps: [
            "Open the performance",
            "Score the criteria",
            "Apply penalties",
            "Submit with confidence",
          ],
          note: "Feedback stays close to the scoring moment instead of becoming extra administrative work later.",
        },
      },
      publicLayer: {
        label: "For participants and public",
        title:
          "A modern public layer that makes the event easier to follow and the results easier to trust.",
        description:
          "Participants, schools, and audiences can follow the day through clear live visibility, detailed results, and personal performance context.",
        panels: [
          {
            title: "Follow the event live",
            description:
              "Schedules, what is running now, notices, menus, and QR access stay public without manual chasing.",
            items: [
              "Live schedule visibility",
              "Current activity status",
              "Public menus",
              "Notices",
              "QR access",
            ],
          },
          {
            title: "Understand every result",
            description:
              "The public experience can go beyond placements and show the detail behind each outcome.",
            items: [
              "Detailed results",
              "Criterion breakdowns",
              "Personal statistics",
              "Category transparency",
              "Detailed public outputs",
            ],
          },
        ],
      },
      languages: {
        eyebrow: "Multi-language public layer",
        title: "Launch the public experience in five languages from day one.",
        description:
          "ES, EN, FR, IT, and PT are already supported in the public-facing layer, with room to add more when the event requires it.",
        items: ["ES", "EN", "FR", "IT", "PT"],
        note: "Same structure, same data source, adapted to different audiences.",
      },
      closing: {
        title: "A mature system for real competition operations.",
        description:
          "It is not just scoring, registrations, or public results in isolation. It is the layer that keeps the event connected before, during, and after it moves.",
        tags: [
          "Preparation",
          "Live control",
          "Public visibility",
          "Fallback-ready",
        ],
      },
    },
    registrations: {
      eyebrow: "02 Registrations",
      title: "Registration management without duplicate work.",
      description:
        "A dedicated flow for receiving entries, reviewing them with clarity, and syncing approved information into the operational core of the event.",
      roles: [
        {
          label: "For the organization",
          title:
            "One place to review entries, validate rules, and move the event forward.",
          description:
            "The organization view keeps statuses, validations, ranges, and notifications readable before they become manual cleanup.",
          groups: [
            {
              title: "Review and validation",
              description:
                "Handle incoming registrations through one dashboard instead of scattered follow-up.",
              items: [
                "Registrations dashboard",
                "Entry review",
                "Validations",
                "Status control",
                "Notifications",
              ],
            },
            {
              title: "Rules and synchronization",
              description:
                "Make sure approved entries match the structure that the competition module will actually run.",
              items: [
                "Categories",
                "Styles",
                "Ranges",
                "Automatic synchronization",
                "Operational readiness",
              ],
            },
          ],
        },
        {
          label: "For schools",
          title: "Autonomy, clarity, and centralized entry management.",
          description:
            "Schools can manage registrations from one place with clear states and less back-and-forth with the organization.",
          groups: [
            {
              title: "Self-serve submission",
              description:
                "Keep participants and entries organized without depending on manual exchange for every change.",
              items: [
                "Centralized entry control",
                "Participant management",
                "Clear submission flow",
                "Structured updates",
              ],
            },
            {
              title: "Shared visibility",
              description:
                "See where each registration stands and what still needs attention before approval.",
              items: [
                "Status visibility",
                "Required adjustments",
                "Aligned entry rules",
                "Cleaner coordination",
              ],
            },
          ],
        },
      ],
      comingSoon: {
        eyebrow: "Next in this module",
        title:
          "Economic management and authorizations are already framed as the next layer.",
        description:
          "They are presented as a premium continuation of the registration workflow, not as loose extras detached from the rest of the platform.",
        panels: [
          {
            badge: "Coming soon",
            title: "Economic management",
            description:
              "Registration-linked fees, payment states, and clearer financial follow-up inside the same flow.",
            items: [
              "Fee tracking",
              "Payment states",
              "Linked registration visibility",
            ],
          },
          {
            badge: "Coming soon",
            title: "Authorizations",
            description:
              "Participant approvals and related documents connected directly to each registration record.",
            items: [
              "Authorization status",
              "Participant linkage",
              "Cleaner review process",
            ],
          },
        ],
      },
    },
    workshops: {
      eyebrow: "03 Workshops & Masterclasses",
      badge: "Coming soon",
      title: "The platform is growing into a wider event ecosystem.",
      description:
        "Workshops, masterclasses, and attached event logistics are the natural next step: a centralized layer for attendance planning, capacities, extras, and coordination beyond competition rounds.",
      clusters: [
        {
          title: "Learning sessions",
          description:
            "A calmer way to organize learning moments around the event schedule.",
          items: ["Workshops", "Masterclasses", "Schedules"],
        },
        {
          title: "Capacity control",
          description:
            "Keep availability readable and avoid manual back-and-forth around limited spots.",
          items: ["Quotas", "Waiting lists", "Availability visibility"],
        },
        {
          title: "Travel and extras",
          description:
            "Extend the platform to the surrounding logistics that usually end up scattered across messages.",
          items: ["Hotels", "Transfers", "Activities", "Galas"],
        },
        {
          title: "Operational planning",
          description:
            "Bring the financial and organizational side of attached activities into the same ecosystem.",
          items: ["Economic management", "Extras", "Centralized planning"],
        },
      ],
      closingTitle: "Still a teaser, but already a clear direction.",
      closingDescription:
        "The goal stays the same: replace spreadsheets, email threads, and fragmented WhatsApp coordination with one calmer operational system.",
    },
    cta: {
      eyebrow: "See it in context",
      title:
        "If your event has outgrown spreadsheets, the next step should feel more stable, not more complicated.",
      description:
        "We can show how LumoraEvents fits your real workflow, from registration review to live competition control.",
      primaryLabel: "Request a walkthrough",
      secondaryLabel: "Talk about your event",
      note: "No generic sales script. Start from the way your event already works.",
    },
  },
  es: {
    meta: {
      title: "Plataforma | LumoraEvents",
      description:
        "Operativa de evento, inscripciones, jueces, visibilidad pública en vivo y la futura capa de workshops en una plataforma construida para competiciones reales.",
    },
    hero: {
      eyebrow: "Plataforma",
      title: "Toda la operación de tu competición, conectada en una sola capa.",
      description:
        "LumoraEvents reúne control organizativo, flujo de jueces, seguimiento en vivo, visibilidad pública e inscripciones en una plataforma pensada para mantenerse clara y estable en eventos reales.",
      primaryLabel: "Explorar módulos",
      secondaryLabel: "Pedir una demo",
      overviewLabel: "Vista operativa",
      overviewTitle:
        "Una sola fuente para preparar, controlar y publicar el evento.",
      overviewBody:
        "Deja atrás Excels, cadenas de correos y herramientas desconectadas con un sistema único para preparar, ejecutar y publicar toda la competición.",
      summaryCards: [
        {
          title: "Event Management",
          tag: "Módulo central",
          description:
            "Programación, jueces, control en vivo, resultados, menús públicos, exportaciones y herramientas de respaldo en un mismo lugar.",
        },
        {
          title: "Registrations",
          tag: "Sincronizado",
          description:
            "Revisión de inscripciones, validaciones, estados y lógica de categorías conectadas directamente con la competición.",
        },
        {
          title: "Workshops & Masterclasses",
          tag: "Coming soon",
          description:
            "La siguiente capa operativa para sesiones, cupos, extras, logística y planificación extendida del evento.",
        },
      ],
      signalCards: [
        {
          label: "Importación",
          value: "Excel + WOP",
        },
        {
          label: "Respaldo",
          value: "Plan B PDF",
        },
        {
          label: "Capa pública",
          value: "Tracking en vivo",
        },
        {
          label: "Idiomas",
          value: "ES EN FR IT PT",
        },
      ],
    },
    moduleLinks: [
      {
        id: "event-management",
        number: "01",
        title: "Event Management",
        description: "El núcleo operativo del día de competición.",
      },
      {
        id: "registrations",
        number: "02",
        title: "Registrations",
        description: "Revisar, validar y sincronizar sin trabajo duplicado.",
      },
      {
        id: "workshops-masterclasses",
        number: "03",
        title: "Workshops & Masterclasses",
        description: "La siguiente capa del ecosistema del evento.",
        status: "Coming soon",
      },
    ],
    operatingStrip: [
      {
        title: "Preparado antes de abrir puertas",
        description:
          "Categorías, criterios, jueces, horarios e importaciones se construyen desde la misma superficie operativa.",
      },
      {
        title: "Estable mientras el evento se mueve",
        description:
          "Tracking en vivo, penalizaciones, desempates, avisos y puntos de decisión permanecen dentro de un solo flujo de control.",
      },
      {
        title: "Claro para quien lo sigue",
        description:
          "Participantes y público ven progreso en vivo, resultados detallados y estadísticas personales desde una capa pública moderna.",
      },
    ],
    eventManagement: {
      eyebrow: "01 Event Management",
      title: "El módulo central para toda la operativa de competición.",
      description:
        "Pensado para equipos que necesitan estructura antes de empezar, control mientras el evento está en marcha y salidas limpias cuando cada ronda se cierra.",
      highlights: [
        {
          title: "Estructura el evento",
          description:
            "Configura categorías, estilos, criterios, jueces y lógica de programación antes de la primera actuación.",
        },
        {
          title: "Controla el directo",
          description:
            "Sigue lo que está ocurriendo, gestiona decisiones, publica actualizaciones y mantén el día operativo bajo presión.",
        },
        {
          title: "Publica con claridad",
          description:
            "Resultados, estadísticas, exportaciones, acceso QR e información pública conectados a la misma fuente de verdad.",
        },
      ],
      organizers: {
        label: "Para organizadores",
        title:
          "Un dashboard operativo pensado para quien lleva el peso del evento.",
        description:
          "La capa de organización conecta preparación, mando, comunicación pública y salidas finales en lugar de repartirlas entre herramientas distintas.",
        groups: [
          {
            title: "Preparación y configuración",
            description:
              "Construye la estructura del evento con el nivel de detalle que exige una competición real.",
            items: [
              "Dashboard operativo",
              "Categorías, estilos y criterios",
              "Gestión de jueces",
              "Importación flexible Excel/WOP",
              "Configuración de competiciones",
              "Configurador de programación",
            ],
          },
          {
            title: "Centro de mando en vivo",
            description:
              "Mantén visibilidad sobre el evento y responde rápido cuando el día cambia de forma.",
            items: [
              "Tracking en vivo",
              "Control de votos",
              "Control de penalizaciones",
              "Gestión de desempates",
              "Menús públicos",
              "Avisos",
              "Generador QR y carteles",
            ],
          },
          {
            title: "Salidas y resiliencia",
            description:
              "Sigue operativo cuando cambian las condiciones y cierra el evento con salidas limpias.",
            items: [
              "Plan B PDF",
              "Envío de estadísticas",
              "Exportaciones PDF",
              "Exportaciones Excel",
              "Salidas detalladas de competición",
            ],
          },
        ],
      },
      judges: {
        label: "Para jueces",
        title: "Entrada rápida, criterios claros y cero fricción innecesaria.",
        description:
          "El flujo de jueces está pensado para mantenerse enfocado en el momento: puntuación clara, penalizaciones, feedback y envío rápido desde tablet o móvil.",
        panels: [
          {
            title: "Puntuación rápida",
            description:
              "Cada actuación se evalúa desde una interfaz limpia que pone la atención en la decisión, no en la herramienta.",
            items: [
              "Entrada por criterios",
              "Captura de penalizaciones",
              "Notas de feedback",
              "Envío rápido",
            ],
          },
          {
            title: "Experiencia enfocada",
            description:
              "Todo está ordenado para reducir ruido y hacer evidente el siguiente paso durante la presión del directo.",
            items: [
              "Preparado para tablet y móvil",
              "Orden visible",
              "Transiciones ágiles",
              "Estados claros de confirmación",
            ],
          },
        ],
        flow: {
          label: "Flujo de jueces",
          title: "Un recorrido compacto desde la actuación hasta la decisión.",
          description:
            "La experiencia se mantiene corta, legible y fiable desde la cola de actuaciones hasta el envío final de la puntuación.",
          steps: [
            "Abrir la actuación",
            "Puntuar criterios",
            "Aplicar penalizaciones",
            "Enviar con seguridad",
          ],
          note: "El feedback queda pegado al momento de puntuación en lugar de convertirse en trabajo administrativo adicional después.",
        },
      },
      publicLayer: {
        label: "Para participantes y público",
        title:
          "Una capa pública moderna que hace el evento más fácil de seguir y los resultados más fáciles de confiar.",
        description:
          "Participantes, escuelas y público pueden seguir el día con visibilidad en vivo, resultados detallados y contexto personal de rendimiento.",
        panels: [
          {
            title: "Sigue el evento en vivo",
            description:
              "Horarios, qué está ocurriendo ahora, avisos, menús y acceso QR visibles sin persecución manual de información.",
            items: [
              "Horarios en vivo",
              "Estado actual de actividad",
              "Menús públicos",
              "Avisos",
              "Acceso QR",
            ],
          },
          {
            title: "Entiende cada resultado",
            description:
              "La experiencia pública puede ir más allá de la clasificación y mostrar el detalle real detrás de cada resultado.",
            items: [
              "Resultados detallados",
              "Desglose por criterios",
              "Estadísticas personales",
              "Transparencia por categoría",
              "Salidas públicas detalladas",
            ],
          },
        ],
      },
      languages: {
        eyebrow: "Capa pública multiidioma",
        title:
          "Lanza la experiencia pública en cinco idiomas desde el primer día.",
        description:
          "ES, EN, FR, IT y PT ya están contemplados en la capa pública, con margen para ampliar cuando el evento lo necesite.",
        items: ["ES", "EN", "FR", "IT", "PT"],
        note: "La misma estructura y la misma fuente de datos, adaptadas a audiencias distintas.",
      },
      closing: {
        title: "Un sistema maduro para operativa real de competición.",
        description:
          "No es solo puntuación, inscripciones o resultados públicos por separado. Es la capa que mantiene el evento conectado antes, durante y después de que se mueva.",
        tags: [
          "Preparación",
          "Control en vivo",
          "Visibilidad pública",
          "Respaldo operativo",
        ],
      },
    },
    registrations: {
      eyebrow: "02 Registrations",
      title: "Gestión de inscripciones sin trabajo duplicado.",
      description:
        "Un flujo específico para recibir inscripciones, revisarlas con claridad y sincronizar la información aprobada con el núcleo operativo del evento.",
      roles: [
        {
          label: "Para la organización",
          title:
            "Un solo lugar para revisar inscripciones, validar reglas y hacer avanzar el evento.",
          description:
            "La vista de organización mantiene legibles estados, validaciones, rangos y notificaciones antes de que se conviertan en limpieza manual.",
          groups: [
            {
              title: "Revisión y validación",
              description:
                "Gestiona las entradas desde un dashboard central en lugar de seguirlo todo por mensajes sueltos.",
              items: [
                "Dashboard de inscripciones",
                "Revisión de entradas",
                "Validaciones",
                "Control de estados",
                "Notificaciones",
              ],
            },
            {
              title: "Reglas y sincronización",
              description:
                "Asegura que lo aprobado encaja con la estructura que la competición va a ejecutar de verdad.",
              items: [
                "Categorías",
                "Estilos",
                "Rangos",
                "Sincronización automática",
                "Preparación operativa",
              ],
            },
          ],
        },
        {
          label: "Para escuelas",
          title: "Autonomía, claridad y gestión centralizada de inscripciones.",
          description:
            "Las escuelas pueden gestionar sus registros desde un solo lugar, con estados claros y menos ida y vuelta con la organización.",
          groups: [
            {
              title: "Envío autónomo",
              description:
                "Organiza participantes y entradas sin depender de intercambio manual para cada cambio.",
              items: [
                "Control centralizado de inscripciones",
                "Gestión de participantes",
                "Flujo de envío claro",
                "Actualizaciones ordenadas",
              ],
            },
            {
              title: "Visibilidad compartida",
              description:
                "Ve en qué punto está cada inscripción y qué falta por resolver antes de la aprobación.",
              items: [
                "Visibilidad de estados",
                "Ajustes requeridos",
                "Reglas alineadas",
                "Coordinación más limpia",
              ],
            },
          ],
        },
      ],
      comingSoon: {
        eyebrow: "Lo siguiente en este módulo",
        title:
          "La gestión económica y las autorizaciones ya están planteadas como la siguiente capa.",
        description:
          "Se presentan como una continuación premium del flujo de inscripciones, no como extras sueltos desconectados del resto de la plataforma.",
        panels: [
          {
            badge: "Coming soon",
            title: "Gestión económica",
            description:
              "Cuotas ligadas a inscripciones, estados de pago y seguimiento financiero más claro dentro del mismo flujo.",
            items: [
              "Seguimiento de cuotas",
              "Estados de pago",
              "Visibilidad ligada al registro",
            ],
          },
          {
            badge: "Coming soon",
            title: "Autorizaciones",
            description:
              "Aprobaciones y documentos conectados directamente a la ficha de cada participante.",
            items: [
              "Estado de autorizaciones",
              "Vinculación con participante",
              "Revisión más limpia",
            ],
          },
        ],
      },
    },
    workshops: {
      eyebrow: "03 Workshops & Masterclasses",
      badge: "Coming soon",
      title:
        "La plataforma está creciendo hacia un ecosistema de evento más amplio.",
      description:
        "Workshops, masterclasses y logística asociada son el siguiente paso natural: una capa centralizada para planificar asistencia, cupos, extras y coordinación más allá de las rondas de competición.",
      clusters: [
        {
          title: "Sesiones formativas",
          description:
            "Una forma más calmada de organizar momentos formativos alrededor del horario general del evento.",
          items: ["Workshops", "Masterclasses", "Horarios"],
        },
        {
          title: "Control de capacidad",
          description:
            "Mantén la disponibilidad legible y evita ida y vuelta manual alrededor de plazas limitadas.",
          items: ["Cupos", "Listas de espera", "Visibilidad de disponibilidad"],
        },
        {
          title: "Viaje y extras",
          description:
            "Extiende la plataforma a la logística que normalmente termina dispersa en mensajes y hojas separadas.",
          items: ["Hoteles", "Traslados", "Actividades", "Galas"],
        },
        {
          title: "Planificación operativa",
          description:
            "Integra la parte económica y organizativa de actividades asociadas dentro del mismo ecosistema.",
          items: ["Gestión económica", "Extras", "Planificación centralizada"],
        },
      ],
      closingTitle: "Todavía es un teaser, pero ya marca una dirección clara.",
      closingDescription:
        "El objetivo sigue siendo el mismo: sustituir hojas de cálculo, correos y coordinación fragmentada por WhatsApp por un sistema operativo más calmado.",
    },
    cta: {
      eyebrow: "Verlo en contexto",
      title:
        "Si tu evento ya ha superado las hojas de cálculo, el siguiente paso debería sentirse más estable, no más complicado.",
      description:
        "Podemos enseñarte cómo encaja LumoraEvents con tu flujo real, desde la revisión de inscripciones hasta el control de la competición en vivo.",
      primaryLabel: "Pedir una demo",
      secondaryLabel: "Hablar sobre tu evento",
      note: "Sin discurso comercial genérico. Empezamos por cómo funciona de verdad tu evento.",
    },
  },
} satisfies Record<Locale, PlatformPageContent>;

export function getPlatformPageContent(locale: Locale) {
  return platformPageContent[locale];
}
