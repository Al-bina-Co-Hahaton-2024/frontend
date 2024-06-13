import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import '../../styles/calendar.css';
import {
    useGetAnalyzesWeeksMutation,
    useLazyGetGraphOnMonthQuery,
    useLazyGetWeekNumsQuery
} from "../../store/api/schedule/planer";
import { useCreateReportMutation, useLazyGetReportQuery } from "../../store/api/export/exportApi";
import { v4 as uuidv4 } from 'uuid';
import { useGetDoctorsByIdsMutation, useGetFioDocsByIdMutation } from "../../store/api/doctors/doctorsApi";
import { DocGroups } from "./groups";

export const AnalyticsPage = () => {
    const [docsCard] = useGetDoctorsByIdsMutation();
    const [docsFio] = useGetFioDocsByIdMutation();

    const [getGraph] = useLazyGetGraphOnMonthQuery();
    const [weekNums] = useLazyGetWeekNumsQuery()
    const [weekAnalysis] = useGetAnalyzesWeeksMutation()

    const [createReport] = useCreateReportMutation();
    const [getReport] = useLazyGetReportQuery();

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month').add(10, 'days');

    const [visibleTimeStart, setVisibleTimeStart] = useState<any>(startOfMonth.valueOf());
    const [visibleTimeEnd, setVisibleTimeEnd] = useState<any>(endOfMonth.valueOf());
    const [weeks, setWeeks] = useState<any>([]);

    const [groupsTimeline, setGroupsTimeline] = useState<null | any[]>(null);
    const [itemsTimeline, setItemsTimeline] = useState<null | any[]>(null);

    const generateWeekLabels = (start, end) => {
        const weeks: any = [];
        let currentWeek = moment(start).startOf('isoWeek');

        while (currentWeek.isBefore(end)) {
            const weekStart = currentWeek.clone();
            const weekEnd = currentWeek.clone().endOf('isoWeek');
            const status = Math.random() > 0.4 ? (Math.random() > 0.5 ? 'green' : 'yellow') : 'red';

            weeks.push({
                start: weekStart,
                end: weekEnd,
                status,
                label: `Неделя ${weekStart.format('DD.MM')} по ${weekEnd.format('DD.MM')}`,
            });

            currentWeek.add(1, 'week');
        }

        setWeeks(weeks);
    };

    useEffect(() => {
        generateWeekLabels(visibleTimeStart, visibleTimeEnd);
    }, [visibleTimeStart, visibleTimeEnd]);

    useEffect(() => {


        const weeksDates: any = []
        let monthStart = visibleTimeStart

        for (let i = 0; i <= 4; i++) {
            let tmp = moment(monthStart).add(1, 'week').format('YYYY-MM-DD')
            monthStart = tmp
            weeksDates.push(tmp)
        }

        weeksDates.unshift(moment(visibleTimeStart).format('YYYY-MM-DD'))
        weekNums(weeksDates)
            .unwrap()
            .then(weekRes => {

                //Мап для анализа
                const analysisWeeks: any = []

                weekRes?.forEach((element) => {
                    const obj = {
                        year: String(moment(element.startDate).year()),
                        week: element.weekNumber
                    }

                    analysisWeeks.push(obj)
                })

                setVisibleTimeStart(moment(weekRes[0].startDate).valueOf())
                setVisibleTimeEnd(moment(weekRes[weekRes.length -1].endDate).add(1, 'week').valueOf())

                //Анализ
                weekAnalysis(analysisWeeks)
                    .unwrap()
                    .then(analysis => {


                        const mergeWeeks = weekRes.map((el) => {
                            const foundedObj = analysis.find(element => element.weekNumber === el.weekNumber)
                            return {
                                ...el,
                                ...foundedObj
                            }
                        })

                        getGraph(moment(visibleTimeStart).add(2,'weeks').format('YYYY-MM-DD'))
                            .unwrap()
                            .then((res) => {
                                // @ts-ignore
                                const docIds = [...new Set(res.map((element) => element.doctorSchedules).flat().map((doc) => doc.doctorId))];
                                docsCard(docIds)
                                    .unwrap()
                                    .then(doctors => {
                                        docsFio(docIds)
                                            .unwrap()
                                            .then(fio => {

                                                const docsGroups = doctors.map((element) => {
                                                    const foundedElement = fio.find((el) => el.id === element.id);
                                                    return {
                                                        ...element,
                                                        ...foundedElement
                                                    };
                                                });
                                                const tmpItems = res.map((element) => {
                                                    return element.doctorSchedules.map((doc) => ({
                                                        id: uuidv4(),
                                                        group: doc.doctorId,
                                                        start_time: moment(`${element.date}T05:00:00`).valueOf(),
                                                        end_time: moment(`${element.date}T20:59:00`).valueOf()
                                                    }));
                                                }).flat();

                                                setGroupsTimeline(docsGroups);
                                                setItemsTimeline(tmpItems);

                                            })
                                    })
                            })
                    })

            })

    }, [getGraph, visibleTimeStart]);

    const handleGetReport = () => {
        createReport({
            date: '2024-06-01'
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

    const handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        const newVisibleTimeStart = moment.max(moment(visibleTimeStart), startOfMonth).valueOf();
        const newVisibleTimeEnd = moment.min(moment(visibleTimeEnd), endOfMonth).valueOf();

        setVisibleTimeStart(newVisibleTimeStart);
        setVisibleTimeEnd(newVisibleTimeEnd);

        if (updateScrollCanvas) {
            updateScrollCanvas(newVisibleTimeStart, newVisibleTimeEnd);
        }
    };

    const customItemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
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
                <div className="rct-item-Azs" onClick={() => alert(moment(item.start_time))}>

                </div>
            </div>
        );
    };

    return (
        <div className={'w-[1600px] mx-auto my-[30px] rounded relative'}>
            <button onClick={handleGetReport} className={'absolute border rounded p-2 left-2 top-2 bg-red-700 text-white cursor-pointer'}>СКАЧАТЬ</button>

            <div className={'w-[90%] bg-white rounded relative overflow-hidden'}>
                <div className={'w-full bg-white mt-12'}>
                    <div className={'relative -top-10 z-[9999] translate-x-[300px]'}>
                        {weeks.map((week, index) => {
                            return (
                                <div
                                    key={index}
                                    className="week-label"
                                    style={{
                                        position: 'absolute',
                                        top: '40px',

                                        left: `${((week.start.valueOf() - visibleTimeStart) / (visibleTimeEnd - visibleTimeStart)) * 100}%`,
                                        width: `${((week.end.valueOf() - week.start.valueOf()) / (visibleTimeEnd - visibleTimeStart)) * 100}%`,
                                        height: '40px',
                                        backgroundColor:
                                            week.status === 'green'
                                                ? 'rgba(0,255,0,0.3)'
                                                : week.status === 'yellow'
                                                    ? 'rgba(255,255,0,0.3)'
                                                    : 'rgba(255,0,0,0.3)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        zIndex: '9999'
                                    }}
                                    onClick={() => alert(week.label)}
                                >
                                    {week.label}
                                </div>
                            );
                        })}
                    </div>
                    {groupsTimeline && itemsTimeline && <Timeline
                        groups={groupsTimeline}
                        items={itemsTimeline}
                        defaultTimeStart={moment().startOf('month')}
                        defaultTimeEnd={moment().endOf('month')}
                        canMove={false}
                        visibleTimeStart={visibleTimeStart}
                        visibleTimeEnd={visibleTimeEnd}
                        groupRenderer={DocGroups}
                        itemRenderer={customItemRenderer}
                        lineHeight={100} // Adjust lineHeight to ensure correct alignment
                    />}
                </div>
            </div>
        </div>
    );
};
