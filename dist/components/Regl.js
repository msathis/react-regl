"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _renderer = require("../renderer.js");

var _renderer2 = _interopRequireDefault(_renderer);

var _regl = require("regl");

var _regl2 = _interopRequireDefault(_regl);

var _ReglRootNode = require("../nodes/ReglRootNode");

var _ReglRootNode2 = _interopRequireDefault(_ReglRootNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Regl = function (_React$Component) {
    _inherits(Regl, _React$Component);

    _createClass(Regl, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.regl.destroy();
        }
    }]);

    function Regl(props, context) {
        _classCallCheck(this, Regl);

        var _this = _possibleConstructorReturn(this, (Regl.__proto__ || Object.getPrototypeOf(Regl)).call(this, props, context));

        _this.regl = null;
        _this.tick = null;

        _this.rootNode = null;
        return _this;
    }

    _createClass(Regl, [{
        key: "getChildContext",
        value: function getChildContext() {
            if (this.context.store) {
                return { store: this.context.store };
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var canvasRef = this.props.canvas || this.canvas;
            var gl = canvasRef.getContext("webgl", {
                alpha: false,
                antialias: false,
                stencil: false,
                preserveDrawingBuffer: false
            });

            var regl = (0, _regl2.default)({ gl: gl });
            regl.cache = {};
            this.regl = regl;

            if (this.props.onFrame) {
                this.tick = regl.frame(this.props.onFrame);
            }

            if (this.props.onReglInit && typeof this.props.onReglInit === "function") {
                this.props.onReglInit(regl);
            }

            this.rootNode = _renderer2.default.createContainer(new _ReglRootNode2.default(regl, this.context));

            this.regl.clear({
                color: this.props.color || [0, 0, 0, 1],
                depth: this.props.depth || 1
            });

            _renderer2.default.unbatchedUpdates(function () {
                _renderer2.default.updateContainer(_this2.props.children, _this2.rootNode, _this2);
            });

            this.rootNode.containerInfo.render();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            this.regl.clear({
                color: this.props.color || [0, 0, 0, 1],
                depth: this.props.depth || 1
            });

            if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
                this.regl.poll();
            }

            _renderer2.default.updateContainer(this.props.children, this.rootNode, this);
            this.rootNode.containerInfo.render();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            if (this.tick) {
                this.tick.cancel();
            }

            if (this.regl) {
                this.regl.destroy();
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            if (this.props.canvas) {
                return null;
            }

            return _react2.default.createElement("canvas", {
                ref: function ref(_ref) {
                    return _this3.canvas = _ref;
                },
                width: this.props.width,
                height: this.props.height
            });
        }
    }]);

    return Regl;
}(_react2.default.Component);
// In order to support react-redux apps
// the store needs to be passed to the reconciler on context


exports.default = Regl;
Regl.contextTypes = { store: _propTypes2.default.object };
Regl.childContextTypes = { store: _propTypes2.default.object };