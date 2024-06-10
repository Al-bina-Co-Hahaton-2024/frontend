import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import '../../styles/calendar.css';

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
    const [visibleTimeStart, setVisibleTimeStart] = useState<any>(moment('2024-01-01').valueOf());
    const [visibleTimeEnd, setVisibleTimeEnd] = useState<any>(moment('2024-01-30').valueOf());
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

    const handleTimeChange = (visibleTimeStart, visibleTimeEnd) => {
        setVisibleTimeStart(visibleTimeStart);
        setVisibleTimeEnd(visibleTimeEnd);
    };

    return (
        <div className={'w-full'}>
            <div
                style={{
                    position: 'absolute',
                    top: '0',
                    width: 'calc(83% - 150px)',
                    left: '347px',
                    height: '40px',
                    display: 'flex',
                    zIndex: 999,
                }}
            >
                {weeks.map((week, index) => {
                    return (
                        <div
                            key={index}
                            className="week-label"
                            style={{
                                position: 'absolute',
                                top: '0',
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
                            }}
                            onClick={() => alert(week.label)}
                        >
                            {week.label}
                        </div>
                    );
                })}
            </div>
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment().add(-12, 'hour')}
                defaultTimeEnd={moment().add(12, 'hour')}
                canMove={true}
                canResize={"both"}
                stackItems={true}
                itemHeightRatio={0.75}
                visibleTimeStart={visibleTimeStart}
                visibleTimeEnd={visibleTimeEnd}
                onTimeChange={handleTimeChange}
            />
        </div>
    );
};
