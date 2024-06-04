import moment from 'moment';

export interface Group {
    id: number;
    title: string;
}

export interface Item {
    id: number;
    group: number;
    title: string;
    start_time: number;
    end_time: number;
    canMove?: boolean;
    canResize?: 'left' | 'right' | 'both';
}


export const groups: Group[] = [
    { id: 1, title: 'Group 1' },
    { id: 2, title: 'Group 2' },
];

export const items: Item[] = [
    {
        id: 1,
        group: 1,
        title: 'Item 1',
        start_time: moment().add(-1, 'hour').valueOf(),
        end_time: moment().add(1, 'hour').valueOf(),
        canMove: true,
        canResize: 'both',
    },
    {
        id: 2,
        group: 2,
        title: 'Item 2',
        start_time: moment().add(-0.5, 'hour').valueOf(),
        end_time: moment().add(0.5, 'hour').valueOf(),
        canMove: true,
        canResize: 'both',
    },
    {
        id: 3,
        group: 1,
        title: 'Item 3',
        start_time: moment().add(2, 'hour').valueOf(),
        end_time: moment().add(3, 'hour').valueOf(),
        canMove: true,
        canResize: 'both',
    },
];