import { Checkbox, CheckboxOptionType, CheckboxProps, Flex } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import { setFilterTransplants } from "../../store/optionsSlice";
import { fetchTickets } from "../../store/ticketsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/redux";
import styles from "./index.module.scss";

const CheckboxGroup = Checkbox.Group;

type PlainType = CheckboxOptionType<number>;

const plainOptions: Array<PlainType> = [
  {
    label: "Без пересадок",
    value: 0,
  },
  {
    label: "1 пересадка",
    value: 1,
  },
  {
    label: "2 пересадки",
    value: 2,
  },
  {
    label: "3 пересадки",
    value: 3,
  },
];

const Filter = () => {
  const dispatch = useAppDispatch();

  const checkedListState = useAppSelector(
    (state) => state.options.filterTransplants,
  );

  const checkAll = plainOptions.length === checkedListState.length;
  const indeterminate =
    checkedListState.length > 0 &&
    checkedListState.length < plainOptions.length;

  const onChange = (list: number[]) => {
    dispatch(setFilterTransplants(list));
    dispatch(fetchTickets());
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    const checkedValue = e.target.checked
      ? plainOptions.map((opt) => opt.value)
      : [];

    onChange(checkedValue);
  };
  return (
    <Flex vertical className={styles.container}>
      <Title level={5} className={styles.title}>
        количество пересадок
      </Title>
      <Flex vertical>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Все
        </Checkbox>
        <CheckboxGroup
          rootClassName={styles.checkboxGroup}
          prefixCls="checkbox"
          options={plainOptions}
          value={checkedListState}
          onChange={onChange}
        />
      </Flex>
    </Flex>
  );
};

export default Filter;
