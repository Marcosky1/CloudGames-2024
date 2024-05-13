import { Unity, useUnityContext } from "react-unity-webgl";

function Shoter() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/ShoterGame.loader.js",
        dataUrl: "/ShoterGame.data.unityweb",
        frameworkUrl: "/ShoterGame.framework.js.unityweb",
        codeUrl: "/ShoterGame.wasm.unityweb",
    });

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

        </>
    );
}

export default Shoter;
