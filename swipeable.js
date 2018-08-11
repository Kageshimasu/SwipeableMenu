/* React */
import React, { Component, Children } from 'react';
import { StyleSheet, View, LayoutAnimation } from 'react-native';

//+------------------------------------------------------------------+
//| Module Name: PannableMenu                                        |
//| Module Purpose: make your animations cool                        |
//| Function: manage set the leftcomp and set the func to get back   |
//+------------------------------------------------------------------+

/********************************************************************/
/*                          global values                           */
/********************************************************************/
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STR_LEFT = 'LeftView'
const STR_RIGHT = 'RightView'

/********************************************************************/
/*                          SwipeableView                           */
/* props: isOpend                   -> true/false if it's opened    */
/*        onCloseThisByGesture      -> function when being closed   */
/*        leftComponent             -> component after u gestured   */
/*        lockGesture               -> true/false if u wanna lock   */
/********************************************************************/
export class SwipeableView extends Component{
    constructor(props) {
        super(props)

        // 実際に表示するコンポーネント
        this.LeftToRight = this.changeTheOrderLeftToRight(this.props)
        this.state = {
            rightPosition: this.props.isVisibleLeft ? 0 : width,
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        // 子コンポーネントは必ず更新する
        this.LeftToRight = this.changeTheOrderLeftToRight(nextProps)

        // 比較して異なれば更新
        if(nextProps.rightPosition !== this.state.rightPosition) {
            this.swipe(nextProps.isVisibleLeft)
        }
    }

    /**************左へ移動***************/
    swipe(isVisibleLeft) {
        this.startLayoutAnimation()
        this.setState({
            rightPosition: isVisibleLeft ? 0 : width,
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
            <View style={[styles.Container, {right: this.state.rightPosition}]}>
                {this.LeftToRight[0]}
                {this.LeftToRight[1]}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        width: width * 2,
        height: height,
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
            <View style={[this.props.style, {width: width, height: height}]}>
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
            <View style={[this.props.style, {width: width, height: height}]}>
                {this.props.children}
            </View>
        )
    }
}