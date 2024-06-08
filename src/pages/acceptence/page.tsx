import {useState} from "react";
import {HrDep} from "./components/hr-dep/hr-dep";
import {DocDep} from "./components/doc-dep/doc-dep";


export const AcceptanceUsersPage = () => {

    const [docPage, setDocPage] = useState(0)

    return(
        <div className={'mt-[20px] w-[1450px] mx-auto flex flex-col items-center h-[95%] relative'}>
            <div className={'absolute w-full h-full bg-white bg-opacity-30 rounded-[20px] shadow-lg'}></div>
            <div className={'w-full my-[30px] px-[65px] h-full flex flex-col z-10'}>

              <HrDep />
                <div className={'bg-[#00000026] w-full h-[1px] my-[20px]'}></div>
              <DocDep />

            </div>
        </div>
    )
}