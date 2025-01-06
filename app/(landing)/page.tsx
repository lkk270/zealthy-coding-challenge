import { getDb } from "@/db/drizzle";
import ClientComponent from "./_components/client-component";

export default async function Home() {
  const db = await getDb();
  const config = await db.query.onboardingConfig.findMany();

  return (
    <div className="h-full flex flex-col items-center w-full gap-y-4">
      <ClientComponent config={config} />
    </div>
  );
}
