import { useState } from "react";
import "./JoinRoom.css";
import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { HiMiniUserGroup } from "react-icons/hi2";
import { toast } from "sonner";
import { getRoom } from "../../api/roomApi";

function JoinRoom() {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false);
    const handleJoinRoom = async () => {
        if (!roomCode.trim()) {
            toast.error("Please enter a room code.");
            return;
        }
        try {
            setLoading(true);
            const response = await getRoom(roomCode.trim().toUpperCase());
            const room = response.room;
            toast.success("Joined room successfully!");
            navigate("/booth", {
                state: {
                    roomName: room.roomName,
                    roomCode: room.roomCode,
                    username: "Guest"
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
        <div className="join-room">
            <div className="paper-card">
                <button
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    <HiChevronLeft />
                    Back
                </button>
                <div className="join-icon">
                    <HiMiniUserGroup />
                </div>
                <h1>Join Booth</h1>
                <p className="join-subtitle">
                    Enter the room code shared by your friend
                    to join the virtual photo booth.
                </p>
                <div className="section">
                    <label>Room Code</label>
                    <input
                        type="text"
                        placeholder="FT-AB12-CD"
                        value={roomCode}
                        maxLength={10}
                        onChange={(e) =>
                            setRoomCode(
                                e.target.value.toUpperCase()
                            )
                        }
                    />
                </div>
                <button
                    className="continue-btn"
                    disabled={!roomCode.trim() || loading}
                    onClick={handleJoinRoom}
                >
                    {loading ? "Joining..." : "Join Booth"}
                    <HiChevronRight />
                </button>
            </div>
        </div>
    );
}

export default JoinRoom;