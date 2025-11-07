// src/components/home/MyTicketCard.tsx

import iconShare from '../../assets/icons/icon-share.svg';

import type { Ticket } from '../../types/ticket';

interface MyTicketCardProps {
    ticket: Ticket | null;
    onMealCompleteClick?: (ticketData: Ticket) => void;
    onShareClick?: (ticketData: Ticket | null) => void;
}

const MyTicketCard = ({
    ticket,
    onMealCompleteClick,
    onShareClick,
}: MyTicketCardProps) => {
    if (!ticket) {
        return (
            <div
                className="
            bg-[#0066B3] text-white rounded-3xl shadow-lg
            flex flex-col pt-4 w-full transition-all duration-300
          "
            >
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="w-6 h-6" />
                    <h3 className="text-2xl font-semibold">나의 식권</h3>
                    <button
                        type="button"
                        className="p-1 mr-1 opacity-70"
                        onClick={() => onShareClick?.(null)}
                    >
                        <img src={iconShare} className="w-6 h-6" />
                    </button>
                </div>
                <div className="bg-white text-gray-600 rounded-3xl p-6 text-center shadow-inner min-h-[220px] flex flex-col items-center justify-center gap-2">
                    <p className="text-lg font-semibold text-gray-700">
                        보유한 식권이 없습니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        식권을 구매하거나 공유 식권으로 받아보세요.
                    </p>
                </div>
            </div>
        );
    }

    const isUsed = ticket.isUsed;
    const mealLabel = ticket.mealLabel ?? '식권';
    const purchaseTime = ticket.formattedIssuedAt;
    const restaurantDisplayName =
        ticket.restaurantName ?? ticket.menuName ?? '식당 정보 미제공';

    return (
        <div
            className={`
        bg-[#0066B3] text-white rounded-3xl shadow-lg
        flex flex-col pt-4 w-full
        transition-all duration-300
        ${isUsed ? 'grayscale opacity-70' : ''} 
      `}
        >
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="w-6 h-6" />
                <h3 className="text-2xl font-bold">{restaurantDisplayName}</h3>
                <button
                    type="button"
                    className={`p-1 ${isUsed ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={isUsed}
                    onClick={() => onShareClick?.(ticket)}
                >
                    <img src={iconShare} className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-white text-gray-900 rounded-3xl p-4 text-center shadow-inner">
                <div className="flex justify-between items-center mb-1">
                    <div className="px-9 py-2" />
                    <span className="font-semibold">{restaurantDisplayName}</span>
                    <button
                        type="button"
                        className={`
              text-sm font-semibold rounded-full px-3 py-2
              transition-colors duration-200
              ${
                  isUsed
                      ? 'bg-gray-100 text-gray-400 border border-gray-300'
                      : 'bg-white text-primary border border-primary shadow-2xl hover:bg-blue-50'
              }
            `}
                        onClick={() =>
                            !isUsed &&
                            onMealCompleteClick &&
                            onMealCompleteClick(ticket)
                        }
                        disabled={isUsed}
                    >
                        {isUsed ? '식사완료됨' : '식사완료'}
                    </button>
                </div>

                <p className="text-lg font-bold mb-2">{mealLabel}</p>

                <p className="text-7xl font-bold tracking-wider my-4">
                    {ticket.ticketNumber}
                </p>

                <p className="text-sm text-gray-500">[결제시각]</p>
                <p className="text-sm text-gray-500">{purchaseTime}</p>
            </div>
        </div>
    );
};

export default MyTicketCard;
