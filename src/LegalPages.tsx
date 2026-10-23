import { useEffect } from "react";
import { changeLocale, languages, localizedPath, type Locale } from "./routing";

type LegalDocument = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: [string, string][];
};

const documents: Record<Locale, Record<"privacy-policy" | "terms-of-service", LegalDocument>> = {
  en: {
    "privacy-policy": {
      title: "Privacy Policy | China Care Guide",
      description: "Learn what information China Care Guide collects, how inquiries and AI chat are handled, and how to make a privacy request.",
      eyebrow: "PRIVACY POLICY",
      intro: "This notice explains how China Care Guide handles information when you browse the website, submit an inquiry, or use the AI information assistant. It is written for people exploring non-emergency healthcare coordination in China.",
      sections: [
        ["Who operates this service and how to contact us", "China Care Guide is the service name used on this website. For a privacy question, access request, correction, or deletion request, use the website inquiry form, select “Not Sure,” and write “Privacy request” in the general question field. Do not include health records, passport details, or other sensitive information in that request. We will use the information you provide to identify and respond to the request. The legal contracting entity and postal privacy contact should be confirmed in any paid-service agreement before a service is purchased."],
        ["Information we collect", "If you submit the inquiry form, we collect the fields shown there: first name, email address, country of residence, service interest, preferred destination, language, approximate travel timeframe, preferred contact method, and your optional general question. If you use the AI assistant, the message you type and a limited amount of recent, non-sensitive chat context may be sent to our AI provider to generate a reply. We also receive technical request information needed to deliver and protect the website, such as basic server and security logs."],
        ["Please do not submit medical or identity documents", "The inquiry form and AI assistant are for general planning questions, not medical records. Do not enter diagnoses, symptoms, test results, genetic information, medication lists, passport or identity numbers, payment-card details, or medical documents. Some clinical or urgent messages may be filtered by the assistant, but automated filters are imperfect. If a provider later needs clinical information, share it directly with that provider through a secure channel they specify."],
        ["Why we use information", "We use inquiry information to understand the requested non-clinical coordination, communicate with you, research questions you ask us to investigate, prepare or explain a service scope or estimate, coordinate practical arrangements you request, protect the website against misuse, and meet legal or record-keeping duties. We do not use inquiry details to make clinical decisions, diagnose, or determine treatment suitability. We do not sell inquiry information or use it to build targeted advertising audiences."],
        ["When information may be shared", "Access is limited to people who need the information to handle your request. We use technology providers to operate the site and requested functions, including Vercel for hosting, Supabase for inquiry storage and staff access, Resend for email notifications, and SiliconFlow for AI responses. Those providers process information under their own service terms. We share information with a hospital, travel, accommodation, transport, interpreter, or other service provider only when needed for a requested arrangement and after explaining what will be shared and obtaining your authorization where required. A provider receiving information may handle it under its own privacy notice and applicable rules."],
        ["International processing", "Our service coordinates requests involving Canada, Ireland, and China, and technology vendors may process information in other countries. If you ask us to coordinate with a provider in China, relevant information may be transferred to that provider there with your authorization. Privacy protections and legal rights can differ between locations. We will limit a transfer to the information needed for the requested coordination."],
        ["AI assistant and chat privacy", "The AI assistant is an automated information tool, not a clinician. A general message and limited recent chat context may be sent to SiliconFlow to generate a response. The application does not save ordinary chat transcripts in the inquiry database, but the AI provider may process request data under its own terms. Do not rely on the assistant to detect every sensitive detail; do not enter personal health information."],
        ["How long we keep information", "We keep personal information only as long as reasonably needed to respond to and manage an inquiry or service, protect the service, and meet legal, accounting, or security obligations. We review information for deletion or de-identification when it is no longer needed for those purposes. The period can depend on whether you proceed with a service and on applicable record-keeping requirements."],
        ["Security and your choices", "We use access controls and service-provider safeguards appropriate to the information handled. No website or electronic transmission can be guaranteed completely secure. You may ask to access or correct your information, withdraw consent where applicable, or request deletion, subject to legal and operational limits. Use the website inquiry form and identify the message as a privacy request. You may also choose not to provide optional information; without required contact and planning details, we may be unable to assess the inquiry."],
        ["Children, changes, and applicable rights", "This website is intended for adults making their own general inquiries. A parent or legal guardian should contact us before submitting an inquiry for a minor. We may update this notice as the service or legal requirements change; the date below indicates the latest website revision. Depending on where you live and how the service is operated, privacy laws may give you additional rights. This notice does not limit rights that cannot lawfully be limited."],
        ["Last updated", "October 23, 2026. This notice describes the website’s current information flows. If a material change is made to how information is collected, used, or shared, we will update this page and provide any notice or choice required by applicable law."],
      ],
    },
    "terms-of-service": {
      title: "Terms of Service | China Care Guide",
      description: "Understand China Care Guide's non-clinical coordination role, individualized service options, separate fees, direct provider payments, and travel arrangements.",
      eyebrow: "TERMS OF SERVICE",
      intro: "China Care Guide helps international customers explore and coordinate practical arrangements for planned healthcare in China. These terms explain what the service does, how provider payments and coordination fees are separated, and where clinical responsibility sits.",
      sections: [
        ["1. What China Care Guide does", "China Care Guide provides information gathering and non-clinical coordination. Depending on your request and written scope, this can include comparing available options, asking providers practical questions, organizing estimates, arranging interpretation or accompaniment, coordinating transport or accommodation, planning a visit itinerary, or helping with non-medical travel and sightseeing arrangements in China. We are not a hospital, clinic, physician, healthcare professional, insurer, emergency service, or payment processor for a hospital’s clinical bill."],
        ["2. Individual services and customized plans", "You may ask about a single service, such as accompaniment or interpretation, or request a broader, customized plan covering several practical services. We can help communicate your preferences to a hospital if you ask about a customized examination package. The hospital or qualified provider—not China Care Guide—decides the available examinations, clinical appropriateness, final package, and any medical recommendations. Every service, provider, city, schedule, and third-party arrangement is subject to individual confirmation. A website inquiry is not a booking or acceptance of a paid service."],
        ["3. Separate medical charges and China Care Guide fees", "Medical examinations, consultations, procedures, medicines, and other clinical services are paid by you directly to the hospital or healthcare provider. The provider is responsible for its own medical invoice and receipt. China Care Guide charges a separate coordination or other non-clinical service fee only when the scope and fee have been explained and accepted. Your estimate or service agreement should identify the Guide’s fee separately from provider charges, travel costs, third-party charges, currency, inclusions, exclusions, assumptions, and any known conditions or cancellation terms. Do not pay a medical charge to China Care Guide unless a separate written agreement expressly explains a lawful arrangement."],
        ["4. Travel, accommodation, and other third-party arrangements", "You may choose to arrange travel, lodging, transport, activities, and sightseeing yourself, ask China Care Guide to help coordinate them, or combine these options. These are separate from medical care and may be supplied under a third party’s own contract, terms, availability, and cancellation rules. Unless a written agreement says otherwise, you contract with and pay the travel or accommodation provider directly. We will identify what we coordinate and what remains your responsibility before you commit."],
        ["5. Referral fees and partner commissions", "China Care Guide may receive a referral fee or commission from a travel, accommodation, transport, tourism, or other non-clinical partner when you choose a service we help arrange. If a commission or other material commercial relationship applies, we will disclose its existence and, where available, the amount or calculation method before you commit to the relevant purchase. This partner compensation is separate from any coordination fee charged to you. You remain free to choose another provider or make your own arrangements. We do not represent a partner payment as a clinical recommendation."],
        ["6. Healthcare providers and clinical responsibility", "Hospitals and healthcare professionals are responsible for their own clinical services, assessments, diagnoses, recommendations, informed-consent process, treatment, medical records, clinical charges, and clinical follow-up, subject to applicable law. They decide whether a service is available or appropriate for you. China Care Guide does not diagnose, prescribe, interpret results, recommend or select treatment on clinical grounds, guarantee provider quality, or supervise medical care. We remain responsible for the non-clinical services we expressly agree to provide, as required by applicable law. Nothing in these terms removes a responsibility or consumer right that cannot legally be excluded or limited."],
        ["7. Information, estimates, and no guarantees", "Website content and AI-generated answers are general information, not medical, legal, immigration, financial, or travel advice. Information can change and must be confirmed with the relevant provider or supplier. Estimates are not final invoices unless the provider expressly makes them so. Availability, eligibility, appointments, prices, treatment results, travel arrangements, recovery, and follow-up are not guaranteed. We do not promise a response time through the website; any specific service timetable must be stated in the written scope if agreed."],
        ["8. Your responsibilities and emergencies", "Provide accurate contact and planning information, review the written service scope and charges, and make your own decision about whether to proceed. Do not submit medical records, passport details, or payment information through the website form or AI assistant. For clinical questions, personal symptoms, or treatment decisions, consult a qualified healthcare professional. China Care Guide is not an emergency service; for urgent medical needs contact local emergency services or a qualified clinician."],
        ["9. Cancellations, changes, and third-party rules", "Any cancellation, refund, rescheduling, or change terms for a paid coordination service will be stated in the written service scope before you accept it. Hospitals, airlines, accommodation providers, interpreters, and other suppliers may have separate terms. We will identify known third-party conditions when arranging a service, but the relevant supplier controls its own booking and refund rules."],
        ["10. Website use and these terms", "Use the website lawfully and do not interfere with its operation or security. These website terms do not create a doctor-patient relationship, insurance contract, hospital booking, or paid coordination contract. A paid service begins only when its provider, scope, fee, and applicable conditions have been expressly agreed in writing. If a court finds a term unenforceable, the remaining terms continue to apply to the extent permitted by law. Mandatory consumer rights and legal responsibilities continue to apply."],
        ["11. Changes and contact", "We may update these terms as services or legal requirements change. The latest revision date appears below. For a question about a proposed service or these terms, use the website inquiry form and identify the subject of your message. Do not include sensitive medical or identity information."],
        ["Last updated", "October 23, 2026. These website terms provide general service information. The written scope for a specific paid service may include additional details, but it cannot remove rights or obligations that applicable law makes mandatory."],
      ],
    },
  },
  zh: {
    "privacy-policy": {
      title: "隐私政策 | China Care Guide",
      description: "了解 China Care Guide 收集哪些信息、如何处理咨询与 AI 聊天，以及如何提交隐私请求。",
      eyebrow: "隐私政策",
      intro: "本政策说明你浏览网站、提交咨询或使用 AI 信息助手时，China Care Guide 如何处理相关信息。本网站面向了解赴华计划性医疗协调服务的人士，不提供急救服务。",
      sections: [
        ["谁负责处理信息，如何联系？", "China Care Guide 是本网站使用的服务名称。如需询问隐私、查阅或更正信息，或请求删除信息，请使用网站咨询表，选择“还不确定”，并在一般问题栏注明“隐私请求”。请勿在该请求中填写病历、护照信息或其他敏感资料；我们会使用你提供的信息识别并处理请求。购买付费服务前，具体合同应列明法律运营主体及隐私联系地址。"],
        ["我们收集哪些信息？", "提交咨询表时，我们会收集表格所列信息：名字、电子邮箱、居住国家/地区、服务兴趣、目的地、语言、大致出行时间、首选联系方法及选填的一般问题。使用 AI 助手时，你输入的问题及少量近期、非敏感聊天上下文可能会发送给 AI 服务商以生成回复。网站运行和安全保护也会产生必要的技术请求信息，例如基础服务器及安全日志。"],
        ["请勿提交病历或身份文件", "咨询表和 AI 助手用于一般规划问题，不是提交病历的渠道。请勿输入诊断、症状、检查结果、遗传信息、药物清单、护照或身份号码、银行卡信息或医疗文件。AI 助手会过滤部分临床或紧急内容，但自动过滤并不完美。如医疗服务方之后需要临床资料，请直接通过该服务方指定的安全渠道提供。"],
        ["我们为何使用这些信息？", "我们使用咨询信息了解你所请求的非临床协调服务、与你沟通、调查你要求了解的问题、准备或说明服务范围及费用估算、协调你提出的实际安排、防止网站被滥用，以及履行法律或记录保存义务。我们不会据此作临床决定、诊断或判断治疗适宜性。我们不会出售咨询信息，也不会用其建立定向广告受众。"],
        ["哪些情况下会共享信息？", "仅授权给处理你请求所需的人员访问相关信息。我们使用技术服务商提供网站及其功能，包括 Vercel 网站托管、Supabase 咨询信息存储及员工访问、Resend 邮件通知、SiliconFlow AI 回复。这些服务商依据各自的服务条款处理信息。只有在办理你所要求的安排确有需要时，我们才会向医院、旅行、住宿、交通、口译或其他服务方分享相关信息；在需要时，会先说明分享内容并取得你的授权。接收信息的服务方可能根据自己的隐私政策及适用规则处理信息。"],
        ["跨境处理", "我们的服务涉及加拿大、爱尔兰和中国，技术服务商也可能在其他国家处理信息。如果你要求我们与中国的服务方协调，相关信息可能在取得你授权后传给该服务方。不同地区的隐私保护和法律权利可能不同；我们会将跨境分享限制在完成所请求协调所需的范围内。"],
        ["AI 助手与聊天隐私", "AI 助手是自动化信息工具，不是临床人员。一般问题及少量近期聊天上下文可能发送给 SiliconFlow 生成回复。本应用不会把普通聊天记录保存到咨询数据库，但 AI 服务商可能按自己的条款处理请求数据。请勿依赖自动过滤来识别所有敏感内容，也请勿输入个人健康信息。"],
        ["信息会保留多久？", "我们只在合理必要的期间内保留个人信息，以处理和管理咨询或服务、保护服务安全，以及履行法律、会计或安全义务。当信息不再用于这些目的时，我们会审查并删除或去标识化。实际期限可能取决于你是否购买服务及适用的记录保存要求。"],
        ["信息安全与个人选择", "我们采用与所处理信息相适应的访问控制及服务商安全措施。任何网站或电子传输都无法保证绝对安全。你可以在适用情况下请求查阅、更正信息、撤回同意或请求删除，但需受法律和实际运营要求限制。请通过网站咨询表提交，并注明“隐私请求”。你也可以不提供选填信息；如果缺少必需联系和规划信息，我们可能无法处理咨询。"],
        ["未成年人、政策更新与适用权利", "本网站面向自行提交一般咨询的成年人。如需为未成年人咨询，请由父母或法定监护人先与我们联系。服务或法律要求变更时，我们可能更新本政策，页面日期表示最近一次修订。根据你的居住地及服务运营情况，适用隐私法律可能赋予你其他权利。本政策不限制依法不得限制的权利。"],
        ["最后更新日期", "2026年10月23日。本政策描述网站当前的信息处理流程。如信息收集、使用或分享方式发生重大变更，我们会更新本页面，并提供适用法律要求的通知或选择。"],
      ],
    },
    "terms-of-service": {
      title: "服务条款 | China Care Guide",
      description: "了解 China Care Guide 的非临床协调角色、个性化服务、分项收费、医院直接收款及旅行安排。",
      eyebrow: "服务条款",
      intro: "China Care Guide 协助国际客户了解并协调赴华计划性医疗的实际安排。本条款说明服务内容、医院费用与协调服务费如何区分，以及临床医疗责任由谁承担。",
      sections: [
        ["1. China Care Guide 提供什么服务？", "China Care Guide 提供信息整理及非临床协调服务。根据你的需求和书面服务范围，服务可包括比较当前选项、向服务方询问实际问题、整理费用估算、安排口译或陪诊、协调交通或住宿、规划就诊行程，或协助安排在中国的非医疗旅行与游览。我们不是医院、诊所、医生、医疗专业人员、保险公司、急救服务，也不代医院收取临床医疗费用。"],
        ["2. 单项服务与个性化定制", "你可以只购买一项服务，例如陪诊或口译，也可以申请包含多项实际协助的综合定制方案。如果你需要定制体检套餐，我们可以按你的要求协助向医院沟通偏好。可安排的检查项目、临床适宜性、最终套餐及医疗建议由医院或合格服务方决定，而非 China Care Guide。每项服务、服务方、城市、日程和第三方安排均需单独确认。提交网站咨询不等于预订或接受付费服务。"],
        ["3. 医疗费用与 China Care Guide 服务费分开", "医疗检查、问诊、治疗、药品及其他临床服务费用由你直接支付给医院或医疗服务方。医疗账单和收据由服务方出具。只有在服务范围和费用已经说明并经你接受后，China Care Guide 才收取另行列明的协调费或其他非临床服务费。费用估算或服务协议应将 China Care Guide 服务费与医院费用、旅行费用和第三方收费分开列出，并说明币种、包含与不包含项目、前提条件及已知取消条件。除非单独书面协议明确说明合法安排，否则请勿向 China Care Guide 支付医疗费用。"],
        ["4. 旅行、住宿及其他第三方安排", "你可以自行安排旅行、住宿、交通、活动和游览，也可以请 China Care Guide 协助协调，或组合选择。上述项目与医疗服务分开，可能受第三方自己的合同、条款、供应情况及取消规则约束。除非书面协议另有说明，旅行或住宿服务由你直接与供应商签约并付款。作出决定前，我们会说明我们负责协调的内容及仍由你负责的部分。"],
        ["5. 转介费与合作方佣金", "如果你选择我们协助安排的旅行、住宿、交通、旅游或其他非临床合作方服务，China Care Guide 可能从该合作方获得转介费或佣金。如涉及佣金或其他重要商业关系，我们会在你承诺购买相关服务前披露该关系；如可得，也会说明金额或计算方式。合作方支付的报酬与向你收取的协调服务费分开。你可以自由选择其他服务方或自行安排。我们不会把合作方支付的报酬描述成临床建议。"],
        ["6. 医疗服务方与临床责任", "在适用法律范围内，医院及医疗专业人员负责其临床服务、评估、诊断、建议、知情同意、治疗、病历、临床收费和临床随访，并决定某项服务是否提供或适合你。China Care Guide 不作诊断、处方、结果解释、临床治疗推荐或选择，不保证服务方质量，也不监督医疗照护。我们仍须依照适用法律对明确承诺提供的非临床服务负责。本条款不排除或限制法律不允许排除或限制的责任及消费者权利。"],
        ["7. 信息、估算及不作结果保证", "网站内容及 AI 回复是一般信息，不构成医疗、法律、移民、财务或旅行建议。信息可能变化，应向相关服务方或供应商确认。除非服务方明确说明，估算不等于最终账单。服务是否可用、资格、预约、价格、治疗结果、旅行安排、恢复及后续服务均不作保证。我们不承诺网站咨询的回复时限；若付费服务包含特定时间安排，应在书面服务范围中明确约定。"],
        ["8. 你的责任与紧急情况", "请提供准确的联系和规划信息，阅读书面服务范围及费用，并自行决定是否继续。请勿通过网站表单或 AI 助手提交病历、护照资料或付款信息。如有临床问题、个人症状或治疗决定，请咨询合格医疗专业人员。China Care Guide 不是急救服务；如有紧急医疗需要，请联系当地急救服务或合格临床人员。"],
        ["9. 取消、变更与第三方规则", "付费协调服务的取消、退款、改期或变更条件，会在你接受服务前写入书面服务范围。医院、航空公司、住宿、口译和其他供应商可能另有条款。协助安排时，我们会说明已知的第三方条件；具体供应商仍负责其自己的预订及退款规则。"],
        ["10. 网站使用与本条款", "请合法使用网站，不得干扰网站运行或安全。本网站条款不构成医患关系、保险合同、医院预约或付费协调服务合同。只有在服务方、范围、费用和适用条件均经书面明确同意后，付费服务才开始。如果法院认定某项条款不可执行，其余条款仍在法律允许范围内适用。法定消费者权利和法律责任继续有效。"],
        ["11. 条款更新与联系", "服务或法律要求变更时，我们可能更新本条款，最近修订日期会显示在下方。如对拟申请的服务或本条款有问题，请通过网站咨询表联系，并注明问题主题。请勿附上敏感医疗或身份信息。"],
        ["最后更新日期", "2026年10月23日。本网站服务条款提供一般服务信息。具体付费服务的书面范围可以补充细节，但不得排除适用法律规定必须保留的权利或责任。"],
      ],
    },
  },
};

const pathKeys = ["privacy-policy", "terms-of-service"] as const;

export function getLegalPageMetadata(locale: Locale, kind: (typeof pathKeys)[number]) {
  return documents[locale][kind];
}

export default function LegalPage({ locale, kind }: { locale: Locale; kind: (typeof pathKeys)[number] }) {
  const page = documents[locale][kind];
  const canonicalPath = localizedPath(`/${kind}`, locale);
  useEffect(() => {
    document.title = page.title;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    const setMeta = (selector: string, attr: "content", value: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) { element = document.createElement("meta"); document.head.append(element); }
      element.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", page.description);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[property="og:description"]', "content", page.description);
    setMeta('meta[property="og:type"]', "content", "article");
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = `${window.location.origin}${canonicalPath}`;
    for (const [language, hreflang] of [["en", "en"], ["zh", "zh-CN"]] as const) {
      let alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!alternate) { alternate = document.createElement("link"); alternate.rel = "alternate"; alternate.hreflang = hreflang; document.head.append(alternate); }
      alternate.href = `${window.location.origin}${localizedPath(`/${kind}`, language)}`;
    }
    let defaultAlternate = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]');
    if (!defaultAlternate) { defaultAlternate = document.createElement("link"); defaultAlternate.rel = "alternate"; defaultAlternate.hreflang = "x-default"; document.head.append(defaultAlternate); }
    defaultAlternate.href = `${window.location.origin}${localizedPath(`/${kind}`, "en")}`;
    let structuredData = document.getElementById("legal-page-structured-data") as HTMLScriptElement | null;
    if (!structuredData) { structuredData = document.createElement("script"); structuredData.id = "legal-page-structured-data"; structuredData.type = "application/ld+json"; document.head.append(structuredData); }
    structuredData.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, dateModified: "2026-10-23", inLanguage: locale === "zh" ? "zh-CN" : "en", url: `${window.location.origin}${localizedPath(`/${kind}`, locale)}`, isPartOf: { "@type": "WebSite", name: "China Care Guide", url: window.location.origin } });
    return () => { structuredData?.remove(); };
  }, [canonicalPath, kind, locale, page]);

  return <div className="content-page legal-page">
    <header className="content-nav"><a className="brand" href={localizedPath("/", locale)}><span className="brand-mark">CC</span><span>CHINA CARE<br />GUIDE</span></a><nav><a href={localizedPath("/", locale)}>{locale === "zh" ? "首页" : "Home"}</a><a href={localizedPath("/how-it-works", locale)}>{locale === "zh" ? "服务流程" : "How it works"}</a><a className="button" href={localizedPath("/", locale, "", "#inquiry")}>{locale === "zh" ? "提交咨询" : "Make an inquiry"}</a><label className="content-language">{locale === "zh" ? "语言" : "Language"}<select aria-label={locale === "zh" ? "选择语言" : "Choose language"} value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label></nav></header>
    <main>
      <div className="breadcrumbs"><a href={localizedPath("/", locale)}>{locale === "zh" ? "首页" : "Home"}</a><span>/</span><span>{page.eyebrow}</span></div>
      <section className="content-hero legal-hero"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title.split(" | ")[0]}</h1><p>{page.intro}</p><small>{locale === "zh" ? "最近更新：2026年10月23日" : "Last updated: October 23, 2026"}</small></section>
      <section className="legal-document" aria-label={page.eyebrow}>
        <div className="legal-summary"><strong>{locale === "zh" ? "核心说明" : "At a glance"}</strong><p>{locale === "zh" ? (kind === "privacy-policy" ? "首次咨询只需提供一般联系和规划信息。请勿通过网站发送病历；相关服务方、AI 和技术服务商只按上述范围处理所需信息。" : "医院直接收取医疗费用；China Care Guide 的非临床协调费另行列明。你可选择单项或定制服务，是否继续由你决定。") : (kind === "privacy-policy" ? "An initial inquiry needs only general contact and planning details. Do not send medical records through the website; providers, AI, and technology vendors process information only as described below." : "Hospitals collect medical charges directly; China Care Guide lists its non-clinical coordination fee separately. Choose a single service or a customized plan, and decide whether to proceed." )}</p></div>
        {page.sections.map(([title, text], index) => <article id={kind === "terms-of-service" && index === 6 ? "information-disclaimer" : undefined} key={title}><h2>{title}</h2><p>{text}</p></article>)}
        <nav className="legal-related" aria-label={locale === "zh" ? "相关法律页面" : "Related legal pages"}><a href={localizedPath(`/${kind === "privacy-policy" ? "terms-of-service" : "privacy-policy"}`, locale)}>{locale === "zh" ? (kind === "privacy-policy" ? "阅读服务条款" : "阅读隐私政策") : (kind === "privacy-policy" ? "Read the Terms of Service" : "Read the Privacy Policy")}</a><a href={localizedPath("/", locale, "", "#inquiry")}>{locale === "zh" ? "提交一般咨询" : "Make a general inquiry"}</a></nav>
      </section>
    </main>
    <footer className="content-footer"><strong>China Care Guide</strong><p>{locale === "zh" ? "信息与非临床协调服务；不是医疗机构、保险公司或急救服务。" : "Information and non-clinical coordination; not a healthcare provider, insurer, or emergency service."}</p><div className="legal-footer-links"><a href={localizedPath("/privacy-policy", locale)}>{locale === "zh" ? "隐私政策" : "Privacy Policy"}</a><a href={localizedPath("/terms-of-service", locale)}>{locale === "zh" ? "服务条款" : "Terms of Service"}</a></div></footer>
  </div>;
}
