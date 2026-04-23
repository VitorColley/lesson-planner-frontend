import MappingForm from "../components/MappingForm";

function MapCurriculum() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Curriculum Mapping</h1>
      <p className="mt-2 text-slate-600">
        Submit lesson details and map them to curriculum outcomes using the
        backend service.
      </p>

      <div className="mt-8">
        <MappingForm />
      </div>
    </div>
  );
}

export default MapCurriculum;