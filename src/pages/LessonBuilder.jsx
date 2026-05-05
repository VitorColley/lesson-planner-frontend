import { useState } from "react";
import { suggestActivities, selectActivity } from "../services/api";

function LessonBuilder() {
  const [duration, setDuration] = useState("");
  const [lessonState, setLessonState] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startLesson() {
    try {
      setLoading(true);
      setError("");

      const initialState = {
        subject: "Science",
        ageGroup: "Junior Cycle",
        topic: "pH scale",
        totalDurationMinutes: Number(duration),
        remainingMinutes: Number(duration),
        currentStage: "STARTER",
        mappedOutcomes: ["3.6"],
        selectedActivities: [],
        constraints: "Mixed ability class",
      };

      const result = await suggestActivities(initialState);

      setLessonState(initialState);
      setSuggestions(result);
    } catch (err) {
      setError(err.message || "Failed to start lesson.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectActivity(activity) {
    try {
      setLoading(true);
      setError("");

      const updatedState = await selectActivity(lessonState, activity);
      setLessonState(updatedState);

      if (
        updatedState.currentStage === "COMPLETE" ||
        updatedState.remainingMinutes <= 0
      ) {
        setSuggestions([]);
        return;
      }

      const nextSuggestions = await suggestActivities(updatedState);
      setSuggestions(nextSuggestions);
    } catch (err) {
      setError(err.message || "Failed to select activity.");
    } finally {
      setLoading(false);
    }
  }
  async function handleGenerateNewSuggestions() {
    try {
      setLoading(true);
      setError("");

      const nextSuggestions = await suggestActivities(lessonState);
      setSuggestions(nextSuggestions);
    } catch (err) {
      setError(err.message || "Failed to generate new suggestions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Lesson Builder</h1>
      <p className="mt-2 text-slate-600">
        Build a lesson step by step using activity suggestions.
      </p>

      {!lessonState && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">
            Lesson duration (minutes)
          </label>

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 40"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
          />

          <button
            onClick={startLesson}
            disabled={!duration || loading}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start Lesson"}
          </button>
        </div>
      )}

      {lessonState && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_2fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Lesson Timeline
            </h2>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <span className="font-medium">Topic:</span> {lessonState.topic}
              </p>
              <p>
                <span className="font-medium">Stage:</span>{" "}
                {lessonState.currentStage}
              </p>
              <p>
                <span className="font-medium">Remaining:</span>{" "}
                {lessonState.remainingMinutes} minutes
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {lessonState.selectedActivities.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No activities selected yet.
                </p>
              ) : (
                lessonState.selectedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {activity.lessonStage} · {activity.durationMinutes} min
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Suggested Activities
            </h2>

            {loading && (
              <p className="mt-4 text-sm text-slate-600">
                Loading suggestions...
              </p>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && suggestions.length === 0 && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Lesson is complete or no suggestions are available.
              </div>
            )}

            <div className="mt-4 grid gap-4">
              {suggestions.map((activity) => (
                <article
                  key={activity.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                      {activity.lessonStage}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {activity.durationMinutes} min
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {activity.method}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {activity.description}
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Why this fits
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {activity.whyThisFits}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectActivity(activity)}
                    disabled={loading}
                    className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Choose this activity
                  </button>
                </article>
              ))}
            </div>
              {lessonState && suggestions.length > 0 && (
                <button
                  onClick={handleGenerateNewSuggestions}
                  disabled={loading}
                  className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Generate new suggestions
                </button>
              )}
          </section>
        </div>
      )}
    </div>
  );
}

export default LessonBuilder;