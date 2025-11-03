// src/pages/QrScannerPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { HiXMark } from 'react-icons/hi2';
//import { api } from '../api';
//import { AxiosError } from 'axios';

// interface ApiError {
//     code: string;
//     message: string;
// }

const QrScannerPage = () => {
    const navigate = useNavigate();
    const [scanError, setScanError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleScan = async (scannedData: string) => {
        if (isLoading) return;

        console.log('스캔된 QR 데이터:', scannedData);
        setIsLoading(true);
        setScanError(null);

        // 0.5초 딜레이 (로딩 UI 테스트용)
        setTimeout(() => {
            navigate('/purchase');
        }, 500);

        // --- (API 연동 코드) ---
        /*
    try {
      const response = await api.post('/api/qr/verify', {
        qrCode: scannedData,
      });

      if (response.data.data.isValid) {
        navigate('/purchase');
      } else {
        setScanError('올바른 QR 코드가 아닙니다.');
        setIsLoading(false);
      }
    } catch (err) {
      const error = err as AxiosError<{ error: ApiError }>;
      if (error.response) {
        const errorData = error.response.data.error;
        // ... (에러 처리 switch 문) ...
        setScanError(errorData.message || 'QR 검증에 실패했습니다.');
      } else {
        setScanError('네트워크 오류가 발생했습니다.');
      }
      setIsLoading(false);
    }
    */
    };

    return (
        <div className="relative w-screen h-screen bg-black">
            <Scanner
                styles={{
                    container: { width: '100%', height: '100%', padding: 0 },
                    video: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    },
                }}
                constraints={{ facingMode: 'environment' }}
                //    onScan은 'DetectedQrCode[]' 배열을 반환하므로, 첫 번째 값의 'rawValue'를 사용
                onScan={(result) => {
                    if (result && result.length > 0 && !isLoading) {
                        handleScan(result[0].rawValue);
                    }
                }}
                onError={(err: unknown) => {
                    console.error('QR 스캐너 에러:', err);
                    if (err instanceof Error) {
                        setScanError(`카메라 오류: ${err.message}`);
                    } else {
                        setScanError('알 수 없는 카메라 오류가 발생했습니다.');
                    }
                }}
            />

            <div className="absolute top-0 left-0 right-0 p-5 flex items-center z-10">
                <button onClick={() => navigate(-1)} className="text-white">
                    <HiXMark className="w-8 h-8" />
                </button>
                <h1 className="text-white text-xl font-bold text-center flex-1 -ml-8">
                    코드스캔
                </h1>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-16 h-16 opacity-50">
                    <div className="w-16 h-1/2 border-t-4 border-l-4 border-r-4 border-white rounded-t-lg"></div>
                    <div className="w-16 h-1/2 border-b-4 border-l-4 border-r-4 border-white rounded-b-lg"></div>
                </div>
            </div>

            <div className="absolute bottom-16 left-0 right-0 p-5 text-center z-10">
                {isLoading ? (
                    <p className="text-yellow-400 font-semibold text-lg animate-pulse">
                        QR 코드를 검증 중입니다...
                    </p>
                ) : scanError ? (
                    <p className="text-red-400 font-semibold">{scanError}</p>
                ) : (
                    <p className="text-white">
                        학생 식당 내 큐알 코드를 인식해주세요.
                        <br />
                        스캔 시, 메뉴 선택 창으로 넘어갑니다.
                    </p>
                )}
            </div>
        </div>
    );
};

export default QrScannerPage;
