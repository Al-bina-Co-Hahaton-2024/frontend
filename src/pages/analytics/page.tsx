import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import '../../styles/calendar.css';
import {
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
} from '../../store/api/doctors/doctorsApi';
import { DocGroups } from './groups';
import acceptance_report from '../../assets/acceptance_report.svg';
import warning_report from '../../assets/warning_report.svg';

export const AnalyticsPage = () => {
  const [docsCard] = useGetDoctorsByIdsMutation();
  const [docsFio] = useGetFioDocsByIdMutation();

  const [getGraph] = useLazyGetGraphOnMonthQuery();
  const [weekNums] = useLazyGetWeekNumsQuery();
  const [weekAnalysis] = useGetAnalyzesWeeksMutation();

  const [createReport] = useCreateReportMutation();
  const [getReport] = useLazyGetReportQuery();

  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month').add(14, 'days');

  const [visibleTimeStart, setVisibleTimeStart] = useState<any>(
    startOfMonth.valueOf()
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<any>(
    endOfMonth.valueOf()
  );
  const [weeks, setWeeks] = useState<any>([]);

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
            console.log(mergeWeeks);
            setWeeks(
              mergeWeeks.map((week) => ({
                weekNumber: week.weekNumber,
                start: moment(week.startDate),
                end: moment(week.endDate),
                workloads: week.workloads,
                status: getStatus(week.workloads, week.actual),
                label: `Неделя ${moment(week.startDate).format('DD.MM')} по ${moment(week.endDate).format('DD.MM')}`,
              }))
            );

            getGraph(
              moment(visibleTimeStart).add(2, 'weeks').format('YYYY-MM-DD')
            )
              .unwrap()
              .then((res) => {
                const docIds = [
                  // @ts-ignore
                  ...new Set(
                    res
                      .map((element) => element.doctorSchedules)
                      .flat()
                      .map((doc) => doc.doctorId)
                  ),
                ];
                docsCard(docIds)
                  .unwrap()
                  .then((doctors) => {
                    docsFio(docIds)
                      .unwrap()
                      .then((fio) => {
                        const docsGroups = doctors.map((element) => {
                          const foundedElement = fio.find(
                            (el) => el.id === element.id
                          );
                          return {
                            ...element,
                            ...foundedElement,
                          };
                        });
                        const tmpItems = res
                          .map((element) => {
                            return element.doctorSchedules.map((doc) => ({
                              id: uuidv4(),
                              group: doc.doctorId,
                              start_time: moment(
                                `${element.date}T05:00:00`
                              ).valueOf(),
                              end_time: moment(
                                `${element.date}T20:59:00`
                              ).valueOf(),
                            }));
                          })
                          .flat();

                        setGroupsTimeline(docsGroups);
                        setItemsTimeline(tmpItems);
                      });
                  });
              });
          });
      });
  }, [getGraph, visibleTimeStart]);

  const handleGetReport = () => {
    createReport({
      date: '2024-06-01',
    })
      .unwrap()
      .then((res) => {
        setTimeout(() => {
          getReport(res.id)
            .unwrap()
            .then((res) => {
              window.location.href = res.link;
            });
        }, 1000);
      });
  };

  function translateModality(data) {
    return data.map((item) => {
      let translatedModality = item.modality;

      if (item.typeModality === 'U' || item.typeModality === 'U2') {
        if (item.modality === 'KT') {
          translatedModality = `КТ${item.typeModality}`;
        } else if (item.modality === 'MRT') {
          translatedModality = `МРТ${item.typeModality}`;
        }
      } else {
        switch (item.modality) {
          case 'MRT':
            translatedModality = 'МРТ';
            break;
          case 'KT':
            translatedModality = 'КТ';
            break;
          case 'RG':
            translatedModality = 'РГ';
            break;
          case 'DENSITOMETER':
            translatedModality = 'Денситометр';
            break;
          case 'FLG':
            translatedModality = 'ФЛГ';
            break;
          case 'MMG':
            translatedModality = 'ММГ';
            break;
          default:
            break;
        }
      }

      return {
        ...item,
        modality: translatedModality,
      };
    });
  }

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
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    return (
      <div
        {...getItemProps({
          style: {
            background: 'blue',
            color: 'white',
            borderRadius: 4,
            border: '1px solid blue',
            height: '100%',
            lineHeight: 'normal',
          },
        })}
      >
        <div
          className="rct-item-Azs"
          onClick={() => alert(moment(item.start_time))}
        ></div>
      </div>
    );
  };

  return (
    <div
      className={'w-[1700px] flex gap-[2px] mx-auto my-[30px] rounded relative'}
    >
      <button
        onClick={handleGetReport}
        className={
          'absolute border rounded p-2 left-2 top-2 bg-red-700 text-white cursor-pointer z-[9999]'
        }
      >
        СКАЧАТЬ
      </button>

      <div className={'w-[90%] bg-white rounded relative overflow-hidden'}>
        <div className={'w-full bg-white mt-12'}>
          <div className="relative -top-10 z-[1000] translate-x-[350px]">
            {weeks.map((week, index) => {
              const weekWidth = 26 * 7;
              const left = 184 * index;
              console.log(week);
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
                    // border: '1px solid black', // Добавляем границу для визуальной отладки
                  }}
                  onClick={() => setReport(week)}
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

          {groupsTimeline && itemsTimeline && (
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
      </div>
      <div
        className={
          'z-10  flex flex-col w-[15%] rounded-tr-[20px] rounded-br-[20px] overflow-hidden'
        }
      >
        <div
          className={` h-[80%] rounded-br-[20px] bg-white flex flex-col ${report ? '' : 'justify-center'}`}
        >
          {!report && (
            <span
              className={'text-[#00000033] text-center font-[600] text-[18px]'}
            >
              Нажмите «Смотреть отчёт», чтобы увидеть данные...
            </span>
          )}
          {report && (
            <div className={'flex flex-col '}>
              <div
                className={`flex flex-col p-[20px] h-[80px] rounded-tr-[20px] ${report.status === 'green' && 'bg-[#4FDE77]'} ${report.status === 'yellow' && 'bg-[#FFA842]'} ${report.status === 'gray' && 'bg-black'} m-[1px]`}
              >
                <div className={' font-[700] text-[18px] text-white'}>
                  Отчёт
                </div>
                <div className={'font-[600] text-[14px] text-white'}>
                  Неделеля № {report.weekNumber}
                </div>
              </div>

              <div className={'flex flex-col px-[20px] mt-[20px] '}>
                {translateModality(report.workloads).map((element) => (
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
                      className={'flex items-center gap-[2px] justify-between'}
                    >
                      {Array.from({
                        length: Math.min(
                          10,
                          Math.floor((element.work / element.workload) * 10)
                        ),
                      }).map((_, index) => (
                        <div
                          key={index}
                          className="bg-red-700 w-[10px] h-[10px] grow"
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
