import Main from './component/Main';
import PlayList from './component/PlayList';
import PlayDetail from './component/PlayDetail';
import BoardList from './component/BoardList';
import BoardDetail from './component/BoardDetail';
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';

function App() {
  return (
	<div className="App"> 
    <BrowserRouter> 
       <Routes>  
        <Route path="/" element={<Main/>} >  </Route>
        <Route path="/board" element={<BoardList/>}>  </Route> 
        <Route path="/board/:id" element={<BoardDetail/>}>  </Route> 
        <Route path="/playlist" element={<PlayList/>}>  </Route> 
        <Route path="/playlist/:id" element={<PlayDetail/>}>  </Route> 
       </Routes>
    </BrowserRouter> 
	</div>
  );
}

export default App;
