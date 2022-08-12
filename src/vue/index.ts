import { patch, VNode } from './renderer'

export interface VueComponent {
  template?: string
  render?: (context: Record<any, any>, h: (tag: string | VueComponent, props: Record<any, any>, ...children: any[]) => VNode) => VNode
  setup?: () => Record<any, any>,
  components?: Record<string, VueComponent>
}

function createApp (rootComponent: VueComponent) {
  return {
    mount: (selector: string) => {
      const container = document.querySelector(selector) as HTMLElement
      if (container) {
        patch({ tag: rootComponent, props: {}, children: [] }, container)
      } else {
        throw new Error('必须提供正确的container id或class')
      }
    }
  }
}

export {
  createApp
}
