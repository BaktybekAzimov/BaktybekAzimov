import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/common/ScrollProgress';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Kelechek from './pages/brands/Kelechek';
import Adygene from './pages/brands/Adygene';
import Gimalai from './pages/brands/Gimalai';
import Lemonads from './pages/brands/Lemonads';
import WhereToBuy from './pages/WhereToBuy';
import Partners from './pages/Partners';
import Contacts from './pages/Contacts';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <ScrollProgress />
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/brands/kelechek" element={<Kelechek />} />
            <Route path="/brands/adygene" element={<Adygene />} />
            <Route path="/brands/gimalai" element={<Gimalai />} />
            <Route path="/brands/lemonads" element={<Lemonads />} />
            <Route path="/where-to-buy" element={<WhereToBuy />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contacts" element={<Contacts />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
