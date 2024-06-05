import {
    useGetDoctorsQuery,
    useGetFioDocsByIdMutation,
    useGetIdByFioElasticMutation
} from "../../store/api/doctors/doctorsApi";
import {ChangeEvent, useEffect, useState} from "react";
import {IDoctor} from "../../store/api/doctors/types";


export const EmployeesPage = () => {

    //states
    const [ids, setIds] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0)
    const [doctors, setDoctors] = useState<any>([])
    // API actions
    const {data: doctorsData, isSuccess, isError} = useGetDoctorsQuery({page: page, userIds: ids})
    const [getFioTrigger] = useGetFioDocsByIdMutation()
    const [getIdsByFioTrigger] = useGetIdByFioElasticMutation()

    useEffect(() => {
        if (isSuccess) {
            const ids = doctorsData.content.map((doc: IDoctor) => doc.id)
            getFioTrigger(ids)
                .unwrap()
                .then((result) => {
                    const transformed = doctorsData.content.map((doc: IDoctor) => {
                        const fioObject = result.find(el => el.id === doc.id)
                        return {
                            ...doc,
                            ...fioObject
                        }
                    })
                    setDoctors(transformed)
                })
        }
    },[doctorsData, isSuccess])

    useEffect(() => {
            const handler = setTimeout(() => {
                getIdsByFioTrigger({
                    fullName: searchTerm
                })
                    .unwrap()
                    .then((res) => {
                        setIds(res)
                        setPage(0);
                    })
            }, 2000);

            // очищаем таймаут, если searchTerm изменится до завершения таймаута
            return () => {
                clearTimeout(handler);
            };
    }, [searchTerm]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    console.log(doctors)

    return(
        <div>
            <input className={'border m-2 p-2 border-black rounded'} placeholder={'Search....'} type="text" value={searchTerm} onChange={handleInputChange}/>
            Employees
            {
                doctors.length !== 0 && doctors.map((el: IDoctor & any) => {
                    return(
                        <div className={'w-full rounded bg-sky-400 text-white p-2'}>
                            Name {el.fullName.first}-------
                            rate {el.rate}---- Modality {el.modality}-----Optional {el.optionalModality}
                        </div>
                    )
                })
            }
        </div>
    )
}