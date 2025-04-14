import { Radio } from "antd";
import { CheckboxOptionType } from "antd/es/checkbox";
import React, { useEffect } from "react";
import { getSortedBySelector, setSortedBy } from "../../store/optionsSlice";
import { applyFilters, ticketsSelector } from "../../store/ticketsSlice";
import { SortType } from "../../types/SortedOptions";
import { useAppDispatch, useAppSelector } from "../../utils/store/redux";

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
  const { originTickets } = useAppSelector(ticketsSelector);

  useEffect(() => {
    dispatch(applyFilters());
  }, [originTickets.length]);

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
