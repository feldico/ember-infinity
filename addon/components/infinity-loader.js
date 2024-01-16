import { cancel, debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class InfinityLoaderComponent extends Component {
  @service infinity;
  @service inViewport;

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
    return this.args.loadingText ?? 'Loading Infinity Model...';
  }
  /**
   * @public
   * @property loadedText
   */
  get loadedText() {
    return this.args.loadedText ?? 'Infinity Model Entirely Loaded.';
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
  @tracked isDoneLoading = false;
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
   * offset from bottom of target and viewport
   *
   * @public
   * @property triggerOffset
   * @defaul 0
   */
  triggerOffset = 0;
  /**
   * flag to show/hide the component
   *
   * @property shouldShow
   */
  @tracked shouldShow = true;

  get infinityModelContent() {
    return Promise.resolve(this.args.infinityModel);
  }

  constructor() {
    super(...arguments);

    this.addObserver('infinityModel', this, this._initialInfinityModelSetup);
    this._initialInfinityModelSetup();

    this.addObserver('hideOnInfinity', this, this._loadStatusDidChange);
    this.addObserver('reachedInfinity', this, this._loadStatusDidChange);
  }

  /**
   * setup ember-in-viewport properties
   *
   * @method didInsertElement
   */
  @action
  didInsertLoader(element, [instance, triggerOffset, scrollable]) {
    instance.elem = element;

    let options = {
      viewportSpy: true,
      viewportTolerance: {
        top: 0,
        right: 0,
        bottom: triggerOffset,
        left: 0,
      },
      scrollableArea: scrollable,
    };
    const { onEnter, onExit } = instance.inViewport.watchElement(
      element,
      options
    );

    onEnter(instance.didEnterViewport.bind(instance));
    onExit(instance.didExitViewport.bind(instance));
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this._cancelTimers();

    this.infinityModelContent.then((infinityModel) => {
      infinityModel.off(
        'infinityModelLoaded',
        this,
        this._loadStatusDidChange.bind(this)
      );
    });

    this.removeObserver('infinityModel', this, this._initialInfinityModelSetup);
    this.removeObserver('hideOnInfinity', this, this._loadStatusDidChange);
    this.removeObserver('reachedInfinity', this, this._loadStatusDidChange);
  }

  /**
   * https://github.com/DockYard/ember-in-viewport#didenterviewport-didexitviewport
   *
   * @method didEnterViewport
   */
  didEnterViewport() {
    if (
      this.developmentMode ||
      typeof FastBoot !== 'undefined' ||
      this.isDestroying ||
      this.isDestroyed
    ) {
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
    this.infinityModelContent.then((infinityModel) => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      infinityModel.on(
        'infinityModelLoaded',
        this._loadStatusDidChange.bind(this)
      );
      infinityModel._scrollable = this.args.scrollable;
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
    this.infinityModelContent.then((infinityModel) => {
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
      if (typeof this.args.infinityLoad === 'function') {
        // closure action
        return this.args.infinityLoad(content, -1);
      } else {
        this.infinity.infinityLoad(content, -1);
      }
    }

    this.infinityModelContent.then((content) => {
      if (content.firstPage > 1 && content.currentPage > 0) {
        this._debounceTimer = debounce(
          this,
          loadPreviousPage,
          content,
          this.eventDebounce
        );
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
      this.infinityModelContent.then((content) => {
        if (typeof this.args.infinityLoad === 'function') {
          // closure action (if you need to perform some other logic)
          return this.args.infinityLoad(content);
        } else {
          // service action
          this.infinity.infinityLoad(content, 1).then(() => {
            if (content.canLoadMore) {
              if (this.args.checkScrollableHeight) {
                this.args.checkScrollableHeight();
              } else {
                this._checkScrollableHeight();
              }
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
      let isScrollable = !!this.args.scrollable;
      let viewportElem = isScrollable
        ? document.querySelector(this.args.scrollable)
        : window;
      return isScrollable
        ? viewportElem.getBoundingClientRect().bottom
        : viewportElem.innerHeight;
    }
  }
}

export default InfinityLoaderComponent;
