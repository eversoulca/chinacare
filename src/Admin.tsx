import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";

type StaffRole = "admin" | "coordinator" | "read_only";
type InquiryStatus = "new" | "contacted" | "reviewing" | "waiting_on_customer" | "quote_preparation" | "quote_sent" | "closed";
type Inquiry = {
  id: string;
  created_at: string;
  first_name: string;
  email: string;
  country: string;
  service: string;
  destination: string;
  language: string;
  timeframe: string;
  contact_method: string;
  general_question: string;
  status: InquiryStatus;
};

const statusOptions: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "reviewing", label: "Reviewing" },
  { value: "waiting_on_customer", label: "Waiting on customer" },
  { value: "quote_preparation", label: "Preparing estimate" },
  { value: "quote_sent", label: "Estimate sent" },
  { value: "closed", label: "Closed" },
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function Login({ onSubmit, message, busy }: { onSubmit: (email: string) => Promise<void>; message: string; busy: boolean }) {
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(email.trim());
    setLinkSent(true);
  };

  return <main className="login-page">
    <section className="login-panel">
      <a className="admin-brand" href="/"><span>CC</span><strong>China Care Guide</strong></a>
      <div className="login-copy">
        <p className="admin-kicker">PRIVATE OPERATIONS PORTAL</p>
        <h1>Staff sign in</h1>
        <p>Sign in to review customer inquiries and coordinate next steps.</p>
      </div>
      {!supabase ? <div className="crm-error" role="alert">Staff access is not configured yet. Ask the project administrator to set the public Supabase URL and key for this Vercel project.</div> : <>
        <div className="prototype-warning"><span aria-hidden="true">ⓘ</span><p><strong>Invite-only access</strong>Only accounts invited and authorized by an administrator can open the inquiry inbox. Customers do not create accounts.</p></div>
        <form className="login-form" onSubmit={submit}>
          {message && <div className={linkSent && !message.startsWith("We") ? "demo-notice" : "crm-error"} role="status">{message}</div>}
          <label>Work email<input autoComplete="email" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <button className="crm-primary" disabled={busy} type="submit">{busy ? "Sending…" : "Email me a sign-in link"}</button>
        </form>
      </>}
      <p className="login-foot">Authorized team members only · Sign-in links expire</p>
    </section>
    <aside className="login-aside"><div><p className="admin-kicker">PRIVATE BY DESIGN</p><blockquote>Keep every inquiry clear, considered, and in the right hands.</blockquote></div><small>For coordination only. This workspace is not a clinical record system.</small></aside>
  </main>;
}

function StaffInbox({ session, role, onSignOut }: { session: Session; role: StaffRole; onSignOut: () => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const selected = inquiries.find((item) => item.id === selectedId) ?? inquiries[0] ?? null;
  const canUpdate = role === "admin" || role === "coordinator";

  const load = async (append = false) => {
    if (!supabase) return;
    setError("");
    append ? setLoadingMore(true) : setLoading(true);
    const start = append ? inquiries.length : 0;
    const { data, error: queryError } = await supabase
      .from("customer_inquiries")
      .select("id,created_at,first_name,email,country,service,destination,language,timeframe,contact_method,general_question,status")
      .order("created_at", { ascending: false })
      .range(start, start + 49);

    if (queryError) {
      setError("We could not load inquiries. Check that the staff access migration was applied and your account has a role.");
    } else {
      const rows = (data ?? []) as Inquiry[];
      setInquiries((previous) => append ? [...previous, ...rows] : rows);
      setHasMore((data?.length ?? 0) === 50);
      setSelectedId((previous) => previous ?? rows[0]?.id ?? null);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => inquiries.filter((item) => {
    const matchesQuery = `${item.first_name} ${item.email} ${item.country} ${item.service}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === "all" || item.status === statusFilter);
  }), [inquiries, query, statusFilter]);

  const updateStatus = async (status: InquiryStatus) => {
    if (!supabase || !selected || !canUpdate || status === selected.status) return;
    setSaving(true);
    setError("");
    setNotice("");
    const { error: updateError } = await supabase.from("customer_inquiries").update({ status }).eq("id", selected.id);
    if (updateError) setError("The status could not be updated. Please try again.");
    else {
      setInquiries((previous) => previous.map((item) => item.id === selected.id ? { ...item, status } : item));
      setNotice("Inquiry status updated.");
    }
    setSaving(false);
  };

  return <div className="crm-shell staff-shell">
    <aside className="crm-sidebar">
      <div className="sidebar-top"><a className="admin-brand" href="/"><span>CC</span><strong>CareDesk<small>China Care Guide</small></strong></a></div>
      <nav aria-label="Staff navigation"><button className="active" type="button"><span aria-hidden="true">▤</span><span>Customer inquiries</span></button></nav>
      <div className="sidebar-help"><span aria-hidden="true">♧</span><div><strong>Privacy first</strong><p>Use this inbox for coordination details only. Do not store clinical records.</p></div></div>
      <div className="sidebar-user"><span>{session.user.email?.slice(0, 1).toUpperCase() ?? "S"}</span><div><strong>{session.user.email}</strong><small>{role.replace("_", " ")}</small></div><button onClick={onSignOut} type="button">Sign out</button></div>
    </aside>
    <div className="crm-workspace">
      <header className="crm-topbar"><strong>Private inquiry inbox</strong><div><span className="role-chip">{role.replace("_", " ")}</span><button className="crm-secondary staff-signout" onClick={onSignOut} type="button">Sign out</button></div></header>
      <main className="crm-main">
        <div className="page-heading"><div><p className="admin-kicker">CUSTOMER INQUIRIES</p><h1>Inquiry inbox</h1><p>Review basic preferences and coordinate a human follow-up. This is not a medical record system.</p></div><button className="crm-secondary" disabled={loading} onClick={() => void load()} type="button">Refresh</button></div>
        {error && <div className="crm-error" role="alert">{error}</div>}
        {notice && <div className="demo-notice" role="status">{notice}</div>}
        <div className="inquiry-inbox-layout">
          <section className="crm-card inquiry-list-panel" aria-label="Inquiry list">
            <div className="card-heading"><div><p className="admin-kicker">INBOX</p><h2>{inquiries.length} loaded</h2></div></div>
            <div className="inquiry-filters"><label className="sr-only" htmlFor="inquiry-search">Search inquiries</label><input id="inquiry-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search inquiries" value={query} /><label className="sr-only" htmlFor="inquiry-status">Filter by status</label><select id="inquiry-status" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="all">All statuses</option>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            {loading ? <p className="inquiry-empty">Loading inquiries…</p> : filtered.length ? <div className="inquiry-list">{filtered.map((item) => <button aria-current={selected?.id === item.id ? "true" : undefined} className="inquiry-list-item" key={item.id} onClick={() => { setSelectedId(item.id); setNotice(""); }} type="button"><span className="inquiry-list-top"><strong>{item.first_name}</strong><small>{formatDate(item.created_at)}</small></span><span>{item.service} · {item.destination}</span><span className="crm-status blue">{statusOptions.find((status) => status.value === item.status)?.label ?? item.status}</span></button>)}</div> : <p className="inquiry-empty">No inquiries match this view.</p>}
            {hasMore && !loading && <button className="crm-tertiary load-more" disabled={loadingMore} onClick={() => void load(true)} type="button">{loadingMore ? "Loading…" : "Load more inquiries"}</button>}
          </section>
          <section className="crm-card inquiry-detail" aria-label="Selected inquiry">
            {selected ? <>
              <div className="card-heading"><div><p className="admin-kicker">INQUIRY DETAILS</p><h2>{selected.first_name}</h2></div><span className="crm-status blue">Consent recorded</span></div>
              <div className="inquiry-detail-body">
                <p className="inquiry-received">Received {formatDate(selected.created_at)}</p>
                <dl className="inquiry-detail-grid"><div><dt>Email</dt><dd><a href={`mailto:${encodeURIComponent(selected.email)}`}>{selected.email}</a></dd></div><div><dt>Country</dt><dd>{selected.country}</dd></div><div><dt>Service interest</dt><dd>{selected.service}</dd></div><div><dt>Preferred destination</dt><dd>{selected.destination}</dd></div><div><dt>Timeframe</dt><dd>{selected.timeframe}</dd></div><div><dt>Language</dt><dd>{selected.language}</dd></div><div><dt>Preferred contact</dt><dd>{selected.contact_method}</dd></div></dl>
                <div className="inquiry-question"><h3>General question</h3><p>{selected.general_question || "No question provided."}</p><small>Do not treat this as clinical history or request medical documents by ordinary email.</small></div>
                <label className="inquiry-status-control">Workflow status<select disabled={!canUpdate || saving} onChange={(event) => void updateStatus(event.target.value as InquiryStatus)} value={selected.status}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                {!canUpdate && <p className="inquiry-read-only">Read-only role: you can review but cannot change the workflow status.</p>}
              </div>
            </> : <p className="inquiry-empty">{loading ? "Loading…" : "Select an inquiry to review its details."}</p>}
          </section>
        </div>
      </main>
    </div>
  </div>;
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = existing ?? document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    if (!existing) document.head.append(meta);
    document.title = "Private Inquiry Inbox | China Care Guide";
  }, []);

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (alive) { setSession(data.session); setChecking(false); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setRole(null);
      setAuthorized(false);
      if (!nextSession) setChecking(false);
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabase || !session) { setRole(null); return; }
    let alive = true;
    setChecking(true);
    void supabase.from("staff_access").select("role").eq("user_id", session.user.id).maybeSingle().then(async ({ data, error }) => {
      if (!alive) return;
      const foundRole = data?.role as StaffRole | undefined;
      if (error || !foundRole || !["admin", "coordinator", "read_only"].includes(foundRole)) {
        setAuthorized(false);
        setMessage("This account is not authorized for the staff inbox. Ask an administrator to grant access.");
        await supabase.auth.signOut();
      } else {
        setRole(foundRole);
        setAuthorized(true);
        setMessage("");
      }
      setChecking(false);
    });
    return () => { alive = false; };
  }, [session]);

  const sendLink = async (email: string) => {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin` },
    });
    setMessage(error ? "We could not send a sign-in link. Confirm that this email is invited and try again." : "If this email is invited, a secure sign-in link will arrive shortly.");
    setBusy(false);
  };

  const signOut = async () => { await supabase?.auth.signOut(); setSession(null); setRole(null); setAuthorized(false); };
  if (checking) return <div className="route-loading">Checking staff access…</div>;
  if (!session || !authorized || !role) return <Login busy={busy} message={message} onSubmit={sendLink} />;
  return <StaffInbox onSignOut={() => void signOut()} role={role} session={session} />;
}
