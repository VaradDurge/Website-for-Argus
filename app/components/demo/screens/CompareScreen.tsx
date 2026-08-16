export function CompareScreen() {
  return (
    <div className="wc">
      <div>
        <p className="finding">
          Fixing <span className="who ok">enrich_account</span> cleared the cascade. The
          placeholder in <code>draft_reply</code> and the <code>KeyError</code> in{" "}
          <code>policy_check</code> both disappeared; low retrieval on <code>pinecone</code> is
          unchanged and is a separate issue.
        </p>
        <p className="finding-sub">
          3 of 4 findings resolved <span className="arrow">·</span> latency down 380ms
        </p>
      </div>
      <div className="cols">
        <div>
          <h5>
            2e8a3c{" "}
            <span style={{ fontFamily: "var(--sans)", fontWeight: 400, fontSize: 11.5, color: "var(--ink-4)" }}>
              baseline
            </span>
          </h5>
          <div className="crow">
            <span>Status</span>
            <span className="stat bad">
              <i />
              crashed
            </span>
          </div>
          <div className="crow">
            <span>Steps</span>
            <b>4 / 7</b>
          </div>
          <div className="crow">
            <span>Duration</span>
            <b>3.12s</b>
          </div>
          <div className="crow">
            <span>First failure</span>
            <b style={{ color: "var(--tool)" }}>enrich_account</b>
          </div>
        </div>
        <div>
          <h5>
            8917b9{" "}
            <span style={{ fontFamily: "var(--sans)", fontWeight: 400, fontSize: 11.5, color: "var(--ink-4)" }}>
              replay
            </span>
          </h5>
          <div className="crow">
            <span>Status</span>
            <span className="stat ok">
              <i />
              clean
            </span>
          </div>
          <div className="crow">
            <span>Steps</span>
            <b>7 / 7</b>
          </div>
          <div className="crow">
            <span>Duration</span>
            <b>2.74s</b>
          </div>
          <div className="crow">
            <span>First failure</span>
            <b style={{ color: "var(--ink-4)" }}>—</b>
          </div>
        </div>
      </div>
      <div>
        <p className="cap">
          <span>draft_reply.output</span>
        </p>
        <div className="diff">
          <div className="del">- &quot;body&quot;: &quot;[insert summary here]&quot;</div>
          <div className="add">+ &quot;body&quot;: &quot;Your August invoice was charged twice…&quot;</div>
          <div className="del">- &quot;citations&quot;: []</div>
          <div className="add">+ &quot;citations&quot;: [&quot;kb_2841&quot;, &quot;kb_0917&quot;]</div>
        </div>
      </div>
    </div>
  );
}
