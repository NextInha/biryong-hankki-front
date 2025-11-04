// src/pages/OrderCompletePage.tsx

import { useNavigate } from 'react-router-dom';
import iconX from '../../assets/icons/icon-x.svg';
// (가정) 아이콘 및 오리 이미지 import
import iconCheck from '../../assets/icons/icon-check.svg';
import imgDuck from '../../assets/icons/icon-induck-big.svg';

const OrderCompletePage = () => {
    const navigate = useNavigate();

    // (나중에 API 연동 시)
    // const location = useLocation();
    // const orderResult = location.state?.orderResult;
    // (orderResult.shareQrCode를 이용해 QR 코드 띄우기)

    // 1. "X" 버튼 클릭 시 홈으로 이동
    const handleClose = () => {
        navigate('/'); // 메인 홈으로 이동
    };

    return (
        <div className="flex flex-col h-screen bg-white items-center justify-between p-8">
            {/* 1. 상단 X 버튼 */}
            <div className="w-full flex justify-start">
                <button onClick={handleClose} className="text-gray-500">
                    <img src={iconX} className="w-8 h-8"></img>
                </button>
            </div>

            {/* 2. 중앙 컨텐츠 */}
            <div className="flex flex-col items-center gap-6">
                <img src={iconCheck} alt="주문 완료" className="w-20 h-20" />
                <h1 className="text-2xl font-bold text-gray-900">
                    주문이 완료되었어요!
                </h1>
                <p className="text-gray-600">주문번호를 확인해주세요.</p>
            </div>

            {/* 3. 하단 오리 이미지 */}
            <img src={imgDuck} alt="비룡이" className="w-40" />
        </div>
    );
};

export default OrderCompletePage;
