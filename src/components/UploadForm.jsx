import { useState } from "react";
import { uploadCurriculum } from "../services/api";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Please select a PDF file before uploading.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await uploadCurriculum(file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Upload Curriculum PDF</h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload an official curriculum document.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="file"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              PDF File
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              required
            />
            {file && (
              <p className="mt-2 text-sm text-slate-600">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload Curriculum"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Upload Result</h2>
        <p className="mt-2 text-sm text-slate-600">
          The detected curriculum information will appear here after upload.
        </p>

        <div className="mt-6">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Uploading file...
            </div>
          )}

          {!loading && !result && !error && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No upload submitted yet.
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Upload completed successfully.
              </div>

              <div className="grid gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Title
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {result.title || "No title returned"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Subject
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {result.subject || "No subject returned"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Cycle
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {result.cycle || "No cycle returned"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Document ID
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {result.documentId ?? "No document ID returned"}
                  </p>
                </div>

                <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700">
                    View raw JSON
                  </summary>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadForm;