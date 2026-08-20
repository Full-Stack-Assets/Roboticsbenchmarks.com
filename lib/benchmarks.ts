import seed from "@/canon/roboticsbenchmarks_seed_v1.json";

export type Benchmark = { slug: string; name: string; kind: string; domain: string; settings: string[]; summary: string; metricState: string; metricName: string | null; officialUrl: string; paperUrl: string | null; codeUrl: string | null; verificationState: string; verificationNote: string; sourceVerifiedOn: string; sourceIds: string[] };

export const benchmarks: Benchmark[] = seed.records.map((record) => ({ slug: record.slug, name: record.canonical_name, kind: record.entity_kind, domain: record.primary_domain, settings: record.evaluation_settings, summary: record.scope_summary, metricState: record.primary_metric_summary.state, metricName: record.primary_metric_summary.name, officialUrl: record.official_url, paperUrl: record.paper_url ?? null, codeUrl: record.code_url ?? null, verificationState: record.verification_state, verificationNote: record.verification_note, sourceVerifiedOn: record.source_verified_on, sourceIds: record.source_ids }));
export const sourceById = new Map(seed.sources.map((source) => [source.id, source]));
export const benchmarkBySlug = new Map(benchmarks.map((benchmark) => [benchmark.slug, benchmark]));

const categoryCopy: Record<string, { name: string; description: string }> = {
  manipulation: { name: "Manipulation", description: "Task, skill, and generalization evaluations for robot interaction with objects and environments." },
  navigation: { name: "Navigation", description: "Embodied navigation, mapping, exploration, and collision-aware planning resources." },
  locomotion: { name: "Locomotion", description: "Control and mobility evaluations across terrain, morphology, and operating conditions." },
  compute: { name: "Compute", description: "Performance, latency, energy, and system-level benchmarking for robotics workloads." },
  multi: { name: "Multi-domain", description: "Resources spanning multiple robotics domains, embodiments, or evaluation settings." },
  other: { name: "Challenges", description: "Competitions and real-world evaluation programs with protocol- and stage-specific results." },
};

export const categories = Object.entries(categoryCopy).map(([slug, value]) => ({ slug, ...value, count: benchmarks.filter((benchmark) => benchmark.domain === slug).length }));
export function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
