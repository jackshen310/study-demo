import { Tabs } from "antd";
import GameOfLifeDemo from "./game-of-life";
import MaskDemo from "./mask/index";

const { TabPane } = Tabs;

const ReduxDemo = () => {
  return (
    <Tabs defaultActiveKey="2">
      <TabPane tab="Tab 1" key="1">
        <GameOfLifeDemo />
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        <MaskDemo />
      </TabPane>
    </Tabs>
  );
};

export default ReduxDemo;
