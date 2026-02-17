import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { AddTransaction } from './pages/AddTransaction';
import { Insights } from './pages/Insights';
import { Chat } from './pages/Chat';
import { Goals } from './pages/Goals';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-[390px] mx-auto relative min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/goals" element={<Goals />} />
          </Routes>
          <BottomNav />
        </div>
      </div>
    </Router>
  );
}

export default App;
