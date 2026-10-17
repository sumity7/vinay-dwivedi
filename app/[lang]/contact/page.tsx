import type { Metadata } from "next";
import { PageHero } from "@/components/Chrome";
import { ContactSection } from "@/components/ContactSection";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "संपर्क करें" : "Contact" };
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
