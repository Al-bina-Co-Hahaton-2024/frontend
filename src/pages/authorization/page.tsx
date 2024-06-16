import React, { useState } from 'react';
import { useAuthUserMutation } from '../../store/api/auth/authApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/another_logo.svg';

export const AuthorizationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [authTrigger] = useAuthUserMutation();
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const passwords = [
    {
      type: 'manager',
      login: 'admin',
      password: 'admin',
    },
    {
      type: 'hr',
      login: 'hr',
      password: 'admin',
    },
    {
      type: 'doc',
      login: 'demo150',
      password: 'admin',
    },
  ];

  const handleLogin = () => {
    setLoading(true);
    authTrigger({
      login: login,
      password: password,
    })
      .unwrap()
      .then((res) => {
        const role = res.roles[0];
        localStorage.setItem('role', role);
        Cookies.set('accessToken', res.token);
        Cookies.set('expired', res.expired);
        if (role === 'HR') {
          navigate('/employees');
        }
        if (role === 'HEAD_DEPARTMENT') {
          navigate('/analytics');
        }
        if (role === 'DOCTOR') {
          navigate('/lk');
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleButtonClick = (type: string) => {
    const credentials =
      passwords[passwords.findIndex((password) => password.type === type)];

    setLogin(credentials.login);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gradient">
      <div className={'flex flex-col items-center'}>
        <div className={'bg-white py-[30px] px-[60px] rounded-[20px] w-full'}>
          <img src={logo} alt={'logo'} />
        </div>
        <div
          className={
            'bg-white mt-[20px] px-[60px] py-[30px] bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-8 w-full'
          }
        >
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Логин
            </label>
            <input
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              id="username"
              type="text"
              placeholder="Введите логин..."
              className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Пароль
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              id="password"
              type="password"
              placeholder="Введите пароль..."
              className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
          </div>
          <div className={'flex gap-[10px] items-center'}>
            <button
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-black h-[60px]  text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Войти
            </button>
          </div>
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <hr />
          <div className={'flex gap-[10px] items-center'}>
            <button
              onClick={() => handleButtonClick('doc')}
              className="w-full py-2 px-4 bg-black h-[60px]  text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Войти как врач
            </button>
            <button
              onClick={() => handleButtonClick('hr')}
              className="w-full py-2 px-4  bg-black h-[60px]  text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              Войти как сотрудник кадров
            </button>
            <button
              onClick={() => handleButtonClick('manager')}
              className="w-full py-2 px-4 bg-black h-[60px] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Войти как руководитель
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationPage;
