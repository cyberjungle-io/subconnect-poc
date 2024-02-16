import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

export const OpacityControl = ({ label, value, onDecrease, onIncrease }) => {
  return (
    <Label>
      <div className="pb-1">
        {label}:
        </div>
      <div className="flex items-center ms-4">
        <button onClick={onDecrease}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <Input
          type="text"
          className="mx-2 text-center w-12"
          value={value || ""}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
              onChange(newValue.toFixed(1));
            }
          }}
        />
        <button onClick={onIncrease}>
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </Label>
  );
};

export const ColorControl = ({ label, value, onChange }) => {
  return (
    <Label>
      <div className="pb-1">
        {label}:
        </div>
      <Input
        type="color"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 cursor-pointer"
      />
    </Label>
  );
};

export const WidthControl = ({ label, value, onDecrease, onIncrease, onChange }) => {
    return (
      <Label>
        <div className="pb-1">
        {label}:
        </div>
        <div className="flex items-center ms-4">
        <button onClick={onDecrease}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <Input
          type="text"
          className="mx-2 text-center w-12"
          value={value || ""}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
              onChange(newValue.toFixed(1));
            }
          }}
        />
        <button onClick={onIncrease}>
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      </Label>
    );
  };

  export const RadiusControl = ({ label, value, onDecrease, onIncrease, onChange}) => {
    return (
      <Label>
        <div className="pb-1">
        {label}:
        </div>
        <div className="flex items-center ms-4">
        <button onClick={onDecrease}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <Input
          type="text"
          className="mx-2 text-center w-12"
          value={value || ""}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
              onChange(newValue.toFixed(1));
            }
          }}
        />
        <button onClick={onIncrease}>
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      </Label>
    );
  };
  export const BorderStyleSelect = ({ updateTooltipProperty }) => {
    return (
      <Label className="ml-4">
        Style:
        <Select
          onValueChange={(value) =>
            updateTooltipProperty("borderStyle", value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a border style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Border Styles</SelectLabel>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
    );
  };
  export const FontSizeControl = ({ label, value, onDecrease, onIncrease, onChange }) => {
    return (
      <Label>
        <div className="pb-1">
          {label}:
        </div>
        <div className="flex items-center ms-4">
          <button onClick={onDecrease}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <Input
          type="text"
          className="mx-2 text-center w-12"
          value={value || ""}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
              onChange(newValue.toFixed(1));
            }
          }}
        />
          <button onClick={onIncrease}>
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </Label>
    );
  };