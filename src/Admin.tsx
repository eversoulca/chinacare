import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type View = "dashboard" | "leads" | "inbox" | "quotes" | "tasks" | "catalogue" | "knowledge" | "analytics" | "providers" | "settings";
type IconName = "grid" | "users" | "file" | "check" | "chart" | "building" | "settings" | "search" | "bell" | "plus" | "arrow" | "clock" | "mail" | "phone" | "shield" | "menu" | "close";

function AdminIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    file: <><path d="M6 2h9l4 4v16H6z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>,
    check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="10" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 4 3 5-7" /></>,
    building: <><path d="M3 21h18M6 21V5l6-3 6 3v16M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3v-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[name]}</svg>;
}

const navItems: { id: View; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "Overview", icon: "grid" },
  { id: "leads", label: "Customers & leads", icon: "users" },
  { id: "inbox", label: "Conversation inbox", icon: "mail" },
  { id: "quotes", label: "Quotes", icon: "file" },
  { id: "tasks", label: "Tasks & reminders", icon: "check" },
  { id: "catalogue", label: "Service catalogue", icon: "building" },
  { id: "knowledge", label: "AI knowledge", icon: "file" },
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "providers", label: "Provider directory", icon: "building" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const leads = [
  { id: "INQ-1048", name: "Maya Thompson", country: "Canada", service: "Health Screening", city: "Shanghai", source: "Organic search", owner: "A. Chen", status: "Quote Sent", response: "Awaiting Response", last: "12 Jun 2025", next: "14 Jun 2025", privacy: "Inquiry consent recorded" },
  { id: "INQ-1047", name: "Daniel Murphy", country: "Ireland", service: "Dental Care", city: "Beijing", source: "Referral", owner: "L. Wang", status: "Estimate Requested", response: "Interested", last: "11 Jun 2025", next: "13 Jun 2025", privacy: "Inquiry consent recorded" },
  { id: "INQ-1046", name: "Priya Shah", country: "United Kingdom", service: "Medical Aesthetics", city: "Open to options", source: "Organic search", owner: "A. Chen", status: "Requirements Clarified", response: "Question Received", last: "10 Jun 2025", next: "12 Jun 2025", privacy: "Inquiry consent recorded" },
  { id: "INQ-1045", name: "Owen Brooks", country: "United States", service: "Rehabilitation & Recovery", city: "Dalian", source: "Direct", owner: "Unassigned", status: "New Inquiry", response: "Awaiting Response", last: "9 Jun 2025", next: "Overdue", privacy: "Inquiry consent recorded" },
  { id: "INQ-1044", name: "Sofia Rossi", country: "Italy", service: "TCM & Integrative Care", city: "Harbin", source: "Resource article", owner: "L. Wang", status: "On Hold", response: "Timing Concern", last: "5 Jun 2025", next: "1 Jul 2025", privacy: "Inquiry consent recorded" },
];

const quoteRecords = [
  { id: "QT-2084", customer: "Maya Thompson", inquiry: "INQ-1048", service: "Health Screening", city: "Shanghai", provider: "Provider A — identity pending verification", amount: "CNY 8,600", fee: "Coordination fee: not yet added", version: "v2", received: "10 Jun 2025", sent: "12 Jun 2025", expires: "26 Jun 2025", status: "Sent", response: "Awaiting Response" },
  { id: "QT-2083", customer: "Daniel Murphy", inquiry: "INQ-1047", service: "Dental Care", city: "Beijing", provider: "Provider B — identity pending verification", amount: "USD 4,200", fee: "Coordination fee: CAD 280", version: "v1", received: "11 Jun 2025", sent: "Not sent", expires: "Not specified", status: "Internal Review", response: "Interested" },
  { id: "QT-2079", customer: "Sofia Rossi", inquiry: "INQ-1044", service: "TCM & Integrative Care", city: "Harbin", provider: "Provider C — placeholder only", amount: "EUR 1,750", fee: "Coordination fee: EUR 160", version: "v3", received: "29 May 2025", sent: "30 May 2025", expires: "15 Jun 2025", status: "Customer Responded", response: "Timing Concern" },
];

const tasksSeed = [
  { id: 1, title: "Follow up on unanswered quote", customer: "Maya Thompson", quote: "QT-2084", owner: "A. Chen", due: "Today, 3:00 PM", priority: "High", last: "12 Jun", action: "Confirm whether clarification is needed", done: false },
  { id: 2, title: "Obtain revised provider estimate", customer: "Daniel Murphy", quote: "QT-2083", owner: "L. Wang", due: "Today, 5:00 PM", priority: "High", last: "11 Jun", action: "Clarify material and follow-up exclusions", done: false },
  { id: 3, title: "Review new inquiry", customer: "Owen Brooks", quote: "No quote", owner: "Unassigned", due: "Overdue by 1 day", priority: "High", last: "9 Jun", action: "Assign coordinator and make first contact", done: false },
  { id: 4, title: "Check approaching expiration", customer: "Sofia Rossi", quote: "QT-2079", owner: "L. Wang", due: "Tomorrow", priority: "Medium", last: "5 Jun", action: "Ask whether timing has changed", done: false },
];

function Status({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue" }) {
  return <span className={`crm-status ${tone}`}>{children}</span>;
}

function DemoNotice() {
  return <div className="demo-notice"><strong>Fictional demonstration data</strong><span>This prototype does not store records, send email, place calls, or connect to providers.</span></div>;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    if (!form.get("email") || !form.get("password")) return setError("Enter the demonstration email and password to continue.");
    onLogin();
  };
  return (
    <main className="login-page">
      <section className="login-panel">
        <a className="admin-brand" href="/"><span>CC</span><strong>China Care Guide</strong></a>
        <div className="login-copy">
          <p className="admin-kicker">PRIVATE OPERATIONS PORTAL</p>
          <h1>Sign in to CareDesk</h1>
          <p>Manage inquiries, provider estimates, quotations, and follow-up actions in one focused workspace.</p>
        </div>
        <div className="prototype-warning"><AdminIcon name="shield" /><p><strong>Prototype access only</strong>This interface demonstrates access control but is not a production authentication system.</p></div>
        <form className="login-form" onSubmit={submit}>
          {error && <div className="crm-error" role="alert">{error}</div>}
          <label>Work email<input defaultValue="demo@chinacareguide.example" name="email" type="email" /></label>
          <label>Password<input defaultValue="prototype" name="password" type="password" /></label>
          <div className="login-options"><label><input type="checkbox" /> Keep me signed in on this device</label><button type="button">Forgot password?</button></div>
          <button className="crm-primary" type="submit">Sign in to CareDesk <AdminIcon name="arrow" /></button>
        </form>
        <p className="login-foot">Authorized team members only · Role shown after sign-in</p>
      </section>
      <aside className="login-aside"><div><p className="admin-kicker">DESIGNED AROUND THE NEXT ACTION</p><blockquote>Never lose track of a potential customer. Know what happened to every quotation. Know what to do next.</blockquote></div><small>Internal operations prototype · Privacy and cross-border transfer review required before production use.</small></aside>
    </main>
  );
}

function MetricCard({ label, value, detail, tone = "" }: { label: string; value: string; detail: string; tone?: string }) {
  return <article className={`metric-card ${tone}`}><div><span>{label}</span><strong>{value}</strong></div><p>{detail}</p></article>;
}

function Dashboard({ go }: { go: (view: View) => void }) {
  return <>
    <PageHeader eyebrow="Thursday, 12 June" title="Good morning, Alex." text="Here is what needs attention across the demonstration pipeline today." action={<button className="crm-primary" onClick={() => go("leads")}><AdminIcon name="plus" /> Add inquiry</button>} />
    <DemoNotice />
    <section className="metrics-grid">
      <MetricCard label="New inquiries" value="6" detail="2 unassigned" tone="blue" />
      <MetricCard label="Follow-up due" value="9" detail="3 overdue" tone="red" />
      <MetricCard label="Awaiting response" value="7" detail="2 expire this week" tone="amber" />
      <MetricCard label="Awaiting provider" value="4" detail="Oldest: 3 days" />
      <MetricCard label="Converted" value="3" detail="This demo period" tone="green" />
      <MetricCard label="Lost / inactive" value="5" detail="Reason recorded for 4" />
    </section>
    <div className="dashboard-grid">
      <section className="crm-card next-actions">
        <div className="card-heading"><div><p className="admin-kicker">PRIORITIZED</p><h2>Next actions</h2></div><button onClick={() => go("tasks")}>View all tasks <AdminIcon name="arrow" /></button></div>
        {tasksSeed.slice(0, 4).map((task, index) => <article className="action-row" key={task.id}><span className="action-index">{index + 1}</span><div><strong>{task.title}</strong><p>{task.customer} · {task.quote}</p></div><div className="action-meta"><Status tone={task.due.includes("Overdue") ? "red" : index < 2 ? "amber" : "neutral"}>{task.due}</Status><small>{task.owner}</small></div><button aria-label={`Open ${task.title}`} onClick={() => go("tasks")}><AdminIcon name="arrow" /></button></article>)}
      </section>
      <aside className="crm-card activity-card">
        <div className="card-heading"><div><p className="admin-kicker">LATEST</p><h2>Activity summary</h2></div></div>
        <div className="timeline compact">
          <div><span /><p><strong>Quote v2 sent</strong>Maya Thompson · 18 min ago</p></div>
          <div><span /><p><strong>Provider estimate received</strong>Daniel Murphy · 1 hr ago</p></div>
          <div><span /><p><strong>Question recorded</strong>Priya Shah · 2 hrs ago</p></div>
          <div><span /><p><strong>Inquiry assigned to A. Chen</strong>Health Screening · 3 hrs ago</p></div>
        </div>
        <div className="activity-note"><AdminIcon name="clock" /><p><strong>3 records exceed follow-up date</strong>Review overdue tasks before preparing new outreach.</p></div>
      </aside>
    </div>
    <section className="crm-card pipeline-card">
      <div className="card-heading"><div><p className="admin-kicker">PIPELINE AT A GLANCE</p><h2>Open opportunities</h2></div><small>Demo period · 36 total</small></div>
      <div className="pipeline">
        {[["New", "6"], ["Contacted", "5"], ["Clarified", "4"], ["Matching", "5"], ["Estimate", "4"], ["Quote sent", "7"], ["Follow-up", "5"]].map(([label, value], index) => <div key={label}><span className={`pipeline-fill p${index + 1}`} /><strong>{value}</strong><small>{label}</small></div>)}
      </div>
    </section>
  </>;
}

function PageHeader({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: ReactNode }) {
  return <header className="page-heading"><div><p className="admin-kicker">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>{action}</header>;
}

function Leads() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(leads[0]);
  const [status, setStatus] = useState(selected.status);
  const filtered = useMemo(() => leads.filter((lead) => `${lead.name} ${lead.id} ${lead.service} ${lead.country}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <>
    <PageHeader eyebrow="CUSTOMERS & LEADS" title="Every inquiry, clearly owned." text="Search, qualify, assign, and move inquiries forward without storing clinical records." action={<button className="crm-primary"><AdminIcon name="plus" /> Add inquiry</button>} />
    <DemoNotice />
    <div className="toolbar">
      <label className="search-box"><AdminIcon name="search" /><span className="sr-only">Search inquiries</span><input placeholder="Search name, ID, service, or country" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      <select aria-label="Filter by status"><option>All statuses</option><option>New Inquiry</option><option>Quote Sent</option><option>Follow-up</option></select>
      <select aria-label="Filter by coordinator"><option>All coordinators</option><option>A. Chen</option><option>L. Wang</option><option>Unassigned</option></select>
      <select aria-label="Sort inquiries"><option>Next follow-up</option><option>Newest inquiry</option><option>Last contact</option></select>
    </div>
    <div className="records-layout">
      <section className="crm-card table-card">
        <div className="table-scroll"><table><thead><tr><th>Customer</th><th>Service</th><th>Status</th><th>Coordinator</th><th>Next action</th></tr></thead><tbody>
          {filtered.map((lead) => <tr className={selected.id === lead.id ? "selected" : ""} key={lead.id} onClick={() => { setSelected(lead); setStatus(lead.status); }}><td><button className="customer-cell"><span>{lead.name.split(" ").map((part) => part[0]).join("")}</span><strong>{lead.name}<small>{lead.id} · {lead.country}</small></strong></button></td><td>{lead.service}<small>{lead.city}</small></td><td><Status tone={lead.status === "New Inquiry" ? "blue" : lead.status === "On Hold" ? "neutral" : "amber"}>{lead.status}</Status><small>{lead.response}</small></td><td>{lead.owner}</td><td className={lead.next === "Overdue" ? "danger-text" : ""}>{lead.next}</td></tr>)}
        </tbody></table></div>
      </section>
      <aside className="crm-card detail-panel">
        <div className="detail-title"><div className="large-avatar">{selected.name.split(" ").map((part) => part[0]).join("")}</div><div><small>{selected.id}</small><h2>{selected.name}</h2><p>{selected.country} · English</p></div><button aria-label="Close details">×</button></div>
        <div className="detail-actions"><button className="crm-primary"><AdminIcon name="mail" /> Email</button><button className="crm-secondary"><AdminIcon name="plus" /> Add note</button></div>
        <div className="detail-section"><h3>Lead management</h3><label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}>{["New Inquiry", "Contacted", "Requirements Clarified", "Provider Matching", "Estimate Requested", "Quote Sent", "Follow-up", "Converted", "Lost", "On Hold"].map((item) => <option key={item}>{item}</option>)}</select></label><div className="detail-grid"><div><span>Assigned</span><strong>{selected.owner}</strong></div><div><span>Next follow-up</span><strong>{selected.next}</strong></div><div><span>Source</span><strong>{selected.source}</strong></div><div><span>Last contact</span><strong>{selected.last}</strong></div></div></div>
        <div className="detail-section"><h3>Inquiry summary</h3><dl><div><dt>Service</dt><dd>{selected.service}</dd></div><div><dt>Destination</dt><dd>{selected.city}</dd></div><div><dt>Email</dt><dd>demo.customer@example.com</dd></div><div><dt>Privacy</dt><dd><Status tone="green">{selected.privacy}</Status></dd></div></dl></div>
        <div className="detail-section"><h3>Activity timeline</h3><div className="timeline"><div><span /><p><strong>Follow-up task created</strong>Due {selected.next} · A. Chen</p></div><div><span /><p><strong>Requirements note added</strong>General preferences only · {selected.last}</p></div><div><span /><p><strong>Inquiry received</strong>Acknowledgment queued in prototype</p></div></div></div>
        <p className="sensitive-note"><AdminIcon name="shield" /> Do not add diagnoses, passport details, clinical records, or sensitive documents.</p>
      </aside>
    </div>
  </>;
}

function Quotes() {
  const [selected, setSelected] = useState(quoteRecords[0]);
  const [response, setResponse] = useState(selected.response);
  const [sendOpen, setSendOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return <>
    <PageHeader eyebrow="QUOTE MANAGEMENT" title="Know exactly what happened to every quote." text="Provider estimates, coordination fees, versions, and customer responses remain distinct and reviewable." action={<button className="crm-primary"><AdminIcon name="plus" /> New quote</button>} />
    <DemoNotice />
    <div className="quote-layout">
      <section className="crm-card quote-list">
        <div className="toolbar embedded"><label className="search-box"><AdminIcon name="search" /><input aria-label="Search quotes" placeholder="Search quotes" /></label><select aria-label="Quote status"><option>All statuses</option><option>Sent</option><option>Internal Review</option></select></div>
        {quoteRecords.map((quote) => <button className={selected.id === quote.id ? "quote-row selected" : "quote-row"} key={quote.id} onClick={() => { setSelected(quote); setResponse(quote.response); setSent(false); }}><div><strong>{quote.customer}</strong><small>{quote.id} · {quote.version} · {quote.service}</small></div><div><strong>{quote.amount}</strong><Status tone={quote.status === "Sent" ? "blue" : "amber"}>{quote.status}</Status></div></button>)}
      </section>
      <section className="quote-detail">
        <div className="crm-card quote-summary">
          <div className="quote-top"><div><p className="admin-kicker">{selected.id} · {selected.version}</p><h2>{selected.customer}</h2><p>{selected.service} · {selected.city}</p></div><div><Status tone="blue">{selected.status}</Status><strong>{selected.amount}</strong><small>Provider-supplied estimate</small></div></div>
          <div className="quote-facts"><div><span>Provider</span><strong>{selected.provider}</strong></div><div><span>Received</span><strong>{selected.received}</strong></div><div><span>Sent</span><strong>{selected.sent}</strong></div><div><span>Expires</span><strong>{selected.expires}</strong></div></div>
          <div className="fee-separation"><AdminIcon name="file" /><div><span>Company coordination fee</span><strong>{selected.fee.replace("Coordination fee: ", "")}</strong><small>Shown separately; no currency conversion implied.</small></div></div>
          <div className="inclusion-grid"><div><h3>Included services</h3><ul><li>Provider consultation and listed service package</li><li>Provider-issued written summary where available</li></ul></div><div><h3>Excluded services</h3><ul><li>Travel, accommodation, and local transport</li><li>Additional examinations or follow-up</li></ul></div><div><h3>Potential additional charges</h3><ul><li>Services recommended after provider review</li><li>Translation beyond stated allowance</li></ul></div></div>
          <div className="response-editor"><div><span>Customer response</span><strong>Manual update only</strong></div><select value={response} onChange={(e) => setResponse(e.target.value)}>{["Awaiting Response", "Interested", "Question Received", "Alternative Requested", "Price Concern", "Provider Concern", "Timing Concern", "Accepted", "Declined", "Unresponsive", "On Hold"].map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="quote-actions"><button className="crm-primary" onClick={() => setSendOpen(true)}><AdminIcon name="mail" /> Review & send email</button><button className="crm-secondary">Create revised version</button><button className="crm-tertiary">Preview customer page</button></div>
        </div>
        <div className="quote-bottom">
          <section className="crm-card"><div className="card-heading"><div><p className="admin-kicker">IMMUTABLE HISTORY</p><h2>Version history</h2></div></div><div className="version-row current"><span>v2</span><div><strong>Current · {selected.amount}</strong><p>Inclusions clarified; expiration date updated.</p></div><small>12 Jun</small></div><div className="version-row"><span>v1</span><div><strong>Previous · CNY 8,200</strong><p>Original provider estimate preserved.</p></div><small>10 Jun</small></div></section>
          <section className="crm-card"><div className="card-heading"><div><p className="admin-kicker">FOLLOW-UP</p><h2>Communication</h2></div></div><div className="timeline compact"><div><span /><p><strong>{sent ? "Prototype send recorded" : "Quote sent to customer"}</strong>{sent ? "No email was actually delivered" : selected.sent}</p></div><div><span /><p><strong>Estimate received</strong>{selected.received}</p></div></div><button className="text-action">View full communication history</button></section>
        </div>
      </section>
    </div>
    {sendOpen && <div className="modal-backdrop" role="presentation"><section aria-labelledby="send-title" aria-modal="true" className="crm-modal" role="dialog"><div className="modal-head"><div><p className="admin-kicker">STAFF APPROVAL REQUIRED</p><h2 id="send-title">Review quote email</h2></div><button aria-label="Close" onClick={() => setSendOpen(false)}>×</button></div><label>Subject<input defaultValue={`Your China Care Guide estimate — ${selected.id}`} /></label><label>Message<textarea defaultValue={`Hello ${selected.customer.split(" ")[0]},\n\nPlease find the prepared estimate linked below. Review the included and excluded services, original currency, and validity date. Reply with any questions before making arrangements.\n\nChina Care Guide coordination team`} rows={8} /></label><div className="linked-record"><AdminIcon name="file" /><div><strong>{selected.id} · {selected.version}</strong><span>{selected.amount} · {selected.service}</span></div></div><p className="modal-note">Prototype only: confirming will update the demonstration history but will not send an email.</p><div className="modal-actions"><button className="crm-secondary" onClick={() => setSendOpen(false)}>Cancel</button><button className="crm-primary" onClick={() => { setSent(true); setSendOpen(false); }}>Confirm prototype send</button></div></section></div>}
  </>;
}

function Tasks() {
  const [tasks, setTasks] = useState(tasksSeed);
  return <>
    <PageHeader eyebrow="TASKS & REMINDERS" title="One focused follow-up queue." text="Internal reminders prompt staff review; customer-facing messages are never repeated automatically." action={<button className="crm-primary"><AdminIcon name="plus" /> Add task</button>} />
    <DemoNotice />
    <div className="task-summary"><div><strong>{tasks.filter((task) => !task.done).length}</strong><span>Open tasks</span></div><div><strong>3</strong><span>Due today</span></div><div><strong>1</strong><span>Overdue</span></div><div><strong>{tasks.filter((task) => task.done).length}</strong><span>Completed</span></div></div>
    <section className="crm-card task-card">
      <div className="toolbar embedded"><select><option>Open tasks</option><option>Completed</option><option>All tasks</option></select><select><option>All priorities</option><option>High</option><option>Medium</option></select><select><option>All coordinators</option><option>A. Chen</option><option>L. Wang</option></select><button className="crm-secondary">Reminder interval: 2 business days</button></div>
      {tasks.map((task) => <article className={`task-row ${task.done ? "done" : ""}`} key={task.id}><button aria-label={`Mark ${task.title} complete`} className="task-check" onClick={() => setTasks((items) => items.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))}>{task.done && <AdminIcon name="check" size={14} />}</button><div className="task-main"><strong>{task.title}</strong><p>{task.customer} · {task.quote}</p><small>Next: {task.action}</small></div><div><span>Assigned</span><strong>{task.owner}</strong></div><div><span>Last contact</span><strong>{task.last}</strong></div><div><Status tone={task.priority === "High" ? "red" : "amber"}>{task.priority}</Status><strong>{task.due}</strong></div><button className="crm-secondary">Reschedule</button></article>)}
    </section>
  </>;
}

function Analytics() {
  return <>
    <PageHeader eyebrow="SALES & OPERATIONS ANALYTICS" title="Signals for better follow-up." text="Definitions separate sent, responded, accepted, and converted events. All values below are fictional." />
    <DemoNotice />
    <div className="analytics-definitions"><strong>Demo period: 1 May–12 June 2025</strong><span>Response rate = quotes with an explicit customer response ÷ quotes sent</span><button>View metric definitions</button></div>
    <section className="analytics-metrics">
      <MetricCard label="Inquiry → quote" value="52%" detail="19 of 36 inquiries" />
      <MetricCard label="Quote response rate" value="68%" detail="13 of 19 sent quotes" />
      <MetricCard label="Quote → conversion" value="16%" detail="3 of 19 sent quotes" />
      <MetricCard label="Avg. inquiry → quote" value="4.2 days" detail="Calendar days" />
      <MetricCard label="Avg. awaiting response" value="6.8 days" detail="Open sent quotes" />
    </section>
    <div className="charts-grid">
      <section className="crm-card chart-card"><div className="card-heading"><div><p className="admin-kicker">DEMAND</p><h2>Inquiries by service</h2></div><small>36 total</small></div>{[["Health Screening", 12, "b12"], ["Medical Aesthetics", 8, "b8"], ["Rehabilitation", 6, "b6"], ["TCM & Integrative Care", 5, "b5"], ["Dental Care", 3, "b3"], ["Specialist Care", 2, "b2"]].map(([label, value, width]) => <div className="bar-row" key={label}><span>{label}</span><div><i className={String(width)} /></div><strong>{value}</strong></div>)}</section>
      <section className="crm-card chart-card"><div className="card-heading"><div><p className="admin-kicker">ACQUISITION</p><h2>Lead source distribution</h2></div></div><div className="donut-wrap"><div className="donut"><span>36<small>inquiries</small></span></div><ul><li><i className="d1" /> Organic search <strong>44%</strong></li><li><i className="d2" /> Direct <strong>22%</strong></li><li><i className="d3" /> Referral <strong>19%</strong></li><li><i className="d4" /> Resources <strong>15%</strong></li></ul></div></section>
      <section className="crm-card chart-card"><div className="card-heading"><div><p className="admin-kicker">DESTINATIONS</p><h2>Inquiries by city</h2></div></div><div className="city-stats">{[["Shanghai", "11"], ["Beijing", "9"], ["Dalian", "5"], ["Harbin", "4"], ["Changchun", "3"], ["Open", "4"]].map(([city, value]) => <div key={city}><strong>{value}</strong><span>{city}</span></div>)}</div></section>
      <section className="crm-card chart-card"><div className="card-heading"><div><p className="admin-kicker">ATTENTION NEEDED</p><h2>Lost reasons & overdue leads</h2></div></div><div className="reason-list"><div><span>Timing / plans changed</span><strong>2</strong></div><div><span>Price concern</span><strong>1</strong></div><div><span>Unresponsive</span><strong>1</strong></div><div><span>Reason not recorded</span><strong>1</strong></div></div><div className="overdue-callout"><strong>3 open leads</strong><span>have exceeded their expected follow-up date.</span><button>Review overdue leads</button></div></section>
    </div>
  </>;
}

function Providers() {
  return <>
    <PageHeader eyebrow="INTERNAL DIRECTORY" title="Provider research, not a marketplace." text="Associate inquiry and quote records only after details are confirmed. No partnership or credential claims are implied." action={<button className="crm-primary"><AdminIcon name="plus" /> Add provider record</button>} />
    <DemoNotice />
    <div className="provider-warning"><AdminIcon name="shield" /><p><strong>No real providers are represented below.</strong> Placeholder identities and unverified statuses prevent the prototype from implying active relationships or verification results.</p></div>
    <section className="crm-card table-card">
      <div className="toolbar embedded"><label className="search-box"><AdminIcon name="search" /><input aria-label="Search providers" placeholder="Search internal directory" /></label><select><option>All cities</option><option>Shanghai</option><option>Beijing</option></select><select><option>All verification statuses</option><option>Not started</option><option>Review pending</option></select></div>
      <div className="table-scroll"><table><thead><tr><th>Provider record</th><th>City</th><th>Service categories</th><th>Contact</th><th>Verification</th><th>Last reviewed</th></tr></thead><tbody>
        {[["Provider A — placeholder", "Shanghai", "Health Screening", "Contact not added", "Review pending", "Not yet reviewed"], ["Provider B — placeholder", "Beijing", "Dental Care", "Contact not added", "Not started", "Not yet reviewed"], ["Provider C — placeholder", "Harbin", "TCM & Integrative Care", "Contact not added", "Not started", "Not yet reviewed"]].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}<small>Internal coordination record</small></strong> : index === 4 ? <Status tone="amber">{cell}</Status> : cell}</td>)}</tr>)}
      </tbody></table></div>
      <div className="empty-state"><AdminIcon name="building" size={24} /><div><strong>Keep provider records factual</strong><p>Add contact details, review dates, and internal notes only when obtained through real operational work.</p></div></div>
    </section>
  </>;
}

function Inbox() {
  const [owned, setOwned] = useState(false);
  const [sent, setSent] = useState(false);
  const conversations = [
    ["Maya Thompson", "Website AI", "Could you explain what the screening estimate includes?", "AI assisting", "2 min"],
    ["Daniel Murphy", "Email", "Thank you. I would like an alternative estimate.", "Human owned", "18 min"],
    ["Priya Shah", "WhatsApp · prototype", "Is translation support available in Shanghai?", "Needs review", "1 hr"],
    ["Owen Brooks", "Website AI", "I need help choosing a recovery destination.", "Waiting", "3 hr"],
  ];
  return <>
    <PageHeader eyebrow="SHARED CONVERSATION INBOX" title="One place to coordinate every conversation." text="A future unified view for website AI, email, and official WhatsApp channels—without implying those integrations are active." />
    <DemoNotice />
    <div className="inbox-layout">
      <section className="crm-card conversation-list">
        <div className="toolbar embedded"><label className="search-box"><AdminIcon name="search" /><input aria-label="Search conversations" placeholder="Search conversations" /></label><select><option>All channels</option><option>Website AI</option><option>Email</option><option>WhatsApp</option></select></div>
        {conversations.map((conversation, index) => <button className={`conversation-row ${index === 0 ? "selected" : ""}`} key={conversation[0]}><span>{conversation[0].split(" ").map((part) => part[0]).join("")}</span><div><strong>{conversation[0]}<small>{conversation[1]}</small></strong><p>{conversation[2]}</p><small>{conversation[3]} · {conversation[4]}</small></div></button>)}
      </section>
      <section className="crm-card conversation-detail">
        <header><div><span className="large-avatar">MT</span><div><h2>Maya Thompson</h2><p>Website AI · Linked lead INQ-1048</p></div></div><div><Status tone={owned ? "green" : "blue"}>{owned ? "Human owned" : "AI assisting"}</Status><select aria-label="Assigned coordinator"><option>A. Chen</option><option>L. Wang</option></select></div></header>
        <div className="conversation-body">
          <div className="channel-event">Today · Website assistant conversation</div>
          <div className="chat-bubble customer"><small>Customer</small><p>Could you explain what the health screening estimate includes, and whether translation is available?</p></div>
          <div className="chat-bubble assistant"><small>AI assistant · approved knowledge used</small><p>A useful estimate should list included examinations, exclusions, potential additional charges, currency, and validity. Translation or interpreter coordination may be available on request and must be confirmed.</p></div>
          <div className="chat-bubble customer"><small>Customer</small><p>Can you check whether someone can join me at the hospital?</p></div>
        </div>
        <div className="ownership-bar"><div><AdminIcon name="shield" /><p><strong>{owned ? "You control this conversation" : "AI is paused while staff review is requested"}</strong><span>{owned ? "Automation stays off until explicitly resumed." : "Take ownership before replying."}</span></p></div><button className="crm-secondary" onClick={() => setOwned(!owned)}>{owned ? "Resume AI assistance" : "Take over conversation"}</button></div>
        <div className="suggestion-box"><div><p className="admin-kicker">AI-SUGGESTED RESPONSE · NEEDS REVIEW</p><span>Grounded in approved concierge guidance</span></div><textarea defaultValue="In-person hospital companion support may be available on request, depending on the city, schedule, and confirmed local capability. A coordinator can check this for your planned visit. This support is administrative and does not replace a clinician or qualified medical interpreter." rows={5} /><div><button className="crm-secondary">Save internal note</button><button className="crm-secondary">Create follow-up task</button><button className="crm-primary" disabled={!owned} onClick={() => setSent(true)}>{sent ? "Prototype send recorded" : "Review and confirm send"}</button></div></div>
        <p className="channel-separation"><strong>Customer message area</strong> is separate from internal notes. No message is sent without staff confirmation, and WhatsApp requires official provider setup, opt-in, and current policy review.</p>
      </section>
      <aside className="crm-card conversation-context"><div className="card-heading"><div><p className="admin-kicker">CUSTOMER CONTEXT</p><h2>Inquiry summary</h2></div></div><dl><div><dt>Service</dt><dd>Health Screening</dd></div><div><dt>Destination</dt><dd>Shanghai</dd></div><div><dt>Stage</dt><dd>Quote Sent</dd></div><div><dt>Next action</dt><dd>Confirm companion availability</dd></div><div><dt>Consent</dt><dd>Inquiry response recorded</dd></div></dl><button className="crm-secondary">Open lead record</button><button className="crm-secondary">Open quote QT-2084</button><div className="internal-note"><strong>Internal note</strong><p>Do not paste customer messages into public FAQs. Minimize and de-identify information before proposing knowledge improvements.</p></div></aside>
    </div>
  </>;
}

function Catalogue() {
  const [kind, setKind] = useState<"services" | "destinations">("services");
  const serviceRows = [
    ["Health Screening", "Primary", "Published", "12 Jun 2025", "Packages, reporting, follow-up"],
    ["Medical Aesthetics & Healthy Aging", "Major", "Published", "12 Jun 2025", "Clinical and wellness scope separated"],
    ["Medical Travel Planning & Concierge", "Distinctive", "Published", "12 Jun 2025", "Availability labels required"],
    ["Rehabilitation & Recuperation", "Additional", "Published", "11 Jun 2025", "Medical and non-medical scope separated"],
    ["TCM & Integrative Care", "Additional", "Published", "11 Jun 2025", "No unsupported therapeutic claims"],
    ["Specialist & Surgical Care", "Additional", "Published", "10 Jun 2025", "Individual procedures require confirmation"],
    ["Dental Care", "Additional", "Published", "10 Jun 2025", "No price or savings claims"],
  ];
  const destinationRows = [["Shanghai", "Published", "Current area of interest"], ["Beijing", "Published", "Current focus city"], ["Changchun", "Published", "Inquiry-by-inquiry"], ["Dalian", "Published", "Inquiry-by-inquiry"], ["Harbin", "Published", "Inquiry-by-inquiry"]];
  return <>
    <PageHeader eyebrow="SERVICE & DESTINATION CATALOGUE" title="Keep public promises aligned with operations." text="A lightweight control surface for what the website, AI assistant, and coordinators may describe." action={<button className="crm-primary"><AdminIcon name="plus" /> Add draft item</button>} />
    <DemoNotice />
    <div className="segmented-control"><button className={kind === "services" ? "active" : ""} onClick={() => setKind("services")}>Services</button><button className={kind === "destinations" ? "active" : ""} onClick={() => setKind("destinations")}>Destinations</button></div>
    <section className="crm-card table-card"><div className="table-scroll"><table><thead><tr>{kind === "services" ? <><th>Service</th><th>Hierarchy</th><th>Public status</th><th>Last reviewed</th><th>Publishing note</th></> : <><th>Destination</th><th>Public status</th><th>Availability language</th></>}</tr></thead><tbody>
      {(kind === "services" ? serviceRows : destinationRows).map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : index === 2 && kind === "services" ? <Status tone="green">{cell}</Status> : index === 1 && kind === "destinations" ? <Status tone="green">{cell}</Status> : cell}</td>)}</tr>)}
    </tbody></table></div></section>
    <div className="catalogue-rules"><article><strong>Clinical services</strong><p>Delivered by qualified providers. Suitability, consent, and treatment decisions remain clinical.</p></article><article><strong>Coordination services</strong><p>Delivered by China Care Guide as administrative research, communication, scheduling, and follow-up.</p></article><article><strong>Travel support</strong><p>Label direct, partner-delivered, on-request, and unconfirmed capabilities accurately.</p></article></div>
  </>;
}

function Knowledge() {
  const [tab, setTab] = useState<"library" | "review">("library");
  return <>
    <PageHeader eyebrow="AI KNOWLEDGE & QUALITY" title="Approved answers, human-reviewed." text="A retrieval-based knowledge library and feedback loop for safe, consistent customer guidance." action={<button className="crm-primary"><AdminIcon name="plus" /> New knowledge draft</button>} />
    <DemoNotice />
    <div className="segmented-control"><button className={tab === "library" ? "active" : ""} onClick={() => setTab("library")}>Knowledge library</button><button className={tab === "review" ? "active" : ""} onClick={() => setTab("review")}>Conversation review queue <span>3</span></button></div>
    {tab === "library" ? <section className="crm-card table-card"><div className="toolbar embedded"><label className="search-box"><AdminIcon name="search" /><input aria-label="Search knowledge" placeholder="Search questions and approved answers" /></label><select><option>All topics</option><option>Services</option><option>Travel planning</option><option>Costs</option></select><select><option>All review statuses</option><option>Approved</option><option>Under Review</option></select></div><div className="table-scroll"><table><thead><tr><th>Question</th><th>Topic</th><th>Language</th><th>Status</th><th>Reviewer</th><th>Last reviewed</th></tr></thead><tbody>
      {[["What does a screening estimate include?", "Costs & estimates", "English", "Published", "A. Chen", "12 Jun 2025"], ["Can you arrange an interpreter?", "Travel coordination", "English", "Approved", "L. Wang", "11 Jun 2025"], ["Can the assistant interpret my results?", "AI safety", "English", "Published", "A. Chen", "10 Jun 2025"], ["How does hospital companion support work?", "Local assistance", "English", "Under Review", "Unassigned", "Not reviewed"]].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}<small>Version history preserved</small></strong> : index === 3 ? <Status tone={cell === "Published" ? "green" : cell === "Approved" ? "blue" : "amber"}>{cell}</Status> : cell}</td>)}</tr>)}
    </tbody></table></div><div className="knowledge-footer"><span>Draft → Under Review → Approved → Published → Archived</span><button className="crm-secondary">Export review report</button></div></section> :
    <div className="review-queue"><section className="crm-card"><div className="card-heading"><div><p className="admin-kicker">NEEDS HUMAN REVIEW</p><h2>Flagged conversations</h2></div></div>{[["Missing approved answer", "Hospital companion availability by city", "High"], ["Potentially incorrect response", "Payment guidance may be outdated", "High"], ["Useful improvement", "Clarify certified translation availability", "Medium"]].map(([type, question, priority]) => <article className="review-row" key={question}><span><AdminIcon name="file" /></span><div><Status tone={priority === "High" ? "red" : "amber"}>{type}</Status><strong>{question}</strong><p>Customer content is not copied automatically. Review, minimize, and remove identifying details before creating a correction.</p></div><button className="crm-secondary">Review</button></article>)}</section><aside className="crm-card review-process"><div className="card-heading"><div><p className="admin-kicker">CONTROLLED LOOP</p><h2>Improvement workflow</h2></div></div>{["AI answers from approved content or hands over", "Staff reviews the conversation and outcome", "A de-identified correction is proposed", "An authorized reviewer edits and approves", "Published content becomes retrievable"].map((step, index) => <div key={step}><span>{index + 1}</span><p>{step}</p></div>)}<div className="internal-note"><strong>No silent training</strong><p>Conversations are not automatically treated as training data or public FAQ content.</p></div></aside></div>}
  </>;
}

function Settings() {
  const [tab, setTab] = useState<"email" | "phone" | "access" | "privacy">("email");
  const [notice, setNotice] = useState("");
  const save = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2400); };
  return <>
    <PageHeader eyebrow="ADMINISTRATION" title="Settings and safeguards." text="Conceptual controls for communication infrastructure, roles, privacy, and retention." />
    <DemoNotice />
    {notice && <div className="save-message" role="status"><AdminIcon name="check" /> {notice}</div>}
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Settings sections">
        <button className={tab === "email" ? "active" : ""} onClick={() => setTab("email")}><AdminIcon name="mail" /> Email automation</button>
        <button className={tab === "phone" ? "active" : ""} onClick={() => setTab("phone")}><AdminIcon name="phone" /> Business phone</button>
        <button className={tab === "access" ? "active" : ""} onClick={() => setTab("access")}><AdminIcon name="users" /> Roles & access</button>
        <button className={tab === "privacy" ? "active" : ""} onClick={() => setTab("privacy")}><AdminIcon name="shield" /> Privacy & data</button>
      </nav>
      <section className="crm-card settings-panel">
        {tab === "email" && <><div className="settings-head"><div><h2>Email automation</h2><p>Staff-approved operational messages only. Provider credentials remain server-side in production.</p></div><Status tone="amber">Not connected</Status></div><div className="settings-form two-col"><label>Sender name<input defaultValue="China Care Guide Coordination" /></label><label>Verified business email<input placeholder="Pending verified business domain" /></label><label>Reply-to address<input placeholder="Pending configuration" /></label><label>Delivery provider<select><option>Not connected</option><option>Provider to be selected</option></select></label></div><div className="automation-list"><div><span><AdminIcon name="mail" /></span><div><strong>Inquiry acknowledgment</strong><p>Confirm receipt without clinical advice or an unverified response-time promise.</p></div><label className="switch"><input defaultChecked type="checkbox" /><i /></label></div><div><span><AdminIcon name="file" /></span><div><strong>Quote email template</strong><p>Editable message with linked quote, original currency, and staff confirmation.</p></div><label className="switch"><input defaultChecked type="checkbox" /><i /></label></div><div><span><AdminIcon name="bell" /></span><div><strong>Internal inquiry notification</strong><p>Notify the assigned coordinator and create an initial review task.</p></div><label className="switch"><input defaultChecked type="checkbox" /><i /></label></div></div><label>Email template<textarea defaultValue="Thank you for contacting China Care Guide. We have received your inquiry and will review the information provided. This acknowledgment does not confirm a service, appointment, medical assessment, or response time." rows={5} /></label><div className="settings-actions"><button className="crm-secondary" onClick={() => save("Test action recorded; no email was sent.")}>Send test email</button><button className="crm-primary" onClick={() => save("Prototype email settings saved locally.")}>Save changes</button></div><div className="technical-note"><strong>Production checklist</strong><span>Verified domain · SPF · DKIM · DMARC · server-side secrets · delivery/error logs</span></div></>}
        {tab === "phone" && <><div className="settings-head"><div><h2>Business phone</h2><p>Configure one primary international number first; regional numbers can be added later.</p></div><Status tone="amber">Not provisioned</Status></div><div className="settings-form two-col"><label>Main business number<input placeholder="Pending provisioning and testing" /></label><label>Display label<input defaultValue="International enquiries" /></label><label>Country code<select><option>Select after provider setup</option><option>+1 Canada</option><option>+353 Ireland</option><option>+86 China</option></select></label><label>Phone service provider<select><option>Not selected</option><option>Cloud provider to be evaluated</option></select></label><label>Business hours<input defaultValue="Monday–Friday, hours to be confirmed" /></label><label>Forwarding destination<input placeholder="Not configured" /></label><label>Call routing<select><option>Primary coordinator, then voicemail</option><option>Simultaneous team ring</option></select></label><label>Missed-call notification<select><option>Email assigned coordinator</option><option>Disabled</option></select></label></div><label>Voicemail greeting<textarea defaultValue="Prototype placeholder — record and legally review a final greeting after the number is provisioned." rows={4} /></label><div className="settings-actions"><button className="crm-primary" onClick={() => save("Prototype phone settings saved locally.")}>Save phone settings</button></div><div className="technical-note"><strong>Not active</strong><span>This prototype cannot place or receive calls. Provider support, routing, voicemail, and legal requirements must be tested before display.</span></div></>}
        {tab === "access" && <><div className="settings-head"><div><h2>Roles & access</h2><p>Give each team member only the access needed for their work.</p></div><button className="crm-primary"><AdminIcon name="plus" /> Invite team member</button></div><div className="role-table"><div><strong>Alex Chen</strong><span>demo.admin@example.com</span><Status tone="green">Administrator</Status><button>Manage</button></div><div><strong>Lin Wang</strong><span>demo.coordinator@example.com</span><Status tone="blue">Coordinator</Status><button>Manage</button></div><div><strong>Sam Kelly</strong><span>demo.viewer@example.com</span><Status>Read-only</Status><button>Manage</button></div></div><div className="permission-grid"><div><strong>Administrator</strong><p>Settings, users, exports, deletion requests, and all operational records.</p></div><div><strong>Coordinator</strong><p>Assigned inquiries, quotes, tasks, notes, and approved communications.</p></div><div><strong>Read-only</strong><p>View permitted records and analytics without editing or exporting.</p></div></div></>}
        {tab === "privacy" && <><div className="settings-head"><div><h2>Privacy & data controls</h2><p>Conceptual controls require legal, security, retention, and cross-border transfer review.</p></div><Status tone="red">Review required</Status></div><div className="privacy-cards"><article><AdminIcon name="shield" /><div><strong>Consent status</strong><p>Record inquiry-response consent separately from promotional consent.</p></div><button>Review fields</button></article><article><AdminIcon name="clock" /><div><strong>Record retention</strong><p>No production schedule configured. Define lawful periods before launch.</p></div><button>Configure</button></article><article><AdminIcon name="file" /><div><strong>Data export</strong><p>Restricted to administrators with reason and audit record.</p></div><button>Request export</button></article><article><AdminIcon name="users" /><div><strong>Deletion requests</strong><p>Review identity, legal obligations, and downstream systems.</p></div><button>Open queue</button></article></div><div className="audit-box"><div><p className="admin-kicker">AUDIT HISTORY</p><h3>Recent demonstration events</h3></div><div><strong>Quote response updated</strong><span>A. Chen · 12 Jun, 10:42</span></div><div><strong>Lead assignment changed</strong><span>Administrator · 12 Jun, 09:18</span></div><div><strong>Record viewed</strong><span>Read-only member · 11 Jun, 16:03</span></div></div><div className="cross-border-note"><AdminIcon name="shield" /><p><strong>Production review is mandatory.</strong> Operations spanning Canada, Ireland, and China require appropriate privacy, security, data residency, and cross-border transfer advice before real customer information is stored.</p></div></>}
      </section>
    </div>
  </>;
}

export default function Admin() {
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = existing ?? document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    if (!existing) document.head.append(meta);
    document.title = "CareDesk | Private Operations Portal";
  }, []);
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;
  const content: Record<View, ReactNode> = {
    dashboard: <Dashboard go={setView} />, leads: <Leads />, inbox: <Inbox />, quotes: <Quotes />, tasks: <Tasks />, catalogue: <Catalogue />, knowledge: <Knowledge />, analytics: <Analytics />, providers: <Providers />, settings: <Settings />,
  };
  const go = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo(0, 0); };
  return <div className="crm-shell">
    <aside className={`crm-sidebar ${menuOpen ? "open" : ""}`}>
      <div className="sidebar-top"><a className="admin-brand" href="/"><span>CC</span><strong>CareDesk<small>China Care Guide</small></strong></a><button aria-label="Close navigation" className="sidebar-close" onClick={() => setMenuOpen(false)}><AdminIcon name="close" /></button></div>
      <nav aria-label="CRM navigation">{navItems.map((item) => <button className={view === item.id ? "active" : ""} key={item.id} onClick={() => go(item.id)}><AdminIcon name={item.icon} /><span>{item.label}</span>{item.id === "tasks" && <i>3</i>}</button>)}</nav>
      <div className="sidebar-help"><AdminIcon name="shield" /><div><strong>Privacy first</strong><p>Store inquiry and quote details only. No clinical records.</p></div></div>
      <div className="sidebar-user"><span>AC</span><div><strong>Alex Chen</strong><small>Administrator</small></div><button aria-label="Sign out" onClick={() => setAuthenticated(false)}>Sign out</button></div>
    </aside>
    <div className="crm-workspace">
      <header className="crm-topbar"><button aria-label="Open navigation" className="mobile-nav-button" onClick={() => setMenuOpen(true)}><AdminIcon name="menu" /></button><label className="global-search"><AdminIcon name="search" /><input placeholder="Search customers, quotes, or tasks" /></label><div><button aria-label="Notifications" className="icon-button"><AdminIcon name="bell" /><i /></button><span className="role-chip">Administrator</span></div></header>
      <main className="crm-main">{content[view]}</main>
    </div>
  </div>;
}
