import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout'; // BottomNavBar를 포함한 레이아웃
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage.tsx';
import ReviewPage from './pages/ReviewPage';
import PurchasePage from './pages/PurchasePage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import QrScannerPage from './pages/QrScannerPage.tsx';
import PaymentPage from './components/payment/PaymentPage';
import OrderCompletePage from './components/payment/OrderCompletePage';

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

                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-complete" element={<OrderCompletePage />} />
            </Routes>
        </>
    );
}

export default App;
