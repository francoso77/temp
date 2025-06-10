import React from 'react';
import FinancialChart from '../../Views/Dashboard/FinancialChart';
import { DataPoint } from '../../types/graficoTypes';

const OverviewComponent = ({ data }: { data: DataPoint[] }) => {
    return <div style={{ color: '#fff' }}>
        <FinancialChart
            data={data}
        />
    </div>;
};

export default OverviewComponent;