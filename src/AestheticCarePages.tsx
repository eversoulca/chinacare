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
        { title: "Physician-led healthy-aging consultations", summary: "A broader age-management conversation alongside aesthetic care.", examples: "Depending on the institution: skin quality, hair, menopause, sleep, metabolic and bone health, nutrition, body composition, strength and daily function.", questions: "Tell us what you want to explore; we can help find a relevant consultation and coordinate the visit." },
        { title: "Emerging longevity research", summary: "New research is exciting, but it is not the same as a proven anti-aging treatment.", examples: "Senolytics, NAD-related approaches, stem-cell and exosome therapies remain under study and are not presented as routine age-reversal services.", questions: "We do not promote unapproved therapies or promise to reverse biological age. Research pathways are discussed only when an authorized study is confirmed." },
        { title: "Aesthetic surgery consultations", summary: "For patients considering a surgical change, start with a specialist consultation at a medical institution.", examples: "Eyelid surgery, rhinoplasty, facial contouring, facelift procedures, breast surgery, liposuction, scar revision, and hair restoration, depending on the institution.", questions: "We can help route your inquiry to a relevant medical institution and coordinate consultation, interpretation, accompaniment, and recovery-stay logistics." },
        { title: "Brows and beauty add-ons", summary: "A few finishing touches can be planned separately around a medical visit.", examples: "Brow shaping, eyebrow design, and semi-permanent eyebrow makeup where available.", questions: "Ask us to include a beauty add-on in your tailored itinerary; we arrange it separately from hospital treatment." },
      ],
      sourceTitle: "Learn about medical aesthetics in China and Korea",
    },
    "healthy-aging": {
      title: "Healthy Aging in China | China Care Guide",
      description: "Explore modern medical aesthetics and physician-led healthy-aging consultations in China, with selected cosmetic treatments and personalized visit support.",
      eyebrow: "HEALTHY AGING IN CHINA",
      intro: "Healthy aging can bring together skin rejuvenation, facial lifting, hair and skin care, and a broader medical review of sleep, metabolism, bone health and daily function. We help coordinate appointments with Chinese medical institutions and build the visit around your interests.",
      image: image.aging,
      imageAlt: "A restorative wellness setting for travel and recovery planning",
      quickFacts: [["Skin & facial rejuvenation", "Explore energy devices, injectables, skin quality and individualized aesthetic care."], ["Whole-person age management", "Ask about clinician-led metabolic, bone, sleep, nutrition and function reviews."], ["A tailored China visit", "Combine medical appointments with interpretation, accompaniment and travel support."]],
      sections: [
        ["A modern approach to feeling and looking well", "Some visitors are interested in skin firmness, texture, pigmentation or facial contour; others want to discuss menopause, sleep, metabolic health, bone strength, nutrition, or physical function. We help organize the right kind of appointment so the medical institution can hear your priorities and explain its services directly."],
        ["A blend of aesthetic technology and age-management care", "Chinese and Korean aesthetic clinics offer ultrasound and radiofrequency lifting, laser and light treatments, skin boosters, and injectable options. Some medical institutions also offer age-related consultations and assessments. We help you explore the categories that interest you; clinicians discuss the available approach and whether it fits your needs."],
      ],
      topics: [
        { title: "Energy-based lifting and skin tightening", summary: "Explore sought-after devices from China and Korea for a consultation focused on firmness and contour.", examples: "Focused ultrasound platforms, ultrasound cannon (超声炮), Ultherapy Prime, Thermage FLX, Sofwave, ONDA and radiofrequency microneedling, depending on local availability.", questions: "Tell us which device or concern interests you; we can help ask a clinic about availability and coordinate a physician consultation." },
        { title: "Skin quality, injectables, and aesthetic rejuvenation", summary: "Aesthetic visits can focus on hydration, texture, pigmentation, fine lines, facial balance or hair concerns.", examples: "Water-light injections, skin boosters, Rejuran, Juvelook, botulinum toxin, fillers, pico and fractional lasers, IPL, and collagen-stimulating procedures where offered.", questions: "We help arrange the visit and language support so the medical team can explain specific products and options directly." },
        { title: "Physician-led age-management review", summary: "For a broader conversation about health and function as you age.", examples: "Depending on the institution: cardiometabolic risk, sleep, nutrition, body composition, bone health, menopause or men's health, strength, balance and mobility.", questions: "Share the topics you want to discuss; we can help identify a relevant department or consultation and plan the trip around it." },
        { title: "Hair, scalp, and restorative appearance", summary: "Aesthetic care can also include concerns beyond facial skin.", examples: "Hair and scalp consultations, hair restoration, selected skin treatments and scar care, depending on the institution.", questions: "We can help connect your inquiry with a relevant medical institution and coordinate interpretation, appointment and travel support." },
        { title: "Emerging longevity research", summary: "Cellular aging and regenerative medicine are active research fields, not established anti-aging shortcuts.", examples: "Senolytics, NAD-related approaches, stem-cell and exosome therapies are under study; they are not presented here as routine age-reversal treatments. We only discuss a research pathway if a suitable, authorized clinical study is confirmed.", questions: "We do not arrange unapproved injections or promise biological-age reversal. A clinical study is distinct from a standard treatment or commercial wellness package." },
      ],
      sourceTitle: "Explore contemporary aesthetic and healthy-aging services",
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
        { title: "医生主导的健康抗衰咨询", summary: "在医美之外，了解与年龄相关的整体健康与日常功能。", examples: "视医疗机构安排，可了解皮肤、毛发、更年期、睡眠、代谢与骨骼健康、营养、身体成分、肌力及日常活动等。", questions: "告诉我们希望了解的方向，我们协助联系相关门诊并安排赴华就诊。" },
        { title: "前沿长寿研究", summary: "新技术值得关注，但研究进展不等于已经证实的抗衰治疗。", examples: "衰老细胞清除、NAD 相关方向、干细胞及外泌体疗法仍在研究中，本网站不将其作为常规逆龄项目宣传。", questions: "我们不推广未经批准的治疗，也不承诺逆转生物年龄；仅在确认获准研究项目后讨论研究咨询。" },
        { title: "整形美容咨询", summary: "计划手术类美容时，可先安排医疗机构的专科面诊。", examples: "双眼皮、隆鼻、面部轮廓、面部提升、胸部整形、吸脂塑形、瘢痕修复及毛发移植等，视机构安排而定。", questions: "我们可协助联系相关医疗机构，并协调咨询、口译、陪同与恢复期住宿行程。" },
        { title: "眉形设计与美容附加项目", summary: "可以围绕就诊计划加入希望体验的个人美容服务。", examples: "眉形设计、修眉及半永久眉妆等独立附加项目，视当地服务情况而定。", questions: "如希望把美容附加项目纳入行程，可告诉我们；我们会与医疗就诊分开安排。" },
      ],
      sourceTitle: "了解中国与韩国医疗美容项目",
    },
    "healthy-aging": {
      title: "中国健康抗衰与年龄管理 | China Care Guide",
      description: "了解中国医疗美容与健康抗衰服务，包括热门能量设备、肤质管理、医生主导的年龄相关健康评估及个性化赴华安排。",
      eyebrow: "中国健康抗衰与年龄管理",
      intro: "健康抗衰不只有美容项目。你可以了解超声与射频提拉、肤质管理、注射类医美，也可与中国医疗机构的医生讨论睡眠、代谢、骨骼健康、更年期、营养和日常功能等年龄相关问题。我们协助联系、口译与行程安排。",
      image: image.aging,
      imageAlt: "适合旅行及健康规划的康养环境",
      quickFacts: [["皮肤与面部年轻化", "了解能量设备、注射、肤质管理与个性化医美。"], ["整体年龄管理", "可咨询代谢、骨骼、睡眠、营养与身体功能评估。"], ["按需定制赴华行程", "可组合口译、陪诊、预约协调与旅行支持。"]],
      sections: [
        ["从外在状态到日常健康，一次规划多种关注点", "有人关注皮肤紧致、肤质、色斑或面部轮廓；也有人希望了解更年期、睡眠、代谢、骨骼、营养或体能。我们协助把你的兴趣整理成合适的预约方向，由医疗机构直接了解需求并介绍可提供的服务。"],
        ["医美科技与年龄管理并行", "中韩医疗美容机构提供超声与射频提拉、激光光电、肤质管理和注射类项目。部分医疗机构也提供年龄相关的健康咨询与评估。我们协助了解你感兴趣的项目类别，医生会直接沟通当地可提供的方案。"],
      ],
      topics: [
        { title: "超声与射频提拉", summary: "了解中韩热门能量设备，并围绕紧致与轮廓安排面诊。", examples: "聚焦超声、超声炮、Ultherapy Prime、Thermage FLX、Sofwave、ONDA 与射频微针等，视当地可提供情况而定。", questions: "告诉我们感兴趣的设备或诉求，我们可协助询问项目并安排医疗机构面诊。" },
        { title: "肤质管理、注射与再生美肤", summary: "可围绕补水、肤质、色素、细纹、面部协调或毛发问题了解项目。", examples: "水光针、skin booster、Rejuran、Juvelook、肉毒素、填充、皮秒与点阵激光、光子及胶原刺激类项目，视机构提供情况而定。", questions: "我们协助预约与口译，由医疗团队直接说明具体产品和项目。" },
        { title: "医生主导的年龄管理咨询", summary: "适合希望把健康与日常功能纳入考虑的人。", examples: "可了解心血管与代谢风险、睡眠、营养、身体成分、骨骼健康、更年期或男性健康、肌力、平衡与行动能力等方向。", questions: "告诉我们想讨论的主题，我们可协助联系相关科室或门诊，并安排赴华行程。" },
        { title: "头皮、毛发与修复美容", summary: "医美也可以关注面部以外的个人需求。", examples: "头皮与毛发咨询、毛发修复、部分皮肤治疗及瘢痕管理，视医疗机构安排而定。", questions: "我们可协助联系相关机构并协调口译、预约与旅行支持。" },
        { title: "前沿长寿研究", summary: "细胞衰老与再生医学是研究领域，并非已经确立的逆龄捷径。", examples: "衰老细胞清除、NAD 相关方向、干细胞及外泌体疗法仍在研究中；本网站不把它们作为常规抗衰治疗宣传。仅在核实合适且获准的临床研究后，才讨论研究咨询。", questions: "我们不安排未经批准的注射，也不承诺逆转生物年龄。临床研究与常规治疗或商业健康套餐不同。" },
      ],
      sourceTitle: "了解现代医疗美容与健康抗衰服务",
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
  { label: "National Institute on Aging: Senolytic therapy evidence update", zh: "美国国家老龄化研究所：衰老细胞清除疗法的人体研究进展", href: "https://www.nia.nih.gov/news/senolytic-therapy-shows-subtle-impact-age-related-bone-health-women" },
  { label: "FDA: Consumer alert on stem-cell and exosome products", zh: "美国 FDA：干细胞与外泌体产品消费者提示", href: "https://www.fda.gov/vaccines-blood-biologics/consumers-biologics/consumer-alert-regenerative-medicine-products-including-stem-cells-and-exosomes" },
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
      <section className="care-options"><div className="care-section-heading"><p className="eyebrow">{isChinese ? "可安排了解的项目" : "POPULAR OPTIONS TO EXPLORE"}</p><h2>{isAesthetic ? (isChinese ? "从热门项目中找到你的兴趣方向" : "Find your starting point among popular treatments.") : (isChinese ? "按你关注的年龄管理方向选择咨询" : "Choose age-management topics that matter to you.")}</h2><p>{isAesthetic ? (isChinese ? "以下介绍中韩医美与抗衰中受到关注的项目类别。我们协助联系中国医疗机构，了解当地可安排项目并协调就诊。" : "Explore aesthetic and age-management services drawing attention in China and Korea. We help coordinate a visit around your interests.") : (isChinese ? "从皮肤与外观到年龄相关健康，可按兴趣了解相应的医疗咨询与行程安排。" : "From skin and appearance to broader age-related health, explore consultations and visit support around your interests.")}</p></div><div className="care-card-grid">{page.topics.map((topic, index) => <article className="care-option-card" key={topic.title}><div className="care-option-index">{String(index + 1).padStart(2, "0")}</div><h3>{topic.title}</h3><p>{topic.summary}</p><div><strong>{isChinese ? "项目示例" : "Popular examples"}</strong><p>{topic.examples}</p></div><div><strong>{isChinese ? "我们可以协助" : "How we can help"}</strong><p>{topic.questions}</p></div></article>)}</div></section>
      <section className="care-planning"><div className="care-planning-image"><img src={kind === "healthy-aging" ? image.aesthetics : image.aging} alt={isChinese ? "个性化服务与行程规划环境示意" : "Illustrative image for individualized service and trip planning"} loading="lazy" /></div><div><p className="eyebrow">{isChinese ? "按需要组合服务" : "BUILD THE SUPPORT YOU NEED"}</p><h2>{isChinese ? "单项协助，或完整行程定制" : "One service or a tailored visit."}</h2><p>{isChinese ? "你可以只咨询陪诊、口译或预约协调，也可以根据需要组合服务方沟通、当地交通、住宿、旅行游览及就诊后实务支持。China Care Guide 的协调服务费与医院医疗费用分开说明；医疗费用由你直接向医院或服务方支付。具体服务、可用性、费用及第三方安排逐项确认。" : "You can ask about accompaniment, interpretation, or appointment coordination alone, or combine provider communication, local transport, accommodation, sightseeing, and practical post-visit support. China Care Guide’s coordination fee is described separately from hospital charges; you pay medical fees directly to the hospital or provider. Scope, availability, fees, and third-party arrangements are confirmed individually."}<a href={localizedPath("/terms-of-service", locale)}>{isChinese ? "查看费用与服务条款" : "See fees and service terms"}</a></p></div></section>
      <section className="care-source-list"><h2>{page.sourceTitle}</h2><p>{isAesthetic ? (isChinese ? "以下资料介绍中国医疗美容管理要求及韩国面向国际患者的医美项目，可作为了解中韩项目的参考。" : "These references describe medical-aesthetic oversight in China and treatment categories listed for international patients in Korea.") : (isChinese ? "以下资料介绍医疗美容管理、医疗机构服务以及抗衰研究进展。实际可安排的临床服务由医疗机构直接沟通。" : "These references describe medical-aesthetic oversight, clinical services and emerging aging research. Medical institutions discuss their current services directly.")}</p><ul>{pageSources.map((source) => <li key={source.href}><a href={source.href} rel="noreferrer" target="_blank">{isChinese ? source.zh : source.label} ↗</a></li>)}</ul><small>{isChinese ? "资料核对日期：2026年10月23日。" : "Sources checked October 23, 2026."}</small></section>
      <section className="content-cta"><div><p className="eyebrow">{isChinese ? "先咨询，再决定" : "NO PRESSURE. CLEAR NEXT STEPS."}</p><h2>{isChinese ? "按你的需求了解可选安排。" : "Explore options around your needs."}</h2></div><a className="button" href={localizedPath("/", locale, "", "#inquiry")}>{isChinese ? "提交个性化咨询" : "Make an inquiry"}</a></section>
    </main>
    <footer className="content-footer"><strong>China Care Guide</strong><p>{isChinese ? "信息与非临床协调服务；不是医疗机构、保险公司或急救服务。" : "Information and non-clinical coordination; not a healthcare provider, insurer, or emergency service."}</p><div className="legal-footer-links"><a href={localizedPath("/privacy-policy", locale)}>{isChinese ? "隐私政策" : "Privacy Policy"}</a><a href={localizedPath("/terms-of-service", locale)}>{isChinese ? "服务条款" : "Terms of Service"}</a></div></footer>
  </div>;
}
