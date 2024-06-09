import React, { useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import { groups, items as initialItems, Item } from '../../mock/calendar_mock';

export const AnalyticsPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>(initialItems);

    const handleItemMove = (itemId: number, dragTime: number, newGroupOrder: number) => {
        const group = groups[newGroupOrder];
        const updatedItems = items.map(item =>
            item.id === itemId
                ? Object.assign({}, item, {
                    start_time: dragTime,
                    end_time: dragTime + (item.end_time - item.start_time),
                    group: group.id
                })
                : item
        )
        setItems(updatedItems);
    };


    return (
        <div>

        </div>
        // <Timeline
        //     groups={groups}
        //     items={items}
        //     keys={{
        //         groupIdKey: 'id',
        //         groupTitleKey: 'title',
        //         itemIdKey: 'id',
        //         itemTitleKey: 'title',
        //         itemGroupKey: 'group',
        //         itemTimeStartKey: 'start_time',
        //         itemTimeEndKey: 'end_time',
        //         groupRightTitleKey: 'rightTitle',
        //         itemDivTitleKey: 'title',
        //     }}
        //     canChangeGroup={false}
        //     defaultTimeStart={moment().add(-12, 'hour')}
        //     defaultTimeEnd={moment().add(12, 'hour')}
        //     onItemMove={handleItemMove}
        //     canMove={true}
        //     canResize="both"
        // />
    );
};
