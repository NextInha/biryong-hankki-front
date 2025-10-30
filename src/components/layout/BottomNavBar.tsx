// src/components/layout/BottomNavBar.tsx

import { NavLink } from 'react-router-dom';

// 멘토's Tip:
// 1. 아래 import 경로는 src/assets/images/ 폴더에 실제 파일이 있다고 가정합니다.
// 2. 파일 이름(예: icon-home.svg)은 가지고 계신 파일 이름으로 변경해야 합니다.
// 3. SVG 파일을 React 컴포넌트처럼 import하려면 Vite에서는 파일명 뒤에 ?react를 붙이거나
//    CRA(Create React App)에서는 import { ReactComponent as HomeIcon } ... 처럼 씁니다.
//    여기서는 간단하게 <img> 태그를 쓸 것이므로, 파일 경로만 import 합니다.

import homeIcon from '../../assets/icons/icon-home-gray.svg';
import homeActiveIcon from '../../assets/icons/icon-home-blue.svg';
import menuIcon from '../../assets/icons/icon-menu-gray.svg';
import menuActiveIcon from '../../assets/icons/icon-menu-blue.svg';
import reviewIcon from '../../assets/icons/icon-review-gray.svg';
import reviewActiveIcon from '../../assets/icons/icon-review-blue.svg';
import myIcon from '../../assets/icons/icon-user-gray.svg';
import myActiveIcon from '../../assets/icons/icon-user-blue.svg';

// 각 탭의 정보를 배열로 관리합니다 (활성/비활성 아이콘 경로 포함)
const navLinks = [
    { path: '/home', label: '홈', icon: homeIcon, activeIcon: homeActiveIcon },
    {
        path: '/menu',
        label: '메뉴',
        icon: menuIcon,
        activeIcon: menuActiveIcon,
    },
    {
        path: '/review',
        label: '리뷰',
        icon: reviewIcon,
        activeIcon: reviewActiveIcon,
    },
    { path: '/my', label: 'MY', icon: myIcon, activeIcon: myActiveIcon },
];

const BottomNavBar = () => {
    return (
        <nav className="w-full h-16 bg-white shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.1),0_-2px_4px_-2px_rgb(0,0,0,0.1)] flex justify-around items-center sticky bottom-0">
            {navLinks.map((link) => (
                <NavLink to={link.path} key={link.path} end={link.path === '/'}>
                    {({ isActive }) => (
                        <div
                            className={`flex flex-col items-center gap-1 ${
                                isActive ? 'text-blue-600' : 'text-gray-500' // 텍스트 색상 변경
                            } hover:text-blue-600 transition-colors`}
                        >
                            <img
                                // isActive 상태에 따라 아이콘 src를 동적으로 변경합니다.
                                src={isActive ? link.activeIcon : link.icon}
                                alt={link.label}
                                className="w-6 h-6"
                            />
                            <span className="text-xs font-medium">
                                {link.label}
                            </span>
                        </div>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNavBar;
