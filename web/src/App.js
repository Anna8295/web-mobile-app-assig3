import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Place from './Place'
import Dashboard from "./components/Dasboard";
import Login from './components/Login'
import Register from './components/Register'

function App () {
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<Register />} />
                <Route exact path="/place" element={<Place />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    )
}

export default App


