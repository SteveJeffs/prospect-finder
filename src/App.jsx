import { BrowserRouter, Routes, Route } from 'react-router'
import SearchPage from '.SearchPage.jsx'
import BusinessPage from './BusinessPage.jsx'

function App () {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/business/:osmType/:id" element={<SearchPage />} />
            </Routes>
            </BrowserRouter>
    )
}

export default App