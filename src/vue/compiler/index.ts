/* eslint-disable */
import { isHTMLTag } from '@vue/shared'
import { VueComponent } from '..'
import { VNode } from '../renderer'

const startTag = /<([a-zA-Z_][\w\-\.]*)((?:\s+([a-zA-Z_:@][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))*)\s*(\/?)>/

const endTag = /<\/([a-zA-Z_][\w\-\.]*)>/

const attr = /([a-zA-Z_:@][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

export declare type AstType = 'root' | 'element' | 'text'

export interface Ast {
  type: AstType
  tag?: string
  class?: string
  dataset?: Record<string, any>
  attrs?: { name: string, value: any }[]
  events?: { name: string, value: any }[]
  text?: string
  child?: Ast[]
}

const bufferArr: Ast[] = []
let root: Ast | undefined = undefined

function pushChild(node: Ast) {
  if (bufferArr.length === 0) {
    root?.child?.push(node)
  } else {
    const parent = bufferArr[bufferArr.length - 1]
    parent.child?.push(node)
  }
}

function parse(template: string): Ast {
  root = {
    type: 'root',
    child: []
  }

  let match: RegExpMatchArray | null = null
  let temp = template.replace(/\n|\r/ig, '').trim()
  while(temp) {
    if (temp.indexOf('</') === 0) {
      match = temp.match(endTag)
      if (match) {
        const tagInfo = match[0] // </div>
        temp = temp.substring(tagInfo.length).trim()
      }

      pushChild(bufferArr.pop() as Ast)
    } else if(temp.indexOf('<') === 0) {
      const node: Ast = {
        type: 'element',
        child: []
      }

      match = temp.match(startTag)
      if (match) {
        const tagInfo = match[0] // <div class="classname" style="color: red">
        temp = temp.substring(tagInfo.length).trim()
        tagInfo.replace(startTag, (_, tagName: string, attrs: string) => {
          tagName = tagName.toLowerCase()
          node.tag = tagName

          attrs.replace(attr, (_, propName, propValue) => {
            if (propName.startsWith('data-')) {
              const key = propName.replace('data-', '')
              if (!node.dataset) {
                node.dataset = {}
              }

              node.dataset[key] = propValue
            } else if (propName === 'class') {
              node.class = propValue
            } else if (propName.startsWith('@')) {
              if (!node.events) {
                node.events = []
              }

              node.events.push({
                name: propName,
                value: propValue
              })
            } else {
              if (!node.attrs) {
                node.attrs = []
              }

              node.attrs.push({
                name: propName,
                value: propValue
              })
            }

            return ''
          })
          return ''
        })

        bufferArr.push(node)
      }
    } else {
      let text = ''
      const index = temp.indexOf('<')
      text = temp.substring(0, index)
      temp = temp.substring(index).trim()

      if (text.trim()) {
        const node: Ast = {
          type: 'text',
          text
        }

        pushChild(node)
      }
    }
  }

  return root
}

function transform(ast: Ast): Ast {
  return ast
}

function generate(ast: Ast): string {
  if (!ast) {
    throw new Error('unable to generate code as ast is null')
  }

  const _g = (ast: Ast): string => {
    const type = ast.type

    if (type === 'root') {
      const firstChild = ast.child && ast?.child[0]
      if (firstChild) {
        return _g(firstChild)
      } else {
        return ''
      }
    } else if (type === 'element') {
      // 处理tag
      let tag = ast.tag
      if (tag && !isHTMLTag(tag)) {
        tag = `this.components['${tag}']`
      } else {
        tag = `'${tag}'`
      }

      // todo 处理props
      let props = `{`
      if (ast.events) {
        ast.events.forEach(event => {
          props += `on${event.name.replace('@', '')}:context.${event.value},`
        })
      }

      if (ast.attrs) {
        ast.attrs.forEach(attr => {
          const name = attr.name
          const value = attr.value
          if (name.startsWith(':')) {
            props += `${name.replace(':', '')}:context.${value},`
          } else {
            props += `${name}:"${attr.value}",`
          }
        })
      }

      props += '}'

      // 处理child
      const children = ast.child
      let childrenStr = ''
      if (children) {
        children.forEach((childAst) => {
          childrenStr += (_g(childAst) + ',')
        })
      } else {
        childrenStr = `''`
      }

      return `h(${tag}, ${props}, ${childrenStr})`
    } else if (type === 'text') {
      let text = ast.text?.trim()
      const match = text?.match(defaultTagRE)
      if (match) {
        // 适配aaa{{data1}}bbb{{data2}}ccc ... or more
        const content = text?.replace(defaultTagRE, (withWrapper, inner, startIndex, origin) => {
          return `' + context.${inner} + '`
        })
        text = `'${content}'`
        
      } else {
        text = `'${text}'`
      }

      return text
    } else {
      throw new Error('your ast type can only be root, element and text. now is: ' + ast.type)
    }

  }

  
  const hStr = _g(ast)
  return hStr
}

function compile(template: string) {
  let ast = parse(template)
  ast = transform(ast)
  const hStr = generate(ast)

  return new Function('context', 'h', `return ${hStr}`) as (context: any, h: (tag: string | VueComponent, props: Record<any, any>, ...children: any[]) => VNode) => VNode
}

export {
  parse,
  transform,
  generate,
  compile,
}
