"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
  function Node() {
    _classCallCheck(this, Node);

    this.parent = null;
    this.children = [];
  }

  _createClass(Node, [{
    key: "appendChild",
    value: function appendChild(child) {
      child.parent = this;
      this.children.push(child);
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var index = this.children.indexOf(child);
      child.parent = null;
      this.children.splice(index, 1);
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(child, beforeChild) {
      var index = this.children.indexOf(beforeChild);
      child.parent = this;
      this.children.splice(index, 0, child);
    }
  }]);

  return Node;
}();

exports.default = Node;