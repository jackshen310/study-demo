import { Tabs } from "antd";
import { Provider } from "react-redux";
import Counter from "./counter";
import Notifications from "./notifications";
import Posts from "./posts";
import store from "./store";
import Users from "./users";

const { TabPane } = Tabs;

const ReduxDemo = () => {
  return (
    <Provider store={store}>
      <Tabs defaultActiveKey="2">
        <TabPane tab="Tab 1" key="1">
          <Counter />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <Posts />
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          <Users />
        </TabPane>
        <TabPane tab="Tab 4" key="4">
          <Notifications />
        </TabPane>
      </Tabs>
    </Provider>
  );
};

export default ReduxDemo;
