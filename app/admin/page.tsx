import { getDb } from "@/db/drizzle";
import { onboardingConfig } from "@/db/schema";
import { ConfigurationEditor } from "./_components/configuration-editor";

export default async function AdminPage() {
  const db = await getDb();
  const config = await db.select().from(onboardingConfig);

  // Transform data
  const initialConfig = {
    step2: config.filter((item) => item.step === "Step2").map((item) => item.component),
    step3: config.filter((item) => item.step === "Step3").map((item) => item.component),
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Onboarding Configuration</h1>
      <h3 className="text-sm font-semibold text-muted-foreground mb-8">Drag & Drop to Reorder</h3>
      <ConfigurationEditor initialConfig={initialConfig} />
    </div>
  );
}
