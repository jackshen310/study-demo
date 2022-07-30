import { Tabs } from "antd";
import { Provider } from "react-redux";
import Counter from "./counter";
import Posts from "./posts";
import store from "./store";

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
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </Provider>
  );
};

export default ReduxDemo;
