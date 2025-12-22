import { FaVideo } from "react-icons/fa";

export default function UpcomingLive({ events = [] }) {
  if (!events.length) {
    return (
      <div className="bg-[#0d0d17] p-5 rounded-2xl">
        <p className="text-gray-400 text-sm">No upcoming live sessions.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d17] p-5 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <FaVideo className="text-purple-400" />
        <h3 className="text-purple-300 font-semibold">
          Upcoming Live
        </h3>
      </div>

      {events.map((e) => (
        <div
          key={e._id}
          className="bg-[#11111f] p-4 rounded-xl flex justify-between items-center mb-3"
        >
          <div>
            <div className="font-semibold">{e.title}</div>
            <div className="text-xs text-gray-400">
              {new Date(e.date).toDateString()} • {e.time}
            </div>
          </div>

          <button className="bg-purple-600 px-4 py-2 rounded text-sm">
            Join Live
          </button>
        </div>
      ))}
    </div>
  );
}
