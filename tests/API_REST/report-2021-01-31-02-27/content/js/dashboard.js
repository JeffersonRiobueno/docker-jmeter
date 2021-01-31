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
    cell.colSpan = 6;
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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8589743589743589, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "SeparateStock"], "isController": false}, {"data": [1.0, 500, 1500, "ConfigValuesDocumentTypeList"], "isController": false}, {"data": [0.5, 500, 1500, "productSearch"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Category"], "isController": false}, {"data": [1.0, 500, 1500, "ConfigValues"], "isController": false}, {"data": [1.0, 500, 1500, "RelationShipList"], "isController": false}, {"data": [1.0, 500, 1500, "OrderDetail"], "isController": false}, {"data": [1.0, 500, 1500, "User\/Update"], "isController": false}, {"data": [1.0, 500, 1500, "User\/Detail"], "isController": false}, {"data": [1.0, 500, 1500, "SubCategory"], "isController": false}, {"data": [1.0, 500, 1500, "StoreList"], "isController": false}, {"data": [1.0, 500, 1500, "OrderList"], "isController": false}, {"data": [0.0, 500, 1500, "productList"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39, 0, 0.0, 353.5641025641026, 92, 1863, 1003.0, 1684.0, 1863.0, 7.43281875357347, 12.778507361349343, 2.0541872141223556], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["SeparateStock", 3, 0, 0.0, 348.6666666666667, 316, 412, 412.0, 412.0, 412.0, 2.640845070422535, 0.7143692231514085, 1.3075277838908452], "isController": false}, {"data": ["ConfigValuesDocumentTypeList", 3, 0, 0.0, 98.33333333333333, 95, 101, 101.0, 101.0, 101.0, 9.202453987730062, 4.915763995398772, 2.381494440184049], "isController": false}, {"data": ["productSearch", 3, 0, 0.0, 800.3333333333334, 652, 1003, 1003.0, 1003.0, 1003.0, 2.6019080659150045, 12.038906656548136, 0.9452244145706852], "isController": false}, {"data": ["Category", 3, 0, 0.0, 614.0, 474, 795, 795.0, 795.0, 795.0, 2.9182879377431905, 3.707707624027237, 0.5272297543774319], "isController": false}, {"data": ["ConfigValues", 3, 0, 0.0, 127.66666666666667, 112, 151, 151.0, 151.0, 151.0, 8.426966292134832, 12.105534585674159, 1.3907786165730338], "isController": false}, {"data": ["RelationShipList", 3, 0, 0.0, 93.0, 92, 94, 94.0, 94.0, 94.0, 9.345794392523365, 12.531030957943925, 1.49678738317757], "isController": false}, {"data": ["OrderDetail", 3, 0, 0.0, 130.0, 100, 188, 188.0, 188.0, 188.0, 4.552352048558422, 2.889676593323217, 1.0891857928679818], "isController": false}, {"data": ["User\/Update", 3, 0, 0.0, 135.33333333333334, 104, 191, 191.0, 191.0, 191.0, 3.592814371257485, 2.108673278443114, 1.6139595808383234], "isController": false}, {"data": ["User\/Detail", 3, 0, 0.0, 134.66666666666666, 105, 193, 193.0, 193.0, 193.0, 4.0, 2.2265625, 1.12890625], "isController": false}, {"data": ["SubCategory", 3, 0, 0.0, 109.0, 103, 117, 117.0, 117.0, 117.0, 8.620689655172413, 12.888941271551724, 1.5069369612068966], "isController": false}, {"data": ["StoreList", 3, 0, 0.0, 95.66666666666667, 94, 99, 99.0, 99.0, 99.0, 9.11854103343465, 9.332256838905774, 1.5939637158054711], "isController": false}, {"data": ["OrderList", 3, 0, 0.0, 172.0, 131, 254, 254.0, 254.0, 254.0, 4.777070063694267, 9.843376791401274, 1.3108952030254777], "isController": false}, {"data": ["productList", 3, 0, 0.0, 1737.6666666666667, 1666, 1863, 1863.0, 1863.0, 1863.0, 1.4347202295552368, 9.343895713773314, 0.5380200860832137], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
