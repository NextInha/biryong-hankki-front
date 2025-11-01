// src/components/menu/PurchaseSummary.tsx
import { useCartStore } from '../../store/useCartStore';
import { HiXMark } from 'react-icons/hi2'; // 'X' 아이콘
// import { useNavigate } from 'react-router-dom';

const PurchaseSummary = () => {
    const { items, updateQuantity, removeItem } = useCartStore();
    // onst navigate = useNavigate();

    // 2. 총 결제 금액 계산
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 3. "구매하기" 버튼 클릭 시
    const handlePurchase = () => {
        console.log('주문할 아이템:', items);
        // TODO: 여기에 API 호출(createOrder) 로직을 붙일 거예요.
        alert('API 연동 준비 완료!');
    };

    return (
        // 4. 화면 하단에 고정되는 레이아웃 (애니메이션 포함)
        <div
            className="
        fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto
        bg-white rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)]
        p-4 space-y-4
        animate-slideUp
      "
        >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />

            {/* 5. 장바구니 아이템 목록 (스크롤 가능) */}
            <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        {/* 6. 'X' 삭제 버튼 */}
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                        >
                            <HiXMark className="w-5 h-5" />
                        </button>

                        {/* 메뉴 이름, 가격 */}
                        <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">
                                {item.price.toLocaleString()}원
                            </p>
                        </div>

                        {/* 7. 수량 조절 버튼 */}
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

            <div className="flex justify-between items-center pt-4 mb-2 border-t border-gray-200">
                <div>
                    <span className="text-sm text-gray-500">결제금액</span>
                    <p className="text-2xl font-bold text-gray-900">
                        {totalPrice.toLocaleString()}원
                    </p>
                </div>
                <button
                    onClick={handlePurchase}
                    className="
            bg-[#0066B3] text-white font-bold
            py-3 px-8 rounded-lg 
            hover:bg-blue-700 transition-colors
            active:scale-95
          "
                >
                    구매하기
                </button>
            </div>
        </div>
    );
};
export default PurchaseSummary;
