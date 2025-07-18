import { Fragment } from 'react/jsx-runtime';
import './App.css';
import InputTodo from './components/InputTodo';
import ListTodos from './components/ListTodos';

function App() {
  return (
    <Fragment>
      <div className="App">
        <InputTodo />
        <ListTodos />
      </div>
    </Fragment>
  );
}

export default App;
