function showLevelWindow(ctrlId){
    $.ajax({
        type:'GET',
        //url: '../app/core/Routes.php/',
        url: '../app/ajax/ajaxroutes.php/',
        data: { elemid: ctrlId, elemtype : 'tanks' },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            //showLevelWindowContent(data);
            //console.log(data.data[0].trenddata);
            showLevelTrendWindowContent(data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showLevelTrendWindowContent(data){
    let indata = data.data;
    let chartdata = data.data[0].trenddata;
    let chartdatalen = 5;
    $('#leveltrendwindowcontent').empty();
    $('#leveltrendwindowtitle').text(indata.fulltitle);
    let percLevel = Math.round(indata.level*10000 / indata.maxlevel)/100;
    let percVol = Math.round(indata.vol*10000 / indata.maxvol)/100;
    let percwatlev = Math.round(indata.water_lev*10000 / indata.maxlevel)/100;
    let IncomeOutcome = '';
    if(indata.delta > indata.dead_zone){
        IncomeOutcome = 'Приток';
    }
    else if(indata.delta < (indata.dead_zone * -1)){
        IncomeOutcome = 'Отток';
    }
    let content = '<p>Текущие параметры:</p>';
    content += '<table class="table table-sm" style="width:100%; font-size:0.95em" cellpadding="0" cellspacing="0">';
        content += '<tr><td class="text-left">ID резервуара</td><td class="text-right">'+ indata.web_name +'</td><td></td></tr>';
        content += '<tr><td class="text-left">Тип топлива</td><td class="text-right">'+ indata.fueltype +'</td><td></td></tr>';    
        content += '<tr><td class="text-left">Уровень, см</td><td class="text-right">'+ indata.level + '</td>'+'<td><i class="small text-left text-black-50"> ~'+percLevel+'%</i>'+'</td></tr>';
        content += '<tr><td class="text-left">Объем, л</td><td class="text-right">'+ indata.vol + '</td>'+'<td><i class="small text-left text-black-50"> ~'+percVol+'%</i>'+'</td></tr>';
        content += '<tr><td class="text-left">Фиск. объем <small class="text-black-50">(15°C)</small>, л</td><td class="text-right">'+ indata.vol15 +'</td><td></td></tr>';    
        content += '<tr><td class="text-left">Температура, °C</td><td class="text-right">'+ indata.temp +'</td><td></td></tr>';  
        content += '<tr><td class="text-left">Плотность, т/м3</td><td class="text-right">'+ indata.dens +'</td><td></td></tr>'; 
        content += '<tr><td class="text-left">Масса, кг</td><td class="text-right">'+ indata.mass +'</td><td></td></tr>';
        content += '<tr><td class="text-left">Уров. воды, см</td><td class="text-right">'+ indata.water_lev +'</td><td><i class="small text-left text-black-50"> ~'+percwatlev+'%</i>'+'</td></tr>';
        content += '<tr><td class="text-left">Об-м воды, л</td><td class="text-right">'+ indata.water_vol +'</td><td></td></tr>';
        content += '<tr><td class="text-left">Порог измен.об., л</td><td class="text-right">'+ indata.dead_zone +'</td><td></td></tr>';
        content += '<tr><td class="text-left">Изменение об., л</td><td class="text-right">'+ indata.delta +'</td><td><i class="small text-left text-danger">'+IncomeOutcome+'</i></td></tr>';                   
        content += '<tr><td class="text-left small text-black-50"><i>Дата</i></td><td class="text-right small text-black-50"><i>'+ moment(indata.date).format('DD.MM.YYYY HH:mm:ss') +'</i></td><td></td></tr>';
    content += '</table>';
    if(indata.hi_water_al != 0){
        content += '<p class="text-danger mt-2"><small><b>Аварийно высокий уровень воды</b></small></p>';
    }
    if(indata.hi_prod_al != 0){
        content += '<p class="text-danger mt-2"><small><b>Аварийно высокий уровень топлива</b></small></p>';
    }
    if(indata.low_prod_al != 0){
        content += '<p class="text-danger mt-2"><small><b>Аварийно низкий уровень топлива</b></small></p>';
    }
    if(indata.tank_status == 3){
        content += '<p class="text-danger mt-2"><small><b>Ошибка датчика уровня</b></small></p>';
    }                       
    $('#leveltrendwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-outline-info mt-1 mb-2" style="width:25%" type="button" data-dismiss="modal" aria-label="Close" onclick="window.location.reload()">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    let chartElem = document.getElementById('leveltrendwindowgraph');
    let enExport = false;
    createStockChart(chartElem , chartdata, chartdatalen, enExport);
    $("#clsctrlwind").bind("click",function(elem){
        window.location.reload();
    });
    $('#leveltrendwindow').modal("show");
}


// ----------- draw chart graph (modal + trend page) -----

function createStockChart(elem, chartData, datalen, enExport, sTitle) {
    //AmCharts.clear();
    AmCharts.charts = [];
    var chart = new AmCharts.AmStockChart();
    var col = ["#17A2B8","#2CA02C","#D62728","#9467BD","#FF00DC","#FF7F0E","#FFD200","#9B3B00","#000000","#9B3B00"];
    var lineType = ["line", "smoothedLine", "step", "column", "candlestick", "ohlc"];
    var lineTitles = ["","Объем", "Уровень", "Масса", "Плотность", "Температура", ""];
    var lineEU = ["","л", "см", "кг", "кг/м3", "°C", ""];

    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.minPeriod = "mm";
        categoryAxesSettings.equalSpacing = true;
        categoryAxesSettings.parseDates = true;
        //categoryAxesSettings.groupToPeriods = ["6hh","DD"];
        categoryAxesSettings.dateFormats = [
            {period:"MM", format:"DD MMM YYYY"},
            {period:"WW", format:"DD MMM"},
            {period:"DD", format:"DD MMM"},
            {period:"hh", format:"DD.MM JJ:NN"},
            {period:"mm", format:"JJ:NN:SS"},
            {period:"ss", format:"JJ:NN:SS"},       
        ];
    chart.categoryAxesSettings = categoryAxesSettings;

    var valueAxesSettings = new AmCharts.ValueAxesSettings();
        valueAxesSettings.minimum = -20.0;
        // valueAxesSettings.maximum = maxval; // 100
    chart.valueAxesSettings = valueAxesSettings;
    var dataSet = new AmCharts.DataSet();
        dataSet.dataProvider = chartData;
        dataSet.categoryField = "date";
        dataSet.fieldMappings = [
            { fromField: "prod_vol", toField: "value1" },
            { fromField: "prod_lev", toField: "value2" },
            { fromField: "mass", toField: "value3" },
            { fromField: "dens", toField: "value4" },
            { fromField: "temp", toField: "value5" },
        ];
    chart.dataSets = [dataSet];
    var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = true;
        stockPanel1.title = sTitle;
        stockPanel1.percentHeight = 100;//70
        stockPanel1.prefixesOfBigNumbers = [ { "number":1e+6, "prefix":"M" } ];
    var graph = [];
    for(var i=1; i <=datalen; i++){
        graph[i] = new AmCharts.StockGraph();
        graph[i].title = lineTitles[i] + "," +lineEU[i];
        graph[i].balloonText = "[[value]]"+lineEU[i];
        graph[i].useDataSetColors = false;
        graph[i].lineColor = col[i];
        graph[i].valueField = "value" + parseInt(i);
        graph[i].type = lineType[1]; // 0 - line, 1 - smoothedline, 2 - step, 3 - column,  4 - candlestick, 5 - ohlc
        graph[i].lineThickness = 2;
        graph[i].bullet = "round";
        graph[i].noStepRisers = true;
        graph[i].bulletSize = 4;
        graph[i].bulletBorderColor = "white";
        graph[i].bulletBorderAlpha = 1;
        graph[i].bulletBorderThickness = 1;
        graph[i].id = parseInt(i);
        graph[i].fillAlphas = 0.0;   // 0.1
        stockPanel1.addStockGraph(graph[i]);
    }
    var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.valueTextRegular = " ";
        stockPanel1.stockLegend = stockLegend1;
        chart.panels = [stockPanel1];
    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph[1];
        scrollbarSettings.usePeriod = "hh";//10mm
        scrollbarSettings.updateOnReleaseOnly = false;
        scrollbarSettings.position = "bottom";
        scrollbarSettings.graphType = lineType[1];
        scrollbarSettings.autoGridCount = true;

        chart.chartScrollbarSettings = scrollbarSettings;

    var cursorSettings = new AmCharts.ChartCursorSettings();
        //cursorSettings.showNextAvailable = true;
        cursorSettings.cursorColor = "#17A2B8";
        cursorSettings.valueLineEnabled = false; // true
        cursorSettings.valueLineAlpha = 0.5;
        cursorSettings.categoryBalloonEnabled = true;
        cursorSettings.categoryBalloonDateFormats = [
            //{period:"YYYY", format:"YYYY"},
            //{period:"MM", format:"DD MMM YYYY JJ:NN:SS"},
            //{period:"WW", format:"DD MMM JJ:NN:SS"},
            {period:"DD", format:"DD MMM JJ:NN:SS"},
            {period:"hh", format:"DD.MM.YYYY JJ:NN:SS"},
            {period:"ss", format:"DD.MM.YYYY JJ:NN:SS"}
            //{period:"ss", format:"DD MMM JJ:NN:SS"},
            //{period:"fff", format:"DD MMM JJ:NN:SS"}
        ]; // "fff"-milliseconds
        
        cursorSettings.valueBalloonsEnabled = true;
        //cursorSettings.fullWidth = true;
        cursorSettings.cursorAlpha = 0.1;
    chart.chartCursorSettings = cursorSettings;

    var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.position = "bottom";
        periodSelector.dateFormat = "YYYY-MM-DD JJ:NN:SS";
        periodSelector.inputFieldWidth = 120;
        periodSelector.inputFieldsEnabled = false;
        periodSelector.periods = [
            { period: "hh", selected: true, count: 1, label: "1 час" },
            { period: "DD", count: 1, label: "1 день" },
            { period: "DD", count: 5, label: "5 дней" },
            { period: "MM", count: 1, label: "1 месяц" },
            { period: "YYYY", count: 1, label: "1 год" },
            { period: "MAX", label: "Все" }
        ];

    chart.periodSelector = periodSelector;
    chart.dataDateFormat = "YYYY-MM-DD JJ:NN:SS";
    var panelsSettings = new AmCharts.PanelsSettings();
        panelsSettings.mouseWheelZoomEnabled = false;
        panelsSettings.usePrefixes = true;
    chart.panelsSettings = panelsSettings;

    if(enExport){
        chart["export"] = {
            "enabled": true,
            "divId": 'exportdiv',
        };
    }

    chart.write(elem.id);
    chart.validateNow();

    //$(elem.id).fadeIn(1000);
    $('a[href="http://www.amcharts.com"]').css('display','none');
}