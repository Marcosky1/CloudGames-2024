import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";

// Definir un tipo para los puntajes
interface Score {
    Username: string;
    Score: number;
    Coins: number;
}

function Shoter() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/Shoter-Game/Build/Shoter-Game.loader.js",
        dataUrl: "/Shoter-Game/Build/Shoter-Game.data.unityweb",
        frameworkUrl: "/Shoter-Game/Build/Shoter-Game.framework.js.unityweb",
        codeUrl: "/Shoter-Game/Build/Shoter-Game.wasm.unityweb",
    });

    const [topScores, setTopScores] = useState<Score[]>([]); // Especificar el tipo como Score[]

    useEffect(() => {
        // Fetch top scores from server for vj3
        fetchScores();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    function fetchScores() {
        fetch("/get_top_scores_vj3.php")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Score[]) => setTopScores(data)) // Asegurar que data sea del tipo Score[]
            .catch(error => console.error("Error fetching top scores:", error));
    }

    function handleClickSpawnEnemies() {
        sendMessage("GameManager", "SpawnEnemies");
    }

    function handleClickRestartScene() {
        sendMessage("GameManager", "RestartScene");
    }

    function handleClickMultiplyPoints() {
        sendMessage("GameManager", "MultiplyPoints");
    }

    return (
        <>
            <div className="centered-container">
                <div className="centered-content">
                    <h1 className="centered-title">Top Down Shooter / Tecsup</h1>
                    <Unity unityProvider={unityProvider} className="centered-unity" />

                    <div className="centered-content">
                        <button onClick={handleClickSpawnEnemies}>Spawn Enemies</button>
                        <button onClick={handleClickRestartScene}>Restart Scene</button>
                        <button onClick={handleClickMultiplyPoints}>Multiply Points</button>
                    </div>
                </div>
            </div>

            <div className="scoreboard-container">
                <div className="scoreboard">
                    <h2 className="scoreboard-title">Top 10 Players</h2>
                    <div className="scoreboard-frame">
                        <table className="scoreboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th>Score</th>
                                    <th>Coins</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topScores.map((score, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{score.Username}</td>
                                        <td>{score.Score}</td>
                                        <td>{score.Coins}</td>
                                    </tr>
                                ))}
                                {/* Fill remaining rows with "-" if less than 10 scores */}
                                {Array.from({ length: Math.max(10 - topScores.length, 0) }).map((_, index) => (
                                    <tr key={topScores.length + index + 1}>
                                        <td>{topScores.length + index + 1}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Shoter;
