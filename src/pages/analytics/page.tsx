import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import '../../styles/calendar.css';
import { useLazyGetGraphOnMonthQuery } from "../../store/api/schedule/planer";
import { useCreateReportMutation, useLazyGetReportQuery } from "../../store/api/export/exportApi";
import { v4 as uuidv4 } from 'uuid';
import { useGetDoctorsByIdsMutation, useGetFioDocsByIdMutation } from "../../store/api/doctors/doctorsApi";
import { DocGroups } from "./groups";

export const AnalyticsPage = () => {
    const [docsCard] = useGetDoctorsByIdsMutation();
    const [docsFio] = useGetFioDocsByIdMutation();

    const [getGraph] = useLazyGetGraphOnMonthQuery();

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
        getGraph(moment(visibleTimeStart).format('YYYY-MM-DD'))
            .unwrap()
            .then((res) => {
                // @ts-ignore
                const docIds = [...new Set(res.map((element) => element.doctors).flat().map((doc) => doc.doctorId))];

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
                                    return element.doctors.map((doc) => ({
                                        id: uuidv4(),
                                        group: doc.doctorId,
                                        start_time: moment(`${element.date}T08:00:00`).valueOf(),
                                        end_time: moment(`${element.date}T17:00:00`).valueOf()
                                    }));
                                }).flat();

                                setGroupsTimeline(docsGroups);
                                setItemsTimeline(tmpItems);
                            });
                    });
            });
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
                    DC
                </div>
            </div>
        );
    };

    return (
        <div className={'w-[1600px] mx-auto my-[30px] rounded relative'}>
            <button onClick={handleGetReport} className={'absolute border rounded p-2 left-2 top-2 bg-red-700 text-white cursor-pointer'}>СКАЧАТЬ</button>
            <div className={'w-[90%] bg-white rounded overflow-hidden'}>
                <div className={'w-full bg-white relative mt-12'}>
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
