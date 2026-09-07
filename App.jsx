import React, { useEffect, useState } from 'react';

const BACKEND_URL = 'http://127.0.0.1:5000';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/auth/status`)
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated) fetchEmails();
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const fetchEmails = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/emails`)
      .then((res) => res.json())
      .then((data) => {
        if (data.emails) setEmails(data.emails);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAskAssistant = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse('');

    fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt: aiPrompt,
        inboxContext: emails.map((e) => ({ from: e.from, subject: e.subject, snippet: e.snippet })),
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Received HTML fallback instead of server response.');
        }
      })
      .then((data) => {
        setAiResponse(data.result || data.error);
        setAiLoading(false);
      })
      .catch((err) => {
        setAiResponse(`Error: ${err.message}`);
        setAiLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-indigo-400">Nebula Mail</h1>
        <span className="text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          Connected
        </span>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Inbox ({emails.length})</h2>
            <button
              onClick={fetchEmails}
              className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading emails...</p>
          ) : (
            <div className="space-y-3">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 bg-slate-800/60 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-200">{email.from}</span>
                    <span className="text-xs text-slate-500">{email.date}</span>
                  </div>
                  <h3 className="text-indigo-300 text-sm font-medium mb-1">{email.subject}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{email.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col h-[550px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
            <span className="text-lg">✨</span>
            <h2 className="text-lg font-bold text-indigo-300">Nebula AI Assistant</h2>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-sm">
            {aiLoading ? (
              <p className="text-indigo-400 animate-pulse">Thinking...</p>
            ) : aiResponse ? (
              <p className="whitespace-pre-line text-slate-200">{aiResponse}</p>
            ) : (
              <p className="text-slate-500 italic">
                Ask me anything! E.g. "Draft a reply for my ChatGPT email" or "Summarize my inbox".
              </p>
            )}
          </div>

          <form onSubmit={handleAskAssistant} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your request here..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 text-sm text-slate-100 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded transition disabled:opacity-50"
            >
              {aiLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}