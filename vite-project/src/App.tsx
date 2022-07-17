import './App.css';
import Container from './components/container';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

const useRouteDom = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Container />} />
      </Routes>
    </BrowserRouter>
  );
};
function App() {
  const dom = useRouteDom();
  return <div className="container">{dom}</div>;
}

export default App;
