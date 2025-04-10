import { Radio } from "antd";
import { CheckboxOptionType } from "antd/es/checkbox";
import React from "react";
import { getSortedBySelector, setSortedBy } from "../../store/optionsSlice";
import { SortType } from "../../types/SortedOptions";
import { useAppDispatch, useAppSelector } from "../../utils/store/redux";
import { applyFilters } from "../../store/ticketsSlice";

const options: Array<CheckboxOptionType<SortType>> = [
  {
    label: "Самый дешевый",
    value: "cheap",
  },
  {
    label: "Самый быстрый",
    value: "fast",
  },
  {
    label: "Оптимальный",
    value: "optimal",
  },
];

const SortedOptions = () => {
  const dispatch = useAppDispatch();
  const defaultValue = useAppSelector(getSortedBySelector);

  return (
    <Radio.Group
      block
      defaultValue={defaultValue}
      options={options}
      optionType="button"
      buttonStyle="solid"
      style={{
        whiteSpace: "nowrap",
        width: "100%",
        textTransform: "uppercase",
      }}
      onChange={(e) => {
        dispatch(setSortedBy(e.target.value));
        dispatch(applyFilters());
      }}
    />
  );
};

export default SortedOptions;
