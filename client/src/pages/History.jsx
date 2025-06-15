import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://ai-code-debugger.onrender.com/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg font-semibold">Loading your debug history...</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-lg">⚠️ No debug history found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white px-6 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center"> </h2>

        <div className="space-y-6">
          {history.map((entry) => (
            <div
              key={entry._id}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-lg transition hover:shadow-2xl"
            >
              <p className="mb-2">
                <span className="font-semibold text-green-400">Language:</span>{" "}
                {entry.language.toUpperCase()}
              </p>

              {/* Code Block */}
              <div className="mb-4 relative">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-green-400">Code:</p>
                  <button
                    onClick={() => handleCopy(entry.code, entry._id + "_code")}
                    className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded-md transition duration-200"
                  >
                    {copiedId === entry._id + "_code" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-zinc-800 rounded-md p-3 text-sm overflow-x-auto">
                  <code>{entry.code}</code>
                </pre>
              </div>

              {/* Response Block */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-green-400">AI Response:</p>
                  <button
                    onClick={() => handleCopy(entry.response, entry._id + "_response")}
                    className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded-md transition duration-200"
                  >
                    {copiedId === entry._id + "_response" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-zinc-800 rounded-md p-3 text-sm overflow-x-auto text-green-200">
                  <code>{entry.response}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
   
  );
};

export default History;
