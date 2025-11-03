// src/components/home/PurchaseButton.tsx

import { useNavigate } from 'react-router-dom';
import iconQR from '../../assets/icons/icon-qr.svg';

const PurchaseButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        // "QR을 누르면 주문하기 창으로 넘어간다"는 요청 구현
        navigate('/qr-scanner');
    };

    return (
        <button
            onClick={handleClick}
            className="
        w-full bg-[#0066B3] text-white text-lg font-bold
        flex items-center justify-center gap-3
        py-4 px-6 rounded-lg shadow-md
        hover:bg-blue-700 active:scale-[0.98] transition-all
      "
        >
            <img src={iconQR} alt="QR" className="w-6 h-6" />
            <span>식권 예매하기</span>
        </button>
    );
};

export default PurchaseButton;
