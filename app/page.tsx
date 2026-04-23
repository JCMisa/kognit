import ThemeToggler from "@/components/custom/ThemeToggler";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      Kognit <UserButton />
      <ThemeToggler />
    </div>
  );
}
