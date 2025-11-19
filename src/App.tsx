import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Goals from './pages/Goals';
import Expenses from './pages/Expenses';
import Info from './pages/Info';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Layout />}>
          <Route path="calculator" element={<Calculator />} />
          <Route path="goals" element={<Goals />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="info" element={<Info />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
