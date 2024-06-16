import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import '../../styles/calendar.css';
import {
  useGenerateCalendarMutation,
  useGetAnalyzesWeeksMutation,
  useLazyGetGraphOnMonthQuery,
  useLazyGetWeekNumsQuery,
} from '../../store/api/schedule/planer';
import {
  useCreateReportMutation,
  useLazyGetReportQuery,
} from '../../store/api/export/exportApi';
import { v4 as uuidv4 } from 'uuid';
import {
  useGetDoctorsByIdsMutation,
  useGetFioDocsByIdMutation,
  useLazyGetAllDoctorsQuery,
} from '../../store/api/doctors/doctorsApi';
import { DocGroups } from './groups';
import acceptance_report from '../../assets/acceptance_report.svg';
import warning_report from '../../assets/warning_report.svg';
import generator from '../../assets/generator.svg';
import download_calendar from '../../assets/download_calendar.svg';
import black_arrow from '../../assets/black_arrow.svg';
import { DocItem } from './item-render';
import { translateModality } from '../../utils/transform';
import { DocGroupsSearch } from './search';
import { useAppDispatch, useAppSelector } from '../../store/hooks/storeHooks';
import { setWeekReport } from '../../store/reducers/serviceSlice';

export const AnalyticsPage = () => {
  const dispatch = useAppDispatch();
  const weekReportSelector = useAppSelector(
    (state) => state.serviceSlice.weekReport
  );

  const [docsFio] = useGetFioDocsByIdMutation();

  const [getGraph] = useLazyGetGraphOnMonthQuery();
  const [weekNums] = useLazyGetWeekNumsQuery();
  const [weekAnalysis] = useGetAnalyzesWeeksMutation();

  const [createReport] = useCreateReportMutation();
  const [getReport] = useLazyGetReportQuery();

  const [getAllDoctors] = useLazyGetAllDoctorsQuery();
  const [generateGraph] = useGenerateCalendarMutation();

  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month').add(14, 'days');

  const [visibleTimeStart, setVisibleTimeStart] = useState<any>(
    startOfMonth.valueOf()
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<any>(
    endOfMonth.valueOf()
  );
  const [weeks, setWeeks] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [groupsTimeline, setGroupsTimeline] = useState<null | any[]>(null);
  const [itemsTimeline, setItemsTimeline] = useState<null | any[]>(null);

  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const weeksDates: any = [];
    let monthStart = visibleTimeStart;

    for (let i = 0; i <= 4; i++) {
      let tmp = moment(monthStart).add(1, 'week').format('YYYY-MM-DD');
      monthStart = tmp;
      weeksDates.push(tmp);
    }

    weeksDates.unshift(moment(visibleTimeStart).format('YYYY-MM-DD'));
    weekNums(weeksDates)
      .unwrap()
      .then((weekRes) => {
        //Мап для анализа
        const analysisWeeks: any = [];

        weekRes?.forEach((element) => {
          const obj = {
            year: String(moment(element.startDate).year()),
            week: element.weekNumber,
          };

          analysisWeeks.push(obj);
        });

        setVisibleTimeStart(moment(weekRes[0].startDate).valueOf());

        //Анализ
        weekAnalysis(analysisWeeks)
          .unwrap()
          .then((analysis) => {
            const mergeWeeks = weekRes.map((el) => {
              const foundedObj = analysis.find(
                (element) => element.weekNumber === el.weekNumber
              );
              return {
                ...el,
                ...foundedObj,
              };
            });
            setWeeks(
              mergeWeeks.map((week) => ({
                weekNumber: week.weekNumber,
                start: moment(week.startDate),
                end: moment(week.endDate),
                workloads: week.workloads,
                status: getStatus(week.workloads, week.actual),
                label: `Неделя ${moment(week.startDate).format('DD.MM')} по ${moment(week.endDate).format('DD.MM')}`,
                ...week,
              }))
            );
            getAllDoctors({})
              .unwrap()
              .then((allDoctors) => {
                const ids = allDoctors.map((el) => el.id);
                docsFio(ids)
                  .unwrap()
                  .then((fio) => {
                    const docsGroups = allDoctors.map((element) => {
                      const foundedElement = fio.find(
                        (el) => el.id === element.id
                      );
                      return {
                        ...element,
                        ...foundedElement,
                      };
                    });
                    setGroupsTimeline(docsGroups);
                    setLoading(false);
                  });

                getGraph(
                  moment(visibleTimeStart).add(2, 'weeks').format('YYYY-MM-DD')
                )
                  .unwrap()
                  .then((res) => {
                    const mergeWeeks = weekRes.map((el) => {
                      const foundedObj = analysis.find(
                        (element) => element.weekNumber === el.weekNumber
                      );
                      return {
                        ...el,
                        ...foundedObj,
                      };
                    });

                    const tmpItems = res
                      .map((element) => {
                        const weekStatus = mergeWeeks.find(
                          (el) => el.weekNumber === element.weekNumber
                        );
                        return element.doctorSchedules.map((doc) => ({
                          id: uuidv4(),
                          group: doc.doctorId,
                          start_time: moment(
                            `${element.date}T05:00:00`
                          ).valueOf(),
                          status: getStatus(
                            weekStatus.workloads,
                            weekStatus.actual
                          ),
                          weekNumber: weekStatus.weekNumber,
                          end_time: moment(
                            `${element.date}T20:59:00`
                          ).valueOf(),
                          ...doc,
                        }));
                      })
                      .flat();

                    setItemsTimeline(tmpItems);
                  });
              });
          });
      });
  }, [getGraph, visibleTimeStart]);

  const handleGetReport = () => {
    createReport({
      date: `${moment(visibleTimeStart).add(1, 'week').format('YYYY-MM-DD')}`,
    })
      .unwrap()
      .then((res) => {
        setTimeout(() => {
          getReport(res.id)
            .unwrap()
            .then((res) => {
              window.open(res.link, '_blank');
            });
        }, 2000);
      });
  };

  const getStatus = (workloads, actual) => {
    if (!actual) {
      return 'gray';
    }
    const totalWorkload = workloads.reduce((sum, w) => sum + w.hoursNeed, 0);
    if (totalWorkload > 0) {
      return 'yellow';
    }
    if (totalWorkload === 0) {
      return 'green';
    }
  };

  const customItemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    return (
      <DocItem
        item={item}
        itemContext={itemContext}
        getItemProps={getItemProps}
        getResizeProps={getResizeProps}
      />
    );
  };
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());

  const handlePreviousMonth = () => {
    setLoading(true);
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);

    const newStartOfMonth = moment()
      .year(newYear)
      .month(newMonth)
      .startOf('month');
    const newEndOfMonth = moment()
      .year(newYear)
      .month(newMonth)
      .endOf('month')
      .add(14, 'days');
    setVisibleTimeStart(newStartOfMonth.valueOf());
    setVisibleTimeEnd(newEndOfMonth.valueOf());
  };

  const handleNextMonth = () => {
    setLoading(true);
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);

    const newStartOfMonth = moment()
      .year(newYear)
      .month(newMonth)
      .startOf('month');
    const newEndOfMonth = moment()
      .year(newYear)
      .month(newMonth)
      .endOf('month')
      .add(14, 'days');
    setVisibleTimeStart(newStartOfMonth.valueOf());
    setVisibleTimeEnd(newEndOfMonth.valueOf());
  };

  const handleGenerateGraph = () => {
    setLoading(true);
    generateGraph({
      workScheduleDate: moment(visibleTimeStart)
        .add(1, 'week')
        .format('YYYY-MM-DD'),
    })
      .unwrap()
      .then(() => {
        setVisibleTimeStart(moment(visibleTimeStart).add(1, 'day').valueOf());
      })
      .catch(() => {});
  };

  console.log(weekReportSelector);

  if (!groupsTimeline && !itemsTimeline) return <div>Loading...</div>;
  return (
    <div
      className={'w-[1700px] flex gap-[2px] mx-auto my-[30px] rounded relative'}
    >
      <button
        onClick={handleGetReport}
        className={
          'absolute border rounded-[10px] py-[5px] px-[30px] left-16 top-2 bg-white text-white cursor-pointer z-[8999] flex items-center gap-[5px] hover:bg-gray-300 transition ease-in-out shadow-lg'
        }
      >
        <img src={download_calendar} alt={'download'} />
        <span className={'font-[600] text-[18px] text-black'}>
          Скачать табель
        </span>
      </button>
      <DocGroupsSearch
        setGroups={setGroupsTimeline}
        startDate={moment(visibleTimeStart).add(1, 'week').format('YYYY-MM-DD')}
      />

      <div className="w-full max-w-md mx-auto mt-4 absolute  z-[8000] left-[35%] -top-[10px] border rounded-[10px] p-1">
        <div className="flex justify-between items-center">
          <button onClick={handlePreviousMonth} className="text-lg">
            <img src={black_arrow} />
          </button>
          <div className="text-lg">
            {months[currentMonth]} {currentYear}
          </div>
          <button onClick={handleNextMonth} className="text-lg rotate-[180deg]">
            <img src={black_arrow} />
          </button>
        </div>
      </div>

      <div className={'w-[90%] bg-white rounded relative overflow-hidden'}>
        {groupsTimeline && itemsTimeline && !loading && (
          <div className={'w-full bg-white mt-12'}>
            <div className="relative -top-10 z-[1000] translate-x-[350px]">
              {weeks.map((week, index) => {
                const weekWidth = 26.413 * 7;
                const left = 187.4 * index;
                return (
                  <div
                    key={index}
                    className="week-label"
                    style={{
                      position: 'absolute',
                      top: '40px',
                      left: `${left}px`, // Точное смещение влево
                      width: `${weekWidth}px`, // Точное расширение ширины
                      height: '60px',
                      backgroundColor:
                        week.status === 'green'
                          ? 'rgba(79, 222, 119, 0.3)'
                          : week.status === 'yellow'
                            ? 'rgba(255, 168, 66, 0.3)'
                            : 'rgba(128, 128, 128, 0.3)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      zIndex: '1',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                    }}
                    onClick={() => {
                      dispatch(setWeekReport(week));
                    }}
                  >
                    <div
                      className={`flex items-center gap-[5px] px-[6px] -translate-y-2 rounded-[20px] ${week.status === 'green' && 'bg-[#4FDE77]'} ${week.status === 'yellow' && 'bg-[#FFA842]'} ${week.status === 'gray' && 'bg-black'}`}
                    >
                      <div className={'w-[16px] h-[16px]'}>
                        {week.status === 'green' && (
                          <img src={acceptance_report} alt={'acc'} />
                        )}
                        {week.status === 'yellow' && (
                          <img src={warning_report} alt={'warning'} />
                        )}
                        {week.status === 'gray' && (
                          <img src={warning_report} alt={'null'} />
                        )}
                      </div>
                      <div className={'font-[600] text-[18px] text-white'}>
                        Смотреть отчёт
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {groupsTimeline && itemsTimeline && !loading && (
              <Timeline
                groups={groupsTimeline}
                items={itemsTimeline}
                defaultTimeStart={moment().startOf('month')}
                defaultTimeEnd={moment().endOf('month')}
                canMove={false}
                visibleTimeStart={visibleTimeStart}
                visibleTimeEnd={visibleTimeEnd}
                groupRenderer={DocGroups}
                itemRenderer={customItemRenderer}
                lineHeight={100}
                onTimeChange={() => {}}
                onBoundsChange={() => {}}
              />
            )}
          </div>
        )}
      </div>
      <div
        className={
          'z-10  flex flex-col w-[15%] rounded-tr-[20px] rounded-br-[20px] overflow-hidden'
        }
      >
        <div
          className={` h-[80%] rounded-br-[20px] bg-white flex flex-col ${weekReportSelector ? '' : 'justify-center'}`}
        >
          {!weekReportSelector && (
            <span
              className={'text-[#00000033] text-center font-[600] text-[18px]'}
            >
              Нажмите «Смотреть отчёт», чтобы увидеть данные...
            </span>
          )}
          {weekReportSelector && (
            <div className={'flex flex-col '}>
              <div
                className={`flex flex-col p-[20px] h-[80px] rounded-tr-[20px] ${weekReportSelector.status === 'green' && 'bg-[#4FDE77]'} ${weekReportSelector.status === 'yellow' && 'bg-[#FFA842]'} ${weekReportSelector.status === 'gray' && 'bg-black'} m-[1px]`}
              >
                <div className={' font-[700] text-[18px] text-white'}>
                  Отчёт
                </div>
                <div className={'font-[600] text-[14px] text-white'}>
                  Неделеля № {weekReportSelector.weekNumber}
                </div>
              </div>

              <div className={'flex flex-col gap-[10px] px-[20px] mt-[20px] '}>
                {translateModality(weekReportSelector.workloads).map(
                  (element) => (
                    <div className={'flex flex-col'}>
                      <div className={'flex items-center gap-[5px]'}>
                        <div className={'w-[80px] text-[18px] overflow-hidden'}>
                          {element.modality}
                        </div>
                        <div>-</div>
                        <div className={'text-[14px] font-bold'}>
                          {element.work} / {element.workload}
                        </div>
                      </div>
                      <div
                        className={
                          'flex items-center gap-[2px] justify-between'
                        }
                      >
                        {Array.from({
                          length: Math.min(
                            10,
                            Math.floor((element.work / element.workload) * 10)
                          ),
                        }).map((_, index) => {
                          const els = Math.floor(
                            (element.work / element.workload) * 10
                          );
                          return (
                            <div
                              key={index}
                              className={`${els >= 10 && 'bg-green-600'} ${els < 10 && els > 5 && 'bg-orange-600'} ${els <= 5 && 'bg-red-600'} w-[10px] h-[10px] grow`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className={
            'flex flex-col mt-[20px] bg-white justify-center items-center p-5'
          }
        >
          <img
            onClick={handleGenerateGraph}
            className={'w-[150px] h-[170px] cursor-pointer hover:opacity-50'}
            src={generator}
            alt={'generate graph'}
          />
        </div>
      </div>
    </div>
  );
};
