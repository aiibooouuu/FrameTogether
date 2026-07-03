import { useState } from "react";
import "./CreateRoom.css";
import { useNavigate } from "react-router-dom";
import { FaRegClipboard, FaCheck } from "react-icons/fa6";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { createRoom } from  "../../api/roomApi.js";
import { toast } from "sonner";
function CreateRoom() {

const [copied, setCopied] = useState(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(roomCode);

    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => {
      setCopied(false);
    }, 2000);

  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
 const navigate = useNavigate();

const [roomName, setRoomName] = useState("");

const [roomCode, setRoomCode] = useState("");

const [loading, setLoading] = useState(false);

const handleCreateRoom = async () => {
    if (!roomName.trim()) {
        toast.error("Please enter a room name.");
        return;
    }
    try {
        setLoading(true);
        const response = await createRoom(roomName);
        const room = response.room;
        toast.success("Room created successfully!");
        setRoomCode(room.roomCode);
        navigate("/booth", {
            state: {
                roomName: room.roomName,
                roomCode: room.roomCode,
                username: "Host"
            }
        });
    }
    catch (error) {
        toast.error(error.message);
    }
    finally {
        setLoading(false);
    }
};

return (
    <div className="create-room">

    <div className="paper-card">

        <button
        className="back-btn"
        onClick={() => navigate("/")}
        >
        <HiChevronLeft />
        Back
        </button>

        <h1>Create Booth</h1>

        <div className="section">

        <label>Room Name</label>

        <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
        />

        <button
            className="secondary-btn"
        >
            Generate Another
        </button>

        </div>

        <div className="section">

        <label>Room Code</label>

        <div className="code-box">

            <span>
                {roomCode || "Generated after creation"}
            </span>
            <button
                disabled={!roomCode}
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={copyCode}
            >
                {copied ? (
                    <>
                    <FaCheck />
                    Copied
                    </>
                ) : (
                    <>
                    <FaRegClipboard />
                    Copy
                    </>
                )}
            </button>

        </div>

        </div>

        <p className="info">
        Share this room code with another person.
        Once they join, both of you can capture
        memories together in the same virtual booth.
        </p>

        <button
        className="continue-btn"
        onClick={handleCreateRoom}
        disabled={!roomName.trim() || loading}
        >
        {loading ? "Creating..." : "Continue"} <HiChevronRight />
        </button>

    </div>

    </div>
);
}

export default CreateRoom;