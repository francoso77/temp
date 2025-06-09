import React from 'react';
import FinancialChart from '../../Views/Dashboard/FinancialChart';
import { DataPoint } from '../../types/graficoTypes';

const OverviewComponent = ({ title, data }: { title: string, data: DataPoint[] }) => {
    return <div style={{ color: '#fff' }}>
        <FinancialChart
            title={title}
            data={data}
            local='Visao'
        />
    </div>;
};

export default OverviewComponent;