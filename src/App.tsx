import { ConfigProvider, Flex, Image } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect } from "react";
import styles from "./App.module.scss";
import Filter from "./components/Filter";
import SortedOptions from "./components/SortedOptions";
import TicketList from "./components/TicketList";
import { fetchSearchId } from "./store/optionsSlice";
import { fetchTickets } from "./store/ticketsSlice";
import { useAppDispatch } from "./utils/store/redux";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(fetchSearchId());

        await dispatch(fetchTickets());
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Flex className={styles.app}>
        <Image
          src="/assets/img/logo.png"
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
