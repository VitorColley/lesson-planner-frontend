import { useState } from "react";
import { suggestActivities, selectActivity } from "../services/api";

function LessonBuilder() {
  const [duration, setDuration] = useState("");
  const [lessonState, setLessonState] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const groupedActivities = lessonState
    ? lessonState.selectedActivities.reduce((acc, activity) => {
        if (!acc[activity.lessonStage]) {
          acc[activity.lessonStage] = [];
        }

        acc[activity.lessonStage].push(activity);
        return acc;
      }, {})
    : {};

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
        regenerationCount: 0,
        actionHistory: [],
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

      // 1. Call backend
      const updatedState = await selectActivity(lessonState, activity);

      // 2. Add action history ON TOP of backend state
      const updatedStateWithHistory = {
        ...updatedState,
        actionHistory: [
          ...(lessonState.actionHistory || []),
          {
            type: "SELECT_ACTIVITY",
            stage: activity.lessonStage,
            activityId: activity.id,
            durationMinutes: activity.durationMinutes,
          },
        ],
      };

      // 3. Update state ONCE
      setLessonState(updatedStateWithHistory);

      // 4. Get next suggestions
      const nextSuggestions = await suggestActivities(updatedStateWithHistory);
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

      const updatedState = {
        ...lessonState,
        regenerationCount: lessonState.regenerationCount + 1,
      };

      const nextSuggestions = await suggestActivities(updatedState);

      setLessonState(updatedState);
      setSuggestions(nextSuggestions);
    } catch (err) {
      setError(err.message || "Failed to generate new suggestions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUndoLastStep() {
    if (!lessonState || !lessonState.actionHistory?.length) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const lastAction =
        lessonState.actionHistory[lessonState.actionHistory.length - 1];

      const updatedHistory = lessonState.actionHistory.slice(0, -1);

      let updatedState;

      if (lastAction.type === "SKIP_STAGE") {
        updatedState = {
          ...lessonState,
          currentStage: lastAction.stage,
          regenerationCount: 0,
          actionHistory: updatedHistory,
        };
      }

      if (lastAction.type === "SELECT_ACTIVITY") {
        const removedActivity =
          lessonState.selectedActivities[
            lessonState.selectedActivities.length - 1
          ];

        const updatedActivities = lessonState.selectedActivities.slice(0, -1);

        updatedState = {
          ...lessonState,
          selectedActivities: updatedActivities,
          remainingMinutes: Math.min(
            lessonState.remainingMinutes + removedActivity.durationMinutes,
            lessonState.totalDurationMinutes
          ),
          currentStage: removedActivity.lessonStage,
          regenerationCount: 0,
          actionHistory: updatedHistory,
        };
      }

      if (!updatedState) return;

      const nextSuggestions = await suggestActivities(updatedState);

      setLessonState(updatedState);
      setSuggestions(nextSuggestions);
    } catch (err) {
      setError(err.message || "Failed to undo last step.");
    } finally {
      setLoading(false);
    }
  }

  function handleRestartLesson() {
    setDuration("");
    setLessonState(null);
    setSuggestions([]);
    setError("");
  }

  function handleFinishLesson() {
    if (!lessonState) return;

    setLessonState({
      ...lessonState,
      currentStage: "COMPLETE",
      remainingMinutes: 0,
      regenerationCount: 0,
    });

    setSuggestions([]);
    setError("");
  }

  function getNextStage(currentStage) {
    switch (currentStage) {
      case "STARTER":
        return "MAIN";
      case "MAIN":
        return "PRACTICE";
      case "PRACTICE":
        return "PLENARY";
      default:
        return "COMPLETE";
    }
  }

  async function handleSkipStage() {
    if (!lessonState) return;

    try {
      setLoading(true);
      setError("");

      const skippedStage = lessonState.currentStage;

      const updatedState = {
        ...lessonState,
        currentStage: getNextStage(lessonState.currentStage),
        regenerationCount: 0,
        actionHistory: [
          ...(lessonState.actionHistory || []),
          {
            type: "SKIP_STAGE",
            stage: skippedStage,
          },
        ],
      };

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
      setError(err.message || "Failed to skip stage.");
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
          <aside className="sticky top-6 self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

            <div className="mt-6">
              {lessonState.selectedActivities.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No activities selected yet.
                </p>
              ) : (
                ["STARTER", "MAIN", "PRACTICE", "PLENARY"].map((stage) => (
                  <div key={stage} className="mt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {stage}
                    </h3>

                    {(groupedActivities[stage] || []).length === 0 ? (
                      <p className="mt-1 text-xs text-slate-400">
                        No activities yet.
                      </p>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {(groupedActivities[stage] || []).map((activity) => (
                          <div
                            key={activity.id}
                            className="rounded-xl border border-slate-200 p-3"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {activity.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {activity.durationMinutes} min ·{" "}
                              {activity.method}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 grid gap-2">

              {lessonState.actionHistory?.length > 0 && (
                <button
                  onClick={handleUndoLastStep}
                  disabled={loading || !lessonState.actionHistory?.length}
                  className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Undo last step
                </button>
              )}

              <button
                onClick={handleSkipStage}
                disabled={loading || lessonState.currentStage === "COMPLETE"}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Skip current stage
              </button>

              <button
                onClick={handleFinishLesson}
                disabled={loading || lessonState.selectedActivities.length === 0}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Finish lesson
              </button>

              <button
                onClick={handleRestartLesson}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Restart lesson
              </button>
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

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Teacher role
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {activity.teacherRole}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Student task
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {activity.studentTask}
                      </p>
                    </div>
                  </div>

                  {activity.materials?.length > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Materials
                      </h4>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {activity.materials.map((material) => (
                          <span
                            key={material}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
                className="mt-6 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Generate new suggestions
              </button>
            )}
          </section>
        </div>
      )}

      {lessonState?.currentStage === "COMPLETE" && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Final Lesson Plan
          </h2>

          <div className="mt-4 text-sm text-slate-700">
            <p>
              <span className="font-medium">Subject:</span> {lessonState.subject}
            </p>
            <p>
              <span className="font-medium">Topic:</span> {lessonState.topic}
            </p>
            <p>
              <span className="font-medium">Duration:</span>{" "}
              {lessonState.totalDurationMinutes} minutes
            </p>
            <p>
              <span className="font-medium">Learning Outcomes:</span>{" "}
              {lessonState.mappedOutcomes.join(", ")}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {lessonState.selectedActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <h3 className="font-semibold text-slate-900">
                  {index + 1}. {activity.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {activity.lessonStage} · {activity.durationMinutes} minutes ·{" "}
                  {activity.method}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  {activity.description}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-medium">Teacher role:</span>{" "}
                  {activity.teacherRole}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">Student task:</span>{" "}
                  {activity.studentTask}
                </p>
                {activity.materials?.length > 0 && (
                  <div className="mt-3 text-sm text-slate-600">
                    <span className="font-medium">Materials:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activity.materials.map((material) => (
                        <span
                          key={material}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonBuilder;