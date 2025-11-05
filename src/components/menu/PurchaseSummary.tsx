import { useState } from 'react'; // [★수정★] useEffect 제거
import { useCartStore } from '../../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';
import { AxiosError } from 'axios';

// API 함수와 에러 타입 import
import { apiCreateOrder } from '../../api/order';
import type { ApiError } from '../../types/api';

const PurchaseSummary = () => {
    // store에서 items를 직접 가져옵니다.
    const { items, updateQuantity, removeItem, clearCart } = useCartStore();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // items 배열의 길이에 따라 isVisible 상태가 실시간으로 결정 -> 애니메이션 용도임
    const isVisible = items.length > 0;

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
            const orderData = await apiCreateOrder(items);
            clearCart();
            navigate('/payment', { state: { orderData } });
        } catch (err) {
            // (기존 에러 핸들링... 동일)
            const error = err as AxiosError<{ error: ApiError }>;
            if (error.response && error.response.data.error) {
                const errorData = error.response.data.error;
                console.error('주문 생성 실패:', errorData);

                switch (errorData.code) {
                    case 'EMPTY_CART':
                        setErrorMsg('장바구니가 비어있습니다.');
                        break;
                    case 'MENU_UNAVAILABLE':
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
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`
        fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto
        bg-white rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)]
        p-4 space-y-4
        
        transition-all duration-300 ease-out 
        ${
            isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-full pointer-events-none'
        }
      `}
        >
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

                        {/* 수량 조절 버튼 */}
                        <div className="flex items-center gap-3 p-1 ">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className=" bg-gray-100 flex items-center justify-center 
                  w-6 h-6 text-gray-500
                  rounded-full transition-all duration-150 ease-in-out 
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
                  rounded-full transition-all duration-150 ease-in-out 
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

            {/* 결제금액 및 구매하기 버튼 */}
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
            bg-primary text-white font-bold
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
