function ScoreMeter({ score = 75 }) {
  const radius = 135;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[375px] h-[210px] overflow-hidden">
        {/* Background Arc */}
        <svg
          className="absolute top-0 left-0"
          width="375"
          height="210"
          viewBox="0 0 375 210"
        >
          <path
            d="M 37 180 A 135 135 0 0 1 338 180"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="28"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 37 180 A 135 135 0 0 1 338 180"
            fill="transparent"
            stroke="#22c55e"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
          />
        </svg>

        {/* Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-7">
          <h1 className="text-6xl font-bold">{score}</h1>
          <p className="text-gray-500 text-xl">ATS Score</p>
        </div>
      </div>
    </div>
  );
}

export default ScoreMeter;
