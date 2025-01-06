import { getDb } from "@/db/drizzle";
import ClientComponent from "./_components/client-component";
import { desc } from "drizzle-orm";
import { onboardingConfig } from "@/db/schema";

export default async function Home() {
  const db = await getDb();
  const config = await db.query.onboardingConfig.findMany({
    orderBy: desc(onboardingConfig.updatedAt),
  });

  return (
    <div className="h-full flex flex-col items-center w-full gap-y-4">
      <ClientComponent config={config} />
    </div>
  );
}
