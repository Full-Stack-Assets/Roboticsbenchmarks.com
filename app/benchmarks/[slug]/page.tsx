import Link from "next/link";
import { notFound } from "next/navigation";
import { benchmarkBySlug, benchmarks, formatDate, sourceById } from "@/lib/benchmarks";

export function generateStaticParams() { return benchmarks.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = benchmarkBySlug.get(slug); return item ? { title: `${item.name} | RoboticsBenchmarks.com`, description: item.summary, openGraph: { title: item.name, description: item.summary, images: [] }, twitter: { title: item.name, description: item.summary, images: [] } } : {}; }

export default async function BenchmarkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const item = benchmarkBySlug.get(slug); if (!item) notFound();
  const sources = item.sourceIds.map((id) => sourceById.get(id)).filter(Boolean);
  return <main><div className="subnav shell"><Link className="wordmark" href="/"><span className="wordmark-mark">RB</span><span>RoboticsBenchmarks</span></Link><Link href="/benchmarks">← Registry</Link></div><article className="detail shell">
    <header className="detail-header"><div><p className="eyebrow">{item.domain} · {item.kind.replaceAll("_", " ")}</p><h1>{item.name}</h1><p>{item.summary}</p></div><div className="verification-panel"><span className="status-line"><span className="verified-dot" />{item.verificationState.replaceAll("_", " ")}</span><strong>{formatDate(item.sourceVerifiedOn)}</strong><small>{item.verificationNote}</small></div></header>
    <section className="detail-grid"><div><p className="field-label">Evaluation setting</p><p>{item.settings.map((v) => v.replaceAll("_", " ")).join(", ")}</p></div><div><p className="field-label">Primary metric</p><p>{item.metricName ?? "No single standardized metric"}</p></div><div><p className="field-label">Source count</p><p>{sources.length} bound primary source{sources.length === 1 ? "" : "s"}</p></div></section>
    <section className="source-section"><div className="section-heading"><p className="eyebrow">Provenance</p><h2>Primary sources</h2></div><div className="source-list">{sources.map((source) => source && <a href={source.url} target="_blank" rel="noreferrer" key={source.id}><span>{source.source_type.replaceAll("_", " ")}</span><strong>{new URL(source.url).hostname}</strong><small>Retrieved {formatDate(source.retrieved_on)}</small></a>)}</div></section>
    <section className="detail-cta"><h2>Found an update or correction?</h2><p>Submissions enter a private review queue and never change the public registry automatically.</p><Link className="button button-primary" href={`/submit?benchmark=${item.slug}`}>Suggest a correction</Link></section>
  </article></main>;
}
