# Konva
中文文档 http://konvajs-doc.bluehymn.com/docs/

## 工作原理
Konva 的对象是以一颗树的形式保存的，Konva.Stage 是树的根节点，Stage 子节点是用户创建的图层 （Konva.Layer）。
每一个 layer 有两个 <canvas> 渲染器： 场景渲染器 和 图像命中检测渲染器。场景渲染器输出你所看见的内容，图像命中渲染器在隐藏的 canvas 里用于高性能的检测事件。
              Stage
                |
         +------+------+
         |             |
       Layer         Layer
         |             |
   +-----+-----+     Shape
   |           |
 Group       Group
   |           |
   +       +---+---+
   |       |       |
Shape   Group    Shape
           |
           +
           |
         Shape

