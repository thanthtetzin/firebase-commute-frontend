import './App.css';
import AuthProvider from "../src/Firebase/context";
import Routing from "./Components/Routing";

function App() {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}
export default App;
