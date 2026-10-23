import { useEffect } from "react";
import { changeLocale, languages, localizedPath, type Locale } from "./routing";

type Topic = { title: string; summary: string; examples: string; questions: string };
type CarePage = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  image: string;
  imageAlt: string;
  quickFacts: [string, string][];
  sections: [string, string][];
  topics: Topic[];
  sourceTitle: string;
};

const image = {
  aesthetics: "https://images.unsplash.com/photo-1713085085470-fba013d67e65?auto=format&fit=crop&w=1300&q=85",
  aging: "https://images.unsplash.com/photo-1645005513713-9e2b92a687d3?auto=format&fit=crop&w=1300&q=85",
};

const data: Record<Locale, Record<"medical-aesthetics-in-china" | "healthy-aging", CarePage>> = {
  en: {
    "medical-aesthetics-in-china": {
      title: "Medical Aesthetics in China | China Care Guide",
      description: "Explore popular aesthetic treatments in China, from ultrasound-cannon lifting and Ultherapy Prime to Thermage, skin boosters, injectables, lasers, and Korean-inspired skin programs.",
      eyebrow: "MEDICAL AESTHETICS & HEALTHY AGING",
      intro: "Considering ultrasound lifting, Thermage, water-light injections, laser care, or a full aesthetic refresh? We help you explore medical institutions in China, arrange a direct consultation, and shape the visit around your interests—with interpretation, accompaniment, and travel support available when you want it.",
      image: image.aesthetics,
      imageAlt: "A contemporary aesthetic care setting",
      quickFacts: [["Popular in China", "Ultrasound lifting, Thermage, skin boosters, lasers, and injectables."], ["2026 Korean trends", "Explore Ultherapy Prime, Rejuran, Juvelook, Sofwave, ONDA, and more where available."], ["Your visit, your way", "Arrange a single appointment or add interpretation, accompaniment, and travel support."]],
      sections: [
        ["A wide menu of modern aesthetic care", "China’s medical-aesthetic clinics bring together energy-based lifting, skin rejuvenation, injectables, laser dermatology, and surgical consultations. Many visitors start with one interest—such as tightening, pigmentation, hydration, or facial balance—and let the physician shape the consultation from there."],
        ["Inspired by the China and Korea beauty scenes", "Korean clinics are known for popular lifting platforms and skin-focused treatments; in China, patients can explore locally available devices and products, as well as selected Korean-origin options. We help you describe the treatment you are looking for and connect the inquiry with a medical institution in China."],
        ["Direct care from the medical institution", "The hospital or clinic’s doctors meet with you, discuss the approach, and provide any treatment. We make the visit easier to navigate with appointment coordination, interpretation, accompaniment, and travel arrangements. You pay medical charges directly to the institution; our coordination services are separate and tailored to what you choose."],
      ],
      topics: [
        { title: "Ultrasound lifting: ultrasound cannon and Ultherapy", summary: "One of the best-known non-surgical lifting categories in China.", examples: "Focused-ultrasound platforms marketed as ultrasound cannon (超声炮), Ultraformer systems, and Ultherapy/Ultherapy Prime, often called ultrasound scalpel (超声刀).", questions: "Tell us the platform you have in mind. We can ask medical institutions in China about availability and arrange a direct physician consultation." },
        { title: "Thermage and 2026 Korean lifting trends", summary: "Radiofrequency and ultrasound are two headline categories for firmness and facial contouring.", examples: "Thermage FLX, Ultherapy Prime, Sofwave, ONDA, and other lifting platforms seen in Korean aesthetic clinics; exact device availability in China varies.", questions: "We can explore a specific brand or a comparable locally available platform and coordinate your appointment and interpretation." },
        { title: "Water-light injections and skin boosters", summary: "Hydration-focused and skin-quality programs are a popular part of the Korean beauty menu.", examples: "Water-light injections (水光针), skin boosters, Rejuran, Juvelook, and other Korean-origin products where available in China.", questions: "Share the products or treatment style you are curious about; the medical institution’s clinician explains the available product and plan directly." },
        { title: "Botulinum toxin, fillers, and facial refinement", summary: "Aesthetic consultations can focus on expression lines, volume, facial balance, or subtle contouring.", examples: "Botulinum toxin, hyaluronic-acid fillers, collagen-stimulating injectables, and other institution-provided injectable options.", questions: "We coordinate the consultation and language support so you can discuss your goals directly with the treating clinician." },
        { title: "Laser, light, and microneedling", summary: "A broad choice for tone, texture, pores, scars, and hair removal.", examples: "Pico and other pigment lasers, IPL/photofacial, fractional laser, radiofrequency microneedling/Golden Microneedle, acne-scar care, and laser hair removal.", questions: "Tell us which concerns you want to discuss and we can arrange a focused or multi-topic clinic visit." },
        { title: "Aesthetic surgery consultations", summary: "For patients considering a surgical change, start with a specialist consultation at a medical institution.", examples: "Eyelid surgery, rhinoplasty, facial contouring, facelift procedures, breast surgery, liposuction, scar revision, and hair restoration, depending on the institution.", questions: "We can help route your inquiry to a relevant medical institution and coordinate consultation, interpretation, accompaniment, and recovery-stay logistics." },
        { title: "Brows and beauty add-ons", summary: "A few finishing touches can be planned separately around a medical visit.", examples: "Brow shaping, eyebrow design, and semi-permanent eyebrow makeup where available.", questions: "Ask us to include a beauty add-on in your tailored itinerary; we arrange it separately from hospital treatment." },
      ],
      sourceTitle: "Learn about medical aesthetics in China and Korea",
    },
    "healthy-aging": {
      title: "Healthy Aging in China | China Care Guide",
      description: "Explore clinician-led preventive health, skin health, functional wellness, and recovery options in China without anti-aging or longevity guarantees.",
      eyebrow: "HEALTHY AGING IN CHINA",
      intro: "Healthy aging is broader than cosmetic procedures. We help you explore individualized, provider-led assessment and practical wellness or recovery arrangements, without promising to reverse age, extend lifespan, or prevent disease.",
      image: image.aging,
      imageAlt: "A restorative wellness setting for travel and recovery planning",
      quickFacts: [["Evidence-aware", "Aging-related tests and interventions need a clear purpose and clinical review."], ["Whole-person planning", "Discuss function, skin health, sleep, movement, nutrition, and follow-up with professionals."], ["No longevity promises", "No test or package can guarantee lifespan, disease prevention, or a “biological age” result." ]],
      sections: [
        ["A practical meaning of healthy aging", "Healthy-aging services should focus on health, daily function, and personal goals—not a promise to reverse aging. A qualified clinician decides which assessment or intervention is appropriate based on a person’s history, examination, risks, and preferences. We help coordinate questions and arrangements; we do not diagnose, interpret personal test results, or recommend a treatment plan."],
        ["Current options are confirmed one by one", "Providers, tests, programs, and city availability change. We do not present a technology as “cutting edge” or effective merely because it is new or marketed as regenerative. Before arranging any clinical service, we confirm the provider, facility scope, exact product or device, approvals, cost, consent process, and follow-up with the relevant provider."],
      ],
      topics: [
        { title: "Preventive health and age-appropriate assessment", summary: "Start with a clinician-led discussion of goals and risk factors, not the largest possible test package.", examples: "An individualized consultation; selected blood, cardiovascular, bone-health, or other assessments only where a qualified clinician identifies a reason; review of existing records shared directly with the provider.", questions: "Ask what decision each test could inform, whether it is recommended for your situation, what false positives or follow-up might result, who interprets findings, what is not included, and how results will be shared with your home clinician." },
        { title: "Skin, hair, and appearance over time", summary: "Medical dermatology and aesthetic services can address specific concerns, but do not stop biological aging.", examples: "Assessment of sun damage, pigment, texture, acne or scars, hair loss, and appropriate laser, light, prescription, or aesthetic options; see our Medical Aesthetics page for procedure categories.", questions: "Ask for the diagnosis or concern being addressed, evidence and alternatives, exact product/device approvals, skin-type risks, recovery, and the full cost. Avoid packages promising to erase age or permanently prevent normal aging." },
        { title: "Strength, mobility, sleep, and recovery", summary: "Function and daily wellbeing may be more useful goals than a single “biological age” score.", examples: "Where offered, clinician-led functional or rehabilitation assessment, supervised movement or recovery programs, sleep or nutrition consultations, and practical accommodation or transport planning.", questions: "Clarify whether each item is clinical or wellness support, who supervises it, what credentials they hold, what goals and reassessment method are used, and whether ongoing support is available after travel." },
        { title: "Age-related specialist consultations", summary: "Some concerns benefit from a focused specialist conversation rather than a broad anti-aging package.", examples: "Depending on individual needs and provider availability: dermatology, bone and joint health, menopause-related care, cardiovascular risk, metabolic health, or rehabilitation consultations.", questions: "Ask which specialist is appropriate, what records or tests they need, which services are available to international visitors, how the consultation is billed, and how recommendations can be coordinated with your clinician at home." },
        { title: "Genetic testing and personalized health claims", summary: "A genetic test is not a diagnosis, destiny, lifespan forecast, or guaranteed way to choose treatment.", examples: "Genetic testing may be explored only when a qualified provider explains the purpose, limitations, consent, data handling, and access to qualified interpretation.", questions: "Ask whether the result will change a clinical decision, who interprets it, what incidental findings could appear, how data is stored or shared, and whether a test is approved and appropriate for the stated use." },
        { title: "Regenerative and longevity-branded interventions", summary: "New branding is not proof of approval, safety, or effectiveness.", examples: "We do not present stem-cell or gene interventions, exosome injections, or other “regenerative” claims as routine anti-aging services. They require specific regulatory and clinical verification; research status is not the same as an approved commercial treatment.", questions: "Ask for the exact product or technology, NMPA or other relevant approval, approved indication, trial registration and ethics oversight if research is involved, and the provider’s legal authority. Do not pay for a treatment described only as experimental, unapproved, “guaranteed,” or “risk-free.”" },
      ],
      sourceTitle: "Official sources and verification",
    },
  },
  zh: {
    "medical-aesthetics-in-china": {
      title: "中国医疗美容服务 | China Care Guide",
      description: "从中国流行的超声炮、超声刀、热玛吉，到韩国热门的 Rejuran、水光针、激光和整形项目，定制赴华医疗美容行程。",
      eyebrow: "医疗美容与健康老龄化",
      intro: "想了解超声炮、超声刀、热玛吉、水光针、激光美容，或更完整的医美焕新计划？我们协助联系中国医疗机构、安排直接面诊，并可按需加入口译、陪诊和旅行支持。",
      image: image.aesthetics,
      imageAlt: "当代医疗美容咨询环境",
      quickFacts: [["中国热门项目", "超声炮、热玛吉、水光针、激光和注射美容。"], ["2026 韩国流行趋势", "Ultherapy Prime、Rejuran、Juvelook、Sofwave、ONDA 等，视当地可提供情况。"], ["行程按需定制", "可只安排一次就诊，也可组合口译、陪诊与旅行支持。"]],
      sections: [
        ["项目丰富，选择从你的兴趣开始", "中国医疗美容机构覆盖能量设备紧致、肤质改善、注射美容、激光皮肤管理及整形咨询。很多人从一个明确兴趣开始——例如提拉紧致、肤色、补水或面部轮廓——再由面诊医生根据本人诉求介绍方案。"],
        ["结合中韩医美潮流，安排中国就诊", "韩国医美以能量提拉设备和重视肤质的项目受到关注；在中国，患者也可以了解本地可提供的设备和产品，以及部分韩国品牌。告诉我们你关注的项目或品牌，我们协助向中国医疗机构了解并安排就诊。"],
        ["医疗机构直接提供医疗服务", "面诊、项目说明、临床评估和治疗由医疗机构的医生及团队直接负责。我们协助安排预约、口译、陪同和出行细节，让赴华过程更顺畅。医疗费用由你直接支付给医疗机构；协调服务按你选择的内容另行收费。"],
      ],
      topics: [
        { title: "聚焦超声：超声炮、超声刀与 Ultherapy", summary: "中国最受关注的非手术提拉项目类别之一。", examples: "超声炮类聚焦超声平台、半岛超声炮、Ultraformer，以及常被称为“超声刀”的 Ultherapy/Ultherapy Prime。", questions: "告诉我们感兴趣的设备或项目，我们可向中国医疗机构了解可安排情况并协助预约面诊。" },
        { title: "热玛吉与2026年韩国热门提拉项目", summary: "射频与超声是韩国医美中备受关注的两类紧致项目。", examples: "Thermage FLX、Ultherapy Prime、Sofwave、ONDA 等韩国诊所常见的提拉设备；中国当地可提供的型号因机构而异。", questions: "可指定品牌，也可说明想了解的效果方向；我们协助询问中国当地的同类选项并安排预约与口译。" },
        { title: "水光针与韩系肤质项目", summary: "补水注射和皮肤质感项目是韩国美容潮流的重要部分。", examples: "水光针、skin booster，以及 Rejuran、Juvelook 等韩国品牌/项目，视中国当地可提供情况而定。", questions: "告诉我们感兴趣的品牌或项目风格，医疗机构医生会直接介绍当地可提供的产品和方案。" },
        { title: "肉毒素、玻尿酸与面部精修", summary: "可围绕表情纹、面部饱满度、轮廓和整体协调安排咨询。", examples: "肉毒素、玻尿酸填充、胶原刺激类注射及医疗机构提供的其他注射美容项目。", questions: "我们协助预约并提供口译，让你能与医生直接沟通个人审美目标。" },
        { title: "激光、光子与微针焕肤", summary: "针对肤色、肤质、毛孔、痘印痘坑或脱毛等方向了解项目。", examples: "皮秒及其他色素管理激光、光子嫩肤、点阵激光、黄金微针/射频微针、痘印痘坑护理与激光脱毛。", questions: "告诉我们关注的方向，我们可以协助安排单项咨询，或把多个皮肤诉求整理为一次就诊。" },
        { title: "整形美容咨询", summary: "计划手术类美容时，可先安排医疗机构的专科面诊。", examples: "双眼皮、隆鼻、面部轮廓、面部提升、胸部整形、吸脂塑形、瘢痕修复及毛发移植等，视机构安排而定。", questions: "我们可协助联系相关医疗机构，并协调咨询、口译、陪同与恢复期住宿行程。" },
        { title: "眉形设计与美容附加项目", summary: "可以围绕就诊计划加入希望体验的个人美容服务。", examples: "眉形设计、修眉及半永久眉妆等独立附加项目，视当地服务情况而定。", questions: "如希望把美容附加项目纳入行程，可告诉我们；我们会与医疗就诊分开安排。" },
      ],
      sourceTitle: "了解中国与韩国医疗美容项目",
    },
    "healthy-aging": {
      title: "中国健康老龄化服务 | China Care Guide",
      description: "了解中国由医疗专业人员评估的预防保健、皮肤健康、功能维护与康复选项，不承诺逆龄或延长寿命。",
      eyebrow: "中国健康老龄化",
      intro: "健康老龄化不只是美容项目。我们协助了解个性化、由专业人员评估的健康管理与实际康复安排，不承诺逆转年龄、延长寿命或预防疾病。",
      image: image.aging,
      imageAlt: "适合旅行及恢复规划的康养环境",
      quickFacts: [["审慎看待证据", "年龄相关检查和干预应有明确目的并经过临床评估。"], ["关注整体功能", "与专业人员讨论功能、皮肤、睡眠、活动、营养及后续安排。"], ["不作长寿承诺", "任何检查或套餐都不能保证寿命、预防疾病或“生物年龄”结果。"]],
      sections: [
        ["务实理解健康老龄化", "健康老龄化服务应关注健康、日常功能和个人目标，而不是承诺逆龄。由合格医生根据个人病史、检查、风险和偏好判断哪些评估或干预适合。我们帮助协调问题和实际安排，不诊断、不解释个人检查结果，也不推荐治疗方案。"],
        ["当前项目需逐项确认", "服务方、检查和项目安排会变化。我们不会仅因某项技术较新或被称为“再生”就宣传其处于前沿或有效。安排临床服务前，应向相关服务方确认机构、执业范围、具体产品/设备、审批信息、费用、知情同意及后续安排。"],
      ],
      topics: [
        { title: "预防保健与适龄评估", summary: "先由医生讨论目标和风险，而不是默认检查项目越多越好。", examples: "个体化咨询；仅在合格医生认为有必要时，了解部分血液、心血管、骨骼健康或其他评估；由服务方直接审阅用户主动提供的既往资料。", questions: "询问每项检查可能影响什么决定、是否适用于个人、可能出现哪些假阳性或后续检查、由谁解释结果、哪些项目不包含，以及如何与本地医生沟通报告。" },
        { title: "皮肤、毛发与年龄相关外观", summary: "皮肤科和医疗美容可处理具体问题，但不能阻止生理衰老。", examples: "由专业人员评估日晒损伤、色素、肤质、痤疮或瘢痕、脱发，以及适合的激光、光疗、处方或美容项目；具体类别可见医疗美容页面。", questions: "确认要处理的诊断或问题、证据和替代方案、产品/设备审批、肤质风险、恢复及完整费用。避免承诺抹去年龄或永久阻止正常衰老的套餐。" },
        { title: "肌力、活动、睡眠与恢复", summary: "功能和日常状态可能比一个“生物年龄”分数更有实际意义。", examples: "视服务方而定，可了解专业功能或康复评估、监督下的活动/恢复项目、睡眠或营养咨询，以及住宿和交通规划。", questions: "确认项目属于临床治疗还是健康支持、谁负责监督、具备什么资质、如何设定和复评目标，以及旅行后是否能继续跟进。" },
        { title: "年龄相关专科咨询", summary: "具体问题有时更适合专科面谈，而非宽泛的抗衰套餐。", examples: "根据个人需求及服务方安排，可了解皮肤科、骨与关节健康、更年期相关照护、心血管风险、代谢健康或康复咨询。", questions: "询问适合联系哪类专科、需要哪些既往资料或检查、国际访客可使用哪些服务、咨询如何收费，以及如何与本地医生协调。" },
        { title: "遗传检测与个性化健康宣传", summary: "遗传检测不是诊断、命运、寿命预测，也不保证能选出治疗方案。", examples: "仅在专业人员说明检测目的、局限、知情同意、数据处理及专业解读安排后，才考虑了解遗传检测。", questions: "询问结果是否会改变临床决策、由谁解读、可能发现哪些意外信息、数据如何存储或分享，以及检测是否获准用于所述目的。" },
        { title: "再生医学及长寿概念项目", summary: "新颖名称不等于获批、安全或有效。", examples: "我们不会把干细胞或基因干预、外泌体注射或其他“再生”宣传作为常规抗衰服务。此类项目需要核实具体监管和临床状态；研究项目不等于获批商业治疗。", questions: "询问具体产品或技术、NMPA 或其他相关批准、获准适应范围；若为研究，核实试验登记和伦理审查，以及机构是否合法获准开展。不要为仅被称作实验性、未获批、“保证有效”或“零风险”的项目付款。" },
      ],
      sourceTitle: "官方资料与核实入口",
    },
  },
};

const officialSources = [
  { label: "National Health Commission: Regulations on Medical Aesthetic Services", zh: "国家卫健委：《医疗美容服务管理办法》", href: "https://www.nhc.gov.cn/wjw/c100221/202201/d7e8fa33a26b425da98d69fb04191699.shtml" },
  { label: "National Health Commission: Classification Catalogue of Medical Aesthetic Procedures", zh: "国家卫健委：《医疗美容项目分级管理目录》", href: "https://www.nhc.gov.cn/zwgkzt/pyzgl1/200912/45119.shtml" },
  { label: "Medical Korea: International patient treatment directory", zh: "韩国医疗观光：国际患者医疗机构与美容项目目录", href: "https://www.medicalkorea.or.kr/en/mostvisitedmedicalinstitutions/view?medicalProviderNo=39171" },
  { label: "NMPA: Medical-device registration lookup", zh: "国家药监局：医疗器械注册信息查询", href: "https://www.nmpa.gov.cn/zwfwqjd/index.html" },
  { label: "Shanghai Municipal Government: Local medical-aesthetic procedure catalogue", zh: "上海市政府：本地医疗美容服务项目目录", href: "https://www.shanghai.gov.cn/gwk/search/content/c29ce99227a94ffda0c1d2368f011c09" },
  { label: "National Health Commission: 2025 guidance on cell and gene interventions", zh: "国家卫健委：2025年细胞与基因治疗相关提示", href: "https://www.nhc.gov.cn/xcs/c100122/202512/f180eb7d09c3431c83d4c864ca25ab0e.shtml" },
];

export default function AestheticCarePage({ locale, kind }: { locale: Locale; kind: "medical-aesthetics-in-china" | "healthy-aging" }) {
  const page = data[locale][kind];
  const isChinese = locale === "zh";
  const isAesthetic = kind === "medical-aesthetics-in-china";
  const pageSources = isAesthetic ? officialSources.slice(0, 3) : officialSources;
  const otherKind = kind === "medical-aesthetics-in-china" ? "healthy-aging" : "medical-aesthetics-in-china";
  useEffect(() => {
    document.title = page.title;
    document.documentElement.lang = isChinese ? "zh-CN" : "en";
    const setMeta = (selector: string, value: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) { meta = document.createElement("meta"); document.head.append(meta); }
      meta.content = value;
    };
    setMeta('meta[name="description"]', page.description);
    setMeta('meta[property="og:title"]', page.title);
    setMeta('meta[property="og:description"]', page.description);
    setMeta('meta[property="og:type"]', "article");
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = `${window.location.origin}${localizedPath(`/services/${kind}`, "en")}`;
    document.querySelectorAll('link[data-care-alternate="true"]').forEach((node) => node.remove());
    for (const language of ["en", "zh"] as const) {
      const alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = language === "zh" ? "zh-CN" : "en";
      alternate.href = `${window.location.origin}${localizedPath(`/services/${kind}`, language)}`;
      alternate.dataset.careAlternate = "true";
      document.head.append(alternate);
    }
    let schema = document.getElementById("care-page-structured-data") as HTMLScriptElement | null;
    if (!schema) { schema = document.createElement("script"); schema.id = "care-page-structured-data"; schema.type = "application/ld+json"; document.head.append(schema); }
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, dateModified: "2026-10-23", inLanguage: isChinese ? "zh-CN" : "en", url: `${window.location.origin}${localizedPath(`/services/${kind}`, locale)}`, isPartOf: { "@type": "WebSite", name: "China Care Guide", url: window.location.origin } });
    return () => { schema?.remove(); document.querySelectorAll('link[data-care-alternate="true"]').forEach((node) => node.remove()); };
  }, [isChinese, kind, locale, page]);

  return <div className="content-page care-detail-page">
    <header className="content-nav"><a className="brand" href={localizedPath("/", locale)}><span className="brand-mark">CC</span><span>CHINA CARE<br />GUIDE</span></a><nav><a href={localizedPath("/", locale)}>{isChinese ? "首页" : "Home"}</a><a href={localizedPath("/how-it-works", locale)}>{isChinese ? "服务流程" : "How it works"}</a><a className="button" href={localizedPath("/", locale, "", "#inquiry")}>{isChinese ? "定制咨询" : "Plan my visit"}</a><label className="content-language">{isChinese ? "语言" : "Language"}<select aria-label={isChinese ? "选择语言" : "Choose language"} value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label></nav></header>
    <main>
      <div className="breadcrumbs"><a href={localizedPath("/", locale)}>{isChinese ? "首页" : "Home"}</a><span>/</span><span>{page.eyebrow}</span></div>
      <section className="care-hero"><div className="care-hero-copy"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title.split(" | ")[0]}</h1><p>{page.intro}</p><a className="button" href={localizedPath("/", locale, "", "#inquiry")}>{isChinese ? "提交个性化咨询" : "Request an individual inquiry"}</a></div><figure><img src={page.image} alt={page.imageAlt} loading="eager" /><figcaption>{isChinese ? "图片用于展示服务环境，不代表特定医院或项目。" : "Illustrative image; it does not depict a specific hospital or treatment."}</figcaption></figure></section>
      <section className="care-facts" aria-label={isChinese ? "服务要点" : "Service principles"}>{page.quickFacts.map(([title, text]) => <article key={title}><h2>{title}</h2><p>{text}</p></article>)}</section>
      <section className="care-intro-section"><div><p className="eyebrow">{isAesthetic ? (isChinese ? "项目与行程协调" : "TREATMENTS & TRAVEL SUPPORT") : (isChinese ? "健康与功能规划" : "WELLBEING & FUNCTION")}</p><h2>{isAesthetic ? (isChinese ? "从感兴趣的项目开始，后续安排交给我们协调。" : "Start with the treatment you have in mind. We’ll help arrange the rest.") : (isChinese ? "以健康、功能和日常生活为中心。" : "Keep health, function, and everyday life in focus.")}</h2><a href={localizedPath(`/services/${otherKind}`, locale)}>{isChinese ? (kind === "healthy-aging" ? "了解医疗美容项目 →" : "了解健康老龄化 →") : (kind === "healthy-aging" ? "Explore medical aesthetics →" : "Explore healthy aging →")}</a></div><div>{page.sections.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="care-options"><div className="care-section-heading"><p className="eyebrow">{isChinese ? "可安排了解的项目" : "POPULAR OPTIONS TO EXPLORE"}</p><h2>{isAesthetic ? (isChinese ? "从热门项目中找到你的兴趣方向" : "Find your starting point among popular treatments.") : (isChinese ? "按个人目标与服务方情况逐项了解" : "Explore categories with a qualified provider.")}</h2><p>{isAesthetic ? (isChinese ? "以下介绍中韩医美中受到关注的项目类别。我们协助联系中国医疗机构，了解当地可安排项目并协调就诊。" : "Explore treatments drawing attention in China and Korea. We help you connect with a medical institution in China and coordinate a visit around your interests.") : (isChinese ? "以下为信息清单，不是治疗建议、项目排名或预约承诺。" : "These are information categories, not treatment recommendations, rankings, or booking promises.")}</p></div><div className="care-card-grid">{page.topics.map((topic, index) => <article className="care-option-card" key={topic.title}><div className="care-option-index">{String(index + 1).padStart(2, "0")}</div><h3>{topic.title}</h3><p>{topic.summary}</p><div><strong>{isChinese ? "项目示例" : "Popular examples"}</strong><p>{topic.examples}</p></div><div><strong>{isAesthetic ? (isChinese ? "我们可以协助" : "How we can help") : (isChinese ? "咨询时确认" : "Ask the provider")}</strong><p>{topic.questions}</p></div></article>)}</div></section>
      <section className="care-planning"><div className="care-planning-image"><img src={kind === "healthy-aging" ? image.aesthetics : image.aging} alt={isChinese ? "个性化服务与行程规划环境示意" : "Illustrative image for individualized service and trip planning"} loading="lazy" /></div><div><p className="eyebrow">{isChinese ? "按需要组合服务" : "BUILD THE SUPPORT YOU NEED"}</p><h2>{isChinese ? "单项协助，或完整行程定制" : "One service or a tailored visit."}</h2><p>{isChinese ? "你可以只咨询陪诊、口译或预约协调，也可以根据需要组合服务方沟通、当地交通、住宿、旅行游览及就诊后实务支持。China Care Guide 的协调服务费与医院医疗费用分开说明；医疗费用由你直接向医院或服务方支付。具体服务、可用性、费用及第三方安排逐项确认。" : "You can ask about accompaniment, interpretation, or appointment coordination alone, or combine provider communication, local transport, accommodation, sightseeing, and practical post-visit support. China Care Guide’s coordination fee is described separately from hospital charges; you pay medical fees directly to the hospital or provider. Scope, availability, fees, and third-party arrangements are confirmed individually."}<a href={localizedPath("/terms-of-service", locale)}>{isChinese ? "查看费用与服务条款" : "See fees and service terms"}</a></p></div></section>
      {!isAesthetic && <section className="care-safety"><div><p className="eyebrow">{isChinese ? "服务方核验清单" : "A PROVIDER CHECKLIST"}</p><h2>{isChinese ? "预约前，问清这些细节" : "Questions to settle before booking."}</h2></div><ul>{(isChinese ? ["机构是否持有对应执业许可，且项目在核准范围内？", "医生的执业注册、专科经验及操作资质是什么？", "所用药品、填充材料或设备的准确名称、注册证号、获准用途和追溯信息是什么？", "费用是否列明医生咨询、产品/设备、麻醉、复诊及可能额外收费？", "治疗风险、替代方案、恢复期、并发症处理及回国后随访如何安排？", "如何取得病历、检查报告、知情同意书和付款收据？"] : ["Does the institution hold the right license, and is the procedure within its approved scope?", "What are the clinician’s registration, specialty experience, and procedure credentials?", "What are the exact product/device name, registration number, approved use, and traceability details?", "Does the estimate itemize consultation, product/device, anesthesia, follow-up, and possible extras?", "How are risks, alternatives, recovery, complications, and follow-up after travel addressed?", "How will you receive records, reports, consent documents, and payment receipts?"]).map((item) => <li key={item}>{item}</li>)}</ul></section>}
      <section className="care-source-list"><h2>{page.sourceTitle}</h2><p>{isAesthetic ? (isChinese ? "以下资料介绍中国医疗美容管理要求及韩国面向国际患者的医美项目，可作为了解中韩项目的参考。" : "These references describe medical-aesthetic oversight in China and treatment categories listed for international patients in Korea.") : (isChinese ? "法规、项目目录和产品注册会变化；以下官方入口用于核实具体项目，不替代当地主管部门或医疗机构的确认。" : "Rules, catalogues, and product registrations can change. These official sources help verify a specific service and do not replace confirmation from the local authority or provider.")}</p><ul>{pageSources.map((source) => <li key={source.href}><a href={source.href} rel="noreferrer" target="_blank">{isChinese ? source.zh : source.label} ↗</a></li>)}</ul><small>{isChinese ? "资料核对日期：2026年10月23日。" : "Sources checked October 23, 2026."}</small></section>
      <section className="content-cta"><div><p className="eyebrow">{isChinese ? "先咨询，再决定" : "NO PRESSURE. CLEAR NEXT STEPS."}</p><h2>{isChinese ? "按你的需求了解可选安排。" : "Explore options around your needs."}</h2></div><a className="button" href={localizedPath("/", locale, "", "#inquiry")}>{isChinese ? "提交个性化咨询" : "Make an inquiry"}</a></section>
    </main>
    <footer className="content-footer"><strong>China Care Guide</strong><p>{isChinese ? "信息与非临床协调服务；不是医疗机构、保险公司或急救服务。" : "Information and non-clinical coordination; not a healthcare provider, insurer, or emergency service."}</p><div className="legal-footer-links"><a href={localizedPath("/privacy-policy", locale)}>{isChinese ? "隐私政策" : "Privacy Policy"}</a><a href={localizedPath("/terms-of-service", locale)}>{isChinese ? "服务条款" : "Terms of Service"}</a></div></footer>
  </div>;
}
