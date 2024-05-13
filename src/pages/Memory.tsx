import {Unity, useUnityContext} from "react-unity-webgl";

function Memory() {
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/public.loader.js",
        dataUrl: "/public.data.unityweb",
        frameworkUrl: "/public.framework.js.unityweb",
        codeUrl: "/public.wasm.unityweb",
    });

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

        </>
    );
}


export default Memory