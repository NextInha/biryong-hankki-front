// src/components/menu/PurchaseSummary.tsx

import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';
import { AxiosError } from 'axios';

// API 함수와 에러 타입 import
import { apiCreateOrder } from '../../api/order';
import type { ApiError } from '../../types/api';

const PurchaseSummary = () => {
    const { items, updateQuantity, removeItem, clearCart } = useCartStore();
    const navigate = useNavigate();

    // 5. API 호출을 위한 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 총 결제 금액 계산
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // "구매하기" 버튼 클릭 시
    const handlePurchase = async () => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            // (items 배열을 그대로 넘겨주면, apiCreateOrder가 알아서 변환)
            const orderData = await apiCreateOrder(items);

            // 주문 생성 성공! 장바구니 비우기
            clearCart();

            // API 명세서 지침대로 '/payment' 페이지로 이동
            //    서버가 응답해 준 'orderData'를 state로 넘겨줌
            navigate('/payment', { state: { orderData } });
        } catch (err) {
            // API 에러 핸들링
            const error = err as AxiosError<{ error: ApiError }>;
            if (error.response && error.response.data.error) {
                const errorData = error.response.data.error;
                console.error('주문 생성 실패:', errorData);

                // 명세서에 따른 에러 메시지 분기
                switch (errorData.code) {
                    case 'EMPTY_CART':
                        setErrorMsg('장바구니가 비어있습니다.');
                        break;
                    case 'MENU_UNAVAILABLE':
                        // (품절 메뉴 처리는 조금 더 복잡하니, 일단 공통 메시지)
                        setErrorMsg('품절된 메뉴가 포함되어 있습니다.');
                        break;
                    case 'UNAUTHORIZED':
                        setErrorMsg('로그인이 필요합니다.');
                        break;
                    default:
                        setErrorMsg('주문 생성에 실패했습니다.');
                }
            } else {
                setErrorMsg('네트워크 오류가 발생했습니다.');
            }
            setIsLoading(false); // 12. 에러 발생 시 로딩 종료
        }
    };

    return (
        // 화면 하단에 고정되는 레이아웃
        <div
            className="
        fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto
        bg-white rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)]
        p-4 space-y-4
        animate-slideUp
      "
        >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />

            {/* 장바구니 아이템 목록 (스크롤 가능) */}
            <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                        >
                            <HiXMark className="w-5 h-5" />
                        </button>

                        {/* 메뉴 이름, 가격 */}
                        <div className="grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.price.toLocaleString()}원
                            </p>
                        </div>
                        <div className="flex items-center  gap-3 p-1 ">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className=" bg-gray-100 flex items-center justify-center  
      w-6 h-6 text-gray-500
     rounded-4xl transition-all duration-150 ease-in-out 
        
        active:scale-[0.80] active:opacity-60"
                            >
                                -
                            </button>
                            <span className="font-bold w-4 text-center">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.id, +1)}
                                className="bg-gray-100 flex items-center justify-center  
      w-6 h-6 text-gray-500
     rounded-4xl transition-all duration-150 ease-in-out
        
        active:scale-[0.80] active:opacity-60"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 에러 메시지 표시 영역 */}
            {errorMsg && (
                <p className="text-red-500 text-sm text-center -my-2">
                    {errorMsg}
                </p>
            )}

            {/*  결제금액 및 구매하기 버튼 */}
            <div className="flex justify-between items-center pt-4 mb-2 border-t border-gray-200">
                <div>
                    <span className="text-sm text-gray-500">결제금액</span>
                    <p className="text-2xl font-bold text-gray-900">
                        {totalPrice.toLocaleString()}원
                    </p>
                </div>
                <button
                    onClick={handlePurchase}
                    disabled={isLoading} // 로딩 중 비활성화
                    className="
            bg-[#0066B3] text-white font-bold
            py-3 px-8 rounded-lg 
            hover:bg-blue-700 transition-colors
            active:scale-95
            disabled:bg-gray-400
          "
                >
                    {isLoading ? '주문 생성 중...' : '구매하기'}
                </button>
            </div>
        </div>
    );
};

export default PurchaseSummary;
