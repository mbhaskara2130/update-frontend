import React from "react";

const leaderboardData = [
  { id: 1, name: "Arina", score: 95 },
  { id: 2, name: "Budi", score: 90 },
  { id: 3, name: "Citra", score: 85 },
  { id: 4, name: "Dedi", score: 80 },
  { id: 5, name: "Eka", score: 78 },
  { id: 6, name: "Fajar", score: 75 },
];

export default function LeaderboardPage() {
  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">🏆 Leaderboard</h1>

      {/* Top 3 */}
      <div className="flex items-end justify-center gap-6 mb-12">
        {/* #2 */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center text-xl font-bold">
            {topThree[1].name[0]}
          </div>
          <p className="mt-2 font-semibold">{topThree[1].name}</p>
          <p className="text-gray-600">Score: {topThree[1].score}</p>
          <span className="mt-1 bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-sm">#2</span>
        </div>

        {/* #1 */}
        <div className="flex flex-col items-center -mt-10">
          <div className="bg-yellow-300 rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold">
            {topThree[0].name[0]}
          </div>
          <p className="mt-2 font-bold text-lg">{topThree[0].name}</p>
          <p className="text-gray-600">Score: {topThree[0].score}</p>
          <span className="mt-1 bg-yellow-400 text-gray-800 px-3 py-0.5 rounded-full text-sm">#1</span>
        </div>

        {/* #3 */}
        <div className="flex flex-col items-center">
          <div className="bg-orange-200 rounded-full w-20 h-20 flex items-center justify-center text-xl font-bold">
            {topThree[2].name[0]}
          </div>
          <p className="mt-2 font-semibold">{topThree[2].name}</p>
          <p className="text-gray-600">Score: {topThree[2].score}</p>
          <span className="mt-1 bg-orange-300 text-gray-700 px-2 py-0.5 rounded-full text-sm">#3</span>
        </div>
      </div>

      {/* Other Rankings */}
      <div className="w-full max-w-2xl space-y-4">
        {others.map((user, index) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-white shadow-md rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-700">#{index + 4}</span>
              <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                {user.name[0]}
              </div>
              <p className="font-medium">{user.name}</p>
            </div>
            <p className="font-semibold text-gray-800">{user.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
