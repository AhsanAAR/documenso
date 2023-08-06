'use client';

import { HTMLAttributes } from 'react';

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { cn } from '@documenso/ui/lib/utils';

import { CAP_TABLE } from './data';

const COLORS = ['#7fd843', '#a2e771', '#c6f2a4'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};
export type CapTableProps = HTMLAttributes<HTMLDivElement>;

export const CapTable = ({ className, ...props }: CapTableProps) => {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <h3 className="px-4 text-lg font-semibold">Cap Table</h3>

      <div className="border-border mt-2.5 flex flex-1 items-center justify-center rounded-2xl border shadow-sm hover:shadow">
        <PieChart width={400} height={400}>
          <Pie
            data={CAP_TABLE}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={180}
            innerRadius={100}
            fill="#8884d8"
            dataKey="percentage"
          >
            {CAP_TABLE.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(percent: number, name, props) => {
              return [`${percent}%`, name || props['name'] || props['payload']['name']];
            }}
          />
        </PieChart>
      </div>
    </div>
  );
};
