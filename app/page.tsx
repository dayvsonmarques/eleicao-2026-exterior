import { prisma } from "@/lib/db";
import { ElectionDashboard } from "@/components/election-dashboard";

export const dynamic = "force-dynamic";

async function getCountries() {
  return prisma.countryResult.findMany({
    orderBy: [{ optionOnePercentage: "desc" }],
  });
}

export default async function HomePage() {
  const countries = await getCountries();

  return <ElectionDashboard countries={countries} />;
}
