// src/pages/PaymentPage.tsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopHeaderSecond from '../../components/layout/TopHeaderSecond';
// (가정) 아이콘 import
// import iconKakao from '../assets/icons/icon-kakao.svg';
// import iconNaver from '../assets/icons/icon-naver.svg';
// import iconPayco from '../assets/icons/icon-payco.svg';
// import iconToss from '../assets/icons/icon-toss.svg';
// import iconCard from '../assets/icons/icon-card.svg';
// import iconOther from '../assets/icons/icon-other.svg';

// // 1. 결제 수단 타입 정의
// const PAYMENT_METHODS = [
//     { id: 'card', name: '신용/체크카드', icon: iconCard },
//     { id: 'kakao', name: '카카오페이', icon: iconKakao },
//     { id: 'naver', name: '네이버페이', icon: iconNaver },
//     { id: 'payco', name: '페이코', icon: iconPayco },
//     { id: 'toss', name: '토스페이', icon: iconToss },
//     { id: 'other', name: '기타 결제 수단', icon: iconOther },
// ];

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // 2. [★핵심★] PurchaseSummary가 넘겨준 '주문 데이터'를 받음
    const orderData = location.state?.orderData;

    // 3. '결제 수단' 선택 상태
    const [selectedMethod, setSelectedMethod] = useState('card');
    // 4. '결제 진행 중' 로딩 상태
    const [isProcessing, setIsProcessing] = useState(false);

    // 5. '결제하기' 버튼 클릭 시 (UI 시뮬레이션)
    const handlePayment = async () => {
        setIsProcessing(true);

        // --- (UI 구현 단계: 2초간 가짜로 PG사 연동 및 API 호출 시뮬레이션) ---
        console.log(
            `[${orderData.orderId}] 주문에 대해 [${selectedMethod}]로 결제 시도...`
        );

        setTimeout(() => {
            // (가짜) 결제 성공!
            setIsProcessing(false);

            // '주문 결제 API' 명세서대로 'OrderComplete' 페이지로 이동
            navigate('/order-complete');
        }, 2000); // 2초 딜레이

        // --- (나중에 API 연동 시, 위 setTimeout을 지우고 이 코드를 활성화) ---
        /*
    try {
      // 1. (가정) PG사 위젯(토스/아임포트) 호출
      // const pgResponse = await TossPayments.requestPayment(...);
      // const paymentKey = pgResponse.paymentKey;
      const fakePaymentKey = 'fake-payment-key-abc';

      // 2. (가정) src/api/order.ts에 'apiProcessPayment' 함수가 있다고 가정
      // const responseData = await apiProcessPayment(orderData.orderId, {
      //   paymentKey: fakePaymentKey,
      //   amount: orderData.totalPrice,
      // });

      // 3. 결제 완료 페이지로 이동
      // navigate('/order-complete', { state: { orderResult: responseData } });

    } catch (error) {
      alert('결제에 실패했습니다: ' + error.message);
      setIsProcessing(false);
    }
    */
    };

    // 6. orderData가 없는 비정상 접근 차단
    if (!orderData) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <p>잘못된 접근입니다. 주문을 다시 시작해주세요.</p>
                <button
                    onClick={() => navigate('/purchase')}
                    className="text-blue-600"
                >
                    메뉴 선택으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <TopHeaderSecond title="구매하기" />

            {/* 7. 스크롤 영역 (헤더/푸터 제외) */}
            <main className="grow overflow-y-auto pt-20 pb-24">
                {/* 주문 정보 카드 */}
                <div className="bg-white shadow-md rounded-lg m-4 p-6 text-center">
                    <p className="font-semibold text-gray-600">
                        {orderData.restaurantName}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                        {orderData.items[0].menuName}{' '}
                        {orderData.items.length > 1
                            ? `외 ${orderData.items.length - 1}건`
                            : ''}
                    </p>
                    <p className="text-8xl font-bold tracking-wider text-blue-600">
                        {orderData.ticketNumber}
                    </p>
                </div>

                {/* 주문 내역 */}
                {/* <div className="bg-white shadow-md rounded-lg m-4 p-6">
                    <h3 className="text-lg font-bold mb-4">주문내역</h3>
                    {orderData.items.map((item: any) => (
                        <div
                            key={item.menuName}
                            className="mb-3 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0"
                        >
                            <p className="font-semibold">
                                (중식) {item.menuName} (x{item.quantity})
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {item.ingredients}
                            </p>
                            <p className="text-right font-bold text-gray-800">
                                {item.subtotal.toLocaleString()}원
                            </p>
                        </div>
                    ))}
                </div> */}

                {/* 결제 수단 */}
                <div className="bg-white shadow-md rounded-lg m-4 p-6">
                    <h3 className="text-lg font-bold mb-4">결제수단</h3>
                    <div className="space-y-4">
                        {PAYMENT_METHODS.map((method) => (
                            <label
                                key={method.id}
                                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer"
                                onClick={() => setSelectedMethod(method.id)}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={selectedMethod === method.id}
                                    onChange={() =>
                                        setSelectedMethod(method.id)
                                    }
                                    className="w-5 h-5 text-blue-600"
                                />
                                <img
                                    src={method.icon}
                                    alt={method.name}
                                    className="w-6 h-6"
                                />
                                <span className="font-semibold">
                                    {method.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </main>

            {/* 8. 하단 고정 결제 버튼 */}
            <footer
                className="
          fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto
          bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
          p-4 flex justify-between items-center
          left-1/2 -translate-x-1/2
        "
            >
                <div>
                    <span className="text-sm text-gray-500">결제금액</span>
                    <p className="text-2xl font-bold text-gray-900">
                        {orderData.totalPrice.toLocaleString()}원
                    </p>
                </div>
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="
            bg-blue-600 text-white font-bold
            py-3 px-8 rounded-lg 
            hover:bg-blue-700 transition-colors
            disabled:bg-gray-400
          "
                >
                    {isProcessing ? '결제 중...' : '결제하기'}
                </button>
            </footer>
        </div>
    );
};

export default PaymentPage;
