"use client";
import React, { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import {
  OpacityControl,
  ColorControl,
  WidthControl,
  RadiusControl,
  BorderStyleSelect,
  FontSizeControl,
} from "@/components/custom/controls";

const ChartEditor = () => {
  // Add state for the form
  const [form, setForm] = useState({
    title: {
      text: "",
      color: "#000000",
      fontSize: 20,
    },
    chart: {
      CartesianGrid: true,
      showXAxis: true,
      showYAxis: true,
    },
    tooltip: {
      show: true,
      color: "#000000",
      backgroundColor: "#ffffff",
      backgroundOpacity: 1,
      textOpacity: 1,
      borderRadius: 1, // Store as number
      borderColor: "#000000",
      borderStyle: "solid",
      borderWidth: 1, // Store as number
      borderOpacity: 1,
      titlefontsize: 20,
    },
    axis: {
      XAxisLabel: "",
      YAxisLabel: "",
      xAxisColor: "#000000",
      yAxisColor: "#000000",
      xAxisFontSize: 20,
      yAxisFontSize: 20,
      xAxisOrientation: "bottom",
      yAxisOrientation: "left",
    },
  });

  // Add state for the chart elements
  const [elements, setElements] = useState([
    {
      isEditingTitle: false,
      type: "",
      color: "",
      dataKey: "",
      opacity: 1,
      seriesText: "New Series",
    },
  ]);

  // Add a handler for the button click
  const handleAddElement = () => {
    // Add a new element with default properties
    setElements([
      ...elements,
      {
        type: "",
        color: "",
        dataKey: "",
        opacity: 1,
        seriesText: "New Series",
      },
    ]);
  };

  // Render the chart elements
  const renderChartElements = () => {
    return elements.map((element, index) => {
      const ChartComponent = element.type === "Bar" ? Bar : Line;
      return (
        <ChartComponent
          key={index}
          dataKey={element.dataKey}
          fill={element.color}
        />
      );
    });
  };
  // Add a handler for the element inputs
  const handleElementChange = (index, property) => (e) => {
    const newElements = [...elements];
    newElements[index][property] = e.target.value;
    setElements(newElements);
  };
  const handleSelectChange = (index, property) => (value) => {
    const newElements = [...elements];
    newElements[index][property] = value;
    setElements(newElements);
  };

  const lastElement = elements[elements.length - 1];
  const ChartComponent = lastElement.type === "Bar" ? Bar : Line;

  const handleInputChange = (name, property, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: {
        ...prevForm[name],
        [property]: value,
      },
    }));
  };
  const handleOpacityChange = (index, newOpacity) => {
    setElements((prevElements) =>
      prevElements.map((el, i) =>
        i === index ? { ...el, opacity: newOpacity } : el
      )
    );
  };
  // Handle the edit title button click
  const handleEditTitle = (index) => {
    setElements(
      elements.map((element, idx) => {
        if (idx === index) {
          return { ...element, isEditingTitle: !element.isEditingTitle };
        }
        return element;
      })
    );
  };
  const handleTitleChange = (index, field, value) => {
    const newElements = [...elements];
    newElements[index][field] = value;
    setElements(newElements);
  };
  const handleDeleteElement = (index) => {
    setElements(elements.filter((_, idx) => idx !== index));
  };
  const handleToggleElement = (element) => {
    setForm({
      ...form,
      chart: {
        ...form.chart,
        [element]: !form.chart[element],
      },
    });
  };
  function updateTooltipProperty(property, value) {
    setForm((prevForm) => ({
      ...prevForm,
      tooltip: {
        ...prevForm.tooltip,
        [property]: value,
      },
    }));
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : null;
  }
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  // Render the chart elements and their customization sections
  const renderElements = () => {
    return elements.map((element, index) => {
      return (
        <div key={index}>
          <div className="flex space-x-5">
            {element.isEditingTitle ? (
              <Input
                type="text"
                value={element.seriesText}
                onChange={handleElementChange(index, "seriesText")}
                className="font-bold py-2 w-80"
              />
            ) : (
              <h3 className="font-bold py-2">
                {element.seriesText === "New Series"
                  ? `${element.seriesText} ${index + 1}`
                  : element.seriesText}
              </h3>
            )}
            <button onClick={() => handleEditTitle(index)}>
              {element.isEditingTitle ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex space-x-5 ">
            <div className="flex flex-col space-y-1">
              <Label>Chart Type:</Label>
              <Select onValueChange={handleSelectChange(index, "type")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Line">Line</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Color:</Label>
              <Input
                type="color"
                className="w-15"
                value={element.color}
                onChange={handleElementChange(index, "color")}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Data Key:</Label>
              <Input
                className="w-80"
                type="text"
                value={element.dataKey}
                onChange={handleElementChange(index, "dataKey")}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Opacity:</Label>
              <div className="flex items-center ms-4">
                <button
                  onClick={() =>
                    handleOpacityChange(
                      index,
                      Math.max(0, element.opacity - 0.1)
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
                <Input
                  type="text"
                  className="mx-2 text-center w-12"
                  value={
                    element && element.opacity ? element.opacity.toFixed(1) : ""
                  }
                  onChange={(e) => {
                    const newOpacity = parseFloat(e.target.value);
                    if (
                      !isNaN(newOpacity) &&
                      newOpacity >= 0 &&
                      newOpacity <= 1
                    ) {
                      handleOpacityChange(index, newOpacity);
                    }
                  }}
                />
                <button
                  onClick={() =>
                    handleOpacityChange(
                      index,
                      Math.min(1, element.opacity + 0.1)
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
                {elements.length > 1 && (
                  <button
                    onClick={() => handleDeleteElement(index)}
                    className="ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <>
      <section className="w-2/3 mx-auto">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>
              <div
                className="w-1/2"
                style={{
                  color: form.title.color,
                  fontSize: `${form.title.fontSize}px`,
                }}
              >
                {form.title.text ? form.title.text : "Title"}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart width={500} height={300} data={data}>
                {form.chart.showXAxis && (
                  <XAxis
                    dataKey="name"
                    label={form.chart.xAxisLabel}
                    tick={{ fontSize: form.axis.xAxisFontSize }}
                  />
                )}
                {form.chart.showYAxis && (
                  <YAxis
                    label={form.chart.yAxisLabel}
                    tick={{ fontSize: form.axis.yAxisFontSize }}
                  />
                )}
                <Tooltip
                  contentStyle={{
                    display: form.tooltip.show ? "block" : "none",
                    color: `rgba(${hexToRgb(form.tooltip.color)}, ${
                      form.tooltip.textOpacity
                    })`,
                    backgroundColor: `rgba(${hexToRgb(
                      form.tooltip.backgroundColor
                    )}, ${form.tooltip.backgroundOpacity})`,
                    borderRadius: `${form.tooltip.borderRadius}px`,
                    border: `${form.tooltip.borderWidth}px ${
                      form.tooltip.borderStyle
                    } rgba(${hexToRgb(form.tooltip.borderColor)}, ${
                      form.tooltip.borderOpacity
                    })`,
                    fontSize: `${form.tooltip.titlefontsize}px`, // Add this line
                  }}
                />
                {form.chart.CartesianGrid && <CartesianGrid stroke="#f5f5f5" />}
                <Legend />
                {elements.map((element, index) => {
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
      </section>
      <section className="m-10 space-y-4">
        <h3>Title</h3>
        <div>
          <Input
            name="title"
            placeholder="Title"
            value={form.title.text}
            onChange={(e) => handleInputChange("title", "text", e.target.value)}
            className="w-80 me-4"
          />
          <div className="space-x-3 my-2">
            <Toggle onClick={() => handleToggleElement("CartesianGrid")}>
              {form.chart.CartesianGrid ? "Remove Grid" : "Add Grid"}
            </Toggle>
            <Toggle onClick={() => handleToggleElement("showXAxis")}>
              {form.chart.showXAxis ? "Hide X Axis" : "Show X Axis"}
            </Toggle>

            <Toggle onClick={() => handleToggleElement("showYAxis")}>
              {form.chart.showYAxis ? "Hide Y Axis" : "Show Y Axis"}
            </Toggle>
            <button
              onClick={() => updateTooltipProperty("show", !form.tooltip.show)}
              className="btn btn-primary"
            >
              {form.tooltip.show ? "Hide Tooltip" : "Show Tooltip"}
            </button>

            {form.tooltip.show && (
              <div className="flex">
                <div className="flex flex-col space-x-10">
                  <h3>Title</h3>
                  <div className="flex space-x-2">
                    <ColorControl
                      label="Color"
                      value={form.tooltip.color}
                      onChange={(newValue) =>
                        updateTooltipProperty("color", newValue)
                      }
                    />

                    <Label>
                      <div className="flex items-center ms-4">
                        <OpacityControl
                          label="Opacity"
                          value={form.tooltip.textOpacity}
                          onDecrease={() =>
                            updateTooltipProperty(
                              "textOpacity",
                              Math.max(
                                0,
                                parseFloat(form.tooltip.textOpacity) - 0.1
                              ).toFixed(1)
                            )
                          }
                          onIncrease={() =>
                            updateTooltipProperty(
                              "textOpacity",
                              Math.min(
                                1,
                                parseFloat(form.tooltip.textOpacity) + 0.1
                              ).toFixed(1)
                            )
                          }
                        />
                      </div>
                    </Label>
                    <FontSizeControl
                      label="Font Size"
                      value={form.tooltip.titlefontsize}
                      onChange={(newValue) =>
                        updateTooltipProperty("titlefontsize", newValue)
                      }
                      onDecrease={() =>
                        updateTooltipProperty(
                          "titlefontsize",
                          Math.max(0, form.tooltip.titlefontsize - 1)
                        )
                      }
                      onIncrease={() =>
                        updateTooltipProperty(
                          "titlefontsize",
                          form.tooltip.titlefontsize + 1
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col space-x-10">
                  <h3>Background</h3>
                  <div className="flex">
                    <ColorControl
                      label="Color"
                      value={form.tooltip.backgroundColor}
                      onChange={(newValue) =>
                        updateTooltipProperty("backgroundColor", newValue)
                      }
                    />

                    <OpacityControl
                      label="Opacity"
                      value={form.tooltip.backgroundOpacity}
                      onDecrease={() =>
                        updateTooltipProperty(
                          "backgroundOpacity",
                          Math.max(
                            0,
                            parseFloat(form.tooltip.backgroundOpacity) - 0.1
                          ).toFixed(1)
                        )
                      }
                      onIncrease={() =>
                        updateTooltipProperty(
                          "backgroundOpacity",
                          Math.min(
                            1,
                            parseFloat(form.tooltip.backgroundOpacity) + 0.1
                          ).toFixed(1)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col space-x-10 ">
                  <h3>Border</h3>
                  <div className="flex">
                    <ColorControl
                      label="Color"
                      value={form.tooltip.borderColor}
                      onChange={(newValue) =>
                        updateTooltipProperty("borderColor", newValue)
                      }
                    />
                    <OpacityControl
                      label="Opacity"
                      value={form.tooltip.borderOpacity}
                      onDecrease={() =>
                        updateTooltipProperty(
                          "borderOpacity",
                          Math.max(
                            0,
                            parseFloat(form.tooltip.borderOpacity) - 0.1
                          ).toFixed(1)
                        )
                      }
                      onIncrease={() =>
                        updateTooltipProperty(
                          "borderOpacity",
                          Math.min(
                            1,
                            parseFloat(form.tooltip.borderOpacity) + 0.1
                          ).toFixed(1)
                        )
                      }
                    />
                    <BorderStyleSelect
                      updateTooltipProperty={updateTooltipProperty}
                    />
                    <div className="flex flex-col">
                      <WidthControl
                        label="Width"
                        value={form.tooltip.borderWidth}
                        onDecrease={() =>
                          updateTooltipProperty(
                            "borderWidth",
                            Math.max(
                              0,
                              parseFloat(form.tooltip.borderWidth) - 0.5
                            ).toFixed(1)
                          )
                        }
                        onIncrease={() =>
                          updateTooltipProperty(
                            "borderWidth",
                            (
                              parseFloat(form.tooltip.borderWidth) + 0.5
                            ).toFixed(1)
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <RadiusControl
                        label="Radius"
                        value={form.tooltip.borderRadius}
                        onDecrease={() =>
                          updateTooltipProperty(
                            "borderRadius",
                            Math.max(
                              0,
                              parseFloat(form.tooltip.borderRadius) - 0.5
                            ).toFixed(1)
                          )
                        }
                        onIncrease={() =>
                          updateTooltipProperty(
                            "borderRadius",
                            (
                              parseFloat(form.tooltip.borderRadius) + 0.5
                            ).toFixed(1)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
              
          </div>
        </div>
        {renderElements()}
        <Button variant="outline" onClick={handleAddElement}>
          Add Series
        </Button>
      </section>
    </>
  );
};

export default ChartEditor;
