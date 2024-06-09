import {HrDep} from "./components/hr-dep/hr-dep";
import {DocDep} from "./components/doc-dep/doc-dep";
import {ApproovalCard} from "./components/hr-dep/approoval-card/approoval-card";
import {useAppSelector} from "../../store/hooks/storeHooks";


export const AcceptanceUsersPage = () => {

    const isAppCard = useAppSelector((state) => state.serviceSlice.isDocApprovalCardOpen)
    return(
        <div className={'mt-[20px] w-[1450px] mx-auto flex flex-col items-center h-[95%] relative'}>
            <div className={'absolute w-full h-full bg-white bg-opacity-30 rounded-[20px] shadow-lg'}></div>
            <div className={'w-full my-[30px] px-[65px] h-full flex flex-col z-10'}>

              <HrDep />
                <div className={'bg-[#00000026] w-full h-[1px] my-[20px]'}></div>
              <DocDep />


            </div>

            {isAppCard && <ApproovalCard /> }

        </div>
    )
}