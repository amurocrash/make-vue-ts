let currentEffect: undefined | (() => void)

class Dep {
  effects: (() => void)[]

  constructor () {
    this.effects = []
  }

  depend () {
    if (currentEffect) {
      this.effects.push(currentEffect)
    }
  }

  notice () {
    this.effects.forEach(effect => effect())
  }
}

function effect (fn: () => void) {
  currentEffect = fn
  fn()
  currentEffect = undefined
}

const targetDepMap = new Map()

function getDep (target: any, key: string | symbol) {
  let map = targetDepMap.get(target)
  if (!map) {
    map = new Map()
    targetDepMap.set(target, map)
  }

  let dep = map.get(key)
  if (!dep) {
    dep = new Dep()
    map.set(key, dep)
  }

  return dep
}

function reactive<T extends object> (target: T) {
  return new Proxy(target, {
    get (target, key, receiver) {
      const dep = getDep(target, key)
      dep.depend()
      return Reflect.get(target, key, receiver)
    },

    set (target, key, value, receiver) {
      const dep = getDep(target, key)
      const result = Reflect.set(target, key, value, receiver)
      dep.notice()
      return result
    }
  })
}

export {
  effect,
  reactive
}
