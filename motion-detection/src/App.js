import "bootstrap/dist/css/bootstrap.min.css";
import { OpenCvProvider } from "opencv-react";
import { Detector } from './components/detector';

function App() {
  return (
    <OpenCvProvider>
      <Detector />
    </OpenCvProvider>
  )
}

export default App;
