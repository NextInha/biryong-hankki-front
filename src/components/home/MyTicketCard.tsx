// src/components/home/MyTicketCard.tsx

import iconShare from '../../assets/icons/icon-share.svg';

import type { Ticket } from '../../types/user';
interface MyTicketCardProps {
    ticket: Ticket;
    onMealCompleteClick: (ticketData: Ticket) => void;
}

const MyTicketCard = ({ ticket, onMealCompleteClick }: MyTicketCardProps) => {
    return (
        // 파란색 배경의 카드
        <div
            className={`
        bg-[#0066B3] text-white rounded-3xl shadow-lg
        flex flex-col pt-4 w-full
        transition-all duration-300
        ${ticket.isUsed ? 'grayscale opacity-70' : ''} 
      `}
        >
            {/* 1. 헤더: 메뉴명 + 공유 버튼 */}
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="w-6 h-6"></div>
                <h3 className="text-2xl font-bold">{ticket.menuName}</h3>
                <button className="p-1" disabled={ticket.isUsed}>
                    <img src={iconShare} className="w-6 h-6"></img>
                </button>
            </div>

            {/* 2. Body: 하얀색 내부 카드 */}
            <div className="bg-white text-gray-900 rounded-3xl p-4 text-center shadow-inner">
                {/* 식당 이름, 식사완료 버튼 */}
                <div className="flex justify-between items-center mb-1">
                    <div className="px-9 py-2"> </div>
                    <span className="font-semibold">
                        {ticket.restaurantName}
                    </span>

                    {/* '식사완료' 버튼 수정 */}
                    <button
                        className={`
              text-sm font-semibold rounded-full px-3 py-2
              transition-colors duration-200
              ${
                  ticket.isUsed
                      ? 'bg-gray-100 text-gray-400 border border-gray-300' // (사용됨)
                      : 'bg-white text-primary border border-primary shadow-2xl hover:bg-blue-50' // (사용 전)
              }
            `}
                        // 사용되었으면, 클릭 이벤트와 버튼 자체를 비활성화
                        onClick={() =>
                            !ticket.isUsed && onMealCompleteClick(ticket)
                        }
                        disabled={ticket.isUsed}
                    >
                        {ticket.isUsed ? '식사완료됨' : '식사완료'}
                    </button>
                </div>

                {/* 식사 종류 */}
                <p className="text-lg font-bold mb-2">{ticket.mealType}</p>

                {/* 식권 번호 */}
                <p className="text-7xl font-bold tracking-wider my-4">
                    {ticket.ticketNumber}
                </p>

                {/* 결제 시각 */}
                <p className="text-sm text-gray-500">[결제시각]</p>
                <p className="text-sm text-gray-500">{ticket.purchaseTime}</p>
            </div>
        </div>
    );
};

export default MyTicketCard;
