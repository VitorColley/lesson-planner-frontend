//Error handling helper to extract error messages from API responses
async function extractErrorMessage(response, fallbackMessage) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const errorBody = await response.json();
    return errorBody.message || fallbackMessage;
  }

  const text = await response.text();
  return text || fallbackMessage;
}

//Retrieves curriculum mapping results from the backend
export async function mapCurriculum(payload){
    const response = await fetch("/api/curriculum/map",{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(payload),
    });

    if(!response.ok){
        const message = await extractErrorMessage(response, "Failed to map curriculum");
        throw new Error(message);
    }

    return response.json();
}

//Uploads curriculum file to the backend for processing
export async function uploadCurriculum(file){
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/curriculum/ingest`, {
        method: "POST",
        body: formData,
    });

    if(!response.ok){
        const message = await extractErrorMessage(response, "Failed to upload curriculum");
        throw new Error(message);
    }

    return response.json();
}

//Sends the current lesson state to the backend to get activity suggestions
export async function suggestActivities(lessonState) {
  const response = await fetch("/api/lesson-builder/suggest-activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lessonState),
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Failed to suggest activities"
    );
    throw new Error(message);
  }

  return response.json();
}

//Sends the selected activity back to the backend to update the lesson state
export async function selectActivity(lessonState, selectedActivity) {
  const response = await fetch("/api/lesson-builder/select-activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lessonState,
      selectedActivity,
    }),
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Failed to select activity"
    );
    throw new Error(message);
  }

  return response.json();
}