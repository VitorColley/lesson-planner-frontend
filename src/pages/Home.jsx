function Home(){
    return(
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">
                Welcome to the Lesson Planner. Use the navigation above to upload
                curriculum documents and map lesson content to learning outcomes.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Upload Curriculum</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Add curriculum PDF documents to the system for ingestion and
                        retrieval.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Map Curriculum</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Submit lesson content and view matched outcomes with justification.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;