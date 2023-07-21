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

    var data = {"OkPercent": 91.2621359223301, "KoPercent": 8.737864077669903};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8936451897616946, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "02_OutletCard-0"], "isController": false}, {"data": [1.0, 500, 1500, "02_OutletCard-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_ProductDetails"], "isController": false}, {"data": [1.0, 500, 1500, "CheckCart"], "isController": false}, {"data": [1.0, 500, 1500, "04_Product2Details"], "isController": false}, {"data": [1.0, 500, 1500, "04_Category2Page"], "isController": false}, {"data": [0.95, 500, 1500, "04_Update Qty of product"], "isController": false}, {"data": [0.875, 500, 1500, "04_Add to Cart"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "02_AddToCart"], "isController": false}, {"data": [1.0, 500, 1500, "01_Searching_in_SearchingBar_butytrekkingowe"], "isController": false}, {"data": [1.0, 500, 1500, "03_MainPage_nowosci"], "isController": false}, {"data": [0.0, 500, 1500, "01_resultPage_limit_75"], "isController": false}, {"data": [1.0, 500, 1500, "05_Category_itemsLimitUp"], "isController": false}, {"data": [1.0, 500, 1500, "03_AddProduct_to_cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "MainPage"], "isController": false}, {"data": [1.0, 500, 1500, "03_AddProduct_to_cart-0"], "isController": false}, {"data": [0.95, 500, 1500, "04_Remove Product from Cart"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "04_CheckoutPage_login"], "isController": false}, {"data": [1.0, 500, 1500, "04_Choose Size"], "isController": false}, {"data": [1.0, 500, 1500, "02_Change_Color_of_Product"], "isController": false}, {"data": [0.0, 500, 1500, "01_butytrekkingowe_resultsPage"], "isController": false}, {"data": [1.0, 500, 1500, "04_CategoryPage"], "isController": false}, {"data": [1.0, 500, 1500, "03_ProductList_headlight_sorting_price"], "isController": false}, {"data": [1.0, 500, 1500, "03_ProductType_headlight"], "isController": false}, {"data": [1.0, 500, 1500, "04_CheckoutPage_login-0"], "isController": false}, {"data": [1.0, 500, 1500, "02_OutletCard"], "isController": false}, {"data": [1.0, 500, 1500, "02_AddToCart-1"], "isController": false}, {"data": [1.0, 500, 1500, "02_AddToCart-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "04_CheckoutPage_login-1"], "isController": false}, {"data": [1.0, 500, 1500, "05_Category_2ndPage"], "isController": false}, {"data": [0.875, 500, 1500, "04_Add to Cart2"], "isController": false}, {"data": [1.0, 500, 1500, "05_categoryPage"], "isController": false}, {"data": [1.0, 500, 1500, "04_Remove Product from Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "04_Choose Size2"], "isController": false}, {"data": [1.0, 500, 1500, "04_Add to Cart2-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_Add to Cart2-0"], "isController": false}, {"data": [1.0, 500, 1500, "02_ProductDetails"], "isController": false}, {"data": [0.0, 500, 1500, "01_resultsPage_2ndpage"], "isController": false}, {"data": [1.0, 500, 1500, "04_Remove Product from Cart-1"], "isController": false}, {"data": [0.72, 500, 1500, "03_AddProduct_to_cart"], "isController": false}, {"data": [0.975, 500, 1500, "04_Add to Cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_Add to Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "04_Cart Checkout"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1133, 99, 8.737864077669903, 703.6734333627533, 27, 18184, 140.0, 538.0, 5485.5, 6349.580000000001, 6.429609116084805, 184.40160198456724, 10.158331518562445], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_OutletCard-0", 27, 0, 0.0, 105.07407407407408, 90, 124, 105.0, 115.2, 120.79999999999998, 124.0, 0.17000805964134597, 0.19956639090205017, 0.19665175619899758], "isController": false}, {"data": ["02_OutletCard-1", 27, 0, 0.0, 89.59259259259261, 83, 109, 89.0, 94.4, 103.79999999999997, 109.0, 0.17002840104032194, 11.458879841480003, 0.20046353402457226], "isController": false}, {"data": ["04_ProductDetails", 20, 0, 0.0, 71.75, 39, 91, 72.5, 76.7, 90.29999999999998, 91.0, 0.15594298724386366, 6.865626059924991, 0.18257817129557433], "isController": false}, {"data": ["CheckCart", 25, 0, 0.0, 349.64, 316, 378, 351.0, 374.40000000000003, 378.0, 378.0, 0.19362883675540032, 2.7918404082083135, 0.2509686887648804], "isController": false}, {"data": ["04_Product2Details", 20, 0, 0.0, 72.84999999999998, 67, 87, 72.0, 76.80000000000001, 86.5, 87.0, 0.1550447691770999, 6.700901682235745, 0.19967313413310592], "isController": false}, {"data": ["04_Category2Page", 20, 0, 0.0, 84.00000000000001, 81, 88, 83.0, 87.0, 87.95, 88.0, 0.15539653310334647, 8.591220253704265, 0.19572527204105575], "isController": false}, {"data": ["04_Update Qty of product", 20, 0, 0.0, 212.24999999999997, 132, 582, 149.5, 520.1000000000003, 579.5999999999999, 582.0, 0.15475324594933376, 0.2368525631973568, 0.22468690274919143], "isController": false}, {"data": ["04_Add to Cart", 20, 0, 0.0, 506.15, 443, 944, 486.5, 523.4000000000001, 923.0499999999997, 944.0, 0.15482512502128845, 2.5393437253247457, 0.5092219529447739], "isController": false}, {"data": ["02_AddToCart", 26, 0, 0.0, 498.7307692307692, 446, 607, 496.5, 546.7, 588.0999999999999, 607.0, 0.17661003824286597, 2.906722357557211, 0.6075215498210125], "isController": false}, {"data": ["01_Searching_in_SearchingBar_butytrekkingowe", 34, 0, 0.0, 31.91176470588235, 27, 94, 29.0, 36.0, 51.25, 94.0, 0.22131814483319773, 0.4128992066720911, 0.2553333502847844], "isController": false}, {"data": ["03_MainPage_nowosci", 26, 0, 0.0, 92.76923076923077, 80, 152, 86.0, 144.3, 149.54999999999998, 152.0, 0.17755318059207156, 10.140117895738724, 0.21126454356881894], "isController": false}, {"data": ["01_resultPage_limit_75", 32, 32, 100.0, 6490.0625, 5093, 18184, 5740.5, 6293.9, 18110.55, 18184.0, 0.215451944117152, 12.849754355327386, 0.28212316950008415], "isController": false}, {"data": ["05_Category_itemsLimitUp", 22, 0, 0.0, 78.31818181818181, 60, 88, 83.5, 87.7, 88.0, 88.0, 0.15660257824790189, 8.971872097068685, 0.2106571613647203], "isController": false}, {"data": ["03_AddProduct_to_cart-1", 25, 0, 0.0, 349.56, 311, 393, 354.0, 383.8, 392.4, 393.0, 0.1940722569827198, 2.7737625710304457, 0.24585770961744474], "isController": false}, {"data": ["MainPage", 129, 0, 0.0, 103.82170542635656, 66, 249, 84.0, 145.0, 147.5, 229.79999999999927, 0.792914174723863, 31.84234463261643, 0.9196882433570388], "isController": false}, {"data": ["03_AddProduct_to_cart-0", 25, 0, 0.0, 159.88000000000005, 125, 311, 146.0, 209.8, 280.99999999999994, 311.0, 0.194325689856199, 0.41891608773804895, 0.3827305188495919], "isController": false}, {"data": ["04_Remove Product from Cart", 20, 0, 0.0, 464.59999999999997, 397, 617, 462.0, 506.90000000000003, 611.5999999999999, 617.0, 0.15443538423523598, 2.590155878389857, 0.47062071924419324], "isController": false}, {"data": ["04_CheckoutPage_login", 19, 0, 0.0, 472.57894736842104, 427, 662, 461.0, 498.0, 662.0, 662.0, 0.14764161939544643, 2.2990841605796875, 0.4236576875631362], "isController": false}, {"data": ["04_Choose Size", 20, 0, 0.0, 129.54999999999998, 100, 232, 122.5, 175.40000000000006, 229.29999999999995, 232.0, 0.15585913451422603, 0.17706145623085856, 0.18324102738444994], "isController": false}, {"data": ["02_Change_Color_of_Product", 27, 0, 0.0, 55.14814814814815, 52, 65, 55.0, 58.2, 62.59999999999999, 65.0, 0.16878797729489137, 6.562420148048936, 0.21630843502288016], "isController": false}, {"data": ["01_butytrekkingowe_resultsPage", 34, 34, 100.0, 5303.2941176470595, 3979, 14933, 4617.0, 6391.5, 14843.0, 14933.0, 0.2149151085321298, 11.340358420326545, 0.2668352308283081], "isController": false}, {"data": ["04_CategoryPage", 20, 0, 0.0, 70.39999999999999, 52, 88, 69.0, 87.7, 88.0, 88.0, 0.15572564256293264, 8.800962433135302, 0.17061386561655673], "isController": false}, {"data": ["03_ProductList_headlight_sorting_price", 25, 0, 0.0, 57.31999999999999, 38, 139, 55.0, 66.20000000000003, 119.49999999999996, 139.0, 0.19452982142162392, 7.38027905302883, 0.23943885441388169], "isController": false}, {"data": ["03_ProductType_headlight", 25, 0, 0.0, 60.519999999999996, 54, 134, 57.0, 67.00000000000003, 115.69999999999996, 134.0, 0.19454798720652436, 7.343175779456511, 0.23186168319027575], "isController": false}, {"data": ["04_CheckoutPage_login-0", 19, 0, 0.0, 126.84210526315789, 100, 172, 120.0, 165.0, 172.0, 172.0, 0.14804887171175665, 0.17100649126122053, 0.21248543861426253], "isController": false}, {"data": ["02_OutletCard", 27, 0, 0.0, 195.11111111111114, 180, 215, 195.0, 207.2, 213.79999999999998, 215.0, 0.16991497957873672, 11.650693052522609, 0.3968738986992065], "isController": false}, {"data": ["02_AddToCart-1", 26, 0, 0.0, 343.88461538461536, 304, 384, 346.0, 368.0, 380.84999999999997, 384.0, 0.1768021923471851, 2.527612592396146, 0.2263086656024535], "isController": false}, {"data": ["02_AddToCart-0", 26, 0, 0.0, 154.46153846153848, 125, 261, 148.0, 192.1, 238.5999999999999, 261.0, 0.17698994560962827, 0.38267826844269265, 0.382279402880171], "isController": false}, {"data": ["04_CheckoutPage_login-1", 19, 0, 0.0, 345.42105263157885, 305, 519, 333.0, 366.0, 519.0, 519.0, 0.14783921318414542, 2.131396781481971, 0.21204015439471513], "isController": false}, {"data": ["05_Category_2ndPage", 22, 0, 0.0, 56.09090909090909, 51, 77, 55.0, 58.0, 74.14999999999996, 77.0, 0.1571540824344596, 5.666601743874562, 0.2086365543967426], "isController": false}, {"data": ["04_Add to Cart2", 20, 0, 0.0, 482.75, 452, 567, 470.0, 524.1, 564.9, 567.0, 0.1551024839662807, 2.5572597777575283, 0.530362644148371], "isController": false}, {"data": ["05_categoryPage", 22, 0, 0.0, 83.68181818181819, 79, 87, 84.0, 87.0, 87.0, 87.0, 0.1571271444284143, 8.946245442420043, 0.20952145856842885], "isController": false}, {"data": ["04_Remove Product from Cart-0", 20, 0, 0.0, 110.50000000000001, 91, 127, 110.0, 125.9, 126.95, 127.0, 0.15483711135885048, 0.3642149903613898, 0.23312511370850364], "isController": false}, {"data": ["04_Choose Size2", 20, 0, 0.0, 120.45, 101, 147, 118.0, 137.70000000000002, 146.54999999999998, 147.0, 0.15491266798342435, 0.17596354469230474, 0.195872243038612], "isController": false}, {"data": ["04_Add to Cart2-1", 20, 0, 0.0, 337.40000000000003, 300, 374, 339.0, 362.90000000000003, 373.5, 374.0, 0.1552843256001739, 2.2196787337145567, 0.19983000005823162], "isController": false}, {"data": ["04_Add to Cart2-0", 20, 0, 0.0, 145.0, 115, 231, 140.5, 163.3, 227.64999999999995, 231.0, 0.15552704226447375, 0.3411115080290836, 0.331672049360395], "isController": false}, {"data": ["02_ProductDetails", 27, 0, 0.0, 56.92592592592593, 52, 77, 54.0, 71.2, 74.99999999999999, 77.0, 0.16945748499987445, 6.580329320224437, 0.21021603083498608], "isController": false}, {"data": ["01_resultsPage_2ndpage", 33, 33, 100.0, 6241.939393939395, 5142, 16737, 5745.0, 7212.2, 10593.799999999976, 16737.0, 0.21033979437691616, 11.650441852997979, 0.2741662696237467], "isController": false}, {"data": ["04_Remove Product from Cart-1", 20, 0, 0.0, 353.79999999999995, 302, 491, 349.5, 396.20000000000005, 486.3999999999999, 491.0, 0.15455592219654876, 2.2286239499857037, 0.23828629117949354], "isController": false}, {"data": ["03_AddProduct_to_cart", 25, 0, 0.0, 509.92, 444, 665, 502.0, 576.6, 639.1999999999999, 665.0, 0.1937849297335845, 3.1874063170980325, 0.627159188021766], "isController": false}, {"data": ["04_Add to Cart-1", 20, 0, 0.0, 351.35, 294, 520, 347.0, 389.20000000000005, 513.5999999999999, 520.0, 0.15500511516880058, 2.2152259344870884, 0.18781503578680597], "isController": false}, {"data": ["04_Add to Cart-0", 20, 0, 0.0, 154.54999999999995, 116, 424, 141.5, 159.90000000000003, 410.8499999999998, 424.0, 0.15520599715973024, 0.3274937481084269, 0.3224162081622834], "isController": false}, {"data": ["04_Cart Checkout", 39, 0, 0.0, 350.05128205128204, 307, 435, 350.0, 377.0, 387.0, 435.0, 0.2952666484964114, 4.256760849156597, 0.4067901392295812], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 5,552 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,612 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,442 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,798 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,434 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,550 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,382 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,619 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 18,071 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,184 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,618 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,136 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,406 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,624 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,398 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,901 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,719 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,556 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,161 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,353 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 7,961 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,265 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,323 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,036 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 14,933 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,484 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,341 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,489 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,142 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,739 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 7,283 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,825 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 2.0202020202020203, 0.176522506619594], "isController": false}, {"data": ["The operation lasted too long: It took 4,604 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,664 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,830 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,840 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 2.0202020202020203, 0.176522506619594], "isController": false}, {"data": ["The operation lasted too long: It took 5,862 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,996 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,354 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,255 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,436 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,516 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,673 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,742 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,736 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,745 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,298 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,571 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,517 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,685 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,406 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,735 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,093 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 7,106 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,615 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,572 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 18,184 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,507 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,680 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,668 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,615 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,755 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,168 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,692 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,082 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,467 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,073 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,722 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,004 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,679 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,915 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,234 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,252 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,074 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,180 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,376 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,696 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,819 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, 2.0202020202020203, 0.176522506619594], "isController": false}, {"data": ["The operation lasted too long: It took 5,835 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,376 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,553 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,211 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,962 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 6,726 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 16,737 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,912 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,898 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,556 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,662 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,657 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 5,584 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,653 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,359 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 14,813 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 3,979 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}, {"data": ["The operation lasted too long: It took 4,991 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 1.0101010101010102, 0.088261253309797], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1133, 99, "The operation lasted too long: It took 5,819 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 5,825 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 5,840 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 2, "The operation lasted too long: It took 5,552 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,742 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01_resultPage_limit_75", 32, 32, "The operation lasted too long: It took 5,552 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,742 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,074 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,484 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,180 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01_butytrekkingowe_resultsPage", 34, 34, "The operation lasted too long: It took 4,915 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,234 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,736 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,323 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,442 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01_resultsPage_2ndpage", 33, 33, "The operation lasted too long: It took 7,961 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,612 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,745 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 6,252 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 5,265 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
