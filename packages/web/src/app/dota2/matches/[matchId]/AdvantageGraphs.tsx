import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdvantageGraphsProps {
  goldAdvantageData: any[];
  xpAdvantageData: any[];
}

const AdvantageGraphs: FC<AdvantageGraphsProps> = ({ goldAdvantageData, xpAdvantageData }) => {
  return (
    <div className="bg-black/20 backdrop-blur-lg border border-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-4 text-cyan-400">Gráficos de Ventaja (Oro/XP)</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-2 text-blue-300">Ventaja de Oro</h3>
        <ResponsiveContainer key="gold-advantage-chart" width="100%" height={300}>
          <LineChart data={goldAdvantageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="minute" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="goldAdv" stroke="#f6e05e" name="Ventaja de Oro" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2 text-blue-300">Ventaja de Experiencia</h3>
        <ResponsiveContainer key="xp-advantage-chart" width="100%" height={300}>
          <LineChart data={xpAdvantageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="minute" stroke="#cbd5e0" />
            <YAxis stroke="#cbd5e0" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="xpAdv" stroke="#82ca9d" name="Ventaja de Experiencia" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvantageGraphs;
