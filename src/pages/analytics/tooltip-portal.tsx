import ReactDOM from 'react-dom';

export const TooltipPortal = ({ children }) => {
  const tooltipRoot: any = document.getElementById('tooltip-root');
  return ReactDOM.createPortal(children, tooltipRoot);
};
