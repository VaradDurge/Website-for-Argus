export function StateScreen() {
  const nums = Array.from({ length: 18 }, (_, i) => String(i + 1)).join("\n");

  return (
    <div className="gut">
      <div className="gut-n">{nums}</div>
      <div className="gut-c">
        <span className="j-p">{"{"}</span>
        {"\n  "}
        <span className="j-k">&quot;run_id&quot;</span>
        <span className="j-p">: </span>
        <span className="j-s">&quot;20260815-224711-2e8a3c&quot;</span>
        <span className="j-p">,</span>
        {"\n  "}
        <span className="j-k">&quot;pipeline&quot;</span>
        <span className="j-p">: </span>
        <span className="j-s">&quot;support-triage&quot;</span>
        <span className="j-p">,</span>
        {"\n  "}
        <span className="j-k">&quot;initial_state&quot;</span>
        <span className="j-p">: {"{"}</span>
        {"\n    "}
        <span className="j-k">&quot;ticket_id&quot;</span>
        <span className="j-p">: </span>
        <span className="j-s">&quot;TK-48213&quot;</span>
        <span className="j-p">,</span>
        {"\n    "}
        <span className="j-k">&quot;channel&quot;</span>
        <span className="j-p">: </span>
        <span className="j-s">&quot;email&quot;</span>
        <span className="j-p">,</span>
        {"\n    "}
        <span className="j-k">&quot;priority&quot;</span>
        <span className="j-p">: </span>
        <span className="j-n">2</span>
        {"\n  "}
        <span className="j-p">{"}"},</span>
        {"\n  "}
        <span className="j-k">&quot;enrich_account&quot;</span>
        <span className="j-p">: {"{"}</span>
        {"\n    "}
        <span className="j-k">&quot;account_id&quot;</span>
        <span className="j-p">: </span>
        <span className="j-s">&quot;acct_1QxR8vBk2&quot;</span>
        <span className="j-p">,</span>
        {"\n    "}
        <span className="j-k">&quot;plan_tier&quot;</span>
        <span className="j-p">: </span>
        <span className="j-s">&quot;enterprise&quot;</span>
        <span className="j-p">,</span>
        {"\n    "}
        <span className="j-k">&quot;mrr_usd&quot;</span>
        <span className="j-p">: </span>
        <span className="j-n">4200.00</span>
        <span className="j-p">,</span>
        {"\n"}
        <span className="j-hl">
          {"    "}
          <span className="j-k">&quot;csat_history&quot;</span>
          <span className="j-p">: </span>
          <span className="j-null">null</span>
          <span className="j-p">,</span>
          {"   "}
          <span className="j-p">← dropped, required by draft_reply</span>
        </span>
        {"\n    "}
        <span className="j-k">&quot;open_tickets&quot;</span>
        <span className="j-p">: []</span>
        {"\n  "}
        <span className="j-p">{"}"},</span>
        {"\n  "}
        <span className="j-k">&quot;tool_calls&quot;</span>
        <span className="j-p">: </span>
        <span className="j-n">9</span>
        <span className="j-p">,</span>
        {"\n  "}
        <span className="j-k">&quot;interrupted&quot;</span>
        <span className="j-p">: </span>
        <span className="j-b">false</span>
        {"\n"}
        <span className="j-p">{"}"}</span>
      </div>
    </div>
  );
}
