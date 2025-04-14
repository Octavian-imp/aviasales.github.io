import { ConfigProvider, Flex, Image } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useRef } from "react";
import styles from "./App.module.scss";
import Filter from "./components/Filter";
import SortedOptions from "./components/SortedOptions";
import TicketList from "./components/TicketList";
import { fetchSearchId } from "./store/optionsSlice";
import { fetchTickets, ticketsSelector } from "./store/ticketsSlice";
import useOnlyEffect from "./utils/hooks/useOnlyEffect";
import { useAppDispatch, useAppSelector } from "./utils/store/redux";

const App = () => {
  const dispatch = useAppDispatch();
  const { stop: isStop } = useAppSelector(ticketsSelector);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isStop && intervalRef.current) {
      console.log("stop");
      clearInterval(intervalRef.current);
    }
  }, [isStop]);
  const init = async () => {
    try {
      await dispatch(fetchSearchId());

      await dispatch(fetchTickets());
    } catch (error) {
      console.log(error);
    }
  };
  useOnlyEffect(() => {
    intervalRef.current = setInterval(() => {
      dispatch(fetchTickets());
    }, 500);
    init();
  });

  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Flex className={styles.app}>
        <Image
          src="./assets/img/logo.png"
          height={60}
          width={60}
          preview={false}
        />
        <Content className={styles.contentPage}>
          <Filter />
          <Flex vertical gap={20} style={{ width: "100%" }}>
            <SortedOptions />
            <TicketList />
          </Flex>
        </Content>
      </Flex>
    </ConfigProvider>
  );
};

export default App;
