import { useState } from "react";
import { mapCurriculum } from "../services/api";
import ResultsPanel from "./ResultsPanel";

function MappingForm() {
  const [formData, setFormData] = useState({
    subject: "",
    ageGroup: "",
    outcomes: "",
    topics: "",
    constraints: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await mapCurriculum(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Lesson Input</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter the lesson details to map content against curriculum outcomes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Science"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="ageGroup"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Age Group
            </label>
            <input
              id="ageGroup"
              name="ageGroup"
              type="text"
              value={formData.ageGroup}
              onChange={handleChange}
              placeholder="e.g. Junior Cycle"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="outcomes"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Learning Outcomes
            </label>
            <textarea
              id="outcomes"
              name="outcomes"
              rows="4"
              value={formData.outcomes}
              onChange={handleChange}
              placeholder="Enter the intended learning outcomes"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="topics"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Topics
            </label>
            <textarea
              id="topics"
              name="topics"
              rows="4"
              value={formData.topics}
              onChange={handleChange}
              placeholder="Enter the lesson topics"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="constraints"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Constraints
            </label>
            <textarea
              id="constraints"
              name="constraints"
              rows="4"
              value={formData.constraints}
              onChange={handleChange}
              placeholder="Enter any constraints, classroom conditions, or notes"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Mapping..." : "Map Curriculum"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <ResultsPanel result={result} loading={loading} />
    </div>
  );
}

export default MappingForm;