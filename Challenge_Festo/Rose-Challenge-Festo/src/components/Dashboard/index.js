import { useState, useEffect } from 'react';
import ActuatorDsnuDisplay from '../ActuatorDsnuDisplay';
import ActuatorDsbcDisplay from '../ActuatorDsbcDisplay';

const Dashboard = () => {
  const [selectedActuator, setSelectedActuator] = useState(null);

  useEffect(() => {
    const choice = localStorage.getItem('selectedActuator');
    setSelectedActuator(choice);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10">
          Simulação em Tempo Real
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectedActuator === 'actuator1' && <ActuatorDsnuDisplay />}
          {selectedActuator === 'actuator2' && <ActuatorDsbcDisplay />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
