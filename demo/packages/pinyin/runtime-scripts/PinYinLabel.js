// const py = require('PinYin');
// cc.Class({
//     extends: cc.Label,

//     properties: {
//         pinyinKey: {
//             default: '拼音',
//             multiline: true,
//             tooltip: '键入中文',
//             notify: function () {
//                 if (this._sgNode) {
//                     this._sgNode.setString(this.string);
//                     this._updateNodeSize();
//                 }
//             }
//         },
        // joinKey:{
        //     default:' ',
        //     tooltip: '分割符',
        // },
//         string: {
//             override: true,
//             tooltip: '拼音',
//             get: function () {
                // var s = [];
                // py(this.pinyinKey).forEach(e=>{
                //     s.push(e[0]);
                // });
                // return s.join(this.joinKey);
//             },
//             set: function (value) {
//                 cc.warn('set the property pinyinKey');
//             }
//         },
//     }
// });

//################################ 组合优于继承 #############################

const py = require('PinYin');

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
        menu: 'PinYin/PinYinLabel'
    },
    
    properties: {
        joinKey:{
            // default:' ',
            tooltip: '分割符',
            get () {
                return this._joinKey;
            },
            set (val) {
                if (this._joinKey !== val) {
                    this._joinKey = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.updateLabel();
                    }
                }
            }, 
        },
        _joinKey:'',
        pinyinString: {
            // default:'d',
            tooltip:'汉字字符',
            get () {
                return this._dataID;
            },
            set (val) {
                if (this._dataID !== val) {
                    this._dataID = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.fetchRender();
                    }
                }
            }
        },
        _dataID: ''
    },
    
    onLoad () {
        if(CC_EDITOR) {
            this._debouncedUpdateLabel = debounce(this.updateLabel, 200);
        }        
    
        this.fetchRender();
    },

    fetchRender () {
        let label = this.getComponent(cc.Label);
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        } 
    },

    updateLabel () {
        if (!this.label) {
            cc.error('Failed to update label, label component is invalid!');
            return;
        }
                var s = [];
                py(this.pinyinString).forEach(e=>{
                    s.push(e[0]);
                });
                // return s.join(this.joinKey);
        let localizedString = s.join(this.joinKey);
        if (localizedString) {
            this.label.string = s.join(this.joinKey);
        }
    }
});
