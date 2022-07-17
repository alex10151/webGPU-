import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
const dom = document.getElementById('root');
if (dom) {
  ReactDOM.createRoot(dom).render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>
  );
}
