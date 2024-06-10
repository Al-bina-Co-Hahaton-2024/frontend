import eye from '../../../../../assets/eye.svg';
import cross_line from '../../../../../assets/cross_line.svg'
import arrow_down from '../../../../../assets/arrow_down.svg'
import {CurrentChanges} from "./current-changes";
import {EditableChanges} from "./editable-changes";
import {useAppDispatch, useAppSelector} from "../../../../../store/hooks/storeHooks";
import {
    useApproveByManagerMutation, useDeclineByManagerMutation,
    useGetApprovedDoctorCardQuery, useGetDoctorChangesQuery,
    useGetDoctorsByIdsMutation, useGetFioDocsByIdMutation,
    useLazyGetApprovedDoctorCardQuery, useLazyGetDoctorsQuery
} from "../../../../../store/api/doctors/doctorsApi";
import {useEffect, useState} from "react";
import {setApprovalCardState} from "../../../../../store/reducers/serviceSlice";

export const ApproovalCard = () => {

    const dispatch = useAppDispatch()
    const docId = useAppSelector((state) => state.serviceSlice.docId)
    const reqId = useAppSelector((state) => state.serviceSlice.reqId)

    const [revalidate] = useLazyGetDoctorsQuery()

    const [getDoctor] = useGetDoctorsByIdsMutation()
    const [approovedDoctor] = useLazyGetApprovedDoctorCardQuery()
    const [getDocFio] = useGetFioDocsByIdMutation()

    const [approve] = useApproveByManagerMutation()
    const [decline] = useDeclineByManagerMutation()

    const [fio, setFio] = useState<any>(null)
    const [aprrovedData, setApprovedData] = useState<any>(null)
    const [doc, setDoc] = useState<any>(null)

    useEffect(() => {
        if (docId) {
            getDoctor([docId])
                .unwrap()
                .then(res => {
                    setDoc(res)
                })
            approovedDoctor(docId)
                .unwrap()
                .then(res => {
                    setApprovedData(res)
                })
            getDocFio([docId])
                .unwrap()
                .then(res => {
                    setFio(res)
                })
        }
    }, [docId]);

    if (!fio || !aprrovedData || !doc) return null

    return (
        <div
            className={'z-10 flex flex-col fixed right-0 top-0 w-[670px] h-screen bg-white rounded-tl-[20px] rounded-bl-[20px]'}>

            <div
                className={'w-full h-[110px] flex justify-between items-center bg-[#FFA842] rounded-tl-[20px] py-[33px] px-[45px]'}>

                <div className={'flex gap-[15px]'}>

                    <div className={'translate-y-3'}>
                        <img src={eye} alt={'eye'}/>
                    </div>

                    <div className={'flex flex-col '}>
                        <div className={'font-[700] text-[24px] text-white'}>Просмтр заявки</div>
                        <div className={'flex items-center gap-[10px] font-[400] text-[18px] text-white'}>
                            <div className={'flex gap-[2px] items-center'}>
                                {/*<img src={clock} alt={'clock'}/>*/}
                                <span>14:38</span>
                            </div>
                            <div className={'opacity-50'}>|</div>
                            <div>22.06.2024</div>
                            <div className={'opacity-50'}>|</div>
                            <div>Кадровое отделение</div>
                        </div>
                    </div>


                </div>

                <div onClick={() => {
                    dispatch(setApprovalCardState({isOpen: false, docId: null, reqId: null}))
                }} className={'cursor-pointer'}>
                    <img src={cross_line} alt={'exit'}/>
                </div>

            </div>

            <CurrentChanges fioData={fio} docData={doc} />
            <img className={' flex justify-center items-center w-full h-[45px] mt-[20px]'} src={arrow_down} alt={'arrow_down'} />
            <EditableChanges current={doc} feature={aprrovedData} />

            <div className={'mt-[40px] w-full flex items-center mx-[25px] gap-5'}>
                <div onClick={() => {
                    approve(reqId).unwrap().then(() => {
                        dispatch(setApprovalCardState({isOpen: false, docId: null}))
                        revalidate(0)
                    })
                }} className={'w-[50%] text-center font-[700] text-[18px] bg-[#FFA842] rounded-[40px] text-white py-[15px] cursor-pointer'}>
                    Согласовтаь изменения
                </div>
                <div onClick={() => {
                    decline(reqId).unwrap().then(() => {
                        dispatch(setApprovalCardState({isOpen: false, docId: null}))
                        revalidate(0)
                    })
                }} className={'w-[35%] text-center font-[700] text-[18px] bg-[#D9E2E8] rounded-[40px] text-black py-[15px] cursor-pointer'}>
                    Отклонить заявку
                </div>
            </div>


        </div>
    )
}