"use strict";
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


            //載入 mapbox  3d 地形 圖資:
            //使用 自訂 dem

            //#region 
            //// map.addSource('mapbox-dem', {
            ////     'type': 'raster-dem',
            ////     'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            ////     'tileSize': 512, //128  512
            ////     //'maxzoom': 14
            //// });
            ////map.setTerrain({ 'source': 'mapbox-dem' }); //, 'exaggeration': 1.5  最好不要加
            //#endregion


            //自定 3d 地形 (tribo) 256    PS:若 mapbox 畫面晃動地形錯亂,表示該處應該有地形,通常是產圖漏產所導致
            //let url: string;
            //url = "http://" + tribo_map.ip_server + "/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256";

            //let url = "http://" + "1.34.14.150" + "/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256";
            //let url = "https://" + "1.34.14.150" + "/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256";
            let url = "https://" + "tribomap.ddns.net" + "/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256";
            map.addSource('custom-terrain', {
                'type': 'raster-dem',
                'tiles': [
                    //"http://114.32.49.78/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256"   //不要用  https 有時無法連
                    //"http://localhost/tile/rgbtile.ashx?scale={z}&x={x}&y={y}&size=256"   // (本機)不要用  https 有時無法連
                    url

                    // 測試 : http://localhost/tile/rgbtile.ashx?scale=14&x=13700&y=7066&size=256
                    // 測試 : http://114.32.49.78/tile/rgbtile.ashx?scale=14&x=13700&y=7066&size=256
                ],
                'tileSize': 256,
                'encoding': 'mapbox',
                'maxzoom': 16 //有設定此值,當 zoom 超過時,不會再跟後端要圖資,至少要出到 16 , 否則 mapbox 會用它的 dtm 去補
            });
            map.setTerrain({ 'source': 'custom-terrain' }); //, 'exaggeration': 1.5 最好不要加

            document.getElementById('map').style.display = '';// 移除 預設 layers後 ;回復 展示

            console.log("custom-terrain : "+url);

            //map.showTerrainWireframe = true;
            //map.showLayers3DWireframe = true;

        });
        
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
}
//靜態屬性:
/**是否 為 tribo_map.html (展示 向量 圖資)*/
WinOnLoad.is_tribomap = true;

