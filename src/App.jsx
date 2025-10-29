import { useEffect, useRef, useState } from 'react'
import './App.css'
import { URL } from './constants';
import RecentSearch from './components/RecentSearch';
import QuestionAnswer from './components/QuestionAnswer';
import { FiSend } from "react-icons/fi";

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')));
  const [selectedHistory, setSelectedHistory] = useState('');
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState('dark');
  const [showSidebar, setShowSidebar] = useState(false);

  const scrollToAns = useRef();

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    if (question) {
      let history = JSON.parse(localStorage.getItem('history')) || [];
      history = [question, ...history.slice(0, 19)];
      history = history.map(item => item.charAt(0).toUpperCase() + item.slice(1).trim());
      history = [...new Set(history)];
      localStorage.setItem('history', JSON.stringify(history));
      setRecentHistory(history);
    }

    const payloadData = question || selectedHistory;
    const payload = {
      contents: [{ parts: [{ text: payloadData }] }]
    };

    setLoader(true);
    let response = await fetch(URL + "AIzaSyB7fjvQj8FIGnm09eI7SzxkCnaL0j5c4Ew", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text.split("* ").map(i => i.trim());

    setResult(prev => [...prev, { type: 'q', text: payloadData }, { type: 'a', text: dataString }]);
    setQuestion('');
    setLoader(false);

    setTimeout(() => {
      if (scrollToAns.current) {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }
    }, 500);
  };

  const isEnter = (event) => {
    if (event.key === 'Enter') askQuestion();
  };

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className={darkMode === 'dark' ? 'dark' : 'light'}>
      <div className="relative h-screen flex flex-col md:grid md:grid-cols-5 text-center overflow-hidden">

        {/* Sidebar for desktop */}
        <div className="hidden md:block bg-zinc-900">
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>

        {/* Sidebar bar for mobile */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowSidebar(false)}
            ></div>

            {/* Sidebar */}
            <div className="relative bg-zinc-900 w-64 h-full z-50 shadow-lg">
              <RecentSearch
                recentHistory={recentHistory}
                setRecentHistory={setRecentHistory}
                setSelectedHistory={setSelectedHistory}
                closeSidebar={() => setShowSidebar(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="col-span-4 flex flex-col items-center justify-between p-4 md:p-10 relative">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden fixed top-4 left-4 z-40 text-white p-2"
          >
            ☰
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center 
            bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 mb-4">
            Hello User, Ask me Anything
          </h1>

          {/* Answer container */}
          <div
            ref={scrollToAns}
            className="container h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-scroll scroll-hidden text-white"
          >
            <ul>
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))}
            </ul>
          </div>

          {/* Loader */}
          {loader && (
            <div role="status" className="my-3">
                <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591..."
                  fill="currentColor"
                />
              </svg>
            </div>
          )}

          {/* Input box */}
          <div className="dark:bg-zinc-800 bg-red-100 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%]
              p-1 pr-3 dark:text-white text-zinc-800 m-auto rounded-3xl border border-zinc-700
              flex items-center h-14 md:h-16">
            <input
              type="text"
              value={question}
              onKeyDown={isEnter}
              onChange={(event) => setQuestion(event.target.value)}
              className="w-full h-full p-3 outline-none bg-transparent"
              placeholder="Ask me anything"
            />
            <button
              onClick={askQuestion}
              className="text-purple-500 hover:text-purple-400 transition p-2"
            >
              <FiSend size={22} />
            </button>
          </div>

          {/* Dark/Light mode selector */}
          <select
            onChange={(event) => setDarkMode(event.target.value)}
            className="fixed text-white bottom-2 left-2 bg-zinc-700 rounded-md p-2"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;