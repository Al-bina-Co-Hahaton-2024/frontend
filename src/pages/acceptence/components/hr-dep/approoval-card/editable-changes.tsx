import React, {useEffect, useState} from 'react';
import pencil from "../../../../../assets/pencil.svg";
import {Controller, useForm} from "react-hook-form";
import {MultiSelect} from "react-multi-select-component";
import {_DAYS_OF_WEEKS, _MEDICAL_MODALITIES, _OPT_MODALITIES} from "../../../../../constants/constants";
import './drop-down.css'
import {useToApproveDoctorChangesMutation} from "../../../../../store/api/doctors/doctorsApi";
import {useAppDispatch, useAppSelector} from "../../../../../store/hooks/storeHooks";
import {setApprovalCardState} from "../../../../../store/reducers/serviceSlice";

export const EditableChanges = ({ current, feature }) => {
    const dispatch = useAppDispatch()
    const docId = useAppSelector((state) => state.serviceSlice.docId)
    const [readForm, setReadForm] = useState<any>({})
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [toApprove] = useToApproveDoctorChangesMutation()

    const {control, register, handleSubmit, setValue} = useForm()


    const cur = current[0];


    useEffect(() => {
        const currentData = current[0]

        const result = {
            modality: feature.modality ?? currentData.modality,
            hours: feature.hours ?? currentData.hours,
            rate: feature.rate ?? currentData.rate,
            startContract: feature.startContract ?? currentData.startContract,
            startWorkDay: feature.startWorkDay ?? currentData.startWorkDay,
            endContract: feature.endContract ?? currentData.endContract,
            optionalModality: feature.optionalModality ?? currentData.optionalModality,
            workDays: feature.workDays ?? currentData.workDays ?? currentData.workDays
        }

        setValue("modality", result?.modality);
        setValue("hours", result?.hours);
        setValue("rate", result?.rate);
        setValue("startContract", result?.startContract);
        setValue("endContract", result?.endContract);
        setValue("startWorkDay", result?.startWorkDay);
        setValue("workDays", result?.workDays?.map(day => ({ value: day, label: _DAYS_OF_WEEKS.find(d => d.value === day)?.label })));
        setValue('optionalModality', result?.optionalModality.map(modal => ({value: modal, label: modal})));

        setReadForm(result)

    },[])


    const mergeAndMarkWorkDays = (current, feature) => {
        const curWorkDays = current?.workDays || [];
        const featureWorkDays = feature?.workDays || [];

        // Объединение и фильтрация дубликатов
        // @ts-ignore
        const mergedWorkDays = [...new Set([...curWorkDays, ...featureWorkDays])];

        // Определение добавленных элементов
        const addedWorkDays = featureWorkDays.filter(day => !curWorkDays.includes(day));

        return { mergedWorkDays, addedWorkDays };
    };


    const mergeAndMarkOptionalModality = (current, feature) => {
        const curOptionalModality = current?.optionalModality || [];
        const featureOptionalModality = feature?.optionalModality || [];

        // Объединение и фильтрация дубликатов
        // @ts-ignore
        const mergedModality = [...new Set([...curOptionalModality, ...featureOptionalModality])];

        // Определение добавленных элементов
        const addedElements = featureOptionalModality.filter(el => !curOptionalModality.includes(el));

        return { mergedModality, addedElements };
    };

    const { mergedModality, addedElements } = mergeAndMarkOptionalModality(cur, feature);

    const { mergedWorkDays, addedWorkDays } = mergeAndMarkWorkDays(cur, feature);

    const handleSubmitFrom = (data) => {
        if (isEdit) {
            const id = docId

            const resultObject = {
                doctorId: docId,
                ...data,
                optionalModality: data?.optionalModality?.map((el => el?.value)),
                workDays: data?.workDays?.map((el) => el?.value)
            }

            toApprove(resultObject)
                .unwrap()
                .then(() => {
                    dispatch(setApprovalCardState({ isOpen: false,
                        docId: null}))

                    setTimeout(() => {
                        dispatch(setApprovalCardState({ isOpen: true,
                            docId: id}))
                    },200)
                })

        } else {
            setIsEdit(true)
        }
    }


    return (
        <form onSubmit={handleSubmit(handleSubmitFrom)} className="mx-[25px]">
            <div className="p-[20px] bg-white shadow-lg flex flex-col rounded-[20px]">
                <div className="w-full flex items-center flex-wrap">
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Модальность</div>
                        {
                            isEdit
                                ? <input className={'w-[150px] border p-1 text-center rounded-[15px] bg-gray-300'} placeholder="Иванов" {...register("modality")} />
                                : <div
                                    className={`font-[400] text-[18px] ${cur.modality !== feature.modality ? 'text-[#FFA842]' : 'text-black'}`}>{readForm?.modality || '-'}</div>
                        }

                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Доп. модальность</div>
                        {
                            isEdit
                                ? <div>
                                    <Controller
                                        name="optionalModality"
                                        control={control}
                                        render={({field: {onChange, value, ref, onBlur, name}}) => {

                                            return (
                                                <div className="dropdown-container">
                                                    <MultiSelect
                                                        className={'max-w-[150px] !rounded-[15px]'}
                                                        options={_OPT_MODALITIES}
                                                        value={value || []}
                                                        onChange={onChange}
                                                        labelledBy="Select"
                                                    />
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                                : <div className={'flex gap-[2px]'}>
                                    {
                                        readForm?.optionalModality?.length !== 0 ? readForm?.optionalModality?.map((modality, index) => (
                                                <div
                                                    key={index}
                                                    className={`font-[400] text-[18px] ${addedElements.includes(modality) ? 'text-[#FFA842]' : 'text-black'}`}
                                                >
                                                    {modality || '-'}
                                                </div>
                                            ))
                                            : <div>-</div>
                                    }
                                </div>
                        }

                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Ставка</div>
                        {
                            isEdit
                                ? <input className={'w-[150px] border p-1 text-center rounded-[15px] bg-gray-300'} placeholder="Иванов" {...register("rate")} />
                                : <div
                                    className={`font-[400] text-[18px] ${cur.rate !== feature.rate ? 'text-[#FFA842]' : 'text-black'}`}>{readForm?.rate || '-'}</div>
                        }
                    </div>
                </div>
                <div className="w-full flex items-center flex-wrap mt-[30px]">
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Начало работы</div>
                        {
                            isEdit
                                ? <input className={'w-[150px] border p-1 text-center rounded-[15px] bg-gray-300'} type={'time'}
                                         placeholder="Иванов" {...register("startWorkDay")} />
                                : <div
                                    className={`font-[400] text-[18px] ${cur.startWorkDay !== feature.startWorkDay ? 'text-[#FFA842]' : 'text-black'}`}>{readForm?.startWorkDay || '-'}</div>
                        }
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Время работы</div>
                        {
                            isEdit
                                ? <input className={'w-[150px] border p-1 text-center rounded-[15px] bg-gray-300'}
                                         placeholder="Иванов" {...register("hours")} />
                                : <div
                                    className={`font-[400] text-[18px] ${cur.hours !== feature.hours ? 'text-[#FFA842]' : 'text-black'}`}>{`${readForm?.hours} ч` || '-'}</div>
                        }
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Рабочие дни</div>
                        {
                            isEdit
                                ? <div>
                                    <Controller
                                        name="workDays"
                                        control={control}
                                        render={({field: {onChange, value, ref, onBlur, name}}) => {

                                            return (
                                                <div className="dropdown-container">
                                                    <MultiSelect
                                                        className={'max-w-[150px] !rounded-[15px]'}
                                                        options={_DAYS_OF_WEEKS}
                                                        value={value || []}
                                                        onChange={onChange}
                                                        labelledBy="Select"
                                                    />
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                                : <div className={'flex gap-[2px]'}>
                                    {
                                        readForm?.workDays?.length !== 0 ? readForm?.workDays?.map((day, index) => (
                                                <div
                                                    key={index}
                                                    className={`font-[400] text-[18px] ${addedWorkDays?.includes(day) ? 'text-[#FFA842]' : 'text-black'}`}
                                                >
                                                    {day === ' ' ? '-' : day}
                                                </div>))
                                            : <div> -</div>
                                    }
                                </div>
                        }
                    </div>
                </div>
                <div className="w-full flex items-center flex-wrap mt-[30px]">
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Дата выхода</div>
                        {
                            isEdit
                                ? <input className={'w-[150px] border p-1 text-center rounded-[15px] bg-gray-300'} type={'date'}
                                         placeholder="Иванов" {...register("startContract")} />
                                : <div
                                    className={`font-[400] text-[18px] ${cur.startContract !== feature.startContract ? 'text-[#FFA842]' : 'text-black'}`}>{readForm?.startContract || '-'}</div>
                        }
                    </div>
                    <div className="w-[180px] flex flex-col">
                        <div className="font-[400] text-[14px] text-[#00000080]">Дата увольнения</div>
                        {
                            isEdit
                                ? <input className={'w-[150px] border p-1 text-center rounded-[15px] bg-gray-300'} type={'date'}
                                         placeholder="Иванов" {...register("endContract")} />
                                : <div
                                    className={`font-[400] text-[18px] ${cur.endContract !== feature.endContract ? 'text-[#FFA842]' : 'text-black'}`}>{readForm?.endContract || '-'}</div>
                        }
                    </div>
                    <button
                        type={'submit'}
                        className="w-[200px] flex items-center gap-[10px] bg-[#FFA842] py-[10px] px-[16px] rounded-[20px] cursor-pointer">
                        <img src={pencil} alt="pencil" />
                        <div  className="font-[600] text-[18px] text-white">{isEdit ? 'Сохранить' : 'Редактирование'}</div>
                    </button>
                </div>
            </div>
        </form>
    );
};
