import search from "../../../assets/search.svg";
import {ChangeEvent, useEffect, useState} from "react";
import {useGetIdByFioElasticMutation} from "../../../store/api/doctors/doctorsApi";

export const EmployeeSearch = ({setIds, setPage}) => {

    const [searchTerm, setSearchTerm] = useState<any>(null);
    const [getIdsByFioTrigger] = useGetIdByFioElasticMutation()

    useEffect(() => {
        if(searchTerm !== null) {
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
        }
    }, [searchTerm]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    return (
        <div className={'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px]'}>
            <img src={search} alt={'search'}/>
            <input className={'border-none m-0 p-0'} placeholder={'Искать сверхразума...'} type="text" value={searchTerm} onChange={handleInputChange}/>
        </div>
    )
}