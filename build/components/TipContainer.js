function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";

const clamp = (value, left, right) => Math.min(Math.max(value, left), right);

class TipContainer extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      height: 0,
      width: 0
    });

    _defineProperty(this, "updatePosition", () => {
      const {
        container
      } = this.refs;

      if (!container || !container.offsetHeight || !container.offsetWidth) {
        return;
      }

      const {
        offsetHeight,
        offsetWidth
      } = container;
      this.setState({
        height: offsetHeight,
        width: offsetWidth
      });
    });
  }

  componentDidUpdate(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.updatePosition();
    }
  }

  componentDidMount() {
    setTimeout(this.updatePosition, 0);
  }

  render() {
    const {
      children,
      style,
      scrollTop,
      pageBoundingRect
    } = this.props;
    const {
      height,
      width
    } = this.state;
    const isStyleCalculationInProgress = width === 0 && height === 0;
    const shouldMove = style.top - height - 5 < scrollTop;
    const top = shouldMove ? style.bottom + 5 : style.top - height - 5; // doesn't work correctly (especially problems when using zoom factors)

    /*const left = clamp(
      style.left - width / 2,
      0,
      pageBoundingRect.width - width
    );*/

    let left = style.left - width / 2;

    if (left < 0) {
      left = 0;
    }

    const childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {
      onUpdate: () => {
        this.setState({
          width: 0,
          height: 0
        }, () => {
          setTimeout(this.updatePosition, 0);
        });
      },
      popup: {
        position: shouldMove ? "below" : "above"
      }
    }));
    return React.createElement("div", {
      className: "PdfHighlighter__tip-container",
      style: {
        visibility: isStyleCalculationInProgress ? "hidden" : "visible",
        top,
        left
      },
      ref: "container"
    }, childrenWithProps);
  }

}

export default TipContainer;