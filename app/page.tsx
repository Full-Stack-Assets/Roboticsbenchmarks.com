import Link from "next/link";
import { benchmarks, categories, formatDate } from "@/lib/benchmarks";

const recentlyVerified = [...benchmarks]
  .sort((a, b) => b.sourceVerifiedOn.localeCompare(a.sourceVerifiedOn))
  .slice(0, 6);

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="wordmark" href="/" aria-label="RoboticsBenchmarks.com home">
            <span className="wordmark-mark" aria-hidden="true">RB</span>
            <span>RoboticsBenchmarks</span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/benchmarks">Benchmarks</Link><Link href="/categories">Categories</Link><Link href="/how-to-choose">How to Choose</Link><Link href="/submit">Submit</Link><Link href="/about">About</Link>
          </nav>
          <Link className="button button-quiet header-cta" href="/alerts">Get alerts</Link>
        </div>
      </header>

      <main id="main-content">
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Independent · Source-backed · Protocol-aware</p>
              <h1>The independent index of robotics benchmarks</h1>
              <p className="lede">Compare simulation, real-robot, and compute benchmarks in one place. Every entry includes source links, a verification date, and confidence notes.</p>
              <div className="action-row"><Link className="button button-primary" href="/benchmarks">Explore the benchmark registry</Link><Link className="button button-secondary" href="/alerts">Get curation alerts</Link></div>
              <div className="hero-proof" aria-label="Registry facts"><span><strong>{benchmarks.length}</strong> reviewed starters</span><span><strong>40</strong> primary sources</span><span><strong>0</strong> synthetic rankings</span></div>
            </div>
            <div className="signal-map" aria-label="Benchmark evaluation landscape">
              <div className="signal-axis axis-x"><span>Simulation</span><span>Real robot</span></div><div className="signal-axis axis-y"><span>Task</span><span>System</span></div>
              <div className="signal-node node-a"><i />Manipulation</div><div className="signal-node node-b"><i />Navigation</div><div className="signal-node node-c"><i />Locomotion</div><div className="signal-node node-d"><i />Compute</div>
              <div className="signal-line line-a" /><div className="signal-line line-b" /><div className="signal-line line-c" /><div className="signal-core"><span>Evidence</span><strong>Protocol</strong><small>Metric</small></div>
            </div>
          </div>
        </section>

        <section className="section shell" aria-labelledby="value-heading">
          <div className="section-heading compact-heading"><p className="eyebrow">A shared comparison language</p><h2 id="value-heading">Built for decisions, not hype</h2></div>
          <div className="value-grid">
            <article className="value-card"><span className="card-index">01</span><h3>Consistent schema</h3><p>Every benchmark is described with the same fields, so project-specific language does not hide meaningful differences.</p></article>
            <article className="value-card"><span className="card-index">02</span><h3>Transparent provenance</h3><p>Material claims link to official project pages or papers and carry an explicit verification state and timestamp.</p></article>
            <article className="value-card"><span className="card-index">03</span><h3>Practical guidance</h3><p>Category hubs and selection guidance help teams match evaluation resources to their actual task, system, and setting.</p></article>
          </div>
        </section>

        <section className="section registry-band" aria-labelledby="recent-heading"><div className="shell">
          <div className="section-heading split-heading"><div><p className="eyebrow">Primary-source reviewed</p><h2 id="recent-heading">Recently verified entries</h2></div><Link className="text-link" href="/benchmarks">View full registry <span aria-hidden="true">→</span></Link></div>
          <div className="registry-table-wrap"><table className="registry-table"><thead><tr><th>Name</th><th>Domain</th><th>Setting</th><th>Metric state</th><th>Verified</th></tr></thead><tbody>
            {recentlyVerified.map((benchmark) => <tr key={benchmark.slug}><td><Link href={`/benchmarks/${benchmark.slug}`}>{benchmark.name}</Link><small>{benchmark.kind.replaceAll("_", " ")}</small></td><td><span className="tag">{benchmark.domain}</span></td><td>{benchmark.settings.map((setting) => setting.replaceAll("_", " ")).join(", ")}</td><td>{benchmark.metricState === "defined" ? benchmark.metricName : "No universal metric"}</td><td><span className="verified-dot" />{formatDate(benchmark.sourceVerifiedOn)}</td></tr>)}
          </tbody></table></div>
        </div></section>

        <section className="section shell" aria-labelledby="category-heading">
          <div className="section-heading split-heading"><div><p className="eyebrow">Browse by evaluation domain</p><h2 id="category-heading">Start with the problem you need to measure</h2></div></div>
          <div className="category-grid">{categories.map((category) => <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}><span className="category-count">{category.count.toString().padStart(2, "0")}</span><h3>{category.name}</h3><p>{category.description}</p><span className="text-link">Explore category <span aria-hidden="true">→</span></span></Link>)}</div>
        </section>

        <section className="trust-band"><div className="shell trust-grid"><p className="eyebrow">Methodology</p><p>Sources are official project pages, repositories, rules, and primary papers. Demo rows are labeled. No benchmark is ranked or endorsed.</p><p className="trust-date">Evidence cutoff<br/><strong>August 20, 2026</strong></p></div></section>
        <section className="section shell final-cta"><p className="eyebrow">A better evaluation starts with scope</p><h2>Find the benchmark that matches your system—not the one with the loudest leaderboard.</h2><div className="action-row centered-actions"><Link className="button button-primary" href="/benchmarks">Open the registry</Link><Link className="button button-secondary" href="/how-to-choose">Read the selection guide</Link></div></section>
      </main>

      <footer className="site-footer"><div className="shell footer-grid">
        <div><Link className="wordmark footer-wordmark" href="/"><span className="wordmark-mark">RB</span><span>RoboticsBenchmarks</span></Link><p>An independent, source-backed index for robotics evaluation.</p></div>
        <div><h2>Discover</h2><Link href="/benchmarks">Registry</Link><Link href="/categories">Categories</Link><Link href="/how-to-choose">How to Choose</Link></div>
        <div><h2>Contribute</h2><Link href="/submit">Submit a benchmark</Link><Link href="/updates">Curation updates</Link><Link href="/resources">Resources</Link></div>
        <div><h2>Trust</h2><Link href="/about">Methodology</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div><div className="shell footer-bottom"><span>© 2026 RoboticsBenchmarks.com</span><span>Independent index. No benchmark endorsement.</span></div></footer>
    </>
  );
}
