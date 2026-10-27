"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type CountryRow = {
  id: number;
  name: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  optionOneVotes: number;
  optionTwoVotes: number;
  totalVotes: number;
  optionOnePercentage: number;
  optionTwoPercentage: number;
  leader: string;
};

const regionOrder = ["América", "Europa", "África", "Ásia", "Oriente Médio", "Oceania"];

const normalizeRegion = (region: string) => {
  if (region.toLowerCase().includes("américa") || region.toLowerCase().includes("america")) return "América";
  if (region.toLowerCase().includes("europa")) return "Europa";
  if (region.toLowerCase().includes("áfrica") || region.toLowerCase().includes("africa")) return "África";
  if (region.toLowerCase().includes("asia")) return "Ásia";
  if (region.toLowerCase().includes("oriente") || region.toLowerCase().includes("medio")) return "Oriente Médio";
  if (region.toLowerCase().includes("oceania")) return "Oceania";
  return region;
};

const candidateLabels = {
  optionOne: "Lula (PT)",
  optionTwo: "Flávio (PL)",
} as const;

const getCandidateLabel = (value: "Opção 1" | "Opção 2") =>
  value === "Opção 1" ? candidateLabels.optionOne : candidateLabels.optionTwo;

export function ElectionDashboard({ countries }: { countries: CountryRow[] }) {
  const [selectedCountry, setSelectedCountry] = useState("Todos os países");
  const [selectedRegion, setSelectedRegion] = useState("Todos");
  const [selectedCandidate, setSelectedCandidate] = useState<"Todos" | "Opção 1" | "Opção 2">("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mapRegionFocus, setMapRegionFocus] = useState("Todos");
  const [mapZoom, setMapZoom] = useState(1);
  const [viewMode, setViewMode] = useState<"votos" | "percentual">("votos");

  const mapFocusOptions = useMemo(
    () => ["Todos", ...regionOrder],
    [],
  );

  const candidateFilterOptions = useMemo(
    () => [
      { label: "Todos", value: "Todos" as const },
      { label: getCandidateLabel("Opção 1"), value: "Opção 1" as const },
      { label: getCandidateLabel("Opção 2"), value: "Opção 2" as const },
    ],
    [],
  );

  const normalizedCountries = useMemo(
    () => countries.map((country) => ({ ...country, region: normalizeRegion(country.region) })),
    [countries],
  );

  const selectedCountryData = useMemo(
    () => normalizedCountries.find((country) => country.name === selectedCountry) ?? null,
    [normalizedCountries, selectedCountry],
  );

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setMapZoom(1);
    const country = normalizedCountries.find((item) => item.name === countryName);
    if (country) {
      setMapRegionFocus(normalizeRegion(country.region));
    }
  };

  const mapProjectionConfig = useMemo(() => {
    const zoomFactor = mapZoom;

    if (selectedCountryData) {
      return {
        scale: 480 * zoomFactor,
        center: [selectedCountryData.longitude, selectedCountryData.latitude] as [number, number],
      };
    }

    switch (mapRegionFocus) {
      case "América":
        return { scale: 300 * zoomFactor, center: [-60, 10] as [number, number] };
      case "Europa":
        return { scale: 300 * zoomFactor, center: [18, 52] as [number, number] };
      case "África":
        return { scale: 270 * zoomFactor, center: [15, 2] as [number, number] };
      case "Ásia":
        return { scale: 260 * zoomFactor, center: [95, 35] as [number, number] };
      case "Oriente Médio":
        return { scale: 280 * zoomFactor, center: [35, 28] as [number, number] };
      case "Oceania":
        return { scale: 290 * zoomFactor, center: [140, -25] as [number, number] };
      default:
        return { scale: 200 * zoomFactor, center: [0, 10] as [number, number] };
    }
  }, [mapRegionFocus, mapZoom, selectedCountryData]);

  const hoveredCountryData = useMemo(
    () => normalizedCountries.find((country) => country.name === hoveredCountry) ?? null,
    [hoveredCountry, normalizedCountries],
  );

  const regionOptions = useMemo(
    () => ["Todos", ...new Set(normalizedCountries.map((country) => country.region))],
    [normalizedCountries],
  );

  const visibleCountries = useMemo(() => {
    const byRegion =
      selectedRegion === "Todos" ? normalizedCountries : normalizedCountries.filter((country) => country.region === selectedRegion);
    const byCandidate =
      selectedCandidate === "Todos" ? byRegion : byRegion.filter((country) => country.leader === selectedCandidate);
    const query = searchQuery.trim().toLowerCase();

    if (!query) return byCandidate;
    return byCandidate.filter((country) => country.name.toLowerCase().includes(query));
  }, [normalizedCountries, searchQuery, selectedCandidate, selectedRegion]);

  const mapCountries = useMemo(() => {
    if (mapRegionFocus === "Todos") return visibleCountries;
    return visibleCountries.filter((country) => normalizeRegion(country.region) === mapRegionFocus);
  }, [mapRegionFocus, visibleCountries]);

  const filteredCountries = useMemo(() => {
    if (selectedCountry === "Todos os países") return visibleCountries;
    return visibleCountries.filter((country) => country.name === selectedCountry);
  }, [selectedCountry, visibleCountries]);

  const totalOptionOne = normalizedCountries.reduce((sum, country) => sum + country.optionOneVotes, 0);
  const totalOptionTwo = normalizedCountries.reduce((sum, country) => sum + country.optionTwoVotes, 0);
  const totalVotes = normalizedCountries.reduce((sum, country) => sum + country.totalVotes, 0);
  const optionOneWins = normalizedCountries.filter((country) => country.leader === "Opção 1").length;
  const optionTwoWins = normalizedCountries.filter((country) => country.leader === "Opção 2").length;
  const optionOneShare = totalVotes > 0 ? (totalOptionOne / totalVotes) * 100 : 0;
  const optionTwoShare = totalVotes > 0 ? (totalOptionTwo / totalVotes) * 100 : 0;
  const leaderLabel = optionOneShare >= optionTwoShare ? "Opção 1" : "Opção 2";
  const leaderBg = leaderLabel === "Opção 1" ? "from-red-500 to-red-400" : "from-emerald-500 to-emerald-400";

  const leaderCountry = useMemo(
    () => [...normalizedCountries].sort((a, b) => b.totalVotes - a.totalVotes)[0] ?? null,
    [normalizedCountries],
  );

  const regionalSummary = useMemo(() => {
    const groups = new Map<string, { region: string; optionOne: number; optionTwo: number; total: number }>();

    normalizedCountries.forEach((country) => {
      const region = normalizeRegion(country.region);
      const current = groups.get(region) ?? { region, optionOne: 0, optionTwo: 0, total: 0 };
      current.optionOne += country.optionOneVotes;
      current.optionTwo += country.optionTwoVotes;
      current.total += country.totalVotes;
      groups.set(region, current);
    });

    return [...groups.values()]
      .sort((a, b) => regionOrder.indexOf(a.region) - regionOrder.indexOf(b.region))
      .sort((a, b) => b.total - a.total);
  }, [normalizedCountries]);

  const strongestRegion = useMemo(() => {
    const summary = regionalSummary;
    return summary.length > 0 ? summary[0] : null;
  }, [regionalSummary]);

  const ranking = [...visibleCountries]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 8)
    .map((country) => ({
      ...country,
      name: country.name,
      total: country.totalVotes,
      leader: country.leader,
    }));

  const chartData = [...visibleCountries]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 10)
    .map((country) => ({
      name: country.name,
      optionOne: viewMode === "votos" ? country.optionOneVotes : country.optionOnePercentage,
      optionTwo: viewMode === "votos" ? country.optionTwoVotes : country.optionTwoPercentage,
      total: country.totalVotes,
    }));

  const selectedOutcome = selectedCountryData
    ? `${selectedCountryData.optionOnePercentage.toFixed(1)}% x ${selectedCountryData.optionTwoPercentage.toFixed(1)}%`
    : `${optionOneShare.toFixed(1)}% x ${optionTwoShare.toFixed(1)}%`;

  const focusCountry = hoveredCountryData ?? selectedCountryData;

  const resetMapView = () => {
    setMapZoom(1);
    setMapRegionFocus("Todos");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[30px] border border-cyan-500/20 bg-slate-950/80 shadow-[0_30px_120px_rgba(14,165,233,0.12)] backdrop-blur-sm">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_25%),linear-gradient(135deg,#020817_0%,#0f172a_35%,#111827_100%)] p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Eleições presidenciais 2026
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                  Como votaram os brasileiros no exterior
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-300">
                  Base compilada e parcial
                </span>
                <a
                  href="https://www.bbc.com/portuguese/articles/cw5yn34exenno"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  Fonte: BBC News Brasil
                </a>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-3 pb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Resumo geral</p>
                  <span className={`rounded-full bg-linear-to-r ${leaderBg} px-2.5 py-1 text-xs font-semibold text-white`}>
                    {getCandidateLabel(leaderLabel as "Opção 1" | "Opção 2")} lidera
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{candidateLabels.optionOne}</div>
                    <div className="mt-2 text-4xl font-black text-red-400">{optionOneShare.toFixed(1)}%</div>
                    <div className="mt-1 text-sm text-slate-300">{totalOptionOne.toLocaleString("pt-BR")} votos</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{candidateLabels.optionTwo}</div>
                    <div className="mt-2 text-4xl font-black text-emerald-400">{optionTwoShare.toFixed(1)}%</div>
                    <div className="mt-1 text-sm text-slate-300">{totalOptionTwo.toLocaleString("pt-BR")} votos</div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                    <span>Resultado agregado</span>
                    <span>{Math.abs(optionOneShare - optionTwoShare).toFixed(1)} pts</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800/80">
                    <div className="flex h-full">
                      <div className="h-full rounded-l-full bg-linear-to-r from-red-400 to-red-300" style={{ width: `${optionOneShare}%` }} />
                      <div className="h-full rounded-r-full bg-linear-to-r from-emerald-400 to-emerald-300" style={{ width: `${optionTwoShare}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <StatCard label="Países com apuração" value={String(normalizedCountries.length)} accent="cyan" />
                <StatCard label="Total de votos" value={totalVotes.toLocaleString("pt-BR")} accent="violet" />
                {leaderCountry ? (
                  <StatCard label="Maior concentração" value={leaderCountry.name} accent="amber" />
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label={candidateLabels.optionOne} value={totalOptionOne.toLocaleString("pt-BR")} accent="red" />
          <StatCard label={candidateLabels.optionTwo} value={totalOptionTwo.toLocaleString("pt-BR")} accent="green" />
          <StatCard label={`Vitórias de ${candidateLabels.optionOne}`} value={String(optionOneWins)} accent="red" />
          <StatCard label={`Vitórias de ${candidateLabels.optionTwo}`} value={String(optionTwoWins)} accent="green" />
        </section>

        <section className="mb-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Painel rápido</p>
                <h2 className="text-xl font-bold text-white">Motivos para olhar</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InsightCard
                title="Maior volume"
                value={leaderCountry ? leaderCountry.name : "—"}
                detail={leaderCountry ? `${leaderCountry.totalVotes.toLocaleString("pt-BR")} votos` : "Sem dado"}
                accent="red"
              />
              <InsightCard
                title="Região mais relevante"
                value={strongestRegion ? strongestRegion.region : "—"}
                detail={strongestRegion ? `${strongestRegion.total.toLocaleString("pt-BR")} votos` : "Sem dado"}
                accent="cyan"
              />
              <InsightCard
                title="Comparativo atual"
                value={selectedOutcome}
                detail={leaderLabel === "Opção 1" ? "Liderança por agregação" : "Liderança por agregação"}
                accent="green"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Legenda</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-red-400" /> {candidateLabels.optionOne}</div>
              <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-emerald-400" /> {candidateLabels.optionTwo}</div>
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ranking</p>
                <h2 className="text-xl font-bold text-white">Maiores concentrações de votos</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">Top 8</span>
            </div>

            <div className="space-y-3">
              {ranking.map((country, index) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => setSelectedCountry(country.name)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-left transition hover:border-cyan-500/60 hover:bg-slate-950"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-cyan-200">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">{country.name}</div>
                    <div className="text-xs text-slate-400">{country.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{country.total.toLocaleString("pt-BR")}</div>
                    <div className={`text-[10px] font-semibold uppercase ${country.leader === "Opção 1" ? "text-red-400" : "text-emerald-400"}`}>
                      {getCandidateLabel(country.leader as "Opção 1" | "Opção 2")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Comparativo</p>
                <h2 className="text-xl font-bold text-white">Votos por país</h2>
              </div>
              <div className="inline-flex rounded-full border border-slate-700 bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("votos")}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${viewMode === "votos" ? "bg-cyan-500 text-cyan-950" : "text-slate-300"}`}
                >
                  Votos
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("percentual")}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${viewMode === "percentual" ? "bg-cyan-500 text-cyan-950" : "text-slate-300"}`}
                >
                  %
                </button>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} angle={-22} textAnchor="end" height={56} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "#020817", border: "1px solid #334155", borderRadius: 12, color: "#f8fafc" }}
                    formatter={(value) => {
                      const numericValue = Number(value ?? 0);
                      return viewMode === "votos" ? `${numericValue.toLocaleString("pt-BR")}` : `${numericValue.toFixed(1)}%`;
                    }}
                  />
                  <Bar dataKey="optionOne" radius={[6, 6, 0, 0]} fill="#f87171" />
                  <Bar dataKey="optionTwo" radius={[6, 6, 0, 0]} fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">Filtrar por país</h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                {filteredCountries.length} países
              </span>
            </div>

            <div className="mb-3">
              <div className="mb-2 text-sm text-slate-300">Candidato</div>
              <div className="flex flex-wrap gap-2">
                {candidateFilterOptions.map((candidate) => (
                  <button
                    key={candidate.value}
                    type="button"
                    onClick={() => setSelectedCandidate(candidate.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      selectedCandidate === candidate.value ? "bg-cyan-500 text-cyan-950" : "border border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    {candidate.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedRegion === region ? "bg-cyan-500 text-cyan-950" : "border border-slate-700 bg-slate-950 text-slate-300"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <label className="mb-3 block">
              <span className="mb-2 block text-sm text-slate-300">País</span>
              <select
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
              >
                <option value="Todos os países">Todos os países</option>
                {visibleCountries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="max-h-[62vh] space-y-2 overflow-auto pr-1">
              {(filteredCountries.length > 8 ? filteredCountries.slice(0, 8) : filteredCountries).map((country) => {
                const isSelected = country.name === selectedCountry;
                const leaderColor = country.leader === "Opção 1" ? "text-red-400" : "text-emerald-400";

                return (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => setSelectedCountry(country.name)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                      isSelected ? "border-cyan-400 bg-cyan-500/10" : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="truncate text-base font-semibold text-white">{country.name}</div>
                      <div className="text-xs text-slate-400">{country.region}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`text-sm font-bold ${leaderColor}`}>{getCandidateLabel(country.leader as "Opção 1" | "Opção 2")}</div>
                      <div className="text-xs text-slate-400">
                        {country.optionOnePercentage.toFixed(1)}% x {country.optionTwoPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredCountries.length > 8 ? (
                <div className="mt-2 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-3 py-2 text-center text-xs text-slate-400">
                  +{filteredCountries.length - 8} países restantes
                </div>
              ) : null}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Mapa mundial</p>
                  <h2 className="text-2xl font-bold text-white">Resultado por país</h2>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCountryData ? (
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
                      {selectedCountryData.name}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry("Todos os países");
                      setSelectedRegion("Todos");
                      setSearchQuery("");
                      setMapRegionFocus("Todos");
                      setSelectedCandidate("Todos");
                      setMapZoom(1);
                    }}
                    className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-cyan-500/60 hover:text-white"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {mapFocusOptions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => {
                      setMapRegionFocus(region);
                      setMapZoom(1);
                    }}
                    className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
                      mapRegionFocus === region ? "bg-cyan-500 text-cyan-950" : "border border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              <div className="mb-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMapZoom((current) => Math.max(0.8, Number((current - 0.2).toFixed(1))))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg text-slate-200 transition hover:border-cyan-500/60 hover:text-white"
                  aria-label="Diminuir zoom"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom((current) => Math.min(1.8, Number((current + 0.2).toFixed(1))))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg text-slate-200 transition hover:border-cyan-500/60 hover:text-white"
                  aria-label="Aumentar zoom"
                >
                  +
                </button>
              </div>

              <div
                className="relative h-120 overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top,#0f172a_0%,#020817_45%,#0b1120_100%)] p-2 shadow-inner shadow-slate-950/30"
                onWheel={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const direction = event.deltaY > 0 ? -0.2 : 0.2;
                  setMapZoom((current) => Math.min(1.8, Math.max(0.8, Number((current + direction).toFixed(1)))));
                }}
                onMouseEnter={() => {
                  document.body.style.overflow = "hidden";
                }}
                onMouseLeave={() => {
                  document.body.style.overflow = "";
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-4 pt-3 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  <span>Mapa interativo</span>
                  <span>{mapCountries.length} países</span>
                </div>

                <ComposableMap
                  projection="geoNaturalEarth1"
                  projectionConfig={mapProjectionConfig}
                  className="h-full w-full"
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#1e293b"
                          stroke="#0f172a"
                          strokeWidth={0.5}
                          style={{ outline: "none" }}
                        />
                      ))
                    }
                  </Geographies>

                  {mapCountries.map((country) => {
                    const isSelected = country.name === selectedCountry;
                    const isHovered = country.name === hoveredCountry;
                    const fill = country.leader === "Opção 1" ? "#f87171" : "#34d399";

                    return (
                      <Marker key={country.id} coordinates={[country.longitude, country.latitude]}>
                        <g
                          tabIndex={0}
                          role="button"
                          aria-label={`Selecionar país ${country.name}`}
                          onClick={() => setSelectedCountry(country.name)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedCountry(country.name);
                            }
                          }}
                          onMouseEnter={() => setHoveredCountry(country.name)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{ cursor: "pointer" }}
                          transform={isSelected ? "scale(1.35)" : isHovered ? "scale(1.2)" : "scale(1)"}
                        >
                          <circle
                            r={isSelected ? 8 : isHovered ? 6.5 : 5}
                            fill={fill}
                            opacity={isSelected || isHovered ? 1 : 0.8}
                            stroke={isSelected ? "#e2e8f0" : "rgba(255,255,255,0.2)"}
                            strokeWidth={isSelected ? 1.5 : 1}
                          />
                          <circle
                            r={isSelected ? 16 : isHovered ? 13 : 9}
                            fill={fill}
                            opacity={isSelected ? 0.24 : isHovered ? 0.16 : 0.12}
                          />
                        </g>
                      </Marker>
                    );
                  })}
                </ComposableMap>

                {focusCountry ? (
                  <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-2xl border border-slate-700 bg-slate-950/85 px-3 py-2 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">País em foco</div>
                    <div className="mt-1 font-semibold text-white">{focusCountry.name}</div>
                    <div className="mt-0.5 text-xs text-slate-300">
                      {focusCountry.optionOnePercentage.toFixed(1)}% x {focusCountry.optionTwoPercentage.toFixed(1)}%
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {selectedCountryData ? (
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">País selecionado</p>
                  <h3 className="mt-2 text-3xl font-black text-white">{selectedCountryData.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{selectedCountryData.region}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <MetricBox label={candidateLabels.optionOne} value={selectedCountryData.optionOneVotes.toLocaleString("pt-BR")} detail={`${selectedCountryData.optionOnePercentage.toFixed(2)}%`} color="text-red-400" />
                    <MetricBox label={candidateLabels.optionTwo} value={selectedCountryData.optionTwoVotes.toLocaleString("pt-BR")} detail={`${selectedCountryData.optionTwoPercentage.toFixed(2)}%`} color="text-emerald-400" />
                    <MetricBox label="Total" value={selectedCountryData.totalVotes.toLocaleString("pt-BR")} detail="votos" color="text-cyan-300" />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Resumo</p>
                  <div className="mt-4 space-y-4">
                    <ProgressBar label={candidateLabels.optionOne} value={selectedCountryData.optionOnePercentage} color="from-red-400 to-red-300" />
                    <ProgressBar label={candidateLabels.optionTwo} value={selectedCountryData.optionTwoPercentage} color="from-emerald-400 to-emerald-300" />
                    <div className="rounded-2xl bg-slate-950/70 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Vencedor</p>
                      <p className={`mt-2 text-xl font-black ${selectedCountryData.leader === "Opção 1" ? "text-red-400" : "text-emerald-400"}`}>
                        {getCandidateLabel(selectedCountryData.leader as "Opção 1" | "Opção 2")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Resumo por região</p>
            <div className="mt-4 space-y-4">
              {regionalSummary.map((region) => (
                <div key={region.region} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                    <span>{region.region}</span>
                    <span className="font-medium text-slate-300">{region.total.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="flex h-full">
                      <div className="h-full bg-red-400" style={{ width: `${(region.optionOne / region.total) * 100}%` }} />
                      <div className="h-full bg-emerald-400" style={{ width: `${(region.optionTwo / region.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Observação</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              A base aqui reunida corresponde a um conjunto rastreado e compilado de resultados por país no exterior, com cobertura geográfica parcial. Não há evidência pública e estruturada de um dataset oficial do TSE que amplie a série para a América Central e outros países ausentes.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: "cyan" | "violet" | "red" | "green" | "amber" | "emerald" | "rose" }) {
  const accentMap = {
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-100",
    red: "border-red-500/30 bg-red-500/10 text-red-100",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-100",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
    rose: "border-red-500/30 bg-red-500/10 text-red-100",
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-lg shadow-slate-950/30 ${accentMap[accent]}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function InsightCard({ title, value, detail, accent }: { title: string; value: string; detail: string; accent: "red" | "green" | "cyan" }) {
  const accentMap = {
    red: "border-red-500/20 bg-red-500/10",
    green: "border-emerald-500/20 bg-emerald-500/10",
    cyan: "border-cyan-500/20 bg-cyan-500/10",
  };

  return (
    <div className={`rounded-2xl border p-4 ${accentMap[accent]}`}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">{title}</div>
      <div className="mt-3 text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-300">{detail}</div>
    </div>
  );
}

function MetricBox({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) {
  return (
    <div className="rounded-2xl bg-slate-950/70 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-300">{detail}</p>
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
        <span>{label}</span>
        <span>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full bg-linear-to-r ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
