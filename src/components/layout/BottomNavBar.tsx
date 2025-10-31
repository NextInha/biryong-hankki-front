// src/components/layout/BottomNavBar.tsx

import { NavLink } from 'react-router-dom';

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
                            className={`flex flex-col items-center ${
                                isActive ? 'text-blue-600' : 'text-gray-500' // 텍스트 색상 변경
                            } hover:text-blue-600 transition-colors`}
                        >
                            <div className="-mb-4 -mt-4">
                                <img
                                    // isActive 상태에 따라 아이콘 src를 동적으로 변경합니다.
                                    src={isActive ? link.activeIcon : link.icon}
                                    alt={link.label}
                                    className="w-16 h-16"
                                />
                            </div>
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
