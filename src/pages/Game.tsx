import { Unity, useUnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";

// Definir un tipo para los puntajes
interface Score {
    Username: string;
    Score: number;
}

function Game() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/Space-Wars/Build/Space-Wars.loader.js",
        dataUrl: "/Space-Wars/Build/Space-Wars.data.unityweb",
        frameworkUrl: "/Space-Wars/Build/Space-Wars.framework.js.unityweb",
        codeUrl: "/Space-Wars/Build/Space-Wars.wasm.unityweb",
    });

    const [topScores, setTopScores] = useState<Score[]>([]); // Especificar el tipo como Score[]

    useEffect(() => {
        fetchScores();
    }, []); 

    function fetchScores() {
        fetch("/get_top_scores_vj1.php")
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
                    <h1 className="centered-title">Star Wars / Tecsup</h1>
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
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topScores.map((score, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{score.Username}</td>
                                        <td>{score.Score}</td>
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

export default Game;
