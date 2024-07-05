import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";

// Definir un tipo para los puntajes
interface Score {
    Username: string;
    TimeCompleted: string;
}

function Memory() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/Memory-Game/Build/Memory-Game.loader.js",
        dataUrl: "/Memory-Game/Build/Memory-Game.data.unityweb",
        frameworkUrl: "/Memory-Game/Build/Memory-Game.framework.js.unityweb",
        codeUrl: "/Memory-Game/Build/Memory-Game.wasm.unityweb",
    });

    const [topScores, setTopScores] = useState<Score[]>([]); // Especificar el tipo como Score[]

    useEffect(() => {
        // Fetch top scores from server for vj2
        fetchScores();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    function fetchScores() {
        fetch("/get_top_scores_vj2.php")
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
        sendMessage("GameObject", "SpawnEnemies");
    }

    return (
        <>
            <div className="centered-container">
                <div className="centered-content">
                    <h1 className="centered-title">Memory Game / Tecsup</h1>
                    <Unity unityProvider={unityProvider} className="centered-unity" />

                    <div className="centered-content">
                        <button onClick={handleClickSpawnEnemies}>Spawn Enemies</button>
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
                                    <th>Time Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topScores.map((score, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{score.Username}</td>
                                        <td>{score.TimeCompleted}</td>
                                    </tr>
                                ))}
                                {/* Fill remaining rows with "-" if less than 10 scores */}
                                {Array.from({ length: Math.max(10 - topScores.length, 0) }).map((_, index) => (
                                    <tr key={topScores.length + index + 1}>
                                        <td>{topScores.length + index + 1}</td>
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

export default Memory;
