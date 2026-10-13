import Link from "next/link";

export const metadata = {
  title: "Robotics Evaluation Services | RoboticsBenchmarks.com",
  description:
    "Request a scoped robotics benchmark discovery, capability assessment, or competitive intelligence engagement. Evidence-led, with explicit limitations.",
};

const recipient = process.env.NEXT_PUBLIC_RB_EVALUATION_EMAIL?.trim();
const subject = "RoboticsBenchmarks — Evaluation request";
const requestBody = [
  "Robot or system:",
  "Use case and operating environment:",
  "Decision requiring evidence:",
  "Timeline:",
  "Available data or protocols:",
  "Budget range (optional):",
].join("\r\n");
const emailHref = recipient
  ? `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestBody)}`
  : null;
const linkedInHref = "https://www.linkedin.com/in/nsa1/";

export default function EvaluationsPage() {
  return (
    <main>
      <div className="subnav shell">
        <Link className="wordmark" href="/">
          <span className="wordmark-mark">RB</span>
          <span>RoboticsBenchmarks</span>
        </Link>
        <Link href="/">← Home</Link>
      </div>
      <section className="page-hero shell">
        <p className="eyebrow">Commercial services · Scope before commitment</p>
        <h1>Request a robotics evaluation</h1>
        <p>
          We help teams select relevant benchmarks, assess evidence, and plan
          decision-ready robotics evaluations. Start with the question you need
          answered, not an unsupported performance score.
        </p>
        <div className="action-row">
          {emailHref ? (
            <a className="button button-primary" href={emailHref}>Prepare an evaluation email</a>
          ) : (
            <a className="button button-primary" href={linkedInHref} target="_blank" rel="noopener noreferrer">
              Discuss an evaluation on LinkedIn ↗
            </a>
          )}
          <Link className="button button-secondary" href="/benchmarks">Explore the registry</Link>
        </div>
      </section>
      <section className="shell evaluation-detail" aria-labelledby="evaluation-includes">
        <h2 id="evaluation-includes">What an engagement can include</h2>
        <ul>
          <li><strong>Benchmark discovery:</strong> a protocol shortlist with scope, primary sources, and limitations.</li>
          <li><strong>Focused assessment:</strong> evaluation criteria, available evidence, gaps, and a findings report.</li>
          <li><strong>Technical intelligence:</strong> vendor and research comparisons that separate claims from verified observations.</li>
        </ul>
        <h2>What to share in your request</h2>
        <p>
          Describe the system, target task, environment, decision deadline,
          available test data, and desired deliverable. We can then determine
          availability, scope, timeline, and a proposed quote. No payment is
          requested on this page.
        </p>
        <p className="evaluation-note">
          <strong>Evidence boundaries:</strong> Public registry entries are not
          original robot test results. Services are individually scoped and
          are not represented as accredited certification, independent
          laboratory testing, or third-party endorsement. Findings depend on
          the materials and methods actually available.
        </p>
      </section>
    </main>
  );
}
