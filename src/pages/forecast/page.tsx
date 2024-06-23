import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartDatasetProperties,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import {
  useGetWorkloadMutation,
  useLazyGetWeekNumsQuery,
  useXModeMutation,
} from '../../store/api/schedule/planer';
import { IWorkload } from './types';
import {
  _MEDICAL_MODALITIES_WITH_TYPES,
  ALL_MODALITY,
} from '../../constants/constants';
import {
  useCreateForecastReportMutation,
  useLazyGetReportQuery,
} from '../../store/api/export/exportApi';
import { toast } from 'react-toastify';
import { number, string } from 'yup';
import { retry } from '@reduxjs/toolkit/query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const MODALITY_CHART_CONFIGURATION = {
  DENSITOMETER_DEFAULT: {
    generatedValueColor: 'rgba(255, 84, 84, 1)',
    generatedValueBackground: 'rgba(255, 84, 84, 0.5)',
    manualValueColor: 'rgb(54, 162, 235)',
    manualValueBackground: 'rgba(54, 162, 235, 0.5)',
  },
  MRT_DEFAULT: {
    generatedValueColor: 'rgba(255, 152, 77, 1)',
    generatedValueBackground: 'rgba(255, 152, 77, 0.5)',
    manualValueColor: 'rgb(153, 102, 255)',
    manualValueBackground: 'rgba(153, 102, 255, 0.5)',
  },
  MRT_U: {
    generatedValueColor: 'rgba(255, 202, 12, 1)',
    generatedValueBackground: 'rgba(255, 202, 12, 0.5)',
    manualValueColor: 'rgb(255, 206, 86)',
    manualValueBackground: 'rgba(255, 206, 86, 0.5)',
  },
  MRT_U2: {
    generatedValueColor: 'rgba(173, 238, 66, 1)',
    generatedValueBackground: 'rgba(173, 238, 66, 0.5)',
    manualValueColor: 'rgb(255, 99, 132)',
    manualValueBackground: 'rgba(255, 99, 132, 0.5)',
  },
  KT_DEFAULT: {
    generatedValueColor: 'rgba(40, 212, 47, 1)',
    generatedValueBackground: 'rgba(40, 212, 47, 0.5)',
    manualValueColor: 'rgb(0, 163, 255)',
    manualValueBackground: 'rgba(0, 163, 255, 0.5)',
  },
  KT_U: {
    generatedValueColor: 'rgba(21, 228, 215, 1)',
    generatedValueBackground: 'rgba(21, 228, 215, 0.5)',
    manualValueColor: 'rgb(75, 192, 192)',
    manualValueBackground: 'rgba(75, 192, 192, 0.5)',
  },
  KT_U2: {
    generatedValueColor: 'rgba(0, 178, 255, 1)',
    generatedValueBackground: 'rgba(0, 178, 255, 0.5)',
    manualValueColor: 'rgb(255, 159, 64)',
    manualValueBackground: 'rgba(255, 159, 64, 0.5)',
  },
  FLG_DEFAULT: {
    generatedValueColor: 'rgba(32, 108, 255, 1)',
    generatedValueBackground: 'rgba(32, 108, 255, 0.5)',
    manualValueColor: 'rgb(153, 102, 255)',
    manualValueBackground: 'rgba(153, 102, 255, 0.5)',
  },
  MMG_DEFAULT: {
    generatedValueColor: 'rgba(182, 109, 255, 1)',
    generatedValueBackground: 'rgba(182, 109, 255, 0.5)',
    manualValueColor: 'rgb(255, 206, 86)',
    manualValueBackground: 'rgba(255, 206, 86, 0.5)',
  },
  RG_DEFAULT: {
    generatedValueColor: 'rgba(255, 83, 217, 1)',
    generatedValueBackground: 'rgba(255, 83, 217, 0.5)',
    manualValueColor: 'rgb(255, 99, 132)',
    manualValueBackground: 'rgba(255, 99, 132, 0.5)',
  },
};

export const ForecastPage = () => {
  const [weekNums] = useLazyGetWeekNumsQuery();
  const [getWorkload] = useGetWorkloadMutation();

  const [createForecastReport] = useCreateForecastReportMutation();
  const [getReport] = useLazyGetReportQuery();
  const [editableWeek, setEditableWeek] = useState<any>({
    weekNumber: null,
    manualValue: null,
    generatedValue: null,
    year: null,
    typeModality: null,
    modality: null,
  });
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const [numbersOfWeek, setNumbersOfWeek] = useState<number[]>([]);
  const [load, setLoad] = useState(false);

  const [selectedWorkload, setSelectedWorkload] =
    useState<string>(ALL_MODALITY);

  const [lineChartData, setLineChartData] = useState<
    ChartDatasetProperties<'line', number[]>[]
  >([]);

  const [barChartData, setBarChartData] = useState<
    ChartDatasetProperties<'bar', number[]>[]
  >([]);

  const [workloads, setWorkloads] = useState<string[]>();
  const [workloadData, setWorkloadData] = useState<Map<string, IWorkload[]>>(
    new Map()
  );
  const [handler, setHandler] = useState(new Date());
  const [_] = useXModeMutation();

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
  }, [currentYear, handler]);

  useEffect(() => {
    setLoad(true);
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

        workloads.unshift(ALL_MODALITY);

        setWorkloads(workloads);
        setWorkloadData(storage);
        setLoad(false);
      })
      .catch((e) => {
        setCurrentYear(2024);
      });
  }, [numbersOfWeek, currentYear, handler]);

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

  function getWorkloadData(workload) {
    const weekData = labels.map((weekNumber) => {
      let val = workloadData.get(workload);
      if (val == undefined) {
        val = [];
      }

      const weekData = val.find((v) => v.weekNumber === weekNumber);

      if (weekData === undefined) {
        return {
          generatedValue: -1,
          weekNumber: weekNumber,
          manualValue: -1,
        };
      }
      return weekData;
    });

    return {
      generatedValues: weekData.map((week) => week.generatedValue),
      manualValues: weekData.map((week) => week.manualValue),
    };
  }

  useEffect(() => {
    const selectedWorkloads =
      selectedWorkload === ALL_MODALITY
        ? Array.from(workloadData.keys())
        : [selectedWorkload];

    if (selectedWorkload === ALL_MODALITY) {
      setBarChartData(
        selectedWorkloads.flatMap((workload) => {
          const data = getWorkloadData(workload);
          return [
            {
              label: `${_MEDICAL_MODALITIES_WITH_TYPES[workload]}`,
              data: data.generatedValues.map((value, index) =>
                !isNaN(data.manualValues[index]) &&
                data.manualValues[index] !== undefined
                  ? data.manualValues[index]
                  : value
              ),
              borderColor:
                MODALITY_CHART_CONFIGURATION[workload].generatedValueColor,
              backgroundColor:
                MODALITY_CHART_CONFIGURATION[workload].generatedValueColor,
            },
          ];
        })
      );
      setLineChartData([]);
    } else {
      setLineChartData(
        selectedWorkloads.flatMap((workload) => {
          const data = getWorkloadData(workload);

          return [
            {
              label: `Прогноз - ${_MEDICAL_MODALITIES_WITH_TYPES[workload]}`,
              data: data.generatedValues,
              borderColor:
                MODALITY_CHART_CONFIGURATION[workload].generatedValueColor,
              backgroundColor:
                MODALITY_CHART_CONFIGURATION[workload].generatedValueBackground,
            },
            {
              label: `Ручные данные - ${_MEDICAL_MODALITIES_WITH_TYPES[workload]}`,
              data: data.manualValues,
              borderColor:
                MODALITY_CHART_CONFIGURATION[workload].manualValueColor,
              backgroundColor:
                MODALITY_CHART_CONFIGURATION[workload].manualValueBackground,
            },
          ];
        })
      );
      setBarChartData([]);
    }
  }, [selectedWorkload, workloads]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
    },
  };
  const labels = numbersOfWeek;

  const chartLineData = {
    labels,
    datasets: lineChartData,
  };

  const chartBarData = {
    labels,
    datasets: barChartData,
  };

  const xMode = () => {
    setLoad(true);
    _({
      year: editableWeek.year,
      type: editableWeek.typeModality,
      week: editableWeek.weekNumber,
      modality: editableWeek.modality,
      body: {
        value: editableWeek.manualValue,
      },
    })
      .unwrap()
      .then((x) => {
        setHandler(new Date());
      })
      .catch((err) => {
        toast.error('Что-то пошло не так', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <div
      className={
        'bg-white mt-[20px] w-[1450px] mx-auto flex flex-col items-center h-[95%] relative'
      }
    >
      <div className="w-11/12 mx-auto mt-10">
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
            {selectedWorkload !== ALL_MODALITY && (
              <button onClick={downloadForecast} className={`bg-emerald-400`}>
                Скачать прогноз за текущий год
              </button>
            )}
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
        <div className={'w-full max-h-[1000px]'}>
          {selectedWorkload === ALL_MODALITY ? (
            <Bar
              width={'100%'}
              height={1000}
              data={chartBarData}
              options={options}
            />
          ) : (
            <Line
              width={800}
              height={500}
              data={chartLineData}
              options={options}
            />
          )}
        </div>
        {load ? (
          <div>Загрузка...</div>
        ) : (
          selectedWorkload !== ALL_MODALITY && (
            <div className={'flex gap-1'}>
              <div
                className={
                  'w-1/2 flex flex-col h-[400px] overflow-y-scroll  rounded border'
                }
              >
                <div className={'flex p-2'}>
                  <div className={'w-[120px] text-sm'}>Год</div>
                  <div className={'w-[120px] text-sm'}>Неделя</div>
                  <div className={'w-[220px] text-sm'}>Фактич. Значение</div>
                  <div className={'w-[120px] text-sm'}>Прогноз</div>
                  <div className={'w-[120px] text-sm'}>Погрешность</div>
                </div>
                {workloadData.get(selectedWorkload)?.map((el) => {
                  let tmp: null | number = null;
                  if (!(isNaN(el.generatedValue) || isNaN(el.manualValue))) {
                    tmp =
                      ((Math.max(el.generatedValue, el.manualValue) -
                        Math.min(el.generatedValue, el.manualValue)) /
                        Math.min(el.generatedValue, el.manualValue)) *
                      100;
                  }
                  return (
                    <div
                      onClick={() => {
                        setEditableWeek({
                          ...el,
                          year: currentYear,
                          modality: selectedWorkload.split('_')[0],
                          typeModality: selectedWorkload.split('_')[1],
                        });
                      }}
                      className={'flex p-2 hover:bg-gray-400 cursor-pointer'}
                    >
                      <div className={'w-[120px] text-sm'}>{currentYear}</div>
                      <div className={'w-[120px] text-sm'}>{el.weekNumber}</div>
                      <div className={'w-[220px] text-sm'}>
                        {isNaN(el.manualValue) ? '-' : el.manualValue}
                      </div>
                      <div className={'w-[120px] text-sm'}>
                        {isNaN(el.generatedValue) ? '-' : el.generatedValue}
                      </div>
                      <div className={'w-[120px] text-sm'}>
                        {tmp ? tmp.toFixed(2) : '-'}%
                      </div>
                    </div>
                  );
                })}
              </div>
              {editableWeek.weekNumber ? (
                <>
                  <div className={'w-1/2 p-2 rounded border'}>
                    <div className={'text-[24px] font-semibold'}>
                      Редактиварование фактических значений
                    </div>
                    <div>Неделя № {editableWeek.weekNumber}</div>
                    <div>Фактическое значение</div>
                    <input
                      onChange={(e) => {
                        setEditableWeek({
                          ...editableWeek,
                          manualValue: e.target.value,
                        });
                      }}
                      className={'border rounded'}
                      type="number"
                      value={editableWeek.manualValue}
                    />
                    <div className={'flex gap-2 grow mt-2'}>
                      <button
                        disabled={load}
                        onClick={xMode}
                        className={`bg-[#00A3FF] p-2 rounded hover:opacity-50 ${load && ' opacity-20'}`}
                      >
                        Подтвердить изменения
                      </button>
                      <button
                        onClick={() =>
                          setEditableWeek({
                            weekNumber: null,
                            manualValue: null,
                            generatedValue: null,
                            year: null,
                            typeModality: null,
                            modality: null,
                          })
                        }
                        className={'bg-gray-400 p-2 rounded hover:opacity-50'}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={
                    'flex justify-center items-center text-center w-1/2 text-lg font-semibold'
                  }
                >
                  &#8592; Выберите неделю
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export const ForecastDiffPage = () => {
  const [weekNums] = useLazyGetWeekNumsQuery();
  const [getWorkload] = useGetWorkloadMutation();

  const availableYears = [2022, 2023, 2024, 2025, 2026];

  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const [numbersOfWeek, setNumbersOfWeek] = useState<Map<number, number[]>>(
    new Map()
  );
  const [load, setLoad] = useState(false);

  const [barChartData, setBarChartData] = useState<
    ChartDatasetProperties<'bar', number[]>[]
  >([]);

  const [workloadData, setWorkloadData] = useState<
    Map<number, Map<string, IWorkload[]>>
  >(new Map());

  function getWorkloadData(workloadData, workload) {
    const weekData = labels.map((weekNumber) => {
      let val = workloadData.get(workload);
      if (val == undefined) {
        val = [];
      }

      const weekData = val.find((v) => v.weekNumber === weekNumber);

      if (weekData === undefined) {
        return {
          generatedValue: -1,
          weekNumber: weekNumber,
          manualValue: -1,
        };
      }
      return weekData;
    });

    return {
      generatedValues: weekData.map((week) => week.generatedValue),
      manualValues: weekData.map((week) => week.manualValue),
    };
  }

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      const as = selectedYears.map((currentYear) => {
        return weekNums([currentYear + '-12-31', currentYear + '-12-24']).then(
          (result) => ({ year: currentYear, data: result }),
          (error) => ({ year: currentYear, data: [] })
        );
      });

      const result = new Map<number, number[]>();
      const resultsPromise = await Promise.allSettled(as);
      resultsPromise.forEach((el: any) => {
        if (el.status === 'fulfilled') {
          const val = el.value;

          const maxWeek: number = Math.max(
            ...val.data.data.map((weekData) => weekData.weekNumber)
          );
          const weekNumbers = Array.from(Array(maxWeek).keys()).map(
            (v) => v + 1
          );
          result.set(val.year, weekNumbers);
        }
      });
      return result;
    };
    fetchData().then((result) => {
      setNumbersOfWeek(result);
      setLoad(false);
    });
  }, [selectedYears]);

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      const as = Array.from(numbersOfWeek, ([key, value]) => {
        return getWorkload({
          year: key,
          weeks: value,
        }).then(
          (result) => ({ year: key, data: result }),
          (error) => ({ year: key, data: [] })
        );
      });
      const result = new Map<number, Map<string, IWorkload[]>>();
      const resultsPromise = await Promise.allSettled(as);
      resultsPromise.forEach((el: any) => {
        if (el.status === 'fulfilled') {
          const val = el.value;

          const storage = new Map<string, IWorkload[]>();
          val.data.data.forEach((workload: any) => {
            const key = workload.modality + '_' + workload.typeModality;
            const value: IWorkload = {
              weekNumber: workload.week,
              manualValue:
                workload.manualValue === null ? NaN : workload.manualValue,
              generatedValue:
                workload.generatedValue === null
                  ? NaN
                  : workload.generatedValue,
            };
            if (!storage.has(key)) {
              storage.set(key, [value]);
            } else {
              storage.get(key)?.push(value);
            }
          });
          result.set(val.year, storage);
        }
      });
      return result;
    };
    fetchData()
      .then((result) => {
        setWorkloadData(result);
        setLoad(false);
      })
      .catch(() => {
        toast.error('Что-то пошло не так !', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      });
  }, [numbersOfWeek]);

  useEffect(() => {
    console.log(workloadData);

    const data: ChartDatasetProperties<'bar', number[]>[] = [];

    workloadData.forEach((workloadData, key) => {
      const result = Array.from(workloadData.keys()).flatMap((workload) => {
        const data = getWorkloadData(workloadData, workload);
        const merged = data.generatedValues.map((value, index) => {
          return !isNaN(data.manualValues[index]) &&
            data.manualValues[index] !== undefined
            ? data.manualValues[index]
            : value;
        });
        return [
          {
            label: `${key} - ${_MEDICAL_MODALITIES_WITH_TYPES[workload]}`,
            data: merged,
            stack: key,
            borderColor:
              MODALITY_CHART_CONFIGURATION[workload].generatedValueColor,
            backgroundColor:
              MODALITY_CHART_CONFIGURATION[workload].generatedValueColor,
          },
        ];
      });

      data.push(...result);
    });

    console.log(data);
    setBarChartData(data);
  }, [workloadData]);

  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        stacked: true,
      },
    },
  };

  let max = -1;
  let labels: number[] = [];
  numbersOfWeek.forEach((value) => {
    const currentMax = Math.max(...value);
    if (currentMax > max) {
      labels = value;
      max = currentMax;
    }
  });
  const chartBarData = {
    labels: labels.map((weekNum) => `Неделя ${weekNum}`),
    datasets: barChartData,
  };
  return (
    <div
      className={
        'bg-white mt-[20px] w-[1450px] mx-auto flex flex-col items-center h-[95%] relative'
      }
    >
      <div className="w-11/12 mx-auto mt-10">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-bold">
            Разница Анализ прогноза исследований
          </h2>
        </div>
        <div>
          <select
            multiple
            id="balcony"
            onChange={(e) => {
              const options = e.target.options;
              const value: number[] = [];
              let i = 0,
                l = options.length;
              for (; i < l; i++) {
                if (options[i].selected) {
                  value.push(Number(options[i].value));
                }
              }
              setSelectedYears(value);
            }}
          >
            {availableYears.map((availableYear) => {
              return <option value={availableYear}>{availableYear} Год</option>;
            })}
          </select>
        </div>
        <div className={'w-full h-[1000px] overflow-y-scroll'}>
          <div className={`h-[3000px]`}>
            {load && <div> Загрузка... </div>}
            <Bar
              width={'100%'}
              height={`200%`}
              data={chartBarData}
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
