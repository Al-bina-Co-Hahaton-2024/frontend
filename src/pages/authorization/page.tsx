import React, {useState} from 'react';
import {useAuthUserMutation} from "../../store/api/auth/authApi";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

export const AuthorizationPage: React.FC = () => {

    const [loading, setLoading] = useState(false)
    const [authTrigger] = useAuthUserMutation()
    const navigate = useNavigate()

    const handleButtonClick = (type: string) => {
        setLoading(true)
        authTrigger({
            login: 'admin',
            password: 'admin'
        })
            .unwrap()
            .then((res) => {
                localStorage.setItem('role',type )
                Cookies.set('accessToken', res.token)
                Cookies.set('expired', res.expired)
                if (type === 'hr') {
                    navigate('/employees')
                }
                if (type === 'manager') {
                    navigate('/analytics')
                }
                if (type === 'doc') {
                    navigate('/404')
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Авторизация</h2>
                <div className={`space-y-4 ${loading && 'opacity-30'}`}>
                    <button
                        onClick={() => handleButtonClick('doc')}
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                        Войти как врач
                    </button>
                    <button
                        onClick={() => handleButtonClick('hr')}
                        className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                    >
                        Войти как сотрудник кадров
                    </button>
                    <button
                        onClick={() => handleButtonClick('manager')}
                        className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                    >
                        Войти как менеджер
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthorizationPage;
