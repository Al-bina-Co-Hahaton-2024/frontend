import {SideBar} from "../components/side-bar";


export const AdminLayout = ({children}) => {
    return(
        <div className={'w-full h-screen flex bg-custom-gradient mx-auto relative overflow-x-hidden'}>
            <SideBar />
            {children}
        </div>
    )
}