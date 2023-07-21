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

    var data = {"OkPercent": 87.3068224651338, "KoPercent": 12.693177534866189};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5990859404447795, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1536144578313253, 500, 1500, "engine104_Choose Size"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_Remove Product from Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine202_ProductDetails"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_CheckoutPage_login"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_CategoryPage"], "isController": false}, {"data": [0.0, 500, 1500, "engine201_butytrekkingowe_resultsPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_Product2Details"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_ProductDetails"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "engine102_AddToCart-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine104_Category2Page"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_Update Qty of product"], "isController": false}, {"data": [1.0, 500, 1500, "engine105_Category_itemsLimitUp"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_Remove Product from Cart-1"], "isController": false}, {"data": [0.1724137931034483, 500, 1500, "engine102_AddToCart-1"], "isController": false}, {"data": [0.1631578947368421, 500, 1500, "engine104_Add to Cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine102_ProductDetails"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_Remove Product from Cart-0"], "isController": false}, {"data": [0.21578947368421053, 500, 1500, "engine104_Add to Cart-0"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_Remove Product from Cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine1MainPage"], "isController": false}, {"data": [0.034013605442176874, 500, 1500, "engine204_Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_Product2Details"], "isController": false}, {"data": [0.059602649006622516, 500, 1500, "engine2CheckCart"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_ProductDetails"], "isController": false}, {"data": [0.15714285714285714, 500, 1500, "engine202_OutletCard"], "isController": false}, {"data": [1.0, 500, 1500, "engine103_ProductList_headlight_sorting_price"], "isController": false}, {"data": [0.019230769230769232, 500, 1500, "engine204_Cart Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "engine202_Change_Color_of_Product"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_CheckoutPage_login"], "isController": false}, {"data": [0.12048192771084337, 500, 1500, "engine204_Choose Size"], "isController": false}, {"data": [0.10227272727272728, 500, 1500, "engine204_Add to Cart2-0"], "isController": false}, {"data": [0.056818181818181816, 500, 1500, "engine204_Add to Cart2-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine105_categoryPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine205_categoryPage"], "isController": false}, {"data": [0.03125, 500, 1500, "engine104_Update Qty of product"], "isController": false}, {"data": [1.0, 500, 1500, "engine101_Searching_in_SearchingBar_butytrekkingowe"], "isController": false}, {"data": [1.0, 500, 1500, "engine205_Category_itemsLimitUp"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "engine1CheckCart"], "isController": false}, {"data": [0.03757225433526012, 500, 1500, "engine203_AddProduct_to_cart"], "isController": false}, {"data": [0.0, 500, 1500, "engine101_resultPage_limit_75"], "isController": false}, {"data": [0.0, 500, 1500, "engine201_resultsPage_2ndpage"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_Remove Product from Cart"], "isController": false}, {"data": [0.025157232704402517, 500, 1500, "engine202_AddToCart"], "isController": false}, {"data": [0.08064516129032258, 500, 1500, "engine104_Cart Checkout"], "isController": false}, {"data": [0.06597222222222222, 500, 1500, "engine102_AddToCart"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_Remove Product from Cart"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_CheckoutPage_login-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine102_Change_Color_of_Product"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_CheckoutPage_login-1"], "isController": false}, {"data": [0.021164021164021163, 500, 1500, "engine103_AddProduct_to_cart"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_CategoryPage"], "isController": false}, {"data": [0.0, 500, 1500, "engine101_resultsPage_2ndpage"], "isController": false}, {"data": [0.08536585365853659, 500, 1500, "engine104_Add to Cart2-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine103_ProductType_headlight"], "isController": false}, {"data": [0.11304347826086956, 500, 1500, "engine103_AddProduct_to_cart-0"], "isController": false}, {"data": [0.19254658385093168, 500, 1500, "engine102_OutletCard"], "isController": false}, {"data": [0.09565217391304348, 500, 1500, "engine103_AddProduct_to_cart-1"], "isController": false}, {"data": [0.0, 500, 1500, "engine101_butytrekkingowe_resultsPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine201_Searching_in_SearchingBar_butytrekkingowe"], "isController": false}, {"data": [0.9994292237442922, 500, 1500, "engine2MainPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine204_Category2Page"], "isController": false}, {"data": [0.0975609756097561, 500, 1500, "engine104_Add to Cart2-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine203_MainPage_nowosci"], "isController": false}, {"data": [0.1118421052631579, 500, 1500, "engine104_Choose Size2"], "isController": false}, {"data": [0.2644230769230769, 500, 1500, "engine202_OutletCard-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine103_MainPage_nowosci"], "isController": false}, {"data": [1.0, 500, 1500, "engine105_Category_2ndPage"], "isController": false}, {"data": [1.0, 500, 1500, "engine205_Category_2ndPage"], "isController": false}, {"data": [0.16489361702127658, 500, 1500, "engine204_Add to Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "engine202_OutletCard-1"], "isController": false}, {"data": [0.11170212765957446, 500, 1500, "engine204_Add to Cart-1"], "isController": false}, {"data": [0.04452054794520548, 500, 1500, "engine104_Add to Cart"], "isController": false}, {"data": [0.15086206896551724, 500, 1500, "engine202_AddToCart-0"], "isController": false}, {"data": [0.09051724137931035, 500, 1500, "engine202_AddToCart-1"], "isController": false}, {"data": [1.0, 500, 1500, "engine203_ProductType_headlight"], "isController": false}, {"data": [1.0, 500, 1500, "engine203_ProductList_headlight_sorting_price"], "isController": false}, {"data": [0.06875, 500, 1500, "engine204_Choose Size2"], "isController": false}, {"data": [0.0, 500, 1500, "engine201_resultPage_limit_75"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_CheckoutPage_login-1"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_CheckoutPage_login-0"], "isController": false}, {"data": [0.0, 500, 1500, "engine104_Add to Cart2"], "isController": false}, {"data": [0.0, 500, 1500, "engine204_Add to Cart2"], "isController": false}, {"data": [1.0, 500, 1500, "engine102_OutletCard-1"], "isController": false}, {"data": [0.31313131313131315, 500, 1500, "engine102_OutletCard-0"], "isController": false}, {"data": [0.16304347826086957, 500, 1500, "engine203_AddProduct_to_cart-1"], "isController": false}, {"data": [0.22282608695652173, 500, 1500, "engine203_AddProduct_to_cart-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10612, 1347, 12.693177534866189, 20828.530060309018, 25, 158958, 135.0, 100016.0, 100025.0, 100100.87, 43.73539508986527, 1350.3075233511133, 35.84149106859517], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["engine104_Choose Size", 166, 72, 43.373493975903614, 51691.18072289157, 93, 100091, 51166.5, 100025.0, 100033.25, 100086.98, 0.7235921555635955, 3.1224067421570894, 0.44815854514386844], "isController": false}, {"data": ["engine204_Remove Product from Cart-0", 4, 0, 0.0, 25443.75, 7603, 74612, 9780.0, 74612.0, 74612.0, 74612.0, 0.05361067924730606, 0.10190740933093873, 0.053872450142068304], "isController": false}, {"data": ["engine202_ProductDetails", 159, 0, 0.0, 78.56603773584906, 36, 165, 55.0, 138.0, 141.0, 157.80000000000007, 1.0370602277619065, 40.25940340297616, 0.6521627026833118], "isController": false}, {"data": ["engine204_CheckoutPage_login", 1, 0, 0.0, 16433.0, 16433, 16433, 16433.0, 16433.0, 16433.0, 16433.0, 0.06085316132173066, 0.9476810191383193, 0.09775727575610053], "isController": false}, {"data": ["engine104_CategoryPage", 166, 0, 0.0, 81.60843373493972, 48, 163, 69.0, 140.0, 145.65, 156.30000000000013, 1.0088425658634417, 57.004133320292325, 0.5440428530189311], "isController": false}, {"data": ["engine201_butytrekkingowe_resultsPage", 175, 71, 40.57142857142857, 67179.89142857144, 9268, 100087, 59981.0, 100024.0, 100027.2, 100083.2, 0.7251150861229546, 25.19077324718966, 0.42377554606345375], "isController": false}, {"data": ["engine104_Product2Details", 76, 0, 0.0, 65.89473684210525, 36, 135, 65.5, 80.89999999999999, 128.45, 135.0, 0.4439745065164942, 19.181525375552777, 0.3349376445838031], "isController": false}, {"data": ["engine104_ProductDetails", 166, 0, 0.0, 61.99397590361449, 35, 156, 54.0, 119.30000000000001, 131.0, 147.29000000000016, 1.0081257363569007, 44.38325981783897, 0.6194626150842332], "isController": false}, {"data": ["engine102_AddToCart-0", 87, 0, 0.0, 24303.96551724138, 115, 92891, 15165.0, 71399.2, 75499.2, 92891.0, 0.407614424865417, 0.6806293396880578, 0.6396931164114], "isController": false}, {"data": ["engine104_Category2Page", 76, 0, 0.0, 93.73684210526318, 47, 159, 84.5, 144.79999999999998, 152.0, 159.0, 0.4434331057821343, 24.511986551140676, 0.32197104374525937], "isController": false}, {"data": ["engine204_Update Qty of product", 15, 7, 46.666666666666664, 60582.93333333333, 2027, 100027, 67314.0, 100025.2, 100027.0, 100027.0, 0.06795755823962742, 0.32483358892926073, 0.06426325087438725], "isController": false}, {"data": ["engine105_Category_itemsLimitUp", 147, 0, 0.0, 79.97959183673474, 48, 148, 68.0, 137.0, 141.6, 147.04000000000002, 0.9084336009195573, 52.04185490979007, 0.5975657011469746], "isController": false}, {"data": ["engine204_Remove Product from Cart-1", 4, 1, 25.0, 23989.75, 5863, 52973, 18561.5, 52973.0, 52973.0, 52973.0, 0.07202535292422933, 0.9191321282591473, 0.07497951779026217], "isController": false}, {"data": ["engine102_AddToCart-1", 87, 5, 5.747126436781609, 17471.999999999996, 283, 100028, 9380.0, 50629.400000000074, 100015.8, 100028.0, 0.4007720620413578, 5.593871606393466, 0.30151025855556224], "isController": false}, {"data": ["engine104_Add to Cart-1", 95, 5, 5.2631578947368425, 18905.02105263158, 300, 100074, 9259.0, 64736.00000000006, 100018.0, 100074.0, 0.4156439637558464, 5.813995121925875, 0.30253821736866743], "isController": false}, {"data": ["engine102_ProductDetails", 145, 0, 0.0, 79.88275862068967, 36, 340, 54.0, 140.0, 142.7, 252.13999999999848, 0.9110844418194043, 35.36453907177774, 0.573140101617332], "isController": false}, {"data": ["engine104_Remove Product from Cart-0", 8, 0, 0.0, 40082.0, 5580, 76030, 33694.5, 76030.0, 76030.0, 76030.0, 0.04010648271159929, 0.07617881725982484, 0.04030231514671453], "isController": false}, {"data": ["engine104_Add to Cart-0", 95, 0, 0.0, 21935.031578947364, 118, 87645, 12643.0, 70520.0, 74177.0, 87645.0, 0.43421623968736434, 0.7264060964531389, 0.6556406332129716], "isController": false}, {"data": ["engine104_Remove Product from Cart-1", 8, 2, 25.0, 36653.625, 3533, 100094, 20246.5, 100094.0, 100094.0, 100094.0, 0.03996063877081075, 0.5169858860897016, 0.041599649345394785], "isController": false}, {"data": ["engine1MainPage", 835, 0, 0.0, 102.30778443113776, 45, 331, 106.0, 141.0, 149.0, 214.39999999999986, 4.822909687406141, 192.79810482392048, 2.540527919087748], "isController": false}, {"data": ["engine204_Add to Cart", 147, 64, 43.53741496598639, 61772.35374149659, 441, 131885, 77305.0, 100092.2, 112130.0, 127640.36000000009, 0.6326390084351867, 8.07506990096187, 1.2337738315544844], "isController": false}, {"data": ["engine204_Product2Details", 80, 0, 0.0, 61.35, 38, 141, 55.5, 74.0, 76.9, 141.0, 0.5014573604538188, 21.663912895289435, 0.38356713456294855], "isController": false}, {"data": ["engine2CheckCart", 151, 59, 39.0728476821192, 54094.41721854306, 351, 100098, 47340.0, 100084.0, 100091.0, 100098.0, 0.6545155068160637, 7.90123954292278, 0.4458395868099954], "isController": false}, {"data": ["engine204_ProductDetails", 166, 0, 0.0, 62.53614457831319, 37, 138, 54.0, 114.80000000000007, 128.0, 135.99000000000004, 1.0349772429702602, 45.546171149230005, 0.6247954205374401], "isController": false}, {"data": ["engine202_OutletCard", 175, 71, 40.57142857142857, 48453.71999999998, 227, 100088, 26574.0, 100024.0, 100037.6, 100084.2, 0.8009959812887338, 35.39138165513232, 0.7215176914265967], "isController": false}, {"data": ["engine103_ProductList_headlight_sorting_price", 189, 0, 0.0, 56.51322751322752, 36, 136, 54.0, 73.0, 120.0, 131.49999999999997, 1.096726648136435, 41.60927725931493, 0.7021825005367578], "isController": false}, {"data": ["engine204_Cart Checkout", 26, 9, 34.61538461538461, 50994.769230769234, 1285, 100030, 33249.5, 100028.0, 100029.3, 100030.0, 0.12247628199692868, 1.5140063110614925, 0.1005056268430325], "isController": false}, {"data": ["engine202_Change_Color_of_Product", 159, 0, 0.0, 57.28301886792455, 36, 135, 53.0, 117.0, 130.0, 134.4, 1.0391817260873828, 40.404316852390444, 0.6961195099833339], "isController": false}, {"data": ["engine104_CheckoutPage_login", 2, 1, 50.0, 83703.5, 47629, 119778, 83703.5, 119778.0, 119778.0, 119778.0, 0.016697557147389335, 0.21065175000834876, 0.029481624338359297], "isController": false}, {"data": ["engine204_Choose Size", 166, 74, 44.57831325301205, 53864.61445783135, 98, 100087, 48614.0, 100025.0, 100065.95, 100081.64, 0.7391641211516711, 3.2649560717768438, 0.4498280525029166], "isController": false}, {"data": ["engine204_Add to Cart2-0", 44, 0, 0.0, 18529.636363636364, 835, 100030, 12398.5, 46599.0, 74900.5, 100030.0, 0.21170334587515274, 0.3674314174381008, 0.34201160429036076], "isController": false}, {"data": ["engine204_Add to Cart2-1", 44, 7, 15.909090909090908, 29559.36363636364, 1325, 100032, 11227.5, 100020.5, 100030.0, 100032.0, 0.199833774632919, 2.671313109436242, 0.15596490334176571], "isController": false}, {"data": ["engine105_categoryPage", 148, 0, 0.0, 78.3783783783783, 48, 147, 68.0, 137.0, 141.09999999999997, 146.01999999999998, 0.9135858863326317, 52.03853375445219, 0.5906069443329898], "isController": false}, {"data": ["engine205_categoryPage", 186, 0, 0.0, 78.8010752688172, 47, 154, 74.0, 136.0, 141.65, 149.64999999999998, 1.149475011278451, 65.46006230957958, 0.7291644135514452], "isController": false}, {"data": ["engine104_Update Qty of product", 16, 5, 31.25, 45675.625, 1209, 100072, 18102.5, 100035.6, 100072.0, 100072.0, 0.07498043479279626, 0.2780829553069746, 0.07054128551612314], "isController": false}, {"data": ["engine101_Searching_in_SearchingBar_butytrekkingowe", 170, 0, 0.0, 38.211764705882324, 26, 108, 29.0, 83.70000000000002, 91.44999999999999, 102.31999999999994, 1.0558022544483432, 1.9702708695618423, 0.502543192792597], "isController": false}, {"data": ["engine205_Category_itemsLimitUp", 186, 0, 0.0, 75.13440860215054, 48, 154, 72.0, 89.0, 141.65, 147.03999999999996, 1.150427699330154, 65.91665502129219, 0.7432503216249482], "isController": false}, {"data": ["engine1CheckCart", 162, 50, 30.864197530864196, 51547.629629629635, 353, 100104, 40899.5, 100084.0, 100089.0, 100104.0, 0.7013169173225279, 8.822566650811277, 0.4886448281665325], "isController": false}, {"data": ["engine203_AddProduct_to_cart", 173, 101, 58.38150289017341, 69548.95953757227, 441, 127951, 100014.0, 101668.0, 112864.49999999999, 124019.37999999995, 0.7539506140557314, 8.888200672890028, 1.3349903631601425], "isController": false}, {"data": ["engine101_resultPage_limit_75", 78, 25, 32.05128205128205, 72476.02564102566, 16405, 123691, 65649.5, 100087.2, 100094.1, 123691.0, 0.4008324982656286, 17.321773266270974, 0.28990499498959377], "isController": false}, {"data": ["engine201_resultsPage_2ndpage", 133, 62, 46.61654135338346, 81786.54887218043, 27351, 141394, 80195.0, 100087.6, 100095.6, 141281.8, 0.5837481017213985, 19.54899064110245, 0.38480346370008517], "isController": false}, {"data": ["engine104_Remove Product from Cart", 11, 5, 45.45454545454545, 83091.72727272728, 16374, 154204, 81836.0, 144482.00000000003, 154204.0, 154204.0, 0.053455925589351576, 0.7007358086666635, 0.09418854360545639], "isController": false}, {"data": ["engine202_AddToCart", 159, 56, 35.22012578616352, 60852.666666666686, 409, 121348, 66705.0, 100061.0, 111040.0, 120322.00000000001, 0.6923458768408126, 9.315223424423262, 1.4660343998471614], "isController": false}, {"data": ["engine104_Cart Checkout", 31, 9, 29.032258064516128, 46241.48387096775, 1363, 100099, 32247.0, 100085.0, 100096.6, 100099.0, 0.1388895111537238, 1.7634820132482671, 0.11391092562018647], "isController": false}, {"data": ["engine102_AddToCart", 144, 62, 43.05555555555556, 62322.062500000015, 402, 121513, 78990.5, 100070.0, 100086.0, 120607.60000000002, 0.6254370458523535, 7.99329463758312, 1.2646250879520846], "isController": false}, {"data": ["engine204_Remove Product from Cart", 8, 5, 62.5, 69250.25, 19734, 100087, 70668.5, 100087.0, 100087.0, 100087.0, 0.039627108905202046, 0.45543602667647437, 0.060446820419849216], "isController": false}, {"data": ["engine204_CheckoutPage_login-0", 1, 0, 0.0, 8032.0, 8032, 8032, 8032.0, 8032.0, 8032.0, 8032.0, 0.12450199203187251, 0.14383384431025897, 0.10006361273655379], "isController": false}, {"data": ["engine102_Change_Color_of_Product", 144, 0, 0.0, 61.28472222222221, 35, 137, 53.0, 122.0, 130.75, 136.55, 0.9040626314500788, 35.153478757667266, 0.6038426683816651], "isController": false}, {"data": ["engine204_CheckoutPage_login-1", 1, 0, 0.0, 8401.0, 8401, 8401, 8401.0, 8401.0, 8401.0, 8401.0, 0.11903344839900012, 1.7162205392215213, 0.09555224080466611], "isController": false}, {"data": ["engine103_AddProduct_to_cart", 189, 96, 50.79365079365079, 67937.126984127, 463, 158958, 99170.0, 105658.0, 115417.0, 136489.49999999985, 0.829879162568498, 10.252276816293733, 1.5317019877581846], "isController": false}, {"data": ["engine204_CategoryPage", 166, 0, 0.0, 77.12650602409639, 49, 156, 68.0, 133.60000000000002, 143.0, 151.98000000000008, 1.0348094953121882, 58.46516586172826, 0.5468813311951426], "isController": false}, {"data": ["engine101_resultsPage_2ndpage", 146, 66, 45.205479452054796, 81546.78767123283, 30378, 112571, 79442.5, 100089.3, 100093.3, 106800.34000000001, 0.6288739280068573, 21.48449698565866, 0.41149969067802084], "isController": false}, {"data": ["engine104_Add to Cart2-1", 41, 5, 12.195121951219512, 23139.048780487807, 1305, 100021, 8740.0, 100010.8, 100019.9, 100021.0, 0.1816602864029491, 2.4680079897295477, 0.13986682445634838], "isController": false}, {"data": ["engine103_ProductType_headlight", 189, 0, 0.0, 63.2275132275132, 37, 135, 54.0, 124.0, 130.0, 134.1, 1.0953664261497, 41.34888837875627, 0.6585238633399983], "isController": false}, {"data": ["engine103_AddProduct_to_cart-0", 115, 0, 0.0, 17489.747826086954, 129, 88796, 13775.0, 40671.60000000002, 55300.199999999866, 85944.96000000006, 0.5226298735235706, 0.8804511502969902, 0.7305456710340346], "isController": false}, {"data": ["engine102_OutletCard", 161, 62, 38.50931677018634, 46968.956521739114, 152, 100084, 27417.0, 100024.8, 100028.0, 100079.04, 0.716807579461014, 32.564366071905596, 0.6540112632843144], "isController": false}, {"data": ["engine103_AddProduct_to_cart-1", 115, 22, 19.130434782608695, 31107.70434782609, 333, 100027, 16416.0, 100019.0, 100022.0, 100027.0, 0.5222074389584913, 6.879799199887385, 0.3991144184879597], "isController": false}, {"data": ["engine101_butytrekkingowe_resultsPage", 170, 66, 38.8235294117647, 64531.04705882353, 9113, 100087, 57733.0, 100023.0, 100035.8, 100084.16, 0.7057221613363887, 25.05610831719513, 0.39793762427974827], "isController": false}, {"data": ["engine201_Searching_in_SearchingBar_butytrekkingowe", 176, 0, 0.0, 38.352272727272755, 25, 116, 29.0, 81.0, 89.0, 103.67999999999984, 1.079211684919243, 2.0138210762070616, 0.5355219115230375], "isController": false}, {"data": ["engine2MainPage", 876, 0, 0.0, 103.25228310502291, 46, 526, 85.5, 140.0, 147.29999999999995, 343.7600000000002, 4.974418089619025, 198.84484680488754, 2.58884084098046], "isController": false}, {"data": ["engine204_Category2Page", 80, 0, 0.0, 92.08749999999998, 52, 160, 84.0, 146.9, 149.0, 160.0, 0.5012248682718393, 27.705724663474488, 0.3691944552782111], "isController": false}, {"data": ["engine104_Add to Cart2-0", 41, 0, 0.0, 22573.731707317067, 803, 84148, 17450.0, 70167.40000000001, 74309.29999999999, 84148.0, 0.19265649816271485, 0.3319543415846702, 0.30864319899066794], "isController": false}, {"data": ["engine203_MainPage_nowosci", 173, 0, 0.0, 99.99421965317917, 49, 164, 85.0, 145.0, 149.0, 161.03999999999996, 1.0069848661233993, 58.06779321885914, 0.5552820776338766], "isController": false}, {"data": ["engine104_Choose Size2", 76, 24, 31.57894736842105, 43242.6447368421, 231, 100068, 23552.5, 100021.6, 100026.0, 100068.0, 0.33456005352960855, 1.1572594923161241, 0.24455332243445266], "isController": false}, {"data": ["engine202_OutletCard-0", 104, 0, 0.0, 13563.625000000004, 139, 86658, 8080.5, 43085.5, 51891.75, 86026.50000000003, 0.4762362681393358, 0.5595919250477381, 0.26507009459471836], "isController": false}, {"data": ["engine103_MainPage_nowosci", 189, 0, 0.0, 96.51851851851849, 48, 176, 83.0, 146.0, 148.0, 168.79999999999995, 1.0927382053654024, 63.0204644498728, 0.6121244615807123], "isController": false}, {"data": ["engine105_Category_2ndPage", 147, 0, 0.0, 56.16326530612243, 36, 135, 52.0, 109.20000000000002, 121.59999999999997, 132.60000000000005, 0.9083157231305379, 32.753209179472684, 0.5815216740660414], "isController": false}, {"data": ["engine205_Category_2ndPage", 186, 0, 0.0, 54.26881720430109, 35, 132, 53.0, 61.0, 117.65, 126.77999999999997, 1.1498729575845248, 41.46419040211552, 0.7226793121781437], "isController": false}, {"data": ["engine204_Add to Cart-0", 94, 0, 0.0, 22759.117021276597, 138, 90511, 15581.0, 70802.5, 76170.25, 90511.0, 0.4457363422117058, 0.7430436308900027, 0.6664558507636791], "isController": false}, {"data": ["engine202_OutletCard-1", 104, 0, 0.0, 86.37499999999996, 53, 153, 87.5, 99.5, 128.75, 152.40000000000003, 0.4764020650197203, 32.10083683859131, 0.286599037518953], "isController": false}, {"data": ["engine204_Add to Cart-1", 94, 11, 11.702127659574469, 20977.468085106382, 291, 100094, 9553.5, 100017.5, 100022.25, 100094.0, 0.4047868194521598, 5.484639362934446, 0.2885392915046443], "isController": false}, {"data": ["engine104_Add to Cart", 146, 56, 38.35616438356164, 60374.630136986285, 418, 121928, 71503.5, 100089.6, 100095.65, 121678.43000000001, 0.6380505370987055, 8.386008864149863, 1.2609717856565366], "isController": false}, {"data": ["engine202_AddToCart-0", 116, 0, 0.0, 26065.999999999993, 115, 100004, 16301.5, 75089.6, 77727.65, 96694.43999999997, 0.5549177190968235, 0.9272718812787026, 0.8684604322139304], "isController": false}, {"data": ["engine202_AddToCart-1", 116, 13, 11.206896551724139, 21253.663793103442, 290, 100025, 9628.5, 100012.8, 100021.15, 100024.83, 0.5416055804050836, 7.385517792151855, 0.40774988415009944], "isController": false}, {"data": ["engine203_ProductType_headlight", 173, 0, 0.0, 61.91907514450868, 37, 135, 54.0, 119.6, 128.59999999999997, 135.0, 1.0061473860523547, 37.99098075016139, 0.5960880295359509], "isController": false}, {"data": ["engine203_ProductList_headlight_sorting_price", 173, 0, 0.0, 61.456647398843934, 36, 135, 54.0, 120.6, 130.29999999999998, 135.0, 1.0066098775776195, 38.184580176767675, 0.635682729149211], "isController": false}, {"data": ["engine204_Choose Size2", 80, 19, 23.75, 39293.837499999994, 269, 100068, 22587.0, 100022.0, 100023.0, 100068.0, 0.36055850512443777, 1.036306410504872, 0.2673423359346127], "isController": false}, {"data": ["engine201_resultPage_limit_75", 70, 26, 37.142857142857146, 70009.7857142857, 33734, 100096, 59936.0, 100086.9, 100091.9, 100096.0, 0.39486895991515963, 16.028187209489264, 0.2842748020014215], "isController": false}, {"data": ["engine104_CheckoutPage_login-1", 2, 1, 50.0, 68567.5, 37056, 100079, 68567.5, 100079.0, 100079.0, 100079.0, 0.019984212472147003, 0.2289890205487665, 0.017632554656821113], "isController": false}, {"data": ["engine104_CheckoutPage_login-0", 2, 0, 0.0, 15136.0, 10572, 19700, 15136.0, 19700.0, 19700.0, 19700.0, 0.032540431486121506, 0.037656651670951155, 0.028742988553903222], "isController": false}, {"data": ["engine104_Add to Cart2", 53, 17, 32.075471698113205, 57561.43396226415, 2281, 121421, 60282.0, 103401.8, 109743.79999999997, 121421.0, 0.23399661808661407, 3.2178113576108505, 0.5168258883041427], "isController": false}, {"data": ["engine204_Add to Cart2", 52, 15, 28.846153846153847, 56082.692307692305, 2395, 130319, 45234.0, 116716.90000000001, 125618.4, 130319.0, 0.23527495498104226, 3.3145322510496884, 0.5365530890018008], "isController": false}, {"data": ["engine102_OutletCard-1", 99, 0, 0.0, 87.58585858585855, 52, 151, 88.0, 98.0, 136.0, 151.0, 0.4543702153439445, 30.621305732063853, 0.2744346619072534], "isController": false}, {"data": ["engine102_OutletCard-0", 99, 0, 0.0, 14129.424242424244, 82, 90364, 5606.0, 40184.0, 52783.0, 90364.0, 0.45418052528959746, 0.533519648182131, 0.2540339345108384], "isController": false}, {"data": ["engine203_AddProduct_to_cart-1", 92, 20, 21.73913043478261, 29896.70652173912, 286, 100029, 12050.0, 100018.0, 100023.0, 100029.0, 0.425991007885464, 5.551095841610061, 0.32159137738635996], "isController": false}, {"data": ["engine203_AddProduct_to_cart-0", 92, 0, 0.0, 14149.380434782608, 144, 87617, 9849.5, 36146.600000000006, 70571.15, 87617.0, 0.4332143563470612, 0.7262254124365481, 0.5963595131753671], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 59, 4.380103934669636, 0.5559743686392763], "isController": false}, {"data": ["524", 1286, 95.47141796585004, 12.11835657745948], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.skalnik.pl:443 failed to respond", 2, 0.14847809948032664, 0.018846588767433094], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10612, 1347, "524", 1286, "502/Bad Gateway", 59, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.skalnik.pl:443 failed to respond", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["engine104_Choose Size", 166, 72, "524", 69, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine201_butytrekkingowe_resultsPage", 175, 71, "524", 71, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Update Qty of product", 15, 7, "524", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Remove Product from Cart-1", 4, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine102_AddToCart-1", 87, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Add to Cart-1", 95, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Remove Product from Cart-1", 8, 2, "524", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Add to Cart", 147, 64, "524", 57, "502/Bad Gateway", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.skalnik.pl:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine2CheckCart", 151, 59, "524", 53, "502/Bad Gateway", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine202_OutletCard", 175, 71, "524", 70, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Cart Checkout", 26, 9, "524", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_CheckoutPage_login", 2, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine204_Choose Size", 166, 74, "524", 74, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Add to Cart2-1", 44, 7, "524", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Update Qty of product", 16, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine1CheckCart", 162, 50, "524", 48, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["engine203_AddProduct_to_cart", 173, 101, "524", 99, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["engine101_resultPage_limit_75", 78, 25, "524", 22, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["engine201_resultsPage_2ndpage", 133, 62, "524", 58, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Remove Product from Cart", 11, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine202_AddToCart", 159, 56, "524", 53, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Cart Checkout", 31, 9, "524", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["engine102_AddToCart", 144, 62, "524", 57, "502/Bad Gateway", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["engine204_Remove Product from Cart", 8, 5, "524", 3, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine103_AddProduct_to_cart", 189, 96, "524", 92, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine101_resultsPage_2ndpage", 146, 66, "524", 64, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Add to Cart2-1", 41, 5, "524", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine102_OutletCard", 161, 62, "524", 61, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine103_AddProduct_to_cart-1", 115, 22, "524", 21, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine101_butytrekkingowe_resultsPage", 170, 66, "524", 64, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Choose Size2", 76, 24, "524", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Add to Cart-1", 94, 11, "524", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.skalnik.pl:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_Add to Cart", 146, 56, "524", 53, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine202_AddToCart-1", 116, 13, "524", 12, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine204_Choose Size2", 80, 19, "524", 18, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine201_resultPage_limit_75", 70, 26, "524", 21, "502/Bad Gateway", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["engine104_CheckoutPage_login-1", 2, 1, "524", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["engine104_Add to Cart2", 53, 17, "524", 16, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["engine204_Add to Cart2", 52, 15, "524", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["engine203_AddProduct_to_cart-1", 92, 20, "524", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
