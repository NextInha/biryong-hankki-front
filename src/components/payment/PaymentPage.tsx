import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopHeaderSecond from '../../components/layout/TopHeaderSecond';
import type { CreateOrderResponse, OrderItem } from '../../types/order';

// 아이콘 import - 경로가 실제 프로젝트와 맞는지 확인해주세요.
import iconKakao from '../../assets/icons/icon-kakaopay.svg';
import iconNaver from '../../assets/icons/icon-naverpay.svg';
import iconPayco from '../../assets/icons/icon-payco.svg';
import iconToss from '../../assets/icons/icon-tosspay.svg';

// -1. 결제 수단 타입 정의
const PAYMENT_METHODS = [
    { id: 'card', name: '신용/체크카드', icon: null },
    { id: 'kakao', name: '카카오페이', icon: iconKakao },
    { id: 'naver', name: '네이버페이', icon: iconNaver },
    { id: 'payco', name: '페이코', icon: iconPayco },
    { id: 'toss', name: '토스페이', icon: iconToss },
    { id: 'other', name: '기타 결제 수단', icon: null },
];

// 'orderedAt' 날짜를 받아서 '조식/중식/석식'을 반환하는 유틸 함수
const getMealType = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const hours = date.getHours() - 9; // UTC 시간과 KST가 9시간 차이나서 -9로 조정 0-23 (KST 기준)

        // (기준 시간은 필요에 따라 조절하세요)
        if (hours < 9 && hours >= 8) {
            return '조식';
        }
        if (hours < 14 && hours >= 11) {
            return '중식';
        }
        if (hours < 19 && hours >= 17) {
            return '석식';
        }
    } catch (e) {
        console.error('날짜 변환 오류:', e);
        return '주문'; // 에러 시 기본값
    }
};

const PaymentPage = () => {
    const navigate = useNavigate();

    // PurchaseSummary가 넘겨준 '주문 데이터'를 받음
    //const location = useLocation();
    //const orderData = location.state?.orderData as OrderData;

    // UI 확인용 더미 데이터 정의
    const DUMMY_ORDER_DATA: CreateOrderResponse = {
        orderId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        items: [
            {
                id: 1,
                menuId: '550e8400-e29b-41d4-a716-446655440000',
                menuName: '김치찌개',
                quantity: 2,
                price: 4500,
                subtotal: 9000,
            },
            {
                id: 2,
                menuId: '550e8400-e29b-41d4-a716-446655440001',
                menuName: '된장찌개',
                quantity: 1,
                price: 4500,
                subtotal: 4500,
            },
        ],
        totalPrice: 13500,
        status: 'PENDING',
        orderedAt: '2024-10-27T12:34:56.789Z',
    };
    const orderData = DUMMY_ORDER_DATA;

    // 3. '결제 수단' 선택 상태
    const [selectedMethod, setSelectedMethod] = useState('card');
    // 4. '결제 진행 중' 로딩 상태
    const [isProcessing, setIsProcessing] = useState(false);

    // 5. '결제하기' 버튼 클릭 시 (UI 시뮬레이션)
    const handlePayment = async () => {
        if (!orderData) return; // orderData 없으면 실행 방지

        setIsProcessing(true);

        // (UI 구현 단계: 2초간 가짜로 PG사 연동 및 API 호출 시뮬레이션)
        console.log(
            `[${orderData.orderId}] 주문에 대해 [${selectedMethod}]로 결제 시도...`
        );

        setTimeout(() => {
            // (가짜) 결제 성공!
            setIsProcessing(false);

            // '주문 결제 API' 명세서대로 'OrderComplete' 페이지로 이동
            navigate('/order-complete', { state: { orderData } });
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
       alert('결제에 실패했습니다: ' + (error as Error).message);
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
                    onClick={() => navigate('/menu')} // '/menu' 등 실제 메뉴 페이지로
                    className="text-blue-600"
                >
                    메뉴 선택으로 돌아가기
                </button>
            </div>
        );
    }

    //  렌더링 직전에 식사 타입 계산
    const mealType = getMealType(orderData.orderedAt);

    return (
        <>
            <TopHeaderSecond title="구매하기" />

            <div className="flex flex-col h-screen bg-white">
                <main className="grow overflow-y-auto px-4 pb-24">
                    {/* 주문 정보 카드 (티켓 번호) */}
                    <div className="bg-white border border-gray-400 rounded-4xl m-4 p-6 text-center">
                        <div className="mb-4">
                            <p className="font-semibold text-gray-900 ">
                                학생식당(학생회관)
                                <br></br>
                                {mealType}
                            </p>
                            <p className="text-4xl font-bold tracking-wider">
                                0256 {/* 주문번호가 api 명세에 없음 */}
                            </p>
                        </div>
                        <div className="border-b border-gray-200"></div>

                        {/* 주문 내역 */}
                        <div className="flex flex-col mt-4 items-start justify-center">
                            <h3 className="text-lg font-semibold mb-2">
                                주문내역
                            </h3>
                            {orderData.items.map((item: OrderItem) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center w-full pb-2"
                                >
                                    <span className="text-md font-semibold text-gray-900">
                                        ({mealType}){item.menuName} x{' '}
                                        {item.quantity}
                                    </span>
                                    <span className=" text-md font-semibold text-gray-800">
                                        {item.subtotal.toLocaleString()}원
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 결제 수단 */}
                    <div className="bg-white p-4">
                        <h3 className="text-lg font-bold mb-4">결제수단</h3>
                        <div className="space-y-4">
                            {PAYMENT_METHODS.map((method) => (
                                <label
                                    key={method.id}
                                    className="flex items-center gap-2  cursor-pointer"
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
                                        className="w-5 h-5 text-primary"
                                    />
                                    {/*  icon이 null이 아닐 때만 img 렌더링 */}
                                    {method.icon && (
                                        <img
                                            src={method.icon}
                                            alt={method.name}
                                            className="w-10 h-10"
                                        />
                                    )}
                                    <span className="font-semibold text-gray-900">
                                        {method.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </main>

                {/* 9. 하단 고정 결제 버튼 */}
                <footer
                    className="
                 fixed bottom-0 right-0 w-full max-w-md mx-auto
                 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
                 p-6 pb-12 flex justify-between items-center
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
                     bg-primary text-white font-bold
                     py-3 px-8 rounded-lg 
                     hover:bg-blue-700 transition-colors
                     disabled:bg-gray-400
                   "
                    >
                        {isProcessing ? '결제 중...' : '결제하기'}
                    </button>
                </footer>
            </div>
        </>
    );
};

export default PaymentPage;
