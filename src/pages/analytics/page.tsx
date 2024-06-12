import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import '../../styles/calendar.css';
import {useLazyGetGraphOnMonthQuery} from "../../store/api/schedule/planer";
import {useCreateReportMutation, useLazyGetReportQuery} from "../../store/api/export/exportApi";

// REQ

// 1. Забрать врачей - getDoctorsByIds
// 2. Фамилии врачей - getFioDocsById
//
// 3. Забрать график врачей на месяц - useLazyGetGraphOnMonthQuery
// 4. Забрать недели на месяц - useLazyGetWeekNumsQuery
// 5. Забрать анализ по неделям - useGetAnalyzesWeeksMutation
//
// 6. Смапать это все

//TIMELINE
// 1. Ограничить что бы нельзя было его двигать!
// 2. На русском
// 3. defaultTimeStart={moment().add(-12, 'hour')} defaultTimeEnd={moment().add(12, 'hour')} - это интервал на текущий месяц
// 4. const [visibleTimeStart, setVisibleTimeStart] = useState<any>(moment().add(-12, 'hour').valueOf()); const [visibleTimeEnd, setVisibleTimeEnd] = useState<any>(moment().add(12, 'hour').valueOf()); - должно соответсовать интерфалу на текующий месяц

const groups = [
    { id: 1, title: 'Group 1' },
    { id: 2, title: 'Group 2' }
];

const items = [
    { id: 1, group: 1, title: 'Item 1', start_time: moment(), end_time: moment().add(1, 'hour') },
    { id: 2, group: 2, title: 'Item 2', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(0.5, 'hour') },
    { id: 3, group: 1, title: 'Item 3', start_time: moment().add(2, 'hour'), end_time: moment().add(3, 'hour') }
];

export const AnalyticsPage = () => {
    const [getGraph] = useLazyGetGraphOnMonthQuery()

    const [createReport] = useCreateReportMutation()
    const [getReport] = useLazyGetReportQuery()

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    const [visibleTimeStart, setVisibleTimeStart] = useState<any>(startOfMonth.valueOf());
    const [visibleTimeEnd, setVisibleTimeEnd] = useState<any>(endOfMonth.valueOf());
    const [weeks, setWeeks] = useState<any>([]);

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


    // const groups = [
    //     { id: 1, title: 'Group 1' },
    //     { id: 2, title: 'Group 2' }
    // ];
    //
    // const items = [
    //     { id: 1, group: 1, title: 'Item 1', start_time: moment(), end_time: moment().add(1, 'hour') },
    //     { id: 2, group: 2, title: 'Item 2', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(0.5, 'hour') },
    //     { id: 3, group: 1, title: 'Item 3', start_time: moment().add(2, 'hour'), end_time: moment().add(3, 'hour') }
    // ];
    useEffect(() => {
        console.log(moment(visibleTimeStart).format('YYYY-MM-DD'))
        getGraph(moment(visibleTimeStart).format('YYYY-MM-DD'))
            .unwrap()
            .then((res) => {
                console.log(res)
            })
        // getGraph()
    },[])

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
                            window.location.href = res.link
                        })
                },5000)
            })
    }

    const handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        // Ограничиваем перемещение таймлайна
        const newVisibleTimeStart = moment.max(moment(visibleTimeStart), startOfMonth).valueOf();
        const newVisibleTimeEnd = moment.min(moment(visibleTimeEnd), endOfMonth).valueOf();

        setVisibleTimeStart(newVisibleTimeStart);
        setVisibleTimeEnd(newVisibleTimeEnd);

        if (updateScrollCanvas) {
            updateScrollCanvas(newVisibleTimeStart, newVisibleTimeEnd);
        }
    };

    return (
        <div className={'w-[1600px] mx-auto my-[30px] rounded relative'}>
            <button onClick={handleGetReport} className={'absolute border rounded p-2 left-2 top-2 bg-red-700 text-white cursor-pointer'}>СКАЧАТЬ</button>
            <div className={'w-[90%] bg-white rounded overflow-hidden'}>
                <div className={'w-full bg-white relative mt-12'}>
                    {/*<div*/}
                    {/*    style={{*/}
                    {/*        position: 'absolute',*/}
                    {/*        top: '0',*/}
                    {/*        width: 'calc(83% - 150px)',*/}
                    {/*        left: '160px',*/}
                    {/*        height: '40px',*/}
                    {/*        display: 'flex',*/}
                    {/*        zIndex: 999,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    {weeks.map((week, index) => {*/}
                    {/*        return (*/}
                    {/*            <div*/}
                    {/*                key={index}*/}
                    {/*                className="week-label"*/}
                    {/*                style={{*/}
                    {/*                    position: 'absolute',*/}
                    {/*                    top: '0',*/}
                    {/*                    left: `${((week.start.valueOf() - visibleTimeStart) / (visibleTimeEnd - visibleTimeStart)) * 100}%`,*/}
                    {/*                    width: `${((week.end.valueOf() - week.start.valueOf()) / (visibleTimeEnd - visibleTimeStart)) * 100}%`,*/}
                    {/*                    height: '40px',*/}
                    {/*                    backgroundColor:*/}
                    {/*                        week.status === 'green'*/}
                    {/*                            ? 'rgba(0,255,0,0.3)'*/}
                    {/*                            : week.status === 'yellow'*/}
                    {/*                                ? 'rgba(255,255,0,0.3)'*/}
                    {/*                                : 'rgba(255,0,0,0.3)',*/}
                    {/*                    display: 'flex',*/}
                    {/*                    justifyContent: 'center',*/}
                    {/*                    alignItems: 'center',*/}
                    {/*                    cursor: 'pointer',*/}
                    {/*                }}*/}
                    {/*                onClick={() => alert(week.label)}*/}
                    {/*            >*/}
                    {/*                {week.label}*/}
                    {/*            </div>*/}
                    {/*        );*/}
                    {/*    })}*/}
                    {/*</div>*/}
                    <Timeline
                        groups={groups}
                        items={items}
                        defaultTimeStart={moment().add(-12, 'hour')}
                        defaultTimeEnd={moment().add(12, 'hour')}
                        canMove={false}  // Ограничиваем перемещение
                        canResize={"both"}
                        stackItems={true}
                        itemHeightRatio={0.75}
                        visibleTimeStart={visibleTimeStart}
                        visibleTimeEnd={visibleTimeEnd}
                        onTimeChange={handleTimeChange}
                    />
                </div>

            </div>
        </div>
    );
};
