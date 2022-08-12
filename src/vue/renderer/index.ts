/* eslint-disable */
import { effect } from '../reactivity'
import { VueComponent } from '..'
import { compile } from '../compiler'
import { h } from '../h'

export interface VNode {
  tag: string | VueComponent
  props: Record<any, any>
  children: VNode[]
  el?: HTMLElement | Text
}

function processComponent(component: VueComponent, el: HTMLElement) {
  let isMounted = false
  let oldVnode: VNode | undefined = undefined
  const context = component.setup && component.setup() || {}
  let render = component.render
  if (!render) {
    render = compile(component.template || '')
  }

  effect(() => {
    if (!render) {
      throw new Error('render is undefined')
    }

    const vnode = render.call(component, context, h)
    if (!isMounted) {
      patch(vnode, el)
      isMounted = true
    } else {
      diff(vnode, oldVnode as VNode)
    }

    oldVnode = vnode
  })
}

function mountElement (vnode: VNode, container: HTMLElement) {
  const el = (vnode.el = createDom(vnode))

  if (vnode.tag !== '') {
    const { props, children } = vnode
    diffProps(props, {}, el as HTMLElement)

    children.forEach(child => {
      patch(child, el as HTMLElement)
    })
  }
  container.appendChild(el)
}

function createDom (vnode: VNode) {
  const tag = vnode.tag as string
  if (tag === '') {
    return document.createTextNode(vnode.props.nodeValue)
  } else {
    return document.createElement(tag)
  }
}

const isEvent = (propName: string) => propName.startsWith('on')
const propsToRemove = (_: Record<any, any>, next: Record<any, any>) => (propName: string) => !(propName in next)
const propsValueChanged = (prev: Record<any, any>, next: Record<any, any>) => (propName: string) => prev[propName] !== next[propName]
function diffProps(newProps: Record<any, any>, oldProps: Record<any, any>, el: HTMLElement) {

  Object
    .keys(oldProps)
    .filter(isEvent)
    .forEach(propName => {
      const eventType = propName.toLowerCase().substring(2)
      el.removeEventListener(eventType, oldProps[propName])
    })

  Object
    .keys(oldProps)
    .filter(propsToRemove(oldProps, newProps))
    .forEach(propName => {
      // @ts-ignore
      el[propName] = ''
    })

  Object
    .keys(newProps)
    .filter(propsValueChanged(oldProps, newProps))
    .forEach(propName => {
      // @ts-ignore
      el[propName] = newProps[propName]
    })

  Object
    .keys(newProps)
    .filter(isEvent)
    .forEach(propName => {
      const eventType = propName.toLowerCase().substring(2)
      el.addEventListener(eventType, newProps[propName])
    })
}

function diff (newVnode: VNode, oldVnode: VNode) {
  const newTag = newVnode.tag
  const oldTag = oldVnode.tag
  const el = (newVnode.el = oldVnode.el as HTMLElement | Text)

  if (newTag !== oldTag) {
    el.replaceWith(createDom(newVnode))
  } else {
    // 文本节点
    if (newTag === '') {
      const newText = newVnode.props.nodeValue
      if (newText !== oldVnode.props.nodeValue) {
        (el as Text).nodeValue = newText
      }
    } else {
      diffProps(newVnode.props, oldVnode.props, el as HTMLElement)

      const newChildren = newVnode.children
      const oldChildren = oldVnode.children

      // 对比children
      // 1、两者重合的部分
      const length = Math.min(newChildren.length, oldChildren.length)

      for (let i = 0; i < length; i++) {
        const newChildVnode = newChildren[i]
        const oldChildVnode = oldChildren[i]
        diff(newChildVnode, oldChildVnode)
      }

      // 2、新children多出来的部分
      if (newChildren.length > length) {
        for (let i = length; i < newChildren.length; i++) {
          const newChildVnode = newChildren[i]
          patch(newChildVnode, el as HTMLElement)
        }
      }

      // 3、老children多出来的部分
      if (oldChildren.length > length) {
        for (let i = length; i < oldChildren.length; i++) {
          const oldChildVnode = oldChildren[i]
          el.removeChild(oldChildVnode.el as HTMLElement | Text)
        }
      }
    }
  }
}

function patch(vnode: VNode, container: HTMLElement) {
  const tag = vnode.tag
  if (typeof tag === 'object') {
    processComponent(tag, container)
  } else {
    mountElement(vnode, container)
  }
}

export {
  patch,
  diff
}
