"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Benchmark } from "@/lib/benchmarks";

export function RegistryClient({ records }: { records: Benchmark[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [setting, setSetting] = useState("all");
  const [sort, setSort] = useState("name");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records
      .filter((record) => !q || `${record.name} ${record.summary}`.toLowerCase().includes(q))
      .filter((record) => domain === "all" || record.domain === domain)
      .filter((record) => setting === "all" || record.settings.includes(setting))
      .sort((a, b) => sort === "verified" ? b.sourceVerifiedOn.localeCompare(a.sourceVerifiedOn) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  }, [records, query, domain, setting, sort]);
  const clear = () => { setQuery(""); setDomain("all"); setSetting("all"); setSort("name"); };

  return <div className="registry-experience">
    <div className="filter-panel">
      <label className="search-field"><span>Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names or scope" /></label>
      <label><span>Domain</span><select value={domain} onChange={(event) => setDomain(event.target.value)}><option value="all">All domains</option>{[...new Set(records.map((r) => r.domain))].sort().map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label><span>Setting</span><select value={setting} onChange={(event) => setSetting(event.target.value)}><option value="all">All settings</option>{[...new Set(records.flatMap((r) => r.settings))].sort().map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
      <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="verified">Recently verified</option></select></label>
      <button className="clear-button" type="button" onClick={clear}>Clear all</button>
    </div>
    <div className="results-heading" aria-live="polite"><strong>{filtered.length}</strong> benchmark{filtered.length === 1 ? "" : "s"}</div>
    {filtered.length ? <div className="record-grid">{filtered.map((record) => <article className="record-card" key={record.slug}>
      <div className="record-meta"><span className="tag light-tag">{record.domain}</span><span>{record.settings.map((value) => value.replaceAll("_", " ")).join(" · ")}</span></div>
      <h2><Link href={`/benchmarks/${record.slug}`}>{record.name}</Link></h2><p>{record.summary}</p>
      <dl><div><dt>Entity</dt><dd>{record.kind.replaceAll("_", " ")}</dd></div><div><dt>Metric</dt><dd>{record.metricName ?? "No universal metric"}</dd></div><div><dt>Evidence</dt><dd>{record.verificationState.replaceAll("_", " ")}</dd></div></dl>
      <Link className="text-link" href={`/benchmarks/${record.slug}`}>View benchmark <span aria-hidden="true">→</span></Link>
    </article>)}</div> : <div className="empty-state"><h2>No benchmarks match these filters</h2><p>Clear the filters or submit a primary source for review.</p><button className="button button-primary" type="button" onClick={clear}>Clear filters</button></div>}
  </div>;
}
