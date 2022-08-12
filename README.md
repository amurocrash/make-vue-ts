# make-vue-ts
目前已实现：
1. 数据双向绑定底层reactive实现
2. 基础的template解析成ast的能力
3. ast动态生成h函数，解析@和:属性，最终动态生成render函数
4. 挂载的核心patch方法，根据组件和el分别调用processComponent和mountElement
5. 处理标签的attributes，包括事件，样式，data-，和其他任意属性
6. 更新时简单的diff算法
7. 数据更新时动态触发diff，实现双向绑定

main.ts中通过注释分隔不同的示例，通过// ---- //分隔
