import React from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

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
    return (
        <div className={'w-full'}>
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment().add(-12, 'hour')}
                defaultTimeEnd={moment().add(12, 'hour')}
                canMove={true}
                canResize={"both"}
                stackItems={true}
                itemHeightRatio={0.75}
            />
        </div>
    );
};
