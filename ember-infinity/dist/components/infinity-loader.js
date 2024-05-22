import { _ as _applyDecoratedDescriptor, a as _initializerDefineProperty } from '../_rollupPluginBabelHelpers-L-9AK1w0.js';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce, cancel } from '@ember/runloop';
import { action, set } from '@ember/object';
import { inject } from '@ember/service';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if this.shouldShow}}\n  <div\n    {{did-insert this.didInsertLoader this}}\n    {{did-update this._initialInfinityModelSetup @infinityModel}}\n    {{did-update this._loadStatusDidChange @hideOnInfinity}}\n    {{did-update this._loadStatusDidChange @reachedInfinity}}\n    class=\"{{this.loaderClassNames}}{{if this.viewportEntered \' in-viewport\'}}{{if\n        this.isDoneLoading\n        \' reached-infinity\'\n      }}\"\n    data-test-infinity-loader\n    ...attributes\n  >\n    {{#if (has-block)}}\n      {{yield this.infinityModelContent}}\n    {{else}}\n      {{#if this.isDoneLoading}}\n        <span>{{this.loadedText}}</span>\n      {{else}}\n        <span>{{this.loadingText}}</span>\n      {{/if}}\n    {{/if}}\n  </div>\n{{/if}}");

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;
let InfinityLoaderComponent = (_class = class InfinityLoaderComponent extends Component {
  /**
   * @public
   * @property eventDebounce
   * @default 50
   */
  get eventDebounce() {
    return this.args.eventDebounce ?? 50;
  }
  /**
   * @public
   * @property loadingText
   */
  get loadingText() {
    return this._loadingText || (this.args.loadingText ?? 'Loading Infinity Model...');
  }
  set loadingText(value) {
    this._loadingText = value;
  }
  /**
   * @public
   * @property loadedText
   */
  get loadedText() {
    return this._loadedText || (this.args.loadedText ?? 'Infinity Model Entirely Loaded.');
  }
  set loadedText(value) {
    this._loadedText = value;
  }
  /**
   * @public
   * @property hideOnInfinity
   * @default false
   */
  get hideOnInfinity() {
    return this.args.hideOnInfinity ?? false;
  }
  /**
   * @public
   * @property isDoneLoading
   * @default false
   */
  get isDoneLoading() {
    return this._isDoneLoading ?? this.args.isDoneLoading ?? false;
  }
  set isDoneLoading(value) {
    this._isDoneLoading = value;
  }
  /**
   * @public
   * @property developmentMode
   * @default false
   */
  get developmentMode() {
    return this.args.developmentMode ?? false;
  }
  /**
   * indicate to infinity-loader to load previous page
   *
   * @public
   * @property loadPrevious
   * @default false
   */
  get loadPrevious() {
    return this.args.loadPrevious ?? false;
  }
  /**
   * set if have scrollable area
   *
   * @public
   * @property scrollable
   */
  get scrollable() {
    return this.args.scrollable ?? null;
  }
  /**
   * offset from bottom of target and viewport
   *
   * @public
   * @property triggerOffset
   * @defaul 0
   */
  get triggerOffset() {
    return this.args.triggerOffset ?? 0;
  }
  /**
   * flag to show/hide the component
   *
   * @property shouldShow
   */
  get shouldShow() {
    return this._shouldShow ?? this.args.shouldShow ?? true;
  }
  set shouldShow(value) {
    this._shouldShow = value;
  }
  get loaderClassNames() {
    return 'infinity-loader '.concat(this.args.classNames || '').trim();
  }
  get infinityModelContent() {
    return Promise.resolve(this.args.infinityModel);
  }
  constructor() {
    super(...arguments);
    _initializerDefineProperty(this, "infinity", _descriptor, this);
    _initializerDefineProperty(this, "inViewport", _descriptor2, this);
    _initializerDefineProperty(this, "_loadingText", _descriptor3, this);
    _initializerDefineProperty(this, "_loadedText", _descriptor4, this);
    _initializerDefineProperty(this, "_isDoneLoading", _descriptor5, this);
    _initializerDefineProperty(this, "_shouldShow", _descriptor6, this);
    this._initialInfinityModelSetup();
  }

  /**
   * setup ember-in-viewport properties
   *
   * @method didInsertElement
   */
  didInsertLoader(element, [instance]) {
    /**
     * @public
     * @property loadingText
     */
    instance.loadingText = instance.loadingText || 'Loading Infinity Model...';
    /**
     * @public
     * @property loadedText
     */
    instance.loadedText = instance.loadedText || 'Infinity Model Entirely Loaded.';
    instance.elem = element;
    const options = {
      viewportSpy: true,
      viewportTolerance: {
        top: 0,
        right: 0,
        bottom: instance.triggerOffset,
        left: 0
      },
      scrollableArea: instance.scrollable
    };
    const {
      onEnter,
      onExit
    } = instance.inViewport.watchElement(element, options);
    onEnter(instance.didEnterViewport.bind(instance));
    onExit(instance.didExitViewport.bind(instance));
  }
  willDestroy() {
    super.willDestroy(...arguments);
    this._cancelTimers();
    this.infinityModelContent.then(infinityModel => {
      if (!this.isDestroyed) {
        infinityModel.off('infinityModelLoaded', this, this._loadStatusDidChange.bind(this));
      }
    });

    // this.removeObserver('infinityModel', this, this._initialInfinityModelSetup);
    // this.removeObserver('hideOnInfinity', this, this._loadStatusDidChange);
    // this.removeObserver('reachedInfinity', this, this._loadStatusDidChange);
  }

  /**
   * https://github.com/DockYard/ember-in-viewport#didenterviewport-didexitviewport
   *
   * @method didEnterViewport
   */
  didEnterViewport() {
    if (this.developmentMode || typeof FastBoot !== 'undefined' || this.isDestroying || this.isDestroyed) {
      return false;
    }
    if (this.loadPrevious) {
      return this._debounceScrolledToTop();
    }
    return this._debounceScrolledToBottom();
  }

  /**
   * https://github.com/DockYard/ember-in-viewport#didenterviewport-didexitviewport
   *
   * @method didExitViewport
   */
  didExitViewport() {
    this._cancelTimers();
  }

  /**
   * @method _initialInfinityModelSetup
   */
  _initialInfinityModelSetup() {
    this.infinityModelContent.then(infinityModel => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }
      infinityModel.on('infinityModelLoaded', this._loadStatusDidChange.bind(this));
      set(infinityModel, '_scrollable', this.scrollable);
      this.isDoneLoading = false;
      if (!this.hideOnInfinity) {
        this.shouldShow = true;
      }
      this._loadStatusDidChange();
    });
  }

  /**
   * @method _loadStatusDidChange
   */
  _loadStatusDidChange() {
    this.infinityModelContent.then(infinityModel => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }
      if (infinityModel.reachedInfinity) {
        this.isDoneLoading = true;
        if (this.hideOnInfinity) {
          this.shouldShow = false;
        }
      } else {
        this.shouldShow = true;
      }
    });
  }

  /**
   * only load previous page if route started on a page greater than 1 && currentPage is > 0
   *
   * @method _debounceScrolledToTop
   */
  _debounceScrolledToTop() {
    /*
     This debounce is needed when there is not enough delay between onScrolledToBottom calls.
     Without this debounce, all rows will be rendered causing immense performance problems
     */
    function loadPreviousPage(content) {
      if (typeof this.infinityLoad === 'function') {
        // closure action
        return this.infinityLoad(content, -1);
      } else {
        this.infinity.infinityLoad(content, -1);
      }
    }
    this.infinityModelContent.then(content => {
      if (content.firstPage > 1 && content.currentPage > 0) {
        this._debounceTimer = debounce(this, loadPreviousPage, content, this.eventDebounce);
      }
    });
  }

  /**
   * @method _debounceScrolledToBottom
   */
  _debounceScrolledToBottom() {
    /*
     This debounce is needed when there is not enough delay between onScrolledToBottom calls.
     Without this debounce, all rows will be rendered causing immense performance problems
     */
    function loadMore() {
      // resolve to create thennable
      // type is <InfinityModel|Promise|null>
      this.infinityModelContent.then(content => {
        if (typeof this.infinityLoad === 'function') {
          // closure action (if you need to perform some other logic)
          return this.infinityLoad(content);
        } else {
          // service action
          this.infinity.infinityLoad(content, 1).then(() => {
            if (content.canLoadMore) {
              this._checkScrollableHeight();
            }
          });
        }
      });
    }
    this._debounceTimer = debounce(this, loadMore, this.eventDebounce);
  }

  /**
   * recursive function to fill page with records
   *
   * @method _checkScrollableHeight
   */
  _checkScrollableHeight() {
    if (this.isDestroying || this.isDestroyed) {
      return false;
    }
    if (this._viewportBottom() > this.elem.getBoundingClientRect().top) {
      // load again
      this._debounceScrolledToBottom();
    }
  }

  /**
   * @method _cancelTimers
   */
  _cancelTimers() {
    cancel(this._debounceTimer);
  }

  /**
    calculate the bottom of the viewport
     @private
    @method _viewportBottom
    @return Integer
   */
  _viewportBottom() {
    if (typeof FastBoot === 'undefined') {
      const isScrollable = !!this.scrollable;
      const viewportElem = isScrollable ? document.querySelector(this.scrollable) : window;
      return isScrollable ? viewportElem.getBoundingClientRect().bottom : viewportElem.innerHeight;
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "infinity", [inject], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "inViewport", [inject], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "_loadingText", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "_loadedText", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "_isDoneLoading", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "_shouldShow", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "_initialInfinityModelSetup", [action], Object.getOwnPropertyDescriptor(_class.prototype, "_initialInfinityModelSetup"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "_loadStatusDidChange", [action], Object.getOwnPropertyDescriptor(_class.prototype, "_loadStatusDidChange"), _class.prototype)), _class);
setComponentTemplate(TEMPLATE, InfinityLoaderComponent);

export { InfinityLoaderComponent as default };
//# sourceMappingURL=infinity-loader.js.map
