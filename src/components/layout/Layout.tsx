import { Outlet } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

const Layout = () => {
    return (
        <div className="container mx-auto flex flex-col h-screen">
            {/* --- 1. 페이지마다 바뀔 메인 콘텐츠 --- */}
            <main
                className="grow overflow-y-auto
            scrollbar-width-none 
          [&::-webkit-scrollbar]:hidden"
            >
                <Outlet />
            </main>

            {/* --- 2. 항상 고정될 공통 뼈대 --- */}
            <footer className="shrink-0">
                <BottomNavBar />
            </footer>
        </div>
    );
};

export default Layout;
