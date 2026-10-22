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
type SocialDraft = { id: string; created_at: string; topic: string; content: string; status: "draft" | "approved" | "rejected" | "publishing" | "published"; model: string; published_post_id?: string | null };

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

function Login({ onSubmit, onForgotPassword, message, busy }: { onSubmit: (email: string, password: string) => Promise<void>; onForgotPassword: (email: string) => Promise<void>; message: string; busy: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(email.trim(), password);
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
          {message && <div className={message.startsWith("We ") || message.startsWith("That password") ? "crm-error" : "demo-notice"} role="status">{message}</div>}
          <label>Work email<input autoComplete="email" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label>Password<input autoComplete="current-password" name="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          <button className="crm-primary" disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in"}</button>
          <button className="text-action" disabled={busy || !email.trim()} onClick={() => void onForgotPassword(email.trim())} type="button">Forgot password?</button>
        </form>
      </>}
      <p className="login-foot">Authorized team members only</p>
    </section>
    <aside className="login-aside"><div><p className="admin-kicker">PRIVATE BY DESIGN</p><blockquote>Keep every inquiry clear, considered, and in the right hands.</blockquote></div><small>For coordination only. This workspace is not a clinical record system.</small></aside>
  </main>;
}

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    if (password !== confirmation) { setMessage("The passwords do not match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? "We could not update the password. Please request a new recovery email." : "Password updated. You can now sign in.");
    setBusy(false);
    if (!error) window.setTimeout(() => window.location.assign("/admin"), 1200);
  };
  return <main className="login-page"><section className="login-panel">
    <a className="admin-brand" href="/"><span>CC</span><strong>China Care Guide</strong></a>
    <div className="login-copy"><p className="admin-kicker">ACCOUNT SECURITY</p><h1>Set a new password</h1><p>Choose a password for your staff account.</p></div>
    <form className="login-form" onSubmit={submit}>
      {message && <div className={message.startsWith("We ") || message.startsWith("The ") ? "crm-error" : "demo-notice"} role="status">{message}</div>}
      <label>New password<input autoComplete="new-password" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
      <label>Confirm new password<input autoComplete="new-password" minLength={8} onChange={(event) => setConfirmation(event.target.value)} required type="password" value={confirmation} /></label>
      <button className="crm-primary" disabled={busy} type="submit">{busy ? "Updating…" : "Save password"}</button>
    </form>
  </section><aside className="login-aside"><div><p className="admin-kicker">PRIVATE BY DESIGN</p><blockquote>Keep every inquiry clear, considered, and in the right hands.</blockquote></div><small>For coordination only. This workspace is not a clinical record system.</small></aside></main>;
}

function StaffInbox({ session, role, onSignOut }: { session: Session; role: StaffRole; onSignOut: () => void }) {
  const [section, setSection] = useState<"inquiries" | "content">("inquiries");
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
      <nav aria-label="Staff navigation"><button className={section === "inquiries" ? "active" : ""} onClick={() => setSection("inquiries")} type="button"><span aria-hidden="true">▤</span><span>Customer inquiries</span></button><button className={section === "content" ? "active" : ""} onClick={() => setSection("content")} type="button"><span aria-hidden="true">✎</span><span>Social content</span></button></nav>
      <div className="sidebar-help"><span aria-hidden="true">♧</span><div><strong>Privacy first</strong><p>Use this inbox for coordination details only. Do not store clinical records.</p></div></div>
      <div className="sidebar-user"><span>{session.user.email?.slice(0, 1).toUpperCase() ?? "S"}</span><div><strong>{session.user.email}</strong><small>{role.replace("_", " ")}</small></div><button onClick={onSignOut} type="button">Sign out</button></div>
    </aside>
    <div className="crm-workspace">
      <header className="crm-topbar"><strong>{section === "inquiries" ? "Private inquiry inbox" : "Social content review"}</strong><div><span className="role-chip">{role.replace("_", " ")}</span><button className="crm-secondary staff-signout" onClick={onSignOut} type="button">Sign out</button></div></header>
      {section === "content" ? <SocialContent session={session} role={role} /> : <main className="crm-main">
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
      </main>}
    </div>
  </div>;
}

const socialTopics = [
  "Questions to ask before choosing a provider",
  "What a transparent estimate should include",
  "Planning language support for a healthcare visit",
  "Preparing for follow-up after returning home",
  "Practical medical travel planning checklist",
  "How to compare service inclusions and exclusions",
  "A question to ask about medical records",
];

function SocialContent({ session, role }: { session: Session; role: StaffRole }) {
  const [drafts, setDrafts] = useState<SocialDraft[]>([]);
  const [topic, setTopic] = useState(socialTopics[0]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [xUsername, setXUsername] = useState("");
  const [xConnected, setXConnected] = useState(false);
  const [xBusy, setXBusy] = useState(false);
  const canEdit = role === "admin" || role === "coordinator";

  const loadDrafts = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("social_drafts").select("id,created_at,topic,content,status,model").order("created_at", { ascending: false }).limit(50);
    if (error) setMessage("Could not load drafts. Apply the social drafts migration in Supabase first.");
    else setDrafts((data ?? []) as SocialDraft[]);
    setLoading(false);
  };
  const loadXStatus = async () => {
    try {
      const response = await fetch("/api/x-status", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const result = await response.json() as { connected?: boolean; username?: string };
      setXConnected(Boolean(result.connected)); setXUsername(result.username || "");
    } catch { setXConnected(false); }
  };
  useEffect(() => {
    void loadDrafts(); void loadXStatus();
    const result = new URLSearchParams(window.location.search).get("x");
    if (result === "connected") setMessage("X account connected. Approved drafts can now be published after your final click.");
    if (result === "error") setMessage("X account connection did not complete. Check app settings and authorized account, then try again.");
    if (result) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const generate = async () => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/generate-social-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ topic }),
      });
      const result = await response.json() as { draft?: SocialDraft; message?: string };
      if (!response.ok || !result.draft) setMessage(result.message || "Draft generation failed.");
      else { setDrafts((current) => [result.draft!, ...current]); setMessage("Draft created. Review it before posting."); }
    } catch { setMessage("Draft generation is temporarily unavailable."); }
    setBusy(false);
  };

  const review = async (draft: SocialDraft, status: "approved" | "rejected") => {
    if (!supabase || !canEdit) return;
    const { error } = await supabase.from("social_drafts").update({ status, reviewed_by: session.user.id, reviewed_at: new Date().toISOString() }).eq("id", draft.id);
    if (error) setMessage("Could not update this draft. Check that the social drafts migration is installed.");
    else { setDrafts((items) => items.map((item) => item.id === draft.id ? { ...item, status } : item)); setMessage(status === "approved" ? "Marked approved. You can now copy it to X." : "Draft rejected."); }
  };

  const copyDraft = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setMessage("Copied. Review and publish manually in X.");
  };

  const connectX = async () => {
    setXBusy(true); setMessage("");
    try {
      const response = await fetch("/api/x-connect-start", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
      const result = await response.json() as { authorizeUrl?: string; message?: string };
      if (!response.ok || !result.authorizeUrl) setMessage(result.message || "Could not start X authorization.");
      else window.location.assign(result.authorizeUrl);
    } catch { setMessage("Could not start X authorization."); }
    setXBusy(false);
  };

  const publishToX = async (draft: SocialDraft) => {
    if (!window.confirm("Publish this approved post to X now? This action may incur an X API charge.")) return;
    setXBusy(true); setMessage("");
    setDrafts((items) => items.map((item) => item.id === draft.id ? { ...item, status: "publishing" } : item));
    try {
      const response = await fetch("/api/x-publish", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ id: draft.id }) });
      const result = await response.json() as { username?: string; postId?: string; message?: string };
      if (!response.ok) {
        setMessage(result.message || "Could not publish the post.");
        if (result.message?.includes("available to retry") || result.message?.includes("Connect the approved X account")) setDrafts((items) => items.map((item) => item.id === draft.id ? { ...item, status: "approved" } : item));
      } else {
        setDrafts((items) => items.map((item) => item.id === draft.id ? { ...item, status: "published", published_post_id: result.postId } : item));
        setMessage(`Published to @${result.username}.`);
      }
    } catch {
      setMessage("Publishing result is unknown. Check the X account before trying again; this draft stays locked to avoid a duplicate.");
    }
    await loadXStatus(); setXBusy(false);
  };

  return <main className="crm-main">
    <div className="page-heading"><div><p className="admin-kicker">EDITORIAL WORKFLOW</p><h1>Social content</h1><p>Generate educational X drafts from approved service information. Every post stays private until you review it.</p></div><button className="crm-secondary" disabled={loading} onClick={() => void loadDrafts()} type="button">Refresh</button></div>
    <div className="prototype-warning"><span aria-hidden="true">ⓘ</span><p><strong>Human review required</strong>Drafts are saved for review and are never published automatically. Do not use this tool for personal health details or clinical advice.</p></div>
    <section className="crm-card x-connect-card"><div><p className="admin-kicker">X ACCOUNT</p><strong>{xConnected ? `Connected as @${xUsername}` : "Not connected"}</strong><p>{xConnected ? "Only approved drafts can be sent. Each post needs your final confirmation." : "Connect the account that owns @iecnvan. X Developer API credentials must be configured first."}</p></div><button className="crm-secondary" disabled={!canEdit || xBusy} onClick={() => void connectX()} type="button">{xBusy ? "Working…" : xConnected ? "Reconnect X" : "Connect X"}</button></section>
    {message && <div className={message.startsWith("Could") || message.includes("failed") || message.includes("unavailable") ? "crm-error" : "demo-notice"} role="status">{message}</div>}
    {canEdit && <section className="crm-card social-generate"><div className="card-heading"><div><p className="admin-kicker">NEW DRAFT</p><h2>Generate an educational post</h2></div></div><div className="social-controls"><label htmlFor="social-topic">Choose an approved topic</label><select id="social-topic" onChange={(event) => setTopic(event.target.value)} value={topic}>{socialTopics.map((item) => <option key={item}>{item}</option>)}</select><button className="crm-primary" disabled={busy} onClick={() => void generate()} type="button">{busy ? "Generating…" : "Generate draft"}</button></div><p className="social-note">Uses the server-side SiliconFlow model key. Each click makes one billable model request.</p></section>}
    <section className="social-drafts"><div className="card-heading"><div><p className="admin-kicker">REVIEW QUEUE</p><h2>Recent drafts</h2></div></div>{loading ? <p className="inquiry-empty">Loading drafts…</p> : drafts.length ? drafts.map((draft) => <article className="crm-card social-draft" key={draft.id}><div className="social-draft-head"><div><p className="admin-kicker">{draft.topic}</p><small>{formatDate(draft.created_at)} · {draft.model}</small></div><span className={`crm-status ${draft.status === "approved" || draft.status === "published" ? "green" : draft.status === "rejected" ? "red" : "blue"}`}>{draft.status}</span></div><p className="social-draft-copy">{draft.content}</p><div className="social-draft-actions">{canEdit && draft.status === "draft" && <><button className="crm-secondary" onClick={() => void review(draft, "rejected")} type="button">Reject</button><button className="crm-secondary" onClick={() => void review(draft, "approved")} type="button">Approve</button></>}{draft.status === "approved" && <><button className="crm-primary" disabled={xBusy || !xConnected || !canEdit} onClick={() => void publishToX(draft)} type="button">Publish to X</button><button className="crm-secondary" onClick={() => void copyDraft(draft.content)} type="button">Copy post</button><a className="crm-secondary social-open-x" href="https://x.com/compose/post" rel="noreferrer" target="_blank">Open X</a></>}{draft.status === "published" && draft.published_post_id && <a className="crm-secondary social-open-x" href={`https://x.com/${xUsername || "iecnvan"}/status/${draft.published_post_id}`} rel="noreferrer" target="_blank">View on X</a>}</div></article>) : <div className="crm-card"><p className="inquiry-empty">No drafts yet. Choose a topic above to create the first one.</p></div>}</section>
  </main>;
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isPasswordReset = window.location.pathname === "/admin/reset-password";
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
    if (isPasswordReset) return;
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
  }, [isPasswordReset]);

  useEffect(() => {
    if (isPasswordReset) return;
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
  }, [isPasswordReset, session]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? "That password could not sign you in. Check the email and password, then try again." : "Signing in…");
    setBusy(false);
  };

  const sendPasswordReset = async (email: string) => {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/reset-password` });
    setMessage(error ? "We could not send a password reset email. Check the address and try again." : "If this account exists, a password reset email has been sent.");
    setBusy(false);
  };

  const signOut = async () => { await supabase?.auth.signOut(); setSession(null); setRole(null); setAuthorized(false); };
  if (isPasswordReset) return <PasswordReset />;
  if (checking) return <div className="route-loading">Checking staff access…</div>;
  if (!session || !authorized || !role) return <Login busy={busy} message={message} onForgotPassword={sendPasswordReset} onSubmit={signIn} />;
  return <StaffInbox onSignOut={() => void signOut()} role={role} session={session} />;
}
