/* eslint-disable */
// ---------------------------- official example ---------------------------- //
// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')


// ---------------------------- only render function ---------------------------- //
// import { createApp, VueComponent } from './vue'
// import { reactive } from './vue/reactivity'

// const App: VueComponent = {
//   render(context, h) {
//     return h('div', {}, 
//       h('div', { id: 'd1' }, 'div1'), 
//       h('div', { id: 'd2', style: 'color:' + context.state.color }, 'div2'), 
//       h('div', {}, 'count: ' + context.state.count),
//       h('div', {}, 
//         h('button', { onclick: () => {
//           context.state.count++
//           const color = context.state.color
//           context.state.color = color === 'red' ? 'green' : 'red'
//         } }, 'button')
//       )
//     )
//   },

//   setup() {
//     const state = reactive({
//       count: 1,
//       color: 'red'
//     })

//     return {
//       state
//     }
//   }
// }

// createApp(App).mount('#app')


// ---------------------------- easy template render ---------------------------- //
// import { createApp, VueComponent } from './vue'


// const App: VueComponent = {
//   template: `<div>
//     <div>hello</div>
//     <div>world</div>
//   </div>`,
// }

// createApp(App).mount('#app')


// ---------------------------- render with component render ---------------------------- //
// import { createApp, VueComponent } from './vue'
// import { reactive } from './vue/reactivity'

// const Test: VueComponent = {
//   render(_, h) {
//     return h('div', {}, 'test')
//   }
// }

// const Home: VueComponent = {
//   render(context, h) {
//     return h('div', {}, 
//       'home' + context.state.count2,
//       h('button', { onclick: () => context.state.count2 += 2 }, 'home button'), 
//       h(this.components?.test as VueComponent, {})
//     )
//   },

//   components: {
//     test: Test
//   },

//   setup() {
//     const state = reactive({
//       count2: 3
//     })

//     return {
//       state
//     }
//   }
// }

// const App: VueComponent = {
//   render(context, h) {
//     return h('div', {}, 
//       h('div', {}, 'app' + context.state.count1, h('button', { onclick: () => context.state.count1++ }, 'app button'),),
//       h(this.components?.home as VueComponent, {})
//     )
//   },

//   components: {
//     home: Home
//   },

//   setup() {
//     const state = reactive({
//       count1: 1
//     })

//     return {
//       state
//     }
//   }
// }

// createApp(App).mount('#app')


// ---------------------------- template with component render ---------------------------- //
// import { createApp, VueComponent } from './vue'
// import { reactive } from './vue/reactivity'

// const Home: VueComponent = {
//   template: `
//     <div>
//       home page
//       <div>
//         {{state.count}}
//         <button @click="onClick">button</button>
//       </div>
//     </div>
//   `,

//   setup() {
//     const state = reactive({
//       count: 3
//     })

//     const onClick = () => {
//       state.count += 2
//     }

//     return {
//       state,
//       onClick
//     }
//   }
// }

// const App = {
//   template: `<div>
//     <div :id="state.count" :style="state.color">app page</div>
//     <div>app:{{state.count}}-test{{state.count}}</div>
//     <div>
//       <button @click="onClick">add count</button>
//       <button @click="onColorChangeClick">change color</button>
//     </div>
//     <home></home>
//   </div>`,

//   components: {
//     home: Home
//   },

//   setup() {
//     const state = reactive({
//       count: 1,
//       color: 'color: red'
//     })

//     const onClick = () => {
//       console.log('onclick')
//       state.count++
//     }

//     const onColorChangeClick = () => {
//       if (state.color === 'color: red') {
//         state.color = 'color: green'
//       } else {
//         state.color = 'color: red'
//       }
//     }

//     return {
//       state,
//       onClick,
//       onColorChangeClick,
//     }
//   }
// }

// createApp(App).mount('#app')


// ---------------------------- official example by make-vue ---------------------------- //
import { createApp } from './vue'

const HelloWorld = {
  template: `<div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3 style="margin: 40px 0 0;">Installed CLI Plugins</h3>
    <ul style="list-style-type: none;padding: 0;">
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener">typescript</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3 style="margin: 40px 0 0;">Essential Links</h3>
    <ul style="list-style-type: none;padding: 0;">
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3 style="margin: 40px 0 0;">Ecosystem</h3>
    <ul style="list-style-type: none;padding: 0;">
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>`,

  setup() {
    const msg = 'Welcome to Your Vue.js + TypeScript App'
    return {
      msg
    }
  }
}

const App = {
  template: `<div style="font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;">
    <img alt="Vue logo" src="./assets/logo.png"></img>
    <helloworld></helloworld>
  </div>`,

  components: {
    helloworld: HelloWorld
  }
}

createApp(App).mount('#app')