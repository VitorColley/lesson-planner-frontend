//retrieves curriculum mapping results from the backend
export async function mapCurriculum(payload){
    const response = await fetch("/api/curriculum/map",{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(payload),
    });

    if(!response.ok){
        const message = await response.text();
        throw new Error(message || "Failed to map curriculum");
    }

    return response.json();
}

//uploads curriculum file to the backend for processing
export async function uploadCurriculum(file){
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/curriculum/ingest`, {
        method: "POST",
        body: formData,
    });

    if(!response.ok){
        const message = await response.text();
        throw new Error(message || "Failed to upload curriculum");
    }

    return response.json();
}