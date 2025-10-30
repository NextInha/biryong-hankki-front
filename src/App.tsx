import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout'; // BottomNavBar를 포함한 레이아웃
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage.tsx';
import ReviewPage from './pages/ReviewPage';
import PurchasePage from './pages/PurchasePage';
import MyPage from './pages/MyPage';
// import LoginPage from './pages/LoginPage';

function App() {
    return (
        <>
            <Routes>
                {/* 로그인 페이지는 BottomNavBar가 없으므로 Layout 밖에 배치 */}
                {/* <Route path="/login" element={<LoginPage />} /> */}

                {/* BottomNavBar가 필요한 페이지들은 Layout 컴포넌트 안에 배치 */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/my" element={<MyPage />} />
                    <Route path="/purchase" element={<PurchasePage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
