import React, { useEffect, useState } from 'react';
import DatePicker, { Calendar, DateObject } from 'react-multi-date-picker';
import pencil from "../../../../../assets/pencil.svg";

const getColor = (date, ranges) => {
    const dateObj = date.toDate();
    for (let range of ranges) {
        if (dateObj >= range.start && dateObj <= range.end) {
            return range.color;
        }
    }
    return null;
};

const mergeSchedules = (doc, absenceSchedules) => {
    const doctor = {
        start: new Date(absenceSchedules?.start).setHours(0, 0, 0, 0),
        end: new Date(new Date(absenceSchedules?.end).setHours(23, 59, 59, 999)),
        color: 'red' // цвет для диапазона доктора
    };

    return [
        ...doc.absenceSchedules.map(schedule => ({
            start: new Date(schedule.start).setHours(0, 0, 0, 0),
            end: new Date(new Date(schedule.end).setHours(23, 59, 59, 999)),
            color: 'black'
        })),
        doctor
    ];
};

export const GraphDatePicker = ({ doc, absence }) => {
    const [isEdit, setIsEdit] = useState<any>(false);
    const [values, setValues] = useState<any>([]);
    const [ranges, setRanges] = useState<any>([]);

    useEffect(() => {
        if (doc && absence) {
            const mergedSchedules = mergeSchedules(doc[0], absence[0]);
            setRanges(mergedSchedules);

            const initialValues = mergedSchedules.filter(range => range.color === 'red').map(range => [
                new DateObject(range.start),
                new DateObject(range.end)
            ]);
            setValues(initialValues);
        }
    }, [doc, absence]);

    const handleForm = () => {
        setIsEdit(!isEdit);
    };

    const handleCalendarChange = (newValues) => {
        if (isEdit) {
            const updatedValues = newValues.filter((value) => {
                const [start, end] = value;

                return ranges.some(range =>
                    range.color === 'red' &&
                    ((start && start?.toDate() >= range.start && start?.toDate() <= range.end) ||
                        (end && end?.toDate() >= range.start && end?.toDate() <= range.end))
                );
            });

            // console.log(newValues)
            // const newRedIntervals = updatedValues.map((value) => {
            //     const [start, end] = value;
            //     console.log(start,end)
            //     return {
            //         start: start?.toDate(),
            //         end: end?.toDate(),
            //         color: 'red'
            //     };
            // });

            // const newRanges = ranges.filter(range => range.color !== 'red').concat(newRedIntervals);
            // setRanges(newRanges);

            setValues(updatedValues);
        }
    };

    return (
        <div className="mx-[25px] mt-[20px] relative">
            <div className={'p-[20px] bg-white shadow-lg flex flex-col rounded-[20px]'}>
                <div className="mb-4 text-[24px] font-[600]">График отгулов</div>
                <div>
                    <Calendar
                        value={values}
                        onChange={handleCalendarChange}
                        multiple
                        range
                        showOtherDays
                        mapDays={({ date }) => {
                            const color = getColor(date, ranges);
                            if (color) {
                                return {
                                    style: { backgroundColor: color, color: "white" }
                                };
                            }
                        }}
                        readOnly={!isEdit}
                    />
                </div>
                <div className={'w-full justify-end flex -translate-x-2'}>
                    <button
                        disabled
                        onClick={handleForm}
                        className="w-[200px] flex items-center gap-[10px] bg-[#00A3FF] py-[10px] px-[16px] rounded-[20px] cursor-pointer opacity-20">
                        <img src={pencil} alt="pencil" />
                        <div className="font-[600] text-[18px] text-white">{isEdit ? 'Сохранить' : 'Редактирование'}</div>
                    </button>
                </div>
            </div>
        </div>
    );
};
