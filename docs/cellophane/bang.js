/* eslint-disable no-setter-return, no-with, no-constant-condition, no-async-promise-executor */
(function () {
  // constants, classes, config and state
    const DEBUG = true;
    const IMMEDIATE = Symbol.for(`[[IMMEDIATE]]`);
    const NAMESPACE = 'b';
    const PIPELINE_REQUESTS = true;
    const RANDOM_SLEEP_ON_FIRST_PRINT = true;
    const RESPONSIVE_MEDIATION = true;
    const USE_XPATH = true;
    const X_NS_ATTRS = `.//@*[starts-with(name(), '${NAMESPACE}:')]`;
    const X_NEWLISTENING = document.createExpression(X_NS_ATTRS);
    const XON_EVENT_ATTRS = `.//@*[starts-with(local-name(), 'on')]`;
    const X_LISTENING = document.createExpression(XON_EVENT_ATTRS);
    const OPTIMIZE = true;
    const GET_ONLY = true;
    const MOBILE = isMobile();
    const GC_TIMEOUT = 10000;
    //const GENERATOR = (function*(){yield}()).constructor;
    const EMPTY = '';
    const {stringify:_STR} = JSON;
    const JS = o => _STR(o, null, EMPTY);
    const LIGHTHOUSE = navigator.userAgent.includes("Chrome-Lighthouse");
    const DOUBLE_BARREL = /^\w+-(?:\w+-?)*$/; // note that this matches triple- and higher barrels, too
    const POS = 'beforeend';
    const LOCAL_PATH = 'this.';
    const PARENT_PATH = 'this.getRootNode().host.';
    const ONE_HIGHER = 'getRootNode().host.';
    const CALL_WITH_EVENT = '(event)';
    const F = _FUNC; 
    const FUNC_CALL = /\);?$/;
    const MirrorNode = Symbol.for('[[MN]]');
    const DIV = document.createElement('div');
    const path = location.pathname;
    const CONFIG = {
      htmlFile: 'markup.html',
      scriptFile: 'script.js',
      styleFile: 'style.css',
      bangKey: '_bang_key',
      componentsPath: `${path}${path.endsWith('/') ? EMPTY : '/'}../components`,
      allowUnset: true,
      unsetPlaceholder: EMPTY,
      EVENTS: `bond error load click pointerdown pointerup pointermove mousedown mouseup submit
        mousemove touchstart touchend touchmove touchcancel dblclick dragstart dragend 
        dragmove drag mouseover mouseout focus blur focusin focusout scroll
        input change compositionstart compositionend text paste beforepaste select cut copy
        keydown keyup keypress compositionupdate
        contextmenu wheel
      `.split(/\s+/g).filter(s => s.length).map(e => `[on${e}]`).join(','),
      delayFirstPaintUntilLoaded: false,
      capBangRatioAtUnity: false,
      noHandlerPassthrough: false
    }
    const History = [];
    const STATE = new Map();
    const CACHE = new Map();
    const Waiters = new Map();
    const Started = new Set();
    const TRANSFORMING = new WeakSet();
    const Dependents = new Map();
    const MAX_CONCURRENT_REQUESTS = 5;
    const RequestPipeLine = new Map();
    const RequestWaiting = [];
    class Counter {
      started = 0;
      finished = 0;

      constructor(root) {
        root.counts = this;
        this.root = root;
      }

      check() {
        const {root} = this;
        const isTopLevel = root === document;
        let loaded = false;

        if ( isTopLevel ) {
          const noSwiftDescendents = root.querySelectorAll('.bang-el:not([lazy])').length === 0;
          loaded = noSwiftDescendents;
        } else {
          const nonZeroCheck = this.started > 0;
          const finishedCheck = this.finished >= this.started;
          loaded = nonZeroCheck && finishedCheck;
        }

        return loaded;
      }

      start() {
        if ( this.root == document ) say('log', 'Counting start');
        this.started++;
      }

      finish() {
        if ( this.root == document ) say('log', 'Counting finished');
        this.finished++;
      }
    }
    const SHADOW_OPTS = {mode:'open'};
    const OBSERVE_OPTS = {subtree: true, childList: true, characterData: true};
    const INSERT = 'insert';
    const ALL_DEPS = {allDependents: true};
    let LoadChecker;
    let RequestId = 0;
    let hindex = 0;
    let observer; // global mutation observer
    let systemKeys = 1;
    let _c$;

    const BangBase = (name) => class Base extends HTMLElement {
      static #activeAttrs = ['state']; // we listen for changes to these attributes only
      static get observedAttributes() {
        return Array.from(Base.#activeAttrs);
      }
      #name = name;
      #dependents = [];

      constructor() {
        super();
        new Counter(this);
        this.cookMarkup = async (markup, state) => {
          const cooked = await cook.call(this, markup, state);
          if ( !this.shadowRoot ) {
            const shadow = this.attachShadow(SHADOW_OPTS);
            state._tasks && state._tasks.forEach(t => {
              const funcName = t(this);
              DEBUG && console.log(`Applied automatic event handler function ${funcName} to component ${this}`);
            });
            observer.observe(shadow, OBSERVE_OPTS);
            await cooked.to(shadow, INSERT);
            cookListeners(shadow);
            // add dependents
            const deps = await findBangs(transformBang, shadow, ALL_DEPS);
            this.#dependents = deps.map(node => node.untilVisible());
          }
        }
        this.markLoaded = async () => {
          this.alreadyPrinted = true;
          if ( ! this.loaded ) {
            this.counts.finish();
            const loaded = await this.untilLoaded();
            if ( loaded ) {
              this.loaded = loaded;
              this.setVisible();
              if ( ! this.isLazy ) {
                setTimeout(() => document.counts.finish(), 0);
              }
            } else {
              console.warn('Not loaded', this);
              // right now this never happens
            }
          }
        }
        this.loadCheck = () => this.counts.check();
        this.visibleCheck = () => this.classList?.contains('bang-styled');
        this.loadKey = Math.random().toString(36);
        this.visibleLoadKey = Math.random().toString(36);
      }

      get name() {
        return this.#name;
      }

      // BANG! API methods
      async print() {
        if ( !this.alreadyPrinted ) {
          this.prepareVisibility();
        }
        const state = this.handleAttrs(this.attributes);
        if ( OPTIMIZE ) {
          const nextState = JS(state);
          if ( this.alreadyPrinted && this.lastState === nextState ) {
            return;
          }
          this.lastState = nextState;
        }
        return this.printShadow(state)
      }

      update() {
        if ( this.fastUpdate ) {
          return this.fastUpdate();
        } else {
          return this.print();
        }
      }

      prepareVisibility() {
        this.classList.add('bang-el');
        this.counts.start();
        if ( !this.isLazy ) {
          document.counts.start();
        }
        this.classList.remove('bang-styled');
        // we prefetch the style
        fetchStyle(name).catch(err => {
          say('warn', err);
        });
      }

      async untilLoaded() {
        const myDependentsLoaded = (await Promise.all(this.#dependents)).every(visible => visible);
        const myContentLoaded = await becomesTrue(this.loadCheck, this.loadKey);
        DEBUG && console.log(new Date - self.Start);
        return myContentLoaded && myDependentsLoaded;
      }

      async untilVisible() {
        if ( this.isLazy ) return true;
        return await becomesTrue(this.visibleCheck, this.visibleLoadKey);
      }

      get deps() {
        return this.#dependents;
      }

      updateIfChanged(state) {
        const {didChange} = stateChanged(state);
        if ( didChange ) {
          const views = getViews(state);
          const newKey = updateState(state);
          views.forEach(view => view.setAttribute('state', newKey));
        }
      }

      setVisible() {
        this.classList.add('bang-styled');
      }

      get state() {
        const key = this.getAttribute('state');
        return cloneState(key);
      }

      set state(newValue) {
        const key = this.getAttribute('state');
        if ( key.startsWith('system-key:') ) {
          return this.updateIfChanged(this.state);
        }
        return setState(key, newValue);
      }

      // Web Components methods
      attributeChangedCallback(name, oldValue) {
        if ( name === 'state' && !isUnset(oldValue) ) {
          this.update();
        }
      }

      connectedCallback() {
        say('log',name, 'connected');
        this.handleAttrs(this.attributes, {originals: true});
        if ( this.hasAttribute('lazy') ) {
          this.isLazy = true;
          if ( this.hasAttribute('super') ) {
            this.superLazy = true;
            loaded().then(() => sleep(400*Math.random()).then(() => this.print()));
          } else {
            if ( RANDOM_SLEEP_ON_FIRST_PRINT ) {
              sleep(160*Math.random()).then(() => this.print());
            } else {
              this.print();
            }
          }
        } else {
          this.print();
        }
      }

      // private methods
      handleAttrs(attrs, {node, originals} = {}) {
        const state = {};

        if ( ! node ) node = this;

        // we can optimize this method more, we only get attrs if originals == true
        // otherwise we just get and process the single 'state' attr 
        // this is a lot more performant
        for( const {name,value} of attrs ) {
          if ( isUnset(value) ) continue;
          handleAttribute(name, value, {node, originals, state});
        }

        return state;
      }

      printShadow(state) {
        return fetchMarkup(this.#name).then(markup => this.cookMarkup(markup, state))
        .catch(err => DEBUG && say('warn!',err))
        .finally(this.markLoaded);
      }
    };

    class StateKey extends String {
      constructor (keyNumber) {
        if ( keyNumber == undefined ) super(`system-key:${systemKeys+=2}`); 
        else super(`client-key:${keyNumber}`);
      }
    }

  install();

  // API
    async function use(name) {
      if ( self.customElements.get(name) ) return;

      console.log('using', name);

      let component;
      await fetchScript(name)
        .then(script => { // if there's a script that extends base, evaluate it to be component
          const Base = BangBase(name);
          const Compose = `(function () { ${Base.toString()}; return ${script}; }())`;
          try {
            component = eval(Compose);
          } catch(e) {
            say('warn!',e, Compose, component)
          }
        }).catch(err => {  // otherwise if there is no such extension script, just use the Base class
          DEBUG && say('log!', err);
          component = BangBase(name);
        });
      
      if ( self.customElements.get(name) ) return;

      self.customElements.define(name, component);
    }
    
    // run a map of a list of work with configurable breaks in between
    // to let the main thread breathe at the same time 
    async function schedule(list, func, {
          batchSize: batchSize = 1,
          yieldTime: yieldTime = 30,
          strictSerial: strictSerial = true,
          useFrame: useFrame = false
        } = {}) {
      // note list can be async iterable
      const results = [];
      let i = 0;
      let currentBatch = 0;
      for await ( const item of list ) {
        let result;
        if ( strictSerial ) {
          result = await func(item, i);
        } else {
          result = func(item, i);
        }
        results.push(result);

        if ( RESPONSIVE_MEDIATION ) {
          i++;
          currentBatch++;
          if ( currentBatch < batchSize ) continue;
          currentBatch = 0;

          if ( useFrame ) {
            await nextFrame();
          } else if ( yieldTime > -1 ) {
            await sleep(yieldTime);
          }
        }
      }
      return results;
    }

    function undoState(key, transform = x => x) {
      while( hindex > 0 ) {
        hindex -= 1;
        if ( History[hindex].name === key ) {
          setState(key, transform(History[hindex].value));
          return true;
        }
      }
      return false;
    }

    function redoState(key, transform = x => x) {
      while( hindex < History.length - 1 ) {
        hindex += 1;
        if ( History[hindex].name === key ) {
          setState(key, transform(History[hindex].value));
          return true;
        }
      }
      return false;
    }

    function bangFig(newConfig = {}) {
      Object.assign(CONFIG, newConfig);
    }

    function immediate(f) {
      if ( !(f instanceof Function) ) {
        throw new TypeError(`immediate can only be called on a function. Recieved: ${f}`);
      }

      if ( f[IMMEDIATE] ) return;

      Object.defineProperty(f, IMMEDIATE, {value: true, configurable: false, enumerable: false, writable: false});
    }

    function runCode(context, str) {
      with(context) {
        return eval(str); 
      }
    }

    function stateChanged(obj) {
      const key = STATE.get(obj);
      const oStateJSON = STATE.get(key+'.json.last');
      const stateJSON = JS(obj);
      return {key, didChange: oStateJSON !== stateJSON, stateJSON, oStateJSON};
    }

    function updateState(state, key) {
      key = key || STATE.get(state);
      if ( ! key ) {
        console.warn('no key for state', state);
        throw new ReferenceError(`Key must exist to update state.`);
      }
      const oKey = key;
      const oStateJSON = STATE.get(key+'.json.last');
      const stateJSON = JS(state);
      STATE.delete(oStateJSON);
      STATE.set(key, state);
      if ( key.startsWith('system-key:') ) {
        STATE.delete(key);
        STATE.delete(key+'.json.last');
        key = new StateKey()+'';
        STATE.set(key, state);
        STATE.set(state, key);
      }
      STATE.set(key+'.json.last', stateJSON);
      STATE.set(stateJSON, key+'.json.last');
      const views = Dependents.get(oKey);
      Dependents.set(key, views);
      return key;
    }

    function getViews(obj) {
      const key = STATE.get(obj);
      const acquirers = Dependents.get(key);
      if ( acquirers ) {
        return Array.from(acquirers);
      } else {
        console.warn('No acquirers for key');
        return [];
      }
    }

    function setState(key, state, {
      rerender: rerender = true, 
      save: save = false
    } = {}) {
      const jss = JS(state);
      let lk = key+'.json.last';
      if ( GET_ONLY ) {
        if ( !STATE.has(key) ) {
          STATE.set(key, state);
          STATE.set(state, key);
          STATE.set(jss,lk);
          STATE.set(lk,jss);
        } else {
          const oStateJSON = STATE.get(lk);
          /*if ( stateChanged(oState).didChange ) {*/
          if ( oStateJSON !== jss ) {
            key = updateState(state, key);
          }
        }
      } else {
        STATE.set(key, state);
        STATE.set(state, key);
        STATE.set(jss,lk);
        STATE.set(lk,jss);
      }

      if ( save ) {
        hindex = Math.min(hindex+1, History.length);
        History.splice(hindex, 0, {name: key, value: clone(state)});
      }

      if ( rerender ) { // re-render only those components depending on that key
        const acquirers = Dependents.get(key);
        if ( acquirers ) acquirers.forEach(host => host.update());
      }
      
      return true;
    }

    function patchState(key, state) {
      return setState(key, state, {rerender: false});
    }

    function cloneState(key, getOnly = GET_ONLY) {
      if ( getOnly ) return STATE.get(key);
      if ( STATE.has(key) ) return clone(STATE.get(key));
      else {
        throw new ReferenceError(`State store does not have the key ${key}`);
      }
    }

    async function loaded() {
      return becomesTrue(LoadChecker);
    }

    async function bangLoaded() {
      return becomesTrue(bangLoadedCheck);
    }

    function bangLoadedCheck() {
      const c_defined = typeof _c$ === "function";
      return c_defined;
    }

  // network pipelining (for performance)
    async function pipeLinedFetch(...args) {
      if ( !PIPELINE_REQUESTS ) return fetch(...args);
      const key = nextRequestId();
      const result = {args, started: new Date};
      let pr;
      if ( RequestPipeLine.size < MAX_CONCURRENT_REQUESTS ) {
        pr = fetch(...args).catch(err => (say('log', err), `/* ${err} */`));
        result.pr = pr;
        RequestPipeLine.set(key, result);
        const complete = r => {
          const result = RequestPipeLine.get(key);
          result.finished = new Date;
          result.duration = result.finished - result.started;
          RequestPipeLine.delete(key); 
          if ( RequestWaiting.length && RequestPipeLine.size < MAX_CONCURRENT_REQUESTS ) {
            const result = RequestWaiting.shift();
            const req = fetch(...result.args);
            req.then(complete).then(r => (result.resolve(r), r)).catch(e => (result.reject(e), e));
            RequestPipeLine.set(key, result);
          }
          return r;
        };
        pr.then(complete);
      } else {
        let resolve, reject;
        pr = new Promise((res,rej) => (resolve = res, reject = rej));
        result.resolve = resolve;
        result.reject = reject;
        RequestWaiting.push(result);
      }
      return pr;
    }

    function nextRequestId() {
      return `${RequestId++}${Math.random().toString(36)}`;
    }

  // helpers
    function handleAttribute(name, value, {node, originals, state} = {}) {
      DEBUG && console.log({name, value, node, originals, state});
      if ( name === 'state' ) {
        const stateKey = value.trim(); 
        const stateObject = cloneState(stateKey);
        
        if ( isUnset(stateObject) ) {
          console.warn(node);
          self.STATE = STATE;
          console.warn(new ReferenceError(`
            <${node.localName}> constructor passed state key ${stateKey} which is unset. It must be set.
          `));
          return;
        }
        
        Object.assign(state, stateObject);

        if ( originals ) {
          let acquirers = Dependents.get(stateKey);
          if ( ! acquirers ) {
            acquirers = new Set();
            Dependents.set(stateKey, acquirers);
          }
          acquirers.add(node);
        } else return;
      } else if ( originals ) { // set event handlers to custom element class instance methods
        if ( ! name.startsWith('on') ) return;
        value = value.trim();
        value = value.replace(/\(event\)$/, '');
        if ( ! value ) return;

        // Perf note:
          // Local and Parent are just optimizations to avoid if we can the
          // getAncestor function call, which saves us a couple seconds in large documents
        const Local = node[value] instanceof Function;
        const Parent = node.getRootNode()?.host?.[value] instanceof Function;
        DEBUG && console.log({Local, Parent});
        const Func = Local ? node[value] :
          Parent ? node.getRootNode().host[value] :
          null;
        const path = Local ? LOCAL_PATH :
          Parent ? PARENT_PATH : 
          getAncestor(node.getRootNode()?.host?.getRootNode?.()?.host, value)
        ;

        if ( !path || value.startsWith(path) ) return;

        if ( name === 'onbond' ) {
          if ( Func ) {
            try {
              Func(node);
              //FIXME: should this actually be removed ? 
              node.removeAttribute(name);
            } catch(error) {
              console.warn(`bond function error`, {error, name, value, node, originals, state, Func});
            }
          } else {
            console.warn(`bond function Not dereferencable`, {name, value, node, originals, state});
          }
          return;
        }

        // Conditional logic explained:
          // don't add a function call bracket if
          // 1. it already has one
          // 2. the reference is not a function
        const ender = value.match(FUNC_CALL) ? EMPTY : CALL_WITH_EVENT;
        node.setAttribute(name, `${path}${value}${ender}`);
      }
    }

    function handleNewAttribute(name, value, {node}) {
      value = value.trim();
      if ( ! value ) return;

      const [nameSpace, ...flags] = name.split(':');

      if ( nameSpace !== NAMESPACE ) {
        throw new TypeError(`Irregular namespace ${nameSpace}`);
      }

      const eventName = flags.pop();
      const flagObj = flags.reduce((o, name) => (o[name] = true, o), {});

      // Perf note:
        // Local and Parent are just optimizations to avoid if we can the
        // getAncestor function call, which saves us a couple seconds in large documents
      const Local = node[value] instanceof Function;
      const Parent = node.getRootNode()?.host?.[value] instanceof Function;
      console.log({name, value, node, Local, Parent});
      const path = Local ? LOCAL_PATH :
        Parent ? PARENT_PATH : 
        getAncestor(node.getRootNode()?.host?.getRootNode?.()?.host, value)
      ;

      if ( !path || value.startsWith(path) ) return;

      // Conditional logic explained:
        // don't add a function call bracket if
        // 1. it already has one
        // 2. the reference is not a function
      const ender = value.match(FUNC_CALL) ? EMPTY : CALL_WITH_EVENT;
      node.addEventListener(
        eventName, 
        new Function('event', `return ${path}${value}${ender}`), 
        flagObj
      );
    }

    function select(context, selector) {
      try {
        if ( USE_XPATH ) {
          const results = [];
          let xresult;
          if ( context instanceof DocumentFragment ) {
            for( const elContext of context.children ) {
              if ( selector instanceof XPathExpression ) {
                xresult = selector.evaluate(elContext, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
              } else {
                xresult = document.evaluate(selector, elContext, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
              }
              let node;
              /* eslint-disable no-cond-assign */
              while(node = xresult.iterateNext()) {
                results.push(node);
              } 
              /* eslint-enable no-cond-assign */
            }
          } else {
            if ( selector instanceof XPathExpression ) {
              xresult = selector.evaluate(context, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
            } else {
              xresult = document.evaluate(selector, context, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            }
            let node;
            /* eslint-disable no-cond-assign */
            while(node = xresult.iterateNext()) {
              results.push(node);
            }
            /* eslint-enable no-cond-assign */
          }
          return results;
        } else {
          DEBUG && console.log('non xpath', selector);
          return context.querySelectorAll ? context.querySelectorAll(selector) : [];
        }
      } catch(e) {
        console.warn(e);
      }
    }

    async function install() {
      DEBUG && (self.Start = new Date);
      new Counter(document);
      LoadChecker = () => document.counts.check();

      Object.assign(globalThis, {
        F,
        use, setState, patchState, cloneState, loaded, 
        sleep, bangFig, bangLoaded, isMobile, trace,
        undoState, redoState, stateChanged, getViews, updateState,
        isUnset,  EMPTY, 
        dateString,
        runCode, schedule,
        immediate,
        ...( DEBUG ? { STATE, CACHE, TRANSFORMING, Started, BangBase } : {})
      });

      const module = globalThis.vanillaview || (await import('./vv/vanillaview.js'));
      const {s} = module;
      const That = {STATE,CONFIG,StateKey,JS}; 
      _c$ = s.bind(That);
      That._c$ = _c$;

      if ( CONFIG.delayFirstPaintUntilLoaded ) {
        becomesTrue(() => document.body).then(() => document.body.classList.add('bang-el'));
      }

      observer = new MutationObserver(transformBangs);
      /* we are interested in bang nodes (which start as comments) */
      observer.observe(document, OBSERVE_OPTS);
      await findBangs(transformBang); 
      
      loaded().then(() => document.body.classList.add('bang-styled'));
    }

    async function fetchMarkup(name) {
      // cache first
        // we make any subsequent calls for name wait for the first call to complete
        // otherwise we create many in parallel without benefitting from caching

      const key = `markup:${name}`;

      if ( Started.has(key) ) {
        if ( ! CACHE.has(key) ) await cacheHasKey(key);
      } else Started.add(key);

      const styleKey = `style${name}`;
      const baseUrl = `${CONFIG.componentsPath}/${name}`;
      if ( CACHE.has(key) ) {
        const markup = CACHE.get(key);
        if ( CACHE.get(styleKey) instanceof Error ) { 
          /*comp && comp.setVisible(); */
        }
        
        // if there is an error style and we are still includig that link
        // we generate and cache the markup again to omit such a link element
        if ( CACHE.get(styleKey) instanceof Error && markup.includes(`href=${baseUrl}/${CONFIG.styleFile}`) ) {
          // then we need to set the cache for markup again and remove the link to the stylesheet which failed 
        } else {
          /* comp && comp.setVisible(); */
          return markup;
        }
      }
      
      const markupUrl = `${baseUrl}/${CONFIG.htmlFile}`;
      let resp;
      const markupText = await pipeLinedFetch(markupUrl).then(async r => { 
        let text = EMPTY;
        if ( r.ok ) text = await r.text();
        else text = `<slot></slot>`;        // if no markup is given we just insert all content within the custom element
      
        if ( CACHE.get(styleKey) instanceof Error ) { 
          resp = `
          <style>
            ${await fetchFile(EMPTY, CONFIG.styleFile).catch(err => `/* ${err+EMPTY} */`)}
          </style>${text}` 
        } else {
          // inlining styles for increase speed */
          resp = `
          <style>
            ${await fetchFile(EMPTY, CONFIG.styleFile).catch(err => `/* ${err+EMPTY} */`)}
            ${await fetchStyle(name)}
          </style>${text}`;
        }
        
        return resp;
      }).finally(async () => CACHE.set(key, await resp));
      return markupText;
    }

    async function fetchFile(name, file) {
      const key = `${file}:${name}`;

      if ( Started.has(key) ) {
        if ( ! CACHE.has(key) ) await cacheHasKey(key);
      } else Started.add(key);

      if ( CACHE.has(key) ) return CACHE.get(key);

      const url = `${CONFIG.componentsPath}/${name ? name + '/' : EMPTY}${file}`;
      let resp;
      const fileText = await pipeLinedFetch(url).then(r => { 
        if ( r.ok ) {
          resp = r.text();
          return resp;
        } 
        resp = new ReferenceError(`Fetch error: ${url}, ${r.statusText}`);
        throw resp;
      })
      .then(e => e instanceof Error ? `/* no ${name}/${file} defined */` : e)
      .finally(async () => CACHE.set(key, await resp));
      
      return fileText;
    }

    async function fetchStyle(name) {
      return fetchFile(name, CONFIG.styleFile);
    }

    async function fetchScript(name) {
      return fetchFile(name, CONFIG.scriptFile);
    }

    // search and transform each added subtree
    async function transformBangs(records) {
      for( const record of records ) {
        for( const node of record.addedNodes ) {
          if ( node.nodeType !== Node.TEXT_NODE ) {
            cookListeners(node);
            await findBangs(transformBang, node);
          }
        }
      }
    }

    function transformBang(current) {
      const [name, data] = getBangDetails(current);

      // replace the bang node (comment) with its actual custom element node
      const actualElement = createElement(name, data);
      current.linkedCustomElement = actualElement;
      actualElement[MirrorNode] = current;
      current.parentNode.replaceChild(actualElement, current);
    }

    async function findBangs(callback, root = document.documentElement, {
          allDependents: allDependents = false,
          batchSize: batchSize = 100,
          yieldTime: yieldTime = 0,
          useFrame: useFrame = true
        } = {}) {
      if ( root.noFindBang ) return allDependents ? [] : void 0;
      const found = allDependents ? 
        node => node.nodeType === Node.COMMENT_NODE || 
          node.nodeType === Node.ELEMENT_NODE 
        :
        node => node.nodeType === Node.COMMENT_NODE
      ;
      const Filter = allDependents ? 
        NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
        :
        NodeFilter.SHOW_COMMENT
      ;
      const Details = allDependents ? 
        getNodeDetails  
        :
        getBangDetails
      ;
      const Return = allDependents ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_REJECT;
      const Acceptor = {
        acceptNode(node) {
          if ( found(node) ) {
            const [name] = Details(node); 
            if ( name.match(DOUBLE_BARREL) ) return NodeFilter.FILTER_ACCEPT;
            else return Return; 
          } else if ( isDocument(node) ) {
            return NodeFilter.FILTER_ACCEPT;
          } else return NodeFilter.FILTER_SKIP;
        }
      };
      // FIXME: do we need to walk through shadows here?
      const iterators = [];
      const replacements = [];
      const dependents = [];

      let iterator = document.createTreeWalker(root, Filter, Acceptor);
      let current;

      iterators.push(iterator);

      // handle any descendents
        while (true) {
          current = iterator?.nextNode();
          if ( ! current ) {
            if ( iterators.length ) {
              iterator = iterators.shift();
              current = iterator.currentNode;
              // Note:
                // we need isBangTag here because a node that doesn't pass 
                // Acceptor.accept will stop show up as the first currentNode
                // in a tree iterator
              if ( isBangTag(current) ) {
                if ( !TRANSFORMING.has(current) ) {
                  TRANSFORMING.add(current);
                  const target = current;
                  replacements.push(() => transformBang(target));
                }
              }
              continue;
            } else break;
          }

          // handle root node
            // Note:
              // it's a special case because it will be present in the iteration even if
              // the NodeFilter would filter it out if it were not the root
            // Note:
              // a small optimization is replace isBangTag by the following check
              // we don't need isBangTag here because it's already passed the 
              // equivalent check in Acceptor.acceptNode
          if ( current.nodeType === Node.COMMENT_NODE ) {
            if ( !TRANSFORMING.has(current) ) {
              TRANSFORMING.add(current);
              const target = current;
              replacements.push(() => transformBang(target));
            }
          }

          dependents.push(current);

          if ( current.shadowRoot instanceof ShadowRoot ) {
            iterators.push(document.createTreeWalker(current.shadowRoot, Filter, Acceptor)); 
          }
        }

      let i = 0;
      while(replacements.length) {
        replacements.pop()();
        if ( RESPONSIVE_MEDIATION && allDependents ) {
          i++;
          if ( i < batchSize ) continue;
          i = 0;
          if ( useFrame ) {
            await nextFrame();
          } else {
            await sleep(yieldTime);
          }
        }
      }

      if ( allDependents ) {
        return dependents
          .map(actualElement)
          .filter(el => el && !el.hasAttribute('lazy'));
      } else return;
    }


    function cookListeners(root) {
      const that = root.getRootNode().host;
      DEBUG && console.log({root, that});
      const listening = select(root, USE_XPATH ? X_LISTENING : CONFIG.EVENTS);
      DEBUG && console.log({listening});
      if ( USE_XPATH ) {
        listening.forEach(({name, value, ownerElement:node}) => handleAttribute(name, value, {node, originals: true}));
      } else {
        listening.forEach(node => that.handleAttrs(node.attributes, {node, originals: true}));
      }

      if ( USE_XPATH ) {
        // new style event listeners (only with XPath)
        const newListening = select(root, X_NEWLISTENING);
        newListening.forEach(({name, value, ownerElement:node}) => handleNewAttribute(name, value, {node, originals: true}));
      }
    }


    function actualElement(node) {
      const el = node.nodeType === Node.COMMENT_NODE ? 
        node.linkedCustomElement 
        : 
        node 
      ;
      //console.log(node, el);
      return el;
    }

    // NOTE: I'll have to add auto-detected functions to the node
    // before this point, so they can be found here
    // but after (I think) vv does it's processing. (I hope we can do this with current flow)
    function getAncestor(node, value) {
      if ( node ) {
        const currentPath = [PARENT_PATH + ONE_HIGHER];
        while( node ) {
          if ( node[value] instanceof Function ) return currentPath.join(EMPTY);

          node = node.getRootNode().host;
          currentPath.push( 'getRootNode().host.' );
        }
      }
      return null;
    }

    function isBangTag(node) {
      return node.nodeType === Node.COMMENT_NODE && getBangDetails(node)[0].match(DOUBLE_BARREL);
    }

    function isDocument(node) {
      return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
        node.nodeType === Node.DOCUMENT_NODE
      ;
    }

    function getBangDetails(node) {
      const text = node.textContent.trim();
      const [name, ...data] = text.split(/[\s\t]/g);
      return [name.trim(), data.join(' ')];
    }

    function getNodeDetails(node) {
      switch(node.nodeType) {
        case Node.COMMENT_NODE:
          return getBangDetails(node);
        case Node.ELEMENT_NODE:
          return [node.localName];
      }
    }

    async function cook(markup, state) {
      let cooked = EMPTY;
      if ( !state._self ) {
        try {
          Object.defineProperty(state, '_self', {value: state});
        } catch(e) {
          say('warn!',
            `Cannot add '_self' self-reference property to state. 
              This enables a component to inspect the top-level state object it is passed.`
          );
        }
      }
      if ( !state._host ) {
        const _host = this;
        try {
          Object.defineProperty(state, '_host', {value: _host});
        } catch(e) {
          say('warn!',
            `Cannot add '_host' self-reference property to component host. 
              This enables a component to inspect its Shadow Host element`
          );
        }
      }

      try {
        with(state) {
          cooked = await eval("(async function () { return await _FUNC`${{state}}"+markup+"`; }())");  
        }
        return cooked;
      } catch(error) {
        say('error!', 'Template error', {markup, state, error});
        throw error;
      }
    }

    async function _FUNC(strings, ...vals) {
      const s = Array.from(strings);
      const ret =  await _c$(s, ...vals);
      return ret;
    }

    function createElement(name, data) {
      return toDOM(`<${name} ${data}></${name}>`).firstElementChild;
    }

    function toDOM(str) {
      DIV.replaceChildren();
      DIV.insertAdjacentHTML(POS, `<template>${str}</template>`);
      return DIV.firstElementChild.content;
    }

    async function becomesTrue(check, key) {
      const WaitKey = key || check;
      let waiters = Waiters.get(WaitKey);

      if ( ! waiters ) {
        waiters = _becomesTrue(check).then(checkResult => {
          setTimeout(() => Waiters.delete(WaitKey), GC_TIMEOUT);
          return checkResult; 
        });
        Waiters.set(WaitKey, waiters);
      }
      const pr = new Promise(resolve => waiters.then(resolve));
      return pr;
    }

    async function _becomesTrue(check) {
      return new Promise(async res => {
        while(true) {
          await nextFrame();
          if ( check() ) break;
        }
        res(true);
      });
    }

    // this is to optimize using becomesTrue so we don't start a new timer
    // for every becomesTrue function call (in the case of the cache check, anyway)
    // we can use this pattern to apply to other becomesTrue calls like loaded
    async function cacheHasKey(key) {
      const cacheKey = `cache:${key}`;
      const funcKey = `checkFunc:${key}`;
      let checkFunc = Waiters.get(funcKey);
      if ( ! checkFunc ) {
        checkFunc = () => CACHE.has(key);
        Waiters.set(funcKey,checkFunc);
      }
      return becomesTrue(checkFunc, cacheKey);
    }

    async function sleep(ms) {
      return new Promise(res => setTimeout(res, ms));
    }
    
    async function nextFrame() {
      return new Promise(res => requestAnimationFrame(res));
    }

    function isUnset(x) {
      return x === undefined || x === null;
    }

    function say(mode, ...stuff) {
      (DEBUG || mode === 'error' || mode.endsWith('!')) && MOBILE && !LIGHTHOUSE && alert(`${mode}: ${stuff.join('\n')}`);
      (DEBUG || mode === 'error' || mode.endsWith('!')) && console[mode.replace('!',EMPTY)](...stuff);
    }

    function isMobile() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
      ];

      return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      });
    }
  
    function trace(msg = EMPTY) {
      const tracer = new Error('Trace');
      console.log(msg, 'Call stack', tracer.stack);
    }

    function dateString(date) {
      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() - (offset*60*1000))
      return date.toISOString().split('T')[0];
    }

    function clone(o) {
      return JSON.parse(JS(o));
    }
}());


