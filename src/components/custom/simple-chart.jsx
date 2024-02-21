
import React from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"; // replace with your actual import

const SimpleChart = ({ chart }) => {
    console.log(chart);
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
              result[3],
              16
            )}`
          : null;
      };
  return (
    
    <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>
              <div
                className="w-1/2"
                style={{
                  color: chart.form.title.color,
                  fontSize: `${chart.form.title.fontSize}px`,
                }}
              >
                {chart.form.title.text ? chart.form.title.text : "Title"}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart width={500} height={300} data={chart.data}>
                {chart.form.chart.showXAxis && (
                  <XAxis
                    dataKey="updatedTime"
                    label={chart.form.chart.xAxisLabel}
                    tick={{ fontSize: chart.form.axis.xAxisFontSize }}
                  />
                )}
                {chart.form.chart.showYAxis && (
                  <YAxis
                    label={chart.form.chart.yAxisLabel}
                    tick={{ fontSize: chart.form.axis.yAxisFontSize }}
                  />
                )}
                <Tooltip
                  contentStyle={{
                    display: chart.form.tooltip.show ? "block" : "none",
                    color: `rgba(${hexToRgb(chart.form.tooltip.color)}, ${
                      chart.form.tooltip.textOpacity
                    })`,
                    backgroundColor: `rgba(${hexToRgb(
                      chart.form.tooltip.backgroundColor
                    )}, ${chart.form.tooltip.backgroundOpacity})`,
                    borderRadius: `${chart.form.tooltip.borderRadius}px`,
                    border: `${chart.form.tooltip.borderWidth}px ${
                      chart.form.tooltip.borderStyle
                    } rgba(${hexToRgb(chart.form.tooltip.borderColor)}, ${
                      chart.form.tooltip.borderOpacity
                    })`,
                    fontSize: `${chart.form.tooltip.titlefontsize}px`, // Add this line
                  }}
                />
                {chart.form.chart.CartesianGrid && <CartesianGrid stroke="#f5f5f5" />}
                <Legend />
                {chart.elements.map((element, index) => {
                  const ChartComponent = element.type === "Bar" ? Bar : Line;
                  return (
                    <ChartComponent
                      key={index}
                      dataKey={element.dataKey}
                      fill={element.color}
                      fillOpacity={element.opacity}
                    />
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  );
};

export default SimpleChart;
