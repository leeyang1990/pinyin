var py = require('PinYin')
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        pynode:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = 'hhas'//this.text;
        cc.log(py("少年"));

        // this.pynode.getComponent('PinYinSprite').setString('你好');
        // this.pynode.getComponent('PinYinSprite').pinyinString = '我不好'
        this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
            this.pynode.getComponent('PinYinSprite').pinyinString = '你好吗' 
        })))
        // cc.log(py.single_pinyin('少',{heteronym:true}));

    },

    // called every frame
    update: function (dt) {

    },
});
