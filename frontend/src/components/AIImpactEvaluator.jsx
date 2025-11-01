import { useState } from "react";
import axios from "axios";

export default function AIImpactEvaluator() {
  const [form, setForm] = useState({ title: "", description: "", budget: "", goals: "" });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:4000/api/ai/evaluate/1", form);

    setResult(res.data.result);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">AI Impact Evaluator</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" placeholder="Project Title" onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="budget" placeholder="Budget" onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="goals" placeholder="Goals" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Analyze</button>
      </form>
      {result && (
        <div className="mt-6 p-4 border rounded bg-pink-50">
          <h3 className="font-semibold">AI Evaluation Result:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
