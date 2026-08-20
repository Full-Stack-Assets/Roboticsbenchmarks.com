import Link from "next/link";
import { RegistryClient } from "@/app/components/registry-client";
import { benchmarks } from "@/lib/benchmarks";

export const metadata = { title: "Benchmark Registry | RoboticsBenchmarks.com", description: "Search and filter source-backed robotics benchmark records." };

export default function BenchmarksPage() {
  return <main><div className="subnav shell"><Link className="wordmark" href="/"><span className="wordmark-mark">RB</span><span>RoboticsBenchmarks</span></Link><Link href="/">← Home</Link></div><section className="page-hero shell"><p className="eyebrow">Registry</p><h1>Robotics benchmarks, described on common ground</h1><p>Search by name or scope, then narrow by domain and evaluation setting. Every record is source-backed; none is a ranking.</p></section><section className="shell registry-page-section"><RegistryClient records={benchmarks} /></section></main>;
}
