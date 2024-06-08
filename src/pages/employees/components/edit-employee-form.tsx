import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {usePatchDoctorByIdMutation, useToApproveDoctorChangesMutation} from "../../../store/api/doctors/doctorsApi";
import {MultiSelect} from "react-multi-select-component";
import {_DAYS_OF_WEEKS, _MEDICAL_MODALITIES} from "../../../constants/constants";

export const EditEmployeeForm = ({ person, onFormSubmit }) => {
    const [editDoctor] = usePatchDoctorByIdMutation()
    const [approveToManager] = useToApproveDoctorChangesMutation()
    const [selectedModality, setSelectedModality] = useState(_MEDICAL_MODALITIES[person.modality] || '');

    const modalities = ["РГ", "МРТ", "КТ", "ММГ", "Денситометр"];
    const additionalModalities = ["РГ", "МРТ", "КТ", "ММГ", "Денситометр", "ФЛГ"];

    // Обработчик изменения модальности
    const handleModalityChange = (event) => {
        setSelectedModality(event.target.value);
    };
    const { register, handleSubmit,control, setValue, formState: { errors } } = useForm();


    useEffect(() => {
        if (person) {
            setValue("lastName", person.fullName.last);
            setValue("middleName", person.fullName.middle);
            setValue("firstName", person.fullName.first);
            setValue("dateOfExit", person.startContract);
            setValue("rate", person.rate);
            setValue("startTime", person.startContract);
            setValue("workTime", `${person.hours}`);
            setValue("workPreference", person?.workDays?.map(day => ({ value: day, label: _DAYS_OF_WEEKS.find(d => d.value === day)?.label })));
            setValue("modality", _MEDICAL_MODALITIES[person.modality]);
            person.optionalModality?.forEach((modality) => {
                setValue(`additionalModality.${_MEDICAL_MODALITIES[modality]}`, true);
            });
        }
    }, [person, setValue]);

    const onSubmit = (data) => {

        const firstObject = {
            fullName: {
                first: data.firstName,
                last: data.lastName,
                middle: data.middleName,
            }
        }

        const optModality: string[] = []
        let convertedModality = ''
        const optionalModality = Object.entries(data.additionalModality).filter(([k,v]) => v).map(([k,v]) => k);
        const k = Object.keys(_MEDICAL_MODALITIES)
        for (const key of k) {
            if (_MEDICAL_MODALITIES[key] === data.modality) {
                convertedModality = key
            }
            for (const t of optionalModality) {
                if (_MEDICAL_MODALITIES[key] === t) {
                    optModality.push(key)
                }
            }
        }

        editDoctor({
            body: firstObject,
            id: person.id,
        })
        approveToManager({
            doctorId: person.id,
            rate: data.rate,
            modality: convertedModality,
            optionalModality: optModality,
            startContract: data.dateOfExit,
            endContract: null,
            hours: data.workTime,
            workDays: data.workPreference?.map((el) => el?.value) ? data.workPreference?.map((el) => el?.value) : null,
        })
        .unwrap()
        .then(() => {
            onFormSubmit()
        })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 max-w-4xl overflow-y-scroll">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Фамилия <span className="text-red-500">*</span></label>
                    <input placeholder="Иванов" {...register("lastName", {required: true})}
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    {errors.lastName && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Отчество</label>
                    <input placeholder="Иванович" {...register("middleName")}
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Имя <span
                        className="text-red-500">*</span></label>
                    <input placeholder="Иван" {...register("firstName", {required: true})}
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    {errors.firstName && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                </div>
                <div className="flex gap-5">
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Дата выхода <span
                            className="text-red-500">*</span></label>
                        <input {...register("dateOfExit", {required: true})} type="date"
                               className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                        {errors.dateOfExit && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                    </div>
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Ставка <span
                            className="text-red-500">*</span></label>
                        <input {...register("rate", {required: true})} type="number" step="0.01"
                               className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                        {errors.rate && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                    </div>
                </div>
                <div className="flex gap-5">
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Начало работы</label>
                        <input {...register("startTime",)} type="time"
                               className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    </div>
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Время работы</label>
                        <select {...register("workTime",)}
                                className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            <option value="" disabled>Выберите время работы</option>
                            <option value="4">4 ч.</option>
                            <option value="5">5 ч.</option>
                            <option value="6">6 ч.</option>
                            <option value="7">7 ч.</option>
                            <option value="8">8 ч.</option>
                            <option value="9">9 ч.</option>
                            <option value="10">10 ч.</option>
                            <option value="11">11 ч.</option>
                            <option value="12">12 ч.</option>
                        </select>
                        {errors.workTime && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                    </div>
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Предпочтения в рабочих днях</label>
                    <Controller
                        name="workPreference"
                        control={control}
                        render={({field: {onChange, value, ref, onBlur, name}}) => {

                            return (
                                <MultiSelect
                                    options={_DAYS_OF_WEEKS}
                                    value={value || []}
                                    onChange={onChange}
                                    labelledBy="Select"
                                />
                            );
                        }}
                    />
                </div>

            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Модальность <span
                        className="text-red-500">*</span></label>
                    <div className="space-y-2 border rounded-lg p-4">
                        {modalities.map((modality, index) => (
                            <div key={index}>
                                <input {...register("modality", { required: true })} type="radio"
                                       onChange={handleModalityChange}
                                       value={modality}
                                       className="mr-2 leading-tight" checked={selectedModality === modality}/>
                                <span className="text-gray-700">{modality}</span>
                            </div>
                        ))}
                        {errors.modality && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                    </div>
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Доп. модальности</label>
                    <div className="space-y-2 border rounded-lg p-4">
                        {additionalModalities.map((modality, index) => (
                            <div key={index}>
                                <input {...register(`additionalModality.${modality}`)} type="checkbox" value={modality}
                                       className="mr-2 leading-tight" disabled={selectedModality === modality}
                                       />
                                <span className="text-gray-700">{modality}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-center items-center">
                <button type="submit"
                        className="bg-[#00A3FF] flex items-center justify-center font-[700] text-[18px] text-white px-[25px] py-[24px] rounded-[40px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Отправить
                    изменения на согласование
                </button>
            </div>
        </form>
    );
};