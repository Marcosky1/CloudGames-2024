import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from "./pages/Home.tsx";
import MainHeader from "./common/MainHeader.tsx";
import MainNav from "./common/MainNav.tsx";
import MainFooter from "./common/MainFooter.tsx";
import Game from "./pages/Game.tsx";
import Contact from "./pages/Contact.tsx";
import Memory from "./pages/Memory.tsx";
import Shoter from "./pages/Shoter.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <MainHeader />
                <MainNav />
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/game' element={<Game/>}/>
                    <Route path='/Memory' element={<Memory/>}/>
                    <Route path='/Shoter' element={<Shoter/>}/>
                    <Route path='/Contact' element={<Contact/>}/>
                </Routes>
                <MainFooter />
            </BrowserRouter>

        </>
    );
}


export default App
