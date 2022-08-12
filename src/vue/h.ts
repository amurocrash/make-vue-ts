import { VueComponent } from '.'
import { VNode } from './renderer'

function h (tag: string | VueComponent | undefined, props: Record<any, any>, ...children: any[]): VNode {
  if (!tag) {
    throw new Error('tag is undefined which can not be resolved')
  }

  if (!children) {
    children = []
  }

  return {
    tag,
    props,
    children: children.map(child => {
      if (typeof child === 'number') {
        child = child + ''
      }

      if (typeof child === 'string') {
        const vnode: VNode = {
          tag: '',
          props: {
            nodeValue: child
          },
          children: []
        }
        return vnode
      }

      return child
    })
  }
}

export {
  h
}
