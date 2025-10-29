function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory, closeSidebar }) {

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <div className="p-4 md:p-6 bg-zinc-900 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl dark:text-white text-zinc-100">Recent Search</h1>
        <button
          onClick={clearHistory}
          className="cursor-pointer p-1 hover:bg-zinc-800 rounded"
          title="Clear all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#EFEFEF"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </div>

      {/* List */}
      <ul className="text-left overflow-auto mt-2">
        {recentHistory &&
          recentHistory.map((item, index) => (
            <div
              key={index}
              className="flex justify-between pr-3 py-1 items-center"
            >
              <li
                onClick={() => {
                  setSelectedHistory(item);
                  if (closeSidebar) closeSidebar(); // 👈 close sidebar on mobile after clicking
                }}
                className="w-full pl-5 px-5 truncate dark:text-zinc-400 text-zinc-300 cursor-pointer dark:hover:bg-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
              >
                {item}
              </li>
              <button
                onClick={() => clearSelectedHistory(item)}
                className="cursor-pointer hover:bg-zinc-800 bg-zinc-700 p-1 rounded"
                title="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#EFEFEF"
                >
                  <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                </svg>
              </button>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default RecentSearch;
