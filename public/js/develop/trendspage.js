$(document).ready(function(){
    $('#pagetitle').text('Участки');

    $('input[type=radio][name=rdtank]').change(function() {
        getChartData(this.id, this.value);
    });

    getChartData('R22','Резервуар P22');


});


function getChartData(elemId, sTitle){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { tankid: elemId},
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            (data.data != null) ? makeBigChart(data.data, sTitle) : swal("Нет данных", "Извините.\nНе могу получить данные\nРезервуар id=" + elemId + ".", "warning");
        },
        error: function(err){
            console.log(err);
        }
    });
}

function makeBigChart(data, sTitle){
    let chartElem = document.getElementById('maintrends');
    let enExport = true;
    let chartdata = data;
    let chartdatalen = 5;
    createStockChart(chartElem , chartdata, chartdatalen, enExport, sTitle);
}