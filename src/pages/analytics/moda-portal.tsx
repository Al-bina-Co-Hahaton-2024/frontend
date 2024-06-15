import ReactDOM from 'react-dom';

export const ModalPortal = ({ children }) => {
  const modalPortal: any = document.getElementById('modal-root');
  return ReactDOM.createPortal(children, modalPortal);
};
