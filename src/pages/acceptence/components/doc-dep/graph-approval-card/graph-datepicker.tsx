import React, {useEffect, useState} from 'react';
import DatePicker, {Calendar, DateObject} from 'react-multi-date-picker';
import pencil from "../../../../../assets/pencil.svg";
import colors from "react-multi-date-picker/plugins/colors"


const getColor = (date, ranges) => {
    const dateObj = date.toDate();
    for (let range of ranges) {
        if (dateObj >= range.start && dateObj <= range.end) {
            return range.color;
        }
    }
    return null;
};

const mergeSchedules = (absenceSchedules, doc) => {
    const doctor = {
        start: doc.start,
        end: doc.end,
        color: 'orange' // цвет для диапазона доктора
    };

    return [
        ...absenceSchedules.map(schedule => ({
            start: new Date(schedule.start),
            end: new Date(schedule.end),
            color: 'red'
        })),
        {
            start: new Date(doctor.start),
            end: new Date(doctor.end),
            color: doctor.color
        }
    ];
};

export const GraphDatePicker = ({doc, absence}) => {
    const [isEdit, setIsEdit] = useState<any>(false);
    const [values, setValues] = useState<any>([]);
    const [ranges, setRanges] = useState<any>([]);

    useEffect(() => {
        if (doc && absence) {
            const mergedSchedules = mergeSchedules(absence, doc);
            setRanges(mergedSchedules);

            const initialValues = mergedSchedules.map(schedule => [
                new DateObject(schedule.start),
                new DateObject(schedule.end)
            ]);
            setValues(initialValues);
        }
    }, [doc, absence]);

    const handleForm = () => {
        setIsEdit(!isEdit);
    };

    return (
        <div className="mx-[25px] mt-[20px] relative">
            <div className={'p-[20px] bg-white shadow-lg flex flex-col rounded-[20px]'}>
                <div className="mb-4 text-[24px] font-[600]">График отгулов</div>
                {/*{!isEdit && <div className={'bg-black opacity-5 top-24 absolute w-[95%] rounded h-[57%] z-10'}></div>}*/}
                <div>
                    <Calendar

                        value={values}
                        onChange={setValues}
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
                        // readOnly={!isEdit}

                    />

                    {/*<DatePicker*/}
                    {/*    disabled={!isEdit}*/}
                    {/*    selected={startDate}*/}
                    {/*    onChange={handleSelect}*/}
                    {/*    startDate={startDate}*/}
                    {/*    endDate={endDate}*/}
                    {/*    selectsRange*/}
                    {/*    inline*/}
                    {/*/>*/}
                </div>
                <div className={'w-full justify-end flex -translate-x-2'}>
                    <button
                        onClick={handleForm}
                        className="w-[200px] flex items-center gap-[10px] bg-[#00A3FF] py-[10px] px-[16px] rounded-[20px] cursor-pointer">
                        <img src={pencil} alt="pencil"/>
                        <div
                            className="font-[600] text-[18px] text-white">{isEdit ? 'Сохранить' : 'Редактирование'}</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

