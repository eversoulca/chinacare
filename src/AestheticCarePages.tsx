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
      description: "Explore clinician-led skin, injectable, energy-based, and selected surgical aesthetic options in China, with product checks, transparent estimates, and individualized travel coordination.",
      eyebrow: "MEDICAL AESTHETICS IN CHINA",
      intro: "Explore contemporary aesthetic-care categories with a qualified provider. We help organize questions, verify practical details, separate clinical fees from coordination costs, and tailor non-clinical support to your plans.",
      image: image.aesthetics,
      imageAlt: "A calm, professional aesthetic-care consultation setting",
      quickFacts: [["Provider-led", "Consultation and treatment decisions belong to a qualified clinician."], ["Product-specific", "Device, drug, and filler registration and intended use must be checked individually."], ["Made to fit your trip", "Ask for a single appointment support service or a wider customized plan."]],
      sections: [
        ["What “advanced” means here", "The options below are established technology categories discussed in modern aesthetic practice, not a ranking of China or a promise that a particular product is approved, available, or right for you. A device’s brand name is not proof of its current Chinese registration, approved purpose, operator qualifications, or suitability. We confirm exact details with the provider for each inquiry."],
        ["A clinical service, not a beauty-counter treatment", "China’s medical-aesthetics rules define procedures involving medicines, medical devices, surgery, or invasive techniques as medical services. In China, these treatments must be delivered by an appropriately licensed medical institution and qualified medical professionals within their approved scope. A consultation should cover expected benefits, alternatives, risks, contraindications, aftercare, and written informed consent."],
      ],
      topics: [
        { title: "Energy-based skin tightening and lifting", summary: "A clinician may discuss device-based options for selected concerns after examination.", examples: "Monopolar radiofrequency (including Thermage-type systems), other radiofrequency platforms, microfocused or high-intensity focused ultrasound, and selected combination approaches.", questions: "Ask for the exact device and model, current NMPA registration number, approved intended use, treatment area, operator credentials, alternatives, likely number of sessions, recovery, and adverse-event plan. “Thermage” or “HIFU” as a name alone does not confirm approval or suitability." },
        { title: "Lasers, IPL, and light-based dermatology", summary: "Different systems target different skin concerns; the wavelength and indication matter.", examples: "Fractional and resurfacing lasers, pigment-focused Q-switched or picosecond platforms, vascular lasers, hair-reduction lasers, intense pulsed light (IPL), and selected light therapies.", questions: "Ask which diagnosis or appearance concern is being treated, why this wavelength/device is proposed for your skin, who will operate it, what sun precautions apply, what recovery and pigment-change risks exist, and whether more than one session is expected." },
        { title: "Botulinum toxin A and other prescription injectables", summary: "A medical consultation is needed to review goals, contraindications, product, and dose.", examples: "Botulinum toxin A injections for product-specific, approved indications; other prescription treatments only when the medicine and use are confirmed by the treating clinician.", questions: "Ask the product’s Chinese approval and traceability details, the clinician’s qualifications, the proposed treatment area, alternatives, expected duration as stated by the provider, potential side effects, and how urgent complications are handled. Do not buy or inject products outside a qualified medical institution." },
        { title: "Hyaluronic-acid and other registered fillers", summary: "Fillers are medical devices or materials with product-specific approved uses and risks.", examples: "Registered hyaluronic-acid gels and other fillers only when the specific product, model, treatment site, and intended use are confirmed.", questions: "Ask to see the exact product name, registration details, packaging and traceability, injection site and depth, who injects it, reversibility or complication planning, and total fee. Injections can cause serious complications, including vascular blockage and vision injury; discuss risks and emergency arrangements with the clinician." },
        { title: "“Water-light” injections and skin boosters", summary: "“Water-light” is a broad market term, not one standardized product or treatment protocol.", examples: "Mesotherapy or intradermal microinjection procedures and skin-hydration products, if the clinic confirms that the exact drug or device is registered for that specific use.", questions: "Ask what substance is actually injected, its product registration and intended use, whether it is a medicine or device, how it is stored and traced, why injection is proposed instead of a non-invasive alternative, and what evidence and risks apply. A treatment name does not establish ingredient, approval, or a guaranteed hydration result." },
        { title: "Microneedling, radiofrequency microneedling, and peels", summary: "Needling and chemical peels vary in depth and may involve infection, pigment, scarring, or downtime risks.", examples: "Clinician-performed microneedling, device-based radiofrequency microneedling, and superficial or deeper chemical-peel approaches where permitted and within the clinic’s scope.", questions: "Confirm who performs the procedure, device/product registration, depth and treatment purpose, sterile single-use components, skin-type considerations, aftercare, expected recovery, and how complications are managed. Do not assume a salon or home device can provide the same medical service." },
        { title: "Selected surgical and restorative procedures", summary: "Where appropriate, surgical options require specialist assessment and a facility authorized for the procedure level.", examples: "Eyelid or brow procedures, selected facial rejuvenation operations, scar revision, hair restoration, or other procedures after an in-person assessment and provider confirmation.", questions: "Confirm the named surgeon and specialty, facility license and authorized scope, anesthesia and facility arrangements, written risks and alternatives, recovery stay, companion needs, total itemized charges, and follow-up after returning home." },
        { title: "Brows and other optional beauty details", summary: "Non-invasive grooming and skin-penetrating cosmetic tattooing are not the same service.", examples: "Brow shaping or makeup may be non-medical grooming. Microblading, permanent eyebrow makeup, tattooing, or removal can involve skin penetration or medical treatment; classification and permitted providers can vary by location.", questions: "Before adding this to a trip, ask the local health authority or a licensed provider which rules apply, who is authorized to perform it, what pigments and sterile tools are used, and whether it is included in the clinic’s registered scope. We do not book an unlicensed injection or invasive treatment in a salon, hotel, or home." },
      ],
      sourceTitle: "Official sources and verification",
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
      description: "了解中国由医疗专业人员评估的皮肤、注射、光电及部分手术美容项目，并核对产品、费用与个性化行程安排。",
      eyebrow: "中国医疗美容",
      intro: "与合格服务方了解当代医疗美容项目。我们协助整理问题、核实实际信息、区分临床费用与协调费用，并按你的行程定制非临床支持。",
      image: image.aesthetics,
      imageAlt: "专业、平静的医疗美容咨询环境",
      quickFacts: [["由服务方评估", "咨询及治疗决定应由合格医疗专业人员作出。"], ["逐项核对产品", "设备、药品及填充材料的注册和用途都需具体核实。"], ["按行程定制", "可了解单项陪诊服务，也可定制更完整的协调方案。"]],
      sections: [
        ["这里所说的“先进”", "下列项目是现代医疗美容中常被讨论的技术类别，不代表对中国或某项技术作排名，也不保证某个产品已获批、可提供或适合你。设备品牌名不能证明它在中国当前的注册状态、获准用途、操作者资质或个人适宜性。我们会针对每项咨询向服务方确认具体信息。"],
        ["医疗服务，不是普通美容柜台项目", "中国医疗美容管理规则将使用药物、医疗器械、手术或侵入性技术的项目纳入医疗服务。相关项目应在具备相应资质的医疗机构内，由符合要求的医疗专业人员在获准范围内开展。治疗前应了解预期获益、替代方案、风险、禁忌、术后护理，并完成书面知情同意。"],
      ],
      topics: [
        { title: "能量设备紧致与提升", summary: "医生检查后，可讨论针对特定诉求的设备类选项。", examples: "单极射频（例如 Thermage 类系统）、其他射频平台、微聚焦或高强度聚焦超声，以及部分联合方案。", questions: "询问设备和型号、当前 NMPA 注册证编号、获准用途、治疗部位、操作者资质、替代方案、预计治疗次数、恢复期及不良事件处理。“热玛吉”或“HIFU”名称本身不能证明已经获批或适合个人。" },
        { title: "激光、IPL 与光电皮肤治疗", summary: "不同设备针对不同皮肤问题，波长、设备和适应范围都很重要。", examples: "点阵及皮肤重塑激光、针对色素的调 Q 或皮秒平台、血管类激光、脱毛激光、强脉冲光（IPL）及部分光疗。", questions: "询问治疗针对的诊断或外观问题、为何该波长/设备适用于你的皮肤、由谁操作、防晒要求、色素改变及恢复风险，以及是否需要多次治疗。" },
        { title: "A 型肉毒毒素及其他处方注射", summary: "需要医疗评估目标、禁忌、产品和剂量。", examples: "仅在产品注册适应范围内讨论 A 型肉毒毒素注射；其他处方治疗也需由临床医生核实药品及用途。", questions: "询问产品在中国的批准与追溯信息、医生资质、拟治疗部位、替代方案、服务方说明的预期维持时间、可能不良反应及紧急处理方式。不要购买或在非正规医疗机构注射产品。" },
        { title: "透明质酸及其他已注册填充材料", summary: "填充材料有各自获批用途与风险，需核实到具体产品。", examples: "仅在确认具体产品、型号、治疗部位及预期用途后，了解已注册的透明质酸凝胶及其他填充材料。", questions: "要求查看产品名称、注册信息、包装和追溯方式、注射位置与层次、操作者、可逆性或并发症处理方案及分项费用。注射可能引发严重并发症，包括血管阻塞及视力损伤；应与医生讨论风险和紧急处理安排。" },
        { title: "“水光针”与皮肤微注射", summary: "“水光针”是宽泛的市场称呼，不是单一标准产品或固定治疗方案。", examples: "在诊所确认具体药品或器械已注册用于相应用途的前提下，了解美塑或真皮内微注射等项目。", questions: "询问实际注射物是什么、注册及用途、属于药品还是器械、储存和追溯方式、为何选择注射而非非侵入性方案，以及相应证据和风险。项目名称不能证明成分、审批状态或保证补水效果。" },
        { title: "微针、射频微针与化学焕肤", summary: "微针和化学焕肤的深度不同，可能涉及感染、色素变化、瘢痕及恢复期风险。", examples: "由医疗人员实施的微针、设备类射频微针，以及在机构许可范围内的浅层或较深层化学焕肤。", questions: "确认操作者、设备/产品注册、治疗深度与目的、一次性无菌部件、肤质风险、术后护理、恢复期及并发症处理。不要假设美容院或家用设备可以提供同等医疗服务。" },
        { title: "部分手术及修复类项目", summary: "如考虑手术，须由专科评估，并确认机构可开展相应级别项目。", examples: "经面诊评估后，可了解眼睑或眉部手术、部分面部年轻化手术、瘢痕修复、毛发移植或其他项目。", questions: "确认医生姓名及专科、机构执业许可和项目范围、麻醉及手术条件、书面风险和替代方案、恢复停留时间、陪同需求、分项总费用，以及回国后的随访安排。" },
        { title: "眉部及其他附加美容项目", summary: "非侵入性修眉与刺破皮肤的纹饰并非同一服务。", examples: "修眉或化妆可能属于非医疗美容服务；微针纹眉、半永久纹眉、纹饰或清洗可能涉及皮肤损伤或医疗操作，分类和可开展机构可能因地区而异。", questions: "加入行程前，向当地卫生部门或合规服务方确认适用规则、可操作人员、色料和无菌工具，以及是否属于机构核准范围。我们不会安排在无资质美容院、酒店或住所进行注射或侵入性治疗。" },
      ],
      sourceTitle: "官方资料与核实入口",
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
  { label: "NMPA: Medical-device registration lookup", zh: "国家药监局：医疗器械注册信息查询", href: "https://www.nmpa.gov.cn/zwfwqjd/index.html" },
  { label: "Shanghai Municipal Government: Local medical-aesthetic procedure catalogue", zh: "上海市政府：本地医疗美容服务项目目录", href: "https://www.shanghai.gov.cn/gwk/search/content/c29ce99227a94ffda0c1d2368f011c09" },
  { label: "National Health Commission: 2025 guidance on cell and gene interventions", zh: "国家卫健委：2025年细胞与基因治疗相关提示", href: "https://www.nhc.gov.cn/xcs/c100122/202512/f180eb7d09c3431c83d4c864ca25ab0e.shtml" },
];

export default function AestheticCarePage({ locale, kind }: { locale: Locale; kind: "medical-aesthetics-in-china" | "healthy-aging" }) {
  const page = data[locale][kind];
  const isChinese = locale === "zh";
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
      <section className="care-intro-section"><div><p className="eyebrow">{isChinese ? "先核实，再安排" : "VERIFY BEFORE YOU BOOK"}</p><h2>{isChinese ? "让信息和边界都清楚" : "Clear options, clear boundaries."}</h2><a href={localizedPath(`/services/${otherKind}`, locale)}>{isChinese ? (kind === "healthy-aging" ? "了解医疗美容项目 →" : "了解健康老龄化 →") : (kind === "healthy-aging" ? "Explore medical aesthetics →" : "Explore healthy aging →")}</a></div><div>{page.sections.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="care-options"><div className="care-section-heading"><p className="eyebrow">{isChinese ? "可了解的服务类别" : "OPTIONS TO EXPLORE"}</p><h2>{isChinese ? "按个人目标与服务方情况逐项了解" : "Explore categories with a qualified provider."}</h2><p>{isChinese ? "以下为信息清单，不是治疗建议、项目排名或预约承诺。" : "These are information categories, not treatment recommendations, rankings, or booking promises."}</p></div><div className="care-card-grid">{page.topics.map((topic, index) => <article className="care-option-card" key={topic.title}><div className="care-option-index">{String(index + 1).padStart(2, "0")}</div><h3>{topic.title}</h3><p>{topic.summary}</p><div><strong>{isChinese ? "可能涉及" : "Examples"}</strong><p>{topic.examples}</p></div><div><strong>{isChinese ? "咨询时确认" : "Ask the provider"}</strong><p>{topic.questions}</p></div></article>)}</div></section>
      <section className="care-planning"><div className="care-planning-image"><img src={kind === "healthy-aging" ? image.aesthetics : image.aging} alt={isChinese ? "个性化服务与行程规划环境示意" : "Illustrative image for individualized service and trip planning"} loading="lazy" /></div><div><p className="eyebrow">{isChinese ? "按需要组合服务" : "BUILD THE SUPPORT YOU NEED"}</p><h2>{isChinese ? "单项协助，或完整行程定制" : "One service or a tailored visit."}</h2><p>{isChinese ? "你可以只咨询陪诊、口译或预约协调，也可以根据需要组合服务方沟通、当地交通、住宿、旅行游览及就诊后实务支持。China Care Guide 的协调服务费与医院医疗费用分开说明；医疗费用由你直接向医院或服务方支付。具体服务、可用性、费用及第三方安排逐项确认。" : "You can ask about accompaniment, interpretation, or appointment coordination alone, or combine provider communication, local transport, accommodation, sightseeing, and practical post-visit support. China Care Guide’s coordination fee is described separately from hospital charges; you pay medical fees directly to the hospital or provider. Scope, availability, fees, and third-party arrangements are confirmed individually."}<a href={localizedPath("/terms-of-service", locale)}>{isChinese ? "查看费用与服务条款" : "See fees and service terms"}</a></p></div></section>
      <section className="care-safety"><div><p className="eyebrow">{isChinese ? "服务方核验清单" : "A PROVIDER CHECKLIST"}</p><h2>{isChinese ? "预约前，问清这些细节" : "Questions to settle before booking."}</h2></div><ul>{(isChinese ? ["机构是否持有对应执业许可，且项目在核准范围内？", "医生的执业注册、专科经验及操作资质是什么？", "所用药品、填充材料或设备的准确名称、注册证号、获准用途和追溯信息是什么？", "费用是否列明医生咨询、产品/设备、麻醉、复诊及可能额外收费？", "治疗风险、替代方案、恢复期、并发症处理及回国后随访如何安排？", "如何取得病历、检查报告、知情同意书和付款收据？"] : ["Does the institution hold the right license, and is the procedure within its approved scope?", "What are the clinician’s registration, specialty experience, and procedure credentials?", "What are the exact product/device name, registration number, approved use, and traceability details?", "Does the estimate itemize consultation, product/device, anesthesia, follow-up, and possible extras?", "How are risks, alternatives, recovery, complications, and follow-up after travel addressed?", "How will you receive records, reports, consent documents, and payment receipts?"]).map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="care-source-list"><h2>{page.sourceTitle}</h2><p>{isChinese ? "法规、项目目录和产品注册会变化；以下官方入口用于核实具体项目，不替代当地主管部门或医疗机构的确认。" : "Rules, catalogues, and product registrations can change. These official sources help verify a specific service and do not replace confirmation from the local authority or provider."}</p><ul>{officialSources.map((source) => <li key={source.href}><a href={source.href} rel="noreferrer" target="_blank">{isChinese ? source.zh : source.label} ↗</a></li>)}</ul><small>{isChinese ? "资料核对日期：2026年10月23日。上海本地项目目录只说明当地要求，不代表全国统一安排。" : "Sources checked October 23, 2026. Shanghai’s local catalogue describes local rules and is not a nationwide service list."}</small></section>
      <section className="content-cta"><div><p className="eyebrow">{isChinese ? "先咨询，再决定" : "NO PRESSURE. CLEAR NEXT STEPS."}</p><h2>{isChinese ? "按你的需求了解可选安排。" : "Explore options around your needs."}</h2></div><a className="button" href={localizedPath("/", locale, "", "#inquiry")}>{isChinese ? "提交个性化咨询" : "Make an inquiry"}</a></section>
    </main>
    <footer className="content-footer"><strong>China Care Guide</strong><p>{isChinese ? "信息与非临床协调服务；不是医疗机构、保险公司或急救服务。" : "Information and non-clinical coordination; not a healthcare provider, insurer, or emergency service."}</p><div className="legal-footer-links"><a href={localizedPath("/privacy-policy", locale)}>{isChinese ? "隐私政策" : "Privacy Policy"}</a><a href={localizedPath("/terms-of-service", locale)}>{isChinese ? "服务条款" : "Terms of Service"}</a></div></footer>
  </div>;
}
