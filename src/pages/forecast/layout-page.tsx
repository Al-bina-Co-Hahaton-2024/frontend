import { useState } from 'react';
import { ForecastDiffPage, ForecastPage } from './page';

export const LayoutPageForecast = () => {
  const [viewPage, setViewPage] = useState('forecast');
  return (
    <>
      <div className={'flex gap-2 rounded absolute left-[750px] top-[20px]'}>
        <div
          className={`${viewPage === 'forecast' ? 'bg-black' : 'bg-gray-400'}  rounded p-2 text-white z-[9999] cursor-pointer`}
          onClick={() => setViewPage('forecast')}
        >
          Анализ прогноза иследований
        </div>
        <div
          className={`${viewPage === 'forecast_diff' ? 'bg-black' : 'bg-gray-400'}  rounded p-2 text-white z-[9999] cursor-pointer`}
          onClick={() => setViewPage('forecast_diff')}
        >
          Сравнение значений по годам
        </div>
      </div>
      {viewPage === 'forecast' && <ForecastPage />}
      {viewPage === 'forecast_diff' && <ForecastDiffPage />}
    </>
  );
};
