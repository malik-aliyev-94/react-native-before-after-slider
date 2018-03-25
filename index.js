import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder, Dimensions, Image } from 'react-native';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const Before = (props) => (
  <View style={{flex: 1}}>
    <View style={{position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: props.state.width, height: props.state.height}}>
      {props.children}
    </View>
  </View>
);

const After = (props) => (
  <View style={{flex: 1, position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 9, overflow: 'hidden', left: props.state.left}}>
    <View style={{position: 'absolute', right: 0, top: 0, width: props.state.width, height: props.state.height}}>
      {props.children}
    </View>
  </View>
);

const DefaultDragger = (props) => (
  <View {...props.parent._panResponder.panHandlers} style={{height: props.state.height, width: props.state.draggerWidth, backgroundColor: 'transparent', position: 'absolute', top: 0, zIndex: 10, marginLeft: -props.state.draggerWidth/2, left: props.state.left}}>
    <View style={{opacity: .6, width: 50, height: 50, overflow: 'hidden', backgroundColor: '#FFF', borderRadius: 25, marginTop: (props.state.height/2-25)}}>
      <Image source={require('./arrows.png')} style={{width: 40, height: 40, margin: 5}} />
    </View>
  </View>
);

const Dragger = (props) => (
  <View {...props.parent._panResponder.panHandlers} style={{height: props.state.height, width: props.state.draggerWidth, position: 'absolute', top: 0, zIndex: 10, marginLeft: -props.state.draggerWidth/2, left: props.state.left}}>
    {props.children}
  </View>
);

export default class Compare extends Component {

  constructor(props) {
    super(props);

    const initial = props.initial ? props.initial : 0;
    const width = props.width ? props.width :  deviceWidth;
    const height = props.height ? props.height : width/2;
    const draggerWidth = props.draggerWidth || props.draggerWidth == 0 ? props.draggerWidth : 50;
    const onMove = props.onMove ? props.onMove : ()=>{};
    const onMoveStart = props.onMoveStart ? props.onMoveStart : ()=>{};
    const onMoveEnd = props.onMoveEnd ? props.onMoveEnd : ()=>{};

    this.state = {
      width,
      height,
      draggerWidth,
      currentLeft: initial,
      left: initial,
      dx: 0,
      onMove,
      onMoveStart,
      onMoveEnd
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.setState({dx: 0});
        this.state.onMoveStart();
      },

      onPanResponderMove: (event, gestureState) => {
        let dx = gestureState.dx;
        let left = this.state.currentLeft + dx;
        let { width, draggerWidth } = this.state;

        if ( left < 0 ) left = 0;
        else if ( left >= width) left = width;
        this.setState({ left });
        this.state.onMove();
      },

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.onMoveEnd();
        this.setState({currentLeft: this.state.left});
      }
    });
  }

  renderChildren = (props, state) => {
    return React.Children.map(props.children, child => {
      return React.cloneElement(child, {
        state,
        parent: this
      })
    })
  }

  render() {

    const { width, height, draggerWidth, left } = this.state;
    const { children } = this.props;


    return (
      <View style={{width, height, backgroundColor: '#f2f2f2'}}>
        {this.renderChildren(this.props, this.state)}
      </View>
    );
  }

}

export {
    Before,
    After,
    DefaultDragger,
    Dragger
};
