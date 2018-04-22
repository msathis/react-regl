'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactReconciler = require('react-reconciler');

var _reactReconciler2 = _interopRequireDefault(_reactReconciler);

var _emptyObject = require('fbjs/lib/emptyObject');

var _emptyObject2 = _interopRequireDefault(_emptyObject);

var _DrawNode = require('./nodes/DrawNode.js');

var _DrawNode2 = _interopRequireDefault(_DrawNode);

var _Node = require('./nodes/Node.js');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Lifecyle of the renderer
 */
var ReglRenderer = (0, _reactReconciler2.default)({
  now: function now() {
    return Date.now();
  },

  /**
   * Create component instance
   */
  createInstance: function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    if (type === 'Draw') {
      return new _DrawNode2.default(props, hostContext.regl);
    }

    return new _Node2.default(props, hostContext.regl);
  },


  mutation: {
    commitMount: function commitMount(domElement, type, newProps, internalInstanceHandle) {
      //noop
      debugger;
    },
    commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
      //TODO update the drawNodes props
      // regenerate the instances draw command if the shaders have changed
      // If the executionProps change just redraw
      // if the definitionProps change need to re init the drawCall
      //instance.executionProps = newProps;
      if (instance.updateProps) {
        instance.updateProps(oldProps, newProps);
      }
    },


    /* resetTextContent(domElement) {
     *   domElement.textContent = '';
     * },
      * commitTextUpdate(
     *   textInstance,
     *   oldText,
     *   newText,
     * ){
     *   textInstance.nodeValue = newText;
     * },*/

    appendChild: function appendChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },
    appendChildToContainer: function appendChildToContainer(container, child) {
      container.appendChild(child);
    },
    insertBefore: function insertBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },
    insertInContainerBefore: function insertInContainerBefore(container, child, beforeChild) {
      debugger;
      /* if (container.nodeType === COMMENT_NODE) {
       *   (container.parentNode: any).insertBefore(child, beforeChild);
       * } else {
       *   container.insertBefore(child, beforeChild);
       * }*/
    },
    removeChild: function removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    },
    removeChildFromContainer: function removeChildFromContainer(container, child) {
      debugger;
      container.removeChild(child);
    }
  },

  /**
   * Append the children. If children are wrapped inside a parent container, then push all the children
   * inside it else we create a property called `document` on a parent node and append all the childrens
   * to it and render them with `property_name.render()`.
   */
  appendInitialChild: function appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
    /* if (parentInstance.appendChild) {
     *   parentInstance.appendChild(child);
     * } else {
     *   parentInstance.document = child;
     * }*/
  },
  appendChild: function appendChild(parentInstance, child) {
    debugger;
    /* if (parentInstance.appendChild) {
     *   parentInstance.appendChild(child);
     * } else {
     *   parentInstance.document = child;
     * }*/
  },
  removeChild: function removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  insertBefore: function insertBefore(parentInstance, child, beforeChild) {
    debugger;
    // noob
  },


  /**
   * Final call / check before flushing to the host environment
   */
  finalizeInitialChildren: function finalizeInitialChildren(testElement, type, props, rootContainerInstance) {
    return false;
  },


  /**
   * Prepare the update with new props
   */
  prepareUpdate: function prepareUpdate(instance, type, oldProps, newProps, hostContext) {
    return true;
  },
  commitMount: function commitMount(instance, type, newProps, rootContainerInstance, internalInstanceHandle) {
    debugger;
    // noop
  },


  /**
   * Keeps track of the current location in tree
   */
  getRootHostContext: function getRootHostContext(root) {
    return root;
    //return emptyObject;
  },
  getChildHostContext: function getChildHostContext(root) {
    return root;
  },
  getPublicInstance: function getPublicInstance(inst) {
    debugger;
    return inst;
  },


  /**
   * Disable callbacks during DOM manipulation
   */
  prepareForCommit: function prepareForCommit() {
    // noop
  },
  resetAfterCommit: function resetAfterCommit() {
    // noop
  },
  shouldSetTextContent: function shouldSetTextContent(props) {
    return false;
  },
  resetTextContent: function resetTextContent(testElement) {
    // noop
  },
  createTextInstance: function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    return text;
  },
  commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
    debugger;
    textInstance.chidren = newText;
  },
  mountIndeterminateComponent: function mountIndeterminateComponent() {
    debugger;
  },


  useSyncScheduling: true
});

exports.default = ReglRenderer;