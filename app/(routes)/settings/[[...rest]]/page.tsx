import { DynamicThemeToggler } from "@/components/custom/DynamicThemeToggler";
import ThemeToggler from "@/components/custom/ThemeToggler";
import { SignOutButton, UserButton, UserProfile } from "@clerk/nextjs";
import { ThemePreview } from "../_components/ThemePreview";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center p-8 gap-8">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="w-full max-w-6xl space-y-10">
        <div className="flex flex-col sm:flex-row gap-5 justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Personalize your workspace and account.
            </p>
          </div>

          <div className="flex xl:hidden items-center gap-2">
            <UserButton />
            <SignOutButton>
              <Button className="w-32 p-4">Sign Out</Button>
            </SignOutButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Selectors */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Mode
              </h2>
              <ThemeToggler />
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Accent Color
              </h2>
              <DynamicThemeToggler />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground px-2">
              Live Preview
            </h2>
            <ThemePreview />
          </div>
        </div>

        {/* Bottom: Clerk Profile */}
        <section className="pt-10 border-t border-border/50 hidden xl:block">
          <Suspense
            fallback={
              <div className="h-20 w-full bg-muted/50 rounded animate-pulse" />
            }
          >
            <UserProfile
              path="/settings"
              appearance={{
                variables: {
                  colorPrimary: "var(--primary)",
                },
              }}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
