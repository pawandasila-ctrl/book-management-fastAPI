import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Books from './Books';
import CreateBook from './CreateBook';
import UpdateBook from './UpdateBook';
import Nav from './Nav';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position='top-center' />
      <Nav />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/create" element={<CreateBook />} />
        <Route path="/update" element={<UpdateBook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
