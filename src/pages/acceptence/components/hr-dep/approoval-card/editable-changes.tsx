import React from 'react';
import pencil from "../../../../../assets/pencil.svg";

export const EditableChanges = ({ current, feature }) => {
    const cur = current[0];


    const mergeAndMarkWorkDays = (current, feature) => {
        const curWorkDays = current.workDays || [];
        const featureWorkDays = feature.workDays || [];

        // Объединение и фильтрация дубликатов
        // @ts-ignore
        const mergedWorkDays = [...new Set([...curWorkDays, ...featureWorkDays])];

        // Определение добавленных элементов
        const addedWorkDays = featureWorkDays.filter(day => !curWorkDays.includes(day));

        return { mergedWorkDays, addedWorkDays };
    };


    const mergeAndMarkOptionalModality = (current, feature) => {
        const curOptionalModality = current.optionalModality || [];
        const featureOptionalModality = feature.optionalModality || [];

        // Объединение и фильтрация дубликатов
        // @ts-ignore
        const mergedModality = [...new Set([...curOptionalModality, ...featureOptionalModality])];

        // Определение добавленных элементов
        const addedElements = featureOptionalModality.filter(el => !curOptionalModality.includes(el));

        return { mergedModality, addedElements };
    };

    const { mergedModality, addedElements } = mergeAndMarkOptionalModality(cur, feature);

    const { mergedWorkDays, addedWorkDays } = mergeAndMarkWorkDays(cur, feature);

    return (
        <div className="mx-[25px]">
            <div className="p-[20px] bg-white shadow-lg flex flex-col rounded-[20px]">
                <div className="w-full flex items-center flex-wrap">
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Модальность</div>
                        <div className={`font-[400] text-[18px] ${cur.modality !== feature.modality ? 'text-[#FFA842]' : 'text-black'}`}>{feature.modality || '-'}</div>
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Доп. модальность</div>
                        <div className={'flex gap-[2px]'}>
                            {mergedModality.map((modality, index) => (
                                <div
                                    key={index}
                                    className={`font-[400] text-[18px] ${addedElements.includes(modality) ? 'text-[#FFA842]' : 'text-black'}`}
                                >
                                    {modality.length !== 0 ? modality : '-'}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Ставка</div>
                        <div className={`font-[400] text-[18px] ${cur.rate !== feature.rate ? 'text-[#FFA842]' : 'text-black'}`}>{feature.rate !== null ? feature.rate : '-'}</div>
                    </div>
                </div>
                <div className="w-full flex items-center flex-wrap mt-[30px]">
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Начало работы</div>
                        <div className={`font-[400] text-[18px] ${cur.startWorkDay !== feature.startWorkDay ? 'text-[#FFA842]' : 'text-black'}`}>{feature.startWorkDay || '-'}</div>
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Время работы</div>
                        <div className={`font-[400] text-[18px] ${cur.hours !== feature.hours ? 'text-[#FFA842]' : 'text-black'}`}>{feature.hours !== null ? `${feature.hours} ч` : '-'}</div>
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Рабочие дни</div>
                        <div className={'flex gap-[2px]'}>
                            {mergedWorkDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`font-[400] text-[18px] ${addedWorkDays.includes(day) ? 'text-[#FFA842]' : 'text-black'}`}
                                >
                                    {day.length !== 0 ? day : '-'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center flex-wrap mt-[30px]">
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Дата выхода</div>
                        <div className={`font-[400] text-[18px] ${cur.startContract !== feature.startContract ? 'text-[#FFA842]' : 'text-black'}`}>{feature.startContract || '-'}</div>
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Дата увольнения</div>
                        <div className={`font-[400] text-[18px] ${cur.endContract !== feature.endContract ? 'text-[#FFA842]' : 'text-black'}`}>{feature.endContract || '-'}</div>
                    </div>
                    <div className="w-[200px] flex items-center gap-[10px] bg-[#FFA842] py-[10px] px-[16px] rounded-[20px] cursor-pointer">
                        <img src={pencil} alt="pencil" />
                        <div className="font-[600] text-[18px] text-white">Редактирование</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
