import UploadForm from "../components/UploadForm";

function UploadCurriculum() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Upload Curriculum</h1>
      <p className="mt-2 text-slate-600">
        Upload curriculum documents for processing and storage.
      </p>

      <div className="mt-8">
        <UploadForm />
      </div>
    </div>
  );
}

export default UploadCurriculum;