"use client";

import { useState } from "react";
import classNames from "classnames";

const SpecialFareSelector = () => {
  const [selected, setSelected] = useState("Student");

  const options = [
    { id: "Regular", label: "Regular", subLabel: "Regular fares" },
    { id: "Student", label: "Student", subLabel: "Extra discounts/baggage" },
  ];

  const handleSelect = (option) => {
    setSelected(option);
  };

  return (
    <div className="max-w-lg space-y-2 mx-auto pt-4">
      <div className="flex items-center justify-evenly">
        <div className="flex flex-col">
          <p className="text-md font-bold text-black">Select a special fare</p>
          <span className="px-2 py-0.5 mt-1 text-sm font-bold text-white bg-gradient-to-r from-green-400 to-teal-500 rounded">
            EXTRA SAVINGS
          </span>
        </div>
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={classNames(
              "relative group cursor-pointer flex items-center px-4 py-2 rounded-md border transition-all duration-300 ml-2",
              selected === option.id
                ? "bg-blue-50 border-blue-400"
                : "bg-white border-gray-300"
            )}
          >
            <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded-full">
              <div
                className={classNames(
                  "w-3 h-3 rounded-full transition-transform duration-300",
                  selected === option.id ? "bg-blue-500 scale-100" : "scale-0"
                )}
              ></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-700">{option.label}</p>
              <p className="text-xs text-gray-500">{option.subLabel}</p>
            </div>

            {/* Hover Tooltip for "Student" */}
            {option.id === "Student" && (
              <div className="absolute left-0 top-full z-10 mt-2 w-[250px] hidden group-hover:block bg-gray-800 text-white text-xs font-medium p-3 rounded shadow-lg">
                Applicable only for students above 12 years of age. Valid
                student ID cards and student visas (where applicable) are
                required to avail this.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialFareSelector;
