/* React */
import React, { Component, Children } from 'react';
import { StyleSheet, View, LayoutAnimation } from 'react-native';

//+------------------------------------------------------------------+
//| Module Name: PannableMenu                                        |
//| Module Purpose: make your animations cool                        |
//| Function: set components in the left and right view              |
//+------------------------------------------------------------------+

/********************************************************************/
/*                          global values                           */
/********************************************************************/
const Dimensions = require('Dimensions');
const { width } = Dimensions.get('window');
const STR_LEFT = 'LeftView'
const STR_RIGHT = 'RightView'
const MAX_LEFT = width
const MIN_LEFT = -width

/********************************************************************/
/*                          SwipeableView                           */
/* props: isVisibleLeft     -> true/false if the left is opened     */
/********************************************************************/
export class SwipeableView extends Component{
    constructor(props) {
        super(props)

        // 実際に表示するコンポーネント
        this.LeftToRight = this.changeTheOrderLeftToRight(this.props)
        this.state = {
            rightPosition: this.props.isVisibleLeft ? MIN_LEFT : MAX_LEFT,
        }
    }

    /*******左→右の順にしてchildren配列を返す*********/
    changeTheOrderLeftToRight(props) {
        const arrayComponent = React.Children.toArray(props.children)
        let LeftToRight = new Array()
        let errCheck = ''

        // 全ての子コンポーネントを探索する
        React.Children.forEach(this.props.children, (child) => {
            let strType = child.type + ''
            strType = strType.substring(9, strType.indexOf('(props)'))

            // Leftを最初にする
            if(STR_LEFT === strType) {
                LeftToRight.push(arrayComponent[0])
                errCheck += '1'
            }
            else if(STR_RIGHT === strType){
                LeftToRight.push(arrayComponent[1])
                errCheck += '10'
            }
            else {
                errCheck += '01'
            }
        })

        // エラーがあるかチェックする
        if(('110' !== errCheck) &&
            ('101' !== errCheck)) {
                if('1' === errCheck) {
                    throw new Error('you have to add RightView in SwipeableView, Error code:' + errCheck)
                }
                else if ('0' === errCheck) {
                    throw new Error('you have to add LeftView in SwipeableView. Error code:' + errCheck)
                }

                throw new Error('Something wrong with your configuration of SwipeableView. Error code:' + errCheck)
            }

        return LeftToRight
    }

    /**********propsが変更された場合************/
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        // 子コンポーネントは必ず更新する
        this.LeftToRight = this.changeTheOrderLeftToRight(nextProps)

        // 比較して異なれば更新
        if(nextProps.isVisibleLeft != this.props.isVisibleLeft) {
            this.swipe(nextProps.isVisibleLeft)
        }
    }

    /**************左へ移動***************/
    swipe(isVisibleLeft) {
        this.startLayoutAnimation()
        this.setState({
            rightPosition: isVisibleLeft ? MIN_LEFT : MAX_LEFT,
        })
    }

    /***********アニメーション************/
    startLayoutAnimation() {
        LayoutAnimation.configureNext({
            duration: 700,
            create: {
                type: LayoutAnimation.Types.spring,
                property: LayoutAnimation.Properties.opacity,
                springDamping: 1.0
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 0.9
            }
        });
    }

    /************レンダー*************/
    render() {
        return (
            <View style={this.props.style}>
                <View style={[styles.Container, {right: this.state.rightPosition / 2}]}>
                    {this.LeftToRight[0]}
                    {this.LeftToRight[1]}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        width: width * 2,
        flex: 1,
    },
})

/********************************************************************/
/*                            LeftView                              */
/********************************************************************/
export class LeftView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[this.props.style, {flex: 1}]}>
                {this.props.children}
            </View>
        )
    }
}

/********************************************************************/
/*                           RightView                              */
/********************************************************************/
export class RightView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[this.props.style, {flex: 1}]}>
                {this.props.children}
            </View>
        )
    }
}