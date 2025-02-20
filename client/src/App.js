import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import MainComponent from './components/MainComponent'; // Assuming you have a main component
import CompletedTodos from './components/completedTodos'; // Assuming you have a main component
import UncompletedTodos from './components/uncompletedTodos'; // Assuming you have a main component

const App = () => {
    return (
        <Provider store={store}>
            <div className="App">
                <MainComponent />
                < CompletedTodos />
                < UncompletedTodos />
            </div>
        </Provider>
    );
};

export default App;