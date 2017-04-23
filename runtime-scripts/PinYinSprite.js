const py = require('PinYin');
const phonetic_symbol = require('phonetic-symbol')
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
        menu: 'PinYin/PinYinSprite'
    },
    
    properties: {
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
        _dataID: '',
        PinyinSpriteFrames:[cc.SpriteAtlas],
        spriteframeGroup:{
            default:0,
            tooltip:'默认纹理集组号',
        },
        spriteframe_prefix:{
            default:'image_',
            tooltip:'纹理集名称前缀'
        }
    },
     onLoad () {
        if(CC_EDITOR) {
            this._debouncedUpdateLabel = debounce(this.updateLabel, 200);
        }        
    
        this.fetchRender();
        // this.psf = this.PinyinSpriteFrames[this.spriteFrameGroup];
    },

    fetchRender () {
        let layout = this.node.getComponent(cc.Layout);
        if (layout) {
            this.layout = layout;
            this.updateLabel();
            return;
        } 
    },
    setString(str){
        this.pinyinString = str;
    },
    resetSpriteRender(arr){
        this.node.removeAllChildren();
        this.pysf = this.PinyinSpriteFrames[this.spriteframeGroup]
        if(this.pysf === undefined){
            cc.error('no spriteframe group');
            return;
        }
        arr.forEach(e=>{
            let arr_letter = e.split('');
            arr_letter.forEach(w=>{
                let node = this.spriteBuilder(w);
                if(node!==null)
                this.node.addChild(node);
            })
        })
    },
    spriteBuilder(word){
        let newnode = new cc.Node();
        let sprite = newnode.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SIMPLE;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        sprite.trim = false;

        if(phonetic_symbol[word]!==undefined){
            let ws = phonetic_symbol[word].split('');   
            try{
                if(ws[0]==='i')
                ws[0] = 'i0'

                sprite.spriteFrame =  this.pysf.getSpriteFrame(this.spriteframe_prefix+ws[0]);
            }catch(e){
                cc.error('no'+this.spriteframe_prefix+ws[0])
                return null;
            }


            let tone = new cc.Node();
            let tone_sprite = tone.addComponent(cc.Sprite);
            tone_sprite.type = cc.Sprite.Type.SIMPLE;
            tone_sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            tone_sprite.trim = false;
            try{
                tone_sprite.spriteFrame =  this.pysf.getSpriteFrame(this.spriteframe_prefix+'tone'+ws[1]);
                newnode.addChild(tone);
                if(sprite.spriteFrame===undefined){
                    cc.error('no   '+this.spriteframe_prefix+'tone'+ws[1]);
                    return null;
                }
            }catch(e){
                cc.error('error');
                return null;
            }
            if(ws[0]==='v'){
                tone.y += tone.height*(1/7);
            }
        }else{
            try{
                sprite.spriteFrame =  this.pysf.getSpriteFrame(this.spriteframe_prefix+word);
                if(sprite.spriteFrame===undefined){
                    cc.error('no   '+this.spriteframe_prefix+word);
                    return null;
                }
                
            }catch(e){
                cc.error('error');
                return null;
            }
           
        }

        return newnode;
    },
    updateLabel () {
        
        if (!this.layout) {
            cc.error('Failed to layout sprite, layout component is invalid!');
            return;
        }
        if(this.PinyinSpriteFrames.length<1){
            cc.error('At least one PinyinSpriteFrames');
            return;
        }
        var s = [];
        py(this.pinyinString).forEach(e=>{
                s.push(e[0]);
        });

        this.resetSpriteRender(s);
 
    }

});
