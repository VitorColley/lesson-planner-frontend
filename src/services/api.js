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