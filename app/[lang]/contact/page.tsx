import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/Chrome";
import { ContactSection } from "@/components/ContactSection";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/contact", {
    title: hi ? "संपर्क करें" : "Contact",
    description: hi ? "मेहनौन विधायक विनय कुमार द्विवेदी के जनसंपर्क कार्यालय से संपर्क करें: फ़ोन, व्हाट्सऐप, ईमेल और मिलने का अनुरोध।" : "Contact the office of Mehnaun MLA Vinay Kumar Dwivedi: phone, WhatsApp, e-mail and meeting requests.",
  });
}

export default async function Contact({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "संपर्क", en: "Contact" } }]}
        title={{ hi: "संपर्क करें", en: "Get in touch" }}
        lead={{ hi: "जनहित के विषय, मुलाकात का अनुरोध, कार्यक्रम में आमंत्रण, सुझाव या अभियान से जुड़ने के लिए संपर्क करें।", en: "Get in touch about public matters, to request a meeting, invite the MLA to a programme, share a suggestion or volunteer." }}
      />
      <ContactSection lang={lang} />
    </>
  );
}
