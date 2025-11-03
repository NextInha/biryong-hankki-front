import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout'; // BottomNavBar를 포함한 레이아웃
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage.tsx';
import ReviewPage from './pages/ReviewPage';
import PurchasePage from './pages/PurchasePage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import QrScannerPage from './pages/QrScannerPage.tsx';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route element={<Layout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/my" element={<MyPage />} />
                </Route>

                <Route path="/purchase" element={<PurchasePage />} />
                <Route path="/qr-scanner" element={<QrScannerPage />} />
            </Routes>
        </>
    );
}

export default App;
