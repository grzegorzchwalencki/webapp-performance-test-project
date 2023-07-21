/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 79.91537818637693, "KoPercent": 20.084621813623066};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6527632678646051, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10744985673352435, 500, 1500, "engine104_Choose Size"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "engine204_Remove Product from Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine202_ProductDetails"], "isController": false}, {"data": [0.3645833333333333, 500, 1500, "engine204_CheckoutPage_login"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_CategoryPage"], "isController": false}, {"data": [0.0, 500, 1500, "engine201_butytrekkingowe_resultsPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_Product2Details"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_ProductDetails"], "isController": false}, {"data": [0.21768707482993196, 500, 1500, "engine102_AddToCart-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_Category2Page"], "isController": false}, {"data": [0.4098360655737705, 500, 1500, "engine204_Update Qty of product"], "isController": false}, {"data": [1.0, 500, 1500, "engine105_Category_itemsLimitUp"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "engine204_Remove Product from Cart-1"], "isController": false}, {"data": [0.20068027210884354, 500, 1500, "engine102_AddToCart-1"], "isController": false}, {"data": [0.2088607594936709, 500, 1500, "engine104_Add to Cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine102_ProductDetails"], "isController": false}, {"data": [0.3469387755102041, 500, 1500, "engine104_Remove Product from Cart-0"], "isController": false}, {"data": [0.22151898734177214, 500, 1500, "engine104_Add to Cart-0"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "engine104_Remove Product from Cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine1MainPage"], "isController": false}, {"data": [0.12637362637362637, 500, 1500, "engine204_Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_Product2Details"], "isController": false}, {"data": [0.35526315789473684, 500, 1500, "engine2CheckCart"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_ProductDetails"], "isController": false}, {"data": [0.13098591549295774, 500, 1500, "engine202_OutletCard"], "isController": false}, {"data": [1.0, 500, 1500, "engine103_ProductList_headlight_sorting_price"], "isController": false}, {"data": [0.39565217391304347, 500, 1500, "engine204_Cart Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "engine202_Change_Color_of_Product"], "isController": false}, {"data": [0.14772727272727273, 500, 1500, "engine104_CheckoutPage_login"], "isController": false}, {"data": [0.12719298245614036, 500, 1500, "engine204_Choose Size"], "isController": false}, {"data": [0.46923076923076923, 500, 1500, "engine204_Add to Cart2-0"], "isController": false}, {"data": [0.36923076923076925, 500, 1500, "engine204_Add to Cart2-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine105_categoryPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine205_categoryPage"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "engine104_Update Qty of product"], "isController": false}, {"data": [1.0, 500, 1500, "engine101_Searching_in_SearchingBar_butytrekkingowe"], "isController": false}, {"data": [1.0, 500, 1500, "engine205_Category_itemsLimitUp"], "isController": false}, {"data": [0.31683168316831684, 500, 1500, "engine1CheckCart"], "isController": false}, {"data": [0.05642633228840126, 500, 1500, "engine203_AddProduct_to_cart"], "isController": false}, {"data": [0.0, 500, 1500, "engine101_resultPage_limit_75"], "isController": false}, {"data": [0.0, 500, 1500, "engine201_resultsPage_2ndpage"], "isController": false}, {"data": [0.17272727272727273, 500, 1500, "engine104_Remove Product from Cart"], "isController": false}, {"data": [0.12962962962962962, 500, 1500, "engine202_AddToCart"], "isController": false}, {"data": [0.29523809523809524, 500, 1500, "engine104_Cart Checkout"], "isController": false}, {"data": [0.11242603550295859, 500, 1500, "engine102_AddToCart"], "isController": false}, {"data": [0.3508771929824561, 500, 1500, "engine204_Remove Product from Cart"], "isController": false}, {"data": [0.5319148936170213, 500, 1500, "engine204_CheckoutPage_login-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine102_Change_Color_of_Product"], "isController": false}, {"data": [0.4574468085106383, 500, 1500, "engine204_CheckoutPage_login-1"], "isController": false}, {"data": [0.061452513966480445, 500, 1500, "engine103_AddProduct_to_cart"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_CategoryPage"], "isController": false}, {"data": [0.0, 500, 1500, "engine101_resultsPage_2ndpage"], "isController": false}, {"data": [0.36153846153846153, 500, 1500, "engine104_Add to Cart2-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine103_ProductType_headlight"], "isController": false}, {"data": [0.15833333333333333, 500, 1500, "engine103_AddProduct_to_cart-0"], "isController": false}, {"data": [0.1362179487179487, 500, 1500, "engine102_OutletCard"], "isController": false}, {"data": [0.14166666666666666, 500, 1500, "engine103_AddProduct_to_cart-1"], "isController": false}, {"data": [0.0, 500, 1500, "engine101_butytrekkingowe_resultsPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine201_Searching_in_SearchingBar_butytrekkingowe"], "isController": false}, {"data": [1.0, 500, 1500, "engine2MainPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_Category2Page"], "isController": false}, {"data": [0.43846153846153846, 500, 1500, "engine104_Add to Cart2-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine203_MainPage_nowosci"], "isController": false}, {"data": [0.38961038961038963, 500, 1500, "engine104_Choose Size2"], "isController": false}, {"data": [0.18045112781954886, 500, 1500, "engine202_OutletCard-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine103_MainPage_nowosci"], "isController": false}, {"data": [1.0, 500, 1500, "engine105_Category_2ndPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine205_Category_2ndPage"], "isController": false}, {"data": [0.2358490566037736, 500, 1500, "engine204_Add to Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine202_OutletCard-1"], "isController": false}, {"data": [0.21069182389937108, 500, 1500, "engine204_Add to Cart-1"], "isController": false}, {"data": [0.11731843575418995, 500, 1500, "engine104_Add to Cart"], "isController": false}, {"data": [0.23, 500, 1500, "engine202_AddToCart-0"], "isController": false}, {"data": [0.21, 500, 1500, "engine202_AddToCart-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine203_ProductType_headlight"], "isController": false}, {"data": [1.0, 500, 1500, "engine203_ProductList_headlight_sorting_price"], "isController": false}, {"data": [0.42567567567567566, 500, 1500, "engine204_Choose Size2"], "isController": false}, {"data": [0.0, 500, 1500, "engine201_resultPage_limit_75"], "isController": false}, {"data": [0.20930232558139536, 500, 1500, "engine104_CheckoutPage_login-1"], "isController": false}, {"data": [0.29069767441860467, 500, 1500, "engine104_CheckoutPage_login-0"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "engine104_Add to Cart2"], "isController": false}, {"data": [0.2753623188405797, 500, 1500, "engine204_Add to Cart2"], "isController": false}, {"data": [1.0, 500, 1500, "engine102_OutletCard-1"], "isController": false}, {"data": [0.1939655172413793, 500, 1500, "engine102_OutletCard-0"], "isController": false}, {"data": [0.1288888888888889, 500, 1500, "engine203_AddProduct_to_cart-1"], "isController": false}, {"data": [0.14, 500, 1500, "engine203_AddProduct_to_cart-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19144, 3845, 20.084621813623066, 12687.954554951932, 25, 153739, 115.0, 49334.5, 100000.5, 100028.0, 56.29660997012257, 1798.4154603166464, 48.50636618490778], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["engine104_Choose Size", 349, 299, 85.67335243553009, 42536.98567335245, 94, 100076, 24061.0, 100021.0, 100024.0, 100072.0, 1.0513853282039385, 3.5384846052258974, 0.67089302135457], "isController": false}, {"data": ["engine204_Remove Product from Cart-0", 57, 0, 0.0, 5801.22807017544, 79, 25129, 2509.0, 16829.8, 17714.09999999998, 25129.0, 0.2011490196631989, 0.4020154492151659, 0.2228671035776294], "isController": false}, {"data": ["engine202_ProductDetails", 190, 0, 0.0, 61.526315789473664, 36, 140, 53.0, 116.0, 126.44999999999999, 135.45000000000002, 0.7110938119867961, 27.611528573339967, 0.5050461930282866], "isController": false}, {"data": ["engine204_CheckoutPage_login", 48, 23, 47.916666666666664, 11546.583333333336, 405, 100020, 2602.5, 34901.20000000001, 66662.94999999997, 100020.0, 0.16785505715814394, 2.5887968005252464, 0.3492574981815702], "isController": false}, {"data": ["engine104_CategoryPage", 349, 0, 0.0, 78.83094555873933, 47, 149, 81.0, 95.0, 133.5, 146.0, 1.2507212253484281, 70.65520803095625, 0.6979346133067421], "isController": false}, {"data": ["engine201_butytrekkingowe_resultsPage", 330, 330, 100.0, 62428.89393939392, 5427, 100088, 52967.0, 100023.0, 100035.35, 100078.69, 0.99801002848865, 38.3728978704961, 0.6037618078951665], "isController": false}, {"data": ["engine104_Product2Details", 77, 0, 0.0, 69.8051948051948, 37, 132, 71.0, 75.0, 82.89999999999995, 132.0, 0.27885517276345473, 12.0586648642935, 0.26209868168500955], "isController": false}, {"data": ["engine104_ProductDetails", 349, 0, 0.0, 70.03724928366768, 36, 141, 71.0, 117.0, 122.5, 131.0, 1.249301965950257, 54.978885868300665, 0.791084281794556], "isController": false}, {"data": ["engine102_AddToCart-0", 147, 0, 0.0, 19722.38095238095, 113, 86357, 11011.0, 66872.40000000004, 72017.8, 80050.28000000013, 0.47462070702341785, 0.8086631547021351, 0.7721919485601557], "isController": false}, {"data": ["engine104_Category2Page", 78, 0, 0.0, 82.65384615384613, 51, 143, 83.0, 92.0, 97.0, 143.0, 0.2824193927983055, 15.607886244727267, 0.2568972676828937], "isController": false}, {"data": ["engine204_Update Qty of product", 61, 34, 55.73770491803279, 16775.901639344265, 104, 100032, 3773.0, 67719.8, 98641.09999999998, 100032.0, 0.19168284972693048, 0.3984145707246869, 0.20417856828622966], "isController": false}, {"data": ["engine105_Category_itemsLimitUp", 364, 0, 0.0, 78.7912087912088, 47, 170, 80.0, 130.5, 140.75, 150.7500000000001, 1.3556847511536356, 77.65752851965928, 0.9115963013363177], "isController": false}, {"data": ["engine204_Remove Product from Cart-1", 57, 5, 8.771929824561404, 13811.017543859647, 295, 100356, 1624.0, 75252.80000000009, 100023.1, 100356.0, 0.19137149571932183, 2.659751657713614, 0.21894868956689606], "isController": false}, {"data": ["engine102_AddToCart-1", 147, 1, 0.6802721088435374, 9469.095238095237, 301, 100019, 5072.0, 18779.40000000005, 40110.6, 87022.52000000028, 0.47336897018097507, 6.746432373848779, 0.3750837754395569], "isController": false}, {"data": ["engine104_Add to Cart-1", 158, 5, 3.1645569620253164, 10945.455696202534, 304, 100030, 6168.5, 23096.999999999996, 36391.24999999989, 100029.41, 0.5131502880786744, 7.239386182535353, 0.4107784041269625], "isController": false}, {"data": ["engine102_ProductDetails", 177, 0, 0.0, 60.73446327683611, 35, 140, 53.0, 76.80000000000024, 132.0, 137.66, 0.6227088185419466, 24.175630245310334, 0.4255905289330922], "isController": false}, {"data": ["engine104_Remove Product from Cart-0", 49, 0, 0.0, 9263.857142857141, 80, 86347, 3547.0, 25249.0, 53779.5, 86347.0, 0.16367978888647636, 0.329985578850233, 0.18486068950111068], "isController": false}, {"data": ["engine104_Add to Cart-0", 158, 0, 0.0, 18040.98734177215, 119, 74179, 10970.0, 49308.399999999965, 69565.25, 73275.12, 0.5135555923928766, 0.8926913604022636, 0.8274399121673671], "isController": false}, {"data": ["engine104_Remove Product from Cart-1", 49, 2, 4.081632653061225, 9992.714285714284, 323, 100026, 2726.0, 23489.0, 84861.5, 100026.0, 0.15520769323357808, 2.199639706324872, 0.18090035705688204], "isController": false}, {"data": ["engine1MainPage", 1716, 0, 0.0, 90.39801864801879, 45, 290, 78.0, 137.0, 141.0, 153.0, 5.951018539711604, 237.87132296044967, 3.2149441040786675], "isController": false}, {"data": ["engine204_Add to Cart", 182, 147, 80.76923076923077, 38998.76373626375, 433, 132928, 29314.5, 100022.7, 100026.0, 119156.6399999998, 0.5435009824825452, 8.09450704255583, 1.221168271413043], "isController": false}, {"data": ["engine204_Product2Details", 74, 0, 0.0, 73.60810810810807, 38, 129, 72.0, 81.5, 114.5, 129.0, 0.2838566140509024, 12.273891664588888, 0.26069511905675213], "isController": false}, {"data": ["engine2CheckCart", 76, 42, 55.26315789473684, 8173.6973684210525, 299, 100032, 4083.0, 24797.799999999992, 34636.999999999935, 100032.0, 0.2701098565219091, 3.873069358702335, 0.2472617224567913], "isController": false}, {"data": ["engine204_ProductDetails", 342, 0, 0.0, 69.73976608187135, 36, 171, 70.0, 116.0, 128.0, 139.84999999999997, 1.206276872286318, 53.09302578196369, 0.7472890183833774], "isController": false}, {"data": ["engine202_OutletCard", 355, 284, 80.0, 36186.659154929584, 163, 100083, 17448.0, 100020.0, 100023.2, 100079.76, 1.068228185576813, 57.111192562987846, 1.1037642866116404], "isController": false}, {"data": ["engine103_ProductList_headlight_sorting_price", 358, 0, 0.0, 60.72905027932959, 36, 144, 54.0, 119.0, 128.05, 136.0, 1.2471434145253888, 47.315823447776744, 0.8173934539340756], "isController": false}, {"data": ["engine204_Cart Checkout", 115, 50, 43.47826086956522, 10293.991304347826, 310, 100083, 1821.0, 27503.800000000043, 69770.8, 100075.16, 0.358180691257588, 5.108284446860001, 0.35535198844789406], "isController": false}, {"data": ["engine202_Change_Color_of_Product", 189, 0, 0.0, 58.46560846560847, 34, 140, 53.0, 78.0, 123.5, 130.99999999999994, 0.7100031555695803, 27.610866969263245, 0.5337423482133465], "isController": false}, {"data": ["engine104_CheckoutPage_login", 44, 33, 75.0, 20487.931818181816, 424, 111341, 13107.5, 48822.5, 95894.0, 111341.0, 0.15699651396376949, 2.3987162022632473, 0.3250666900674728], "isController": false}, {"data": ["engine204_Choose Size", 342, 283, 82.74853801169591, 39686.65789473686, 94, 100063, 19978.0, 100020.0, 100023.0, 100028.0, 1.034977393914817, 3.2100322967041115, 0.6462225216528165], "isController": false}, {"data": ["engine204_Add to Cart2-0", 65, 0, 0.0, 6830.953846153846, 122, 75179, 1416.0, 21838.199999999993, 29349.89999999998, 75179.0, 0.2298988798619192, 0.4296649798573212, 0.4071586532169927], "isController": false}, {"data": ["engine204_Add to Cart2-1", 65, 4, 6.153846153846154, 12068.63076923077, 316, 100085, 1724.0, 42919.99999999993, 100018.5, 100085.0, 0.21959830402540584, 3.060948295157013, 0.20286119170087333], "isController": false}, {"data": ["engine105_categoryPage", 364, 0, 0.0, 85.72252747252749, 47, 431, 82.0, 133.0, 142.0, 151.05000000000007, 1.3568065842394241, 77.26380042246447, 0.8964505727755269], "isController": false}, {"data": ["engine205_categoryPage", 340, 0, 0.0, 84.57352941176461, 47, 181, 82.0, 133.90000000000003, 143.0, 153.3599999999999, 1.1849745230477544, 67.48239310832759, 0.7937893012919708], "isController": false}, {"data": ["engine104_Update Qty of product", 58, 25, 43.10344827586207, 12453.396551724136, 115, 100089, 1782.0, 42067.10000000004, 100017.55, 100089.0, 0.1832132444222623, 0.34635669210066616, 0.1977951579187607], "isController": false}, {"data": ["engine101_Searching_in_SearchingBar_butytrekkingowe", 332, 0, 0.0, 34.96385542168675, 25, 94, 28.0, 77.69999999999999, 87.0, 92.67000000000002, 1.2072463873515487, 2.2529160443317604, 0.6123516964175327], "isController": false}, {"data": ["engine205_Category_itemsLimitUp", 340, 0, 0.0, 77.87647058823528, 47, 155, 80.0, 97.90000000000003, 138.0, 147.17999999999995, 1.184619458419857, 67.86248879075613, 0.8074337103065377], "isController": false}, {"data": ["engine1CheckCart", 101, 52, 51.48514851485149, 11186.71287128713, 314, 100021, 3790.0, 30136.799999999974, 70134.19999999969, 100020.96, 0.351991189765072, 4.9919895321827985, 0.3087376312996839], "isController": false}, {"data": ["engine203_AddProduct_to_cart", 319, 287, 89.96865203761756, 53379.899686520366, 429, 153739, 43569.0, 100022.0, 100063.0, 120288.40000000002, 0.9526653725548753, 13.031199254330296, 1.8616048930491262], "isController": false}, {"data": ["engine101_resultPage_limit_75", 62, 62, 100.0, 49581.43548387096, 20573, 100090, 44816.5, 80033.3, 100024.7, 100090.0, 0.23853585155375326, 13.040375679538627, 0.20665617822283097], "isController": false}, {"data": ["engine201_resultsPage_2ndpage", 89, 89, 100.0, 60530.10112359552, 32459, 100077, 56589.0, 82145.0, 100016.5, 100077.0, 0.2834196330193426, 14.949359390026814, 0.24512489371763763], "isController": false}, {"data": ["engine104_Remove Product from Cart", 55, 38, 69.0909090909091, 28067.87272727273, 424, 113048, 8697.0, 100023.2, 100917.39999999998, 113048.0, 0.1703672498389255, 2.614961835800045, 0.370485243679375], "isController": false}, {"data": ["engine202_AddToCart", 189, 155, 82.01058201058201, 44988.04761904763, 445, 150915, 31233.0, 100023.0, 100070.5, 139270.79999999993, 0.5685835050615965, 8.130815218821919, 1.3062178949624705], "isController": false}, {"data": ["engine104_Cart Checkout", 105, 53, 50.476190476190474, 14083.961904761902, 308, 100027, 3138.0, 65365.200000000084, 100020.8, 100026.94, 0.3305556167695587, 4.59544554863575, 0.32973168721883095], "isController": false}, {"data": ["engine102_AddToCart", 169, 136, 80.4733727810651, 38412.29585798817, 427, 115896, 26841.0, 100016.0, 100025.0, 104812.20000000019, 0.5175951731953079, 7.756154219051484, 1.1971003472328565], "isController": false}, {"data": ["engine204_Remove Product from Cart", 57, 33, 57.89473684210526, 19612.456140350885, 387, 125153, 7452.0, 86904.20000000008, 113687.99999999999, 125153.0, 0.19130726631985234, 3.0412047428259776, 0.43083793946131904], "isController": false}, {"data": ["engine204_CheckoutPage_login-0", 47, 0, 0.0, 4909.595744680851, 86, 57785, 850.0, 10856.400000000001, 27998.999999999975, 57785.0, 0.17052834761659424, 0.19695726518790774, 0.17952105344793806], "isController": false}, {"data": ["engine102_Change_Color_of_Product", 172, 0, 0.0, 56.819767441860456, 36, 139, 53.0, 59.70000000000002, 118.35, 133.16000000000008, 0.6043081549980148, 23.504851977440335, 0.4387622783032292], "isController": false}, {"data": ["engine204_CheckoutPage_login-1", 47, 0, 0.0, 4754.340425531915, 306, 70173, 1462.0, 9346.600000000002, 18700.999999999956, 70173.0, 0.1644454863212845, 2.3704846921370564, 0.17295682496877285], "isController": false}, {"data": ["engine103_AddProduct_to_cart", 358, 319, 89.10614525139665, 53808.192737430196, 402, 132468, 45078.0, 100025.0, 100069.1, 108652.63, 1.0728970618204487, 14.343585848435309, 2.0606628885505702], "isController": false}, {"data": ["engine204_CategoryPage", 342, 0, 0.0, 79.52923976608189, 47, 172, 81.0, 112.0, 137.84999999999997, 151.0, 1.2062726176115801, 68.14501333469128, 0.6565803361691321], "isController": false}, {"data": ["engine101_resultsPage_2ndpage", 74, 74, 100.0, 64994.89189189189, 28995, 100027, 61254.5, 96756.5, 100019.25, 100027.0, 0.23594004572135482, 12.319666031249302, 0.2067620187939], "isController": false}, {"data": ["engine104_Add to Cart2-1", 65, 0, 0.0, 5548.76923076923, 304, 86539, 1769.0, 10395.399999999998, 16988.299999999996, 86539.0, 0.21576548615283497, 3.083747817449121, 0.1995571413396713], "isController": false}, {"data": ["engine103_ProductType_headlight", 358, 0, 0.0, 65.22346368715078, 36, 183, 54.0, 126.0, 131.05, 138.41000000000003, 1.2460842325095718, 47.048500451400976, 0.768024087408632], "isController": false}, {"data": ["engine103_AddProduct_to_cart-0", 240, 0, 0.0, 20606.087499999998, 112, 73247, 12834.0, 65227.40000000001, 71855.85, 72897.56, 0.7761464329603518, 1.3226418235802988, 1.0919833320532306], "isController": false}, {"data": ["engine102_OutletCard", 312, 252, 80.76923076923077, 37637.57051282053, 162, 100089, 17762.5, 100019.0, 100024.0, 100079.74, 0.9402999918627886, 49.96343199325515, 0.9306376418737887], "isController": false}, {"data": ["engine103_AddProduct_to_cart-1", 240, 8, 3.3333333333333335, 12938.20833333334, 290, 100027, 8355.5, 30993.400000000023, 45318.35, 100024.0, 0.7196833393306944, 10.144823387084681, 0.5678722065416216], "isController": false}, {"data": ["engine101_butytrekkingowe_resultsPage", 332, 332, 100.0, 65678.62048192768, 5864, 100084, 59306.0, 100024.0, 100054.1, 100076.67, 0.9899425415880229, 36.02498013871868, 0.5891353153801886], "isController": false}, {"data": ["engine201_Searching_in_SearchingBar_butytrekkingowe", 330, 0, 0.0, 34.278787878787895, 25, 101, 28.0, 68.60000000000014, 83.44999999999999, 96.0, 1.2027554032875314, 2.2446735931406496, 0.6219148071035463], "isController": false}, {"data": ["engine2MainPage", 1686, 0, 0.0, 88.92763938315538, 45, 302, 77.0, 136.0, 141.0, 156.12999999999988, 5.784193986633914, 231.21280751044657, 3.1343480420451897], "isController": false}, {"data": ["engine204_Category2Page", 75, 0, 0.0, 87.63999999999999, 48, 144, 83.0, 102.0, 137.0, 144.0, 0.2577027347414211, 14.242424828112275, 0.22940912198960253], "isController": false}, {"data": ["engine104_Add to Cart2-0", 65, 0, 0.0, 8222.93846153846, 114, 68857, 1635.0, 17988.399999999998, 43053.89999999997, 68857.0, 0.21983968613657118, 0.41103679778131025, 0.3896605590692326], "isController": false}, {"data": ["engine203_MainPage_nowosci", 319, 0, 0.0, 84.89341692789972, 47, 165, 82.0, 135.0, 144.0, 148.8, 1.2190927504108229, 70.30112101478007, 0.69962658716131], "isController": false}, {"data": ["engine104_Choose Size2", 77, 44, 57.142857142857146, 18017.194805194802, 93, 100085, 4099.0, 84676.00000000006, 100020.1, 100085.0, 0.2421772045202218, 0.4580567068146149, 0.22194867533786863], "isController": false}, {"data": ["engine202_OutletCard-0", 266, 0, 0.0, 17714.120300751878, 81, 86090, 9063.0, 46028.90000000004, 69049.95, 78227.16999999982, 0.8483333120718468, 0.9967443016558446, 0.49142064136868696], "isController": false}, {"data": ["engine103_MainPage_nowosci", 358, 0, 0.0, 84.14245810055857, 48, 173, 83.0, 133.10000000000002, 143.0, 154.82000000000005, 1.2464356466668292, 71.87626006309645, 0.7171173444740773], "isController": false}, {"data": ["engine105_Category_2ndPage", 364, 0, 0.0, 61.126373626373635, 35, 166, 53.0, 112.0, 119.0, 134.7500000000001, 1.3576314552764868, 48.95900886609801, 0.889040698406275], "isController": false}, {"data": ["engine205_Category_2ndPage", 340, 0, 0.0, 58.108823529411765, 35, 134, 53.0, 105.0, 116.0, 132.58999999999997, 1.1851727912213552, 42.72596250627445, 0.7869777451129052], "isController": false}, {"data": ["engine204_Add to Cart-0", 159, 0, 0.0, 19713.100628930813, 109, 73015, 16366.0, 58014.0, 69578.0, 72388.6, 0.5095761864471964, 0.8753301779270184, 0.8031796532478271], "isController": false}, {"data": ["engine202_OutletCard-1", 266, 0, 0.0, 89.49624060150379, 52, 156, 88.0, 101.0, 142.64999999999998, 152.0, 0.8485471023392466, 57.180412408645616, 0.534323241816784], "isController": false}, {"data": ["engine204_Add to Cart-1", 159, 5, 3.1446540880503147, 10804.899371069176, 294, 100022, 5146.0, 23798.0, 61442.0, 100021.4, 0.47607926270592676, 6.715549237150351, 0.36993980984525926], "isController": false}, {"data": ["engine104_Add to Cart", 179, 145, 81.00558659217877, 36897.949720670396, 427, 148711, 24454.0, 100020.0, 100024.0, 123803.79999999964, 0.5408835438448057, 8.101741795151689, 1.2469275491780987], "isController": false}, {"data": ["engine202_AddToCart-0", 150, 0, 0.0, 18124.19333333333, 106, 72758, 11203.0, 48162.90000000002, 70920.45, 72649.88, 0.4845149036784372, 0.8360531779332532, 0.8019194814963758], "isController": false}, {"data": ["engine202_AddToCart-1", 150, 5, 3.3333333333333335, 13114.18, 304, 100077, 6035.5, 34436.90000000005, 70862.75, 100048.44, 0.462120021812065, 6.513091306636659, 0.37642925057996063], "isController": false}, {"data": ["engine203_ProductType_headlight", 319, 0, 0.0, 62.636363636363626, 36, 153, 54.0, 122.0, 125.0, 135.60000000000002, 1.2211274183299266, 46.10532816124624, 0.7508795694186056], "isController": false}, {"data": ["engine203_ProductList_headlight_sorting_price", 319, 0, 0.0, 59.26018808777423, 36, 145, 53.0, 117.0, 127.0, 135.8, 1.22178219338629, 46.35142928648303, 0.7990080619910837], "isController": false}, {"data": ["engine204_Choose Size2", 74, 36, 48.648648648648646, 13809.108108108107, 88, 100026, 2330.5, 40611.5, 100015.75, 100026.0, 0.22748791854702852, 0.3943121920074887, 0.2035941217813534], "isController": false}, {"data": ["engine201_resultPage_limit_75", 67, 67, 100.0, 57481.029850746265, 31170, 100092, 46006.0, 100033.0, 100080.2, 100092.0, 0.24164259257255588, 12.197343779867204, 0.21055322741633575], "isController": false}, {"data": ["engine104_CheckoutPage_login-1", 43, 1, 2.3255813953488373, 8798.67441860465, 333, 100026, 5136.0, 18923.600000000017, 36754.19999999996, 100026.0, 0.15348865433284195, 2.1920691040278277, 0.1603592515732587], "isController": false}, {"data": ["engine104_CheckoutPage_login-0", 43, 0, 0.0, 9839.46511627907, 90, 73856, 4499.0, 30852.600000000017, 39070.6, 73856.0, 0.15635510790320528, 0.18054057846844718, 0.16350670645237533], "isController": false}, {"data": ["engine104_Add to Cart2", 69, 39, 56.52173913043478, 18771.536231884063, 441, 100019, 8397.0, 74566.0, 100014.0, 100019.0, 0.2164889261208008, 3.4027698522698393, 0.5750487100083772], "isController": false}, {"data": ["engine204_Add to Cart2", 69, 41, 59.42028985507246, 22808.057971014492, 448, 125268, 5735.0, 100017.0, 111638.5, 125268.0, 0.21582261257964325, 3.3175976118367756, 0.5692498570957157], "isController": false}, {"data": ["engine102_OutletCard-1", 232, 0, 0.0, 92.66379310344824, 55, 442, 89.0, 105.70000000000002, 137.35, 159.67, 0.7611648446830012, 51.29808518443484, 0.45957352417682645], "isController": false}, {"data": ["engine102_OutletCard-0", 232, 0, 0.0, 18350.76293103448, 80, 72810, 10035.5, 56628.80000000007, 68070.3, 72185.65999999999, 0.761864729603699, 0.8949139782474483, 0.4205059216921278], "isController": false}, {"data": ["engine203_AddProduct_to_cart-1", 225, 5, 2.2222222222222223, 13185.093333333334, 302, 100029, 8815.0, 25474.800000000003, 39604.799999999996, 100024.74, 0.7218201416692331, 10.223269621678023, 0.5750813751956935], "isController": false}, {"data": ["engine203_AddProduct_to_cart-0", 225, 0, 0.0, 22846.15111111111, 114, 85122, 14012.0, 69698.20000000001, 71842.09999999999, 73471.24, 0.7241758878396385, 1.240836409069257, 1.026377880409594], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 125, 3.250975292587776, 0.6529460927705809], "isController": false}, {"data": ["524", 954, 24.811443433029908, 4.983284580025074], "isController": false}, {"data": ["Assertion failed", 2766, 71.93758127438231, 14.448391140827413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19144, 3845, "Assertion failed", 2766, "524", 954, "502/Bad Gateway", 125, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["engine104_Choose Size", 349, 299, "Assertion failed", 192, "524", 94, "502/Bad Gateway", 13, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_CheckoutPage_login", 48, 23, "Assertion failed", 22, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine201_butytrekkingowe_resultsPage", 330, 330, "Assertion failed", 224, "524", 96, "502/Bad Gateway", 10, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Update Qty of product", 61, 34, "Assertion failed", 29, "524", 3, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Remove Product from Cart-1", 57, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine102_AddToCart-1", 147, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Add to Cart-1", 158, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Remove Product from Cart-1", 49, 2, "524", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Add to Cart", 182, 147, "Assertion failed", 119, "524", 26, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine2CheckCart", 76, 42, "Assertion failed", 41, "524", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine202_OutletCard", 355, 284, "Assertion failed", 195, "524", 70, "502/Bad Gateway", 19, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Cart Checkout", 115, 50, "Assertion failed", 47, "524", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_CheckoutPage_login", 44, 33, "Assertion failed", 31, "524", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["engine204_Choose Size", 342, 283, "Assertion failed", 190, "524", 76, "502/Bad Gateway", 17, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Add to Cart2-1", 65, 4, "524", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Update Qty of product", 58, 25, "Assertion failed", 22, "524", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine1CheckCart", 101, 52, "Assertion failed", 48, "524", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["engine203_AddProduct_to_cart", 319, 287, "Assertion failed", 188, "524", 89, "502/Bad Gateway", 10, "", "", "", ""], "isController": false}, {"data": ["engine101_resultPage_limit_75", 62, 62, "Assertion failed", 56, "524", 4, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": ["engine201_resultsPage_2ndpage", 89, 89, "Assertion failed", 84, "524", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Remove Product from Cart", 55, 38, "Assertion failed", 30, "524", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["engine202_AddToCart", 189, 155, "Assertion failed", 111, "524", 41, "502/Bad Gateway", 3, "", "", "", ""], "isController": false}, {"data": ["engine104_Cart Checkout", 105, 53, "Assertion failed", 44, "524", 8, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["engine102_AddToCart", 169, 136, "Assertion failed", 113, "524", 23, "", "", "", "", "", ""], "isController": false}, {"data": ["engine204_Remove Product from Cart", 57, 33, "Assertion failed", 28, "524", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine103_AddProduct_to_cart", 358, 319, "Assertion failed", 193, "524", 113, "502/Bad Gateway", 13, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine101_resultsPage_2ndpage", 74, 74, "Assertion failed", 69, "524", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine102_OutletCard", 312, 252, "Assertion failed", 172, "524", 67, "502/Bad Gateway", 13, "", "", "", ""], "isController": false}, {"data": ["engine103_AddProduct_to_cart-1", 240, 8, "524", 7, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine101_butytrekkingowe_resultsPage", 332, 332, "Assertion failed", 210, "524", 108, "502/Bad Gateway", 14, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Choose Size2", 77, 44, "Assertion failed", 36, "524", 7, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Add to Cart-1", 159, 5, "524", 4, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Add to Cart", 179, 145, "Assertion failed", 119, "524", 25, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine202_AddToCart-1", 150, 5, "524", 4, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Choose Size2", 74, 36, "Assertion failed", 30, "524", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["engine201_resultPage_limit_75", 67, 67, "Assertion failed", 55, "524", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_CheckoutPage_login-1", 43, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Add to Cart2", 69, 39, "Assertion failed", 35, "524", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["engine204_Add to Cart2", 69, 41, "Assertion failed", 33, "524", 7, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine203_AddProduct_to_cart-1", 225, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
