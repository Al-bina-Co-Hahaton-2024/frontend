import doctor from "../../../../../assets/doctor.svg";

export const CurrentChanges = ({fioData, docData}) => {
    const fioObj = fioData[0]
    const currentDoc = docData[0]

    return (
        <div className={'mx-[25px]'}>

            <div className={'p-[20px] flex items-center w-full gap-[20px]'}>
                <img src={doctor} alt={'doctor'}/>
                <div className={'flex flex-col'}>
                    <div className={'font-[400] text-[14px] text-[#00000080]'}>Врач</div>
                    <div className={'font-[400] text-[18px] text-[#000000]'}>{fioObj?.fullName?.first}</div>
                    <div className={'font-[400] text-[18px] text-[#000000]'}>{fioObj?.fullName?.last} {fioObj?.fullName?.middle}</div>
                </div>
            </div>

            <div className={'p-[20px] bg-white shadow-lg flex flex-col rounded-[20px]'}>

                <div className={'w-full flex items-center flex-wrap'}>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Модальность</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.modality ?? '-'}</div>
                    </div>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Доп. модальность</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.optionalModality !== null ? currentDoc.optionalModality.join(',') : '-' }</div>
                    </div>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Ставка</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.rate ?? '-'}</div>
                    </div>

                </div>

                <div className={'w-full flex items-center flex-wrap mt-[30px]'}>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Начало работы</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.startWorkDay ?? '-'}</div>
                    </div>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Время работы</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.hours ?? '-'}</div>
                    </div>

                    <div className={'w-[180px] flex flex-col overflow-hidden'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Рабочие дни</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.workDays !== null ? currentDoc.workDays.join(',') : '-' }</div>
                    </div>

                </div>

                <div className={'w-full flex items-center flex-wrap mt-[30px]'}>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Дата выхода</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.startContract ?? '-'}</div>
                    </div>

                    <div className={'w-[180px] flex flex-col'}>
                        <div className={'font-[400] text-[14px] text-[#00000080]'}>Дата увольнения</div>
                        <div className={'font-[400] text-[18px]'}>{currentDoc.endContract ?? '-'}</div>
                    </div>

                </div>

            </div>

        </div>
    )
}