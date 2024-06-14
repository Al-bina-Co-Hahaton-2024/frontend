import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  useGetWorkloadMutation,
  useLazyGetWeekNumsQuery,
} from '../../store/api/schedule/planer';
import { IWorkload } from './types';
import { _MEDICAL_MODALITIES_WITH_TYPES } from '../../constants/constants';
import {
  useCreateForecastReportMutation,
  useLazyGetReportQuery,
} from '../../store/api/export/exportApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ForecastPage = () => {
  const [weekNums] = useLazyGetWeekNumsQuery();
  const [getWorkload] = useGetWorkloadMutation();

  const [createForecastReport] = useCreateForecastReportMutation();
  const [getReport] = useLazyGetReportQuery();

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const [numbersOfWeek, setNumbersOfWeek] = useState<number[]>([]);

  const [selectedWorkload, setSelectedWorkload] = useState<string>('');
  const [workloads, setWorkloads] = useState<string[]>();
  const [workloadData, setWorkloadData] = useState<Map<string, IWorkload[]>>(
    new Map()
  );

  useEffect(() => {
    weekNums([currentYear + '-12-31', currentYear + '-12-24'])
      .unwrap()
      .then((data: any[]) => {
        const maxWeek: number = Math.max(
          ...data.map((weekData) => weekData.weekNumber)
        );
        setNumbersOfWeek(Array.from(Array(maxWeek).keys()).map((v) => v + 1));
      })
      .catch((e) => {
        setCurrentYear(2024);
      });
  }, [currentYear]);

  useEffect(() => {
    if (numbersOfWeek.length === 0) {
      return;
    }
    getWorkload({
      year: currentYear,
      weeks: numbersOfWeek,
    })
      .unwrap()
      .then((data: any[]) => {
        const storage = new Map<string, IWorkload[]>();
        data.forEach((workload: any) => {
          const key = workload.modality + '_' + workload.typeModality;
          const value: IWorkload = {
            weekNumber: workload.week,
            manualValue:
              workload.manualValue === null ? NaN : workload.manualValue,
            generatedValue:
              workload.generatedValue === null ? NaN : workload.generatedValue,
          };
          if (!storage.has(key)) {
            storage.set(key, [value]);
          } else {
            storage.get(key)?.push(value);
          }
        });
        const workloads = Array.from(storage.keys()).sort();
        setWorkloads(workloads);
        setSelectedWorkload(workloads[0]);
        setWorkloadData(storage);
      })
      .catch((e) => {
        setCurrentYear(2024);
      });
  }, [numbersOfWeek]);

  const downloadForecast = () => {
    createForecastReport({
      year: currentYear,
    })
      .unwrap()
      .then((data: any) => {
        const id = setInterval(() => {
          getReport(data.id)
            .unwrap()
            .then((data: any) => {
              if (data.status === 'SUCCESSFUL' || data.status === 'ERROR') {
                clearInterval(id);
              }

              if (data.link !== null) {
                window.location.href = data.link;
              }
            });
        }, 300);
        data.id;
      });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };
  const labels = numbersOfWeek;

  const data = {
    labels,
    datasets: [
      {
        label: 'Прогноз',
        data: labels.map((weekNumber) => {
          return workloadData
            .get(selectedWorkload)
            ?.find((v) => v.weekNumber === weekNumber)?.generatedValue;
        }),
        borderColor: 'rgb(79, 222, 119)',
        backgroundColor: 'rgba(79, 222, 119, 0.5)',
      },
      {
        label: 'Ручные данные',
        data: labels.map((weekNumber) => {
          return workloadData
            .get(selectedWorkload)
            ?.find((v) => v.weekNumber === weekNumber)?.manualValue;
        }),
        borderColor: 'rgb(0, 163, 255)',
        backgroundColor: 'rgba(0, 163, 255, 0.5)',
      },
    ],
  };
  return (
    <div
      className={
        'bg-white mt-[20px] w-[1450px] mx-auto flex flex-col items-center h-[95%] relative'
      }
    >
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-bold">Анализ прогноза исследований</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentYear(currentYear - 1)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded shadow"
            >
              &lt;
            </button>
            <span>{currentYear} | Производственные недели</span>
            <button
              onClick={() => setCurrentYear(currentYear + 1)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded shadow"
            >
              &gt;
            </button>
            <button onClick={downloadForecast} className={`bg-emerald-400`}>
              Скачать прогноз за текущий год
            </button>
          </div>
        </div>
        <div className="flex justify-center space-x-2 mb-4">
          {workloads?.map((workload) => {
            return (
              <button
                key={workload}
                onClick={() => setSelectedWorkload(workload)}
                className={
                  `px-4 py-2 rounded shadow ` +
                  (selectedWorkload === workload
                    ? 'bg-[#00A3FF] text-white'
                    : 'bg-gray-200 text-gray-700')
                }
              >
                {_MEDICAL_MODALITIES_WITH_TYPES[workload]}
              </button>
            );
          })}
        </div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
