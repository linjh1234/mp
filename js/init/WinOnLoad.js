"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class WinOnLoad {
    //物件屬性:
    constructor() {
    }
    static init() {
        let k = 1;
        //console.log("WinOnLoad.init()");
        WinOnLoad.loadWasm();
    }
    
    /**載入所有wasm模組,全部載入完成再執行 winOnLoad()*/
    static loadWasm() {
        WebWasm.initStaticVar();
    }
    
    /**loadWasm() complete -->winOnLoad ()*/
    static winOnLoad() {
        console.log("WinOnLoad.winOnLoad()");
        
         let map = new mapboxgl.Map({
            accessToken: WebWasm.MapboxModule.ccall('get_accessToken', 'string', [], []),
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',//無中文字;不會發生  glyphs > 65535 not supported 錯誤
            //style: 'mapbox://styles/mapbox/satellite-streets-v12',
            //style: 'mapbox://styles/mapbox/streets-v12', // streets 一定要載入 mapbox style 否則很多功能都無法用
            center: [121.506, 25.045], // [121.506,25.045]  [120.892, 23.821]
            preserveDrawingBuffer: true,//讓畫面可供存檔
            language: "zh-Hant",
            projection: 'globe',//預設 投影模式 (若都不指定,系統有時會不穏定,err!!,ex:zoom=2時 )
            //zoom: 7.2, //14
            zoom: 14 
         });

        //return;

        map.on('load', function () {


            let url = "https://" + "tribomap.ddns.net" + "/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256";
            map.addSource('custom-terrain', {
                'type': 'raster-dem',
                'tiles': [
                    url
                ],
                'tileSize': 256,
                'encoding': 'mapbox',
                'maxzoom': 16 //有設定此值,當 zoom 超過時,不會再跟後端要圖資,至少要出到 16 , 否則 mapbox 會用它的 dtm 去補
            });
            map.setTerrain({ 'source': 'custom-terrain' }); //, 'exaggeration': 1.5 最好不要加

            document.getElementById('map').style.display = '';// 移除 預設 layers後 ;回復 展示




        });

        WinOnLoad.loadJSON();
        
        return;
        
        //#region for test 副模組 功能 測試:
        /*
        //for test 副模組 功能 測試:----------
        let moduleObj;
        let module_name: string;
        let is_enable: boolean;
        let module_key: string;

        moduleObj = WebWasm.MapboxModule;
        module_name = moduleObj.ccall('get_userData_name_SM', 'string', [], []);
        is_enable = moduleObj.ccall('getEnable_SM', 'number', [], []);//0-->false ; 1--->true
        module_key = moduleObj.ccall('get_userData_key_SM', 'string', [], []);

        console.log("module_name= " + module_name + " ; is_enable= " + is_enable + " ; module_key= " + module_key);
        //-----------------------
        */
        //#endregion
        //tribo_map.test();
        //建立並設定所有class的static成員變數
        SetAllClassStaticVar.setAllStaticVars();
        //載入 所有 tribo_map 圖資,並繪製於 mapbox
        if (WinOnLoad.is_tribomap)
            tribo_map.init();
        else
            tribo_img.init();
    }


    static loadJSON() {
        return __awaiter(this, void 0, void 0, function* () {

            console.log("WinOnLoad.loadJSON()");

            yield WinOnLoad.init_data();

        });
    }

    static init_data() {
        return __awaiter(this, void 0, void 0, function* () {

            console.log("WinOnLoad.init_data()");

            

        });
    }



}


 




//靜態屬性:
/**是否 為 tribo_map.html (展示 向量 圖資)*/
WinOnLoad.is_tribomap = true;

