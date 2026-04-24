import HomeNavbar from "@/components/aceternity/HomeNavbar";
import ThemeToggler from "@/components/custom/ThemeToggler";
import { ScrollHero } from "@/components/ui-lora/ScrollHero";

export default function Home() {
  return (
    <main className="relative">
      <HomeNavbar />

      {/* hero section */}
      <section>
        <ScrollHero
          word="KOGNIT"
          accentColor="var(--primary)"
          image={"/hero-img.png"}
          subtext="Stop managing lists and start mastering your context."
          labels={["Context-Aware", "AI-Powered", "Next-Gen"]}
        />
      </section>

      <section className="min-h-[1000px]"></section>

      <div className="fixed bottom-3 right-3">
        <ThemeToggler />
      </div>
    </main>
  );
}
