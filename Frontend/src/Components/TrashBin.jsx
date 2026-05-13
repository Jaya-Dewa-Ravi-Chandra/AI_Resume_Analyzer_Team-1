import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TrashBin = () => {
  const navigate = useNavigate();
  const [trash, setTrash] = useState([]);

  const fetchTrash = async () => {
    try {
      const res = await axios.get("https://ai-resume-analyzer-team-1.onrender.com/resumeApi/trash", {
        withCredentials: true,
      });

      setTrash(res.data.payload || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id) => {
    await axios.patch(
      `https://ai-resume-analyzer-team-1.onrender.com/resumeApi/restore/${id}`,
      {},
      { withCredentials: true },
    );
    fetchTrash();
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://ai-resume-analyzer-team-1.onrender.com/resumeApi/permanent/${id}`, {
      withCredentials: true,
    });
    fetchTrash();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Trash Bin</h1>

      {trash.length === 0 ? (
        <p>No deleted files</p>
      ) : (
        trash.map((file) => (
          <div
            key={file.id}
            className="p-4 bg-white shadow rounded mb-3 flex justify-between"
          >
            <div>
              <p className="font-semibold">{file.fileName}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleRestore(file.id)}
                className="text-blue-500"
              >
                Restore
              </button>

              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-gray-700 text-white px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default TrashBin;
