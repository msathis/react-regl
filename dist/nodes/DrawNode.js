'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Node2 = require('../nodes/Node.js');

var _Node3 = _interopRequireDefault(_Node2);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var reglWhitelist = ['vert', 'frag', 'primitive', 'offset', 'instances', 'elements', 'profile', 'depth', 'blend', 'stencil', 'cull', 'polygonOffset', 'scissor'];

function uniformArrayUnrollReducer(regl, definitionKey, reglProp, accum, value, index) {
  accum[reglProp + '[' + index + ']'] = regl.prop(definitionKey + '.' + reglProp + '[' + index + ']');
  return accum;
}

function attributesReducer(props, regl, definitionKey, acc, reglProp) {
  if (props[definitionKey][reglProp].buffer) {
    acc[reglProp] = _extends({}, props[definitionKey][reglProp]);
    acc[reglProp] = {
      buffer: regl.prop(definitionKey + '.' + reglProp + '.buffer')
    };
    return acc;
  }

  acc[reglProp] = regl.prop(definitionKey + '.' + reglProp);
  return acc;
}

function uniformsReducer(props, regl, definitionKey, acc, reglProp) {
  //Need to unroll array uniforms
  // https://github.com/regl-project/regl/issues/258
  // https://github.com/regl-project/regl/issues/373
  if (definitionKey === 'uniforms' && Array.isArray(props[definitionKey][reglProp]) && props[definitionKey][reglProp].filter(function (ele) {
    return Array.isArray(ele);
  }).length > 0) {
    var unrolled = [].concat(_toConsumableArray(Array(props[definitionKey][reglProp].length))).reduce(uniformArrayUnrollReducer.bind(this, regl, definitionKey, reglProp), {});
    return _extends({}, acc, unrolled);
  }

  acc[reglProp] = regl.prop(definitionKey + '.' + reglProp);
  return acc;
}

//Iterate over top level react component keys like attributes, uniforms, count, elements
function topLevelKeyReducer(reactProps, regl, reglDefinition, topLevelDefinitionKey) {
  if (reglWhitelist.indexOf(topLevelDefinitionKey) !== -1) {
    reglDefinition[topLevelDefinitionKey] = reactProps[topLevelDefinitionKey];
    return reglDefinition;
  }

  if (['attributes'].indexOf(topLevelDefinitionKey) !== -1) {
    reglDefinition[topLevelDefinitionKey] = Object.keys(reactProps[topLevelDefinitionKey]).reduce(attributesReducer.bind(this, reactProps, regl, topLevelDefinitionKey), {});
    return reglDefinition;
  }

  if (['uniforms'].indexOf(topLevelDefinitionKey) !== -1) {
    reglDefinition[topLevelDefinitionKey] = Object.keys(reactProps[topLevelDefinitionKey]).reduce(uniformsReducer.bind(this, reactProps, regl, topLevelDefinitionKey), {});
    return reglDefinition;
  }

  if (['string', 'number', 'boolean'].indexOf(_typeof(reactProps[topLevelDefinitionKey])) !== -1) {
    reglDefinition[topLevelDefinitionKey] = regl.prop(topLevelDefinitionKey);
    return reglDefinition;
  }

  if (reglWhitelist.indexOf(topLevelDefinitionKey) !== -1) {
    reglDefinition[topLevelDefinitionKey] = regl.prop(topLevelDefinitionKey);
    return reglDefinition;
  }

  return reglDefinition;
};

var DrawNode = function (_Node) {
  _inherits(DrawNode, _Node);

  function DrawNode(props, regl) {
    _classCallCheck(this, DrawNode);

    var _this = _possibleConstructorReturn(this, (DrawNode.__proto__ || Object.getPrototypeOf(DrawNode)).call(this, props, regl));

    _this.regl = regl;
    _this.setDrawState(props, regl);
    return _this;
  }

  /* Returns a regl 'definition' object based on the props passed to the react component node
   * that is traditionally used when defining a regl draw command
   * example
   *
   * regl({
   *
   *   // In a draw call, we can pass the shader source code to regl
   *   frag: `....`,
   *
   *   vert: `...}`,
   *
   *   attributes: {
   *     position: [
   *       [-1, 0],
   *       [0, -1],
   *       [1, 1]
   *     ]
   *   },
   *
   *   uniforms: {
   *     color: [1, 0, 0, 1]
   *   },
   *
   *   count: 3
   * })
   *
   */


  _createClass(DrawNode, [{
    key: 'getReglDrawDefinitionFromProps',
    value: function getReglDrawDefinitionFromProps(reactProps, regl) {
      return Object.keys(reactProps).reduce(topLevelKeyReducer.bind(this, reactProps, regl), {});
    }
  }, {
    key: 'updateProps',
    value: function updateProps(oldProps, newProps) {
      var _this2 = this;

      //TODO update the drawNodes props
      // regenerate the instances draw command if the shaders have changed
      // If the executionProps change update any attribute buffers
      // if the definitionProps change need to re init the drawCall
      this.executionProps.uniforms = newProps.uniforms;
      this.executionProps.count = newProps.count;

      if (newProps.attributes) {
        Object.keys(newProps.attributes).forEach(function (newAttributeKey) {
          if (!oldProps.attributes[newAttributeKey]) {}
          //TODO theres a new attribute passed to props. This needs to regenerate draw call?


          //the new attribute dosen't match the old, update the buffer
          if (JSON.stringify(oldProps.attributes[newAttributeKey] !== JSON.stringify(newProps.attributes[newAttributeKey]))) {
            _this2.executionProps.attributes[newAttributeKey](newProps.attributes[newAttributeKey]);
          }
        });
      }
    }
  }, {
    key: 'setDrawState',
    value: function setDrawState(props, regl) {
      this.lastProps = props;
      this.executionProps = _extends({}, props);

      //cache the 'execution time' attributes as regl buffers otherwise regl will attempt to bufferize on every draw call
      this.executionProps.attributes = (0, _lodash.reduce)(props.attributes, function (acc, value, key) {
        var buff = regl.buffer({
          data: value,
          usage: 'static',
          type: 'float32'
        });
        buff._buffer.id = key;

        acc[key] = buff;
        return acc;
      }, {});

      this.reglDef = this.getReglDrawDefinitionFromProps(props, regl);
      this.drawKey = JSON.stringify(this.reglDef);

      if (regl.cache[this.drawKey]) {
        this.drawCommand = regl.cache[this.drawKey];
      } else {
        this.drawCommand = regl(this.reglDef);
        regl.cache[this.drawKey] = this.drawCommand;
      }
    }
  }]);

  return DrawNode;
}(_Node3.default);

exports.default = DrawNode;