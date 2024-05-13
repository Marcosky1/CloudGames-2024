import {Unity, useUnityContext} from "react-unity-webgl";

function Game() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/CloudGames.loader.js",
        dataUrl: "/CloudGames.data.unityweb",
        frameworkUrl: "/CloudGames.framework.js.unityweb",
        codeUrl: "/CloudGames.wasm.unityweb",
    });

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

        </>
    );
}


export default Game