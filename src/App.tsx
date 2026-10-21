import { FormEvent, lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import PublicContent, { getContentPage } from "./PublicContent";
import { changeLocale, languages, localizedPath, localizeLinkClick, parseLocalizedPath, type Locale } from "./routing";

const Admin = lazy(() => import("./Admin"));

type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "globe"
  | "menu"
  | "close"
  | "shield"
  | "spark"
  | "heart"
  | "document"
  | "message"
  | "plane"
  | "map";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    shield: <><path d="M12 3 5 6v5c0 4.8 2.9 8.2 7 10 4.1-1.8 7-5.2 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    spark: <><path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Z" /><path d="m19 15 .7 2.3L22 18.5l-2.3 1.2L19 22l-.7-2.3-2.3-1.2 2.3-1.2L19 15Z" /></>,
    heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    document: <><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 9h8M8 13h5" /></>,
    plane: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
  };
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
      {paths[name]}
    </svg>
  );
}

const images = {
  hero: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1600&q=85",
  screening: "https://images.unsplash.com/photo-1666886573531-48d2e3c2b684?auto=format&fit=crop&w=1200&q=85",
  aesthetics: "https://images.unsplash.com/photo-1713085085470-fba013d67e65?auto=format&fit=crop&w=1200&q=85",
  recovery: "https://images.unsplash.com/photo-1645005513713-9e2b92a687d3?auto=format&fit=crop&w=1200&q=85",
  tcm: "https://images.unsplash.com/photo-1598555763574-dca77e10427e?auto=format&fit=crop&w=1200&q=85",
};

const services = [
  {
    id: "screening",
    eyebrow: "Primary service",
    title: "Health Screening",
    text: "Explore examination options, understand package contents, clarify fees, and plan a visit around your individual circumstances.",
    details: ["Package contents explained", "Fees and follow-up clarified"],
    cta: "Explore Health Screening",
    image: images.screening,
    value: "Health Screening",
    featured: true,
  },
  {
    id: "aesthetics",
    eyebrow: "Major service",
    title: "Medical Aesthetics & Healthy Aging",
    text: "Explore cosmetic dermatology, confirmed aesthetic procedures, skin health, and evidence-supported healthy-aging services with clear limits.",
    details: ["Consultation, risks, and recovery clarified", "Optional genetics never presented as an outcome predictor"],
    cta: "Explore Aesthetic Options",
    image: images.aesthetics,
    value: "Medical Aesthetics",
    featured: true,
  },
  {
    id: "recovery",
    eyebrow: "Recovery",
    title: "Rehabilitation & Recovery",
    text: "Consider medical rehabilitation and structured recuperation options, with the level of professional supervision made clear.",
    details: ["Medical and non-medical care distinguished", "Supervision confirmed"],
    cta: "Explore Recovery Options",
    image: images.recovery,
    value: "Rehabilitation & Recovery",
  },
  {
    id: "tcm",
    eyebrow: "Integrative care",
    title: "TCM & Integrative Care",
    text: "Explore licensed TCM services, coordinated clinical care, and non-medical wellness experiences—with each clearly distinguished.",
    details: ["Practitioner scope clarified", "Wellness is not presented as treatment"],
    cta: "Explore TCM & Integrative Care",
    image: images.tcm,
    value: "TCM & Integrative Care",
  },
];

const destinations = [
  {
    city: "Shanghai",
    image: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=900&q=82",
    text: "An international gateway and a current area of interest for individual inquiries.",
  },
  {
    city: "Beijing",
    image: "https://images.unsplash.com/photo-1584872589930-e99fe5bf4408?auto=format&fit=crop&w=900&q=82",
    text: "China's capital and a current focus city for individual inquiries.",
  },
  {
    city: "Changchun",
    image: "https://images.unsplash.com/photo-1654506582570-829893ad698f?auto=format&fit=crop&w=900&q=82",
    text: "A northeast China city within our current geographic areas of interest.",
  },
  {
    city: "Dalian",
    image: "https://images.unsplash.com/photo-1694722050574-d483e44eaf2b?auto=format&fit=crop&w=900&q=82",
    text: "A coastal destination within our current geographic areas of interest.",
  },
  {
    city: "Harbin",
    image: "https://images.unsplash.com/photo-1773472502446-fd066df9d768?auto=format&fit=crop&w=900&q=82",
    text: "A northeast China destination considered on an inquiry-by-inquiry basis.",
  },
];

const faqs = [
  ["Why consider healthcare in China?", "China may offer healthcare options worth exploring based on your needs, timing, location, and budget. We help you investigate practical details without claiming that care in China is always cheaper, faster, or better. Consider the full cost of travel, accommodation, translation, treatment, and follow-up."],
  ["What health screening services can I explore?", "Potential options include general examinations, comprehensive screening packages, and individually selected examinations. Availability and the appropriate scope should be confirmed with qualified healthcare professionals based on your circumstances."],
  ["What medical aesthetic services are available?", "Availability may include cosmetic dermatology, skin-related treatments, non-surgical procedures, and selected cosmetic surgery. We only present confirmed clinical procedures after relevant facility and practitioner details are reviewed."],
  ["How can I evaluate providers?", "Ask about facility registration, practitioner qualifications, authorized scope, equipment, consent, risks, infection control, records, communication support, complaints, and follow-up. Our review framework helps organize these questions; it is not a guarantee."],
  ["What rehabilitation or recuperation options may be available?", "Options may range from physical and functional rehabilitation to structured recovery stays. We clarify whether a service is medical or non-medical, who is involved, and whether professional supervision is actually included."],
  ["What does integrative care mean?", "Integrative care coordinates appropriate conventional and traditional approaches through qualified practitioners. It does not mean treatments are interchangeable or appropriate for everyone. Share relevant medicines and treatments with your healthcare professionals."],
  ["How can I request an estimate?", "Submit the short inquiry form with your service interest, preferred city, and timeframe. We can then investigate an individualized estimate with inclusions, exclusions, conditions, currency, and validity clearly stated where available."],
  ["Are travel and accommodation included?", "Not automatically. Any estimate should state whether transport, accommodation, meals, translation, coordination, or other travel services are included. We encourage comparing the total journey cost."],
  ["Can treatments be guaranteed?", "No. Eligibility, timelines, clinical outcomes, recovery, and satisfaction cannot be guaranteed. Suitability and treatment decisions remain with appropriately qualified healthcare professionals."],
  ["Can you help with follow-up arrangements?", "We can ask providers about records, expected follow-up, remote consultations where available, and what to plan after returning home. Local follow-up may still need to be arranged with your own healthcare professionals."],
  ["What should I know before traveling for surgery?", "Confirm clinical assessment requirements, provider qualifications, risks, expected stay, recovery restrictions, companion needs, records, complication plans, and follow-up before making travel commitments."],
  ["Do you provide emergency medical services?", "No. China Care Guide is not an emergency service. Contact local emergency services or a qualified healthcare professional for urgent medical needs."],
  ["Which Chinese cities can currently be supported?", "Our current geographic areas of interest are Shanghai, Beijing, Changchun, Dalian, and Harbin. Services, providers, and appointment options are confirmed individually for each inquiry."],
];

function ButtonLink({ children, href = "#inquiry", secondary = false, onClick }: { children: ReactNode; href?: string; secondary?: boolean; onClick?: () => void }) {
  return <a className={`button ${secondary ? "button-secondary" : ""}`} href={href} onClick={onClick}>{children}<Icon name="arrow" size={18} /></a>;
}

function SectionHeading({ eyebrow, title, text, center = false }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function ServiceCard({ service, onSelect }: { service: typeof services[number]; onSelect: (value: string) => void }) {
  const routes: Record<string, string> = {
    screening: "/services/health-screening-in-china",
    aesthetics: "/services/medical-aesthetics-in-china",
    recovery: "/services/rehabilitation-in-china",
    tcm: "/services/tcm-integrative-care",
  };
  return (
    <article className={`service-card ${service.featured ? "featured" : ""}`} id={service.id}>
      <div className="service-image">
        <img alt={`${service.title} consultation`} src={service.image} />
        <span>{service.eyebrow}</span>
      </div>
      <div className="service-copy">
        <h3>{service.title}</h3>
        <p>{service.text}</p>
        <ul>{service.details.map((detail) => <li key={detail}><Icon name="check" size={14} />{detail}</li>)}</ul>
        <a href={routes[service.id]} onClick={() => onSelect(service.value)}>{service.cta}<Icon name="arrow" size={18} /></a>
      </div>
    </article>
  );
}

function EstimatePreview() {
  return (
    <div className="estimate-card">
      <div className="estimate-header">
        <div>
          <span>INDIVIDUAL ESTIMATE</span>
          <h3>Clear before you decide</h3>
        </div>
        <Icon name="document" size={28} />
      </div>
      <div className="estimate-row"><span>Service</span><strong>Confirmed after inquiry</strong></div>
      <div className="estimate-row"><span>Provider</span><strong>Named when verified</strong></div>
      <div className="estimate-row"><span>Amount & currency</span><strong>Individually quoted</strong></div>
      <div className="estimate-grid">
        <div><Icon name="check" /><span>Included services</span></div>
        <div><Icon name="check" /><span>Excluded services</span></div>
        <div><Icon name="check" /><span>Potential extras</span></div>
        <div><Icon name="check" /><span>Conditions & validity</span></div>
      </div>
      <ButtonLink>Request an Individual Estimate</ButtonLink>
    </div>
  );
}

const travelStages = [
  { number: "01", label: "PLAN", title: "Before your trip", text: "Clarify your service, destination, provider options, estimates, appointment requests, documents, translation needs, itinerary, and accommodation preferences.", note: "Administrative review only—not a diagnosis or clinical assessment." },
  { number: "02", label: "PREPARE", title: "Arrival arrangements", text: "Coordinate airport pickup, local transport, accommodation, connectivity, payments, interpreter support, and hospital navigation where available.", note: "Local services are available on request and subject to confirmation." },
  { number: "03", label: "VISIT", title: "Support during your visit", text: "Keep appointments, practical questions, interpretation arrangements, schedules, documents, and receipts organized throughout the visit.", note: "Interpreters support communication; they do not make clinical decisions." },
  { number: "04", label: "FOLLOW UP", title: "After your visit", text: "Organize reports, translation requests, provider follow-up, documentation, and practical communication after you return home.", note: "Ongoing care and complication management cannot be guaranteed." },
];

const lifeGuides = [
  ["Before you travel", "A practical preparation checklist for documents, prescriptions, contact details, chargers, and confirmed arrangements."],
  ["Weather & clothing", "Seasonal packing guidance that should be checked again near your travel date."],
  ["Transport & navigation", "How metro, taxi, ride-hailing, and hospital journeys may work in your destination."],
  ["Connectivity", "Options for mobile access, roaming, local connectivity, and essential apps where available."],
  ["Payments", "Practical preparation for cards, cash, and commonly used digital payment options."],
  ["Food & preferences", "Planning for dietary preferences, allergies, hotel breakfasts, and nearby restaurant choices."],
  ["Where to stay", "Consider distance to facilities, accessibility, transport links, and recovery needs."],
  ["Culture & communication", "Simple etiquette, expectations, and ways to make administrative communication easier."],
  ["Useful phrases", "A growing, reviewed list of useful phrases for transport, reception, payments, and everyday needs."],
  ["Emergency preparation", "Keep local emergency contacts, insurer details, provider contacts, and a trusted personal contact accessible."],
];

function MedicalTravelJourney() {
  return <section className="concierge section" id="concierge">
    <div className="section-inner">
      <div className="concierge-intro">
        <div><p className="eyebrow">MEDICAL TRAVEL PLANNING & CONCIERGE</p><h2>Care planning is only one part of the <em>journey.</em></h2></div>
        <div><p>From choosing a provider to navigating your visit, we help you understand the practical details of receiving healthcare in China. Your China Care Plan is individually coordinated around your stated service interests, destination, timing, and questions—without replacing professional clinical advice.</p><a href="#inquiry">Build my care plan <Icon name="arrow" size={18} /></a></div>
      </div>
      <div className="journey-rail" aria-label="Four-stage medical travel journey">
        {travelStages.map((stage) => <article key={stage.label}><div className="journey-number"><span>{stage.number}</span><strong>{stage.label}</strong></div><h3>{stage.title}</h3><p>{stage.text}</p><small>{stage.note}</small></article>)}
      </div>
      <div className="service-boundaries">
        <div><Icon name="heart" /><p><strong>Healthcare providers</strong><span>Clinical assessment, diagnosis, treatment, consent, and medical follow-up.</span></p></div>
        <div><Icon name="document" /><p><strong>China Care Guide</strong><span>Administrative coordination, options research, estimates, schedules, and communication support.</span></p></div>
        <div><Icon name="plane" /><p><strong>Travel & local support</strong><span>Transport, accommodation, interpretation, and local assistance when confirmed.</span></p></div>
      </div>
    </div>
  </section>;
}

function LifeInChina() {
  return <section className="life-guide section" id="life-in-china"><div className="section-inner">
    <div className="heading-row"><SectionHeading eyebrow="PRACTICAL TRAVEL GUIDANCE" title="Your guide to everyday life in China." text="Calm, practical preparation for the parts of the journey that may feel unfamiliar." /><p>Travel requirements, payment methods, regulations, and emergency details should always be checked and updated before publication or travel.</p></div>
    <div className="life-grid">{lifeGuides.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p><small>Editable guide · verification required</small></div></article>)}</div>
    <div className="life-note"><Icon name="map" /><p><strong>Practical information, not professional advice.</strong> General travel guidance does not replace legal, immigration, financial, medical, or emergency advice.</p><a href="/resources/">Explore the resource center <Icon name="arrow" size={16} /></a></div>
  </div></section>;
}

function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [contactNotice, setContactNotice] = useState("");
  const [pastHero, setPastHero] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ question: string; answer: string }>>([]);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "");
  useEffect(() => {
    const updateVisibility = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      setPastHero(window.scrollY > (hero?.offsetHeight ?? window.innerHeight));
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);
  const answerQuestion = (rawQuestion: string) => {
    const normalized = rawQuestion.toLowerCase();
    if (/emergency|urgent|chest pain|can't breathe|cannot breathe|suicid|急诊|紧急|呼吸困难|胸痛/i.test(rawQuestion)) return "China Care Guide is not an emergency service and cannot assess urgent symptoms. Contact local emergency services or a qualified healthcare professional now.";
    if (/diagnos|should i (take|choose|get)|recommend.*treatment|interpret.*result|medical advice|我该不该|诊断|治疗建议|检查结果/i.test(rawQuestion)) return "I cannot assess symptoms, interpret results, diagnose, or recommend a treatment. Please discuss personal medical questions with a qualified healthcare professional. For urgent symptoms, contact local emergency services.";
    const ignoredTerms = new Set(["about", "after", "also", "based", "before", "care", "could", "current", "each", "from", "have", "help", "into", "only", "options", "provider", "qualified", "should", "that", "their", "there", "these", "they", "this", "through", "travel", "what", "when", "where", "which", "with", "would", "your"]);
    const matches = faqs.filter(([q, a]) => {
      const terms = `${q} ${a}`.toLowerCase().match(/[a-z]{4,}/g)?.filter((term) => !ignoredTerms.has(term)) ?? [];
      return terms.filter((term) => normalized.includes(term)).length >= 2;
    }).sort((a, b) => {
      const score = (entry: string[]) => (entry[0] + " " + entry[1]).toLowerCase().match(/[a-z]{4,}/g)?.filter((term) => !ignoredTerms.has(term) && normalized.includes(term)).length ?? 0;
      return score(b) - score(a);
    });
    if (/human|person|staff|coordinator|agent|人工|真人/i.test(rawQuestion)) return "A human coordinator can follow up through the inquiry form. Please share only general contact details there; do not send medical records or sensitive health information.";
    if (matches.length) return matches[0][1];
    return "I can answer general questions using the reviewed information on this website, but I could not find a reliable answer to that. Please use the inquiry form to ask a human coordinator. Do not include medical records or urgent health details.";
  };
  const quickReplies: Record<string, string> = {
    "Health screening": "What health screening services can I explore?",
    "Costs & estimates": "How can I request an estimate?",
    "Travel planning": "What should I know before traveling for surgery?",
    "Talk to a person": "I would like to speak to a human coordinator.",
  };
  const submitQuestion = (rawQuestion: string) => {
    const cleaned = rawQuestion.trim();
    if (!cleaned) return;
    setConversation((current) => [...current, { question: cleaned, answer: answerQuestion(cleaned) }]);
    setQuestion("");
  };
  return <>
    <div className={`floating-contact ${pastHero ? "past-hero" : ""}`}>
      {whatsappNumber ? <a className="whatsapp-entry" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I have a general question about China Care Guide.")}`} target="_blank" rel="noreferrer"><span>WA</span>Chat on WhatsApp</a> : <button className="whatsapp-entry" onClick={() => setContactNotice("WhatsApp is not connected yet. Please use the inquiry form for human follow-up.")}><span>WA</span>Chat on WhatsApp</button>}
      <button aria-expanded={open} aria-label={open ? "Close China Care Guide" : "Open China Care Guide"} className="assistant-launcher" onClick={() => { setOpen(!open); setContactNotice(""); }}><Icon name={open ? "close" : "message"} /><span>{open ? "Close" : "Ask our guide"}</span></button>
    </div>
    {contactNotice && <div className="contact-toast" role="status">{contactNotice}<button aria-label="Dismiss" onClick={() => setContactNotice("")}>×</button></div>}
    {open && <section aria-label="China Care Guide Assistant" className="assistant-panel">
      <header><span><Icon name="spark" /></span><div><strong>China Care Guide</strong><small>Instant answers from reviewed FAQs</small></div><button aria-label="Close assistant" onClick={() => setOpen(false)}><Icon name="close" /></button></header>
      <div className="assistant-safety"><Icon name="shield" size={15} />Do not share medical records or sensitive clinical information here.</div>
      <div className="assistant-thread"><div className="assistant-message"><strong>Welcome</strong><p>Ask about services, estimates, travel coordination, or how the inquiry process works.</p></div>{conversation.map((item, index) => <div key={`${index}-${item.question}`}><div className="chat-bubble assistant-question">{item.question}</div><div className="assistant-message response"><p>{item.answer}</p></div></div>)}</div>
      <div className="quick-replies">{Object.entries(quickReplies).map(([label, prompt]) => <button key={label} onClick={() => submitQuestion(prompt)}>{label}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); submitQuestion(question); }}><label><span className="sr-only">Ask a general question</span><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a general question…" /></label><button aria-label="Send question" type="submit"><Icon name="arrow" /></button></form>
      <footer><span>Reviewed website guidance · Not medical advice</span><a href="#inquiry" onClick={() => setOpen(false)}>Contact a human</a></footer>
    </section>}
  </>;
}

type FormData = {
  firstName: string; email: string; country: string; service: string; city: string;
  language: string; timeframe: string; contact: string; question: string; consent: boolean;
};

const initialForm: FormData = {
  firstName: "", email: "", country: "", service: "", city: "Open to Options",
  language: "English", timeframe: "", contact: "Email", question: "", consent: false,
};

function InquiryForm({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const update = (key: keyof FormData, value: string | boolean) => {
    setForm((old) => ({ ...old, [key]: value }));
    if (errors[key]) setErrors((old) => {
      const next = { ...old };
      delete next[key];
      return next;
    });
    if (status === "error") setStatus("idle");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!form.country.trim()) next.country = "Please enter your country of residence.";
    if (!form.service) next.service = "Please choose a service interest.";
    if (!form.timeframe) next.timeframe = "Please select an approximate timeframe.";
    if (!form.consent) next.consent = "Please confirm that you have read the privacy notice.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("error");
      window.setTimeout(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
      return;
    }
    setStatus("loading");
    setServerError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: new FormData(formRef.current ?? undefined).get("website") }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "We could not send your inquiry. Please try again later.");
      setStatus("success");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "We could not send your inquiry. Please try again later.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span><Icon name="check" size={26} /></span>
        <p className="eyebrow">INQUIRY RECEIVED</p>
        <h3>Thank you, {form.firstName}.</h3>
        <p>Your inquiry was securely submitted for review. You do not need an account. Please do not email medical records or other sensitive documents unless a coordinator provides a secure method.</p>
        <button className="text-button" onClick={() => { setForm(initialForm); setStatus("idle"); }}>Send another inquiry</button>
      </div>
    );
  }

  const field = (key: keyof FormData) => errors[key] ? `${key}-error` : undefined;
  return (
    <form className="inquiry-form" noValidate onSubmit={submit} ref={formRef}>
      <div className="form-intro"><strong>About you and your inquiry</strong><span>Required fields are marked *</span></div>
      {status === "error" && (Object.keys(errors).length > 0 || serverError) && <div className="error-summary" role="alert"><strong>{serverError ? "We could not submit your inquiry." : "We need a little more information."}</strong><span>{serverError || "Please review the highlighted fields below."}</span></div>}
      <label className="sr-only" aria-hidden="true">Leave this field empty<input autoComplete="off" name="website" tabIndex={-1} type="text" /></label>
      <div className="form-grid">
        <label>First name *<input autoComplete="given-name" aria-describedby={field("firstName")} aria-invalid={!!errors.firstName} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />{errors.firstName && <small id="firstName-error">{errors.firstName}</small>}</label>
        <label>Email address *<input autoComplete="email" aria-describedby={field("email")} aria-invalid={!!errors.email} inputMode="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />{errors.email && <small id="email-error">{errors.email}</small>}</label>
        <label>Country of residence *<input autoComplete="country-name" aria-describedby={field("country")} aria-invalid={!!errors.country} value={form.country} onChange={(e) => update("country", e.target.value)} />{errors.country && <small id="country-error">{errors.country}</small>}</label>
        <label>Service interest *<select aria-describedby={field("service")} aria-invalid={!!errors.service} value={form.service} onChange={(e) => update("service", e.target.value)}><option value="">Select a service</option><option>Health Screening</option><option>Medical Aesthetics</option><option>Rehabilitation & Recovery</option><option>TCM & Integrative Care</option><option>Specialist & Surgical Care</option><option>Dental Care</option><option>Not Sure</option></select>{errors.service && <small id="service-error">{errors.service}</small>}</label>
        <label className="full-field">Approximate travel timeframe *<select aria-describedby={field("timeframe")} aria-invalid={!!errors.timeframe} value={form.timeframe} onChange={(e) => update("timeframe", e.target.value)}><option value="">Select a timeframe</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Within 6–12 months</option><option>Just exploring</option></select>{errors.timeframe && <small id="timeframe-error">{errors.timeframe}</small>}</label>
      </div>
      <details className="optional-fields">
        <summary>Preferences and general question <span>Optional</span><Icon name="chevron" size={18} /></summary>
        <div className="form-grid optional-grid">
          <label>Preferred city<select value={form.city} onChange={(e) => update("city", e.target.value)}>{destinations.map((item) => <option key={item.city}>{item.city}</option>)}<option>Open to Options</option></select></label>
          <label>Preferred language<select value={form.language} onChange={(e) => update("language", e.target.value)}><option>English</option><option>中文</option><option>Other</option></select></label>
          <label>Preferred contact method<select value={form.contact} onChange={(e) => update("contact", e.target.value)}><option>Email</option><option>WhatsApp</option><option>WeChat</option></select></label>
          <label className="full-field">General question<textarea rows={3} placeholder="Please do not include medical records, passport information, or other sensitive details." value={form.question} onChange={(e) => update("question", e.target.value)} /></label>
        </div>
      </details>
      <label className="consent"><input checked={form.consent} type="checkbox" onChange={(e) => update("consent", e.target.checked)} /><span>I agree that my inquiry may be reviewed according to the <a href="#legal">Privacy Policy</a>. I understand this is not a medical assessment or confirmed appointment.</span></label>
      {errors.consent && <small className="consent-error" id="consent-error">{errors.consent}</small>}
      <button className="submit-button" disabled={status === "loading"} type="submit">{status === "loading" ? "Recording inquiry…" : "Send My Inquiry"}{status !== "loading" && <Icon name="arrow" size={18} />}</button>
      <p className="form-note"><Icon name="shield" size={14} />No payment or medical documents are needed to submit an inquiry.</p>
    </form>
  );
}

const localeNotice: Record<Locale, string> = {
  en: "",
  zh: "此页面目前仅提供英文内容。其他语言内容正在准备中。",
  ko: "현재 이 페이지는 영어로 제공됩니다. 다른 언어 콘텐츠를 준비하고 있습니다.",
  ja: "現在、このページは英語で提供されています。他の言語のコンテンツを準備中です。",
  fr: "Cette page est actuellement disponible en anglais. Les autres langues sont en préparation.",
  es: "Esta página está disponible actualmente en inglés. Estamos preparando otros idiomas.",
};

function PublicSite({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const selectService = (service: string) => setForm((old) => ({ ...old, service }));
  const selectCity = (city: string) => setForm((old) => ({ ...old, city }));
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.documentElement.lang = "en";
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
    canonical.rel = "canonical";
    const englishUrl = new URL(localizedPath(window.location.pathname, "en"), window.location.origin);
    canonical.href = englishUrl.href;
    if (!canonical.parentNode) document.head.append(canonical);
  }, [locale]);

  return (
    <div className="site-shell" onClick={(event) => localizeLinkClick(event, locale)}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#top" onClick={closeMenu}><span className="brand-mark">CC</span><span>CHINA CARE<br />GUIDE</span></a>
          <nav aria-label="Primary navigation" className={menuOpen ? "nav-links open" : "nav-links"}>
            <a href="/services/health-screening-in-china" onClick={closeMenu}>Health Screening</a>
            <a href="/services/medical-aesthetics-in-china" onClick={closeMenu}>Medical Aesthetics</a>
            <a href="/services/rehabilitation-in-china" onClick={closeMenu}>Recovery & TCM</a>
            <a href="/services/medical-travel-concierge" onClick={closeMenu}>Travel Concierge</a>
            <a href="/destinations/" onClick={closeMenu}>Destinations</a>
            <a href="/how-it-works" onClick={closeMenu}>How It Works</a>
            <a href="/about" onClick={closeMenu}>About Us</a>
            <a className="mobile-cta" href="#inquiry" onClick={closeMenu}>Plan My Visit</a>
          </nav>
          <div className="nav-actions">
            <label className="language"><Icon name="globe" size={16} /><span className="sr-only">Language</span><select aria-label="Choose language" value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label>
            <a className="button nav-plan" href="#inquiry">Build My Care Plan</a>
            <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} className="menu-button" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} size={24} /></button>
          </div>
        </div>
      </header>

      {locale !== "en" && <div className="locale-notice" role="status">{localeNotice[locale]}</div>}

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span />INTERNATIONAL HEALTHCARE COORDINATION</p>
              <h1>Explore healthcare in China, with <em>confidence</em> and clarity.</h1>
              <p className="hero-lede"><strong>From health screening and medical aesthetics to rehabilitation and integrative care, our international team helps you explore options, understand costs, and coordinate your healthcare journey in China.</strong></p>
              <p className="hero-personal">A private, one-to-one planning service tailored to your interests, preferred destination, timing, and practical needs. You choose what to share, and we help clarify the next steps.</p>
              <div className="hero-actions"><ButtonLink>Build My Care Plan</ButtonLink><ButtonLink href="#screening" secondary>Explore Health Screening</ButtonLink></div>
              <button className="hero-chat-link" onClick={() => document.querySelector<HTMLButtonElement>(".assistant-launcher")?.click()}><Icon name="message" size={17} />Chat with our team</button>
              <div className="hero-trust">
                <div><Icon name="globe" /><span>Coordination across <strong>Canada, Ireland, and China</strong></span></div>
                <div><Icon name="shield" /><span><strong>Information and coordination</strong>—not medical care</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image"><img alt="Healthcare professional speaking with a patient in a bright clinical setting" src={images.hero} /></div>
              <div className="hero-card">
                <span><Icon name="shield" size={23} /></span>
                <div><strong>Start with clear information</strong><p>Understand providers, costs, timelines, and follow-up before you decide.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="presence" id="about">
          <div className="section-inner presence-grid">
            <div><p className="eyebrow">OUR INTERNATIONAL PRESENCE</p><h2>International support.<br /><em>Local coordination.</em></h2></div>
            <div>
              <p className="presence-intro">Our international presence helps us communicate with customers across borders and coordinate inquiries with healthcare providers in China.</p>
              <div className="office-grid">
                {["Canada", "Ireland", "China"].map((country, index) => <div className="office" key={country}><span>0{index + 1}</span><strong>{country}</strong><p>{country === "China" ? "Provider liaison & local coordination" : "International customer support"}</p><small>Office details to be confirmed</small></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section services-section">
          <div className="section-inner">
            <SectionHeading eyebrow="WAYS WE CAN HELP" title="Start with the care you are exploring." text="Health screening is our primary starting point, supported by responsible coordination across selected healthcare services." />
            <div className="services-grid">{services.map((service) => <ServiceCard key={service.id} service={service} onSelect={selectService} />)}</div>
            <div className="additional-services" id="additional">
              <div><span>ADDITIONAL SERVICE</span><h3>Specialist & Surgical Care</h3><p>Explore selected consultations and planned care, subject to assessment, provider availability, and applicable requirements.</p><a href="/services/specialist-surgical-care" onClick={() => selectService("Specialist & Surgical Care")}>Explore Planned Care <Icon name="arrow" size={18} /></a></div>
              <div className="dental-service"><span>ADDITIONAL SERVICE</span><h3>Dental Care</h3><p>Ask about dental consultations, restorative care, crowns, bridges, or implants where provider availability is confirmed.</p><ul><li><Icon name="check" size={14} />Likely number of visits</li><li><Icon name="check" size={14} />Multi-trip and follow-up considerations</li></ul><a href="/services/dental-care" onClick={() => selectService("Dental Care")}>Explore Dental Care <Icon name="arrow" size={18} /></a></div>
            </div>
          </div>
        </section>

        <MedicalTravelJourney />

        <section className="principles section">
          <div className="section-inner">
            <SectionHeading eyebrow="MAKE AN INFORMED DECISION" title="Understand your options before you travel." text="The right decision starts with the right questions—not assumptions about cost, speed, or outcomes." />
            <div className="principle-grid">
              {[
                ["01", "Clear Service Information", "Understand the proposed scope, who provides it, and whether it is clinical or non-medical."],
                ["02", "Transparent Cost Estimates", "Clarify inclusions, exclusions, and potential additional charges across the full journey."],
                ["03", "Coordinated Communication", "Understand the available language support and how provider communication will work."],
                ["04", "Planning Beyond the Visit", "Consider timelines, records, recovery, complications, and follow-up before committing."],
              ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
            <p className="principle-note">Total cost may include transport, accommodation, translation, additional treatment, and follow-up—not only the quoted medical service.</p>
          </div>
        </section>

        <section className="destinations section" id="destinations">
          <div className="section-inner">
            <div className="heading-row"><SectionHeading eyebrow="CURRENT AREAS OF INTEREST" title="Explore healthcare options across China." /><p>Available services, participating providers, and appointment options are confirmed individually based on your inquiry.</p></div>
            <div className="destination-grid">
              {destinations.map((item, index) => <article className={index === 0 ? "destination-card wide" : "destination-card"} key={item.city}><img alt={`${item.city}, China city view`} src={item.image} /><div className="destination-overlay"><span>CHINA</span><h3>{item.city}</h3><p>{item.text}</p><a href={`/destinations/${item.city.toLowerCase()}`} onClick={() => selectCity(item.city)}>Explore {item.city} <Icon name="arrow" size={17} /></a></div></article>)}
            </div>
          </div>
        </section>

        <section className="process section" id="process">
          <div className="section-inner">
            <SectionHeading center eyebrow="A SIMPLE, HUMAN PROCESS" title="From a question to a clear next step." text="Our role is to investigate, organize, and communicate—not to pressure you into treatment." />
            <div className="process-line">
              {[
                ["1", "Tell Us What You Need", "Share basic details about your interests, location, and timing."],
                ["2", "Explore Available Options", "We investigate relevant options and ask providers for current information."],
                ["3", "Clarify the Details", "Review providers, costs, inclusions, risks, timing, and arrangements."],
                ["4", "Decide Whether to Proceed", "Move forward only if the option feels appropriate and clear to you."],
              ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
            <div className="process-disclaimer"><Icon name="heart" /><p><strong>Your inquiry is not a medical assessment or confirmed appointment.</strong> Clinical suitability and final treatment decisions remain with qualified healthcare professionals.</p></div>
          </div>
        </section>

        <section className="standards section">
          <div className="section-inner standards-grid">
            <div className="standards-intro">
              <p className="eyebrow">OUR REVIEW FRAMEWORK</p>
              <h2>Trust begins with <em>transparency.</em></h2>
              <p>We use a consistent set of questions to assess potential providers and service arrangements. These are review criteria—not automatic claims that every provider has completed verification.</p>
              <div className="standard-callout"><Icon name="shield" size={28} /><p>Provider details are shared when confirmed and relevant to your inquiry. We do not sell placement in a public marketplace.</p></div>
            </div>
            <div className="checklist">
              {["Facility registration & applicable licensing", "Professional qualifications & authorized scope", "Aesthetic credentials, where applicable", "Available services, equipment & safety arrangements", "Clear costs, consent & risk disclosure", "Language support & medical record access", "Recovery, follow-up & complaint handling", "TCM, rehabilitation & supervision scope"].map((item) => <div key={item}><span><Icon name="check" size={16} /></span>{item}</div>)}
            </div>
          </div>
        </section>

        <section className="costs section">
          <div className="section-inner cost-grid">
            <div>
              <SectionHeading eyebrow="COST TRANSPARENCY" title="Know what to ask before you commit." text="A useful estimate should do more than show one number. It should explain what the quote covers, what it does not, and where costs may change." />
              <ul className="cost-list">
                {["Consultation, examination, or procedure charges", "Treatment materials and medication", "Rehabilitation sessions or program fees", "Accommodation, meals, and local transport", "Translation and coordination charges", "Additional treatment, recovery, and follow-up"].map((item) => <li key={item}><Icon name="check" size={16} />{item}</li>)}
              </ul>
            </div>
            <EstimatePreview />
          </div>
        </section>

        <LifeInChina />

        <section className="faq section">
          <div className="section-inner faq-grid">
            <div className="faq-intro"><p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h2>Clarity for the questions that <em>matter most.</em></h2><p>Still unsure where to begin? Share a general question without sending sensitive medical information.</p><ButtonLink secondary>Ask a Question</ButtonLink></div>
            <div className="accordion">
              {faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={question}><h3><button aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><Icon name="chevron" size={20} /></button></h3>{openFaq === index && <div className="faq-answer"><p>{answer}</p></div>}</div>)}
            </div>
          </div>
        </section>

        <section className="inquiry section" id="inquiry">
          <div className="section-inner inquiry-grid">
            <div className="inquiry-copy">
              <p className="eyebrow">START WITH AN INQUIRY</p>
              <h2>Tell us what you are <em>looking for.</em></h2>
              <p>Share a few basic details and our team will review your inquiry and clarify possible next steps.</p>
              <div className="privacy-note"><Icon name="shield" /><div><strong>Keep the first step simple</strong><p>We do not ask for detailed medical histories, passport numbers, records, or sensitive documents in this form.</p></div></div>
              <div className="offices-note"><span>International presence</span><strong>Canada · Ireland · China</strong><small>Business telephone: pending provisioning and testing</small></div>
            </div>
            <InquiryForm form={form} setForm={setForm} />
          </div>
        </section>

        <section className="final-cta">
          <div className="final-inner">
            <div><p className="eyebrow">NO PRESSURE. JUST CLEAR NEXT STEPS.</p><h2>Start with a conversation,<br /><em>not a commitment.</em></h2></div>
            <div><p>Explore the options, understand the practical details, and decide whether healthcare travel to China is right for you.</p><ButtonLink>Plan My Visit</ButtonLink></div>
          </div>
        </section>
      </main>

      <footer id="legal">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark">CC</span><span>CHINA CARE<br />GUIDE</span></a><p>Explore healthcare in China, with confidence and clarity.</p></div>
            <div><h3>Services</h3><a href="/services/health-screening-in-china">Health Screening</a><a href="/services/medical-aesthetics-in-china">Medical Aesthetics</a><a href="/services/healthy-aging">Healthy Aging</a><a href="/services/rehabilitation-in-china">Rehabilitation & Recovery</a><a href="/services/tcm-integrative-care">TCM & Integrative Care</a><a href="/services/medical-travel-concierge">Travel Concierge</a></div>
            <div><h3>Explore</h3><a href="/destinations/">Destinations</a><a href="/how-it-works">How It Works</a><a href="/resources/">Resources</a><a href="/about">About Us</a><a href="/contact">Contact</a><span className="footer-phone">Business telephone: pending provisioning and testing</span></div>
            <div><h3>Legal</h3><a href="#legal">Privacy Policy</a><a href="#legal">Terms of Service</a><a href="#legal">Medical Information Disclaimer</a><label className="footer-language">Language<select aria-label="Choose language" value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label></div>
          </div>
          <div className="disclaimer"><strong>Medical information disclaimer</strong><p>China Care Guide provides healthcare information and coordination services. It is not a healthcare provider and does not diagnose or treat medical conditions. Service availability, eligibility, prices, and outcomes vary. Medical decisions should be made with qualified healthcare professionals. This service is not intended for medical emergencies.</p><small>Working brand name and legal content are editable pending professional review.</small></div>
          <div className="pwa-help"><p className="eyebrow">TAKE IT WITH YOU</p><details><summary>Save China Care Guide to your home screen</summary><p>On iPhone or iPad, open this site in Safari, tap Share, then choose “Add to Home Screen.” On Android, open the browser menu and choose “Install app” or “Add to Home screen.”</p></details></div>
          <div className="copyright"><span>© 2025 China Care Guide. Working prototype.</span><span>Canada · Ireland · China</span></div>
        </div>
      </footer>
      <AssistantWidget />
    </div>
  );
}

export default function App() {
  const path = window.location.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) return <Suspense fallback={<div className="route-loading">Loading private workspace…</div>}><Admin /></Suspense>;
  const route = parseLocalizedPath(path);
  if (!route.locale) return <LocaleRedirect />;
  const contentPage = getContentPage(route.path);
  if (contentPage) return <PublicContent locale={route.locale} page={contentPage} />;
  return <PublicSite locale={route.locale} />;
}

function LocaleRedirect() {
  useEffect(() => {
    window.location.replace(`/${localizedDefaultPath(window.location.pathname)}${window.location.search}${window.location.hash}`);
  }, []);
  return <div className="route-loading">Opening English version…</div>;
}

function localizedDefaultPath(pathname: string) {
  const path = pathname.replace(/^\/+/, "");
  return path ? `en/${path}` : "en/";
}
