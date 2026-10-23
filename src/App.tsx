import { cloneElement, FormEvent, isValidElement, lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import PublicContent, { getLocalizedContentPage } from "./PublicContent";
import LegalPage from "./LegalPages";
import HealthScreeningPage from "./HealthScreeningPage";
import AestheticCarePage from "./AestheticCarePages";
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
  specialist: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=85",
  dental: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=85",
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
    <a className={`service-card ${service.featured ? "featured" : ""}`} href={routes[service.id]} id={service.id} onClick={() => onSelect(service.value)}>
      <div className="service-image">
        <img alt={`${service.title} consultation`} src={service.image} />
        <span>{service.eyebrow}</span>
      </div>
      <div className="service-copy">
        <h3>{service.title}</h3>
        <p>{service.text}</p>
        <ul>{service.details.map((detail) => <li key={detail}><Icon name="check" size={14} />{detail}</li>)}</ul>
        <span className="service-card-cta">{service.cta}<Icon name="arrow" size={18} /></span>
      </div>
    </a>
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

function AssistantWidget({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [contactNotice, setContactNotice] = useState("");
  const [pastHero, setPastHero] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ question: string; answer: string; handoff?: boolean; emergency?: boolean }>>([]);
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
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
  const quickReplies: Record<string, string> = locale === "zh" ? {
    "Health screening": "可以了解哪些健康体检服务？",
    "Costs & estimates": "如何申请费用估算？",
    "Travel planning": "手术赴华前应了解什么？",
    "Talk to a person": "我想联系人工协调员。",
  } : {
    "Health screening": "What health screening services can I explore?",
    "Costs & estimates": "How can I request an estimate?",
    "Travel planning": "What should I know before traveling for surgery?",
    "Talk to a person": "I would like to speak to a human coordinator.",
  };
  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [conversation, assistantBusy]);
  const submitQuestion = async (rawQuestion: string) => {
    const cleaned = rawQuestion.trim();
    if (!cleaned || assistantBusy) return;
    setQuestion("");
    setAssistantError("");
    setAssistantBusy(true);
    try {
      const history = conversation.flatMap((item) => [{ role: "user", content: item.question }, { role: "assistant", content: item.answer }]).slice(-8);
      const response = await fetch("/api/assistant-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleaned, history }),
      });
      const result = await response.json() as { answer?: string; handoff?: boolean; emergency?: boolean; message?: string };
      if (!response.ok || !result.answer) throw new Error(result.message || "The assistant is temporarily unavailable.");
      setConversation((current) => [...current, { question: cleaned, answer: result.answer!, handoff: result.handoff, emergency: result.emergency }]);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "The assistant is temporarily unavailable. Please try again.");
    } finally {
      setAssistantBusy(false);
    }
  };
  return <>
    <div className={`floating-contact ${pastHero ? "past-hero" : ""}`}>
      {whatsappNumber ? <a className="whatsapp-entry" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(locale === "zh" ? "你好，我想咨询 China Care Guide 的服务。" : "Hello, I have a general question about China Care Guide.")}`} target="_blank" rel="noreferrer"><span>WA</span>Chat on WhatsApp</a> : <button className="whatsapp-entry" onClick={() => setContactNotice(locale === "zh" ? "WhatsApp 尚未连接。请使用咨询表联系人工协调员。" : "WhatsApp is not connected yet. Please use the inquiry form for human follow-up.")}><span>WA</span>Chat on WhatsApp</button>}
      <button aria-expanded={open} aria-label={open ? "Close China Care Guide" : "Open China Care Guide"} className="assistant-launcher" onClick={() => { setOpen(!open); setContactNotice(""); }}><Icon name={open ? "close" : "message"} /><span>{open ? "Close" : "Ask our guide"}</span></button>
    </div>
    {contactNotice && <div className="contact-toast" role="status">{contactNotice}<button aria-label="Dismiss" onClick={() => setContactNotice("")}>×</button></div>}
    {open && <section aria-label="China Care Guide Assistant" className="assistant-panel">
      <header><span><Icon name="spark" /></span><div><strong>China Care Guide</strong><small>AI guide · human support available</small></div><button aria-label="Close assistant" onClick={() => setOpen(false)}><Icon name="close" /></button></header>
      <div className="assistant-safety"><Icon name="shield" size={15} />AI-generated answers; your question is sent to our AI provider. Don't share medical records or sensitive health details.</div>
      <div className="assistant-thread" ref={threadRef}><div className="assistant-message"><strong>Welcome</strong><p>Ask about services, estimates, travel coordination, or how the inquiry process works.</p></div>{conversation.map((item, index) => <div key={`${index}-${item.question}`}><div className="chat-bubble assistant-question">{item.question}</div><div className="assistant-message response"><p>{item.answer}</p>{item.handoff && !item.emergency && <a href="#inquiry" onClick={() => setOpen(false)}>Contact a human coordinator</a>}</div></div>)}{assistantBusy && <div className="assistant-message" role="status">Thinking…</div>}{assistantError && <div className="crm-error" role="alert">{assistantError}</div>}</div>
      <div className="quick-replies">{Object.entries(quickReplies).map(([label, prompt]) => <button disabled={assistantBusy} key={label} onClick={() => void submitQuestion(prompt)}>{label}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); void submitQuestion(question); }}><label><span className="sr-only">Ask a general question</span><input disabled={assistantBusy} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a general question…" /></label><button aria-label="Send question" disabled={assistantBusy} type="submit"><Icon name="arrow" /></button></form>
      <footer><span>General information · Not medical advice</span><a href="#inquiry" onClick={() => setOpen(false)}>Contact a human</a></footer>
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

function InquiryForm({ form, setForm, locale }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>>; locale: Locale }) {
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
      <label className="consent"><input checked={form.consent} type="checkbox" onChange={(e) => update("consent", e.target.checked)} /><span>I agree that my inquiry may be reviewed according to the <a href={localizedPath("/privacy-policy", locale)}>Privacy Policy</a>. I understand this is not a medical assessment or confirmed appointment.</span></label>
      {errors.consent && <small className="consent-error" id="consent-error">{errors.consent}</small>}
      <button className="submit-button" disabled={status === "loading"} type="submit">{status === "loading" ? "Recording inquiry…" : "Send My Inquiry"}{status !== "loading" && <Icon name="arrow" size={18} />}</button>
      <p className="form-note"><Icon name="shield" size={14} />No payment or medical documents are needed to submit an inquiry.</p>
    </form>
  );
}

const zhText: Record<string, string> = Object.fromEntries([
  ["Skip to content", "跳转到正文"], ["Primary navigation", "主导航"], ["Health Screening", "健康体检"], ["Medical Aesthetics", "医疗美容"], ["Rehabilitation", "康复与恢复"], ["Rehabilitation & Recovery", "康复与恢复"], ["TCM & Integrative Care", "中医与整合照护"], ["Healthy Aging", "健康老龄化"], ["Recovery & TCM", "康复与中医"], ["Travel Concierge", "医疗旅行协调"], ["Destinations", "目的地"], ["How It Works", "服务流程"], ["About Us", "关于我们"], ["Plan My Visit", "规划我的行程"], ["Choose language", "选择语言"], ["Build My Care Plan", "定制我的就医计划"],
  ["INTERNATIONAL HEALTHCARE COORDINATION", "国际医疗协调服务"], ["INTERNATIONAL HEALTHCARE COORDINATION", "国际医疗协调服务"], ["Explore healthcare in China, with ", "了解赴华医疗，"], ["confidence", "安心"], [" and clarity.", "且信息清晰。"], ["From health screening and medical aesthetics to rehabilitation and integrative care, our international team helps you explore options, understand costs, and coordinate your healthcare journey in China.", "从健康体检、医疗美容到康复与整合照护，我们的国际团队协助你了解选项、费用，并协调赴华就医行程。"], ["A private, one-to-one planning service tailored to your interests, preferred destination, timing, and practical needs. You choose what to share, and we help clarify the next steps.", "提供一对一私人个性化规划，根据你的服务兴趣、目的地、时间和实际需求定制。你决定分享哪些信息，我们协助厘清下一步。"], ["Explore Health Screening", "了解健康体检"], ["Chat with our team", "与团队聊天"], ["Coordination across ", "服务协调覆盖"], ["Canada, Ireland, and China", "加拿大、爱尔兰和中国"], ["Information and coordination", "信息与协调服务"], ["—not medical care", "，不提供医疗诊治"], ["Start with clear information", "从清晰信息开始"], ["Understand providers, costs, timelines, and follow-up before you decide.", "决定前先了解服务方、费用、时间安排和后续服务。"],
  ["OUR INTERNATIONAL PRESENCE", "我们的国际服务网络"], ["International support.", "国际支持。"], ["Local coordination.", "当地协调。"], ["Our international presence helps us communicate with customers across borders and coordinate inquiries with healthcare providers in China.", "我们的国际团队协助跨境沟通，并与中国医疗服务方协调咨询。"], ["Provider liaison & local coordination", "服务方联络与当地协调"], ["International customer support", "国际客户支持"], ["Office details to be confirmed", "办公信息待确认"],
  ["WAYS WE CAN HELP", "我们可以提供的协助"], ["Start with the care you are exploring.", "从你正在了解的服务开始。"], ["Health screening is our primary starting point, supported by responsible coordination across selected healthcare services.", "健康体检是我们的主要服务起点，同时以审慎方式协调其他精选医疗服务。"], ["ADDITIONAL SERVICE", "其他服务"], ["Specialist & Surgical Care", "专科与手术服务"], ["Explore selected consultations and planned care, subject to assessment, provider availability, and applicable requirements.", "了解精选专科咨询和计划性医疗服务，具体取决于专业评估、服务方安排及相关要求。"], ["Explore Planned Care", "了解计划性医疗"], ["Dental Care", "牙科服务"], ["Ask about dental consultations, restorative care, crowns, bridges, or implants where provider availability is confirmed.", "了解牙科咨询、修复治疗、牙冠、牙桥或种植牙；具体服务以服务方确认为准。"], ["Likely number of visits", "预计就诊次数"], ["Multi-trip and follow-up considerations", "多次往返与后续安排"], ["Explore Dental Care", "了解牙科服务"],
  ["MAKE AN INFORMED DECISION", "充分了解，再作决定"], ["Understand your options before you travel.", "出发前，先了解可选方案。"], ["The right decision starts with the right questions—not assumptions about cost, speed, or outcomes.", "作出合适决定，始于提出正确问题，而不是假设费用、速度或结果。"], ["Clear Service Information", "服务信息清晰"], ["Understand the proposed scope, who provides it, and whether it is clinical or non-medical.", "了解服务范围、提供方，以及属于临床医疗还是非医疗项目。"], ["Transparent Cost Estimates", "费用估算透明"], ["Clarify inclusions, exclusions, and potential additional charges across the full journey.", "了解整个行程中的包含项目、排除项目及可能的额外费用。"], ["Coordinated Communication", "沟通协调"], ["Understand the available language support and how provider communication will work.", "了解可提供的语言支持，以及如何与服务方沟通。"], ["Planning Beyond the Visit", "规划就诊之后"], ["Consider timelines, records, recovery, complications, and follow-up before committing.", "决定前考虑时间安排、病历、恢复、并发症及后续服务。"], ["Total cost may include transport, accommodation, translation, additional treatment, and follow-up—not only the quoted medical service.", "总费用可能包括交通、住宿、翻译、额外治疗和后续服务，而不只是医疗项目报价。"],
  ["CURRENT AREAS OF INTEREST", "目前关注的地区"], ["Explore healthcare options across China.", "了解中国各地的医疗选项。"], ["Available services, participating providers, and appointment options are confirmed individually based on your inquiry.", "可提供的服务、服务方及预约情况，均根据具体咨询逐项确认。"], ["CHINA", "中国"], ["Explore ", "了解"], ["A SIMPLE, HUMAN PROCESS", "清晰、以人为本的流程"], ["From a question to a clear next step.", "从一个问题，到清晰的下一步。"], ["Our role is to investigate, organize, and communicate—not to pressure you into treatment.", "我们的职责是调查、整理和沟通，不会催促你接受治疗。"], ["Tell Us What You Need", "告诉我们你的需求"], ["Share basic details about your interests, location, and timing.", "分享服务兴趣、地点和时间等基本信息。"], ["Explore Available Options", "了解可选方案"], ["We investigate relevant options and ask providers for current information.", "我们调查相关选项，并向服务方了解最新信息。"], ["Clarify the Details", "确认具体细节"], ["Review providers, costs, inclusions, risks, timing, and arrangements.", "核对服务方、费用、包含项目、风险、时间和安排。"], ["Decide Whether to Proceed", "决定是否继续"], ["Move forward only if the option feels appropriate and clear to you.", "只有在你认为方案合适且信息清楚后，再决定是否继续。"], ["Your inquiry is not a medical assessment or confirmed appointment.", "提交咨询不等于医疗评估或预约确认。"], ["Clinical suitability and final treatment decisions remain with qualified healthcare professionals.", "医疗适宜性和最终治疗决定应由合格医疗专业人员作出。"],
  ["OUR REVIEW FRAMEWORK", "我们的审核框架"], ["Trust begins with ", "信任始于"], ["transparency.", "透明。"], ["We use a consistent set of questions to assess potential providers and service arrangements. These are review criteria—not automatic claims that every provider has completed verification.", "我们用一套一致的问题审视潜在服务方和服务安排。这些是审核标准，不代表所有服务方都已完成核实。"], ["Provider details are shared when confirmed and relevant to your inquiry. We do not sell placement in a public marketplace.", "服务方信息会在确认且与你的咨询相关时提供。我们不出售公开平台排名。"], ["Facility registration & applicable licensing", "机构注册及适用许可"], ["Professional qualifications & authorized scope", "专业资质及获准执业范围"], ["Aesthetic credentials, where applicable", "适用时的美容资质"], ["Available services, equipment & safety arrangements", "服务项目、设备及安全安排"], ["Clear costs, consent & risk disclosure", "费用、知情同意及风险说明"], ["Language support & medical record access", "语言支持及病历获取"], ["Recovery, follow-up & complaint handling", "恢复、后续服务及投诉处理"], ["TCM, rehabilitation & supervision scope", "中医、康复及监督范围"],
  ["Plan", "规划"], ["Prepare", "准备"], ["Visit", "就诊"], ["Follow up", "后续跟进"], ["Before your trip", "出发前"], ["Clarify your service, destination, provider options, estimates, appointment requests, documents, translation needs, itinerary, and accommodation preferences.", "确认服务需求、目的地、服务方选项、费用估算、预约申请、文件、翻译需求、行程和住宿偏好。"], ["Administrative review only—not a diagnosis or clinical assessment.", "仅作行政信息整理，不是诊断或临床评估。"], ["Arrival arrangements", "抵达安排"], ["Coordinate airport pickup, local transport, accommodation, connectivity, payments, interpreter support, and hospital navigation where available.", "视情况协调接机、当地交通、住宿、网络、支付、口译及院内导航。"], ["Local services are available on request and subject to confirmation.", "当地服务需提出申请并经确认。"], ["Support during your visit", "就诊期间支持"], ["Keep appointments, practical questions, interpretation arrangements, schedules, documents, and receipts organized throughout the visit.", "协助整理就诊预约、实际问题、口译安排、日程、文件和收据。"], ["Interpreters support communication; they do not make clinical decisions.", "口译人员协助沟通，不作临床决定。"], ["After your visit", "就诊后"], ["Organize reports, translation requests, provider follow-up, documentation, and practical communication after you return home.", "回国后协助整理报告、翻译申请、服务方跟进、文件及实际沟通。"], ["Ongoing care and complication management cannot be guaranteed.", "无法保证持续照护或并发症处理。"],
  ["Before you travel", "出发前准备"], ["A practical preparation checklist for documents, prescriptions, contact details, chargers, and confirmed arrangements.", "整理文件、处方、联系方式、充电器及已确认安排的实用清单。"], ["Weather & clothing", "天气与衣物"], ["Seasonal packing guidance that should be checked again near your travel date.", "季节性行李建议；请在出行前再次核实。"], ["Transport & navigation", "交通与导航"], ["How metro, taxi, ride-hailing, and hospital journeys may work in your destination.", "了解目的地的地铁、出租车、网约车及医院交通。"], ["Connectivity", "网络与通讯"], ["Options for mobile access, roaming, local connectivity, and essential apps where available.", "了解手机上网、漫游、本地网络及常用应用选项。"], ["Payments", "支付方式"], ["Practical preparation for cards, cash, and commonly used digital payment options.", "为银行卡、现金及常用数字支付方式做好准备。"], ["Food & preferences", "饮食与偏好"], ["Planning for dietary preferences, allergies, hotel breakfasts, and nearby restaurant choices.", "考虑饮食偏好、过敏、酒店早餐及附近餐饮选择。"], ["Where to stay", "住宿选择"], ["Consider distance to facilities, accessibility, transport links, and recovery needs.", "考虑住宿与机构的距离、无障碍条件、交通连接及恢复需求。"], ["Culture & communication", "文化与沟通"], ["Simple etiquette, expectations, and ways to make administrative communication easier.", "了解基本礼仪、沟通习惯及简化行政沟通的方法。"], ["Useful phrases", "常用短语"], ["A growing, reviewed list of useful phrases for transport, reception, payments, and everyday needs.", "持续整理并审阅交通、接待、支付及日常所需短语。"], ["Emergency preparation", "紧急情况准备"], ["Keep local emergency contacts, insurer details, provider contacts, and a trusted personal contact accessible.", "随时备好当地急救电话、保险信息、服务方联系方式及可信任联系人的信息。"], ["Editable guide · verification required", "可编辑指南 · 发布前需核实"], ["PRACTICAL TRAVEL GUIDANCE", "实用旅行指南"], ["Your guide to everyday life in China.", "中国日常生活指南。"], ["Calm, practical preparation for the parts of the journey that may feel unfamiliar.", "为行程中可能陌生的环节做好从容、实用的准备。"], ["Travel requirements, payment methods, regulations, and emergency details should always be checked and updated before publication or travel.", "旅行要求、支付方式、法规和紧急信息应在发布或出行前核实更新。"], ["Practical information, not professional advice.", "实用信息，不构成专业建议。"], ["General travel guidance does not replace legal, immigration, financial, medical, or emergency advice.", "一般旅行指南不能替代法律、移民、财务、医疗或紧急情况建议。"], ["Explore the resource center", "浏览资源中心"],
  ["Why consider healthcare in China?", "为什么考虑赴华就医？"], ["China may offer healthcare options worth exploring based on your needs, timing, location, and budget. We help you investigate practical details without claiming that care in China is always cheaper, faster, or better. Consider the full cost of travel, accommodation, translation, treatment, and follow-up.", "根据你的需求、时间、地点和预算，中国可能有值得了解的医疗选项。我们协助调查实际细节，但不会声称中国医疗总是更便宜、更快或更好。请考虑交通、住宿、翻译、治疗及后续服务的全部费用。"], ["What health screening services can I explore?", "可以了解哪些健康体检服务？"], ["Potential options include general examinations, comprehensive screening packages, and individually selected examinations. Availability and the appropriate scope should be confirmed with qualified healthcare professionals based on your circumstances.", "可了解常规检查、综合体检套餐及个别选择的检查项目。具体可用服务及适合范围应由合格医疗专业人员根据个人情况确认。"], ["What medical aesthetic services are available?", "有哪些医疗美容服务？"], ["Availability may include cosmetic dermatology, skin-related treatments, non-surgical procedures, and selected cosmetic surgery. We only present confirmed clinical procedures after relevant facility and practitioner details are reviewed.", "可能包括美容皮肤科、皮肤治疗、非手术项目及部分美容手术。只有在核实相关机构和从业人员信息后，我们才介绍已确认的临床项目。"], ["How can I evaluate providers?", "如何评估医疗服务方？"], ["Ask about facility registration, practitioner qualifications, authorized scope, equipment, consent, risks, infection control, records, communication support, complaints, and follow-up. Our review framework helps organize these questions; it is not a guarantee.", "询问机构注册、从业人员资质、执业范围、设备、知情同意、风险、感染控制、病历、沟通支持、投诉及后续安排。我们的审核框架用于整理问题，不构成保证。"], ["What rehabilitation or recuperation options may be available?", "可能有哪些康复或休养选项？"], ["Options may range from physical and functional rehabilitation to structured recovery stays. We clarify whether a service is medical or non-medical, who is involved, and whether professional supervision is actually included.", "选项可能包括身体及功能康复，或有安排的恢复住宿。我们会确认服务属于医疗还是非医疗、由谁提供，以及是否确实包含专业监督。"], ["What does integrative care mean?", "整合照护是什么意思？"], ["Integrative care coordinates appropriate conventional and traditional approaches through qualified practitioners. It does not mean treatments are interchangeable or appropriate for everyone. Share relevant medicines and treatments with your healthcare professionals.", "整合照护由合格专业人员协调适当的常规与传统疗法，但不表示不同疗法可以互相替代或适合所有人。请向医疗专业人员说明正在使用的药物及接受的治疗。"], ["How can I request an estimate?", "如何申请费用估算？"], ["Submit the short inquiry form with your service interest, preferred city, and timeframe. We can then investigate an individualized estimate with inclusions, exclusions, conditions, currency, and validity clearly stated where available.", "填写简短咨询表，说明服务兴趣、首选城市和时间。我们可进一步了解个性化报价，并在信息可得时列明包含项、排除项、条件、币种和有效期。"], ["Are travel and accommodation included?", "报价包含交通和住宿吗？"], ["Not automatically. Any estimate should state whether transport, accommodation, meals, translation, coordination, or other travel services are included. We encourage comparing the total journey cost.", "不一定。报价应说明是否包含交通、住宿、餐食、翻译、协调或其他旅行服务。建议比较整个行程的总费用。"], ["Can treatments be guaranteed?", "能保证治疗效果吗？"], ["No. Eligibility, timelines, clinical outcomes, recovery, and satisfaction cannot be guaranteed. Suitability and treatment decisions remain with appropriately qualified healthcare professionals.", "不能。适用资格、时间、临床结果、恢复情况及满意度均无法保证。是否适合及治疗决定应由具备相应资质的医疗专业人员作出。"], ["Can you help with follow-up arrangements?", "可以协助安排后续服务吗？"], ["We can ask providers about records, expected follow-up, remote consultations where available, and what to plan after returning home. Local follow-up may still need to be arranged with your own healthcare professionals.", "我们可向服务方询问病历、预期复诊、可提供的远程咨询及回国后的安排。你仍可能需要与当地医疗专业人员安排后续照护。"], ["What should I know before traveling for surgery?", "手术赴华前应了解什么？"], ["Confirm clinical assessment requirements, provider qualifications, risks, expected stay, recovery restrictions, companion needs, records, complication plans, and follow-up before making travel commitments.", "作出旅行承诺前，确认临床评估要求、服务方资质、风险、预计停留时间、恢复限制、陪同需求、病历、并发症预案及后续安排。"], ["Do you provide emergency medical services?", "你们提供急救服务吗？"], ["No. China Care Guide is not an emergency service. Contact local emergency services or a qualified healthcare professional for urgent medical needs.", "不提供。China Care Guide 不是急救服务。如遇紧急医疗情况，请联系当地急救服务或合格医疗专业人员。"], ["Which Chinese cities can currently be supported?", "目前可了解哪些中国城市？"], ["Our current geographic areas of interest are Shanghai, Beijing, Changchun, Dalian, and Harbin. Services, providers, and appointment options are confirmed individually for each inquiry.", "目前关注的城市包括上海、北京、长春、大连和哈尔滨。每项咨询中的服务、服务方及预约情况均需逐项确认。"],
  ["What is included", "包含项目"], ["What is excluded", "不包含项目"], ["Potential extras", "可能的额外费用"], ["Conditions & validity", "条件与有效期"], ["INDIVIDUAL ESTIMATE", "个性化费用估算"], ["Clear before you decide", "决定前先了解清楚"], ["Service", "服务项目"], ["Confirmed after inquiry", "提交咨询后确认"], ["Provider", "服务方"], ["Named when verified", "核实后提供名称"], ["Amount & currency", "金额与币种"], ["Individually quoted", "按个案报价"], ["Included services", "包含的服务"], ["Excluded services", "不包含的服务"], ["Potential extras", "可能的额外费用"], ["Request an Individual Estimate", "申请个性化费用估算"],
  ["First name *", "名字 *"], ["Email address *", "电子邮箱 *"], ["Country of residence *", "居住国家/地区 *"], ["Service interest *", "感兴趣的服务 *"], ["Select a service", "请选择服务"], ["Approximate travel timeframe *", "预计出行时间 *"], ["Select a timeframe", "请选择时间范围"], ["Within 1–3 months", "1–3 个月内"], ["Within 3–6 months", "3–6 个月内"], ["Within 6–12 months", "6–12 个月内"], ["Just exploring", "目前仅了解"], ["Preferences and general question", "偏好与一般问题"], ["Optional", "选填"], ["Preferred city", "首选城市"], ["Preferred language", "首选语言"], ["Preferred contact method", "首选联系方法"], ["General question", "一般问题"], ["Please do not include medical records, passport information, or other sensitive details.", "请勿填写病历、护照信息或其他敏感资料。"], ["I agree that my inquiry may be reviewed according to the ", "我同意根据"], [". I understand this is not a medical assessment or confirmed appointment.", "审阅我的咨询。我理解这不是医疗评估或已确认的预约。"], ["Send My Inquiry", "提交咨询"], ["Recording inquiry…", "正在提交咨询…"], ["No payment or medical documents are needed to submit an inquiry.", "提交咨询无需付款或提供医疗文件。"], ["About you and your inquiry", "关于你和你的咨询"], ["Required fields are marked *", "带 * 的为必填项"], ["INQUIRY RECEIVED", "已收到咨询"], ["Your inquiry was securely submitted for review. You do not need an account. Please do not email medical records or other sensitive documents unless a coordinator provides a secure method.", "你的咨询已安全提交，等待查看。无需创建账户。除非协调人员提供安全渠道，否则请勿通过电子邮件发送病历或其他敏感文件。"], ["Send another inquiry", "再提交一项咨询"], ["We could not submit your inquiry.", "暂时无法提交咨询。"], ["We could not send your inquiry. Please try again later.", "暂时无法发送咨询，请稍后重试。"], ["Please review the highlighted fields below.", "请检查下方标记的字段。"], ["We need a little more information.", "请补充一些信息。"], ["Please enter your first name.", "请输入名字。"], ["Please enter a valid email address.", "请输入有效的电子邮箱地址。"], ["Please enter your country of residence.", "请输入居住国家/地区。"], ["Please choose a service interest.", "请选择感兴趣的服务。"], ["Please select an approximate timeframe.", "请选择预计时间范围。"], ["Please confirm that you have read the privacy notice.", "请确认已阅读隐私说明。"], ["Ask our guide", "咨询助手"], ["Close", "关闭"], ["Chat on WhatsApp", "通过 WhatsApp 联系"], ["Ask a general question…", "请输入一般问题…"], ["Welcome", "欢迎"], ["Ask about services, estimates, travel coordination, or how the inquiry process works.", "你可以询问服务、费用估算、旅行协调或咨询流程。"], ["AI guide · human support available", "AI 助手 · 可联系人工协调员"], ["AI-generated answers; your question is sent to our AI provider. Don't share medical records or sensitive health details.", "回答由 AI 生成；你的问题会发送给 AI 服务商。请勿分享病历或敏感健康信息。"], ["Contact a human coordinator", "联系人工协调员"], ["Contact a human", "联系人工"], ["Thinking…", "正在思考…"], ["General information · Not medical advice", "一般信息 · 不构成医疗建议"], ["Health screening", "健康体检"], ["Costs & estimates", "费用与估算"], ["Travel planning", "旅行规划"], ["Talk to a person", "联系人工"], ["The assistant is temporarily unavailable.", "助手暂时无法使用。"], ["The assistant is temporarily unavailable. Please try again.", "助手暂时无法使用，请重试。"], ["WhatsApp is not connected yet. Please use the inquiry form for human follow-up.", "WhatsApp 尚未连接。请使用咨询表联系人工协调员。"],
  ["Primary service", "主要服务"], ["Major service", "重点服务"], ["Recovery", "康复服务"], ["Integrative care", "整合照护"], ["Medical Aesthetics & Healthy Aging", "医疗美容与健康老龄化"], ["Rehabilitation & Recovery", "康复与恢复"], ["Explore examination options, understand package contents, clarify fees, and plan a visit around your individual circumstances.", "了解体检选项和套餐内容，确认费用，并根据个人情况规划就诊。"], ["Explore cosmetic dermatology, confirmed aesthetic procedures, skin health, and evidence-supported healthy-aging services with clear limits.", "了解美容皮肤科、已确认的美容项目、皮肤健康及有依据的健康老龄化服务，并明确其边界。"], ["Consider medical rehabilitation and structured recuperation options, with the level of professional supervision made clear.", "了解医疗康复及有组织的休养选项，并确认专业监督程度。"], ["Explore licensed TCM services, coordinated clinical care, and non-medical wellness experiences—with each clearly distinguished.", "了解合规中医服务、协调式临床照护及非医疗健康体验，并清楚区分。"], ["Package contents explained", "说明套餐内容"], ["Fees and follow-up clarified", "确认费用与后续安排"], ["Consultation, risks, and recovery clarified", "说明咨询、风险与恢复"], ["Optional genetics never presented as an outcome predictor", "不将可选基因检测描述为结果预测工具"], ["Medical and non-medical care distinguished", "区分医疗与非医疗照护"], ["Supervision confirmed", "确认监督安排"], ["Practitioner scope clarified", "确认从业者服务范围"], ["Wellness is not presented as treatment", "不将健康体验说成治疗"], ["Explore Aesthetic Options", "了解医疗美容选项"], ["Explore Recovery Options", "了解康复选项"], ["Explore TCM & Integrative Care", "了解中医与整合照护"],
  ["Why consider healthcare in China?", "为什么考虑赴华就医？"], ["What health screening services can I explore?", "可以了解哪些健康体检服务？"], ["What medical aesthetic services are available?", "有哪些医疗美容服务？"], ["How can I evaluate providers?", "如何评估医疗服务方？"], ["What rehabilitation or recuperation options may be available?", "可能有哪些康复或休养选项？"], ["What does integrative care mean?", "整合照护是什么意思？"], ["How can I request an estimate?", "如何申请费用估算？"], ["Are travel and accommodation included?", "报价包含交通和住宿吗？"], ["Can treatments be guaranteed?", "能保证治疗效果吗？"], ["Can you help with follow-up arrangements?", "可以协助安排后续服务吗？"], ["What should I know before traveling for surgery?", "手术赴华前应了解什么？"], ["Do you provide emergency medical services?", "你们提供急救服务吗？"], ["Which Chinese cities can currently be supported?", "目前可了解哪些中国城市？"],
  ["Before your trip", "出发前"], ["Clarify your service, destination, provider options, estimates, appointment requests, documents, translation needs, itinerary, and accommodation preferences.", "确认服务需求、目的地、服务方选项、费用估算、预约申请、文件、翻译需求、行程和住宿偏好。"], ["Administrative review only—not a diagnosis or clinical assessment.", "仅作行政信息整理，不是诊断或临床评估。"], ["Arrival arrangements", "抵达安排"], ["Coordinate airport pickup, local transport, accommodation, connectivity, payments, interpreter support, and hospital navigation where available.", "视情况协调接机、当地交通、住宿、网络、支付、口译及院内导航。"], ["Local services are available on request and subject to confirmation.", "当地服务需提出申请并经确认。"], ["Support during your visit", "就诊期间支持"], ["Keep appointments, practical questions, interpretation arrangements, schedules, documents, and receipts organized throughout the visit.", "协助整理就诊预约、实际问题、口译安排、日程、文件和收据。"], ["Interpreters support communication; they do not make clinical decisions.", "口译人员协助沟通，不作临床决定。"], ["After your visit", "就诊后"], ["Organize reports, translation requests, provider follow-up, documentation, and practical communication after you return home.", "回国后协助整理报告、翻译申请、服务方跟进、文件及实际沟通。"], ["Ongoing care and complication management cannot be guaranteed.", "无法保证持续照护或并发症处理。"],
  ["Before you travel", "出发前准备"], ["A practical preparation checklist for documents, prescriptions, contact details, chargers, and confirmed arrangements.", "整理文件、处方、联系方式、充电器及已确认安排的实用清单。"], ["Weather & clothing", "天气与衣物"], ["Seasonal packing guidance that should be checked again near your travel date.", "季节性行李建议；请在出行前再次核实。"], ["Transport & navigation", "交通与导航"], ["How metro, taxi, ride-hailing, and hospital journeys may work in your destination.", "了解目的地的地铁、出租车、网约车及医院交通。"], ["Connectivity", "网络与通讯"], ["Options for mobile access, roaming, local connectivity, and essential apps where available.", "了解手机上网、漫游、本地网络及常用应用选项。"], ["Payments", "支付方式"], ["Practical preparation for cards, cash, and commonly used digital payment options.", "为银行卡、现金及常用数字支付方式做好准备。"], ["Food & preferences", "饮食与偏好"], ["Planning for dietary preferences, allergies, hotel breakfasts, and nearby restaurant choices.", "考虑饮食偏好、过敏、酒店早餐及附近餐饮选择。"], ["Where to stay", "住宿选择"], ["Consider distance to facilities, accessibility, transport links, and recovery needs.", "考虑住宿与机构的距离、无障碍条件、交通连接及恢复需求。"], ["Culture & communication", "文化与沟通"], ["Simple etiquette, expectations, and ways to make administrative communication easier.", "了解基本礼仪、沟通习惯及简化行政沟通的方法。"], ["Useful phrases", "常用短语"], ["A growing, reviewed list of useful phrases for transport, reception, payments, and everyday needs.", "持续整理并审阅交通、接待、支付及日常所需短语。"], ["Emergency preparation", "紧急情况准备"], ["Keep local emergency contacts, insurer details, provider contacts, and a trusted personal contact accessible.", "随时备好当地急救电话、保险信息、服务方联系方式及可信联系人的信息。"], ["Editable guide · verification required", "可编辑指南 · 发布前需核实"], ["PRACTICAL TRAVEL GUIDANCE", "实用旅行指南"], ["Your guide to everyday life in China.", "中国日常生活指南。"], ["Calm, practical preparation for the parts of the journey that may feel unfamiliar.", "为行程中可能陌生的环节做好从容、实用的准备。"], ["Travel requirements, payment methods, regulations, and emergency details should always be checked and updated before publication or travel.", "旅行要求、支付方式、法规和紧急信息应在发布或出行前核实更新。"], ["Practical information, not professional advice.", "实用信息，不构成专业建议。"], ["General travel guidance does not replace legal, immigration, financial, medical, or emergency advice.", "一般旅行指南不能替代法律、移民、财务、医疗或紧急情况建议。"], ["Explore the resource center", "浏览资源中心"],
]);

Object.assign(zhText, Object.fromEntries([
  ["PLAN", "规划"], ["PREPARE", "准备"], ["VISIT", "就诊"], ["FOLLOW UP", "后续跟进"], ["Four-stage medical travel journey", "医疗旅行四阶段"], ["Explore healthcare options across China.", "了解中国各地的医疗选项。"],
  ["Why consider healthcare in China?", "为什么考虑赴华就医？"], ["China may offer healthcare options worth exploring based on your needs, timing, location, and budget. We help you investigate practical details without claiming that care in China is always cheaper, faster, or better. Consider the full cost of travel, accommodation, translation, treatment, and follow-up.", "根据你的需求、时间、地点和预算，中国可能有值得了解的医疗选项。我们协助调查实际细节，但不会声称中国医疗总是更便宜、更快或更好。请考虑交通、住宿、翻译、治疗及后续服务的全部费用。"],
  ["What health screening services can I explore?", "可以了解哪些健康体检服务？"], ["Potential options include general examinations, comprehensive screening packages, and individually selected examinations. Availability and the appropriate scope should be confirmed with qualified healthcare professionals based on your circumstances.", "可了解常规检查、综合体检套餐及个别选择的检查项目。具体可用服务及适合范围应由合格医疗专业人员根据个人情况确认。"],
  ["What medical aesthetic services are available?", "有哪些医疗美容服务？"], ["Availability may include cosmetic dermatology, skin-related treatments, non-surgical procedures, and selected cosmetic surgery. We only present confirmed clinical procedures after relevant facility and practitioner details are reviewed.", "可能包括美容皮肤科、皮肤治疗、非手术项目及部分美容手术。只有核实相关机构和从业人员信息后，我们才介绍已确认的临床项目。"],
  ["How can I evaluate providers?", "如何评估医疗服务方？"], ["Ask about facility registration, practitioner qualifications, authorized scope, equipment, consent, risks, infection control, records, communication support, complaints, and follow-up. Our review framework helps organize these questions; it is not a guarantee.", "询问机构注册、从业人员资质、执业范围、设备、知情同意、风险、感染控制、病历、沟通支持、投诉及后续安排。我们的审核框架用于整理问题，不构成保证。"],
  ["What rehabilitation or recuperation options may be available?", "可能有哪些康复或休养选项？"], ["Options may range from physical and functional rehabilitation to structured recovery stays. We clarify whether a service is medical or non-medical, who is involved, and whether professional supervision is actually included.", "选项可能包括身体及功能康复，或有安排的恢复住宿。我们会确认服务属于医疗还是非医疗、由谁提供，以及是否包含专业监督。"], ["What does integrative care mean?", "整合照护是什么意思？"], ["Integrative care coordinates appropriate conventional and traditional approaches through qualified practitioners. It does not mean treatments are interchangeable or appropriate for everyone. Share relevant medicines and treatments with your healthcare professionals.", "整合照护由合格专业人员协调适当的常规与传统疗法，但不表示不同疗法可以互相替代或适合所有人。请向医疗专业人员说明正在使用的药物及接受的治疗。"],
  ["How can I request an estimate?", "如何申请费用估算？"], ["Submit the short inquiry form with your service interest, preferred city, and timeframe. We can then investigate an individualized estimate with inclusions, exclusions, conditions, currency, and validity clearly stated where available.", "填写简短咨询表，说明服务兴趣、首选城市和时间。我们可进一步了解个性化报价，并在信息可得时列明包含项、排除项、条件、币种和有效期。"], ["Are travel and accommodation included?", "报价包含交通和住宿吗？"], ["Not automatically. Any estimate should state whether transport, accommodation, meals, translation, coordination, or other travel services are included. We encourage comparing the total journey cost.", "不一定。报价应说明是否包含交通、住宿、餐食、翻译、协调或其他旅行服务。建议比较整个行程的总费用。"], ["Can treatments be guaranteed?", "能保证治疗效果吗？"], ["No. Eligibility, timelines, clinical outcomes, recovery, and satisfaction cannot be guaranteed. Suitability and treatment decisions remain with appropriately qualified healthcare professionals.", "不能。适用资格、时间、临床结果、恢复情况及满意度均无法保证。是否适合及治疗决定应由具备相应资质的医疗专业人员作出。"], ["Can you help with follow-up arrangements?", "可以协助安排后续服务吗？"], ["We can ask providers about records, expected follow-up, remote consultations where available, and what to plan after returning home. Local follow-up may still need to be arranged with your own healthcare professionals.", "我们可向服务方询问病历、预期复诊、可提供的远程咨询及回国后的安排。你仍可能需要与当地医疗专业人员安排后续照护。"], ["What should I know before traveling for surgery?", "手术赴华前应了解什么？"], ["Confirm clinical assessment requirements, provider qualifications, risks, expected stay, recovery restrictions, companion needs, records, complication plans, and follow-up before making travel commitments.", "作出旅行承诺前，确认临床评估要求、服务方资质、风险、预计停留时间、恢复限制、陪同需求、病历、并发症预案及后续安排。"], ["Do you provide emergency medical services?", "你们提供急救服务吗？"], ["No. China Care Guide is not an emergency service. Contact local emergency services or a qualified healthcare professional for urgent medical needs.", "不提供。China Care Guide 不是急救服务。如遇紧急医疗情况，请联系当地急救服务或合格医疗专业人员。"], ["Which Chinese cities can currently be supported?", "目前可了解哪些中国城市？"], ["Our current geographic areas of interest are Shanghai, Beijing, Changchun, Dalian, and Harbin. Services, providers, and appointment options are confirmed individually for each inquiry.", "目前关注的城市包括上海、北京、长春、大连和哈尔滨。每项咨询中的服务、服务方及预约情况均需逐项确认。"],
  ["Before you travel", "出发前准备"], ["Weather & clothing", "天气与衣物"], ["Transport & navigation", "交通与导航"], ["Connectivity", "网络与通讯"], ["Payments", "支付方式"], ["Food & preferences", "饮食与偏好"], ["Where to stay", "住宿选择"], ["Culture & communication", "文化与沟通"], ["Useful phrases", "常用短语"], ["Emergency preparation", "紧急情况准备"], ["Editable guide · verification required", "可编辑指南 · 发布前需核实"], ["PRACTICAL TRAVEL GUIDANCE", "实用旅行指南"], ["Your guide to everyday life in China.", "中国日常生活指南。"], ["Calm, practical preparation for the parts of the journey that may feel unfamiliar.", "为行程中可能陌生的环节做好从容、实用的准备。"], ["Travel requirements, payment methods, regulations, and emergency details should always be checked and updated before publication or travel.", "旅行要求、支付方式、法规和紧急信息应在发布或出行前核实更新。"], ["Practical information, not professional advice.", "实用信息，不构成专业建议。"], ["General travel guidance does not replace legal, immigration, financial, medical, or emergency advice.", "一般旅行指南不能替代法律、移民、财务、医疗或紧急情况建议。"], ["Explore the resource center", "浏览资源中心"],
  ["First name *", "名字 *"], ["Email address *", "电子邮箱 *"], ["Country of residence *", "居住国家/地区 *"], ["Service interest *", "感兴趣的服务 *"], ["Select a service", "请选择服务"], ["Approximate travel timeframe *", "预计出行时间 *"], ["Select a timeframe", "请选择时间范围"], ["Within 1–3 months", "1–3 个月内"], ["Within 3–6 months", "3–6 个月内"], ["Within 6–12 months", "6–12 个月内"], ["Just exploring", "目前仅了解"], ["Preferences and general question", "偏好与一般问题"], ["Optional", "选填"], ["Preferred city", "首选城市"], ["Preferred language", "首选语言"], ["Preferred contact method", "首选联系方法"], ["General question", "一般问题"], ["Please do not include medical records, passport information, or other sensitive details.", "请勿填写病历、护照信息或其他敏感资料。"], ["Send My Inquiry", "提交咨询"], ["Recording inquiry…", "正在提交咨询…"], ["No payment or medical documents are needed to submit an inquiry.", "提交咨询无需付款或提供医疗文件。"], ["About you and your inquiry", "关于你和你的咨询"], ["Required fields are marked *", "带 * 的为必填项"], ["INQUIRY RECEIVED", "已收到咨询"], ["Your inquiry was securely submitted for review. You do not need an account. Please do not email medical records or other sensitive documents unless a coordinator provides a secure method.", "你的咨询已安全提交，等待查看。无需创建账户。除非协调人员提供安全渠道，否则请勿通过电子邮件发送病历或其他敏感文件。"], ["Send another inquiry", "再提交一项咨询"], ["Privacy Policy", "隐私政策"], ["Terms of Service", "服务条款"], ["Medical Information Disclaimer", "医疗信息免责声明"], ["Language", "语言"], ["Unknown", "未知"], ["Open to Options", "暂不指定"], ["Shanghai", "上海"], ["Beijing", "北京"], ["Changchun", "长春"], ["Dalian", "大连"], ["Harbin", "哈尔滨"], ["Canada", "加拿大"], ["Ireland", "爱尔兰"], ["China", "中国"], ["Business telephone: pending provisioning and testing", "商务电话：开通并测试后公布"],
  ["INDIVIDUAL ESTIMATE", "个性化费用估算"], ["Clear before you decide", "决定前先了解清楚"], ["Confirmed after inquiry", "提交咨询后确认"], ["Named when verified", "核实后提供名称"], ["Amount & currency", "金额与币种"], ["Individually quoted", "按个案报价"], ["Included services", "包含的服务"], ["Excluded services", "不包含的服务"], ["Potential extras", "可能的额外费用"], ["Conditions & validity", "条件与有效期"], ["Request an Individual Estimate", "申请个性化费用估算"],
  ["MEDICAL TRAVEL PLANNING & CONCIERGE", "医疗旅行规划与协调"], ["Care planning is only one part of the ", "医疗规划只是整个行程的"], ["journey.", "一部分。"], ["From choosing a provider to navigating your visit, we help you understand the practical details of receiving healthcare in China. Your China Care Plan is individually coordinated around your stated service interests, destination, timing, and questions—without replacing professional clinical advice.", "从选择服务方到就诊导航，我们协助你了解赴华就医的实际安排。China Care Plan 会根据你说明的服务兴趣、目的地、时间及问题个性化协调，但不会替代专业临床建议。"], ["Build my care plan", "定制我的就医计划"], ["Healthcare providers", "医疗服务方"], ["Clinical assessment, diagnosis, treatment, consent, and medical follow-up.", "临床评估、诊断、治疗、知情同意及医疗随访。"], ["Administrative coordination, options research, estimates, schedules, and communication support.", "行政协调、选项调查、费用估算、日程及沟通支持。"], ["Travel & local support", "旅行及当地支持"], ["Transport, accommodation, interpretation, and local assistance when confirmed.", "经确认后协助安排交通、住宿、口译及当地支持。"],
  ["Chat on WhatsApp", "通过 WhatsApp 联系"], ["Close", "关闭"], ["Ask our guide", "咨询助手"], ["China Care Guide Assistant", "China Care Guide 助手"], ["AI guide · human support available", "AI 助手 · 可联系人工协调员"], ["AI-generated answers; your question is sent to our AI provider. Don't share medical records or sensitive health details.", "回答由 AI 生成；你的问题会发送给 AI 服务商。请勿分享病历或敏感健康信息。"], ["Welcome", "欢迎"], ["Ask about services, estimates, travel coordination, or how the inquiry process works.", "你可以询问服务、费用估算、旅行协调或咨询流程。"], ["Contact a human coordinator", "联系人工协调员"], ["Thinking…", "正在思考…"], ["General information · Not medical advice", "一般信息 · 不构成医疗建议"], ["Contact a human", "联系人工"], ["Ask a general question…", "请输入一般问题…"], ["Send question", "发送问题"], ["Costs & estimates", "费用与估算"], ["Travel planning", "旅行规划"], ["Talk to a person", "联系人工"], ["Dismiss", "关闭提示"], ["Not Sure", "还不确定"], ["Other", "其他"], ["Email", "电子邮件"], ["WhatsApp", "WhatsApp"], ["WeChat", "微信"], ["Mobile menu", "手机菜单"], ["Close menu", "关闭菜单"], ["Open menu", "打开菜单"], ["Dismiss", "关闭提示"],
  ["An international gateway and a current area of interest for individual inquiries.", "国际交通门户，也是目前逐项了解医疗咨询的重点城市。"], ["China's capital and a current focus city for individual inquiries.", "中国首都，也是目前重点了解医疗咨询的城市。"], ["A northeast China city within our current geographic areas of interest.", "目前关注的中国东北城市之一。"], ["A coastal destination within our current geographic areas of interest.", "目前关注的沿海目的地之一。"], ["A northeast China destination considered on an inquiry-by-inquiry basis.", "按具体咨询了解的中国东北目的地。"], ["Shanghai, China city view", "上海城市景观"], ["Beijing, China city view", "北京城市景观"], ["Changchun, China city view", "长春城市景观"], ["Dalian, China city view", "大连城市景观"], ["Harbin, China city view", "哈尔滨城市景观"],
]));

function translateNode(node: ReactNode, locale: Locale): ReactNode {
  if (locale !== "zh") return node;
  if (typeof node === "string") return zhText[node] ?? node;
  if (Array.isArray(node)) return node.map((child) => translateNode(child, locale));
  if (!isValidElement<{ children?: ReactNode; [key: string]: unknown }>(node)) return node;
  const props: Record<string, unknown> = {};
  if (node.type === "option" && node.props.value === undefined && typeof node.props.children === "string") props.value = node.props.children;
  for (const [key, value] of Object.entries(node.props)) {
    if (["aria-label", "aria-description", "placeholder", "alt", "title"].includes(key) && typeof value === "string") props[key] = zhText[value] ?? value;
  }
  return cloneElement(node, props, translateNode(node.props.children, locale));
}

function PublicSite({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const selectService = (service: string) => setForm((old) => ({ ...old, service }));
  const selectCity = (city: string) => setForm((old) => ({ ...old, city }));
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
    canonical.rel = "canonical";
    const englishUrl = new URL(localizedPath(window.location.pathname, "en"), window.location.origin);
    canonical.href = englishUrl.href;
    if (!canonical.parentNode) document.head.append(canonical);
  }, [locale]);

  const content = (
    <div className="site-shell" onClick={(event) => localizeLinkClick(event, locale)}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#top" onClick={closeMenu}><span className="brand-mark">CC</span><span>CHINA CARE<br />GUIDE</span></a>
          <nav aria-label="Primary navigation" className={menuOpen ? "nav-links open" : "nav-links"}>
            <a href="/services/health-screening-in-china" onClick={closeMenu}>Health Screening</a>
            <a href="/services/medical-aesthetics-in-china" onClick={closeMenu}>Medical Aesthetics</a>
            <a href="/services/rehabilitation-in-china" onClick={closeMenu}>Rehabilitation</a>
            <a href="/services/tcm-integrative-care" onClick={closeMenu}>TCM & Integrative Care</a>
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

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span />INTERNATIONAL HEALTHCARE COORDINATION</p>
              <h1>Explore healthcare in China, with <em>confidence</em> and clarity.</h1>
              <p className="hero-lede"><strong>From health screening and medical aesthetics to rehabilitation and integrative care, our international team helps you explore options, understand costs, and coordinate your healthcare journey in China.</strong></p>
              <p className="hero-personal">A private, one-to-one planning service tailored to your interests, preferred destination, timing, and practical needs. You choose what to share, and we help clarify the next steps.</p>
              <div className="hero-actions"><ButtonLink>Build My Care Plan</ButtonLink><ButtonLink href="/services/health-screening-in-china" secondary>Explore Health Screening</ButtonLink></div>
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
              <a className="additional-service-card" href="/services/specialist-surgical-care" onClick={() => selectService("Specialist & Surgical Care")}>
                <img src={images.specialist} alt="Medical specialist discussing care with a patient" loading="lazy" />
                <div className="additional-service-copy"><span>ADDITIONAL SERVICE</span><h3>Specialist & Surgical Care</h3><p>Explore selected consultations and planned care, subject to assessment, provider availability, and applicable requirements.</p><span className="additional-service-cta">Explore Planned Care <Icon name="arrow" size={18} /></span></div>
              </a>
              <a className="additional-service-card dental-service" href="/services/dental-care" onClick={() => selectService("Dental Care")}>
                <img src={images.dental} alt="Dentist providing a patient consultation" loading="lazy" />
                <div className="additional-service-copy"><span>ADDITIONAL SERVICE</span><h3>Dental Care</h3><p>Ask about dental consultations, restorative care, crowns, bridges, or implants where provider availability is confirmed.</p><ul><li><Icon name="check" size={14} />Likely number of visits</li><li><Icon name="check" size={14} />Multi-trip and follow-up considerations</li></ul><span className="additional-service-cta">Explore Dental Care <Icon name="arrow" size={18} /></span></div>
              </a>
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
              <div className="offices-note"><span>International presence</span><strong>Canada · Ireland · China</strong></div>
            </div>
            <InquiryForm form={form} setForm={setForm} locale={locale} />
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
            <div><h3>Services</h3><a href="/services/health-screening-in-china">Health Screening</a><a href="/services/medical-aesthetics-in-china">Medical Aesthetics</a><a href="/services/healthy-aging">Healthy Aging</a><a href="/services/rehabilitation-in-china">Rehabilitation & Recovery</a><a href="/services/tcm-integrative-care">TCM & Integrative Care</a><a href="/services/specialist-surgical-care">Specialist & Surgical Care</a><a href="/services/dental-care">Dental Care</a><a href="/services/medical-travel-concierge">Travel Concierge</a></div>
            <div><h3>Explore</h3><a href="/destinations/">Destinations</a><a href="/how-it-works">How It Works</a><a href="/resources/">Resources</a><a href="/about">About Us</a><a href="/contact">Contact</a></div>
            <div><h3>Legal</h3><a href={localizedPath("/privacy-policy", locale)}>Privacy Policy</a><a href={localizedPath("/terms-of-service", locale)}>Terms of Service</a><a href={localizedPath("/terms-of-service", locale, "", "#information-disclaimer")}>Medical Information Disclaimer</a><label className="footer-language">Language<select aria-label="Choose language" value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label></div>
          </div>
          <div className="disclaimer"><strong>Medical information disclaimer</strong><p>China Care Guide provides healthcare information and non-clinical coordination services. It is not a healthcare provider and does not diagnose or treat medical conditions. Service availability, eligibility, prices, and outcomes vary. Medical decisions should be made with qualified healthcare professionals. This service is not intended for medical emergencies.</p></div>
          <div className="pwa-help"><p className="eyebrow">TAKE IT WITH YOU</p><details><summary>Save China Care Guide to your home screen</summary><p>On iPhone or iPad, open this site in Safari, tap Share, then choose “Add to Home Screen.” On Android, open the browser menu and choose “Install app” or “Add to Home screen.”</p></details></div>
          <div className="copyright"><span>© 2026 China Care Guide.</span><span>Canada · Ireland · China</span></div>
        </div>
      </footer>
      <AssistantWidget locale={locale} />
    </div>
  );
  return translateNode(content, locale);
}

export default function App() {
  const path = window.location.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) return <Suspense fallback={<div className="route-loading">Loading private workspace…</div>}><Admin /></Suspense>;
  const route = parseLocalizedPath(path);
  if (!route.locale) return <LocaleRedirect />;
  if (route.path === "/privacy-policy") return <LegalPage locale={route.locale} kind="privacy-policy" />;
  if (route.path === "/terms-of-service") return <LegalPage locale={route.locale} kind="terms-of-service" />;
  if (route.path === "/services/medical-aesthetics-in-china") return <AestheticCarePage locale={route.locale} kind="medical-aesthetics-in-china" />;
  if (route.path === "/services/healthy-aging") return <AestheticCarePage locale={route.locale} kind="healthy-aging" />;
  if (route.path === "/services/health-screening-in-china") return <HealthScreeningPage locale={route.locale} />;
  const contentPage = getLocalizedContentPage(route.path, route.locale);
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
  const normalized = pathname.replace(/^\/(ko|ja|fr|es)(?=\/|$)/, "/");
  const path = normalized.replace(/^\/+/, "");
  return path ? `en/${path}` : "en/";
}
