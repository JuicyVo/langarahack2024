import "./App.css";
import { DragAndDrop } from "./components/DragAndDrop";
import { Loading } from "./components/Loading";

function App() {
  return (
    <div className="App">
      <div>
        <DragAndDrop />
      </div>
      <div>
        <Loading />
      </div>
    </div>
  );
}

export default App;
