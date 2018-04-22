'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = require('../nodes/Node.js');

var _Node3 = _interopRequireDefault(_Node2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var x = 0;
var y = 0;

var drawNode = function drawNode(node) {
  if (node.drawCommand && node.children.length) {
    return node.drawCommand(node.executionProps, function drawCommandContext() {
      x = node.children.length;
      while (x--) {
        drawNode(node.children[x]);
      }
      x = 0;
      return;
    });
  }

  if (node.drawCommand && !node.children.length) {
    return node.drawCommand(node.executionProps);
  }

  if (!node.drawCommand && node.children.length) {
    y = node.children.length;
    while (y--) {
      drawNode(node.children[y]);
    }
    y = 0;
  }

  return null;
};

var ReglRootNode = function (_Node) {
  _inherits(ReglRootNode, _Node);

  function ReglRootNode(reglRef, context) {
    _classCallCheck(this, ReglRootNode);

    var _this = _possibleConstructorReturn(this, (ReglRootNode.__proto__ || Object.getPrototypeOf(ReglRootNode)).call(this, reglRef));

    _this.regl = reglRef;
    if (context.store) {
      _this.store = store;
    }
    return _this;
  }

  _createClass(ReglRootNode, [{
    key: 'render',
    value: function render() {
      drawNode(this);
    }
  }]);

  return ReglRootNode;
}(_Node3.default);

exports.default = ReglRootNode;