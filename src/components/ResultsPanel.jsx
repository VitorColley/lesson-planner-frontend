function ResultsPanel({ result, loading }) {
  const mappedOutcomes = result?.result?.mappedOutcomes || [];
  const notes = result?.result?.notes || "";
  const retrievedChunksIds = result?.retrievedChunksIds || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Results</h2>
      <p className="mt-2 text-sm text-slate-600">
        The mapped curriculum response will appear here.
      </p>

      <div className="mt-6 space-y-6">
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Processing request...
          </div>
        )}

        {!loading && !result && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No results yet. Submit the form to view mapped outcomes.
          </div>
        )}

        {!loading && result && (
          <>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Notes
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {notes || "No notes returned."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Mapped Outcomes
              </h3>

              <div className="mt-3 space-y-4">
                {mappedOutcomes.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No mapped outcomes returned.
                  </div>
                ) : (
                  mappedOutcomes.map((outcome, index) => (
                    <div
                      key={`${outcome.learning_outcome_ref}-${index}`}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                          Outcome {outcome.learning_outcome_ref}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          Chunk ID {outcome.chunk_id}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {outcome.justification}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Retrieved Chunks
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {retrievedChunksIds.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No retrieved chunk IDs returned.
                  </p>
                ) : (
                  retrievedChunksIds.map((id) => (
                    <span
                      key={id}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {id}
                    </span>
                  ))
                )}
              </div>
            </div>

            <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-700">
                View raw JSON
              </summary>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
            
          </>
        )}
      </div>
    </div>
  );
}

export default ResultsPanel;