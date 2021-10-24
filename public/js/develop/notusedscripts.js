    // ******* SIMPLE *******
    /*
    function showLevelWindowContent(data){
        let indata = data.data;
        $('#ctrlwindowcontent').empty();
        $('#ctrlwindowtitle').text(indata.fulltitle);
        let percLevel = Math.round(indata.level*10000 / indata.maxlevel)/100;
        let percVol = Math.round(indata.vol*10000 / indata.maxvol)/100;
        let content = '';
        content += '<table class="table table-sm" style="width:100%">';
            content += '<tr><td class="text-left">ID резервуара</td><td class="text-right">'+ indata.web_name +'</td><td></td></tr>';
            content += '<tr><td class="text-left">Тип топлива</td><td class="text-right">'+ indata.fueltype +'</td><td></td></tr>';    
            content += '<tr><td class="text-left">Уровень, см</td><td class="text-right">'+ indata.level + '</td>'+'<td><i class="small text-left text-black-50"> ~'+percLevel+'%</i>'+'</td></tr>';
            content += '<tr><td class="text-left">Объем, л</td><td class="text-right">'+ indata.vol + '</td>'+'<td><i class="small text-left text-black-50"> ~'+percVol+'%</i>'+'</td></tr>';
            content += '<tr><td class="text-left">Фиск. Объем (при 15°C), л</td><td class="text-right">'+ indata.vol15 +'</td><td></td></tr>';    
            content += '<tr><td class="text-left">Температура, °C</td><td class="text-right">'+ indata.temp +'</td><td></td></tr>';  
            content += '<tr><td class="text-left">Плотность, кг/м3</td><td class="text-right">'+ indata.dens +'</td><td></td></tr>'; 
            content += '<tr><td class="text-left">Масса, кг</td><td class="text-right">'+ indata.mass +'</td><td></td></tr>';
            content += '<tr><td class="text-left small text-black-50"><i>Дата измерения</i></td><td class="text-right small text-black-50"><i>'+ moment(indata.date).format('DD.MM.YYYY HH:mm:ss') +'</i></td><td></td></tr>';               
        content += '</table>';
        $('#ctrlwindowcontent').append(content);
        $('.modal-bottom').empty();
        let bottom = '<button class="btn btn-outline-info mt-1 mb-2" style="width:45%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>';
        $('.modal-bottom').append(bottom);        
        $('#ctrlwindow').modal("show");
    }

    function showMeterWindowContent(data){
        let indata = data.data;
        $('#ctrlwindowcontent').empty();
        $('#ctrlwindowtitle').text(indata.fulltitle);
        let content = '';
        content += '<table class="table table-sm" style="width:100%">';
            content += '<tr><td class="text-left">ID устройства</td><td class="text-right">'+ indata.web_name +'</td></tr>';
            content += '<tr><td class="text-left">Текущий объем, л</td><td class="text-right">'+ indata.vol +'</td></tr>'; 
            if(indata.mass != -1.0)
                content += '<tr><td class="text-left">Текущая масса, кг</td><td class="text-right">'+ indata.mass + '</td></tr>';  
            content += '<tr><td class="text-left">Суточный объем, л</td><td class="text-right">'+ indata.dailyvol + '</td></tr>'; 
            if(indata.dailymass != -1.0)
                content += '<tr><td class="text-left">Суточная масса, кг</td><td class="text-right">'+ indata.dailymass + '</td></tr>';                                   
            content += '<tr><td class="text-left">Суммарный объем, л</td><td class="text-right">'+ indata.sumvol + '</td></tr>';
            if(indata.summass != -1.0)
                content += '<tr><td class="text-left">Суммарная масса, кг</td><td class="text-right">'+ indata.summass + '</td></tr>';
            if(indata.temp != -1.0)   
                content += '<tr><td class="text-left">Температура, °C</td><td class="text-right">'+ indata.temp +'</td><td></td></tr>'; 
            if(indata.dens != -1.0)              
                content += '<tr><td class="text-left">Плотность, кг/м3</td><td class="text-right">'+ indata.dens +'</td><td></td></tr>'; 
            content += '<tr><td class="text-left">Последний транспорт</td><td class="text-right">'+ indata.trans + '</td></tr>';            
            content += '<tr><td class="text-left small text-black-50"><i>Дата измерения</i></td><td class="text-right small text-black-50"><i>'+ moment(indata.date).format('DD.MM.YYYY HH:mm:ss') +'</i></td></tr>';               
        content += '</table>';
        $('#ctrlwindowcontent').append(content);
        $('.modal-bottom').empty();
        let bottom = '<button class="btn btn-outline-info mt-1 mb-2" style="width:45%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>';
        $('.modal-bottom').append(bottom);        
        $('#ctrlwindow').modal("show");
    }
    */

    /*
var singleLineColor = ["#17A2B8","#2CA02C","#D62728","#9467BD","#FF00DC","#FF7F0E","#FFD200","#9B3B00","#000000","#9B3B00"];
var singleLineType = ["line", "smoothedLine", "step", "column", "candlestick", "ohlc"];

//elem, chartData, datalen, sGraphTitle, type, maxval, colorNum
function createSingleChart(elem, data, datalen, title, type, maxVal, color) {

	var chart = new AmCharts.AmStockChart();

		chart["export"] = {
		  "enabled": true
		};
		
		var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
		categoryAxesSettings.minPeriod = "ss";
		chart.categoryAxesSettings = categoryAxesSettings;

		var valueAxesSettings = new AmCharts.ValueAxesSettings();
		valueAxesSettings.minimum = 0;
		valueAxesSettings.maximum = maxVal;
		chart.valueAxesSettings = valueAxesSettings;


		var dataSet = new AmCharts.DataSet();

		dataSet.dataProvider = data;
		dataSet.categoryField = "date";
				
		dataSet.fieldMappings = [
			{fromField: "value", toField: "value1"}
		];
				
		chart.dataSets = [dataSet];
		
		var stockPanel1 = new AmCharts.StockPanel();
			stockPanel1.showCategoryAxis = true;
		//	stockPanel1.title = "Температура,°C";
			stockPanel1.percentHeight = 70;
				
		var graph = [];

		for(var i=1; i <= datalen; i++){
            graph[i] = new AmCharts.StockGraph();
            graph[i].title = title;
            graph[i].balloonText = "[[value]]";
            graph[i].useDataSetColors = false;
            graph[i].lineColor = singleLineColor[color];
            graph[i].valueField = "value" + parseInt(i);;
            graph[i].type = singleLineType[type]; // 0 - line, 1 - smoothedLine, 2 - column, 3 - step, 4 - candlestick, 5 - ohlc
            graph[i].lineThickness = 3;
            graph[i].fillAlphas = 0.2;
            graph[i].bullet = "round";
            graph[i].bulletSize = 6;
            graph[i].bulletBorderColor = "white";
            graph[i].bulletBorderAlpha = 2;
            graph[i].bulletBorderThickness = 0;
            graph[i].id = parseInt(i);
            if(type==2){
                graph[i].stepDirection = "left";
            }
            stockPanel1.addStockGraph(graph[i]);
		}
	
		var stockLegend1 = new AmCharts.StockLegend();
			stockLegend1.valueTextRegular = " ";				
			stockPanel1.stockLegend = stockLegend1;	
				
			chart.panels = [stockPanel1];

		var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
			scrollbarSettings.graph = graph[1];
			scrollbarSettings.usePeriod = "10mm";
			scrollbarSettings.updateOnReleaseOnly = false;
			scrollbarSettings.position = "bottom";
			
			chart.chartScrollbarSettings = scrollbarSettings;

		var cursorSettings = new AmCharts.ChartCursorSettings();
			cursorSettings.showNextAvailable = true;
			cursorSettings.cursorColor = singleLineColor[color];
			cursorSettings.valueLineEnabled = false;// true for value hor line
			cursorSettings.valueLineAlpha = 0.5;
			cursorSettings.categoryBalloonDateFormats = [
				{period:"YYYY", format:"YYYY"},
				{period:"MM", format:"MMM, YYYY"},
				{period:"WW", format:"DD MMM YYYY"},
				{period:"DD", format:"DD MMM YYYY"},
				{period:"hh", format:"DD MMM, JJ:NN:SS"},
				{period:"mm", format:"DD MMM, JJ:NN:SS"},
				{period:"ss", format:"DD MMM, JJ:NN:SS"},
				{period:"fff", format:"JJ:NN:SS"}]; // "fff"-milliseconds
			cursorSettings.valueBalloonsEnabled = true;
			cursorSettings.fullWidth = true;
			cursorSettings.cursorAlpha = 0.1;
			
			chart.chartCursorSettings = cursorSettings;

            var periodSelector = new AmCharts.PeriodSelector();
            periodSelector.position = "bottom";
            periodSelector.dateFormat = "YYYY-MM-DD JJ:NN:SS";
            periodSelector.inputFieldWidth = 120;
            periodSelector.inputFieldsEnabled = false;
            periodSelector.periods = [
                { period: "DD", count: 1, label: "1 день" },
                { period: "DD", selected: true, count: 5, label: "5 дней" },
                { period: "MM", count: 1, label: "1 месяц" },
                { period: "YYYY", count: 1, label: "1 год" },
                { period: "MAX", label: "Все" }
            ];
        chart.periodSelector = periodSelector;

		var panelsSettings = new AmCharts.PanelsSettings();
			panelsSettings.mouseWheelZoomEnabled = true;
				
			panelsSettings.usePrefixes = true;
			chart.panelsSettings = panelsSettings;
        chart.write(elem);
}

//elem, chartData, datalen, sGraphTitle, type, maxval, colorNum
function createStepChart(elem, data, datalen, title, type, maxVal, color) {

	var chart = new AmCharts.AmStockChart();

		chart["export"] = {
		  "enabled": false
		};
		
		var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
		categoryAxesSettings.minPeriod = "ss";
		chart.categoryAxesSettings = categoryAxesSettings;

		var valueAxesSettings = new AmCharts.ValueAxesSettings();
		valueAxesSettings.minimum = 0;
		valueAxesSettings.maximum = maxVal;
		chart.valueAxesSettings = valueAxesSettings;


		var dataSet = new AmCharts.DataSet();

		dataSet.dataProvider = data;
		dataSet.categoryField = "date";
				
		dataSet.fieldMappings = [
			{fromField: "value", toField: "value1"}
		];
				
		chart.dataSets = [dataSet];
		
		var stockPanel1 = new AmCharts.StockPanel();
			stockPanel1.showCategoryAxis = true;
		//	stockPanel1.title = "Температура,°C";
			stockPanel1.percentHeight = 70;
				
		var graph = [];

		for(var i=1; i <= datalen; i++){
            graph[i] = new AmCharts.StockGraph();
            graph[i].title = title;
            graph[i].balloonText = "[[value]]";
            graph[i].useDataSetColors = false;
            graph[i].lineColor = singleLineColor[color];
            graph[i].valueField = "value" + parseInt(i);;
            graph[i].type = singleLineType[type]; // 0 - line, 1 - smoothedLine, 2 - column, 3 - step, 4 - candlestick, 5 - ohlc
            graph[i].lineThickness = 3;
            graph[i].fillAlphas = 0.2;
            graph[i].bullet = "round";
            graph[i].bulletSize = 6;
            graph[i].bulletBorderColor = "white";
            graph[i].bulletBorderAlpha = 2;
            graph[i].bulletBorderThickness = 0;
            graph[i].id = parseInt(i);
            if(type==2){
                graph[i].stepDirection = "left";
            }
            stockPanel1.addStockGraph(graph[i]);
		}
	
		var stockLegend1 = new AmCharts.StockLegend();
			stockLegend1.valueTextRegular = " ";				
			stockPanel1.stockLegend = stockLegend1;	
				
			chart.panels = [stockPanel1];

		var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
			scrollbarSettings.graph = graph[1];
			scrollbarSettings.usePeriod = "10mm";
			scrollbarSettings.updateOnReleaseOnly = false;
			scrollbarSettings.position = "bottom";
			
			chart.chartScrollbarSettings = scrollbarSettings;

		var cursorSettings = new AmCharts.ChartCursorSettings();
			cursorSettings.showNextAvailable = true;
			cursorSettings.cursorColor = singleLineColor[color];
			cursorSettings.valueLineEnabled = false;// true for value hor line
			cursorSettings.valueLineAlpha = 0.5;
			cursorSettings.categoryBalloonDateFormats = [
				{period:"YYYY", format:"YYYY"},
				{period:"MM", format:"MMM, YYYY"},
				{period:"WW", format:"DD MMM YYYY"},
				{period:"DD", format:"DD MMM YYYY"},
				{period:"hh", format:"DD MMM, JJ:NN:SS"},
				{period:"mm", format:"DD MMM, JJ:NN:SS"},
				{period:"ss", format:"DD MMM, JJ:NN:SS"},
				{period:"fff", format:"JJ:NN:SS"}]; // "fff"-milliseconds
			cursorSettings.valueBalloonsEnabled = true;
			cursorSettings.fullWidth = true;
			cursorSettings.cursorAlpha = 0.1;
			
			chart.chartCursorSettings = cursorSettings;

		var panelsSettings = new AmCharts.PanelsSettings();
			panelsSettings.mouseWheelZoomEnabled = true;
				
			panelsSettings.usePrefixes = true;
			chart.panelsSettings = panelsSettings;
        chart.write(elem);
}
*/