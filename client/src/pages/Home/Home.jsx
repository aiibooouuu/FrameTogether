import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FaCameraRetro } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";

function Home() {
    const navigate = useNavigate();
return (
    
    <main className="home">

    <div className="texture"></div>

    <section className="hero">

        <p className="eyebrow">
        VIRTUAL PHOTO BOOTH
        </p>

        <h1>
        Frame<span>Together</span>
        </h1>

        <p className="subtitle">
        Create memories together,
        even when you're apart.
        </p>

        <div className="polaroids">

        {/* CREATE ROOM */}

        <div className="polaroid left"
        onClick={() => navigate("/create-room")}
        >

            <div className="tape"></div>

            <div className="photo">

            <FaCameraRetro className="photoIcon" />

            </div>

            <div className="caption">

            <h2>Create Room</h2>

            <p>
                Start a private booth and
                invite someone.
            </p>

            </div>

        </div>

        {/* JOIN ROOM */}

        <div className="polaroid right"
        onClick={() => navigate("/join-room")}
        >

            <div className="tape"></div>

            <div className="photo">

            <HiMiniUserGroup className="photoIcon" />

            </div>

            <div className="caption">

            <h2>Join Room</h2>

            <p>
                Enter a room code and
                start capturing memories.
            </p>

            </div>

        </div>

        </div>

        <footer>

        <span>Version 0.1</span>

        <span>
            Two people • One memory
        </span>

        </footer>

    </section>

    </main>
);
}

export default Home;